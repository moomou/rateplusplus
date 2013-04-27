#Django Stuff
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout

#App Stuff
from forms import SignupForm, FeedbackForm, EMAIL_MSG 

import json
import pygeoip 

gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

FEATURE_FLAG = {
    'SEARCH_ENABLED': True,
    'STATS_ENABLED': True,
    'FEEDBACK_ENABLED': True,
    'NAV_ENABLED': True,
}

def ContextSetup(request):
    authenticated = request.user.is_authenticated()

    renderCxt = {
        'authenticated': authenticated,
    }
    renderCxt = dict(FEATURE_FLAG.items() + renderCxt.items())

    return renderCxt

def PrivacyHandler(request):
    pass
    
def FeedbackHandler(request):
    if request.method == "POST":
        form = FeedbackForm(request.POST)

        if form.is_valid():
            cd = form.cleaned_data

            #send email to me 
            send_mail('Feedback for Cloverite', cd['feedback'], cd['userEmail'], ['ppymou@gmail.com'], fail_silently=True)

            #send email to user
            if cd['userEmail']:
                send_mail('Thank you for testing Cloverite!', EMAIL_MSG, "feedback@cloverite.com", [cd['userEmail']], fail_silently=True)

            return HttpResponse(json.dumps("pass"), mimetype="application/json")

        else:
            return HttpResponse(json.dumps(form.errors), mimetype="application/json")

def SigninHandler(request):
    if request.method == "GET":
        renderCxt = ContextSetup(request)
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signin.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                return HttpResponse(json.dumps(reverse('default.views.PageHandler')), mimetype="application/json")

        return HttpResponse(json.dumps('error'), mimetype="application/json")

def SignoutHandler(request):
    if request.method == "GET":
        logout(request)

def SignupHandler(request):
    if request.method == "GET":
        renderCxt = ContextSetup(request)
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signup.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        form = SignupForm(request.POST)

        if form.is_valid():
            user = form.save() 
            user = authenticate(username=user.username, password=user.password)

            return HttpResponse(json.dumps(reverse('default.views.PageHandler')), mimetype="application/json")
        else:
            return HttpResponse(json.dumps(form.errors), mimetype="application/json")

def AdHandler(request):
    renderCxt = ContextSetup(request)
    
    t = loader.get_template('ad.html')
    c = RequestContext(request, renderCxt) 

    return HttpResponse(t.render(c))

#Serve a specific page
def EntityHandler(request, pk):
    renderCxt = ContextSetup(request)
    renderCxt['specific_entity'] = True
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))
 
def SearchPage(request, query):
    renderCxt = ContextSetup(request)
    renderCxt['QUERY'] = query
    
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))
 
#Landing Page
def DefaultPage(request):
    ipaddr = request.META['HTTP_X_REAL_IP']
    geoInfo = gi.record_by_addr(ipaddr)
    defaultQuery = " ".join([geoInfo['city']]) #,geoInfo['country_name']])

    renderCxt = ContextSetup(request)
    renderCxt['DEFAULT_QUERY'] = defaultQuery
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
