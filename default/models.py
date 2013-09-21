from django.db import models

from django.contrib.auth.models import User

# Create your models here.
class Clover(models.Model):
    user = models.OneToOneField(User, primary_key=True)
    neo4jId = models.CharField(max_length=100)
    
    def __unicode__(self):
        return unicode(self.user.email) + u':' + unicode(self.id)
