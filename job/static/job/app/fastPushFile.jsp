

<div class="panel panel-default ijobs-innerbox">
    <div class="panel-heading none">
        <h3 class="panel-title">快速分发文件</h3>
    </div>
    <div class="panel-body mt15">
        <div class="row">
        <div id="editpushFileDiv" class="col-lg-12">
            <form id="postForm" method="post" class="form-horizontal">
                <div class="form-group">
                    <label class="control-label ijobs-label">任务名称<span class="red">&nbsp;*</span>：</label>
                    <div class="ijobs-input w800">
                        <input type="text" id="name" data-content="必填项"
                            class="form-control w700" placeholder="请输入作业名称" maxlength="50">
                        <span class="help-block m-b-none"></span>
                    </div>
                </div>
                
                
                <div class="ijobs-fastpush-box">
                    <div class="ijobs-fastpush-box-header">
                        <span class="box-header-title"><i class="fa fa-database"></i> 源文件</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：本地文件上传会有同名文件覆盖风险</span>
                        <span class="priview-span ps1" data-toggle="tooltip" data-placement="right"  
                            title="本地文件不能包含中文字符，且大小最大支持到500M">
                            <i class="fa fa-question-circle"></i>
                        </span>
                        <div class="pull-right pt10">
                            <a id="localFile" class="btn btn-info king-file-btn" type="button"><i class="fa fa-upload"></i> 添加本地文件
                                <input id="fileUpload" name="upload" type="file" multiple="multiple">
                            </a>
                            <button id="remoteFileEditBut" class="btn btn-info" type="button"><i class="fa fa-cloud"></i> 添加服务器文件</button>
                        </div>
                    </div>
                    <div class="pt5" id="fileSource"></div>              
                </div>
                    
            <div class="ijobs-fastpush-box mt30 pt0">
                <div class="ijobs-fastpush-box-header">
                    <span class="box-header-title">
                    <i class="fa fa-inbox"></i> 目标文件
                    </span>
                </div>
                <div class="form-group pt10">
                    <label class="control-label ijobs-label-fastPushFile">目标路径<span class="red">&nbsp;*</span>：</label>
                    <div class="fieldset-ijobs-input" data-content="必填项">
                        <input type="text" style="width:607px;display: inline-block" class="form-control"
                            name="txtTargetFilePath" id="txtTargetFilePath" placeholder="请填写分发路径" maxlength="255"/>
                        <span class="priview-span ps1" data-toggle="tooltip" data-placement="top"  
                            title="<div class='t1' style='width:500px;text-align:left;'>如果该路径不存在，系统将自动创建。<br/>
                                                                          文件传输目的地址的路径规则：<br/>
                            linux服务器需以 / 开头的绝对路径。例如:/data/xx<br/>
                            windows服务器必须包含盘符开头，例如：D:\tmp\</div>"
                            data-html="true">
                            <i class="fa fa-question-circle"></i>
                        </span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label ijobs-label-fastPushFile">执行账户<span class="red">&nbsp;*</span>：</label>
                    <div class="fieldset-ijobs-input">
                        <select id="userAccount" class="ijobs-user-account" style="width: 607px"></select>
                        <button id="addUserBut" class="btn btn-success" type="button" title="登记新账户"><i class="fa fa-plus"></i></button>


                        <div class="form-group" style="margin: 10px 0px 0px 0px;">
                            <div style="display: none;" id="regUserDiv">
                                <div class="well mb5">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <div class="col-sm-12">
                                            <label class="col-sm-3 control-label">账户名称<span class="red">&nbsp;*</span>：</label>
                                            <div class="col-sm-6">
                                                <input id="userName_input" type="text" class="form-control"
                                                    aria-required="true" placeholder="请输入账户名称">
                                            </div>
                                            <div class="col-sm-3">
                                                <button type="button" id="regUser"
                                                    class="btn btn btn-primary">登记账户</button>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <label id="resultMsg" style="color: red"
                                                class="col-sm-6 col-sm-offset-2 control-label"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label ijobs-label-fastPushFile">目标机器<span class="red">&nbsp;*</span>：</label>
                    <div class="fieldset-ijobs-input" id="iplist"></div>
                </div>              
            </div>
            
            <div class="form-group pt15">
            <div class="text-center " style="width:780px;margin-left:90px;">
                <hr>
                <button id="startBut" class="king-btn king-info" type="button">
                    <i class="fa fa-life-saver"></i> 开始执行
                </button>
            </div>
            </div>
        </form>         
            
        </div>
        </div>
    </div>
