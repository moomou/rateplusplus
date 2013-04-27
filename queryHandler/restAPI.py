#RestFramework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status

#App Stuff
from queryHandler.models import *
from queryHandler.serializers import *

#Django
from django.http import Http404

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import permission_required 
from django.utils.decorators import method_decorator

from queryHandler import tasks
from django.db.models import Q

#Python
import itertools
import operator, json
import rredis
import random

#RESTful API
class Autocomplete(APIView):
    def get(self, request, format=None):
        reqType = request.path_info

        if 'term' in request.GET:
            word = request.GET['term']
            aeType = None
        else:
            return Response([])

        if word[0].isalnum():
            if reqType.find( "cat") >= 0:
                aeType = "$"
            else:
                aeType = "#"
        else:
            aeType = word[0]
            word = word[1:]

        tags = [tag.name[1:] for tag in Entity.tags.filter(name__startswith=aeType).filter(name__contains=word)]

        return Response(tags)

class TagsDetail(APIView):
    def get(self, request, format=None):
        tags = [tag.name for tag in Entity.tags.most_common()]
        tags = tags[:5]
        return Response(tags)

class EntityDetail(APIView):
    @staticmethod
    def get_object(pk):
        try:
            return Entity.objects.get(pk=pk)
        except Entity.DoesNotExist:
            raise Http404
    
    def searchObject(self, request):
        query, limit = request.GET['q'], request.GET.get('limit',-1)
        filterList = []

        for word in query.split(' '): #need to make this more robust later

            word = word.lower()
            tag = word if word.find('#') != -1 else "#"+word

            nameQ = Q(name__icontains=word)
            tagQ = Q(tags__name__in=[tag])

            filterList.append(nameQ)
            filterList.append(tagQ)

        res = Entity.objects.filter(private=False).filter(reduce(operator.or_, filterList))

        #TODO: Test
        if request.user.is_authenticated():
            print 'searching private'
            privateEntities = Entity.objects.filter(entityownermembership__user=request.user).filter(reduce(operator.or_, filterList))
            res = itertools.chain(res, privateEntities)
            
        if limit <= 0:
            return res
        else:
            return res[:limit]
        
    def get(self, request, pk=None, format=None):
        entity = None

        if 'q' in request.GET:
            entity = self.searchObject(request)
            print "search=", request.GET['q'], ':', 
        elif pk:
            entity = self.get_object(pk)
        else:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        
        es = EntitySerializer(entity)
        return Response(es.data)

    def post(self, request, pk=None, format=None):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        #need to support batch post
        if pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        newEntity = Entity()
        newEntity.save() #saving so tags can be accessed
        entitySerializer = EntitySerializer(newEntity, data=request.DATA)   

        if entitySerializer.is_valid():
            entitySerializer.save()
            EntityOwnerMembership(entity=newEntity,user=request.user).save()

            return Response(entitySerializer.data)

        return Response(EntitySerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None, format=None):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        #need to support batch put!!!
        if not pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        entity = self.get_object(pk)

        #this doesn't actually work.
        if entity.version != request.DATA['version']:
            return Response({'error':True})

        es = EntitySerializer(entity, data=request.DATA)

        if es.is_valid():
            es.save()
            return Response(es.data)

        return Response(es.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)
       
        entity = self.get_object(pk)
        if entity.EntityOwnerMembership.user == request.user:
            entity.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(None, status=status.HTTP_401_UNAUTHORIZED)

