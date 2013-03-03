#Redis
import redis

REDIS_DB = 1
REDIS_HOST = 'localhost'
PORT = 6379

r = None

def getRedisConnection():
    global r

    if not r:
        r = redis.StrictRedis(host=REDIS_HOST,port=PORT, db=REDIS_DB)

    return r
