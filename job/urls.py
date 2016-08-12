from django.conf.urls import include, url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'login/$', views.login_user, name='login'),
	url(r'fastExecuteScript/$', views.fastExecuteScript, name='fastExecuteScript'),
]
