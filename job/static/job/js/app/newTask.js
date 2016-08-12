var oldTaskEditContent;
var semaphore = simpleSemaphore();
var initing = false;
function updateOldData(){
	if(initing){
		oldTaskEditContent = JSON.stringify(getAllData(false));		
	}
	initing = false;
	$.unload();
}

//获取所有保存值 ，isValidate 是否验证数据
function getAllData(isValidate){
	var taskId = $('#taskId').val() || 0;
	var taskName = $.trim($('#task-name').val());
	if(!taskName && isValidate) {
		$('#task-name').popover({"viewport":false});
		$('#task-name').popover('show');  
		return false;
	}
	
	var _group = $('#group-ul'); //组
	var stepDataList = [];
	if(_group.find('.group-li').length>0){
		$.each(_group.find('.group-li'),function(i,g_li){
            var stepData = getOneStepData(i+1, $(g_li), isValidate);
            if(stepData.length>0){
				stepDataList = stepDataList.concat(stepData);
            }else{
                stepDataList = [];  
                return false;
            }
		});
	};
    
    if(stepDataList.length<=0 && isValidate){
        return false;
    }
    
	//排序
	 $.each(stepDataList,function(i,e){
		 stepDataList[i].ord = i+1;
     });
	
	 return {
		 taskId : taskId,
		 name : taskName,
		 steps : stepDataList
	 };
};
//获取每一步骤的值
function getOneStepData(ord, _g_li, isValidate){
	if(!_g_li)return false;
	var _node_ul =  _g_li.find('.group-node-ul');
	var blockName_obj = _node_ul.find('.group-name-input');
	var blockName = $.trim(blockName_obj.val());
	if(!blockName && isValidate) {
		blockName_obj.popover({'viewport':false});			
    	blockName_obj.popover('show');  
    	return false;
	}
	var blockType = _node_ul.find('.group-type-input').val();
	var blockOrd = ord;
	var stepData = [];
	$.each(_node_ul.find('.group-node-item'), function(i,item){
        var nodeData = getNodeData($(item), blockName, blockOrd, blockType, isValidate);
        if(nodeData){
		     stepData.push(nodeData);
        }else{
            stepData = [];
            return false;
        }
	});
	return stepData;
};

function getNodeData(_item, blockName, blockOrd, blockType, isValidate){
	var _node_table = _item.find('.group-node-table');
	var stepId = ""==_node_table.find('input.step_id').val()?0:_node_table.find('input.step_id').val();
	var type = blockType;
	var ord = null;
	var name_obj = _node_table.find('.step_name_input');
	var name = $.trim(name_obj.val());
	
	var account_obj = _node_table.find('.step_accout_sel');
	var account = $.trim(account_obj.val());
	var ipList = $.trim(_node_table.find('.hidden-serverip-string').val());
	var serverSetId = _node_table.find('.hidden-serverSetId').val();
	var ccScriptId = _node_table.find('.cc-scriptId').last().val();
	var ccScriptParam = $.trim(_node_table.find('.cc-param-hidden').last().text());
    var isPause = _node_table.find('input[name=stop-after-step]:checked').length>0?1:0;
    var text = _node_table.find('.step_text_input').val();
    
    

//    校验位置：
//    未校验成功返回 return false;
    if (!name && isValidate) {
    	name_obj.popover({"viewport":false});
    	name_obj.popover('show');  
    	return false;
    } 
    if(!account && isValidate) {
    	account_obj.popover({"viewport":false});
    	account_obj.popover('show');  
    	return false;
    }  
	var nodeData = null; 
    nodeData={
        stepId : stepId,
        type : type,
        blockOrd : blockOrd,
        blockName : blockName,
        ord : ord,
        name : name,
        account : account,
        ipList : ipList,
        serverSetId : serverSetId,
        isPause: isPause,
        text : text,
        ccScriptId : ccScriptId || 0,
        ccScriptParam : ccScriptParam
    };
	if(blockType==1){
		var scriptType = _node_table.find('.hidden-scriptCodeType').val();
		var scriptContent = $.trim(_node_table.find('.hidden-scriptCode-content').val());
		var scriptParam = _node_table.find('.step_param_input').val();
		var paramType = _node_table.find('.step_paramType:checked').length>0?2:1;
		var scriptTimeout = parseInt(_node_table.find('.scriptTimeout').val()||1000);
        if (!scriptContent && isValidate) {
        	_node_table.find('tr.tag-tr').removeClass('none');
        	var scriptContent_obj = _node_table.find('.code-cont');
        	scriptContent_obj.attr("data-content", "必填项");
        	account_obj.popover({"viewport":false});
        	scriptContent_obj.popover('show');  
        	return false;
        }
        nodeData['scriptType'] = scriptType;
        nodeData['scriptContent'] = scriptContent;
        nodeData['scriptParam'] = scriptParam;
        nodeData['paramType'] = paramType;
        nodeData['scriptTimeout'] = scriptTimeout;
	}else if (blockType==2){
		// 获取fileSource,常用作业执行->编辑->删除文件->保存->刷新->已删除--start
        var me = this;
        me._table = _node_table.find('.fileSourceTable');
        me._tbody = me._table.find('tbody').eq(0);
        me._fileSource = me._table.find('.fileSource');
        var rs=[];
        $.each(_tbody.children('tr:not(.blankTr)'),function(i,opt){
			var _tr = $(opt);
			if($(opt).find('.fileName').length>0){//本地
				rs.push({
					file : $(opt).find('.filePath').val(),
					size : $(opt).find('.fileSize').text()
				});
			}else{//远程
				if($(opt).find('.f_edit').hasClass('none')){
					rs.push({
						file : $(opt).find('.filePath').val(),
						ipList : $(opt).find('.hidden-serverip-mode2').val(),
						serverSetId : $(opt).find('.hidden-serverSetId-mode2').val(),
						account : $(opt).find('.account').text(),
						ccScriptId : $(opt).find('.cc-scriptId').val() || 0,
					    ccScriptParam : $.trim($(opt).find('.cc-param-hidden').text())
					});
				}else{
					rs=[];
					return false;
				}
			}
		});
		me._fileSource.val(JSON.stringify(rs));
		// 获取fileSource,常用作业执行->编辑->删除文件->保存->刷新->已删除--end
		var fileTargetPath = $.trim(_node_table.find('.step_param_input').val());
		var fileSource = $.trim(_node_table.find('.fileSource').val());
		var stepPath_obj = _node_table.find('.step_path_input').find('input');
		

        if (!fileTargetPath && isValidate) {
        	stepPath_obj.popover({"viewport":false});
        	stepPath_obj.popover('show');  
        	return false;
        }
        var validFilePath = validPaths(fileTargetPath);
		if(validFilePath !== true && isValidate){
			stepPath_obj.attr('data-content',validFilePath);
			stepPath_obj.popover({"viewport":false});
        	stepPath_obj.popover('show');  
			return false;
		}
    	var fileSource_obj = _node_table.find('.file-table');
        if(!fileSource && isValidate) {
        	_node_table.find('tr.tag-tr').removeClass('none');
        	fileSource_obj.attr("data-content", "必填项");
        	fileSource_obj.popover({"viewport":false});
        	fileSource_obj.popover('show'); 
        	return false;
        }else{
        	if(fileSource_obj.find('tr').length>2){
        		var noSave = false;
				$.each(fileSource_obj.find('tr:not(.blankTr)'),function(i,opt){
					if($(opt).find('.f_save').hasClass('none') && isValidate){
						_node_table.find('tr.tag-tr').removeClass('none');
						$(opt).find('.saveFile').scrollGotoHere();
						$(opt).css({backgroundColor : '#ddd'});
						$(opt).stop();
						$(opt).animate({
							'backgroundColor' : '#fff'
						},2000);
						noSave = true;
						return false;
					}
				});
				if(noSave && isValidate){
					printMsg('数据未保存！',2);
					return false;
				}
			}
        }
        nodeData['fileTargetPath'] = fileTargetPath;
        nodeData['fileSource'] = fileSource;
	}
	if(!ipList && !ccScriptId && isValidate) {
    	_node_table.find('tr.tag-tr').removeClass('none');
    	var iplist_btn_obj = _node_table.find('.iplist').find('.showModel');
    	iplist_btn_obj.attr("data-content", "必填项");
    	iplist_btn_obj.popover({"viewport":false});
    	iplist_btn_obj.popover('show');  
    	return false;
    }
    if (blockType==2) {
        var ipDestArray = ipList.split(',');
        var fileSource = nodeData['fileSource'];
        var fileSrcObj = eval(fileSource);
        for (var i = 0; i < fileSrcObj.length; i++){
            var ipListSrc = fileSrcObj[i].ipList;
            if (ipListSrc) {
                var ipArraySrc = ipListSrc.split(',');
                for (var j = 0; j < ipArraySrc.length; j++) {
                    for (var k = 0; k < ipDestArray.length; k++) {
                        if (ipDestArray[k] == ipArraySrc[j] && isValidate) {
                        	_node_table.find('tr.tag-tr').removeClass('none');
                            var iplist_btn_obj = _node_table.find('.iplist').find('.showModel');
                            iplist_btn_obj.attr("data-content", "文件传输，禁止从本机传本机，IP：" + ipDestArray[k].replace(/^.*:/,''));
                            iplist_btn_obj.popover({"viewport":false});
                            iplist_btn_obj.popover('show');
                            return false;
                        }
                    }
                }
            }
      } 
    }
	return nodeData;
}

