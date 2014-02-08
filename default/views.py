#Django Stuff
from django.http import *
from django.template import RequestContext, loader
from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout

from django.shortcuts import redirect

#App Stuff
from forms import SignupForm, FeedbackForm, EMAIL_MSG 

import logging
import json
import pygeoip 

import rredis

# Get an instance of a logger
logger = logging.getLogger(__name__)
r = rredis.getRedisConnection()
gi = pygeoip.GeoIP(settings.PROJECT_ROOT+'/../db/GeoLiteCity.dat', pygeoip.MEMORY_CACHE)

DEFAULT_EXPIRY = 600

FEATURE_FLAG = {
    'SEARCH_ENABLED': True,
    'STATS_ENABLED': True,
    'FEEDBACK_ENABLED': True,
    'REQUEST_ENABLED': True,
    'NAV_ENABLED': True,
}

def ContextSetup(request):
    authenticated = request.user.is_authenticated()

    logger.info("User Session: " + str(request.session.session_key))


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

def SigninHandler(request, redirected = False):
    if request.method == "GET":
        if request.user.is_authenticated():
            return HttpResponseRedirect(reverse('profile-page') + "self")

        renderCxt = ContextSetup(request)
        renderCxt['REDIRECTED'] = redirected
        renderCxt['SEARCH_ENABLED'] = False
        renderCxt['SIGN_IN_DISABLED'] = True
        renderCxt['FEEDBACK_ENABLED'] = False

        t = loader.get_template('signin.html')
        c = RequestContext(request, renderCxt) 

        if "next" in request.GET:
            request.session['next'] = request.GET['next']

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        username = request.POST['username'].lower()
        password = request.POST['password']

        user = authenticate(username=username, password=password)

        if user and user.is_active:
            login(request, user)

            logger.info("Graph Id: " + str(user.clover.neo4jId))
            usertoken = request.session.session_key
            r.set(usertoken, user.clover.neo4jId)

            res = {'redirect': request.session.get('next', '/')}
            response = HttpResponse(json.dumps(res), mimetype="application/json")
            response.set_cookie("username", user.username)
            response.set_cookie("userid", user.clover.neo4jId)
            response.set_cookie("usertoken", usertoken)
            return response

        return HttpResponse(json.dumps({'error':'Authentication failed'}), mimetype="application/json")

def SignoutHandler(request, nextPage):
    if request.method == "GET":
        logout(request)
        response = redirect(nextPage)
        response.delete_cookie('usertoken')
        response.delete_cookie('sessionid')
        response.delete_cookie('userid')
        return response

def SignupHandler(request):
    if request.method == "GET":
        if request.user.is_authenticated():
            return HttpResponseRedirect(reverse('profile-page') + "self")

        renderCxt = ContextSetup(request)
        renderCxt['SEARCH_ENABLED'] = False

        t = loader.get_template('signup.html')
        c = RequestContext(request, renderCxt) 

        return HttpResponse(t.render(c))

    elif request.method == "POST":
        form = SignupForm(request.POST)

        if form.is_valid():
            if not form.save():
                return HttpResponseServerError(
                    json.dumps({"error": "Please try again later."}))
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
    renderCxt['not_new'] = True
    t = loader.get_template('main.html')
    c = RequestContext(request, renderCxt)

    return HttpResponse(t.render(c))

def NewEntityHandler(request):
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

def GraphHandler(request):
    renderCxt = ContextSetup(request)
    
    t = loader.get_template('relationshipeditor.html')
    c = RequestContext(request, renderCxt) 

    return HttpResponse(t.render(c))

def ProfileHandler(request, profileId):
    renderCxt = ContextSetup(request)

    if not renderCxt['authenticated']:
        return SigninHandler(request, True) #HttpResponseRedirect(reverse('signin-page'))

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
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse('profile-page') + "self")

    ipaddr = request.META.get('HTTP_X_REAL_IP', '127.0.0.1')
    geoInfo = gi.record_by_addr(ipaddr)
    #defaultQuery = " ".join([geoInfo['city']]) #,geoInfo['country_name']])

    renderCxt = ContextSetup(request)

    renderCxt['DEFAULT_QUERY'] = '' #defaultQuery
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
