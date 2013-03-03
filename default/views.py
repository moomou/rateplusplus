#Django Stuff
from django.http import HttpResponse
from django.http import Http404
from django.template import RequestContext, loader

#S
def SearchPage(request):
    if request.method == "GET":
        t = loader.get_template('main.htm')
        c = RequestContext(request, {})

        return HttpResponse(t.render(c))
 
#Django handler is a Function; can be a class too
def DefaultPage(request):
    if request.method == "GET":
        t = loader.get_template('landing.htm')
        c = RequestContext(request, {})

        return HttpResponse(t.render(c))
