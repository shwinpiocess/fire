$(function($){ 
	function loadTaskData(_extraObj){
		var _data = {};
		if(_extraObj.taskId){
			_data.taskId = _extraObj.taskId
		}
		if(_extraObj.taskInstanceId){
			_data.taskInstanceId = _extraObj.taskInstanceId;
		}
		$.ajax({
			type : 'post',			 
			url : basePath+'nm/jobs/jobsAction!getTaskDetail.action',
			dataType : 'json',
			data : _data,
			success:function(result){
				if(result.success){
					$('#task-name').val(result.data.taskName); 
					var blocks = result.data.blocks;
					for(var i = 0;i<blocks.length;i++){
						var block = blocks[i];
						if(block.type == 1){
							init_script_block(block); 
						}else if (block.type == 2){ 
							init_file_block(block);
						} 
					}
					allTextHtmlDecode();
					if(_extraObj.taskInstanceId){
						$('#group-box .isExecute-checkbox:checked').prop('disabled',true);
					}
				}
				$.unload();
			}
		}); 
	}
	
	 $('#returnBtn').click(function(){
		 if(havePropInObj(extraObj)){
			 if(extraObj.historytype<=1){
				createNewTab('执行历史', './app/taskInstanceList.jsp', '执行历史',extraObj);
			}else if(extraObj.historytype==2){
				createNewTab('常用作业执行', './app/jobList.jsp', '作业执行',extraObj);
			}else if(extraObj.historytype==3){
				extraObj.type = 'edit';
				createNewTab('作业编辑', './app/newTask.jsp', '作业执行',extraObj);
			}
		 }else{
			 createNewTab('常用作业执行', './app/jobList.jsp', '作业执行');
		 }
	 });
	 
	 $('#runTask').click(function(){
		   if(havePropInObj(extraObj)){
			   $.load();
				if(extraObj.taskInstanceId){
					$.ajax({
						type : 'post',
						url : basePath+'/nm/jobs/taskExecuteAction!reExecuteTask.action',
						dataType:'json',
						data:{
							taskInstanceId : extraObj.taskInstanceId
						},
						success:function(result){
							if(result.success){
								extraObj.taskInstanceId = result.data.newTaskInstanceId;
								createNewTab('作业实例', './app/taskDetail.jsp', '执行详情', extraObj);
							}else{
								printMsg(result.msg.message, 2);
							}
							$.unload();
						}				
					});
				}else{
					var stepIdArr=[];
				 	$.each($('#group-box .isExecute-checkbox:checked'),function(i,opt){
						stepIdArr.push($(opt).val());
					});
				 	if(stepIdArr.length==0){
				 		printMsg('至少需要勾选一个步骤！',2);
				 		$.unload();
				 		return false;
				 	}
					$.ajax({
						type : 'post',
						url : basePath+'nm/jobs/taskExecuteAction!executeTask.action',
						dataType:'json',
						data:{
							taskId : extraObj.taskId,
							stepIds : stepIdArr.join(',')
						},
						success:function(result){
							if(result.success){
								extraObj.taskInstanceId = result.data.taskInstanceId;
								createNewTab('作业实例', './app/taskDetail.jsp', '执行详情', extraObj);
							}else{
								printMsg(result.msg.message, 2);
							}
							$.unload();
						}				
					});
				}
			}
	 });
	
	function init_script_block(block){
		var _temp_s = $('#script-template');//脚本模版
		var _ul = $('#group-ul');
		var _li = $('<li class="group-li" id="group-li-'+_ul.children().length+'"></li>');
		_li.html(_temp_s.html());
		$('#group-ul').append(_li);
		_li.find('.group-name-input').val(block.blockName);
		
		initEvent(_li);
		
		for(var j=0;j<block.steps.length;j++){
			var _temp_s_n = $('#script-n-template');//脚本模版中的节点模版
			var _node_li = $('<li class="group-node-li group-node-item"></li>');								
			_node_li.html(_temp_s_n.html()); 
			
			_node_li.find(':text').prop('readonly', true);
			_li.find('.group-node-ul>li:last').before(_node_li); 
			
			scriptNodeInit(_node_li,block.steps[j]);
		}
		_li.find('.step-up').trigger("click");
	} 
	
	function init_file_block(block){
		var _temp_s = $('#file-template');//脚本模版
		var _ul = $('#group-ul');
		var _li = $('<li class="group-li" id="group-li-'+_ul.children().length+'"></li>');
		_li.html(_temp_s.html());
		$('#group-ul').append(_li);		 
		_li.find('.group-name-input').val(block.blockName);
		initEvent(_li);
		for(var j=0;j<block.steps.length;j++){
			var _temp_s_n = $('#file-n-template');//脚本模版中的节点模版
			var _node_li = $('<li class="group-node-li group-node-item"></li>');								
			_node_li.html(_temp_s_n.html()); 
			
			_node_li.find(':text').prop('readonly', true);
			_li.find('.group-node-ul>li:last').before(_node_li);
			fileNodeInit(_node_li,block.steps[j]);
		}
		_li.find('.step-up').trigger("click");
	}
	
	function initEvent(_temp){
 		//步骤展开
		_temp.on('click','.step-down',function(){
			_temp.find('.step-up').show();
	        $(this).hide();
	        _temp.find('tr.tag-tr').show();
		});
		//步骤折叠
		_temp.on('click','.step-up',function(){
			_temp.find('.step-down').show();
			 $(this).hide();
	        _temp.find('tr.tag-tr').hide();
		});
	};
	 	  
	//脚本节点初始化
	function scriptNodeInit(_temp,step){
		_temp.find('.step_name_input').val(step.name);
		_temp.find('.step_accout_sel').val(step.account);
		_temp.find('.step_service_input').val('共'+step.ipList.split(',').length+"台");
		_temp.find('.step_param_input').val(step.scriptParam);
		if(step.isPause == 1){ 
			_temp.find('.text-tr').removeClass('none');
			_temp.find('.step_text_input').val(step.text);
		}		
		_temp.find('.isExecute-checkbox').val(step.stepId);
		var codeMir = _temp.find('.code').codeMirror({readOnly:true});
		codeMir.setType(step.scriptType);		 
		codeMir.setValue(step.scriptContent+'');
		
		_temp.find('.iplist').createServerIp({
			readOnly:true,
			ipListString:step.ipListStatus,
			serverSetId : step.serverSetId,
			width:'700px'
		});
		 
		_temp.find('.show-step').click(function(){
			_temp.find('.tag-tr').toggle(); 
		});
		// 脚本内容插件初始化 
	}
	//文件节点初始化
	function fileNodeInit(_temp,step){
		_temp.find('.step_name_input').val(step.name);
		_temp.find('.step_accout_sel').val(step.account);
		_temp.find('.step_service_input').val('共'+step.ipList.split(',').length+"台");
		_temp.find('.step_path_input').val(step.fileTargetPath);
		if(step.isPause == 1){
			_temp.find('.text-tr').removeClass('none');
			_temp.find('.step_text_input').val(step.text);
			//_temp.find('.step-pause-text-group').removeClass('none');
		}
		_temp.find('.isExecute-checkbox').val(step.stepId);
		_temp.find('.iplist').createServerIp({
			readOnly:true,
			ipListString:step.ipListStatus,
			serverSetId : step.serverSetId,
			width:'700px'
		});
		//执行账户初始化数据
//		var fileSources = step.fileSource;
        var fileSources = eval(step.fileSource);
		var fileTransfer = _temp.find('.file-table').fileTransferModule({readOnly : true});
		fileTransfer.setValue(fileSources);
		_temp.find('.show-step').click(function(){
			_temp.find('.tag-tr').toggle(); 
		});
	};
	//初始化页面时直接调用
	(function(){
		if(havePropInObj(extraObj)){//判断扩展参数是否存在
			loadTaskData(extraObj);
		}
	})();
});
