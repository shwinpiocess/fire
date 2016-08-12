
(function(){
	$('#creater').autocomplete({
		source: maintainers
	});
	$('#createrMe').click(function(){
		$('#creater').val(uin);
	});
	
	$('#lastModifyUser').autocomplete({
		source: maintainers
	});
	$('#lastModifyUserMe').click(function(){
		$('#lastModifyUser').val(uin);
	});
    
	$('#resetBtn').click(function(){
		$('#name').val(null);
		$('#creater').val(null);
		$('#lastModifyUser').val(null);
		$('#createTimeStart').val(null);
		$('#createTimeEnd').val(null);
		$('#lastModifyTimeStart').val(null);
		$('#lastModifyTimeEnd').val(null);
	})
	$('#findBtn').click(function(){ 
		serachResult(getserachData());
	})
	
	$('.form-inline').keydown(function(event){
		if(event.keyCode == 13){
			serachResult(getserachData());
		}
	});
	
	function getserachData(){
		var name = $('#name').val().trim();
		var creater = $('#creater').val().trim();
		var lastModifyUser = $('#lastModifyUser').val().trim();
		var createTimeStart = $('#createTimeStart').val();
		var createTimeEnd = $('#createTimeEnd').val();
		var lastModifyTimeStart = $('#lastModifyTimeStart').val();
		var lastModifyTimeEnd = $('#lastModifyTimeEnd').val();
		
		var data = {
				name:name,
				creater:creater,
				lastModifyUser:lastModifyUser,
				createTimeStart : createTimeStart,
				createTimeEnd : createTimeEnd,
				lastModifyTimeStart : lastModifyTimeStart,
				lastModifyTimeEnd : lastModifyTimeEnd
		}
		return data;
	}
	function serachResult(data){
		$('#resultTable>tbody').remove();
        
	  var language = {
		        search: '全局搜索：',
		        lengthMenu: "每页显示 _MENU_ 记录",
		        zeroRecords: "没找到相应的数据！",
		        info: "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 10 条&nbsp;&nbsp;共 _TOTAL_ 条",
		        infoEmpty: "",
		        infoFiltered: "(从 _MAX_ 条数据中搜索)",
		        paginate: {
		        	first: '|<',
		            last: '>|',
		            previous: '<<',
		            next: '>>'
		        }
		    };
		 $('#resultTable').DataTable({
			 bLengthChange: false,
			 destroy: true,
			 bProcessing: false,
			 bFilter: false, //过滤功能
			 bSort: false, //排序功能
		     serverSide: true,
			 iDisplayLength:10,	
			 pagingType:'input',
			 ajax:{
				 "type": "POST",
				 "url": basePath+'nm/jobs/jobsAction!getTaskList.action',
				 "data": data,
				 "error":function(e){
						ajaxError(e);
				 }
			 },		 
			 columns:[
			           {data: 'name'},
			           {data: 'stepNum'},
			           {data: 'creater'},
			           {data: 'lastModifyUser'},
			           {data: 'createTime'},
			           {data: 'lastModifyTime'},
			           { 
			                data:null,
			                orderable:false,
			                render : function(data, type, row, meta){
			                	var btnGroup = '<div class="btn-list" style="min-width:320px;"><a class="king-btn king-success king-btn-mini run-task"  title="立即执行">立即执行</a>';
			                	btnGroup += '<a class="king-btn king-warning king-btn-mini time-task" title="定时启动" data-toggle="modal">定时启动</a>';
			                	btnGroup += '<span class="mr5" style="border-left:2px solid #bbb;padding:6px 0 8px 0;"></span>';
			                	btnGroup += '<a class="king-btn king-primary king-btn-mini edit-task" title="编辑">编辑</a>';
			                	btnGroup += '<a class="king-btn king-info king-btn-mini clone-task" title="克隆">克隆</a>';
			                	btnGroup += '<span class="mr5" style="border-left:2px solid #bbb;padding:6px 0 8px 0;"></span>';
			                	btnGroup += '<a class="king-btn king-danger king-btn-mini del-task" title="删除">删除</a></div>';
			                    return btnGroup;
			                }
			            }
			       ],
			  language:language
		 });
	  var t = $('#resultTable').DataTable();
	   $("#resultTable tbody").on('click','a.run-task',function(){
		   var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
           data = row.data();
		   createNewTab('作业预览', './app/previewTask.jsp', '作业执行',{
            	taskId : data.id,
            	historytype : 2,
            	searchdata : getserachData()
           }); 
	   });
	   $("#resultTable tbody").on('click','a.time-task',function(){
		   var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
           data = row.data();
		   $('#crontabTaskId').val(data.id);
		   $('#crontabName').val(data.name);
		   $('#taskName').val(data.name);
		   $('#cronExpression').val(null);
		   allTextHtmlDecode();
		   	CronTab({
				cronMode : 0,
				expression : '0 0/5 * * * ?'
			});
		   $('#crontab-time-modal').modal('show').draggable({
				cursor: "pointer",
				handle: "div.modal-header"
			});
	   });
	   $("#resultTable tbody").on('click','a.edit-task',function(){
		   var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
           data = row.data();
           createNewTab('作业编辑', './app/newTask.jsp', '作业执行',{
            	taskId : data.id,
            	historytype : 2,
            	searchdata : getserachData(),
            	type : 'edit'
           });
	   });
	   $("#resultTable tbody").on('click','a.clone-task',function(){
		   var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
		   data = row.data();
		   createNewTab('克隆作业', './app/newTask.jsp', '作业执行',{
			    taskId : data.id,
            	historytype : 2,
            	searchdata : getserachData(),
            	type : 'copy'
           });
	   });
	   
	   $("#resultTable tbody").on('click','a.del-task',function(){
		   var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
           data = row.data();
		   if($('#my-tablist').find('a[href=#tab-'+data.id+']').length>0){
			   printMsg('作业正处于编辑状态，不可删除！', 2);
		   }else{
			   confirmModal('提示','确定要删除"'+data.name+'" ?',function(){
				   $.ajax({
					   type : 'POST',
					   url : basePath + 'nm/jobs/jobsAction!deleteTask.action',
					   dataType : 'json',
					    data : {
							taskId : data.id
						},
						success : function(result) {
							if(result.success){
								row.remove().draw();
							}else{
								printMsg('删除失败！', 2);
							}
						}
				   })
			   })
		   }
	   });
	}
	
	 $('#createTimeStart').datepicker({
	 	gotoCurrent : true,
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        maxDate : new Date(),
        onSelect : function(dateText){
        	$('#createTimeEnd').datepicker("option", "minDate", dateText);
        }
    });
    
    $('#createTimeEnd').datepicker({
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
        changeYear: true,
        showButtonPanel: false,
        maxDate : new Date(),
        onSelect : function(dateText){
        	$('#createTimeStart').datepicker("option", "maxDate", dateText);
        }
    });
    $('#lastModifyTimeStart').datepicker({
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
    	changeYear: true,
    	showButtonPanel: false,
    	maxDate : new Date(),
    	onSelect : function(dateText){
    		$('#lastModifyTimeEnd').datepicker("option", "minDate", dateText);
    	}
    });
    
    $('#lastModifyTimeEnd').datepicker({
    	dateFormat : 'yy-mm-dd',
    	changeMonth: true,
    	changeYear: true,
    	showButtonPanel: false,
    	maxDate : new Date(),
    	onSelect : function(dateText){
    		$('#lastModifyTimeStart').datepicker("option", "maxDate", dateText);
    	}
    });
	
	$('#crontabSave').on('click',function(){
		var name = $('#crontabName').val(),
			des = $('#crontabDes').val(),
			taskId = $('#crontabTaskId').val(),
			type = $('input[name=cronMode]:checked').val();
		if(type == 1){
			var cronExpression = $('input[name=cronExpression]').eq(1).val();
		}else{
			var cronExpression = $('input[name=cronExpression]').eq(0).val();
		}
		if(!name){
			printMsg('名称不能为空！', 2);
			return false;
		}
		if(!cronExpression){
			printMsg('定时规则不能为空！', 2);
			return false;
		}
		$.ajax({
			type : 'POST',
			url : basePath + 'nm/jobs/crontabAction!saveCrontabTask.action',
			dataType : 'json',
		    data : {
		    	crontabTaskId:null,
	    		name:name,
	    		des:des,
	    		taskId:taskId,
	    		type : type,
	    		cronExpression:cronExpression
			},
			success : function(result) {
				printMsg(result.msg.message, result.msg.msgType);
				if(result.success){
					$('#crontab-time-modal').modal('hide');
				}
			}
		})
	});
    //初始化页面时直接调用
	(function(){
		if(havePropInObj(extraObj)&&havePropInObj(extraObj.searchdata)){//判断扩展参数是否存在
			$('#name').val(extraObj.searchdata.name||null);
			$('#creater').val(extraObj.searchdata.creater||null);
			$('#lastModifyUser').val(extraObj.searchdata.lastModifyUser||null);
			$('#createTimeStart').val(extraObj.searchdata.createTimeStart||null);
			$('#createTimeEnd').val(extraObj.searchdata.createTimeEnd||null);
			$('#lastModifyTimeStart').val(extraObj.searchdata.lastModifyTimeStart||null);
			$('#lastModifyTimeEnd').val(extraObj.searchdata.lastModifyTimeEnd||null);
		}
		$('#findBtn').trigger('click');
	})();
})();

