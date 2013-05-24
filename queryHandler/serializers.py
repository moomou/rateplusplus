from rest_framework import serializers
from queryHandler.models import Entity, Attribute, Comment, Ad
from taggit.managers import TaggableManager

class APIInfo ():
    pass

class AttributeSerializer(serializers.ModelSerializer):
    entity = serializers.RelatedField()
    tone = serializers.ChoiceField(choices=Attribute.ATTR_TONE_CHOICES)
    
    def validate(self, attrs):
        return attrs

    class Meta:
        model = Attribute
        fields = ('id',
                  'entity',
                  'version',
                  'name',
                  'upVote',
                  'tone',
                  'downVote',
                  'voteCount')

class EntitySerializer(serializers.ModelSerializer):
    tags = serializers.ManyRelatedField(source='tags', read_only=True)
    attributes = AttributeSerializer(source='attribute_set')

    class Meta:
        model = Entity
        fields = ('id',
                  'private',
                  'name', 
                  'imageURL',
                  'description',
                  'version',
                  'tags',
                  'entityType',
                  'attributes')

    def from_native(self, data, files):
        '''very hackish refer to https://github.com/tomchristie/django-rest-framework/blob/master/rest_framework/serializers.py'''
        return self.restore_object(data, instance=getattr(self, 'object', None))

    def restore_object(self, attrs, instance=None):
        if instance is not None:
            instance.private = attrs['private']
            instance.name= attrs['name']
            instance.imageURL = attrs['imageURL']
            instance.description = attrs['description']

            instance.tags.clear()

            for tag in attrs['tags']:
                instance.tags.add(tag)
            
            return instance

        return Entity(**attrs)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaggableManager

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment 
    def validate_user(self, attrs, source):
        return attrs

    def validate(self, attrs):
        if attrs['private']:
            attrs['user'] = "Anonymous"
        return attrs

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('id',
                  'name',
                  'imageURL',
                  'redirectURL')


