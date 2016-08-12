{% load staticfiles %}
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript">
      var _speedMark = new Date();
  </script>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>蓝鲸作业平台</title>
    <base href="{% static 'job/' %}">
    <!-- 以下所有引用的文件路径请根据实际项目中文件地址修改 -->
    <!-- Bootstrap css -->
    <link href="./css/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="./css/fontawesome/css/font-awesome.css" rel="stylesheet">
    <!-- 以下两个插件用于在IE8以及以下版本浏览器支持HTML5元素和媒体查询，如果不需要用可以移除 -->
    <!--[if lt IE 9]>
    <script src="js/html5shiv.min.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->

    <!--蓝鲸平台APP 公用的样式文件 -->
    <link href="./js/common/dataTables/dataTables.bootstrap.css" rel="stylesheet">
    <link href="./js/common/jqueryUI/jquery-ui.min.css" rel="stylesheet">
    <link href="./js/common/jqueryUI/theme.css" rel="stylesheet">
    <link href="./js/common/ux/CodeMirror/lib/codemirror.css" rel="stylesheet">
    <link href="./js/common/ux/CodeMirror/theme/erlang-dark.css" rel="stylesheet">
    <link href="./js/common/ux/CodeMirror/addon/display/fullscreen.css" rel="stylesheet">
    <link href="./js/common/chosen/chosen.css" rel="stylesheet">
    <link href="./js/common/pnotify/pnotify.custom.min.css" rel="stylesheet">
    <link href="./js/common/kendoUITreeView/kendo.common.min.css" rel="stylesheet">  
    <link href="./js/common/kendoUITreeView/kendo.default.min.css" rel="stylesheet">  
    <link href="./css/bk_base.css" rel="stylesheet">
    <link href="./css/bk_app_theme.css" rel="stylesheet">
    <link href="css/ijobs.css" rel="stylesheet">
  <script type="text/javascript">
        var basePath = 'http://127.0.0.1:8000/';
        var APPID = "46";
        var CsrfKey = "{{ csrf_token }}";
        var uin = "1842605324";
        var isNewUser = false;
        var maintainers = ["1842605324"];
        var LEVEL = 2;
        var statueArr = ['等待执行','正在执行','执行成功','执行失败','跳过','忽略错误','等待用户','手动结束','状态异常','步骤强制终止中','步骤强制终止成功','步骤强制终止失败'];
        // 状态： 0.系统错误、1.Agent 异常、3.上次已成功、5.等待执行、7.正在执行、9.执行成功、11.执行失败、13.任务超时、15.任务日志错误、101.脚本执行失败、102.脚本执行超时、202.拷贝文件失败
        var ipErrorType = [0,1,11,13,15,101,102,202];
        var extraObj = {}; //扩展参数，误删
        var sourceArr = {};//平台名称
    </script>
    
