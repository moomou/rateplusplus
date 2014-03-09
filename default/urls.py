from django.conf.urls import patterns, include, url
from django.contrib.auth.views import logout

from default import views 

urlpatterns = patterns('',
    url(r'^feedback$', views.FeedbackHandler),
    url(r'^advertise$', views.AdHandler),
    url(r'^entity/(?P<pk>[0-9]+)/?$', views.EntityHandler),
    url(r'^entity/new/?$', views.NewEntityHandler),
    url(r'^graph$', views.GraphHandler),
    url(r'^profile/(.+)?/?$', views.ProfileHandler, name="profile-page"),

    url(r'^signup', views.SignupHandler, name="signout-page"),
    url(r'^signin$', views.SigninHandler, {'redirected': False}, name="signin-page"),
    url(r'^signout$', views.SignoutHandler, {'nextPage': '/signin'}),
    url(r'^privacy$', views.PrivacyHandler),
    url(r'^ranking/[.+]?', views.SearchPage, {'query': ''}),

    url(r'^(.+)/?$', views.GenericPageHandler),
    url(r'^$', views.RedirectHandler)
)
