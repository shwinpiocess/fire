<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>

<title>蓝鲸作业平台</title>

<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/"; 
%>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="ijobs">
<link href="<%=basePath%>/css/bk_app_theme.css" rel="stylesheet">


<body class="king-errorpage-middle">
<div class="king-exception-box king-500-page">
    <img src="<%=basePath%>/img/expre_500.png">        
    <h3>系统出现异常</h3>
    <a href="<%=basePath%>index.jsp" class="king-btn king-info king-noborder">返回首页</a>
</div>
</body>
</html>
