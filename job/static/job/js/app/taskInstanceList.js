(function(){
	$('#startWay').chosen({});
	$('#status').chosen({}); 
	
	$('#operator').autocomplete({
		source: maintainers
	});
	$('#operatorMe').click(function(){
		$('#operator').val(uin);
	});
	
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
	
	$('#resetBtn').click(function(){
		$('#name').val('');
		$('#operator').val('');
		$('#status').val('').chosen("destroy").chosen({});
		$('#startWay').val('').chosen("destroy").chosen({});
		$('#createDateStart').val('');
		$('#createDateEnd').val('');
	});
	
	$('#findBtn').click(function(){
		serachResult(getserachData());
	});
	function getserachData(){
		var name = $.trim($('#name').val());
		var operator = $('#operator').val();
		var status = $('#status').val();
		var createDateStart = $('#createDateStart').val();
		var createDateEnd = $('#createDateEnd').val();
		var startWay = $('#startWay').val(); 
		
		if (status != "") {
			status = parseInt(status);
		}
		if (startWay != "" ) {
			startWay = 	(startWay);
		}
		var data = {
				name: name,
				operator: operator,
				status: status,
				startTimeStart: createDateStart,
				startTimeEnd: createDateEnd,
				startWay: startWay
		}
		return data;
	}
	
	$('.form-inline').on('keydown',function(event){
		if(event.keyCode == 13){
			serachResult(getserachData());
		}
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
		    };
	    
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
				 "type": "POST",
				 "data": data,
				 "url": basePath+'nm/jobs/taskResultAction!searchTaskResultList.action',
				 "error":function(e){
						ajaxError(e);					 
				 }
			 },	
			 columns:[
			           {data: 'name' },
			           {data: 'operator' },
			           {
						    data:null, 
						    render : function(data, type, row, meta){
						    	var returnStr = "";
                                if(row.status<1){
                                	
                                }else if([1,2,3,4,6,7].indexOf(row.status) != -1){
                                	returnStr ='<span class="label '+statueColor[row.status]+'">'+statueArr[row.status-1]+'</span>';
                                }else{
                                	returnStr = statueArr[row.status-1];
                                }
                                 
						        return returnStr; 
						    }
						},
			           {data: 'startTime' },
			           {data: 'endTime' },
			           {
						    data:null,
						    render : function(data, type, row, meta){
						    	var displayTaskStatus = ["页面执行","API调用","定时执行","微信执行"];
                                 if(row.startWay<1||row.startWay>4){
                                     return '';
                                }
						        return displayTaskStatus[row.startWay-1]
						    }
					   },
			           {
                            data: null,
                            render : function(data, type, row, meta) {
                                 return row.totalTime.toFixed(3);
                            }
                       },
			           {
			                data:null,
			                orderable:false,
			                render : function(data, type, row, meta){
			                	var btnGroup ='<div style="min-width:180px;">';
			                	btnGroup += '<a class="king-btn king-primary king-btn-mini task-detail" title="查看详情">查看详情</a>';
			                	var currentTime = new Date().getTime();
			                	var startTime = new Date(data.startTime).getTime();
			                	if (currentTime - startTime < 30 * 24 * 60 * 60 * 1000) {
				                	btnGroup += '&nbsp;&nbsp;<a class="king-btn king-success king-btn-mini task-redone" title="去重做">去重做</a>';
			                	}
			                	
			                	btnGroup += '</div>';
			                    return btnGroup;
			                }
			            }
			       ],
			  language:language
		 });
		var t = $('#resultTable').DataTable();		
		$("#resultTable tbody").on('click','a.task-detail',function(){
			var row = t.row( $(this).parents('tr'));//获取按钮所在的行
	        var data = row.data(); 
			createNewTab('作业实例', './app/taskDetail.jsp', '执行详情' , {
				taskInstanceId : data.taskInstanceId,
				searchdata :getserachData(),
				historytype : 1
			});
		});
		$("#resultTable tbody").on('click','a.task-redone',function(){
			var row = t.row( $(this).parents('tr'));//获取按钮所在的行
	        var data = row.data(); 
	        createNewTab('作业实例', './app/previewTask.jsp', '作业预览' , {
				taskInstanceId : data.taskInstanceId,
				searchdata :getserachData(),
				historytype : 1
			});
		});
	};
    
    //初始化页面时直接调用
	(function(){
		if(havePropInObj(extraObj)&&havePropInObj(extraObj.searchdata)){//判断扩展参数是否存在
			$('#name').val(extraObj.searchdata.name||null);
			$('#operator').val(extraObj.searchdata.operator||null);
			$('#status').val(extraObj.searchdata.status||null).chosen("destroy").chosen({});
			$('#startWay').val(extraObj.searchdata.startWay||null).chosen("destroy").chosen({});
			$('#createDateStart').val(extraObj.searchdata.startTimeStart||null);
			$('#createDateEnd').val(extraObj.searchdata.startTimeEnd||null);
		}
		$('#findBtn').trigger('click');
	})();
})();