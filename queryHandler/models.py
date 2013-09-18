from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

class BaseModel(models.Model):
    version = models.IntegerField(default=0)
    private = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    lastUpdated = models.DateField(auto_now=True)

class Customer(models.Model):
    '''
    user with augmented fields
    '''
    MALE = 0
    FEMALE = 0
    GENDER_CHOICES = (
        (MALE, 'male'),
        (FEMALE, 'female'))
     
    user = models.OneToOneField(User, primary_key=True)
    dateOfBirth = models.DateField()
    gender = models.IntegerField(choices=GENDER_CHOICES)
    reputation = models.IntegerField(default=50)

    # Neo4j is public id
    neo4jId = models.LongField(required=True)

    # This is private accessToken used for authentication
    accessToken = models.CharField(max_length=40)

    def __unicode__(self):
        return unicode(self.user.email) + u':' + unicode(self.id)

class Entity(BaseModel):
    entityType = models.CharField(max_length=100)

    name = models.CharField(max_length=200, 
                            default="Add a Title")

    imageURL = models.URLField(max_length=1000)
    description = models.TextField()
    tags = TaggableManager()

    extURL = models.URLField(max_length=1000, blank=True)
    relatedEntity = models.ManyToManyField("self", through='EntitytoEntityRelationship', symmetrical=False) 

    def __unicode__(self):
        return u'entity' + u":" + unicode(self.name) + u':' + unicode(self.id)

    #overriding save to auto increment version
    def save(self, **kwargs):
        self.version += 1
        super(Entity, self).save(kwargs)

class Attribute(BaseModel):
    NEUTRAL = 0
    NEGATIVE = -1
    POSITIVE = 1

    ATTR_TONE_CHOICES = (
        (NEUTRAL, 'neutral'),
        (NEGATIVE, 'negative'),
        (POSITIVE, 'positive'),
    )
    
    attrType = models.CharField(max_length=100)
    tone = models.IntegerField(choices=ATTR_TONE_CHOICES,
                               default=NEUTRAL)

    entity = models.ForeignKey(Entity)
    name = models.CharField(max_length=200, 
                            default="Attribute Name")

    upVote = models.IntegerField(default=0)
    downVote = models.IntegerField(default=0)
    voteCount = models.IntegerField(default=0)

    def __unicode__(self):
        return unicode(self.name) + u':' + unicode(self.id)

    def save(self, **kwargs):
        self.version += 1
        super(Attribute, self).save(kwargs)

class Citation(BaseModel):
    attribute = models.ForeignKey(Attribute)

    description = models.CharField(max_length=140)
    sourceURL = models.URLField(max_length=1000)
    modifiedDate = models.DateField(auto_now=True)
      
    def __unicode__(self):
        return u'Citation:' + self.attribute + unicode(self.id)

class Comment(BaseModel):
    user = models.CharField(max_length=200, default="Anonymous")
    entityId = models.CharField(max_length=1000)
    content = models.CharField(max_length=2500)

    upVote = models.IntegerField(default=0)
    downVote = models.IntegerField(default=0)
    voteCount = models.IntegerField(default=0)

    def __unicode__(self):
        return u'Comment:' + unicode(self.id)

class Ad(BaseModel):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=200)
    imageURL = models.URLField(max_length=1000)
    redirectURL = models.URLField(max_length=1000)

    def __unicode__(self):
        return unicode(self.name) + u':' + unicode(self.id)

class Vote(models.Model):
    userId = models.CharField(max_length=200)

    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey()

    #Actual Info
    voteType = models.CharField(max_length=1) # +, -
    agent = models.CharField(max_length=1000)
    language = models.CharField(max_length=100)
    created = models.DateField(auto_now_add=True)
    ip = models.CharField(max_length=20)

    def __unicode__(self):
        return ":".join([unicode(self.userId),
                        unicode(self.content_object)])

''' Relationship '''
class EntityOwnerMembership(models.Model):
    entity = models.OneToOneField(Entity, primary_key=True)
    user = models.ForeignKey(User)

class EntitytoEntityRelationship(models.Model):
    relationship = models.CharField(max_length = 100)
    me = models.ForeignKey(Entity, related_name = "me_set")
    other = models.ForeignKey(Entity, related_name = "other_set")

    def __unicode__(self):
        return self.relationship + ":" + unicode(self.id)

class EntityClass(models.Model):
    name = models.CharField(max_length=100)
    presetAttributes = models.TextField()
 
''' Stats '''
class VoteAggregate(models.Model):
    attribute = models.ForeignKey(Attribute)
    
    date = models.DateField(auto_now_add=True)
    downVote = models.PositiveIntegerField()
    upVote = models.PositiveIntegerField()
