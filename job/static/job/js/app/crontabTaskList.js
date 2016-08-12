/**
 * 
 */
$(function($){
	$('#createTimeStart').datepicker({
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
		    }	  
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
				 "url": basePath+'nm/jobs/crontabAction!getCrontabTaskList.action',
				 "data": data,
				 "error":function(e){
				     ajaxError(e);
				 }
			 },		 
			 columns:[
			           {data: 'name'},
//			           {data: 'des'},
			           {data: 'TaskName'},
			           {data: 'cronExpression'},
			           {data: 'creater'},
			           {data: 'createTime'},
			           {data: 'lastModifyUser'},
			           {data: 'lastModifyTime'},
			           { 
			                data:null,
			                orderable:false,
			                render : function(data, type, row, meta){
			                	var displayTaskStatus = ['已启动','已暂停','已完成'];
			                	if(row.status<1||row.status>3){
                                    return '';
			                	}
						        return displayTaskStatus[row.status-1]
			                }
			            },
			           { 
			                data:null,
			                orderable:false,
			                render : function(data, type, row, meta){
			                	var btnGroup ='<div class="btn-list" style="min-width:200px;"><a class="king-btn king-success king-btn-mini task-modify" title="修改">修改</a>';
			                		btnGroup += '<a class="king-btn king-danger king-btn-mini task-del" title="删除">删除</a>';
			                	if(row.status==1){
			            			btnGroup += '<a class="king-btn king-warning king-btn-mini task-change" title="暂停">暂停</a>';
			            		}else if(row.status==2){
			            			btnGroup += '<a class="king-btn king-primary king-btn-mini task-change" title="启动">启动</a>';
			            		}
			                	btnGroup += '</div>'
			                	return btnGroup;
			                }
			            }
			       ],
			  language:language
		 });
		var t = $('#resultTable').DataTable();
		$("#resultTable tbody").on('click','a.task-modify',function(){
			var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
			data = row.data(),
			taskId = data.taskId;
			$('#crontabTaskId').val(data.crontabTaskId);
			$('#crontabName').val(data.name);
			$('#crontabDes').val(data.des);
			$('#taskId').parent().parent().hide();
			$('#taskName').val(data.TaskName).parent().parent().removeClass('none');
			CronTab({
				cronMode : data.type,
				expression : data.cronExpression
			});
			allTextHtmlDecode();
			$('#crontab-time-modal').modal('show').draggable({
				cursor: "pointer",
				handle: "div.modal-header"
			});
		});
		$("#resultTable tbody").on('click','a.task-del',function(){
			var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
			data = row.data();
			 confirmModal('提示','确定要删除"'+data.name+'" ?',function(){
				$.ajax({
					type : 'POST',
					url : basePath + 'nm/jobs/crontabAction!deleteCrontabTask.action',
					dataType : 'json',
					data : {
						crontabTaskId : data.crontabTaskId
					},
					success : function(result) {
						printMsg(result.msg.message, result.msg.msgType);
						row.remove().draw();
					}
				});
			 });
		})
		$("#resultTable tbody").on('click','a.task-change',function(){
				var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
				data = row.data();
				// 状态：1.启动、2.暂停、3.已完成
				var status = data.status;
				if (status == 1) {
					status = 2;
					$(this).text('暂停中');
					$(this).prop('disabled',true);
				} else if (status == 2){
					status = 1
					$(this).text('启动中');
					$(this).prop('disabled',true);
				} else {
					return false;
				}			
				
				$.ajax({
					type : 'POST',
					url : basePath + 'nm/jobs/crontabAction!changeStatus.action',
					dataType : 'json',
					data : {
						crontabTaskId : data.crontabTaskId,
						status : status
					},
					success : function(result) {
						$(this).prop('disabled',false);
						printMsg(result.msg.message, result.msg.msgType);
						t.draw();
					}
				});
		})
	};
 	
	$('#findBtn').click(function(){ 
		serachResult(getserachData());
	});
	function getserachData(){
		var name = $.trim($('#name').val());
		var des = $('#des').val();
		var status = $('#status').val();
		var creater = $.trim($('#creater').val());
		var lastModifyUser = $('#lastModifyUser').val();
		var createTimeStart = $('#createTimeStart').val();
		var createTimeEnd = $('#createTimeEnd').val();
		var lastModifyTimeStart = $('#lastModifyTimeStart').val();
		var lastModifyTimeEnd = $('#lastModifyTimeEnd').val();
		
		
		var data = {
			name:name,
			des:des,
			status:status,
			creater : creater,
			lastModifyUser : lastModifyUser,
			createTimeStart : createTimeStart,
			createTimeEnd : createTimeEnd,
			lastModifyTimeStart : lastModifyTimeStart,
			lastModifyTimeEnd : lastModifyTimeEnd
		}
		return data;
	}
	$('.form-inline').keydown(function(event){
		if(event.keyCode == 13){
			serachResult(getserachData());
		}
	});
	
	$('#resetBtn').click(function(){
		$('#name').val(null);
		$('#des').val(null);
		$('#status').val(-1);
		$("#status").trigger("chosen:updated");
		$('#creater').val(null);
		$('#lastModifyUser').val(null);
		$('#createTimeStart').val(null);
		$('#createTimeEnd').val(null); 
		$('#lastModifyTimeStart').val(null);
		$('#lastModifyTimeEnd').val(null);
	});
	$('#addBtn').click(function(){
		$('#crontab-time-modal').modal('hide');
		$('#crontabName').val(null);
		$('#crontabDes').val(null);
		$('#cronExpression').val(null);
		$('#crontabTaskId').val(null)
		$('#taskId').empty();
		$('#taskId').parent().parent().show();
		$('#taskName').val(null).parent().parent().addClass('none');
		$.ajax({
			type : 'POST',
			url : basePath+'nm/jobs/jobsAction!getTaskList.action',
			dataType : 'json',
			success : function(result) {
				var rdata = result.data;
				if(rdata){
					var html =''; 
					$.each(rdata,function(i,opt){
						html += '<option value="'+opt.id+'">'+opt.name+'</option>'
					})
					$('#taskId').append(html);
					$('#taskId').chosen({no_results_text:'无',width:'400px'});
				}
			}
		});
		CronTab({
			cronMode : 0,
			expression : '0 0/5 * * * ?'
		})
		$('#crontab-time-modal').modal('show').draggable({
			cursor: "pointer",
			handle: "div.modal-header"
		});
	});
	$('#crontabSave').click(function(){
		var crontabTaskId = $('#crontabTaskId').val(),
			name = $('#crontabName').val(),
			taskId = $('#taskId').val(),
			des = $('#crontabDes').val(),
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
		if(!crontabTaskId&&!taskId){
			printMsg('作业名称不能为空！', 2);
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
				crontabTaskId:crontabTaskId,
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
					$('#resultTable').DataTable().draw();
				}
			}
		});
	});

	/*定时作业，新建，+添加*/
    $('#crontab-time-modal').on("click",".newTask",function(){
        var url=$(this).attr('href');
        if("pushState" in history){
    		var href = url;
	    	if(!((href.indexOf('#')>0 || href=='javascript:;')) && (href.indexOf('http')<0 && href.indexOf('https')<0 && href.indexOf('ftp')<0)){
	    		href = basePath+"?"+href.substr(6,href.length-10);
	    	}
    	}
        window.open(href);
    }); 

    /*新建定时任务，作业名称，刷新功能*/
    $('#taskRefresh').click(function(){
    	$('#taskId').empty();
	    $.ajax({
			type : 'POST',
			url : basePath+'nm/jobs/jobsAction!getTaskList.action',
			dataType : 'json',
			success : function(result) {
				var rdata = result.data;
				if(rdata){
					var html =''; 
					$.each(rdata,function(i,opt){
						html += '<option value="'+opt.id+'">'+opt.name+'</option>'
					})
					$('#taskId').append(html);
					$('#taskId').chosen({no_results_text:'无',width:'400px'});
					$('#taskId').trigger("chosen:updated");
				}
			}
		});
	});

    $('#findBtn').trigger('click');

})