</div>


<!-- 服务器集合组建 -->
<div id="serverIpModel" class="none serverIp-Model-IsExist">
    <div class="row ml0 buttonGroup serverIpMode-1">
        <input type="hidden" class="hidden-serverSetId">
        <input type="hidden" class="hidden-serverip-string">
        <div class="col-sm-4 p0">
            <button type="button" class="btn btn-success showModel" style="width: 115px"><i class="fa fa-desktop"></i>&nbsp;选择服务器</button>
        </div>      
        <div class="btnGroup col-sm-8 none pr0" style="text-align: right;">
            <a class="king-btn king-noborder king-primary copy-serverip-btn min-w0">复制IP</a>
            <a class="king-btn king-noborder king-primary copy-not-installed-agent-serverip-btn min-w0">复制Agent未安装IP</a>
            <a class="king-btn king-noborder king-danger clearBtn min-w0">清空IP</a>
            <a class="king-btn king-noborder king-danger clear-not-installed-Btn min-w0">清空Agent未安装</a>
        </div>
        <div class="col-sm-12 pl0 mt10 text-left server-text none"></div>
        
    </div>  
    
    <div class="fieldset mt10 mb0 ccResultBox none tl">
        <div class="legend">CC脚本导入</div>
        <div class="container-fluid">
            <input type="hidden" class="cc-scriptId"/>
            <p>CC脚本名称：<span class="cc-name-hidden"></span></p>
            <p>CC脚本参数：<span class="cc-param-hidden"></span><span class="cc-no-param-hidden"></span></p>
            <button type="button" class="king-btn king-default king-btn-mini cc-showTest" style="position:absolute;left:10px;">测试</button>
            <button type="button" class="king-btn king-default king-btn-mini cc-showModel" style="position:absolute;right:10px;">更改</button>
        </div>
    </div>
    
    <div class="serverIpMode-2 buttonGroup-2">
        <input type="hidden" class="hidden-serverSetId-mode2">
        <input type="hidden" class="hidden-serverip-mode2">
        <!-- <ul class="show-short-ip none text-left pl10"></ul> -->
        <table class="table show-short-ip none text-left pl10" style="width:150px;">
            <thead>
                <tr>
                    <th>IP</th>
                    <th class="table-header-option-th">操作</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <div class="buttonArea-2">
            <a href="javascript:;" class="serverip-count-link text-no-number">共0台</a>
            <button type="button" class="king-btn king-default king-btn-mini showModel">添加</button>
        </div>
    </div>  
         
    <div class="serverIp-result-table serverIpMode-1">
        <table class="table table-header-bg mt40 mb0 serverIpResultTable table-bordered table-hover none">
            <thead>
                <tr>
                    <th>IP</th>
                    <th>状态</th>
                    <th class="table-header-option-th">操作</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    
    <!-- Modal -->
    <div class="modal fade serverIpModal h1000" data-backdrop="false" data-keyboard="false"
        role="dialog" >
        <div class="modal-dialog w800" role="document">
            <div class="modal-content">
                <div class="modal-loading-wrap none" style="z-index: 9999;position: absolute;left:0;top:0;width:100%;height:100%;text-align:center;vertial-align:middle;">
                        <img src="./img/loading_2_36x36.gif" style="margin-left:-18px;position:absolute;top:50%;margin-top:-36px;">
                </div>
                <div class="modal-body" style="min-height:450px;">
                        <div class="nav nav-tabs serverIpListtabs w h40 pl20 text-left">
                            <label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="1" checked> 通过IP选择服务器</label>
                            <label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="2"> 配置平台</label>
                            <label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="3"> 手动添加</label>
                            <label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="4"> 分组添加</label>
                            <label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="5"> CC脚本</label>
                        </div>
                        
                        <div class="tab-content" style="min-height:380px;position: relative;">
                            <!-- start 通过IP选择服务器 -->
                            <div class="ipList-tab-pane ipChoose-tab-pane none w p10">                               
                                    <input type="search" class="form-control w filterText"
                                        placeholder="通过IP、主机名按Enter进行过滤...">
                                    <span class="glyphicon glyphicon-search form-control-feedback search-feedback" style="color: #3596e0;font-size: 16px;top: 10px;right: 10px;cursor:pointer;pointer-events:auto !important;"></span>
                                    <table class="table table-header-bg mt10 w serverIp-result-table-thead table-hover serverIpTable"
                                        style="margin-bottom: -1px;">
                                        <thead>
                                            <tr>
                                                <th><input type="checkbox" class="selectedAllChecks" title="当前页"></th>
                                                <th>平台名称</th>
                                                <th>IP</th>
                                                <th>状态</th>
                                                <th>主机名</th>
                                            </tr>
                                        </thead>
                                    </table>                                 
                            </div>
                            <!-- end 通过IP选择服务器 -->
                            
                            <!-- start 配置平台 -->
                            <div class="ipList-tab-pane configCenter-tab-pane none w p10">
                                <div style="height: 384px; overflow: auto;text-align: left;" class="treeviewDiv">
                                    <div class="treeviewByAjax"></div>
                                </div> 
                            </div>
                            <!-- end 配置平台 -->
                            
                            <!-- start 手动添加 -->
                            <div class="ipList-tab-pane manually-tab-pane none w p10" >
                                <!-- <textarea class="form-control server-ip-textarea" rows="3" placeholder="请输入IP，以“空格”或者“回车”或者“;”分隔"  style="height: 375px"></textarea> -->
                                <div>
                                    <label class="control-label">平台来源 ：</label>
                                    <div class="ijobs-input plat-name-box" style="width:550px;">
                                        
                                    </div>
                                    <div class="plat-area-box">
                                        
                                    </div>
                                </div>
                                
                                                        
                            </div>
                            <!-- end 手动添加 -->

                            <!-- start 服务器集 -->
                            <div class="ipList-tab-pane group-tab-pane none w p10" >
                                <input type="text" class="form-control w groupfilterText"
                                    placeholder="通过名称、描述进行过滤...">
                                <table class="table table-header-bg mt10 w serverIp-result-table-thead table-hover groupTable"
                                    style="margin-bottom: -1px;">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">&nbsp;</th>
                                            <th style="width: 25%">分组名称</th>
                                            <th style="width: 70%">描述</th>
                                        </tr>
                                    </thead>
                                </table>                                    
                            </div>
                            <!-- end 服务器集 -->
                            
                            <!-- start cc脚本 -->
                            <div class="ipList-tab-pane cc-tab-pane none w p10 tl" >
                                <div class="row mb10">
                                    <label  class="col-sm-2 control-label">CC脚本导入<span class="red">&nbsp;*</span>：</label>
                                    <div class="col-sm-10">
                                        <select class="form-control w cc-name"></select>
                                    </div>
                                </div>
                                
                                <div class="row mb10">
                                    <label  class="col-sm-2 control-label">入口参数：</label>
                                    <div class="col-sm-10">
                                        <input class="form-control cc-param" style="float:left;max-width:531px;margin-right:5px;" maxlength="25" placeholder="请输入测试用的脚本参数，无则不填"/>
                                        <a href="javascript:void(0)" class="btn btn-success cc-test-btn">获取结果</a>
                                    </div>
                                </div>
                                
                                <div class="row mb10">
                                    <label  class="col-sm-2 control-label">测试结果：</label>
                                    <div class="col-sm-10">
                                          <textarea class="form-control w cc-test-rs" placeholder="请点击'测试结果'按钮进行测试" style="resize: none;height:300px;"></textarea> 
                                          <span style="color:red">请确保CC脚本获取结果中第一行一定要包含InnerIP或OuterIP字段，如果没有，则在作业中使用此CC脚本时会导致导入IP列表为空。</span>     
                                          <span class="cc-ip-count"></span>                     
                                    </div>
                                </div>
                            </div>
                            <!-- end cc脚本 -->
                        </div>
                </div>
                <div class="modal-footer">
                    <label class="pr10 radio-inline fl"><input type="checkbox" class="selectAll"> 全选</label>
                    <button type="button" class="btn btn-success fl copyIPByPage">复制已选IP</button>
                    <button type="button" class="btn btn-success fl copyAllPageIP">复制全部IP</button>
                    <input type="text" maxlength="25" class="form-control fl groupNameInput none" style="width:200px;" placeholder="请输入分组名称" disabled/>
                    <button type="button" class="btn btn-default groupbtn fl none" disabled>保存为分组</button>
                    <button type="button" class="btn btn-primary savebtn">添加</button>
                    <button type="button" class="btn btn-default cancelbtn">取消</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal -->
    <div class="modal fade resultModal serverIpMode-2 h1000" data-backdrop="false" data-keyboard="false" role="dialog" >
        <div class="modal-dialog" role="document">
            <div class="modal-content text-left">
                <div class="modal-body">
                    <table class="table table-header-bg mt40 mb0 serverIpMode2Table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>IP</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default hideMode2">关闭</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal -->
    <div class="modal fade ccResultModal  h1000" data-backdrop="false" data-keyboard="false" role="dialog" >
        <div class="modal-dialog" role="document">
            <div class="modal-content text-left">
                <div class="modal-body">
                    <table class="table table-header-bg mt40 mb0 ccModeTable table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>IP</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default ccHideMode">关闭</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 服务器集合组建 -->