class AttributeDetail(APIView):
    def get_object(self, pk):
        try:
            return Attribute.objects.get(pk=pk)
        except Attribute.DoesNotExist:
            raise Http404

    def post(self, request, pk=None, format=None):
        if pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        
        newAttribute = Attribute()
        entityId = request.DATA['entity']
        newAttribute.entity = Entity.objects.get(pk=entityId)

        attrSerializer = AttributeSerializer(newAttribute, data=request.DATA)   

        if attrSerializer.is_valid():
            attrSerializer.save()
            return Response(attrSerializer.data)

        return Response(attrSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None, format=None):
        if not pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        attr = self.get_object(pk)
        attrSerializer = AttributeSerializer(attr)

        return Response(attrSerializer.data)

    def put(self, request, pk=None, format=None):
        if not pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        attr = self.get_object(pk)
        attrSerializer = AttributeSerializer(attr, data=request.DATA)

        if attrSerializer.is_valid():
            attrSerializer.save()
            return Response(attrSerializer.data)

        return Response(attrSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if not pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        attr = self.get_object(pk)
        attr.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentDetail(APIView):
    def get_object(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise Http404

    def post(self, request, pk=None):
        if pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.is_authenticated():
            request.DATA['user'] = request.user.first_name
        else:
            request.DATA['user'] = request.user
        print request.DATA

        newCmt = Comment()
        cmtSerializer = CommentSerializer(newCmt, data=request.DATA)   

        if cmtSerializer.is_valid():
            newCmt.save()
            return Response(cmtSerializer.data)

        return Response(cmtSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None, format=None):
        if not pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        cmt = self.get_object(pk)
        cmtSerializer = CommentSerializer(cmt)

        return Response(cmtSerializer.data)

class AdDetail(APIView):
    def get_object(self, pk):
        try:
            return Ad.objects.get(pk=pk)
        except Ad.DoesNotExist:
            raise Http404

    def get(self, request, pk=None, format=None):
        if pk:
            ad = self.get_object(pk)
            adSerializer = AdSerializer(ad)
            return Response(adSerializer.data)

        #if no pk, return a random ad
        last = Ad.objects.count()-1

        if last < 0:
            return Response()

        adInd = random.randint(0,last)
        ad = Ad.objects.all()[adInd]
        
        adSerializer = AdSerializer(ad)

        return Response(adSerializer.data)

    def post(self, request, format=None):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        newAd = Ad()
        adSerializer = AdSerializer(newAd, data=request.DATA)   

        if adSerializer.is_valid():
            newAd.user = request.user
            newAd.save()
            return Response(adSerializer.data)

        return Response(adSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EntityList(generics.ListAPIView):
    model = Entity
    serializer_class = EntitySerializer
    paginate_by = 100

    def get_queryset(self):
        if "id" in self.request.GET:
            entityId = self.request.GET['id']
            return Entity.objects.filter(id=entityId)

        query = self.request.GET['q']
        filterList = []

        for word in query.split(' '): #need to make this more robust later
            word = word.lower()
            tag = word if word.find('#') != -1 else "#"+word

            nameQ = Q(name__icontains=word)
            tagQ = Q(tags__name__in=[tag])

            filterList.append(nameQ)
            filterList.append(tagQ)

        if self.request.user.is_authenticated():
            print 'searching private'
            publicQ = Q(private=False)
            privateQ = Q(entityownermembership__user=self.request.user)
            authList = [publicQ, privateQ]
            res = Entity.objects.filter(reduce(operator.or_,authList)).filter(reduce(operator.or_, filterList))
        else:
            res = Entity.objects.filter(private=False).filter(reduce(operator.or_, filterList))

        return res 

class AttributeList(generics.ListAPIView):
    model = Attribute
    serializer_class = AttributeSerializer
    paginate_by = 100

    def get_queryset(self):
        entityId = self.request.GET['entityId']
        attributes = Attribute.objects.filter(entity__id=entityId)
        return attributes

class CommentList(generics.ListAPIView):
    model = Comment
    serializer_class = CommentSerializer 
    paginate_by = 100

    def get_queryset(self):
        entityId = self.request.GET['entityId']
        comments = Comment.objects.filter(entityId__exact=entityId)
        return comments
        
#Celery
class TaskQueue(APIView):
    def post(self, request, pk=None, format=None):
        user = str(request.user)
        ipaddr = request.META['HTTP_X_REAL_IP']
        
        error = False
        keyName = ":".join([user, ipaddr, pk])
        r = rredis.getRedisConnection()
        voted = r.get(keyName)

        if False: #voted: #already exists
            print keyName, "already voted"
            error = True
        else:
            tasks.incrementVote.delay(user, pk, request.DATA['voteType'], keyName) 

        return Response({'error': error}, status=status.HTTP_200_OK)
