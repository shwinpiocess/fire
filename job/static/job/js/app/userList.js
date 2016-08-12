(function(){
	$('#resetBtn').click(function(){
		$('#name,#creater,#createDateStart,#createDateEnd').val(null);
	});
	$('[data-toggle="tooltip"]').tooltip();
	
	$("#allCheckBox").click(function () { 
		$('input[name="chItem"]').prop("checked",this.checked);
		if($(this).prop("checked")){
			$('#batchDel').prop('disabled',false);
		}else{
			$('#batchDel').prop('disabled',true);
		}
	});
	$('#creater').autocomplete({
		source: maintainers
	});
	$('#createrMe').click(function(){
		$('#creater').val(uin);
	});
	
	$('#findBtn').click(function(){			
		serachResult(getserachData());
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
    function getserachData(){
    	var name = $.trim($('#name').val());
		var creater = $.trim($('#creater').val());
		var createDateStart = $('#createDateStart').val();
		var createDateEnd = $('#createDateEnd').val();
		
		var data = {
			account:name,				 
			creater:creater,
			createTimeStart:createDateStart,
			createTimeEnd:createDateEnd
		};
    	return data;
    }
    $('#name,#creater,#createDateStart,#createDateEnd').keydown(function(event){
		if(event.keyCode == 13){
			serachResult(getserachData());
		}
	});
    
	function serachResult(data){
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
				 "data": data,
				 "url": basePath+'nm/components/accountAction!searchAccountList.action',
				 "error":function(e){
						ajaxError(e);					 
				 }
			 },		
			 columns:[
						{
						    data:null,
						    render : function(data, type, row, meta){
						        return '<input id="'+row.account+'" name="chItem" type="checkbox" class="userChecks">';
						    }
						},
			           {data: 'account' },
			           {data: 'creater' },
			           {data: 'createTime' }, 
			           {
			                data:null,
			                render : function(data, type, row, meta){			                	 
			                	var btnGroup = '<div class="text-center"><a class="king-btn king-danger king-btn-mini delBtn" title="删除">删除</a></div>';			                	
			                    return btnGroup;
			                }
			            }
			       ],
			  language:language
		 });
		$("#resultTable tbody").on('click', 'a.delBtn', function(){
			var t = $("#resultTable").DataTable();//注意大小写
			var row = t.row($(this).parents('tr')), //获取按钮所在的行
			data = row.data();
			
			confirmModal('提示','是否删除该用户【'+data.account+'】',function(){
				delUserAjax(data.account);
			});
			
		}); 
		$("#resultTable tbody").on('click', 'input[name="chItem"]', function(){
			if($(this).prop("checked")){
				$('#batchDel').prop('disabled',false);
			}else{
				var checkFlag = false;
				$.each($('input[name="chItem"]'),function(){
					if($(this).prop("checked")){
						checkFlag = true;
						return false;
					}else{
						checkFlag = false;
					}
				});
				if(checkFlag){
					$('#batchDel').prop('disabled',false);
				}else{
					$('#batchDel').prop('disabled',true);
				}
			}
		}); 
	}
	
	$('#batchDel').click(function(){
		var checkeds=$('input[name="chItem"]:checked');
		var ids = [];
		checkeds.each(function(index,value){
			ids.push(value.id);
		});
		if(ids.length>0){
			confirmModal('提示','是否删除所选用户',function(){
				delUserAjax(ids.join(","));
			});
		}
	});
	
	$('#saveUserBtn').click(function(){
		var userName = $.trim($('#newUserName').val());
		if(!userName){
			printMsg('请输入新建帐户名',2);
			$('#newUserName').focus();
			return;
		}
		$.ajax({
			type : 'POST',
			url : basePath+'nm/components/accountAction!saveAccount.action',
			dataType : 'json',
			data:{
				account:userName
			},
			success : function(result){
				if(result.success){
					printMsg(result.msg.message,1);
					$('#newUserName').val(null);
					serachResult();
				}else{
					printMsg(result.msg.message,2);
					$('#newUserName').focus();
				}
			}
		});
	});
	
	
	function delUserAjax(account){
		if(account){
			$.ajax({
				type : 'POST',
				url : basePath+'nm/components/accountAction!deleteAccount.action',
				dataType : 'json',
				data:{
					account:account
				},
				success : function(result){
					if(result.success){
						printMsg(result.msg.message,1);
						$('#findBtn').trigger('click');
						$('#batchDel').prop('disabled',true);
					}else{
						printMsg(result.msg.message,2);
					}
				}
			});
		}
	}
    
    $('#findBtn').trigger('click');
})();