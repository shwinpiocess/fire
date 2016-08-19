# -*- coding: utf-8 -*-

import json
import base64
import datetime
import traceback

from django.shortcuts import render, redirect
from django.contrib import auth
from django.core import serializers
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import *
from .constant import *


def login_user(request):
    if request.method == 'GET':
        return render(request, 'job/login.html')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = auth.authenticate(username=username, password=password)
        if user:
            auth.login(request, user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'msg': {'message': u'用户名或密码错误'}})

@csrf_exempt
def inventories(request):
    taskInstanceId = request.POST.get('taskInstanceId', 0)
    task_instance = Taskinstance.objects.filter(id=taskInstanceId)
    if task_instance:
        return JsonResponse(task_instance[0].inventory)
    return JsonResponse({})


@csrf_exempt
def event(request):
    try:
        kwargs = json.loads(request.body)

        if kwargs.get('event') == 'profile_task':
            print '111111111111111111111111111111'
            print kwargs
            event_data = kwargs.get('event_data', {})
            name = event_data.get('name')
            step_instance = Stepinstance.objects.filter(playTaskName=name)
            if step_instance:
                step_instance = step_instance[0]
                if 'startTime' in event_data:
                    startTime = event_data['startTime'].encode('utf-8')
                    step_instance.startTime = timezone.make_aware(datetime.datetime.strptime(startTime, "%Y-%m-%dT%H:%M:%S.%fZ"))
                    step_instance.status = 2
                if 'endTime' in event_data:
                    endTime = event_data['endTime'].encode('utf-8')
                    step_instance.endTime = timezone.make_aware(datetime.datetime.strptime(endTime, "%Y-%m-%dT%H:%M:%S.%fZ"))
                    step_instance.status = 3
                step_instance.save()
                #Stepinstance.objects.filter(playTaskName=name).update(**new_kwargs)
        else:
            StepInstanceEvent.objects.create(**kwargs)

        return JsonResponse({'success': True})
    except Exception, e:
        print traceback.format_exc()


def index(request):
    return render(request, 'job/index.jsp')


def main(request):
    return render(request, 'job/main.html')


def fastExecuteScript(request):
    """快速脚本执行"""
    if request.method == 'GET':
        return render(request, 'job/fastExecuteScript.html')


def getPlatId(request):
    data = {
        "data": {
            "1": "腾讯云",
            "2": "58",
            "3": "私有云",
            "4": "腾讯云_金融区",
            "5": "腾讯云_VPC区",
            "6": "AWS_新加坡",
            "7": "AWS_北美",
            "8": "私有云_专区2",
            "9": "私有云_专区3",
            "10": "投后_专区2",
            "11": "投后_专区3"
        },
        "success": True
    }
    if request.method == 'POST':
        return JsonResponse(data)


def getAppList(request):
    data = {
        "totalCount": 1,
        "data": [
            {
                "groupList": [
                    {
                        "id": 46,
                        "groupId": 0,
                        "applicationName": u"球球大作战demo",
                        "companyId": 15,
                        "appType": 0
                    }
                ],
                "groupName": "巨人手游"
            }
        ]
    }
    if request.method == 'POST':
        return JsonResponse(data)


def switchApp(request):
    data = {'success': True, 'msg': {'message': u'业务切换成功'}}
    if request.method == 'POST':
        return JsonResponse(data)


