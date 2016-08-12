# -*- coding: utf-8 -*-

from django.shortcuts import render, redirect
from django.contrib import auth
from django.http import JsonResponse


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


def index(request):
    return render(request, 'job/index.html')


def fastExecuteScript(request):
    """快速脚本执行"""
    if request.method == 'GET':
        return render(request, 'job/fastExecuteScript.html')