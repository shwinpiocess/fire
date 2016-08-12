
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading none">
		<h3 class="panel-title">新增分组</h3>
	</div>
	<div class="panel-body mt15">
		<div class="row">
			<div class="col-lg-12">
				<form method="post" class="form-horizontal">
					<div class="fieldset mb20 pb15">
						<div class="legend">新增分组</div>
						<input type="hidden" id="serverSetId">
						<div class="form-group">
							<label class="control-label ijobs-label">分组名称：</label>
							<input type="text" id="name" class="form-control ijobs-input" placeholder="请输入分组名称">
						</div>
						<div class="form-group">
							<label class="control-label ijobs-label">描述：</label>
							<input type="text" id="remark" class="form-control ijobs-input" placeholder="请输入描述">
						</div>
						<div class="form-group">
							<label class="control-label ijobs-label">集群属性：</label>
							<div class="form-control ijobs-input" id="setPropertyWarp"
								style="min-height: 34px; height: auto; cursor: pointer;">
								<div class="btn-toolbar">
									<span style="color: #999999;">(不选为全部)</span>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label ijobs-label">业务集群：</label> 
							<div class="form-control ijobs-input" id="getSetsSelectWarp"
								style="min-height: 34px; height: auto; cursor: pointer;">
								<div class="btn-toolbar">
									<span style="color: #999999;">(不选为全部)</span>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label ijobs-label">业务模块：</label> 
							<div class="form-control ijobs-input" id="getModelsWarp"
								style="min-height: 34px; height: auto; cursor: pointer;">
								<div class="btn-toolbar">
									<span style="color: #999999;">(不选为全部)</span>
								</div>
							</div>
						</div>
						<div class="form-group pt15">
				            <div class="text-center " style="width:780px;margin-left:90px;">
				                <hr>
				                <button id="testServerBtn" type="button" class="btn btn-primary">测试结果</button>
				                <button id="saveGroup" class="king-btn king-info" type="button">保存</button>
           						 <button type="button" id="returnBtn" class="king-btn king-warning">返回</button>
				            </div>
			        	</div>
					</div>
				</form>
				<!-- Modal 1-->
				<div class="modal fade h1000" id="setPropertyModal" tabindex="-1" role="dialog">
					<div class="modal-dialog" role="document" style="width: 400px;">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"
									aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								<h4 class="modal-title">按集群属性选择</h4>
							</div>
							<div class="modal-body">
								<div class="row p5">
									<div class="col-md-8">
										<button class="king-btn king-info king-btn-mini" id="setPropertyCheckAll">全选</button>
										<button class="king-btn king-success king-btn-mini" id="setPropertyInverse">反选</button>
									</div>
								</div>
								<div class="row p5">
									<div class="col-md-4 w100">服务状态：</div>
									<div class="col-md-8" id="setServiceStatusGroup"></div>
								</div>
								<div class="row p5">
									<div class="col-md-4 w100">环境类型：</div>
									<div class="col-md-8" id="setEnviTypeGroup"></div>
								</div>
							</div>
							<div class="modal-footer">
								<button id="setPropertySaveBtn" type="button" class="btn btn-primary">保存</button>
								<button id="setPropertyCancelBtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Modal 2-->
				<div class="modal fade h1000" id="getSetsSelectModal" tabindex="-1" role="dialog">
					<div class="modal-dialog" role="document" style="width: 800px;">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"
									aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								<h4 class="modal-title">按业务集群选择</h4>
							</div>
							<div class="modal-body">
								<div class="row p5">
									<div class="col-md-8">
										<button class="king-btn king-info king-btn-mini" id="getSetsCheckAll">全选</button>
										<button class="king-btn king-success king-btn-mini" id="getSetsInverse">反选</button>
									</div>
									<div class="col-md-4">
										<input type="text" id="getSetsSearch" placeholder="搜索..." style="float: right;margin-right: 6px;width:200px;">
									</div>
								</div>
								<div class="row p5">
									<div class="col-md-12" id="getSetsGroup"></div>
								</div>
							</div>
							<div class="modal-footer">
								<button id="getSetsSaveBtn" type="button" class="btn btn-primary">保存</button>
								<button id="getSetsCancelBtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
							</div>
						</div>
					</div>
				</div>
				
				
				<!-- Modal 3 -->
				<div class="modal fade h1000" id="getModelsModal" tabindex="-1" role="dialog">
					<div class="modal-dialog" role="document" style="width: 800px;">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"
									aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								<h4 class="modal-title">按业务模块选择</h4>
							</div>
							<div class="modal-body">
								<div class="row p5">
									<div class="col-md-8">
										<button class="king-btn king-info king-btn-mini" id="getModelsCheckAll">全选</button>
										<button class="king-btn king-success king-btn-mini" id="getModelsInverse">反选</button>
									</div>
									<div class="col-md-4">
										<input type="text" id="getModelsSearch" placeholder="搜索..." style="float: right;margin-right: 6px;width:200px;">
									</div>
								</div>
								<div class="row p5">
									<div class="col-md-12" id="getModelsGroup"></div>
								</div>
							</div>
							<div class="modal-footer">
								<button id="getModelsSaveBtn" type="button" class="btn btn-primary">保存</button>
								<button id="getModelsCancelBtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Test Modal -->
				<div class="modal fade h1000" id="testModal" tabindex="-1" role="dialog">
					<div class="modal-dialog" role="document" style="width: 600px;">
						<div class="modal-content">
							<div class="modal-body">
								<table class="table table-header-bg mt40 mb0 testIpTable table-bordered table-hover">
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
								<button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">关闭</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>

<script src="./js/app/groupAdd.js"></script>