def getStatistic(request):
    data = {
        "data": {
            "instanceDate": {
                "total": [
                    4,
                    33,
                    13,
                    2,
                    4,
                    12,
                    25,
                    7,
                    17,
                    38,
                    3,
                    3,
                    14,
                    23,
                    59,
                    30,
                    18,
                    4,
                    2,
                    19,
                    9,
                    14,
                    29,
                    19,
                    16,
                    1,
                    80,
                    50,
                    31,
                    44,
                    32
                ],
                "date": [
                    "07-13",
                    "07-14",
                    "07-15",
                    "07-16",
                    "07-17",
                    "07-18",
                    "07-19",
                    "07-20",
                    "07-21",
                    "07-22",
                    "07-23",
                    "07-24",
                    "07-25",
                    "07-26",
                    "07-27",
                    "07-28",
                    "07-29",
                    "07-30",
                    "07-31",
                    "08-01",
                    "08-02",
                    "08-03",
                    "08-04",
                    "08-05",
                    "08-06",
                    "08-07",
                    "08-08",
                    "08-09",
                    "08-10",
                    "08-11",
                    "08-12"
                ],
                "success": [
                    4,
                    26,
                    9,
                    2,
                    4,
                    10,
                    23,
                    6,
                    15,
                    15,
                    3,
                    3,
                    13,
                    19,
                    55,
                    29,
                    16,
                    4,
                    2,
                    19,
                    7,
                    12,
                    19,
                    13,
                    16,
                    1,
                    80,
                    36,
                    30,
                    40,
                    30
                ]
            },
            "task": 2,
            "instanceTotalTime": {
                "total": 655,
                "fiveToTen": 0,
                "oneToThree": 5,
                "tenToHalf": 0,
                "lessThanOne": 650,
                "threeToFive": 0,
                "moreThanHalf": 0
            },
            "instanceStatus": {
                "total": 655,
                "blank": 0,
                "fail": 26,
                "waiting": 0,
                "running": 68,
                "success": 561
            },
            "crontab": {
                "pause": 1,
                "total": 1,
                "finish": 0,
                "run": 0
            },
            "ip": {
                "total": 3,
                "inactive": 0,
                "alive": 3
            },
            "instanceList": [
                {
                    "taskId": -1,
                    "taskInstanceId": 2322,
                    "createTime": "2016-08-12 17:14:30",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 17:14:31",
                    "operator": "test",
                    "startTime": "2016-08-12 17:14:30",
                    "startWay": 1,
                    "name": "123",
                    "currentStepId": 7909,
                    "totalTime": 0.212
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2321,
                    "createTime": "2016-08-12 17:00:25",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 17:00:25",
                    "operator": "test",
                    "startTime": "2016-08-12 17:00:25",
                    "startWay": 1,
                    "name": "执行脚本-2016812165935431",
                    "currentStepId": 7908,
                    "totalTime": 0.181
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2320,
                    "createTime": "2016-08-12 16:23:41",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 16:23:42",
                    "operator": "test",
                    "startTime": "2016-08-12 16:23:42",
                    "startWay": 1,
                    "name": "执行脚本-201681216234313",
                    "currentStepId": 7907,
                    "totalTime": 0.171
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2319,
                    "createTime": "2016-08-12 16:23:37",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 16:23:37",
                    "operator": "test",
                    "startTime": "2016-08-12 16:23:37",
                    "startWay": 1,
                    "name": "执行脚本-201681215314649",
                    "currentStepId": 7906,
                    "totalTime": 0.14
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2318,
                    "createTime": "2016-08-12 15:32:13",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 15:32:13",
                    "operator": "test",
                    "startTime": "2016-08-12 15:32:13",
                    "startWay": 1,
                    "name": "执行脚本-201681215314649",
                    "currentStepId": 7905,
                    "totalTime": 0.211
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2317,
                    "createTime": "2016-08-12 15:14:38",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 15:14:44",
                    "operator": "test",
                    "startTime": "2016-08-12 15:14:38",
                    "startWay": 1,
                    "name": "分发文件-201681215540695",
                    "currentStepId": 7904,
                    "totalTime": 5.117
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2316,
                    "createTime": "2016-08-12 14:18:53",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 14:18:53",
                    "operator": "test",
                    "startTime": "2016-08-12 14:18:53",
                    "startWay": 1,
                    "name": "执行脚本-201681213524071",
                    "currentStepId": 7903,
                    "totalTime": 0.171
                },
                {
                    "taskId": 2,
                    "taskInstanceId": 2315,
                    "createTime": "2016-08-12 13:50:57",
                    "appId": 46,
                    "status": 4,
                    "operationList": None,
                    "endTime": "2016-08-12 13:50:58",
                    "operator": "test",
                    "startTime": "2016-08-12 13:50:57",
                    "startWay": 1,
                    "name": "服务器之间传文件和执行脚本",
                    "currentStepId": 7902,
                    "totalTime": 0.232
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2314,
                    "createTime": "2016-08-12 13:47:55",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 13:47:55",
                    "operator": "test",
                    "startTime": "2016-08-12 13:47:55",
                    "startWay": 1,
                    "name": "执行脚本-2016812134649681",
                    "currentStepId": 7900,
                    "totalTime": 0.188
                },
                {
                    "taskId": -1,
                    "taskInstanceId": 2313,
                    "createTime": "2016-08-12 13:47:42",
                    "appId": 46,
                    "status": 3,
                    "operationList": None,
                    "endTime": "2016-08-12 13:47:42",
                    "operator": "test",
                    "startTime": "2016-08-12 13:47:42",
                    "startWay": 1,
                    "name": "执行脚本-2016812134649681",
                    "currentStepId": 7899,
                    "totalTime": 0.153
                }
            ]
        },
        "success": True
    }
    if request.method == 'POST':
        return JsonResponse(data)


