from django.conf import settings

import json
import requests
import logging

# Get an instance of a logger
CLOVERITE_GRAPH_URL = \
    settings.STAGING_API if settings.DEBUG else settings.LIVE_API
CLOVERITE_HEADERS   = \
    {'content-type': 'application/json', "x-access-token": "superman"}

class CloverAPI:
    @staticmethod
    def __getGeneric__(resourceName, resourceId):
        res = requests.get(CLOVERITE_GRAPH_URL + 
            "/%s/%s" % (resourceName, resourceId))

        if res.status_code != 200:
            #logger.error("Call to Cloverite API failed: %s" % res.text)
            return None
        return res.json()

    @staticmethod
    def getEntity(entityId):
        return __getGeneric__("entity", entityId)

    @staticmethod
    def getAttribute(attributeId):
        return __getGeneric__("attribute", attributeId)

    @staticmethod
    def getData(dataId):
        return __getGeneric__("data", dataId)

    @staticmethod
    def createNewUser(username, email):
        postData = {
            "username" : username,
            "email"    : email
        }

        res = requests.post(
            CLOVERITE_GRAPH_URL+"/user",
            headers = CLOVERITE_HEADERS,
            data = json.dumps(postData))

        if res.status_code != 201:
            print "Call to Cloverite API Failed"
            #logger.error("Call to Cloverite API failed: %s" % postData)
            return None

        #logger.info("Call to Cloverite API succeeded")
        return res.json()


