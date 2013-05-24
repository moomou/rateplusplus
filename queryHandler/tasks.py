from celery.task import task

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F

from models import Vote

import rredis
import datetime

VERSION = (1,)
MAX_ACTIVITIES = 10

##Tasks
#
@task(ignore_result=True)
def incrementVote (user, classType, objId, voteMetaObj):
    r = rredis.getRedisConnection()

    if objId:
        try:
            obj = classType.objects.get(pk=objId)
            #updatedField = "upVote"
             
            if voteMetaObj['voteType'] == "+":
                obj.upVote = F('upVote') + 1
            else:
                obj.downVote = F('downVote') + 1
                #updatedField = "downVote"

            obj.voteCount = F('voteCount') + 1
            obj.save()#update_fields=[updatedField])

            vote = Vote(content_object = obj)
            for k,v in voteMetaObj.iteritems():
                print k, v
                vote.__setattr__(k, v)
            vote.save()

            print "UGO"

            r.setex(unicode(voteMetaObj), 
                    datetime.timedelta(days=1), #expires in 1 day
                    0) 

            #TODO: implement voteCollection

        except ObjectDoesNotExist:
            '''log these errors'''
            print 'exception occurred'
    else:
        print 'No objId provided'

