
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading none">
		<h3 class="panel-title">任务执行历史</h3>
	</div>
	<div class="panel-body mt15">
		<form class="form-inline">
			<div class="fieldset mb20 pb15">
				<div class="legend">查询条件</div>
				<div class="container-fluid">
					<div class="row">
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">任务名称：</label> <input type="text"
								id="name" class="form-control searchInput" placeholder="请输入任务名称">
						</div>

						<div class="form-group col-sm-4 pd0" style="position: relative;">
							<label class="filter-label">启动人：</label>
							<input type="text" id="operator" class="form-control searchInput" placeholder="请输入启动人帐号">
							<span class="autocomplete-me" id="operatorMe">我</span>
						</div>

						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">任务状态：</label> <select id="status"
								class="form-control searchInput">
								<option value="" selected="selected">全部</option>
								<option value="1">未执行</option>
								<option value="2">正在执行</option>
								<option value="3">执行成功</option>
								<option value="4">执行失败</option>
								<option value="5">跳过</option>
								<option value="6">忽略错误</option>
								<option value="7">等待用户</option>
								<option value="8">手动结束</option>
								<option value="9">状态异常</option>
								<option value="10">步骤强制终止中</option>
								<option value="11">步骤强制终止成功</option>
								<option value="12">步骤强制终止失败</option>
							</select>
						</div>
					</div>
					<div class="row mt10">
						<div class="form-group col-sm-4 pd0 date-group">
							<label class="filter-label">执行时间：</label> <input type="text"
								id="createDateStart" style="width: 100px;" class="form-control start-date"
								placeholder="开始日期" readonly="readonly"> <span
								style="margin-left: 5px; margin-right: 5px; ">-</span> <input
								type="text" id="createDateEnd" style="width: 100px;"
								class="form-control end-date" placeholder="结束日期" readonly="readonly">
						</div>
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">启动方式：</label> <select id="startWay"
								class="form-control searchInput">
								<option value="" selected="selected">全部</option>
								<option value="1">页面执行</option>
								<option value="3">定时执行</option>
							</select>
						</div>
					</div>

					<hr class="mt10 mb15">
					<div class="text-left">
						<button type="button" id="findBtn" class="king-btn king-info">
							<i class="fa fa-search"></i> 查询
						</button>
						&nbsp;
						<button type="button" id="resetBtn" class="king-btn king-success">
							<i class="fa fa-refresh"></i> 重置
						</button>
					</div>
				</div>
			</div>
		</form>
		<table cellpadding="0" cellspacing="0" border="0"
			class="table table-striped table-bordered mt20" id="resultTable">
			<thead>
				<tr>
					<th>任务名称</th>
					<th>启动人</th>
					<th>任务状态</th>
					<th>开始时间</th>
					<th>结束时间</th>
					<th>启动方式</th>
					<th>总耗时(s)</th>
					<th class="text-center">操作</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</div>


<script src="./js/app/taskInstanceList.js"></script>
