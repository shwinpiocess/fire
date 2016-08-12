<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

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
						</div>
						
						<div class="tab-content" style="min-height:380px;position: relative;">
							<!-- start 通过IP选择服务器 -->
							<div class="ipList-tab-pane ipChoose-tab-pane none w p10">								 
									<input type="text" class="form-control w filterText"
										placeholder="通过IP、主机名、Agent状态进行过滤...">
									<table class="table table-header-bg mt10 w serverIp-result-table-thead table-hover serverIpTable"
										style="margin-bottom: -1px;">
										<thead>
											<tr>
												<th><input type="checkbox" class="selectedAllChecks" title="所有页"></th>
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
								<!-- <textarea class="form-control server-ip-textarea" rows="3" placeholder="请输入IP，以“空格”或者“回车”或者“;”分隔"  style="height: 375px"></textarea> -->
								<div>
									<div class="plat-area-box"></div>
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