<!--  
    快速执行脚本和快速分发文件页面的执行结果页面
--> 
    <div id="slideClips" class="right-slide-clips none" style="position:fixed;right:16px;top:45%;z-index:2990"><img alt="" src="./img/show_result.png"></div>
    <div class="right-slide-panel" id="script-slide-panel" style="min-width:1100px;">
            <div class="right-slide-panel-header">
                <button class="btn btn-warning btn-return">返回</button>
            </div>
            <br />
            
            <div class="panel panel-default" style="border:none;">
            <div class="panel-body">
            <div class="right-slide-panel-cont">
                <div class="ibox float-e-margins">
                    <div class="ibox-content" style="overflow:hidden">
                        <div class="progress progress-striped">
                            <div id="progressBarDiv" style="width: 50%"
                                class="progress-bar progress-bar-success"></div>
                        </div>
                        <table class="table table-bordered mt15 ijobs-resultTable" id="resultTable">
                            <tbody>
                                <tr>
                                    <td width="80"><small>节点名称</small></td>
                                    <td><i class="fa"></i> <span id="taskName"></span></td>
                                    <td width="80"><small>节点类型</small></td>
                                    <td><i class="fa"></i> <span id="taskType"></span></td>
                                    <td width="80"><small>执行账户</small></td>
                                    <td><i class="fa"></i> <span id="operator"></span></td>
                                    <td width="80"><small>总时间(s)</small></td>
                                    <td><i class="fa fa-clock-o"></i> <span id="totalTime"></span></td>
                                </tr>
                                <tr>
                                    <td><small>节点状态</small></td>
                                    <td><i class="fa"></i> <span id="taskStatus"></span></td>
                                    <td><small>开始时间</small></td>
                                    <td><i class="fa fa-clock-o"></i> <span id="startTime"></span></td>
                                    <td><small>结束时间</small></td>
                                    <td><i class="fa fa-clock-o"></i> <span id="endTime"></span></td>
                                    <td><small id="tableLastTdTitle">&nbsp;</small></td>
                                    <td><span id="tableLastTdcontent"></span></td>
                                </tr>
                            </tbody>
                        </table>
                        <hr>
                        <div class="panel-options" style="margin-bottom:15px;">
                            <ul class="nav nav-tabs" id="stepAnalyseResult">
                            <!--  
                            <li class="active"><a data-toggle="tab" aria-expanded="true" resulttype="101">脚本执行失败(1)</a></li>
                            --> 
                            </ul>
                        </div>

                        <div class="tab-content">
                            <div id="tab-1" class="tab-pane active"></div>
                            <div id="tab-2" class="tab-pane"></div>

                            <div class="input-group panel-setp-result">
                                <input type="text" placeholder="输入搜索内容" id ="searchText"
                                    class="input form-control"> 
                                <span class="input-group-btn ijobs-fastExecuteScript-searchIp">
                                    <!-- <button type="button" class="btn btn btn-primary"
                                        style="margin-right: 5px;">
                                        <i class="fa fa-search"></i> 搜索IP
                                    </button> -->
                                    <button id="searchByLog" type="button" class="btn btn btn-primary">
                                        <i class="fa fa-search"></i> 搜索日志
                                    </button>
                                </span>
                            </div>
                            <br />
                            <div class="row panel-setp-result">
                                <div class="col-sm-5" style="height: 300px;min-width:450px;">
                                    <table id="ipTable" class="table table-bordered" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th>平台名称</th>
                                                <th>IP</th>
                                                <th id="returnCode" class="none">返回码</th>
                                                <th>耗时(s)</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                <div class="col-sm-7 p0" style="height: 300px;">
                                    <div class="form-control " id="logContent" style="height: 100%; width: 98%;background-color: #1C2026; overflow-y: auto;   color: #fff;">                                
                                    </div>
