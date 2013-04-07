#Django Stuff
from django.http import HttpResponse
from django.http import Http404
from django.template import RequestContext, loader
from django.conf import settings
from django.core.mail import send_mail

import json
import pygeoip 

gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

EMAIL_MSG = '''
    Hi there,

    Thank you for testing and sending feedbacks about Cloverite.
    
    Our goal is to provide the best user experience possible and your comments will help us get there!

    If you provided us your email, we will be sure to give you a reply.
    
    Thanks,
    Cloverite
'''

FEATURE_FLAG = {
    'SEARCH_ENABLED': True,
    'STATS_ENABLED': True,
    'FEEDBACK_ENABLED': True,
    'NAV_ENABLED': True,
}

#Privacy Handler
def PrivacyHandler(request):
    pass
    
#Feedback Handler
def FeedbackHandler(request):
    if request.method == "POST":
        userEmail = request.POST.get('userEmail', 'Not supplied')
        userMessage = request.POST.get('feedback', 'Empty')

        send_mail('Feedback for Cloverite', userMessage, userEmail, ['ppymou@gmail.com'], fail_silently=True)

        if userEmail != "Not supplied":
            send_mail('Thank you for testing Cloverite!', EMAIL_MSG, "noreply@cloverite.com", [userEmail], fail_silently=True)

        return HttpResponse(json.dumps("Submited"), mimetype="application/json")

#Sign up Handler
def SigninHandler(request):
    if request.method == "POST":
        renderCxt = {}
        renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signup.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))
    elif request.method == "GET":
        renderCxt = {}
        renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signin.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))


#Sign up Handler
def SignupHandler(request):
    if request.method == "GET":
        renderCxt = {}
        renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signup.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        pass 

#Ad handler
def AdHandler(request):
    renderCxt = {}
    renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
    
    t = loader.get_template('ad.html')
    c = RequestContext(request, renderCxt) 

    return HttpResponse(t.render(c))

#SearchHandler
def SearchPage(request, query):
    renderCxt = {'QUERY':query}
    renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
    
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))
 
#Landing
def DefaultPage(request):
    ipaddr = request.META['HTTP_X_REAL_IP']
    geoInfo = gi.record_by_addr(ipaddr)
    defaultQuery = " ".join([geoInfo['city']]) #,geoInfo['country_name']])

    renderCxt = {'DEFAULT_QUERY':defaultQuery}
    renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())
    renderCxt['SEARCH_ENABLED'] = False
    renderCxt['FEEDBACK_ENABLED'] = False
    
    t = loader.get_template('landing.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))

def PageHandler(request):
    if request.method == "GET":
        query = request.GET.get('q','')
        if query:
            return SearchPage(request, query)
        else:
            return DefaultPage(request)
