from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns

from default import views 

urlpatterns = patterns('',
    url(r'^feedback$', views.FeedbackHandler),
    url(r'^advertise$', views.AdHandler),
    url(r'^privacy$', views.PrivacyHandler),
    url(r'^$', views.PageHandler)
)
