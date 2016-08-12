

<style>
	tbody>tr>td:first-child{
	text-align: center;
}
</style>
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading none">
		<h3 class="panel-title">用户管理</h3>
	</div>
	<div class="panel-body mt15">
		<form class="form-inline">
			<div class="fieldset mb20 pb15">
				<div class="legend">查询条件</div>
				<div class="container-fluid">
					<div class="row">
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">账户名称：</label>
							<input type="text" id="name" class="form-control searchInput" placeholder="请输入账户名称">
						</div>
 
						<div class="form-group col-sm-4 pd0" style="position: relative;">
							<label class="filter-label" >创建人：</label>
							<input type="text" id="creater" class="form-control searchInput" placeholder="请输入创建人帐号">
							<span class="autocomplete-me" id="createrMe">我</span>
						</div>
						
						<div class="form-group pd0 date-group">
							<label class="filter-label">创建时间：</label>
						 	<input type="text" id="createDateStart" style="width: 100px;" class="form-control start-date " placeholder="开始日期" readonly="readonly">
							<span style="margin-left: 5px; margin-right: 5px; ">-</span>
							<input type="text" id="createDateEnd" style="width: 100px;" class="form-control end-date" placeholder="结束日期" readonly="readonly">
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

		<form class="form-inline" onSubmit="return false;">
			<div class="form-group pull-right">
				<button type="button" id="batchDel" class="btn btn-default" disabled="disabled">批量删除</button>
			</div>
			<div id="addUserDiv" class="form-group">
				<input type="text" id="newUserName" style="width: 200px;" maxlength="25" class="form-control" placeholder="请输入账户名称">
				<button type="button" id="saveUserBtn" class="btn btn-default "><i class="fa fa-plus"></i></button>
			</div>
		</form>

		<table cellpadding="0" cellspacing="0" border="0"
			class="table table-striped table-bordered mt20 ijobs-userList-resultTable" id="resultTable">
			<thead>
				<tr>
					<th style="padding-right: 8px; text-align: center;"><input id="allCheckBox" type="checkbox" class="userChecks text-left"></th>
					<th class="text-left">帐户名</th>
					<th class="text-left">创建人</th>
					<th class="text-left">创建时间</th>
					<th class="text-center">操作</th>
				</tr>
			</thead>		 
		</table>
	</div> 
</div>
 

<script src="./js/app/userList.js"></script>
