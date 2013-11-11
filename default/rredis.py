#Redis
import redis

REDIS_HOST = 'localhost'
PORT = 6379

r = None
def getRedisConnection():
    global r

    if not r:
        r = redis.StrictRedis(host=REDIS_HOST, port=PORT)
    return r
