from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns

from queryHandler import views, restAPI
from queryHandler import tasks

urlpatterns = patterns('',
    url(r'^entity/?$', restAPI.EntityDetail.as_view()),
    url(r'^entity/(?P<pk>[0-9]+)/?$', restAPI.EntityDetail.as_view()),
    url(r'^entitylist/$', restAPI.EntityList().as_view()),
    url(r'^attribute/$', restAPI.AttributeDetail.as_view()),
    url(r'^attribute/(?P<pk>[0-9]+)/?$', restAPI.AttributeDetail.as_view()),
    url(r'^attribute/(?P<pk>[0-9]+)/vote/?$', restAPI.VoteQueue.as_view(), {'queueType': 'attr'}),
    url(r'^attributelist/$', restAPI.AttributeList().as_view()),
    url(r'^ad/$', restAPI.AdDetail.as_view()),
    url(r'^ad/(?P<pk>[0-9]+)/?$', restAPI.AdDetail.as_view()),
    url(r'^tags/$', restAPI.TagsDetail.as_view()),
    url(r'^ae/tag$', restAPI.Autocomplete.as_view()),
    url(r'^ae/cat$', restAPI.Autocomplete.as_view()),
    url(r'^comment/$', restAPI.CommentDetail.as_view()),
    url(r'^comment/(?P<pk>[0-9]+)/?$', restAPI.CommentDetail.as_view()),
    url(r'^comment/(?P<pk>[0-9]+)/vote/?$', restAPI.VoteQueue.as_view(), {'queueType': 'cmt'}),
    url(r'^commentlist/$', restAPI.CommentList().as_view()),
    url(r'^relation/?$', restAPI.RelationDetail.as_view()),
    url(r'^relation/(?P<pk>[0-9]+)/?$', restAPI.RelationDetail.as_view()),
)