def getIpList(request):
    """获取IP列表"""
    data = {
        "data": [
            {
                "source": 1,
                "alived": 1,
                "ipDesc": "Demo_Agent_91",
                "ip": "10.104.50.91"
            },
            {
                "source": 1,
                "alived": 1,
                "ipDesc": "Demo_Server_177",
                "ip": "10.104.139.177"
            },
            {
                "source": 1,
                "alived": 1,
                "ipDesc": "Demo_Agent_220",
                "ip": "10.104.36.220"
            }
        ],
        "success": True
    }
    if request.method == 'POST':
        return JsonResponse(data)


def searchAccountList(request):
    data = {
        "draw": 0,
        "start": 0,
        "length": -1,
        "recordsTotal": 2,
        "recordsFiltered": 2,
        "data": [
            {
                "account": "qqdz",
                "appId": 46,
                "creater": "admin",
                "createTime": "2015-12-02 11:39:37"
            },
            {
                "account": "root",
                "appId": 46,
                "creater": "admin",
                "createTime": "2015-11-26 12:03:20"
            }
        ]
    }
    if request.method == 'POST':
        return JsonResponse(data)


def getScriptList(request):
    # data = {
    #     "draw": 0,
    #     "start": 0,
    #     "length": -1,
    #     "recordsTotal": 15,
    #     "recordsFiltered": 15,
    #     "data": [
    #         {
    #             "scriptId": 31,
    #             "name": "版本发布-启用监控",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:11:38",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 30,
    #             "name": "版本发布-停止监控",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:11:38",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 27,
    #             "name": "版本发布-备份DB",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:07:52",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 26,
    #             "name": "版本发布-备份线上程序",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:07:52",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 23,
    #             "name": "版本发布-对外开端口",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:01:01",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 22,
    #             "name": "版本发布-对外停端口",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 12:01:01",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 19,
    #             "name": "版本发布-启动前端进程",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 18,
    #             "name": "版本发布-启动后台进程",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 17,
    #             "name": "版本发布-更新DB",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 16,
    #             "name": "版本发布-更新版本文件",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 15,
    #             "name": "版本发布-停DB",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 14,
    #             "name": "版本发布-停后台进程",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 13,
    #             "name": "版本发布-停前端进程",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-11 11:47:23",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:13:18",
    #             "taskName": ""
    #         },
    #         {
    #             "scriptId": 5,
    #             "name": "显示主机名",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-02 18:16:14",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-11 12:12:21",
    #             "taskName": "批量服务器上执行脚本"
    #         },
    #         {
    #             "scriptId": 4,
    #             "name": "ls目录/tmp/demo/",
    #             "type": 1,
    #             "isPublic": 0,
    #             "appId": 46,
    #             "creater": "test",
    #             "createTime": "2015-12-02 17:17:38",
    #             "lastModifyUser": "test",
    #             "lastModifyTime": "2015-12-02 18:12:02",
    #             "taskName": "服务器之间传文件和执行脚本"
    #         }
    #     ]
    # }
    if request.method == 'POST':
        print request.POST
        app_id = int(request.META.get('HTTP_APPID'))
        username = request.user.username

        scripts = Script.objects.all()

        payload = {}
        payload['draw'] = 0
        payload['start'] = 0
        payload['length'] = -1
        payload['recordsTotal'] = scripts.count()
        payload['recordsFiltered'] = scripts.count()
        data = []
        for script in scripts:
            s = {
                "scriptId": script.id,
                "name": script.NAME,
                "type": script.TYPE,
                "isPublic": script.isPublic,
                "appId": script.appId,
                "creater": script.creater,
                "createTime": script.createTime,
                "lastModifyUser": script.lastModifyUser,
                "lastModifyTime": script.lastModifyTime,
                "taskName": ""
            }
            data.append(s)
        payload['data'] = data
        return JsonResponse(payload)


