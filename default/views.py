#Django Stuff
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout

from django.shortcuts import redirect

#App Stuff
from forms import SignupForm, FeedbackForm, EMAIL_MSG 

import json
import pygeoip 

gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

FEATURE_FLAG = {
    'SEARCH_ENABLED': True,
    'STATS_ENABLED': True,
    'FEEDBACK_ENABLED': True,
    'REQUEST_ENABLED': True,
    'NAV_ENABLED': True,
}

def ContextSetup(request):
    authenticated = request.user.is_authenticated()

    renderCxt = {
        'authenticated': authenticated,
        'currentPath': request.get_full_path(),
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

        if "next" in request.GET:
            request.session['next'] = request.GET['next']

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        username = request.POST['email']
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                res = {'redirect': request.session.get('next', '/')}
                return HttpResponse(json.dumps(res), mimetype="application/json")

        return HttpResponse(json.dumps({'error':'x'}), mimetype="application/json")

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
            form.save() 
            return SigninHandler(request)

        return HttpResponse(json.dumps(form.errors), mimetype="application/json")

def AdHandler(request):
    renderCxt = ContextSetup(request)
    
    t = loader.get_template('ad.html')
    c = RequestContext(request, renderCxt) 

    return HttpResponse(t.render(c))

def EntityHandler(request, pk):
    renderCxt = ContextSetup(request)
    renderCxt['specific_entity'] = True
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))

def NewEntityHandler(request):
    renderCxt = ContextSetup(request)
    t = loader.get_template('new.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))
 
def SearchPage(request, query):
    renderCxt = ContextSetup(request)
    renderCxt['QUERY'] = query
    
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))

def GraphHandler(request):
    renderCxt = ContextSetup(request)
    
    t = loader.get_template('relationshipeditor.html')
    c = RequestContext(request, renderCxt) 

    return HttpResponse(t.render(c))

def ProfileHandler(request):
    renderCxt = ContextSetup(request)

    if not renderCxt['authenticated']:
        return redirect('signin-page')

    if request.method == "GET":
        ''' Renders Profile Page '''
        t = loader.get_template('profile.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        ''' Handlers User Setting '''
        return HttpResponse(json.dumps("Not Implemented"), mimetype="application/json")

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
