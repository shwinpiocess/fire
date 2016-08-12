<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>蓝鲸作业平台</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="ijobs">
<link href="../css/bk_app_theme.css" rel="stylesheet">
<link href="../css/fontawesome/css/font-awesome.css" rel="stylesheet">
<% 
    String serverName = request.getServerName();
    if(serverName.indexOf(".qcloud.")>0 || serverName.indexOf(".tencent.")>0){
        //腾讯分析平台需要的统计代码 
        out.println("<script src=\"https://o.qcloud.com/static_api/bk_api/api.js\"></script>");
    }else if(serverName.indexOf(".bkclouds.")>0){
        out.println("<script src=\"http://o.bkclouds.cc/static_api/bk_api/api.js\"></script>");
    }
%>


<script>
    function redirect() {
        var localHostName = window.self.location.hostname;
        if (localHostName.indexOf(".qcloud.") > 0) {
            Bk_api.open_other_app('cc-new', 'http://cc.o.qcloud.com/app/newapp');
        } else if (localHostName.indexOf(".tencent.") > 0) {
            Bk_api.open_other_app('bkcc');
        } else if (localHostName.indexOf(".bkclouds.") > 0) {
            Bk_api.open_other_app('cc', 'http://cc.o.bkclouds.cc/app/newapp');
        } 
    };
</script>

<body class="king-errorpage-middle">
<div class="king-exception-box king-500-page">
    <img src="../img/expre_403.png">
   	<h2 >您在"${sessionScope.OwenerName}"开发商的业务列表下暂无权限</h2>
    <div style="text-align: left;margin-left:77px;">
    	<p style="margin-bottom:10px;margin-top:30px;font-size:16px;font-weight:bold;">你可以：</p>
    	<p>1、前往“<a href="javascript:void(0);" onclick="redirect();" style="color: #2A73D0;" id="redirectLink">配置平台</a>”创建属于您自己的业务；</p>
        <p>2、联系(${sessionScope.OwenerUin})为您开通相关业务的“业务运维”权限。</p>
        <br/>
        <p>
        	<a href="http://119.29.41.122/" target="_blank" style="color: #2A73D0; background:#CAE6FC;text-decoration: none;padding:8px;">体验Demo</a>
        </p>
    </div>
</div>

</body>
</html>
