#Django Stuff
from django.http import HttpResponse
from django.http import Http404
from django.template import RequestContext, loader
from django.conf import settings

import pygeoip 

gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

#Ad handler
def AdHandler(request):
    t = loader.get_template('ad.html')
    c = RequestContext(request, {}) 

    return HttpResponse(t.render(c))

#SearchHandler
def SearchPage(request, query):
    t = loader.get_template('main.html')
    c = RequestContext(request, {'QUERY':query})

    return HttpResponse(t.render(c))
 
def DefaultPage(request):
    ipaddr = request.META['HTTP_X_REAL_IP']
    geoInfo = gi.record_by_addr(ipaddr)
    defaultQuery = " ".join([geoInfo['city'],geoInfo['country_name']])

    t = loader.get_template('landing.html')
    c = RequestContext(request, {'DEFAULT_QUERY':defaultQuery})

    return HttpResponse(t.render(c))

def PageHandler(request):
    if request.method == "GET":
        query = request.GET.get('q','')
        if query:
            return SearchPage(request, query)
        else:
            return DefaultPage(request)
