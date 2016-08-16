

<div class="panel panel-default ijobs-innerbox" id="panel-0">
    <button id="returnBtn" class="pull-right btn btn-warning none" style="margin-top:1px;margin-right:2px;">返回</button>
	<div class="panel-heading none">
		<h3 class="panel-title">新建作业</h3>
	</div>
	<div class="panel-body">
		<input type="hidden" id="global-ip-string">
		<div class="container-fluid">
			<div class="form-horizontal">
				<input type="hidden" id="taskId">
				<div class="form-group">
					<label class="control-label ijobs-label-w105">作业名称<span class="red">&nbsp;*</span>：</label>
					<div class="ijobs-input">
						<input type="text" class="form-control w400" id="task-name"  name="task-name" maxlength="50" dt-value="" data-container="body" data-toggle="popover" data-placement="right" data-content="必填项">
					</div>
				</div>
				<!-- 步骤分组外层box start  -->
				<div class="form-group" id ="group-box">
					<ul class="group-ul" id="group-ul" style="min-height:182px;">
					</ul>
				</div>
				<!-- 步骤分组外层div end  -->
				<div class="row add-step">
				<button class="btn btn-success"><i class="fa fa-plus"></i>&nbsp;添加步骤</button>
				<ul>
					<li><a href="javascript:void(0);" id="addScriptBtn" class="btn btn-default">添加脚本</a></li>
					<li><a href="javascript:void(0);" id="addFileBtn" class="btn btn-default">添加传输文件</a></li>
				</ul>
				</div>
				<hr />
				<div class="form-group">
					<div class="text-center">
						<button class="king-btn king-info m10" id="saveTask">
							<i class="fa fa-save"></i>&nbsp;保存
						</button>
						<button class="king-btn king-danger m10" id="runTask">
							<i class="fa fa-life-saver"></i>&nbsp;去执行
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
				<label class="control-label mt5 ml5 white">步骤名称<span class="red">&nbsp;*</span>：</label>
				<input type="text" class="form-control group-name-input mt5" maxlength="50" data-toggle="popover" data-placement="right" data-content="必填项"/>
				<input type="hidden" class="form-control group-type-input mt5" value="1"/>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-cut">
                    <i class="fa fa-scissors"></i></a>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-up">
					<i class="fa fa-chevron-up"></i></a>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-down">
					<i class="fa fa-chevron-down"></i></a> 
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-close" id="closeStep">
					<i class="fa fa-close"></i></a> 
			</div>
			<table class="group-node-table table table-out-bordered">
				<tr class="name-tr">
					<th class="text-center">脚本名称<span class="red">&nbsp;*</span></th>
					<th class="text-center">执行账户<span class="red">&nbsp;*</span></th>
					<th class="text-center">服务器数<span class="red">&nbsp;*</span></th>
					<th class="text-center">脚本参数</th>
					<th class="text-center">操作</th>
				</tr>
			</table>
		</li>
		<!--  <li class="group-node-li group-node-item"></li> -->
		<li class="group-node-li group-node-footer">
			<a href="javascript:void(0);" class="add-node"><i class="fa fa-plus"></i>&nbsp;&nbsp;新增节点</a>
		</li>
	</ul>
</div>
<!-- 脚本模版 end -->

<!-- 脚本节点模版 start  -->
<div id="script-n-template" class="none">
	<a href="#" class="item-cut" title="裁剪"><!-- <i class="fa fa-scissors"></i> --><img src="img/scissors.gif" width="20" height="20"></a>
	<form onsubmit="return false">
		<table class="group-node-table table table-out-bordered table-condensed">
			<tr class="name-tr">
				<td class="td_step_name"><input type="text" class="form-control step_name_input" maxlength="50" dt-value="" data-toggle="popover" data-placement="right" data-content="必填项"/></td>
				<td class="td_step_accout">
					<select  class="form-control step_accout_sel" dt-value="" data-toggle="popover" data-placement="right" data-content="必填项"></select>
				</td>					
				<td class="td_step_service" style="position: relative;">
					<input type="text" class="form-control step_service_input" disabled/>
					<a class="king-btn king-default king-btn-mini none serverip-copy-btn" style="position: absolute;right: 70px;top: 10px;">复制</a>
					<a class="king-btn king-default king-btn-mini none serverip-paste-btn" style="position: absolute;right: 10px;top: 10px;">粘贴</a>
				</td>
				<td class="td_step_param" style="position: relative;">
