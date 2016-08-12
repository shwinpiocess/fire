$(function($){
	//脚本名称
	$('input[name="name"]').val("执行脚本-"+createDateStr());
	$('#iplist').createServerIp({width:'700px'});
	$('[data-toggle="tooltip"]').tooltip();
	
	var codeMir;
	
	$('#userAccount').createChosen({type:'user'});	
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
						$('#userAccount>option:first').after('<option value="'+userName+'" selected>'+userName+'</option>');
						$('#userAccount').chosen("destroy").chosen({});
						$('#userName_input').val('');
						$('#regUserDiv').hide(500);
					}else if(result.success == false){						
						$('#resultMsg').html(result.msg.message);						
					}
				}
			});		 
		} else {
            printMsg('请输入账户名称！',2);
            return;
        }
        
	});
	
	window.setTimeout(function(){
		codeMir = $('#codediv').codeMirror();
		if(extraObj.scriptId){
			getcodeMirContent(extraObj.scriptId)
		}
	}, 20);
	
	//本地脚本上传
	$('#scriptFileUpload').asyncUpload({
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
					$('#scriptFileUpload').val('');
				}
			}else{
				printMsg(rs.msg.message,rs.msg.msgType);
			}
		},
		defalutProgress : true,
		saveUrl:basePath+'nm/components/uploadAction!uploadScript.action'
	});
    
	
	$('input[name=scriptFrom]:radio').click(function(){
		var type = this.value;
		 
		if(type == 1){
			$('#scriptCopy').slideUp(400);
			$('#scriptUpdate').slideUp(400);
		}
		else if(type == 2 ){
			$('#scriptCopy').slideToggle(400);
			$('#scriptUpdate').slideUp(400);
		}else if (type == 3){
			$('#scriptUpdate').slideToggle(400);
			$('#scriptCopy').slideUp(400);			
		}
	});
	getJobScriptListByAppSelect();
	function getJobScriptListByAppSelect(){
		$.ajax({
			  type : 'post',
			  url: basePath+"nm/components/scriptAction!getScriptList.action",			  
			  dataType:'json',
			  data:{
				  applicationId : APPID
			  },
			  success: function(reponseText){
				  var inner = '';
				  var data = reponseText.data; 
				  inner+="<option></option>"
				  for(var i=0;i< data.length;i++){
					  inner += '<option value="'+data[i].scriptId+'">'+data[i].name+'</option>';					 
				  }
				  $('#cmbScript').append(inner);
				  $('#cmbScript').chosen({width:'427px'}).change(function(){
					  var scriptId = $('#cmbScript').val();						
					  getcodeMirContent(scriptId)
				  });
			  }
		});
	}
	function getcodeMirContent(scriptId){
		$.load()
		$.ajax({
			  type : 'post',
			  url: basePath+"nm/components/scriptAction!getScriptContent.action",			  
			  dataType:'json',
			  data:{
				  scriptId : scriptId
			  }, 
			  success: function(result){
				  	if(result.success){
//				  		codeMir = $('#codediv').codeMirror();
				  		codeMir.setValue(result.data.content);
						codeMir.setType(result.data.type);
						printMsg('脚本加载成功！',1);
				  	}else{
				  		printMsg(result.msg.message,result.msg.msgType);
				  	}
				  	$.unload()
			  }
		  });
	}
	$('input[name=scriptTimeout]').keydown(function(e){
		var k = e.keyCode;
		if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)){  
	      return true;  
	    }else {  
	     return false;  
	    }  
	}).change(function(){
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
	$("#scriptBtn").on('click',function(){
		var name = $.trim($('input[name=name]').val());	
		var userAccountId = $('#userAccount').val();
		var ipList = $('#iplist input.hidden-serverip-string').val();
		var serverSetId = $('#iplist input.hidden-serverSetId').val();
		var ccScriptId = $('#iplist input.cc-scriptId').val();
		var ccScriptParam = $.trim($('#iplist .cc-param-hidden').text());
		var type = codeMir.getType();
		var content = codeMir.getValue();
		var scriptParam = $('input[name=scriptParam]').val();
		var scriptTimeout = $('input[name=scriptTimeout]').val();
		
		if(!name){
			$('input[name=name]').popover({"viewport":false})
								 .popover('show')
								 .scrollGotoHere()								 
			$('input[name=name]').click(function(){
				 $(this).popover('hide');
			 });
			return;
		}
		if(!userAccountId || userAccountId == -1){
			$('#userAccount_chosen').attr('data-content',"必填项")
									.popover({"viewport":false})
									.popover('show')
									.scrollGotoHere();
			$('#userAccount_chosen').click(function(){
				 $(this).popover('hide');
			 });
        	return;
        }
		if(ipList.length==0 && !ccScriptId ){
			$('#iplist').find('.showModel').popover({"viewport":false})
						.attr('data-content',"必填项")
						.popover('show')
						.scrollGotoHere();
        	return;
        }
        if(!content){
        	$('#codediv').find('.code-cont').popover({"viewport":false})
        				.attr('data-content',"必填项")
						.popover('show')
						.scrollGotoHere();
        	return;
        }
        $.load();
		$.ajax({
			  type : 'post',
			  url: basePath+"nm/jobs/taskExecuteAction!fastExecuteScript.action",
			  dataType:'json',
			  data:{
				  content : content,
				  account : $('#userAccount').find('option:selected').text(),
				  ipList : ipList,
				  serverSetId : serverSetId,
				  ccScriptId : ccScriptId,
				  ccScriptParam : ccScriptParam,
				  name : name,
				  type : type,
				  scriptParam : scriptParam,
				  scriptTimeout : scriptTimeout
			  },
			  success: function(reponseText){
				  if(!reponseText.success){
					  printMsg(reponseText.msg.message,2)
					  $.unload();
				  }else{
					var stepInstanceName = reponseText.data.stepInstanceName;
				  	var stepInstanceId = reponseText.data.stepInstanceId;
				  	
					  $('#script-slide-panel').animate({ 
						     left:$('.king-layout6-sidebar').width()
					  }, 600 ,function(){	
						  $('body').css('overflow',"hidden");
						  $('#slideClips').addClass('none');
						  $.unload();
					  });
					  getStepExecuteDetail(stepInstanceId,0,null,1,stepInstanceName,$('#userAccount').val());
					  initSearchLog(stepInstanceId,0,1);
				  }
			  }
		});
	}); 
	
	
});