$(function($){
	var curr_index = null;
	var isProgress = false;
	var copyIp='', copyScriptId=0, copyScriptName, copyScriptParam;

	$(window).bind('beforeunload',function(){
		if(currentPage && currentPage.endsWith('newTask.jsp') && JSON.stringify(getAllData(false)) != oldTaskEditContent){
			return '您所编辑的作业尚未保存，是否确定离开？';
		} else {
			return;
		}
	});
	
	//添加脚本步骤
	$('#addScriptBtn').click(function(){
		var _temp_s = $('#script-template');//脚本模版
		var _ul = $('#group-ul');
		var _block_list = $('#block_list');
		var length = _ul.find('.group-li').length;
		var _li = $('<li class="group-li"></li>');
		var _block = $('<div class="ijobs-block ijobs-block-j" block-type="1">步骤'+(length+1)+'</div>');
		
		_li.html(_temp_s.html());
		_ul.append(_li);
		_ul.find('tr.tag-tr').addClass('none');
        if(_ul.find('.group-li').length >1 ) {
        	// 新增步骤后，需要聚焦到步骤名称的输入框
        	_li.find('.group-name-input').focus();
        } 
        _block_list.append(_block);
        
		scriptInit(_li);
	});
	
	//添加文件步骤
	$('#addFileBtn').click(function(){
		var _temp_s = $('#file-template');//脚本模版
		var _ul = $('#group-ul');
		var _block_list = $('#block_list');
		var length = _ul.find('.group-li').length;
		var _li = $('<li class="group-li"></li>');
		var _block = $('<div class="ijobs-block ijobs-block-w" block-type="2">步骤'+(length+1)+'</div>');
		_li.html(_temp_s.html());
		_ul.append(_li);
		_ul.find('tr.tag-tr').addClass('none');
        
        if(_ul.find('.group-li').length >1 ) {
        	// 新增步骤后，需要聚焦到步骤名称的输入框
        	_li.find('.group-name-input').focus();
        } 
        
        _block_list.append(_block);
		fileInit(_li);
	});
	function stepPubInit(_temp,steps){
		//步骤展开
		_temp.on('click','.step-down',function(){
			_temp.find('.step-up').show();
	        $(this).hide();
	        _temp.find('tr.tag-tr').removeClass('none');
		});
		//步骤折叠
		_temp.on('click','.step-up',function(){
			_temp.find('.step-down').show();
			 $(this).hide();
	        _temp.find('tr.tag-tr').addClass('none');
		});
		
		//步骤删除
		_temp.on('click','.step-close',function(){
			var _ul = $('#group-ul');
			if(_ul.children().length>1){
				confirmModal('提示','是否删除该步骤?',function(){
					var _block_list = $('#block_list');
					var _ul = $('#group-ul');
					_block_list.find('div.ijobs-block').eq(_temp.index()).remove();
					_temp.remove();
					
					_block_list.find('div.ijobs-block').each(function(i){
		            	var g_name = _ul.find('input.group-name-input').eq(i).val();
		            	if(g_name){
		            		$(this).text(_ul.find('input.group-name-input').eq(i).val());
		            	}else{
		            		$(this).text('步骤'+(i+1));
		            	}
		            });
				});
			}else{
				printMsg('作业中至少需要一个步骤！',2);
			}
		});
		
		//显示剪切模式
		_temp.on('click','.step-cut',function(){
		    var items = _temp.find('.group-node-item');
		    var itemsLen = items.length;

		    if ($(this).hasClass('cut-mode')){
		        $(this).removeClass('cut-mode');
		        items.off('mouseover');
		        _temp.find('.cut-status').removeClass('cut-status');
		        _temp.find('.item-cut').hide().css({'right': '-10px','opacity':0});
		        return false;
		    }

		    $(this).addClass('cut-mode');
		    
		    if ( itemsLen > 1){
		        //显示第一个
		        var firstItem = items.eq(0);
		        firstItem.addClass('cut-status');
		        firstItem.find('.item-cut').show().animate({'right':'10px','opacity':1},400);

		        items.off('mouseover').on('mouseover',function(){
		            if ($(this).hasClass('cut-status')){
		                return false;
		            }

		            if ($(this).index() < itemsLen){
		            	_temp.find('.item-cut').hide().css({'right': '-10px','opacity':0});
		            	_temp.find('.cut-status').removeClass('cut-status');
		                $(this).addClass('cut-status');
		                $(this).find('.item-cut').show().animate({'right':'10px','opacity':1},400);
		            }
		            
		        });
		    }else{
		    	printMsg('没有可以拆分的节点！',2);
		    }
		});
	}
	//脚本模版初始化
	function scriptInit(_temp,steps){
        //新增节点
        _temp.on('click','.add-node',function(){
            var _temp_s_n = $('#script-n-template');//脚本模版中的节点模版
            var _node_li = $('<li class="group-node-li group-node-item"></li>');
            _node_li.html(_temp_s_n.html());
            _temp.find('.group-node-ul>li:last').before(_node_li);
          
            scriptNodeInit(_node_li);
            _temp.find('.group-node-ul>li.group-node-item tr.tag-tr').addClass('none');
        });
		
        stepPubInit(_temp, steps);
        
        if(steps&&steps.length>0){
        }else{
            _temp.find('.add-node').trigger("click");
        }
	};
	
	//脚本节点初始化
	function scriptNodeInit(_temp,step){
		//执行账户初始化数据
		semaphore.add();
		$.ajax({
			type : 'post',
			url : basePath+'nm/components/accountAction!searchAccountList.action',
			dataType:'json',
			data:{
				applicationId : APPID
			},
			success:function(result){
				var data = result.data;
				if(data){
					 var inner = '';
					 for(var i=0;i< data.length;i++){
                        if(step&&step.account==data[i].account){
    						 inner += '<option value="'+data[i].account+'" selected>'+data[i].account+'</option>';					 
                        }else{
    						 inner += '<option value="'+data[i].account+'">'+data[i].account+'</option>';					 
                        }
					 };
					 _temp.find('.step_accout_sel').html(inner).chosen();
				}
				semaphore.sub(updateOldData);
			}
		});
		
		//脚本名称初始化数据
		semaphore.add();
		$.ajax({
			  type : 'post',
			  url: basePath+"nm/components/scriptAction!getScriptList.action",			  
			  dataType:'json',
			  data:{
				  applicationId : APPID
			  },
			  success: function(reponseText){
				  var inner = '<option></option>';
				  var data = reponseText.data; 
				  for(var i=0;i< data.length;i++){
					  inner += '<option value="'+data[i].scriptId+'">'+data[i].name+'</option>';					 
				  }
				  _temp.find('.cmbScript').html(inner).chosen({width:'350px'}).change(function(){
					  var scriptId = _temp.find('.cmbScript').val();					
					  $.ajax({
						  type : 'post',
						  url: basePath+"nm/components/scriptAction!getScriptContent.action",			  
						  dataType:'json',
						  data:{
							  scriptId : scriptId
						  }, 
						  success: function(result){
							  	if(result.success){
							  		codeMir.setValue(result.data.content);
									codeMir.setType(result.data.type);
									printMsg('脚本加载成功！',1);
							  	}else{
							  		printMsg(result.msg.message,result.msg.msgType);
							  	}
							  	
						  }
					  });
				  });
				  semaphore.sub(updateOldData);
			  }
		}); 
		
		//脚本来源面板切换
		_temp.on('click','input[name=scriptFrom]',function(){
            var radioVal = $(this).val(),
                $scriptCopy = _temp.find('.scriptCopy'),
                $scriptUpdate = _temp.find('.scriptUpdate');
            if(radioVal==1){
                $scriptCopy.slideUp();
                $scriptUpdate.slideUp();
            }else if(radioVal==2){
                $scriptCopy.slideDown();
                $scriptUpdate.slideUp();
            }else if(radioVal==3){
                $scriptCopy.slideUp();
                $scriptUpdate.slideDown();
            }
        });
		//导入本地脚本
		var _fileUpload = _temp.find('.fileUpload');
	 
		_fileUpload.asyncUpload({
			beforeUpload:function(file){
				 var ext = file.value.split('.').pop().toLowerCase();
				 if (['sh', 'bash', 'ksh', 'bat', 'prl', 'pl', 'py', 'pyc'].indexOf(ext) == -1) {
	                printMsg('脚本类型不合法',2);
	                return false;
				 }
			},
			callback:function(rs){
				if(rs.success){
					var text = rs.data.content;
					var type = rs.data.type;
					if(text&&type){
						var value = text.trim().replace(/@##@/g, "\r\n");
						codeMir.setValue(value);
						codeMir.setType(type);
					}
				}else{
					printMsg(rs.msg.message,rs.msg.msgType);
				}
			},
			defalutProgress : true,
			saveUrl : basePath + 'nm/components/uploadAction!uploadScript.action'
		});
		// 脚本内容插件初始化
		var codeMir = null;
		
         if(step&&step.scriptContent){
            codeMir = _temp.find('.code').codeMirror();
            codeMir.setType(step.scriptType);
            codeMir.setValue(step.scriptContent);
         }else{
            codeMir = _temp.find('.code').codeMirror();
         }
         if(step&&(step.ipList || step.ccScriptId)){
		     _temp.find('.iplist').createServerIp({
	            	width:'700px',
	            	ipListString:step.ipListStatus,
	            	serverSetId : step.serverSetId,
	            	ccScriptId : step.ccScriptId || 0,
	            	ccScriptParam : step.ccScriptParam,
	            	ccScriptName : step.ccScriptName,
	            	ipOnChange:function(ipStr,count){
            			_temp.find('.step_service_input').val('共'+count+'台');
	            	}
//	            	ccOnChange:function(){
//	            		_temp.find('.step_service_input').val('CC脚本');
//	            	}
	           });
         }else{
            _temp.find('.iplist').createServerIp({
            	width:'700px',
            	ipOnChange:function(ipStr,count){
            		_temp.find('.step_service_input').val('共'+count+'台');
            	}
//            	ccOnChange:function(){
//            		_temp.find('.step_service_input').val('CC脚本');
//            	}
            });
         }
		if(step&&step.isPause){
            _temp.find('.text-tr').removeClass('none');
        }
		if(step&&step.paramType == 2){
			_temp.find('.step_param_input').prop('disabled',true);
        }else{
        	_temp.find('.step_param_input').prop('disabled',false);
        }
        if(step&&step.scriptTimeout >= 0){
			_temp.find('.scriptTimeout').val(step.scriptTimeout);
        }
		_temp.on('click','.step_paramType',function(){
			 if($(this).prop('checked')){
				 _temp.find('.step_param_input').prop('disabled',true);
			 }else{
				 _temp.find('.step_param_input').prop('disabled',false); 
			 }
        });
		_temp.on('keydown','.scriptTimeout',function(e){
			var k = e.keyCode;
			if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)){  
		      return true;  
		    }else {  
		     return false;  
		    }  
		});
		_temp.on('change','.scriptTimeout',function(){
			var value = parseInt($(this).val());
			if(value<60){
				$(this).val(60);
			}else if(value>=60 && value<= 3600){
				$(this).val(value);
			}else if(value>3600){
				$(this).val(3600);
			}else{
				$(this).val(1000);
			}
		});
		nodeOperate(_temp);
	}
	
	
	//文件步骤模版初始化
	function fileInit(_temp,steps){
		//新增节点
		_temp.on('click','.add-node',function(){
			var _temp_s_n = $('#file-n-template');//脚本模版中的节点模版
			var _node_li = $('<li class="group-node-li group-node-item"></li>');
			_node_li.html(_temp_s_n.html());
			_temp.find('.group-node-ul>li:last').before(_node_li);
			_temp.find('.group-node-ul>li.group-node-item tr.tag-tr').addClass('none');
			
            if (_node_li.parent('.group-node-ul').find('.group-node-item').length > 1) {
            	// 新增节点后，需要聚焦到节点名称的输入框
            	_node_li.find('.step_name_input').focus();
            }
			
			fileNodeInit(_node_li);
        });
		
		stepPubInit(_temp, steps);
		
        if(steps&&steps.length>0){
        }else{
            _temp.find('.add-node').trigger("click");
        }
	};

	//文件节点初始化
	function fileNodeInit(_temp,step){
		var fileTransfer = _temp.find('.file-table').fileTransferModule();
		var _fileUpload = _temp.find('.fileTUpload');
		_fileUpload.on('click',function(){
			_temp.find('.file-table').popover('hide');
		});
		//执行账户初始化数据
		semaphore.add();
		$.ajax({
			type : 'post',
			url : basePath+'nm/components/accountAction!searchAccountList.action',
			dataType:'json',
			data:{
				applicationId : APPID
			},
			success:function(result){
				var data = result.data;
				if(data){
					 var inner = '';
					 for(var i=0;i< data.length;i++){
						 if(step&&step.account==data[i].account){
                             inner += '<option value="'+data[i].account+'" selected>'+data[i].account+'</option>';                   
                        }else{
                             inner += '<option value="'+data[i].account+'">'+data[i].account+'</option>';                    
                        }
					 }
					 _temp.find('.step_accout_sel').html(inner).chosen();

				}
				semaphore.sub(updateOldData);
			}
		});
		
		//本地文件
		_fileUpload.fileupload({
	    	url : basePath + "nm/components/uploadAction!uploadFile.action",
	    	dataType: 'json',
	    	change:function(e, data){
	    		var nameFail,sizeFail,repeat=[] , allFileName = fileTransfer.getAllFileName();
	    		$.each(data.files, function(index, file) {
	    			if(/.*[\u4e00-\u9fa5\s]+.*$/.test(file.name)){
	    				nameFail = true;
	    				return false;
	    			}
	    			if(file.size/(1024*1024) > 500){
	    				sizeFail = true;
	    				return false;
	    			}
	    			if(allFileName.indexOf(file.name)!=-1){
	    				if(repeat.indexOf(file.name)==-1){
	    					repeat.push(file.name);
	    				}
	    			}
	    		});
	    		if(nameFail){
	    			printMsg('文件名中不能包含中文或空格！',2);
	    			return false;
	    		};
	    		if(sizeFail){
	    			printMsg('文件不能大于500M！',2);
	    			return false;
	    		}
	    		if(repeat.length>0){
	    			printMsg('文件【'+repeat.join(',')+'】已经存在！',2);
	    			return false;
	    		}
	    		if(data.files.length + allFileName.length > 20){
	    			printMsg('本地上传文件不能超过20个，如需要传送大量文件，建议打包后再上传', 2);
	    			return false;
	    		}
	    	},	 
	    	progress:function(e,data) {
				var total = data.total;
	    		var loaded = data.loaded;
	    		var percent = (loaded*100 / total).toFixed();
                if (percent >= 99) {
                    percent = 99;
                }
	    		var fileName = data.files[0].name;   
	    		fileTransfer.updateLocalTr({
	    			fileName : fileName,
	    			percent : percent
	    		});
	    		isProgress = true;
	    	},
	    	done : function(e, data) {
	    		var fileName = data._response.result.data[0].fileName;
	    		fileTransfer.updateLocalTr({
	    			fileName : fileName,
	    			percent : 100
	    		});
	    		isProgress = false;
	    	},
	    	fail: function (e, data) {
	    		var status = data.jqXHR.status,fileName= data.files[0].name;
	    		if(status==413){
	    			printMsg('文件不能大于500M！',2);
	    			fileTransfer.fail(fileName);
	    		}
	    	},
	    	error : function(e, data){
	    		isProgress = false;
	    	}
	    }).on('fileuploadadd', function (e, data) {
	    	var fileName = data.files[0].name,
	    		fileSize = (data.files[0].size/1024).toFixed()+"KB",
	    		jqXHR = data.submit();
	    	fileTransfer.add({
	    		file : fileName,
	    		size : fileSize
	    	},'local',jqXHR);
	    	
	    	isProgress = true;
	    });
		
		//服务器文件
		_temp.on('click','.remoteFile',function(){
			fileTransfer.add();
		});
		
        if(step&&(step.ipList || step.ccScriptId)){
              _temp.find('.iplist').createServerIp({
              	width:'700px',
              	ipListString:step.ipListStatus,
              	serverSetId : step.serverSetId,
              	ccScriptId : step.ccScriptId || 0,
            	ccScriptParam : step.ccScriptParam,
            	ccScriptName : step.ccScriptName,
              	ipOnChange:function(ipStr,count){
            		_temp.find('.step_service_input').val('共'+count+'台');
            	}
//            	ccOnChange:function(){
//            		_temp.find('.step_service_input').val('CC脚本');
//            	}
              });
         }else{
            _temp.find('.iplist').createServerIp({
            	width:'700px',
            	ipOnChange:function(ipStr,count){
            		_temp.find('.step_service_input').val('共'+count+'台');
            	}
//            	ccOnChange:function(){
//            		_temp.find('.step_service_input').val('CC脚本');
//            	}
            });
         }
        if(step&&step.isPause){
            _temp.find('.text-tr').removeClass('none');
        }
        if(step&&step.fileSource){
//            var fileSource = step.fileSource;
//            fileTransfer.setValue(step.fileSource);
            fileTransfer.setValue(eval(step.fileSource));
        }
	    nodeOperate(_temp);
	};
	
	
	//节点操作
	function nodeOperate(_temp){
		$('input,.file-table').click(function(){
        	$(this).popover('hide');
        });
		//	剪切
		_temp.on('click',function(event){
			if ((event.target.nodeName.toLowerCase() == 'div'&&
					($(event.target).hasClass('step_oper_div')||
							$(event.target).hasClass('step_oper_div_check')))||
				(event.target.nodeName.toLowerCase() == 'td'&&
					($(event.target).hasClass('td_step_name')||
							$(event.target).hasClass('td_step_accout')||
							$(event.target).hasClass('td_step_service')||
							$(event.target).hasClass('td_step_param')||
							$(event.target).hasClass('td_step_oper')
					))){
				
				if(_temp.hasClass('cut-status')){
					_temp.find('.item-cut').trigger('click');
				}else{
					_temp.find('.node-edit').trigger('click');
				}
			};
		});
		_temp.on('click','.item-cut',function(){
	        confirmModal('提示','是否拆分该步骤?',function(){
	        	var _self = _temp.find('.item-cut');
	        	var _parent = _temp.parent().parent();
	        	var _ul = $('#group-ul');
	    		var _block_list = $('#block_list');
	    		var length = _ul.find('li.group-li').length;
	    		var _li = $('<li class="group-li"></li>');
	    		var _temp_s ,_temp_s_n ,_block;
	            var nextItem = _temp.nextAll('.group-node-item'); 
	            var curType =  _parent.find('input.group-type-input').val();
	            var curIndex = _parent.index();
	            if(curType==1){
	            	 _temp_s = $('#script-template');//脚本模版
	            	 _temp_s_n = $('#script-n-template');//脚本模版中的节点模版
	  	             _block = $('<div class="ijobs-block ijobs-block-j" block-type="1">步骤'+(length+1)+'</div>');
	            }else if(curType==2){
	            	 _temp_s = $('#file-template');//文件模版
	            	 _temp_s_n = $('#file-n-template');//脚本模版中的节点模版
	  	             _block = $('<div class="ijobs-block ijobs-block-w" block-type="2">步骤'+(length+1)+'</div>');
	            }else{
	            	return false;
	            }
	    		
	    		_li.html(_temp_s.html());
	    		_li.find('.group-node-ul>li:last').before(nextItem);
	    		_parent.after(_li);
	    		
	    		//新增节点
	            _li.on('click','.add-node',function(){
	                var _node_li = $('<li class="group-node-li group-node-item"></li>');
	                _node_li.html(_temp_s_n.html());
	                _li.find('.group-node-ul>li:last').before(_node_li);
	              
	                if (_node_li.parent('.group-node-ul').find('.group-node-item').length > 1) {
	                	// 新增节点后，需要聚焦到节点名称的输入框
	                	_node_li.find('.step_name_input').focus();
	                }
	                
	                scriptNodeInit(_node_li);
	                _li.find('.group-node-ul>li.group-node-item tr.tag-tr').addClass('none');
	            });
		
	            _block_list.append(_block);
	            _block_list.find('div.ijobs-block').eq(curIndex).after(_block);
	            _block_list.find('div.ijobs-block').each(function(i,opt){
	            	var g_name = _ul.find('input.group-name-input').eq(i).val();
	            	if(g_name){
	            		$(opt).text(_ul.find('input.group-name-input').eq(i).val());
	            	}else{
	            		$(opt).text('步骤'+(i+1));
	            	}
	            });
	            stepPubInit(_li);
	            $('#block_list').find('.ijobs-block').droppable({
	                over: function(event, obj){
	                	var _ul = $('#group-ul');
	                	var target = $(this);
	                	var b_type = target.attr('block-type');
	                	var n_type = _ul.find('li.group-li').eq(curr_index).find('input.group-type-input').val();
	                    $('#block_list').find('div.ijobs-block').removeClass('block-hover');
	                    if (b_type == n_type){
	                    	target.addClass('block-hover');
	                    }
	                },
	                drop: function(event, obj){
	                    var target = $(this);
	                    $(this).addClass('block-active');
	                    target.removeClass('block-hover');
	                    setTimeout(function(){
	                        target.removeClass('block-active');
	                    },1500);
	                    return false;
	                }
	            });
	          //撤销剪切模式
	    		_li.find('.step-cut').removeClass('cut-mode');
	    		_li.find('.group-node-item').off('mouseover');
	    		_li.find('.cut-status').removeClass('cut-status');
	    		_li.find('.item-cut').hide().css({'right': '-10px','opacity':0});
	            //撤销剪切模式
	            _parent.find('.step-cut').removeClass('cut-mode');
	            _parent.find('.group-node-item').off('mouseover');
	            _parent.find('.cut-status').removeClass('cut-status');
	            _parent.find('.item-cut').hide().css({'right': '-10px','opacity':0});
			});
	    });
		
        //暂停
        _temp.on('click','input[name=stop-after-step]',function(){
            var _tr_tag = _temp.find('.tag-tr');
            var _tr_text = _temp.find('.text-tr');
            if($(this).prop("checked")){
                _tr_tag.addClass('none');
                _tr_text.removeClass('none');
            }else{
                _tr_text.addClass('none');
            }
        });
       //节点名称焦点聚焦
        _temp.on('click','.step_name_input',function(){
//        	_temp.siblings().find('.tag-tr').addClass('none');
            _temp.find('.tag-tr').removeClass('none');
        });
		//节点编辑
		_temp.on('click','.node-edit',function(){
			var _tr_tag = _temp.find('.tag-tr');
			if(_tr_tag.hasClass('none')){
				_tr_tag.removeClass('none');
                _temp.siblings('li.group-node-item').find('tr.tag-tr').addClass('none');
                
			}else{
				_tr_tag.addClass('none');
			}
		});
		
		//节点删除
		_temp.on('click','.node-del',function(){
			confirmModal('提示','是否删除该节点?',function(){
                if (_temp.parent().find('.group-node-item').length === 1) {
                    printMsg('步骤至少需要一个节点！',2);
                    return;
                } else {
    				_temp.remove();
                }
			});
		});
		
		//节点上移
		_temp.on('click','.node-up',function(){
			var _parent = _temp.parent();
			if(_parent.find('li.group-node-item').index(_temp)>0){
				_temp.insertBefore(_temp.prev()).css({background: '#ddd'}).animate({
					backgroundColor : '#fff'
				},1000);
			}
		});
		
		//节点下移
		_temp.on('click','.node-down',function(){
			var _parent = _temp.parent();
			var _items = _parent.find('li.group-node-item');
			if(_items.index(_temp)<_items.length-1){
				_temp.insertAfter(_temp.next()).css({background: '#ddd'}).animate({
					backgroundColor : '#fff'
				},1000);
			}
		});
		
		//格式化
		
		_temp.on('mouseenter','.td_step_service',function(){			
			$(this).find('.king-btn-mini').removeClass('none');
		});
		_temp.on('mouseleave','.td_step_service',function(){ 
			$(this).find('.king-btn-mini').addClass('none');
		});
		//复制
		 
		_temp.on('click','.serverip-copy-btn',function(){ 			 
			var ipString = _temp.find('.hidden-serverip-string').val();
			var ipList = _temp.find('.hidden-serverip-string').data('ipList');
			var ccScriptId = _temp.find('input.cc-scriptId').last().val();	
			var ccScriptParam = $.trim(_temp.find('.cc-param-hidden').last().text());
			var ccScriptName = $.trim(_temp.find('.cc-name-hidden').last().text());
			if(ccScriptId && ccScriptId != 0){
				copyScriptId= ccScriptId;
				copyScriptName = ccScriptName;
				copyScriptParam = ccScriptParam;
				copyIp = null;
				printMsg('cc脚本复制成功',1);
				return ;
			}
			if(ipString && ipString.split(',').length>0){
				copyIp = ipList;
				copyScriptId= 0;
				copyScriptName = copyScriptParam = '';
				printMsg('已复制'+ipString.split(',').length+'条IP记录',1);
			}else{
				printMsg('请选择当前节点的服务器',2);
			}		
		});
		// 粘贴
		_temp.on('click','.serverip-paste-btn',function(){
			if(copyScriptId || (copyIp && copyIp.length>0)){ 
				  _temp.find('.iplist').createServerIp({
		            	width:'700px', 
		            	ipListString:copyIp,
		            	ccScriptId : copyScriptId || 0,
		            	ccScriptParam : copyScriptParam,
		            	ccScriptName : copyScriptName,
					  	ipOnChange:function(ipStr,count){
		            		_temp.find('.step_service_input').val('共'+count+'台');
		            	}
//		            	ccOnChange:function(){
//		            		_temp.find('.step_service_input').val('CC脚本');
//		            	}
		           });
			}else{
				printMsg('请选择节点的服务器',2);
			}
		});
		
		//节点拖拽缩略图
		var container = $('#block_list_warpper');
	    _temp.find(".node-drag" ).draggable({
	        start: function(){
	        	var _target = $(this);
	        	var _ul = $('#group-ul');
	        	var _node = _target.closest('li.group-node-item');//当前拖动的节点
	        	var _step = _node.closest('li.group-li');//当前拖动节点的步骤
	        	var n_index = _ul.find('li.group-li').index(_step);//步骤索引
	        	curr_index = n_index;
	            container.fadeIn(500);
	            _target.addClass('drag-item');
	            
	          //根据当前拖动图标获取当前节点及步骤索引
	        	var _ul = $('#group-ul');
	        	var _blocks = container.find('div.ijobs-block');
	        	_ul.find('li.group-li').each(function(i){
	        		var g_name = $.trim($(this).find('input.group-name-input').val());
	        		if(g_name){
	        			if(g_name.length>10){
	        				_blocks.eq(i).text(g_name.slice(0,10)+' ...');
	        			}else{
	        				_blocks.eq(i).text(g_name);
	        			}
	        		}else{
	        			_blocks.eq(i).text('步骤'+(i+1));
	        		}
	        	});
	        },
	        stop: function(){
	        	var _target = $(this);
	        	var _dragIcon = _target.find('.fa');
	        	_dragIcon.animate({width:0,height:1,opacity: 0},500,function(){
	        		_target.attr('style','position: relative;').removeClass('drag-item');
	        		_dragIcon.removeAttr('style');
	            });
	        	
	        	//根据当前拖动图标获取当前节点及步骤索引
	        	var _ul = $('#group-ul');
	        	var _node = _target.closest('li.group-node-item');//当前拖动的节点
	        	var _step = _node.closest('li.group-li');//当前拖动节点的步骤
	        	var n_type = _step.find('input.group-type-input').val();//当前拖动节点步骤的类型
	        	var n_index = _ul.find('li.group-li').index(_step);//步骤索引
	        	var n_length = _step.find('li.group-node-item').length;
	        	
	        	
	        	//获取拖放至的block节点
	        	var _block_active = container.find('div.block-active');
	        	var b_type = _block_active.attr('block-type');
	        	//活动block生效
	        	if(b_type){
	        		if(b_type==n_type){
	        			var b_index = _block_active.index();
	        			if(n_index==b_index){
	        				
	        			}else{//index不一致时触发真正的拖动
	        				_ul.find('li.group-li').eq(b_index).find('ul.group-node-ul>li:last').before(_node);
	        			}
	        			_block_active.removeClass('.block-hover');
		        	}else{
//		        		printMsg('步骤类型不一致！', 2);
		        	}
	        	}
	        	
	            setTimeout(function(){
	                container.fadeOut(500);
	            },1000);
	            
	        }
	    });
	    
	    $('#block_list').find('.ijobs-block').droppable({
            
            over: function(){
            	var _ul = $('#group-ul');
            	var target = $(this);
            	var b_type = target.attr('block-type');
            	var n_type = _ul.find('li.group-li').eq(curr_index).find('input.group-type-input').val();
                $('#block_list').find('div.ijobs-block').removeClass('block-hover');
                if (b_type == n_type){
                	target.addClass('block-hover');
                }
            },
            drop: function(event, obj){
        		
                var target = $(this);
                $(this).addClass('block-active');
                target.removeClass('block-hover');
                setTimeout(function(){
                    target.removeClass('block-active');
                },1500);
                return false;
            }
        });
	}
	
	//作业保存
	$('#saveTask').click(function(){
		saveTask(false);
	});
    //作业执行
    $('#runTask').click(function(){
        saveTask(true);
    });
    
	function saveTask(runFlag){
		$('.popover').removeClass('in');
        var data = getAllData(true);
        dataSteps = data.steps;
        //console.log(dataSteps);
		$('.popover').each(function(i){
			if($(this).hasClass('in')){
				$(this).scrollGotoHere();
				return false;//退出循环
			}
		});
        if(!data) return false;
        if(isProgress){
        	printMsg('请等待文件上传完成！',2);
        	return false;
        }
        $('#group-ul tr.tag-tr,#group-ul tr.text_tr').addClass('none');
        var haveSameNameStep=[];
        for(var i=0,len=data.steps.length;i<len;i++){
			if(data.steps[i].type==2){
				$.each(JSON.parse(data.steps[i].fileSource),function(j,opt){
					if(opt.ipList && opt.ipList.split(',').length>1){
						haveSameNameStep.push(i);
					}
				});
			}
		}
		if(haveSameNameStep.length>0){
			 confirmModal('提示','从多台服务器拉取同名文件，是否在目标路径下追加源IP子路径？',function(){
				 for(var i=0;i<haveSameNameStep.length;i++){
					data.steps[haveSameNameStep[i]].fileTargetPath += '/[FILESRCIP]/';
				}
				 taskExecuteAction(data,runFlag);
			 });
		}else{
			var allRepeatName=[],repeatNameStep =[],repeat = [];
			for(var i=0,len=data.steps.length;i<len;i++){
				if(data.steps[i].type==2){
					repeat = validFileNameRepeat(JSON.parse(data.steps[i].fileSource));
					if(repeat.length>0){
						allRepeatName.concat(repeat);
						repeatNameStep.push(i);
					}
				}
			}
			var confirmModalMsg;
			if(allRepeatName.length>0){
				confirmModalMsg = "存在重名文件【"+allRepeatName.join(',')+"】,请选择操作";
			}
			if(confirmModalMsg){
				confirmModal_yesNoCancel(null,confirmModalMsg,function(){
					taskExecuteAction(data,runFlag);
				},function(){
					for(var i=0;i<repeatNameStep.length;i++){
						data.steps[repeatNameStep[i]].fileTargetPath += '/[FILESRCIP]/';
					}
					taskExecuteAction(data,runFlag);
				});
			}else{
				taskExecuteAction(data,runFlag);
			}
		}
		
	};
	
	function taskExecuteAction(_data,runFlag){
		_data.steps = JSON.stringify(_data.steps);
		$.load();
		$.ajax({
            type : 'POST',
            url : basePath + 'nm/jobs/jobsAction!saveTask.action',
            dataType : 'json',
            data : _data,
            success : function(result) {
                if(result.success){
                    if(runFlag){
                    	extraObj.taskId = result.data.taskId;
                    	extraObj.historytype = extraObj.historytype||3;
                    	createNewTab('作业预览', './app/previewTask.jsp', '作业执行', extraObj); 
                    }else{
                    	$('#taskId').val(result.data.taskId);
                        var _ul = $('#group-ul');
                        var blocks = result.data.blocks;
                        $.each(blocks,function(index,block){
                            var _group_li = $('#group-ul').find('li.group-li').eq(index);
                            var steps = block.steps;
                            if(_group_li.length&&steps.length){
                                $.each(steps,function(i,step){
                                    var _item = _group_li.find('li.group-node-item').eq(i);
                                    if(_item.length&&step.stepId){
                                        _item.find('input.step_id').val(step.stepId);
                                    }
                                });
                            }
                        });
                        printMsg('保存成功！', 1);
                        oldTaskEditContent = JSON.stringify(getAllData(false));
                    }
                }else{
                    printMsg(result.msg.message,result.msg.msgType);
                }
                $.unload();
            }
        });
	}
	
	function validFileNameRepeat(_rs){
		var fileNameList=[],repeat=[];
		$.each(_rs,function(i,opt){
			var file = opt.file,
			fileList = file.split(',');
			for(var j=0;j<fileList.length;j++){
				var startIndex = -1;
				if(fileList[j].lastIndexOf('/') !=-1){
					startIndex = fileList[j].lastIndexOf('/');
				}else if (fileList[j].lastIndexOf('\\') !=-1){
					startIndex = fileList[j].lastIndexOf('\\');
				}
				fileNameList.push(fileList[j].slice(startIndex+1));
			}
		});
		for(var i=0;i< fileNameList .length;i++){
			var name = fileNameList[i];
			fileNameList.splice(i,1);
			if(fileNameList.indexOf(name)!=-1&&repeat.indexOf(name)==-1){
				repeat.push(name);
			}
			i--;
		}
		return repeat; 
	}
    
    //设置所有值
    function setAllData(data){
        var taskName = $('#task-name').val(data.taskName);
        var _group = $('#group-ul'); //组
        $.each(data.blocks,function(i,block){
              setOneStepData(_group,block);
        });
    };
    //获取每一步骤的值
    function setOneStepData(_group,block){
    	var _block_list = $('#block_list');
        if(block.type==1){
            var _temp_s = $('#script-template');//脚本模版
            var _block = $('<div class="ijobs-block ijobs-block-j" block-type="1">'+block.blockName+'</div>');
            var _li = $('<li class="group-li"></li>');
            _li.html(_temp_s.html());
            _group.append(_li);
            _li.find('input.group-name-input').val(block.blockName);
            _block_list.append(_block);
            var steps = block.steps;
            scriptInit(_li,steps);
            $.each(steps,function(i,step){
                setScriptNodeData(_li,step);
            });
        }else if(block.type==2){
            var _temp_f = $('#file-template');//文件模版
            var _block = $('<div class="ijobs-block ijobs-block-w" block-type="2">'+block.blockName+'</div>');
            var _li = $('<li class="group-li"></li>');
            _li.html(_temp_f.html());
            _group.append(_li);
            _li.find('input.group-name-input').val(block.blockName);
            _block_list.append(_block);
            var steps = block.steps;
            fileInit(_li,steps);
            $.each(steps,function(i,step){
                setFileNodeData(_li,step);
            });
        }
         _group.find('tr.tag-tr').addClass('none');
    };
    
    function setScriptNodeData(_temp,step){
        var _temp_s_n = $('#script-n-template');//脚本节点模版
        var _node_li = $('<li class="group-node-li group-node-item"></li>');
            _node_li.html(_temp_s_n.html());
            _temp.find('.group-node-ul>li:last').before(_node_li);
         var _node_table = _node_li.find('.group-node-table'); 
         
         _node_table.find('input.step_id').val(step.stepId);
         _node_table.find('.step_name_input').val(step.name);
         _node_table.find('input[name=stop-after-step]').prop('checked',!!step.isPause);
         _node_table.find('.step_text_input').val(step.text);
         _node_table.find('.step_service_input').val('共'+step.ipList.split(',').length+"台");
         _node_table.find('.step_param_input').val(step.scriptParam);
         scriptNodeInit(_node_li,step);
    };
    
    function setFileNodeData(_temp,step){
        var _temp_s_n = $('#file-n-template');//脚本节点模版
        var _node_li = $('<li class="group-node-li group-node-item"></li>');
            _node_li.html(_temp_s_n.html());
            _temp.find('.group-node-ul>li:last').before(_node_li);
         var _node_table = _node_li.find('.group-node-table'); 
         
         _node_table.find('input.step_id').val(step.stepId);
         _node_table.find('.step_name_input').val(step.name);
         _node_table.find('input[name=stop-after-step]').prop('checked',!!step.isPause);
         _node_table.find('.step_text_input').val(step.text);
         _node_table.find('.step_service_input').val('共'+step.ipList.split(',').length+"台");
         _node_table.find('.step_param_input').val(step.fileTargetPath.replace(/\/\[FILESRCIP\]\//g,''));
         fileNodeInit(_node_li,step);
    }
    
    $(document.body).click(function(e){
    	var _target =  $(e.target);
    	if(_target.closest('#group-ul').length===0){
    		$.each($('.step-cut'),function(){
        		if ( $(this).hasClass('cut-mode')){
        			$(this).removeClass('cut-mode');
        			var _temp =  $(this).closest('.group-node-ul');
        			_temp.find('.group-node-item').off('mouseover');
        			_temp.find('.cut-status').removeClass('cut-status');
        			_temp.find('.item-cut').hide().css({'right': '-10px','opacity':0});
        			return false;
        		}
        	});
    	}
    });
    
    //编辑作业返回按钮
    $('#returnBtn').click(function(){
    	if(JSON.stringify(getAllData(false)) != oldTaskEditContent){
    		var r = confirm("您所编辑的作业尚未保存，是否确定离开？");
    		if (r == true) {
		    	if(extraObj.historytype === 5){
		    		createNewTab('移动作业列表', './app/mJobList.jsp', '移动端作业管理');
		    	}else{
		    		createNewTab('作业执行', './app/jobList.jsp', '作业执行',extraObj);
		    	}
    		}
		} else {
			if(extraObj.historytype === 5){
	    		createNewTab('移动作业列表', './app/mJobList.jsp', '移动端作业管理');
	    	}else{
	    		createNewTab('作业执行', './app/jobList.jsp', '作业执行',extraObj);
	    	}			
		}
    });
  //初始化页面时直接调用
   (function(){
	   semaphore.reset();
	   initing = true;
	   $.load();
	   if(havePropInObj(extraObj)){//判断扩展参数是否存在
			if(extraObj.historytype != 3){//如果为新建作业预览返回泽不显示返回按钮
				 $('#returnBtn').removeClass('none');
			}
			if(extraObj.taskId){
				if(extraObj.type==='edit'){//编辑作业
					$.ajax({
		                type : 'post',
		                url : basePath + "nm/jobs/jobsAction!getTaskDetail.action",
		                dataType : 'json',
		                data : {
		                    taskId : extraObj.taskId
		                },
		                success : function(result) {
		                	$('#taskId').val(extraObj.taskId);
		                    if (!result.success) {
		                        printMsg(result.msg.message, 2);
		                    } else {
		                        setAllData(result.data);
		                        allTextHtmlDecode();
		                    }
		                    $.unload();
		                    $('input').click(function(){
		                    	$(this).popover('hide');
		                    });
		                }
		            });
				}else{
					$.ajax({
		                type : 'post',
		                url : basePath + "/nm/jobs/jobsAction!cloneTask.action",
		                dataType : 'json',
		                data : {
		                    taskId : extraObj.taskId
		                },
		                success : function(result) {
		                    if (!result.success) {
		                        printMsg(result.msg.message, 2);
		                    } else {
		                        setAllData(result.data);
		                        allTextHtmlDecode();
		                    }
		                    $.unload();
		                    $('input').click(function(){
		                    	$(this).popover('hide');
		                    });
		                }
		            });
				}
			}else{
				$('#addScriptBtn').trigger("click");
			}
		}else{
        		$('#addScriptBtn').trigger("click");
		}
		$('#task-name').focus();
        //步骤节点拖拽
        var sortIndex = null;
        $('#group-ul').sortable({
        	handle: 'div.group-node-top',
        	start  : function(event, ui){
        		var item = ui.item;
        		sortIndex =item.index();
        	},
        	stop : function(event, ui){
        		var item = ui.item;
        		var index = item.index();
        		if(sortIndex!=null&&sortIndex>=0&&index!=sortIndex){
        			var _block_list = $('#block_list').find('div.ijobs-block');
        			var name_list = $('#group-ul').find('input.group-name-input');
        			var a = _block_list.eq(sortIndex);
        			var b = _block_list.eq(index);
        			if(sortIndex>index){
        				b.before(a);
        			}else{
        				b.after(a);
        			}
        			var temp = a.text();
        			a.text(b.text());
        			b.text(temp);
        		}
        	}
        });
	})();
});