<!--                                    <textarea class="form-control" id="logContent"
                                        placeholder="点击IP显示查询结果" style="height: 100%; width: 100%;" readonly="readonly"></textarea> -->
                                     
                                </div>
                            </div>                                                          
                            <div class="row panel-setp-detail none">
                                <div id="setp-detail-script" class="none"> 
                                    <div class="form-group">
                                        <label class="control-label ijobs-label">脚本内容：</label>
                                        <div class="ijobs-input">
                                            <div id="codeDiv" class="code"></div>                               
                                        </div>
                                    </div>
                                    <div class="form-group" style="line-height: 34px;">
                                        <label class="control-label ijobs-label">脚本参数：</label>
                                        <div class="ijobs-input">
                                            <input type="text" id="scriptParam" class="form-control" readonly>                      
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label ijobs-label">超时时间&nbsp;：</label> 
                                        <input type="number" id="scriptTimeout" class="form-control ijobs-input" name="scriptTimeout" readonly>
                                    </div>
                                </div>
                                
                                <div id="setp-detail-file" class="none">
                                    <div class="form-group" style="line-height: 34px;">
                                        <label class="control-label ijobs-label">目标路径：</label>
                                        <div class="ijobs-input">
                                            <input type="text" id="fileTargetPath" class="form-control" readonly>                       
                                        </div>
                                    </div>
                                    <div class="form-group" style="line-height: 34px;">
                                        <label class="control-label ijobs-label">源文件：</label>
                                        <div class="ijobs-input">
                                             <table id="fastPushFileTable" class="table table-bordered table-hover" data-content="必填项">
                                                <thead>
                                                    <tr style="background: #f6f8f8; border-top: 2px solid rgb(74, 155, 255) !important;">
                                                        <th style="text-align: center;">文件列表</th>
                                                        <th style="text-align: center;">服务器地址</th>
                                                        <th style="text-align: center;">执行账户</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbodyView"></tbody>
                                            </table>                                
                                        </div>
                                    </div>
                                </div>
                            </div>                                                          
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </div>










<script type="text/javascript" src="./js/common/serverIpList/serverIpList.js"></script>
<script type="text/javascript" src="./js/common/fileTransferModule/fileTransferModule.js"></script>
<script type="text/javascript" src="./js/app/fastExecuteResult.js"></script>
<script type="text/javascript" src="./js/app/fastPushFile.js"></script>






