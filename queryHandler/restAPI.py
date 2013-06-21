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

from queryHandler import tasks
from django.db.models import Q

#Python
import re
import json
import operator
import rredis
import random

attrReg = re.compile(r'\b(with)\b')
relReg = re.compile(r'\b(by|at)\b')

class Result():
    @staticmethod
    def QUERY(next=None, previous=None, results=None, message=None):
        if results:
            count = len(results)
        else:
            count = 0

        return {
            'count': count,
            'results': results,
            'next': next,
            'previous': previous
        }

    @staticmethod
    def BOOLEAN (success=True, reason=None):
        return {
            'success': success,
            'message': reason,
        }
        
    def __unicode__(self):
        return unicode('static class')

#Postgres
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
    
    def getAuthorizedContent(self):
        request = self.request 
        if request.user.is_authenticated():
            publicQ = Q(private=False)
            privateQ = Q(entityownermembership__user=request.user)
            authList = [publicQ, privateQ]
            res = Entity.objects.filter(reduce(operator.or_,authList))
        else:   
            res = Entity.objects.filter(private=False)

        return res

    def basicQuerySearch(self,query):
        filterList = []
        for word in query.strip().split(): 
            word = word.lower()
            hashTag = word if word.find('#') != -1 else "#"+word
            catTag = word if word.find('$') != -1 else "$"+word

            nameQ = Q(name__icontains=word)
            hashTagQ = Q(tags__name__in=[hashTag])
            catTagQ = Q(tags__name__in=[catTag])

            filterList.append(nameQ)
            filterList.append(hashTagQ)
            filterList.append(catTagQ)

        return self.getAuthorizedContent().filter(reduce(operator.or_, filterList))
    
    def attrSearch(self, res, query):
        if not query or not res:
            return res

        filterList = [] 
        print 'attr',query.strip().split()
        for word in query.strip().split():
            attrQ = Q(attribute__name__contains=word)
            filterList.append(attrQ)
        return res.filter(reduce(operator.or_, filterList))

    def relationSearch(self, res, query):
        if not query or not res:
            return res

        filterList = []
        print 'rel', query
        for entity in query.strip().split():
            rel = Q(relatedEntity__name__contains=entity)
            filterList.append(rel)
        return res.filter(reduce(operator.or_, filterList))

    def get_queryset(self):
        request = self.request
        entityQuery = dummy = attrQuery = relationQuery = None 

        if request.GET.get('id', None):
            entityId = self.request.GET['id']
            res = self.getAuthorizedContent().filter(id=entityId)
            return res

        #parse Query
        query, limit = request.QUERY_PARAMS.get('q', None), request.QUERY_PARAMS.get('limit',-1)
        entityQuery, dummy, attrQuery = query.partition("with")

        print entityQuery, dummy, attrQuery
        print attrQuery

        if attrQuery.lower().find("at") >= 0 or attrQuery.lower().find("by") >= 0: 
            #re.match(relReg, attrQuery): #TODO fix this!
            print 'match'
            attrQuery, dummy, relationQuery = re.split(relReg, attrQuery)

        #search
        res = self.basicQuerySearch(entityQuery)
        print res.distinct()
        res = self.attrSearch(res, attrQuery)
        print res.distinct()
        res = self.relationSearch(res, relationQuery)
        print res.distinct()
         
        if limit <= 0:
            return res.distinct()
        else:
            return res.distinct()[:limit]

class EntityDetail(APIView):
    @staticmethod
    def get_object(pk):
        try:
            return Entity.objects.get(pk=pk)
        except Entity.DoesNotExist:
            raise Http404
    
    def get(self, request, pk=None, format=None):
        if pk:
            entity = self.get_object(pk)

            if entity.private and entity.entityownermembership.user != request.user:
                return Response(None, status=status.HTTP_401_UNAUTHORIZED)

            es = EntitySerializer(entity)
            return Response(es.data)
        else:
            return Response(Result.BOOLEAN(False, 'Missing pk'))
        
    def post(self, request, pk=None, format=None):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        #need to support batch post
        if pk:
            return Response(Result.BOOLEAN(False, 'Entity already exists'))

        newEntity = Entity()
        newEntity.save() #saving so tags can be accessed
        entitySerializer = EntitySerializer(newEntity, data=request.DATA)   

        if entitySerializer.is_valid():
            entitySerializer.save()
            EntityOwnerMembership(entity=newEntity,user=request.user).save()

            catTags = newEntity.tags.filter(name__startswith="$")
            
            for catTag in catTags:
                try:
                    entityClass = EntityClass.objects.get(name=catTag.name[1:])
                    presetAttrs = json.loads(entityClass.presetAttributes)
                    for attrname, tone in presetAttrs.iteritems():
                        newAttr = Attribute()
                        newAttr.name = attrname
                        newAttr.tone = Attribute.POSITIVE if tone == "+" else Attribute.NEGATIVE
                        newAttr.entity = newEntity
                        newAttr.save()

                except DoesNotExist: 
                    #Log these
                    pass
            
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

