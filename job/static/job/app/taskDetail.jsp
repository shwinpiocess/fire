

<!-- 执行详情 -->
<div class="panel panel-default ijobs-innerbox">
	<div class="panel-heading" style="background-color: #fff;border: 0;">
		<button id="returnBtn" class="pull-right btn btn-warning">返回</button>
		<select id="taskSelect" style="width:250px;height: 34px;"></select>
		<div style="clear: both;"></div>
	</div>
	<div class="panel-body">
		<div class="container-fluid">
			<section style="border: 1px solid #ccc; padding: 30px 30px 5px 30px;"
				class="ijob-info-box">
				<div class="row mt5 mb15">
					<div class="col-sm-4">
						<label class="info-name">作业名称：</label> <span id="rs-name"></span>
					</div>
					<div class="col-sm-4">
						<label class="info-name">执行结果：</label> <span id="rs-status"></span>
					</div>
					<div class="col-sm-4">
						<label class="info-name">启动人：</label> <span id="rs-operator"></span>
					</div>
				</div>
				<div class="row mb15">
					<div class="col-sm-4">
						<label class="info-name">开始时间：</label> <span id="rs-startTime"></span>
					</div>
					<div class="col-sm-4">
						<label class="info-name">结束时间：</label> <span id="rs-endTime"></span>
					</div>
					<div class="col-sm-4">
						<label class="info-name task-timeout">总耗时(s)：</label> <span id="rs-totalTime"></span>
					</div>
				</div>
			</section>
			<section>
				<div style="font-weight: bold; border: 1px solid #ccc; height: 34px; line-height: 34px; padding-left: 10px; background: #f6f8f8; position: relative; margin-top: 10px">
					作业步骤</div>
				<!-- 执行历史时间轴 -->
				<div class="table table-out-bordered table-header-bg">
					<div class="row">
						<div class="col-sm-12">
							<div class="king-block king-block-themed">
								<div class="king-block-content">
									<ul class="king-timeline">
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
<!-- 步骤执行结果模版 -->


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
<!-- 									<textarea class="form-control" id="logContent"
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










<script type="text/javascript" src="./js/app/stepExecuteDetail.js"></script>
<script type="text/javascript" src="./js/app/taskDetail.js"></script>


