#Django
from django.http import Http404

#RestFramework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#App Stuff
from queryHandler.models import *
from queryHandler.serializers import *

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from queryHandler import tasks
from django.db.models import Q

import operator, json
import rredis
import random

#RESTful API
class EntityDetail(APIView):
    def get_object(self, pk):
        try:
            return Entity.objects.get(pk=pk)
        except Entity.DoesNotExist:
            raise Http404
            
    def searchObject(self, query, limit):
        filterList = []

        for word in query.split(' '): #need to make this more robust later
            word = word.lower()
            nameQ = Q(name__icontains=word)
            tagQ = Q(tags__name__in=[word])
            filterList.append(nameQ)
            filterList.append(tagQ)

        res = Entity.objects.filter(reduce(operator.or_, filterList))
        
        if limit <= 0:
            return res
        else:
            return res[:limit]
        
    def get(self, request, pk=None, format=None):
        entity = None

        if 'q' in request.GET:
            print 'search...'
            entity = self.searchObject(request.GET['q'], request.GET.get('limit',-1))
            print len(entity)
        elif pk:
            entity = self.get_object(pk)
        else:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        
        es = EntitySerializer(entity)
        return Response(es.data)

    def post(self, request, pk=None, format=None):
        #need to support batch post
        if pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        newEntity = Entity()
        newEntity.save() #saving so tags can be accessed
        entitySerializer = EntitySerializer(newEntity, data=request.DATA)   

        if entitySerializer.is_valid():
           entitySerializer.save()
           return Response(entitySerializer.data)

        return Response(EntitySerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None, format=None):
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
        entity = self.get_object(pk)
        entity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

class AdDetail(APIView):
    def get_object(self, pk):
        try:
            return Ad.objects.get(pk=pk)
        except Attribute.DoesNotExist:
            raise Http404

    def get(self, request, pk=None, format=None):
        if pk:
            ad = self.get_object(pk)
            adSerializer = AdSerializer(ad)
            return Response(adSerializer.data, status=status.HTTP_400_BAD_REQUEST)

        #if no pk, return a random ad
        last = Ad.objects.count()-1

        adInd = random.randint(0,last)
        ad = Ad.objects.all()[adInd]
        
        adSerializer = AdSerializer(ad)
        return Response(adSerializer.data)

    def post(self, request, pk=None, format=None):
        if pk:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        
        newAd = Ad()
        adSerializer = AdSerializer(newAd, data=request.DATA)   

        if adSerializer.is_valid():
            newAd.save()
            return Response(adSerializer.data)

        return Response(adSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
