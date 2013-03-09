from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = staticfiles_urlpatterns()

urlpatterns += patterns('',
    #url(r'^static/(?P<path>.*)$', 'django.views.static.serve'),
    url(r'^api/v0/', include('queryHandler.urls')),

    url(r'^', include('default.urls')),

    #url(r'^queryHandler/', include('queryHandler.urls')),

    # Examples:
    # url(r'^$', 'searchimagery.views.home', name='home'),
    # url(r'^searchimagery/', include('searchimagery.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

