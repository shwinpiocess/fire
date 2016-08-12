
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading none">
		<h3 class="panel-title">脚本管理</h3>
	</div>
	<div class="panel-body mt15">
		<form class="form-inline">
			<div class="fieldset mb20 pb15">
				<div class="legend">查询条件</div>
				<div class="container-fluid">
					<div class="row">
						<div class="form-group col-sm-4 pd0">
							<label class="filter-label">脚本名称：</label> <input type="text"
								id="name" class="form-control searchInput" placeholder="请输入脚本名称">
						</div>

						<div class="form-group col-sm-4 pd0" style="position: relative;">
							<label class="filter-label">创建人：</label> 
							<input type="text" id="creater" class="form-control searchInput" placeholder="请输入创建人帐号">
							<span class="autocomplete-me " id="createrMe">我</span> 
						</div>

						<div class="form-group col-sm-4 pd0 date-group">
							<label class="filter-label">创建时间：</label> <input type="text"
								id="createDateStart" style="width: 100px;" class="form-control start-date"
								placeholder="开始日期" readonly="readonly"> <span
								style="margin-left: 5px; margin-right: 5px;">-</span> <input
								type="text" id="createDateEnd" style="width: 100px;"
								class="form-control end-date" placeholder="结束日期" readonly="readonly">
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
		<button type="button" id="createScript" class="king-btn king-info">新建脚本</button>
		<table cellpadding="0" cellspacing="0" border="0"
			class="table table-striped table-bordered mt20" id="resultTable">
			<thead>
				<tr>
					<th class="text-left">脚本名称</th>
					<th class="text-left">作业名称</th>
					<th class="text-left">创建人</th>
					<th class="text-left">创建时间</th>
					<th class="text-left">最后修改人</th>
					<th class="text-left">最后修改时间</th>
					<th class="optionsStyle text-center">操作</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>

		<!-- Modal -->
		<div class="modal fade h1000" id="editScript" tabindex="-1" role="dialog"
			aria-labelledby="myModalLabel" data-backdrop="false" data-keyboard="false">
			<div class="modal-dialog" role="document" style="width: 800px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 class="modal-title" id="myModalLabel">编辑脚本</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" onSubmit="return false;">
							<div class="form-group">
								<label  class="col-sm-2 control-label">脚本名称<span class="red">&nbsp;*</span>：</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="scriptName" style="width: 600px;" maxlength="25">									 
									<input type="hidden" id="scriptId">
								</div>
							</div>
							
							<div class="form-group">
								<label  class="col-sm-2 control-label">脚本来源<span class="red">&nbsp;*</span>：</label>
								<div class="col-sm-10">
									<label class="radio-inline"> <input type="radio" id="mRadio" value="1" name="scriptFrom" checked="checked"> 手工录入</label>
									<label class="radio-inline"> <input type="radio" value="2" name="scriptFrom">脚本克隆</label>
									<label class="radio-inline"> <input type="radio" value="3" name="scriptFrom">本地脚本</label>
								</div>
							</div>
							
							<div class="form-group" id="scriptCopy" style="display: none; background-color: #f3f3f4;">
								<label  class="col-sm-2 control-label"></label>
								<div class="col-sm-10" >
									<div class="row" style="margin: 10px 0px 10px 0px;">
										<label class="control-label">脚本名称<span class="red">&nbsp;*</span>：</label>
									<select id="cmbScript" data-placeholder="请选择脚本"></select> 
									</div>
								 
								</div>
							</div>
							
							<div class="form-group" id="scriptUpdate" style="display: none; background-color: #f3f3f4;">
								<label  class="col-sm-2 control-label"></label>
								<div class="col-sm-10" >
									<div class="row" style="margin: 10px 0px 10px 0px;">
										<a id="scriptUpdateBtn" class=" king-btn king-info king-file-btn" href="javascript:void(0)">上传脚本
											<input id="scriptFileUpload" name="upload" type="file">
										</a>
										&nbsp;&nbsp;<span class="red">支持的后缀名：.sh、.bash、.ksh、.bat、.prl、.pl、.py、.pyc</span>																			
									</div>
								</div>
							</div>
							
							<div class="form-group">
								<label  class="col-sm-2 control-label">脚本内容<span class="red">&nbsp;*</span>：</label>
								<div class="col-sm-10">
									<div id="codediv" class="code"></div>
								</div>
								
							</div>

						</form>
					</div>
					<div class="modal-footer">
						<button id="scriptSaveBtn" type="button" class="btn btn-primary">保存</button>
						<button id="cancelBtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>


<script src="./js/app/scriptList.js"></script>