class AttributeList(generics.ListAPIView):
    model = Attribute
    serializer_class = AttributeSerializer
    paginate_by = 100

    def get_queryset(self):
        entityId = self.request.GET['entityId']
        attributes = Attribute.objects.filter(entity__id=entityId)
        return attributes

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

class CommentList(generics.ListAPIView):
    model = Comment
    serializer_class = CommentSerializer 
    paginate_by = 100

    def get_queryset(self):
        entityId = self.request.GET['entityId']
        comments = Comment.objects.filter(entityId__exact=entityId)
        return comments

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

#Redis
class RelationList(APIView):
    def get_redisKey(self, request):
        pass


    def populateRelationMeta(self, request):
        '''
        count:entity:id::votes::
        count:entity:id::votes::timestamp
        count:entity:id::positive_votes
        count:entity:id::relationName
        count:entity:id::entity:id 
        count:entity:id::
        '''
        pass
        
    def get(self, request):
        leftId = request.GET.get("leftId", None)
        rightId = request.GET.get("rightId", None)
        print leftId, rightId

        if not (leftId and rightId):
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        # entity:id::entity:id = reLtoR:id::reRtoL:id, ...
        r = rredis.getRedisConnection()
        redisKey = "entity:"+leftId + "::" + "entity:" + rightId
        relations = r.smembers(unicode(redisKey))
        
        result = {
            'count': len(relations),
            'results': relations,
            'previous': None,
            'next': None,
        }

        return Response(result, status=status.HTTP_200_OK) 

    def post(self, request):
        leftId = request.DATA.get("leftId", None)
        rightId = request.DATA.get("rightId", None)
        relationship = request.DATA.get("relationship", None)

        if not (leftId and rightId and relationship):
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        entityLeft = Entity.objects.get(pk=leftId)
        entityRight = Entity.objects.get(pk=rightId)

        r = rredis.getRedisConnection()
        reLeft, reRight = relationship.strip().split(':')

        reLtoR = EntitytoEntityRelationship(
            me = entityLeft,
            other = entityRight,
            relationship = reLeft
        )
        reRtoL = EntitytoEntityRelationship(
            me = entityRight,
            other = entityLeft,
            relationship = reRight
        )

        reLtoR.save()
        reRtoL.save()

        #key format
        # entity:id::entity:id = reLtoR:id::reRtoL:id, ...
        LtoRKey = "entity:" + unicode(entityLeft.id) + "::" + "entity:" + unicode(entityRight.id)
        RtoLKey = "entity:" + unicode(entityRight.id) + "::" + "entity:" + unicode(entityLeft.id)

        r.sadd(LtoRKey, unicode(reLtoR)+u'::'+unicode(reRtoL))
        r.sadd(RtoLKey, unicode(reRtoL)+u'::'+unicode(reLtoR))

        return Response(Result.BOOLEAN(True, "success"), status=status.HTTP_200_OK)
                    
    def delete(self, request):
        pass

class FavoriteDetail(APIView):
    r = rredis.getRedisConnection()

    def get_redisKey(self, request):
        pass
        
    def get(self, request):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)
       
        # user:id::favorite = entity:id, ...
        userId = request.user.id
        redisKey = u"user:"+userId+ u"::favorite"
        result = r.smembers(unicode(redisKey))

        return Response(result, status=status.HTTP_200_OK) 

    def post(self, request):
        if not request.user.is_authenticated():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)
        
        entityId = request.GET.get('entityId', None)

        if not entityId: 
            return Response(Result.BOOLEAN(False, 'Mising entityId'), 
                            status=status.HTTP_400_BAD_REQUEST)

        userId = request.user.id
        redisKey = "user:"+userId+ "::favorite"

        #key format
        # user:id::favorite = entity:id, ...
        r.sadd(redisKey, u'entity::'+unicode(entityId))

        return Response(Result.BOOLEAN(True, "success"), status=status.HTTP_200_OK)
                    
    def delete(self, request):
        pass

#Celery
class VoteQueue(APIView):
    def post(self, request, pk=None, queueType=None):
        if not pk or not queueType:
            return Response(Result.BOOLEAN(False, 'Mising param'), 
                            status=status.HTTP_400_BAD_REQUEST)

        r = rredis.getRedisConnection()

        voteMetaObj = {
            'ip': request.META['HTTP_X_REAL_IP'],
            'userId': unicode(request.user),
            'agent':request.META['HTTP_USER_AGENT'],
            'language': request.META['HTTP_ACCEPT_LANGUAGE'],
            'voteType': request.DATA['voteType']
             #time: will be the time when this is saved to db
        }        

        voted = r.get(unicode(voteMetaObj))

        print 'voting on ' + pk

        if False: #voted: #already exists
            print keyName, "already voted"
        else:
            classType = Attribute if queueType != "cmt" else Comment
            tasks.incrementVote.delay(request.user, 
                                      classType, 
                                      pk,
                                      voteMetaObj) 

        return Response(Result.BOOLEAN(True, "vote recorded"), 
                        status=status.HTTP_200_OK)
