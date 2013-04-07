from django.db import models
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

'''
Primary Models
'''
class Customer(models.Model):
    '''
    user with augmented fields
    '''
    CONSUMER = 0
    ADVERTISER = 1 #has access to consumer
    DEVELOPER = 2  #has access to advertiser and consumer

    ACC_TYPE_CHOICES = (
        (CONSUMER, 'consumer'),
        (ADVERTISER, 'advertiser'),
        (DEVELOPER, 'developer'),
    )
     
    user = models.OneToOneField(User)
    accountType = models.IntegerField(choices=ACC_TYPE_CHOICES,
                                        default=CONSUMER)

    def __unicode__(self):
        return unicode(self.user.email) + u':' + unicode(self.id)

class Entity(models.Model):
    PERSON = 'person'
    LOCATION = 'location'
    UNSPECIFIED = 'unspecified'

    ENTITY_TYPE_CHOICES = (
        (PERSON, 'person'),
        (LOCATION, 'location'),
        (UNSPECIFIED, 'unspecified'),
    )

    #Admin
    version = models.IntegerField(default=0)
    private = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    lastUpdated = models.DateField(auto_now=True)

    #Model
    entityType = models.CharField(max_length=200,
                                  choices=ENTITY_TYPE_CHOICES,
                                  default=UNSPECIFIED)

    name = models.CharField(max_length=200, 
                            default="Add a Title")

    imageURL = models.URLField(max_length=1000)
    description = models.TextField()
    tags = TaggableManager()
     
    def __unicode__(self):
        return unicode(self.name) + u':' + unicode(self.id) + u':entity'

    #overriding save to auto increment version
    def save(self, **kwargs):
        self.version += 1
        super(Entity, self).save(kwargs)

class Attribute(models.Model):
    NOUN = 'non'
    ADJ = 'adj'
    ATTR_TYPE_CHOICES = (
        (NOUN, 'Noun'),
        (ADJ, 'Adjective'),
    )

    NEUTRAL = 0
    NEGATIVE = -1
    POSITIVE = 1

    ATTR_TONE_CHOICES = (
        (NEUTRAL, 'neutral'),
        (NEGATIVE, 'negative'),
        (POSITIVE, 'positive'),
    )
    
    #Admin
    version = models.IntegerField(default=0)
    private = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    lastUpdated = models.DateField(auto_now=True)

    #Model
    tone = models.IntegerField(choices=ATTR_TONE_CHOICES,
                               default=NEUTRAL)

    entity = models.ForeignKey(Entity)
    name = models.CharField(max_length=200, 
                            default="Attribute Name")

    upVote = models.IntegerField()
    downVote = models.IntegerField()
    voteCount = models.IntegerField()

    def __unicode__(self):
        return unicode(self.name) + u':' + unicode(self.id)

    def save(self, **kwargs):
        self.version += 1
        super(Attribute, self).save(kwargs)

class Comment(models.Model):
    '''Not currently used'''
    entity = models.ForeignKey(Entity)
    
    attribute = Attribute()
    content = models.TextField()

    modifiedDate = models.DateField(auto_now=True)

class Ad(models.Model):
    #Admin
    user = models.ForeignKey(User, null=True)

    private = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    lastUpdated = models.DateField(auto_now=True)

    #Model
    name = models.CharField(max_length=200)
    imageURL = models.URLField(max_length=1000)
    redirectURL = models.URLField(max_length=1000)

    def __unicode__(self):
        return unicode(self.name) + u':' + unicode(self.id)

'''
Secondary Models
'''
class EntityOwnerMembership(models.Model):
    entity = models.ForeignKey(Entity)
    user = models.ForeignKey(User)

class UserVotes(models.Model):
    UPVOTE = -1
    DOWNVOTE = 1

    VOTE_TYPE = (
        (UPVOTE, 'downVote'),
        (DOWNVOTE, 'upVote'),
    )

    attribute = models.ForeignKey(Attribute)
    user = models.ForeignKey(User)
    voteType = models.IntegerField(choices=VOTE_TYPE)

'''
To be created by Celery task at the end of the day
'''
class VoteAggregate(models.Model):
    attribute = models.ForeignKey(Attribute)
    
    #represents the number of votes this day
    date = models.DateField(auto_now_add=True)
    downVote = models.PositiveIntegerField()
    upVote = models.PositiveIntegerField()
