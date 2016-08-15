from django.conf.urls import include, url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'login/$', views.login_user, name='login'),
    url(r'fastExecuteScript/$', views.fastExecuteScript, name='fastExecuteScript'),
    # url(r'main/$', views.main, name='main'),
    url(r'nm/personal/appAction!getPlatId.action$', views.getPlatId, name='getPlatId'),
    url(r'nm/personal/appAction!getAppList.action$', views.getAppList, name='getAppList'),
    url(r'nm/personal/appAction!switchApp.action$', views.switchApp, name='switchApp'),
    url(r'nm/personal/appAction!getStatistic.action$', views.getStatistic, name='getStatistic'),
    url(r'nm/personal/appAction!getIpList.action$', views.getIpList, name='getIpList'),
    url(r'nm/components/accountAction!searchAccountList.action$', views.searchAccountList, name='searchAccountList'),
    url(r'nm/personal/appAction!getCCModuleTree.action$', views.getCCModuleTree, name='getCCModuleTree'),
    url(r'nm/components/nmServerSetAction!searchServerSet.action$', views.searchServerSet, name='searchServerSet'),
    url(r'nm/components/scriptAction!getScriptList.action$', views.getScriptList, name='getScriptList'),
    url(r'nm/jobs/taskResultAction!searchTaskResultList.action$', views.searchTaskResultList, name='searchTaskResultList'),
    url(r'nm/jobs/crontabAction!getCrontabTaskList.action$', views.getCrontabTaskList, name='getCrontabTaskList'),
	url(r'nm/jobs/jobsAction!getTaskList.action$', views.getTaskList, name='getTaskList'),
    url(r'nm/components/scriptAction!saveScript.action$', views.saveScript, name='saveScript'),
]
