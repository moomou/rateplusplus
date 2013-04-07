from celery.task import task
from .models import Entity, Attribute

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F

import rredis
import datetime

VERSION = (1,)
MAX_ACTIVITIES = 10

##Tasks
#
@task(ignore_result=True)
def incrementVote(userId, attrId, voteType, keyName):
    r = rredis.getRedisConnection()

    if attrId:
        try:
            attr = Attribute.objects.get(pk=attrId)
            updatedField = "upVote"
             
            if voteType == "+":
                attr.upVote = F('upVote') + 1
            else:
                attr.downVote = F('downVote') + 1
                updatedField = "downVote"

            attr.voteCount = F('voteCount') + 1
            attr.save()#update_fields=[updatedField])
            r.setex(keyName, datetime.timedelta(days=1), 0) #expires in 1 day

            print keyName, voteType, "Done"

            #TODO: implement voteCollection

        except ObjectDoesNotExist:
            '''log these errors'''
            print 'exception occurred'
    else:
        print 'No AttrId provided'


