import json

from presetAttrs import presetAttrs
from models import EntityClass

print "Populating Default Attr"
for item in presetAttrs:
    res = EntityClass.objects.filter(name=item['name'])
    if not res:
        entityClass = EntityClass()
        entityClass.name = item['name'] 
        entityClass.presetAttributes = json.dumps(item['attribute'])
        entityClass.save()