</head>
<body style="background-color:#fafafa;"> 
  <!-- ijobs封面 -->
  <div id="cover" style="z-index:3000;position: fixed;top:0;left:0;height:100%;width:100%;text-align: center;display: none;">
    <div style="width:100%;height:100%;background: #000;opacity: 0.5;"></div>
    <img src="./img/cover.png" style="position: fixed;top:60px;left:50%;width:900px;height:600px;margin-left:-450px;"/>
    <a class="king-btn king-btn-icon king-round king-default" title="关闭" style="position: fixed;top:80px;left:50%;margin-left:400px;" id="coverClose">
             <i class="fa fa-close btn-icon"></i>
        </a>
  </div>
  <!-- ijobs封面 end -->
    <header class="king-main-header" style="z-index:2000;">
      <div style="width:230px;" class="pull-left">
        <a class="logo" href=".">
          <img alt="logo" src="./img/ijobs.png">
          <span class="logo-lg">蓝鲸作业平台</span>
        </a>
        <a class="navbar-minimalize  pull-right" href="#" style="font-size:22px;min-width:20px;padding:12px 0;height:44px;"></a>
      </div>
      <nav class="navbar">
        <div class="king-business-select pull-left dropdown ml20">
            <span>当前业务：</span>
            <span><select name="APPID" id="APPID" style="height: 34px;width: 248px;border: 1px solid #ccc;"></select></span>
        </div>  
        <a href="http://119.29.41.122/" target="_blank" class="btn btn-success" style="color:#fff;position:absolute;right:100px; top: 7px;">体验Demo</a>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav"> 
            <li class="dropdown">
              <a aria-expanded="false" aria-haspopup="true" role="button" data-toggle="dropdown" class="dropdown-toggle" href="#" id="drop4">帮助中心
                <span class="caret"></span>
              </a>
              <ul aria-labelledby="drop4" class="dropdown-menu" id="menu1">
                <li><a href="filedata/help_document.pdf" target="_blank">使用文档</a></li>
                <li><a href="javascript:;" id="menu1-instruction">平台介绍</a></li>
                <li><a href="http://bk.tencent.com/wiki/course/" target="_blank">视频演示</a></li>
              </ul>
            </li>  
          </ul>
        </div>
      </nav>
    </header>

    <div class="king-layout6-main">
    <!-- 左边 start -->
    <div class="king-layout6-sidebar" style=" background:#293038">
        <section class="king-sidebar" style="height: auto;">
          <ul class="king-sidebar-menu">
            <li class="treeview">
              <!-- <a href="./app/main.jsp" class="main home" id="home">
                <i class="fa fa-home"></i>
                <span>首页</span>
              </a> -->
              <a href="./app/main.jsp" class="main" class="home" id="home">
                <i class="fa fa-home"></i>
                <span>首页</span>
              </a>
            </li> 
            <li class="treeview">
              <a href="#">
                <i class="fa fa-calendar-o"></i>
                <span>作业执行</span>
                <span class="fa fa-angle-right pull-right"></span>
              </a>
              <ul class="treeview-menu" style="background: #1C2026;">
                <li><a href="./app/fastExecuteScript.jsp" class="fastExecuteScript"><i class="fa"></i>快速脚本执行</a></li> 
                <li><a href="./app/fastPushFile.jsp" class="fastPushFile"><i class="fa"></i>快速分发文件</a></li>
                <li><a href="./app/jobList.jsp" class="jobList"><i class="fa"></i>常用作业执行</a></li> 
                <li><a href="./app/newTask.jsp" class="newTask"><i class="fa"></i>新建作业</a></li> 
                <li><a href="./app/crontabTaskList.jsp" class="crontabTaskList"><i class="fa"></i>定时作业</a></li>
              </ul>
            </li>
            <li class="treeview">
              <a href="#">
                <i class="fa fa-briefcase"></i>
                <span>业务管理</span>
                <span class="fa fa-angle-right pull-right"></span>
              </a>
              <ul class="treeview-menu" style="background: #1C2026;">
                <li><a href="./app/userList.jsp"><i class="fa"></i>账户管理</a></li>
                <li><a href="./app/scriptList.jsp"><i class="fa"></i>脚本管理</a></li>
                <li><a href="./app/groupList.jsp"><i class="fa"></i>分组管理</a></li>
              </ul>
            </li>
<!--              <li class="treeview"> -->
<!--               <a href="#"> -->
<!--                 <i class="glyphicon glyphicon-phone"></i> -->
<!--                 <span>移动端作业管理</span> -->
<!--                 <span class="fa fa-angle-right pull-right"></span> -->
<!--               </a> -->
<!--               <ul class="treeview-menu" style="background: #1C2026;"> -->
<!--                 <li><a href="./app/mJobList.jsp"><i class="fa"></i>移动作业列表</a></li> -->
<!--                 <li><a href="./app/mRegister.jsp"><i class="fa"></i>注册移动作业</a></li> -->
<!--               </ul> -->
<!--             </li> -->
            <li class="treeview">
              <a href="#">
                <i class="fa fa-list-alt"></i>
                <span>执行历史</span>
                <span class="fa fa-angle-right pull-right"></span>
              </a>
              <ul class="treeview-menu" style="background: #1C2026;">
                <li><a href="./app/taskInstanceList.jsp"><i class="fa"></i>执行历史</a></li>
              </ul>
            </li>
          </ul>
        </section>
    </div>
    <!-- 左边 end -->
 
    <!-- 右边 start -->
    <div class="king-layout6-content">
       <section style="padding:0 15px;display:none;">
          <ol class="breadcrumb" style="margin-bottom:0;border-bottom:1px solid #eee;background:none;border-radius:0;padding-left:5px;">
            <li id='breadcrumb-2'><i class="fa fa-dashboard"></i></li>
            <li id='breadcrumb-3'></li>
          </ol>
        </section>
        <section class="king-content"></section>
    </div>
    <!-- 右边 end -->