def getCCModuleTree(request):
    data = {"data":[{"text":"业务机","items":[{"text":"proxy","moduleId":11471,"hostNum":1},{"text":"cent","moduleId"
:11472,"hostNum":1},{"text":"room","moduleId":11473,"hostNum":2}],"hostNum":4,"expanded":True,"setId"
:9669}],"success":True}
    if request.method == 'POST':
        return JsonResponse(data)


def getCCHosts(request):
    servers = {
        '11471': {
            "data": [
                {
                    "source": 3,
                    "alived": 1,
                    "ipDesc": "chjansibleproxy",
                    "ip": "10.20.32.146"
                }
            ],
            "success": True
        },
        '11472': {
            "data": [
                {
                    "source": 3,
                    "alived": 1,
                    "ipDesc": "qgzcent1",
                    "ip": "123.207.80.104"
                }
            ],
            "success": True
        },
        '11473': {
            "data": [
                {
                    "source": 3,
                    "alived": 1,
                    "ipDesc": "qgzroom1",
                    "ip": "123.207.80.102"
                },
                {
                    "source": 3,
                    "alived": 1,
                    "ipDesc": "qgzroom2",
                    "ip": "123.207.80.103"
                }
            ],
            "success": True
        }
    }
    if request.method == 'POST':
        ccModuleIds = request.POST.get('ccModuleIds')
        data = servers[ccModuleIds]
        return JsonResponse(data)


def searchServerSet(request):
    data = {"draw":0,"start":0,"length":-1,"recordsTotal":0,"recordsFiltered":0,"data":[]}
    if request.method == 'POST':
        return JsonResponse(data)


def searchTaskResultList(request):
    """执行历史"""
    data = {"draw":1,"start":0,"length":10,"recordsTotal":3,"recordsFiltered":3,"data":[{"taskInstanceId":445400
,"taskId":550,"appId":8939,"name":"a","operator":"1842605324","startWay":1,"currentStepId":686349,"status"
:4,"startTime":"2016-08-01 15:39:36","endTime":"2016-08-01 15:39:51","totalTime":15.092,"createTime"
:"2016-08-01 15:39:36","operationList":None,"mobileTaskId":0},{"taskInstanceId":437692,"taskId":544,"appId"
:8939,"name":"fdfdf","operator":"1842605324","startWay":1,"currentStepId":678594,"status":4,"startTime"
:"2016-07-26 22:57:13","endTime":"2016-07-26 22:57:29","totalTime":15.106,"createTime":"2016-07-26 22:57:13","operationList":None,"mobileTaskId":0},{"taskInstanceId":437673,"taskId":543,"appId":8939,"name"
:"fdf","operator":"1842605324","startWay":1,"currentStepId":678575,"status":3,"startTime":"2016-07-26 22:34:08","endTime":"2016-07-26 22:34:23","totalTime":15.085,"createTime":"2016-07-26 22:34:07","operationList"
:None,"mobileTaskId":0}]}
    if request.method == 'POST':
        return JsonResponse(data)


def getCrontabTaskList(request):
    """定时作业"""
    data = {"draw":1,"start":0,"length":10,"recordsTotal":0,"recordsFiltered":0,"data":[]}
    if request.method == 'POST':
        return JsonResponse(data)