<!-- 					<input type="checkbox" title="CC脚本传参" style="position: absolute;top:10px;" class="step_paramType"/> -->
					<input type="text" class="form-control step_param_input" maxlength="1024"/>
				</td>
				<td class="td_step_oper">
				<div class="step_oper_div">
				<!-- <div class="checkbox-inline step_oper_div_check">
					<label>
						<input type="checkbox" name="stop-after-step">&nbsp;<span>完成后暂停</span>&nbsp;&nbsp;&nbsp;
					</label>
				</div> -->
				<a href="javascript:void(0)" title="编辑" class="node-edit"><i class="fa fa-pencil"></i></a>
				<a href="javascript:void(0)" title="上移" class="node-up"><i class="fa fa-arrow-up"></i></a>
				<a href="javascript:void(0)" title="下移" class="node-down"><i class="fa fa-arrow-down"></i></a>
				<a href="javascript:void(0)" title="拖放" class="node-drag"><i class="fa fa-arrows"></i></a>
				<a href="javascript:void(0)" title="删除" class="node-del"><i class="fa fa-remove"></i></a>
				<input type="hidden" class="step_id"/>
				</div>
				</td>
			</tr>
			<tr class="tag-tr">
				<td colspan="5" class="tag_td">
					<div class="form-group pt10">
						<label class="control-label ijobs-label-min">脚本来源<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input-min">
							<label class="radio-inline"> <input type="radio" value="1"
								name="scriptFrom" checked="checked"> 手工录入
							</label> <label class="radio-inline"> <input type="radio" value="2"
								name="scriptFrom"> 脚本克隆
							</label> <label class="radio-inline"> <input type="radio" value="3"
								name="scriptFrom"> 本地脚本
							</label>
						</div>
					</div>
			
					<div class="form-group scriptCopy" style="display: none;">
						<label class="control-label ijobs-label-min"></label>
						<div class="ijobs-input" style="background-color: #f3f3f4;">
							<div class="col-sm-10">
								<div class="row" style="margin: 10px 0px 10px 0px;">
									<label class="control-label">脚本名称<span class="red">&nbsp;*</span>：</label> 
									<select class="cmbScript" data-placeholder="请选择脚本"></select> 
									<!-- <a class=" king-btn king-info cmbScriptCopy" data-loading-text="Loading..." href="javascript:void(0)">拷贝</a> -->
								</div>
							</div>
						</div>
					</div>
					<div class="form-group scriptUpdate" style="display: none;">
						<label class="control-label ijobs-label-min"></label>
						<div class="ijobs-input" style="background-color: #f3f3f4;">
							<a class="btn btn-success mt15 mb15 ml15 localFile king-file-btn"
								type="button">
								<i class="fa fa-upload"></i> <span class="bold">上传脚本</span>
								<input class="fileUpload" name="upload" type="file">
							</a>
							&nbsp;&nbsp;<span class="red">支持的后缀名：.sh、.bash、.ksh、.bat、.prl、.pl、.py、.pyc</span>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label ijobs-label-min">脚本内容<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input w800">
							<div class="code" style="height:335px;"></div>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label ijobs-label-min">超时时间&nbsp;：</label>
						<div class="ijobs-input">
							<input type="number" min="60" max="3600" value="1000" placeholder="请输入脚本执行超时时间，单位为秒，范围60-3600，默认1000" class="form-control w700 scriptTimeout">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label ijobs-label-min">服务器集<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input h34">
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
				<label class="control-label mt5 ml5 white">步骤名称<span class="red">&nbsp;*</span>：</label>
				<input type="text" class="form-control group-name-input mt5" maxlength="50" data-toggle="popover" data-placement="right" data-content="必填项"/>
				<input type="hidden" class="form-control group-type-input mt5" value="2"/>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-cut">
                    <i class="fa fa-scissors"></i></a>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-up">
					<i class="fa fa-chevron-up"></i></a>
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-down">
					<i class="fa fa-chevron-down"></i></a> 
				<a href="javascript:void(0);" class="btn btn-default pt5 pb5 mt5 step-close" id="closeStep">
					<i class="fa fa-close"></i></a> 
			</div>
			<table class="group-node-table table table-out-bordered">
				<tr class="name-tr">
					<th class="text-center">任务名称<span class="red">&nbsp;*</span></th>
					<th class="text-center">执行账户<span class="red">&nbsp;*</span></th>
					<th class="text-center">服务器数<span class="red">&nbsp;*</span></th>
					<th class="text-center">目标路径<span class="red">&nbsp;*</span></th>
					<th class="text-center">操作</th>
				</tr>
			</table>
		</li>
		<!--  <li class="group-node-li group-node-item"></li> -->
		<li class="group-node-li group-node-footer">
			<a href="javascript:void(0);" class="add-node"><i class="fa fa-plus"></i>&nbsp;&nbsp;新增节点</a>
		</li>
	</ul>
