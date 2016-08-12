/*

 	执行脚本-快速开始分发文件    
*/
 
(function(){
	var isProgress = false;
	$('[data-toggle="tooltip"]').tooltip();
	var fileTransfer = $('#fileSource').fileTransferModule();
	$('#userAccount').createChosen({type:'user'});
	
	// 作业名称默认值 
    $('#name').val("分发文件-"+createDateStr());
    $('#iplist').createServerIp({width:'650px'});
	$('#addUserBut').click(function(){	 
		$('#regUserDiv').slideToggle(500);
	});
	
	$('#userName_input').keypress(function(){
		$('#resultMsg').html('');	
	});

	$('#regUser').click(function(){
		var userName = $('#userName_input').val();
		if(userName.length>0 && userName.indexOf(' ') == -1){
			$.ajax({
				type : 'POST',
				url : basePath+'nm/components/accountAction!saveAccount.action',
				dataType : 'json',
				data:{
					account:userName, 
				},
				success : function(result){
					if(result.success){ 
						// 将新添加的设置成默认的选中
						$('#userAccount>option:first').after('<option value="'+userName+'" selected>'+userName+'</option>');
						$('#userAccount').chosen("destroy").chosen({}); 
						 
						$('#userName_input').val('');
						$('#regUserDiv').hide(500);
					}else if(!result.success){		
						printMsg(result.msg.message,2)				
					}
				}
			});		 
		} else {
            printMsg('请输入账户名称！',2);
            return;
        }
	});

	$('#txtTargetFilePath').click(function(){
		$(this).parent().attr('data-content',"必填项");
		$(this).parent().popover('hide');
	});
	$('#userAccount_chosen').click(function(){
		$(this).parent().attr('data-content',"必填项");
		$(this).parent().popover('hide');
	});
	// 开始执行任务
	$('#startBut').click(function(){
		var ipString = $('#iplist input.hidden-serverip-string').val();
		var serverSetId = $('#iplist input.hidden-serverSetId').val();
		var ccScriptId = $('#iplist input.cc-scriptId').val();
		var ccScriptParam = $.trim($('#iplist .cc-param-hidden').text());
		var FileSourValue =fileTransfer.getValue(); 
		
		var name = $('#name');
		var txtTargetFilePath = $('#txtTargetFilePath');
		var accountName = $('#userAccount').val();
		
		// 文件名校验
		if(!name.val()) {
			name.popover({"viewport":false}).popover('show').scrollGotoHere();
			name.click(function(){
				$(this).popover('hide');
			})
        	return;
        }
		// 源文件校验
		if(!FileSourValue||FileSourValue.length<1){
			if(fileTransfer.tbody.children('tr').length>1){
				$.each(fileTransfer.tbody.children('tr:not(.blankTr)'),function(i,opt){
					if($(opt).find('.f_save').hasClass('none')){
						$(opt).find('.saveFile').scrollGotoHere();
						$(opt).css({backgroundColor : '#ddd'});
						$(opt).stop();
						$(opt).animate({
							'backgroundColor' : '#fff'
						},2000)
						printMsg('数据未保存！',2)
						return false;
					}
				});
			}else{
				fileTransfer.table.attr('data-content',"必填项");
				fileTransfer.table.popover({"viewport":false}).popover('show').scrollGotoHere();
				fileTransfer.table.click(function(){
					$(this).popover('hide');
				}); 
			}
        	return;
		}
		
		var targetFilePath = $.trim(txtTargetFilePath.val());
		// 目标路径
		if(!targetFilePath) {
			txtTargetFilePath.popover({"viewport":false}).parent().popover('show').scrollGotoHere();
			return;
		}
		var validFilePath = validPaths(targetFilePath);
		if(validFilePath !== true){
			txtTargetFilePath.parent().attr('data-content',validFilePath);
			txtTargetFilePath.popover({"viewport":false}).parent().popover('show').scrollGotoHere();
			return;
		}
		if(!accountName || accountName == -1){
			$('#userAccount_chosen').popover({"viewport":false});
			$('#userAccount_chosen').parent().attr('data-content',"必填项");
			$('#userAccount_chosen').parent().popover('show').scrollGotoHere();
			return;
		}
		if(!ipString && !ccScriptId ){
			$('#iplist').find('.showModel').popover({"viewport":false})
						.attr('data-content',"必填项")
						.popover('show')
						.scrollGotoHere();
			return;
		}
		var tagerIp = ipString.split(',');
		var sourIp = [];
		for(var i=0;i<FileSourValue.length;i++){
			if(FileSourValue[i].ipList){
				sourIp = sourIp.concat(FileSourValue[i].ipList.split(','));
			}
		}
		for(var i=0;i<tagerIp.length;i++){
			if(sourIp.indexOf(tagerIp[i]) !=-1){ 
				$('#iplist').find('.showModel').popover({"viewport":false})
				.attr('data-content',"文件传输，禁止从本机传本机，IP："+tagerIp[i].replace(/^.*:/,''))
				.popover('show')
				.scrollGotoHere();
				
				$('#iplist').off('click').on('click',function(){
					$('#iplist').find('.showModel').popover('hide');
				})
				return;
			}
		}
		var haveSameName = false;
		$.each(FileSourValue,function(i,opt){
			if(opt.ipList&&opt.ipList.split(',').length>1){
				haveSameName = true;
				return false;
			}
		});
		if(haveSameName){
			 confirmModal('提示','从多台服务器拉取同名文件，是否在目标路径下追加源IP子路径？',function(){
				 targetFilePath +='/[FILESRCIP]/';
				 taskExecuteAction();
			 })
		}else{
			var repeatName = fileTransfer.validFileNameRepeat(FileSourValue);
			var confirmModalMsg;
			if(repeatName.length>0){
				confirmModalMsg = "存在重名文件【"+repeatName.join(',')+"】,请选择操作";
			}
			
			if(confirmModalMsg){
				confirmModal_yesNoCancel(null,confirmModalMsg,function(){
					taskExecuteAction();
				},function(){
					targetFilePath +='/[FILESRCIP]/';
					taskExecuteAction();
				})
			}else{
				taskExecuteAction();
			}
		}
		
		
		function taskExecuteAction(){
			if(isProgress){
	        	printMsg('请等待文件上传完成！',2);
	        	return false;
	        }
			$.load();
			$.ajax({
				type : 'POST',
				url : basePath+'nm/jobs/taskExecuteAction!fastPushFile.action',
				dataType : 'json',
				data:{
					name:$.trim(name.val()),
					fileSource:JSON.stringify(FileSourValue),
					fileTargetPath:targetFilePath,
					account:accountName,
					ipList:ipString,
					serverSetId : serverSetId,
					ccScriptId : ccScriptId,
					ccScriptParam : ccScriptParam
				},
				success : function(reponseText){
					if(!reponseText.success){
						printMsg(reponseText.msg.message,2)
						$.unload();
					  }else{
						var stepInstanceName = reponseText.data.stepInstanceName;
						var stepInstanceId = reponseText.data.stepInstanceId;
					  	var taskInstanceId = reponseText.data.taskInstanceId;
					  	$('#script-slide-panel').animate({ 
						     left:$('.king-layout6-sidebar').width()
						  }, 600 ,function(){	
							  $('body').css('overflow',"hidden");
							  $('#slideClips').addClass('none');
							  $.unload();
						  });
						 getStepExecuteDetail(stepInstanceId,0,null,2,stepInstanceName,$('#userAccount').val());
						 initSearchLog(stepInstanceId,0);
					  }
				}
			});	
		} 
	});
	
    // 远程文件上传
    $('#remoteFileEditBut').click(function(){
    	fileTransfer.add();    	
    });
    $("#fileUpload").fileupload({
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
    			fileTransfer.fail(fileName)
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
})();