def getTaskList(request):
    """获取作业列表"""
    data = {"draw":0,"start":0,"length":-1,"recordsTotal":3,"recordsFiltered":3,"data":[{"id":550,"appId":8939,"name"
:"a","ipList":"","serverSetId":0,"creater":"1842605324","createTime":"2016-08-01 15:35:36","lastModifyUser"
:"1842605324","lastModifyTime":"2016-08-01 15:35:48","stepNum":2},{"id":544,"appId":8939,"name":"fdfdf"
,"ipList":"","serverSetId":0,"creater":"1842605324","createTime":"2016-07-26 22:57:02","lastModifyUser"
:"1842605324","lastModifyTime":"2016-07-26 22:57:02","stepNum":1},{"id":543,"appId":8939,"name":"fdf"
,"ipList":"","serverSetId":0,"creater":"1842605324","createTime":"2016-07-26 22:34:01","lastModifyUser"
:"1842605324","lastModifyTime":"2016-07-26 22:34:01","stepNum":1}]}
    if request.method == 'POST':
        data = []

        tasks = Task.objects.all()
        for task in tasks:
            data.append({
                'id': task.id,
                'appId': task.appId,
                'name': task.name,
                'ipList': task.ipList,
                'serverSetId': task.serverSetId,
                'creater': task.creater,
                'createTime': timezone.localtime(task.createTime).strftime('%Y-%m-%d %H:%M:%S'),
                'lastModifyUser': task.lastModifyUser,
                'lastModifyTime': timezone.localtime(task.lastModifyTime).strftime('%Y-%m-%d %H:%M:%S'),
                'stepNum': task.stepNum
            })
        return JsonResponse({"draw":0,"start":0,"length":-1,"recordsTotal":tasks.count(),"recordsFiltered":tasks.count(),"data":data})


def saveScript(request):
    """新建脚本"""
    if request.method == 'POST':
        app_id = int(request.META.get('HTTP_APPID'))
        username = request.user.username

        script_id = request.POST.get('scriptId')
        name = request.POST.get('name')
        content = request.POST.get('content')
        type = int(request.POST.get('type'))

        if not name or not content:
            return JsonResponse({"msg":{"message":u"必填参数为空","msgType":2},"success":False})

        if script_id:
            script = Script.objects.get(id=script_id)
            if script:
                if app_id != script.app_id:
                    return JsonResponse({"msg":{"message":u"权限不足","msgType":2},"success":False})
        else:
            if Script.objects.filter(name=name, app_id=app_id):
                return JsonResponse({"msg":{"message":u"脚本名称【{0}】已被使用，请修改名称后保存！".format(name),"msgType":2},"success":False})
            create_kwargs = {'app_id': app_id, 'creater': username, 'name': name, 'type': type, 'modifier': username, 'content': content}
            Script.objects.create(**create_kwargs)
            return JsonResponse({"msg":{"message":"脚本名称【{0}】保存成功!".format(name),"msgType":1},"success":True})


def saveTask(request):
    """新建作业"""
    if request.method == 'POST':
        appId = int(request.META.get('HTTP_APPID'))
        username = request.user.username

        name = request.POST.get('name')
        steps = request.POST.get('steps')
        taskId = int(request.POST.get('taskId'))


        if not name or not steps:
            return JsonResponse({"msg":{"message":u"必填参数为空","msgType":2},"success":False})

        try:
            steps = json.loads(steps)
            print "="* 80
            print json.dumps(steps, indent=4)
            print '='*80

            if not steps:
                return JsonResponse({"msg":{"message":u"缺少步骤信息","msgType":2},"success":False})
        except Exception, e:
            return JsonResponse({"msg":{"message":u"缺少步骤信息","msgType":2},"success":False})

        # 步骤合法性检查
        for step in steps:
            result = check_step_parameters(appId, step)
            if result != 'success':
                return result
            

        if taskId > 0:
            task = Task.objects.filter(id=taskId)
            if task:
                task = task[0]
                if appId != task.appId:
                    return JsonResponse({"msg":{"message":u"权限不足","msgType":2},"success":False})

                if name != task.name and Task.objects.filter(name=name, appId=appId).exists():
                    return JsonResponse({"msg":{"message":u"作业名称【{0}】已被使用，请修改名称后保存！".format(name),"msgType":2},"success":False})

                task.name = name
                task.steps = steps
                task.save()
                blocks = convert_to_step_block(task.steps)
                data = {
                    'taskId': task.id,
                    'blocks': blocks
                }
                return JsonResponse({'data': data, 'success' : True})
        else:
            if Task.objects.filter(name=name, appId=appId):
                return JsonResponse({"msg":{"message":u"作业名称【{0}】已被使用，请修改名称后保存！".format(name),"msgType":2},"success":False})

            kwargs = {
                'name': name,
                'appId': appId,
                'creater': username,
                'lastModifyUser': username,
            }
            task = Task.objects.create(**kwargs)
            task.steps = steps
            blocks = convert_to_step_block(task.steps)
            data = {
                'taskId': task.id,
                'blocks': blocks
            }
            return JsonResponse({'data': data, 'success' : True})

            