</div>
<!-- 文件模版 end -->

<!-- 文件节点模版 start  -->
<div id="file-n-template" class="none">
	<a href="#" class="item-cut" title="裁剪"><!-- <i class="fa fa-scissors"></i> --><img src="img/scissors.gif" width="20" height="20"></a>
	<form onsubmit="return false">
		<table class="group-node-table table table-out-bordered table-condensed">
			<tr class="name-tr">
				<td class="td_step_name"><input type="text" class="form-control step_name_input" maxlength="50" dt-value="" data-toggle="popover" data-placement="right" data-content="必填项"/></td>
				<td class="td_step_accout">
					<select  class="form-control step_accout_sel"></select>
				</td>				
				<td class="td_step_service" style="position: relative;">
					<input type="text" class="form-control step_service_input" disabled/>
					<a class="king-btn king-default king-btn-mini none serverip-copy-btn" style="position: absolute;right: 70px;top: 10px;">复制</a>
					<a class="king-btn king-default king-btn-mini none serverip-paste-btn" style="position: absolute;right: 10px;top: 10px;">粘贴</a>
				</td>
				
				<td class="step_path_input"><input type="text" class="form-control step_param_input" maxlength="255" data-toggle="popover" data-placement="right" data-content="必填项"/></td>
				<td class="td_step_oper">
					<div class="step_oper_div">
						<!-- <div class="checkbox-inline step_oper_div_check">
							<label>
								<input type="checkbox" name="stop-after-step">&nbsp;<span>完成后暂停</span>&nbsp;&nbsp;&nbsp;
							</label>
						</div> -->
						<a href="javascript:void(0)" title="编辑" class="node-edit"><i class="fa fa-pencil"></i></a>
						<a href="javascript:void(0)" title="上移" class="node-up"><i class="fa fa-arrow-up"></i></a>
						<a href="javascript:void(0)" title="下移" class="node-down"><i class="fa fa-arrow-down"></i></a>
						<a href="javascript:void(0)" title="拖放" class="node-drag"><i class="fa fa-arrows"></i></a>
						<a href="javascript:void(0)" title="删除" class="node-del"><i class="fa fa-remove"></i></a>
						<input type="hidden" class="step_id"/>
					</div>
				</td>
			</tr>
			<tr class="tag-tr">
				<td colspan="5" class="tag_td">
					<div class="form-group pt10">
						<label class="control-label ijobs-label-min">选择文件<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input">
							<a class="btn btn-info localFile king-file-btn"
								style="margin-right: 10px;" type="button">
								<i class="fa fa-upload"></i> <span class="bold">使用本地文件</span>
								<input class="fileTUpload" name="upload" type="file" multiple="multiple">
							</a>
							<button class="btn btn-info remoteFile" type="button">
								<i class="fa fa-cloud "></i> <span class="bold">使用服务器文件</span>
							</button>
						</div>
					</div>
	
					<div class="form-group">
						<label class="control-label ijobs-label-min">文件列表<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input w800"><div class="file-table" style="width:700px;"></div></div>
					</div>
					<div class="form-group">
						<label class="control-label ijobs-label-min">目标机器<span class="red">&nbsp;*</span>：</label>
						<div class="ijobs-input h34">
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
<!-- 文件节点模版 end  -->

<div class="block-container" id="block_list_warpper" style="display:none;">
    <div class="ijobs-block-list" id="block_list"></div>
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
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="2"> 配置平台</label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="3"> 手动添加 </label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="4"> 分组添加 </label>
							<label class="pr5 radio-inline" style="cursor: pointer;"><input type="radio" name="serverSelect" value="5"> CC脚本 </label>
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
								<div style="height: 384px; overflow: auto;text-align: left;" class="treeviewDiv">
									<div class="treeviewByAjax"></div>
								</div> 
							</div>
							<!-- end 配置平台 -->
							
							<!-- start 手动添加  -->
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
							<!-- end 手动添加  -->

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
									<label  class="col-sm-2 control-label">CC脚本导入<span class="red">&nbsp;*</span>ï¼</label>
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
					<button type="button" class="btn btn-default selectAllIp fl none">全选</button>
<!-- 					<input type="text" maxlength="25" class="form-control fl groupNameInput none" style="width:200px;" placeholder="请输入分组名称" disabled/> -->
<!-- 					<button type="button" class="btn btn-default groupbtn fl none" disabled>保存为分组</button> -->
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










<script type="text/javascript" src="./js/common/serverIpList/serverIpList.js"></script>
<script type="text/javascript" src="./js/common/fileTransferModule/fileTransferModule.js"></script>
<script type="text/javascript" src="./js/app/newTask.js"></script>


