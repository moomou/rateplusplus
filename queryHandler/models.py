from django.db import models
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

class Customer(models.Model):
    '''
    user with augmented fields
    '''
    user = models.OneToOneField(User)

class CreatedCollection(models.Model):
    '''
    a membership set that contains created entity with user
    '''
    pass

class VoteCollection(models.Model):
    '''
    a membership set describing vote the user has casted
    '''
    pass

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
    author = models.ManyToManyField(Customer)
    created = models.DateTimeField(auto_now_add=True)
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
        return unicode(self.id)

    #overriding save to auto increment version
    def save(self):
        self.version += 1
        super(Entity, self).save()

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
    created = models.DateTimeField(auto_now_add=True)
    lastUpdated = models.DateField(auto_now=True)

    #Model
    tone = models.IntegerField(choices=ATTR_TYPE_CHOICES,
                               default=NEUTRAL)
    entity = models.ForeignKey(Entity)
    name = models.CharField(max_length=200, 
                            default="Attribute Name")

    upVote = models.IntegerField()
    downVote = models.IntegerField()
    voteCount = models.IntegerField()

    def __unicode__(self):
        return unicode(self.id)

    def save(self):
        self.version += 1
        super(Attribute, self).save()

    
class Comment(models.Model):
    entity = models.ForeignKey(Entity)
    
    attribute = Attribute()
    content = models.TextField()

    modifiedDate = models.DateField(auto_now=True)