def check_step_parameters(appId, step):
    """步骤参数合法性检查"""
    name = step.get('name')
    type = int(step.get('type'))
    ord = step.get('ord')
    account = step.get('account')
    ipList = step.get('ipList')
    serverSetId = int(step.get('serverSetId'))
    stepId = int(step.get('stepId'))

    if not name or type <= 0 or ord <=0:
        return JsonResponse({"msg":{"message":u"参数不合法","msgType":2},"success":False})

    if not account:
        return JsonResponse({"msg":{"message":u"缺少账户信息","msgType":2},"success":False})

    if not ipList and serverSetId <= 0:
        return JsonResponse({"msg":{"message":u"缺少服务器IP信息","msgType":2},"success":False})

    if type == TYPE_SCRIPT:
        if stepId > 0:
            step = Step.objects.filter(id=stepId)
            if step:
                step = step[0]
                if step.name != name and Step.objects.filter(name=name, appId=appId).exists():
                    return JsonResponse({"msg":{"message":u"执行脚本名称重复","msgType":2},"success":False})

            elif Script.objects.filter(NAME=name, appId=appId):
                return JsonResponse({"msg":{"message":u"执行脚本名称重复","msgType":2},"success":False})

        elif Script.objects.filter(NAME=name, appId=appId):
            return JsonResponse({"msg":{"message":u"执行脚本名称重复","msgType":2},"success":False})

    if type == TYPE_FILE:
        file_source = step.get('fileSource', '[]')
        file_source = json.loads(file_source)

        if not file_source:
            return JsonResponse({"msg":{"message":u"缺少源文件信息","msgType":2},"success":False})
        
        file_target = step.get('fileTargetPath')
        if not file_target:
            return JsonResponse({"msg":{"message":u"缺少目标路径","msgType":2},"success":False})

    return 'success'


def convert_to_step_block(steps):
    """将步骤转换成block形式"""
    max_block = 1
    for step in steps:
        if step.blockOrd > max_block:
            max_block = step.blockOrd
    # 
    blocks = []
    for i in xrange(1, max_block + 1):
        block = {}
        s = []
        for step in steps:
            if step.blockOrd == i:
                ipList = step.ipList
                ips = [item.split(':')[-1] for item in ipList.split(',')]
                ipListStatus = []
                for ip in ips:
                    ipListStatus.append({
                        "valid": 1,
                        "source": 3,
                        "alived": 1,
                        # "name": "host14",
                        "ip": ip
                    })
                data = {
                    "createTime": step.createTime.strftime('%Y-%m-%d %H:%M:%S'),
                    "scriptTimeout": step.scriptTimeout,
                    "isPause": step.isPause,
                    "appId": step.appId,
                    "fileTargetPath": step.fileTargetPath,
                    "ord": step.ord,
                    "creater": step.creater,
                    "ipListStatus": ipListStatus,
                    "type": step.type,
                    "fileSource": step.fileSource,
                    "serverSetId": step.serverSetId,
                    "ipList": step.ipList,
                    "name": step.name,
                    "ccScriptId": step.ccScriptId,
                    "scriptId": step.scriptId,
                    "stepId": step.id,
                    "paramType": step.paramType,
                    "taskId": step.taskId,
                    "fileSpeedLimit": step.fileSpeedLimit,
                    "text": step.text,
                    "blockName": step.blockName,
                    "blockOrd": step.blockOrd,
                    "account": step.account,
                    "ccScriptParam": step.ccScriptParam,
                    "scriptParam": step.scriptParam,
                    # "companyId": 
                }
                if step.scriptId and step.scriptId > 0:
                    script = Script.objects.get(pk=step.scriptId)
                    data['scriptContent'] = base64.decodestring(script.content)
                    data['scriptType'] = script.TYPE
                s.append(data)

        if s:
            block['blockOrd'] = i
            block['blockName'] = s[0]['blockName']
            block['type'] = s[0]['type']
            block['steps'] = s
            blocks.append(block)
    return blocks