</div>

<!-- confirmModal 方法  start 勿删 -->
<div id="confirmModal" class="modal fade bs-example-modal-sm">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header modal-header2">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="confirmModalTitle"></h4>
      </div>
      <div class="modal-body text-center" id="confirmModalContent"></div>
      <div class="modal-footer modal-footer-center">
        <button type="button" class="btn btn-primary btn-sm" id="yBtn">确定</button>
        <button type="button" class="btn btn-default btn-sm" id="cBtn">取消</button>        
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!-- confirmModal 方法  start 勿删 -->
<div id="confirmModal_yesNoCancel" class="modal fade bs-example-modal-sm">
  <div class="modal-dialog modal-sm" style="width: 360px;">
    <div class="modal-content">
      <div class="modal-header modal-header2">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body text-center" id="confirmModalContent_yesNoCancel"></div>
      <div class="modal-footer modal-footer-center">
        <!-- <button type="button" class="btn btn-default btn-sm" id="yBtn_yesNoCancel">同名文件覆盖</button> -->
        <button type="button" class="btn btn-default btn-sm" id="nBtn_yesNoCancel">追加源IP目录</button>        
        <button type="button" class="btn btn-primary btn-sm" id="cBtn_yesNoCancel">继续修改</button>        
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!-- confirmModal start 勿删 -->

<!-- 如果要使用Bootstrap的js插件，必须先调入jQuery -->
<script src="./js/jquery-1.10.2.min.js"></script>
<script src="./js/jquery.i18n.properties.min.js"></script>
<script src="./js/common/jqueryUI/jquery-ui.min.js"></script>
<script src="./js/common/jqueryUI/datepicker-zh-CN.js"></script>
<!-- 包括所有bootstrap的js插件或者可以根据需要使用的js插件调用　-->
<script src="./js/bootstrap/js/bootstrap.min.js"></script>
<script src="./js/common/chosen/chosen.jquery.js"></script>
<script src="./js/common/dataTables/jquery.dataTables.js"></script>
<script src="./js/common/dataTables/dataTables.bootstrap.js"></script>
<script src="./js/common/jqueryUpload/jquery.iframe-transport_11.js"></script>
<script src="./js/common/jqueryUpload/jquery.ui.widget_11.js"></script>
<script src="./js/common/jqueryUpload/jquery.fileupload.js"></script>
<script src="./js/common/asyncUpload/asyncUpload.min.js"></script>
<script src="./js/common/ux/ZeroClipboard/ZeroClipboard.min.js"></script>
<script src="./js/common/kendoUITreeView/kendo.all.min.js"></script>
<script src="./js/common/ux/CodeMirror/lib/codemirror.js"></script>
<script src="./js/common/ux/CodeMirror/mode/shell/shell.js"></script>
<script src="./js/common/ux/CodeMirror/mode/perl/perl.js"></script>
<script src="./js/common/ux/CodeMirror/mode/python/python.js"></script>
<script src="./js/common/ux/CodeMirror/mode/clike/clike.js"></script>
<script src="./js/common/ux/CodeMirror/CodeMirror.js"></script>
<script src="./js/common/ux/CodeMirror/addon/display/fullscreen.js"></script>
<script src="./js/common/pnotify/pnotify.custom.min.js"></script>
<script src="./js/app/app.js"></script>
<script src="./js/app/common.js"></script>
</body>
</html>
<!--MODULE_END-->
