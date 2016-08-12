/**
 * 服务器集管理页面
 */
$(function(){
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
	})
	$('#findBtn').click(function(){
		serachResult(getserachData());
	})
	function getserachData(){
		var name =  $.trim($('#name').val());
		var creater =  $.trim($('#creater').val());
		var createDateStart = $('#createDateStart').val();
		var createDateEnd = $('#createDateEnd').val();
		var data = {
				name:name,
				creater:creater,
				createTimeStart:createDateStart,
				createTimeEnd:createDateEnd			 
		}
		return data;
	}
	$('.form-inline').keydown(function(event){
		if(event.keyCode == 13){
			serachResult(getserachData());
		}
	});
	
	$('#addGroup').click(function(){
		 createNewTab('新增分组', './app/groupAdd.jsp', '业务管理',{
			 searchdata : getserachData()
        }); 
	});
	
	function serachResult(data){
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
				 "type": "POST",
				 "data": function(d){
                            if(data){
                                 data.draw = d.draw;
                                 data.start = d.start;
                                 data.length = d.length;
                                 return JSON.stringify(data);
                             } else {
                                 return '{}';
                             }
                         },
				 "url": basePath+'nm/components/nmServerSetAction/searchServerSet.action',				 
				 "error":function(e){
						ajaxError(e);					 
				 }
			 },		 
			 columns:[
					   {data: 'name'},
					   {data: 'remark'},
			           {data: 'creator'},
			           {data: 'createTime'},
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
		 var t = $('#resultTable').DataTable();
		$("#resultTable tbody").on('click', 'a.del', function(){
			 var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
	           data = row.data();
			 confirmModal('提示','确定要删除"'+data.name+'" ?',function(){
				   $.ajax({
					   type : 'POST',
                       contentType:'application/x-www-form-urlencoded',
					   url : basePath + '/nm/components/nmServerSetAction/deleteServerSet.action',
					   dataType : 'json',
					    data : {
					    	serverSetId : data.id
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
		});
		$("#resultTable tbody").on('click', 'a.edit', function(){
			  var row = t.row( $(this).parents('tr') ),//获取按钮所在的行
	           data = row.data();
			    createNewTab('新增分组', './app/groupAdd.jsp', '业务管理',{
			    	data : data,
			     	searchdata : getserachData()
			    }); 
		});
	}
	 //初始化页面时直接调用
	(function(){
		if(havePropInObj(extraObj)&&havePropInObj(extraObj.searchdata)){//判断扩展参数是否存在
			$('#name').val(extraObj.searchdata.name||null);
			$('#creater').val(extraObj.searchdata.creater||null);
			$('#createTimeStart').val(extraObj.searchdata.createTimeStart||null);
			$('#createTimeEnd').val(extraObj.searchdata.createTimeEnd||null);
		}
		$('#findBtn').trigger('click');
	})();
});