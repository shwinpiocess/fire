

<style>
/*  	input{
	    border-color: white !important;
    	background-color: white !important;;
    }  */
</style>
<div class="panel panel-default ijobs-innerbox" id="panel-0">
 	<button id="returnBtn" class="pull-right btn btn-warning" style="margin-top:1px;margin-right:2px;">返回</button>
	<div class="panel-heading none">
		<h3 class="panel-title">预览作业</h3>		
	</div>
	<div class="panel-body">
		<div class="container-fluid">
			<div class="form-horizontal">
				<input type="hidden" id="taskId">
				<div class="form-group">
					<label class="control-label ijobs-label-w105">作业名称：</label>
					<div class="ijobs-input">
						<input type="text" class="form-control w400" id="task-name" readonly>
					</div>
				</div>
				<!-- 步骤分组外层box start  -->
				<div class="form-group" id ="group-box">
					<ul class="group-ul" id="group-ul">
					</ul>
				</div> 
				<div class="form-group">
					<div class="text-center">						 
						<button class="king-btn king-danger m10" type="button" id="runTask">
							<i class="fa fa-life-saver"></i>&nbsp;执行
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 脚本模版 start -->
<div id="script-template" class="none">
	 
	<ul class="group-node-ul">
		<li class="group-node-li group-node-header">
			<div class="group-node-top group-node-top1">
				<img src="img/j.png" style="width:46px;height:46px;margin-top:-1px;">
				<label class="control-label mt5 ml10">步骤名称：</label>
				<input type="text" class="form-control group-name-input mt5" readonly/>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-down step-down-right">
					<i class="fa fa-chevron-down"></i></a> 
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-up step-up-right">
					<i class="fa fa-chevron-up"></i></a>
				 
					
			</div>
			<table class="group-node-table table table-out-bordered">
				<tr class="name-tr">
					<th class="text-center">节点名称</th>
					<th class="text-center">执行账户</th>
					<th class="text-center">服务器数</th>
					<th class="text-center">脚本参数</th>
					<th class="text-center">操作</th>
				</tr>
			</table>
		</li>
		<li class="group-node-li group-node-footer none"></li>
	</ul>
</div>
<!-- 脚本模版 end -->

<!-- 脚本节点模版 start  -->
<div id="script-n-template" class="none">
	<form>
	<table class="group-node-table table table-out-bordered table-condensed">
		<tr class="name-tr">
			<td class="td_step_name"><input type="text" class="form-control step_name_input"/></td>
			<td class="td_step_accout">
				<input type="text" class="form-control step_accout_sel"/>
			</td><td class="td_step_service"><input type="text" class="form-control step_service_input"/></td>
			<td class="td_step_param"><input type="text" class="form-control step_param_input"/></td>
			<td class="td_step_oper">
			<div class="step_oper_div_min checkbox-inline">
				<label>
					<input type="checkbox" class="isExecute-checkbox" name="isExecute" checked>&nbsp;<span>是否执行</span>&nbsp;&nbsp;&nbsp;
				</label>
				<span class="glyphicon glyphicon-eye-open show-step" aria-hidden="true" title="查看步骤详情"></span> 
			 </div>
			</td>
		</tr>
		<tr class="tag-tr">
			<td colspan="5" class="tag_td"> 
				<div class="form-group mt15">
					<label class="control-label ijobs-label-min">脚本内容：</label>
					<div class="ijobs-input">
						<div class="code"></div>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label ijobs-label-min">服务器集：</label>
					<div class="ijobs-input">
						<div class="iplist"></div>
					</div>
				</div>
			</td>
		</tr>
		<tr class="text-tr none">
			<td class="text-right"><label class="control-label ijobs-label-min">暂停描述：</label></td>
			<td colspan="3">
				<div class="row ml0 mr0">
					<input type="text" class="form-control step_text_input">
				</div>
			</td>
			<td>&nbsp;</td>
		</tr>
	</table>
	</form>
</div>
<!-- 脚本节点模版 end  -->

<!-- 文件模版 start -->
<div id="file-template" class="none">
	<ul class="group-node-ul">
		<li class="group-node-li group-node-header">
			<div class="group-node-top group-node-top2">
				<img src="img/w.png" style="width:46px;height:46px;margin-top:-1px;">
				<label class="control-label mt5 ml10">步骤名称：</label>
				<input type="text" class="form-control group-name-input mt5" readonly/>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-down step-down-right">
					<i class="fa fa-chevron-down"></i></a> 
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-up step-up-right">
					<i class="fa fa-chevron-up"></i></a>
			  
			</div>
			<table class="group-node-table table table-out-bordered">
				<tr class="name-tr">
					<th class="text-center">节点名称</th>
					<th class="text-center">执行账户</th>
					<th class="text-center">目标机器</th>
					<th class="text-center">目标路径</th>
					<th class="text-center">操作</th>
				</tr>
			</table>
		</li>
		<li class="group-node-li group-node-footer none"></li>
	</ul>
</div>
<!-- 文件模版 end -->