def getTaskDetail(request):
    """获取作业详情"""
    if request.method == 'POST':
        appId = int(request.META.get('HTTP_APPID'))
        username = request.user.username
        taskId = int(request.POST.get('taskId'))

        if taskId > 0:
            task = Task.objects.filter(id=taskId)
            if not task:
                return JsonResponse({"msg":{"message":u"作业不存在！","msgType":2},"success":False})

            task = task[0]
            if appId != task.appId:
                return JsonResponse({"msg":{"message":u"权限不足","msgType":2},"success":False})

            blocks = convert_to_step_block(task.steps)
            data = {
                'taskId': task.id,
                'createTime': timezone.localtime(task.createTime).strftime('%Y-%m-%d %H:%M:%S'),
                'lastModifyUser': task.lastModifyUser,
                'creater': task.creater,
                'taskName': task.name,
                'lastModifyTime': timezone.localtime(task.lastModifyTime).strftime('%Y-%m-%d %H:%M:%S'),
                'blocks': blocks
            }
            return JsonResponse({'data': data, 'success' : True})


def executeTask(request):
    """执行任务"""
    if request.method == 'POST':
        taskId = request.POST.get('taskId')
        stepIds = request.POST.get('stepIds')

        if not taskId:
            return JsonResponse({"msg":{"message":u"参数不合法","msgType":2},"success":False})

        task = Task.objects.filter(id=taskId)
        if not task:
            return JsonResponse({"msg":{"message":u"作业不存在！","msgType":2},"success":False})

        task = task[0]
        appId = int(request.META.get('HTTP_APPID'))
        username = request.user.username
        if appId != task.appId:
                return JsonResponse({"msg":{"message":u"权限不足","msgType":2},"success":False})


        kwargs = {
            'operator': username,
            'taskId': task.id,
            'appId': appId,
            'stepIds': stepIds,
            'name': task.name,
        }
        task_instance = task.create_task_instance(**kwargs)

        if not task_instance:
            return JsonResponse({"msg": {"message": u"作业【】启动失败!", "msgType": 1},"success": False})

        result = task_instance.signal_start(**{})
        if not result:
            return JsonResponse({"msg": {"message": u"作业【】启动失败!", "msgType": 1},"success": False})

        return JsonResponse({
            "data": {
                "taskInstanceName": task_instance.name,
                "taskInstanceId": task_instance.id
            },
            "msg": {
                "message": u"作业【%s】启动成功!" % task_instance.name,
                "msgType": 1
            },
            "success": True
        })


def getTaskResult(request):
    """获取任务结果"""
    if request.method == 'POST':
        appId = int(request.META.get('HTTP_APPID'))
        username = request.user.username

        taskInstanceId = request.POST.get('taskInstanceId')
        
        if not taskInstanceId:
            return JsonResponse({"msg":{"message":u"参数不合法","msgType":2},"success":False})

        task_instance = Taskinstance.objects.filter(pk=taskInstanceId)
        if not task_instance:
            return JsonResponse({"msg":{"message":u"作业实例不存在","msgType":2},"success":False})

        task_instance = task_instance[0]

        if appId != task_instance.appId:
            return JsonResponse({"msg":{"message":u"权限不足","msgType":2},"success":False})

        instance_info = {
            "taskId": task_instance.taskId,
            "taskInstanceId": task_instance.id,
            "createTime": task_instance.createTime,
            "appId": task_instance.appId,
            "status": task_instance.status,
            "operationList": [],
            "endTime": timezone.localtime(task_instance.endTime).strftime('%Y-%m-%d %H:%M:%S') if task_instance.endTime else None,
            "operator": task_instance.operator,
            "startTime": timezone.localtime(task_instance.startTime).strftime('%Y-%m-%d %H:%M:%S'),
            "startWay": task_instance.startWay,
            "name": task_instance.name,
            "mobileTaskId": task_instance.mobileTaskId,
            "totalTime": task_instance.totalTime if task_instance.totalTime else 0,
            #"totalTime": task_instance.totalTime,
            "currentStepId": task_instance.currentStepId
        }
        data = {
            "md5": "bb053404832b1b5f528960f10bec4510",
            "data": {
                "isFinished": task_instance.status != 1 and task_instance.status != 2,
                "blocks": task_instance.blocks,
                "taskInstance": instance_info
            },
            "success": True
        }
        return JsonResponse(data)
