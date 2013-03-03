from rest_framework import serializers
from queryHandler.models import Entity, Attribute

from taggit.managers import TaggableManager

class APIInfo ():
    pass

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaggableManager

class AttributeSerializer(serializers.ModelSerializer):
    entity = serializers.RelatedField()
    class Meta:
        model = Attribute
        fields = ('id',
                  'entity',
                  'name',
                  'upVote',
                  'downVote',
                  'voteCount')

class EntitySerializer(serializers.ModelSerializer):
#    tags = serializers.SerializerMethodField('getAllTags')
    tags = serializers.ManyRelatedField(source='tags', read_only=True)
    #tags = TagSerializer(source="tags")
    attributes = AttributeSerializer(source='attribute_set')

    class Meta:
        model = Entity
        fields = ('id',
                  'name', 
                  'imageURL',
                  'description',
                  'tags',
                  'attributes')

    #overriding to handle Tags and Attribute???
    '''
    def restore_fields(self,data,files):
        super.restore_fields(data,files)
    '''

    def from_native(self, data, files):
        '''very hackish refer to https://github.com/tomchristie/django-rest-framework/blob/master/rest_framework/serializers.py'''
        return self.restore_object(data, instance=getattr(self, 'object', None))

    def restore_object(self, attrs, instance=None):
        if instance is not None:
            instance.name= attrs['name']
            instance.imageURL = attrs['imageURL']
            instance.description = attrs['description']
            
            instance.tags.clear()

            for tag in attrs['tags']:
                instance.tags.add(tag)
            
            return instance

        return Entity(**attrs)
