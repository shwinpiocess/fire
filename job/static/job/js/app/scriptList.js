(function(){
	var codeMir = null;
	var createScriptMode = false;
	 $('#createDateStart').datepicker({
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        maxDate : new Date(),
        onSelect : function(dateText){
        	$('#createDateEnd').datepicker("option", "minDate", dateText);
        }
    });
    
    $('#createDateEnd').datepicker({
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        maxDate : new Date(),
        onSelect : function(dateText){
        	$('#createDateStart').datepicker("option", "maxDate", dateText);
        }
       
    });
	$('#creater').autocomplete({
		source: maintainers
	});
	$('#createrMe').click(function(){
		$('#creater').val(uin);
	});
 	
	$('#resetBtn').click(function(){
		$('#name').val('');
		$('#creater').val('');
		$('#createDateStart').val('');
		$('#createDateEnd').val('');
	});
	
	$('#findBtn').click(function(){
		searchResult(getSearchData());
	});
	
	function getSearchData(){
		var name =  $.trim($('#name').val());
		var creater =  $.trim($('#creater').val());
		var createDateStart = $('#createDateStart').val();
		var createDateEnd = $('#createDateEnd').val();
		var data = {
				name:name,
				creater:creater,
				createTimeStart:createDateStart,
				createTimeEnd:createDateEnd			 
		};
		return data;
	};
	
	$('.form-inline').keydown(function(event){
		if(event.keyCode == 13){
			searchResult(getSearchData());
		}
	});
	function searchResult(data){
	  var language = {
		        search: '全局搜索：',
		        lengthMenu: "每页显示 _MENU_ 记录",
		        zeroRecords: "没找到相应的数据！",
		        info: "分页 _PAGE_ / _PAGES_",
		        infoEmpty: "",
		        infoFiltered: "(从 _MAX_ 条数据中搜索)",
		        paginate: {
		        	first: '|<',
		            last: '>|',
		            previous: '<<',
		            next: '>>'
		        }
		    }
	    $('#resultTable>tbody').remove();
		$('#resultTable').DataTable({
			 bLengthChange: false,
			 destroy: true,
			 bProcessing: false,
		     serverSide: true,
			 iDisplayLength:10,		
			 ordering:false,
			 searching:false,
			 pagingType:'input',
			 ajax:{
				 type : "POST",
				 contentType:'application/json',
				 data : function(d){
					 if(data){
						 data.draw = d.draw;
						 data.start = d.start;
						 data.length = d.length;
						 return JSON.stringify(data);
					 } else {
						 return '{}';
					 }
				 },
				 url : basePath+'nm/components/scriptAction/getScriptList.action',				 
				 error :function(e){
						ajaxError(e);					 
				 }
			 },		 
			 columns:[
					   {data: 'name'},
					   {data: 'taskName'},
			           {data: 'creater'},
			           {data: 'createTime'},
			           {data: 'lastModifyUser'},			           
			           {data: 'lastModifyTime'},
			           {
			                data:null,
			                orderable:false,
			                render : function(data, type, row, meta){
			                	btnGroup = '<div class="btn-list" style="min-width:120px;"><a class="king-btn king-primary king-btn-mini edit" title="编辑">编辑</a>';
			                	btnGroup += '<a  class="king-btn king-danger king-btn-mini del" title="删除">删除</a></div>';
			                    return btnGroup;
			                }
			            }
			       ],
			  language:language
		 }); 
		
		$("#resultTable tbody").on('click', 'a.del', function(){
			var t = $("#resultTable").DataTable();
			var row = t.row($(this).parents('tr')), //获取按钮所在的行
			data = row.data();
			var scriptId = data.id;
			confirmModal('提示','是否删除该脚本',function(){
				$.ajax({
					contentType:'application/x-www-form-urlencoded',
					url : basePath+'nm/components/scriptAction/deleteScript.action',
					dataType : 'json',
					data:{
						scriptId:scriptId
					},
					success : function(result){
						if(result.success){
							printMsg(result.msg.message,1); 
							row.remove().draw();
						}else{
							printMsg(result.msg.message,2);
						}
					}
				});
			});			
		});	
		 
		$("#resultTable tbody").on('click', 'a.edit', function(){	
			var t = $("#resultTable").DataTable();
			var row = t.row($(this).parents('tr')), //获取按钮所在的行
			data = row.data(); 
			$('#scriptName').val(htmlDecode(data.name));
			$('#scriptId').val(data.id);
			$('#myModalLabel').html("编辑脚本");
			$.ajax({
				  type : 'post',
                  contentType:'application/x-www-form-urlencoded',
				  url: basePath+"nm/components/scriptAction/getScriptContent.action",			  
				  dataType:'json',
				  data:{
					  scriptId : data.id
				  }, 
				  success: function(result){
				  	if(result.success){
				  		$('#editScript').modal('show').draggable({
							cursor: "pointer",
							handle: "div.modal-header"
						});
				  		
				  		codeMir = $('#codediv').codeMirror({
							width:"600px",
							beforeFullscreen : function(curDom,cm){
						          var _dialog =  curDom.parentsUntil('.modal');
						          if(_dialog.length>0){
						        	  var  _modal = _dialog.parent();
						        	  if(cm.getOption("fullScreen")){
						        		  _modal.removeClass('modal-CodeMirror-fixed');
							          }else{
							        	  _modal.addClass('modal-CodeMirror-fixed');
							          }
						          }
							},
							beforeEsc:function(curDom,cm){
								var _dialog =  curDom.parentsUntil('.modal');
						          if(_dialog.length>0){
						        	  _dialog.parent().removeClass('modal-CodeMirror-fixed');
						          }
							}
						});
						if(result.data.content){
							codeMir.setValue(result.data.content);
							codeMir.setType(result.data.type);
						}else if(!createScriptMode){
							codeMir.setValue('');
						}
				  	}
				  }
			  });
		}); 
	}
	
	$('#editScript').on('hidden.bs.modal', function (e){
		 $('#codediv').empty();		
		 $('#mRadio').prop('checked','checked');
		 $('#scriptCopy').hide();
		 $('#scriptUpdate').hide();
		 $('#cmbScript').val('').chosen("destroy").chosen({width:'427px'});
		 $('#scriptName').val(null);
		 codeMir = null;
		 
	})
	$('input:radio').click(function(){
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
			  contentType:'application/json',
			  url: basePath+"nm/components/scriptAction/getScriptList.action",			  
			  dataType:'json',
			  success: function(reponseText){
				  var inner = '<option></option>';
				  var data = reponseText.data; 
				  for(var i=0;i< data.length;i++){
					  inner += '<option value="'+data[i].id+'">'+data[i].name+'</option>';					 
				  }
				  $('#cmbScript').append(inner);
				  $('#cmbScript').chosen({width:'427px'}).change(function(){
					  var scriptId = $('#cmbScript').val();						
					  $.ajax({
						  type : 'post',
                          contentType:'application/x-www-form-urlencoded',
						  url: basePath+"nm/components/scriptAction/getScriptContent.action",			  
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
			  }
		});
	}
	
 
	$('#scriptFileUpload').asyncUpload({
		beforeUpload:function(file){
			 var ext = file.value.split('.').pop().toLowerCase();
			 if (['sh', 'bash', 'ksh', 'bat', 'prl', 'pl', 'py', 'pyc'].indexOf(ext) == -1) {
               printMsg('脚本类型不合法',2);
               return false;
			 }
		},
		callback:function(rs){
			console.log(rs);
			if(rs.success){
				var text = rs.data.content;
				var type = rs.data.type;
				if(text&&type){
					var value = text.trim().replace(/@##@/g, "\r\n");
					codeMir.setValue(value);
					codeMir.setType(type);
				}else{
					codeMir.setValue('');
					codeMir.setType(1);	
				}
				$('#scriptFileUpload').val('');
			}else{
				printMsg(rs.msg.message,rs.msg.msgType);
			}
		},
		defalutProgress : true,
		saveUrl : basePath + 'nm/components/uploadAction/uploadScript.action'
	});
	$('#scriptSaveBtn').click(function(){
		var scriptId = $('#scriptId').val();		
		var name = 	$('#scriptName').val();
		var type =	parseInt(codeMir.getType());
		var content= codeMir.getValue();
		
        var data = {		     	
			name : name,
			type : type,
			content : content
	    };
		if(scriptId != ''){
			data.id =  parseInt(scriptId);
		}
		
		$.ajax({
			  contentType:'application/json',
			  url : basePath+"nm/components/scriptAction/saveScript.action",
			  dataType :'json',
			  data : JSON.stringify(data),
			  success: function(reponseText){
				  if(reponseText.success){
					  printMsg(reponseText.msg.message,1);
					  $('#editScript').modal('hide');
					  searchResult();
				  }else{
					  printMsg(reponseText.msg.message,2);
				  }
			  }
		});
	});	
    $('#findBtn').trigger('click');
    $('#createScript').click(function(){
    	$('#myModalLabel').html("新建脚本");
    	$('#scriptId').val(null);
    	createScriptMode = true;
    	$('#editScript').modal('show').draggable({
			cursor: "pointer",
			handle: "div.modal-header"
		});  		
  		codeMir = $('#codediv').codeMirror({
  			width:"600px",
  			beforeFullscreen : function(curDom,cm){
		          var _dialog =  curDom.parentsUntil('.modal');
		          if(_dialog.length>0){
		        	  var  _modal = _dialog.parent();
		        	  if(cm.getOption("fullScreen")){
		        		  _modal.removeClass('modal-CodeMirror-fixed');
			          }else{
			        	  _modal.addClass('modal-CodeMirror-fixed');
			          }
		          }
			},
			beforeEsc:function(curDom,cm){
				var _dialog =  curDom.parentsUntil('.modal');
		          if(_dialog.length>0){
		        	  _dialog.parent().removeClass('modal-CodeMirror-fixed');
		          }
			}
  		});
		 
    });
})();