#Django Stuff
from django.http import HttpResponse
from django.http import Http404
from django.template import RequestContext, loader
from django.conf import settings

import pygeoip 

gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

#SearchHandler
def SearchPage(request, query):
    t = loader.get_template('main.htm')
    c = RequestContext(request, {'QUERY':query})

    return HttpResponse(t.render(c))
 
#Django handler is a Function; can be a class too
def DefaultPage(request):
    ipaddr = request.META['HTTP_X_REAL_IP']
    geoInfo = gi.record_by_addr(ipaddr)
    defaultQuery = " ".join([geoInfo['city'],geoInfo['country_name']])

    t = loader.get_template('landing.htm')
    c = RequestContext(request, {'DEFAULT_QUERY':defaultQuery})

    return HttpResponse(t.render(c))

def PageHandler(request):
    if request.method == "GET":
        query = request.GET.get('q','')
        if query:
            return SearchPage(request, query)
        else:
            return DefaultPage(request)