<!-- 文件节点模版 start  -->
<div id="file-n-template" class="none">
	<table class="group-node-table table table-out-bordered table-condensed">
		<tr class="name-tr">
			<td class="td_step_name"><input type="text" class="form-control step_name_input"/></td>
			<td class="td_step_accout">
				<!-- <select  class="form-control step_accout_sel"></select> -->
				<input type="text" class="form-control step_accout_sel">
			</td>					
			<td class="td_step_service"><input type="text" class="form-control step_service_input"/></td>
			<td class="step_path_input"><input type="text" class="form-control step_path_input"/></td>
			<td class="td_step_oper">
			<div class="step_oper_div_min checkbox-inline">
				<label>
					<input type="checkbox" class="isExecute-checkbox" name="isExecute" checked>&nbsp;<span>是否执行</span>&nbsp;&nbsp;&nbsp;
				</label>
				<span class="glyphicon glyphicon-eye-open show-step" aria-hidden="true"  title="查看步骤详情"></span> 
			</div> 
			</td>
		</tr>
		<tr class="tag-tr">
			<td colspan="5" class="tag_td">
				<div class="form-group mt15">
					<label class="control-label ijobs-label-min">文件列表：</label>
					<div class="ijobs-input">
						<div class="file-table"></div>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label ijobs-label-min">目标机器：</label>
					<div class="ijobs-input">
						<div class="iplist"></div>
					</div>
				</div>
			</td>
		</tr>
		<tr class="text-tr none">
			<td class="text-right"><label class="control-label ijobs-label-min">暂停描述：</label></td>
			<td colspan="3">
				<div class="row ml0 mr0">
					<input type="text" class="form-control step_text_input">
				</div>
			</td>
			<td>&nbsp;</td>
		</tr>
	</table>
</div>
	<input type="hidden" id="taskInstanceId">
<!-- Modal -->
		<div class="modal fade" id="task-success" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document" style="width: 400px;">
				<div class="modal-content">
					<div class="modal-body text-center">
						<h3>任务执行中...</h3>
						<br/>
						<button class="btn btn-success" id="task-detail" type="button" data-dismiss="modal">查看执行详情</button>
						<button class="btn btn-primary" id="task-return" type="button" data-dismiss="modal">返回作业列表</button>
						
						<br/><br/><br/>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Modal -->
		
<!-- 文件节点模版 end  -->



<!-- 服务器集合组建 -->
<div id="serverIpModel" class="none serverIp-Model-IsExist">
	<div class="row ml0 buttonGroup serverIpMode-1">
		<input type="hidden" class="hidden-serverSetId">
		<input type="hidden" class="hidden-serverip-string">
		<div class="col-sm-5 p0">
			<button type="button" class="btn btn-success showModel" style="width: 115px"><i class="fa fa-desktop"></i>&nbsp;选择服务器</button>
		</div>		
		<div class="btnGroup col-sm-7 none pr0" style="text-align: right;">
			<a class="king-btn king-noborder king-primary copy-serverip-btn min-w0">复制IP</a>
			<a class="king-btn king-noborder king-danger clearBtn min-w0">清空IP</a>
			<a class="king-btn king-noborder king-danger clear-not-installed-Btn min-w0">清空Agent未安装</a>
		</div>
		<div class="col-sm-12 pl0 mt10 text-left server-text none"></div>
		
	</div>	
	
	<div class="serverIpMode-2 buttonGroup-2">
		<input type="hidden" class="hidden-serverSetId-mode2">
		<input type="hidden" class="hidden-serverip-mode2">
		<ul class="show-short-ip none text-left pl10"></ul>
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
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-loading-wrap none" style="z-index: 9999;position: absolute;left:0;top:0;width:100%;height:100%;text-align:center;vertial-align:middle;">
						<img src="./img/loading_2_36x36.gif" style="margin-left:-18px;position:absolute;top:50%;margin-top:-36px;">
				</div>
				<div class="modal-body h450">
						<div class="nav nav-tabs serverIpListtabs w h40 pl20 text-left">
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="1" checked disabled> 通过IP选择服务器</label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="2" disabled> 配置平台</label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="3" disabled> 手动添加</label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="4" disabled> 分组添加</label>
						</div>
						
						<div class="tab-content" style="min-height:380px;position: relative;">
							<!-- start 通过IP选择服务器 -->
							<div class="ipList-tab-pane ipChoose-tab-pane w p10">								 
									<input type="text" class="form-control w filterText"
										placeholder="通过IP、主机名、Agent状态进行过滤...">
									<table class="table table-header-bg mt10 w serverIp-result-table-thead table-hover serverIpTable"
										style="margin-bottom: -1px;">
										<thead>
											<tr>
												<th><input type="checkbox" class="selectedAllChecks" title="所有页"></th>
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
								<div style="height: 384px; overflow: auto;text-align: left;" class="treeviewDiv"><div class="treeviewByAjax"></div></div> 
							</div>
							<!-- end 配置平台 -->
							
							<!-- start 手动添加 -->
							<div class="ipList-tab-pane manually-tab-pane none w p10" >
								<textarea class="form-control server-ip-textarea" rows="3" placeholder="请输入IP，以“空格”或者“回车”或者“;”分隔"  style="height: 375px"></textarea>							
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
						</div>
				</div>
				<div class="modal-footer">
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
</div>
<!-- 服务器集合组建 -->







<script type="text/javascript" src="./js/common/serverIpList/serverIpList.js"></script>
<script type="text/javascript" src="./js/common/fileTransferModule/fileTransferModule.js"></script>
<script type="text/javascript" src="./js/app/previewTask.js"></script>


