
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

<jsp:include page="serverIpList_comp.jsp"></jsp:include>
<jsp:include page="_include.jsp">
	<jsp:param name="js"
		value="js/common/serverIpList/serverIpList.js,
			js/common/fileTransferModule/fileTransferModule.js,
			js/app/previewTask.js
			" />
</jsp:include>