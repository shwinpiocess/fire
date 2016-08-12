<style>
	
</style>
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading none">
		<h3 class="panel-title">定时作业</h3>
	</div>
	<div class="panel-body mt15">
		<form class="form-inline">
			<div class="fieldset mb20 pb15">
				<div class="legend">查询条件</div>
				<div class="container-fluid">
					<div class="row">
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">定时任务：</label>
							<input type="text" id="name" class="form-control searchInput" placeholder="请输入任务名称">
						</div>
						
						<div class="form-group col-sm-4 pd0 none">
							<label class="filter-label">描述：</label>
							<input type="text" id="des" class="form-control searchInput" placeholder="请输入">
						</div>
						
						<div class="form-group col-sm-4 pd0" style="position: relative	;">
							<label class="filter-label">创建人：</label>
							<input type="text" id="creater" class="form-control searchInput" placeholder="请输入创建人帐号">
							<span class="autocomplete-me " id="createrMe">我</span> 
						</div>
						
						<div class="form-group col-sm-4 pd0" style="position: relative;">
							<label class="filter-label">最后修改人：</label>
							<input type="text" id="lastModifyUser" class="form-control searchInput" placeholder="请输入修改人帐号">
							<span class="autocomplete-me " id="lastModifyUserMe">我</span> 
						</div>
						
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">状态：</label>
							<select id="status" class="form-control searchInput">
								<option value="-1" selected>全部</option>
								<option value="1">已启动</option>
								<option value="2">已暂停</option>
								<option value="3">已完成</option>
							</select>
						</div>
						
						<div class="form-group col-sm-4 pd0 create-date-group">
							<label class="filter-label" for="exampleInputName2">创建时间：</label>
 							<input type="text" id="createTimeStart" style="width: 100px;" class="form-control searchInput start-date" placeholder="开始日期" readonly="readonly">
							<span style="margin-left: 5px; margin-right: 5px; ">-</span>
							<input type="text" id="createTimeEnd" style="width: 100px;" class="form-control searchInput end-date" placeholder="结束日期" readonly="readonly">
						</div>
						
						<div class="form-group col-sm-4 pd0 edit-date-group">
							<label class="filter-label" for="exampleInputName2">修改时间：</label>
						 	<input type="text" id="lastModifyTimeStart" style="width: 100px;" class="form-control searchInput start-date" placeholder="开始日期" readonly="readonly">
							<span style="margin-left: 5px; margin-right: 5px; ">-</span>
							<input type="text" id="lastModifyTimeEnd" style="width: 100px;" class="form-control searchInput end-date" placeholder="结束日期" readonly="readonly">
						</div>
					</div> 
					<hr class="mt10 mb15">
					<div class="text-left" >
						<button type="button" id="findBtn" class="king-btn king-info"><i class="fa fa-search"></i> 查询</button>
						&nbsp;
						<button type="button" id="resetBtn" class="king-btn king-success"><i class="fa fa-refresh"></i> 重置</button>
					</div>
				</div>
			</div>
		</form>

		<button type="button" id="addBtn" class="king-btn king-info">新建</button>
	
		<table cellpadding="0" cellspacing="0" border="0"
			class="table table-striped table-bordered mt20 ijobs-userList-resultTable" id="resultTable">
			<thead>
				<tr>
					<th class="text-left">定时任务</th>
					<!--  <th>描述</th>-->
					<th class="text-left">作业名称</th>
					<th class="text-left">定时表达式</th>
					<th class="text-left">创建人</th>
					<th class="text-left">创建时间</th>
					<th class="text-left">最后修改人</th>
					<th class="text-left">最后修改时间</th>
					<th class="text-left">当前状态</th>
					<th class="text-center">操作</th>
				</tr>
			</thead>		 
		</table>
		
		<!-- Modal -->
		<div class="modal fade h1000" id="crontab-time-modal" tabindex="-1" role="dialog"
			aria-labelledby="myModalLabel">
			<div class="modal-dialog" role="document" style="width: 600px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="myModalLabel">新建定时任务</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal">
							<div class="form-group">
								<label  class="col-sm-2 control-label">定时任务<span class="red">&nbsp;*&nbsp;</span>:</label>
								<div class="col-sm-10">
									<input type="hidden" id="crontabTaskId">
									<input type="text" class="form-control" id="crontabName" maxlength="25" style="width: 400px;">
								</div>
							</div>
							<div class="form-group none">
								<label  class="col-sm-2 control-label">描述:</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="crontabDes" style="width: 400px;">
								</div>
							</div>
							<div class="form-group">
								<label  class="col-sm-2 control-label">作业名称<span class="red">&nbsp;*&nbsp;</span>:</label>
								<div class="col-sm-10">
									<select class="form-control searchInput" id="taskId" style="width: 400px;"></select>
								</div>
							</div>
							<div class="form-group none">
								<label  class="col-sm-2 control-label">作业名称<span class="red">&nbsp;*&nbsp;</span>:</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="taskName" style="width: 400px;" disabled>
								</div>
							</div>
							<jsp:include page="cronTab.jsp"/>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" id="crontabSave">保存</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					</div>
				</div>
			</div>
		</div>
	</div> 
</div>
 
<script src="./js/app/cronTab.js"></script>
<script src="./js/app/crontabTaskList.js"></script>
