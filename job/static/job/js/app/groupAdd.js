/**
 * 新增服务器集
 */
$(function(){
	function getServerSetDetail(serverSetId){
        $.load();
		$.ajax({
			type : 'POST',
            contentType:'application/x-www-form-urlencoded',
			url: basePath+"nm/components/nmServerSetAction/getServerSetDetail.action",
			dataType : 'json',
			data : {
				serverSetId : serverSetId
			},
			success : function(rs) {
				if(rs.success){
					var data = rs.data;
					var setServiceStatus = data.setServiceStatus && data.setServiceStatus.split(',');
					var setEnviType = data.setEnviType && data.setEnviType.split(',');
					var setServiceStatusName = data.setServiceStatusName && data.setServiceStatusName.split(',');
					var setEnviTypeName = data.setEnviTypeName && data.setEnviTypeName.split(',');
					var setIDs = data.setIDs && data.setIDs.split(',');
					var setNames = data.setNames && data.setNames.split(',');
					var moduleNames = data.moduleNames && data.moduleNames.split(',');
					$('#serverSetId').val(data.id)
					$('#name').val(data.name)
					$('#remark').val(data.remark);
					
					if(setServiceStatus.length>0||setEnviType.length>0){
						$('#setPropertyWarp').find('.btn-toolbar').addClass('none');
                        $('#getSetsSelectWarp').addClass('block-disabled');
					}
					$.each(setServiceStatus,function(i, property){
						var value = setServiceStatusName[i];
						$('#setPropertyWarp').append($('<button>',{
							'class' : 'mr5 mb5 king-btn king-btn-mini king-info',
							'type' : 'button',
							'data-value' : property+'|'+value,
							'data-type' : 1,
							'value' : property,
							'text' : value
						}));
					})
					$.each(setEnviType,function(i, property){
						var value = setEnviTypeName[i];
						$('#setPropertyWarp').append($('<button>',{
							'class' : 'mr5 mb5 king-btn king-btn-mini king-info',
							'type' : 'button',
							'data-value' : property+'|'+value,
							'data-type' : 2,
							'value' : property,
							'text' : value
						}));
					})
					if(setIDs.length>0){
						$('#getSetsSelectWarp').find('.btn-toolbar').addClass('none');
                        if(!$('#getSetsSelectWarp').hasClass('block-disabled')){
                             $('#setPropertyWarp').addClass('block-disabled');
                        }
					}
					$.each(setIDs,function(i, setId){
						var text = setNames[i];
						$('#getSetsSelectWarp').append($('<button>',{
							'class' : 'mr5 king-btn king-btn-mini king-info',
							'type' : 'button',
							'data-value' : setId+'|'+text,
							'value' : setId,
							'text' : text
						}));
					})
					if(moduleNames.length>0){
						$('#getModelsWarp').find('.btn-toolbar').addClass('none');
					}
					$.each(moduleNames,function(i, value){
						var text = setNames[i];
						$('#getModelsWarp').append($('<button>',{
							'class' : 'mr5 king-btn king-btn-mini king-info',
							'type' : 'button',
							'value' : value,
							'text' : value
						}));
					})
				}
                $.unload();
			}
		});
	}
	//SET属性操作事件 start
	$('#setPropertyWarp').click(function(){
		if($('#getSetsSelectWarp').find('button').length>0){
			return false;
		}
		$.load();
		$.ajax({
			type : 'POST',
			url: basePath+"nm/components/nmServerSetAction/getSetProperty.action",
			dataType : 'json',
			success : function(rs) {
				if(rs.success){
					var data = rs.data;
					var setServiceStatus = data.setServiceStatus;
					var setEnviType = data.setEnviType;
					var valueBtns =  $('#setPropertyWarp').find('button');
					var dataValues = [];
					$.each(valueBtns,function(index,opt){
						dataValues.push($(opt).attr('data-value'));
					});
					
					$('#setServiceStatusGroup').find('button').remove();
					$.each(setServiceStatus,function(index,opt){
						var haveData = false;
						if(dataValues.length>0 && dataValues.indexOf(opt.property+'|'+opt.value)!==-1){
							haveData = true;
						}
						$('#setServiceStatusGroup').append($('<button>',{
							'class' : 'mr5 king-btn king-btn-mini '+(haveData?'king-info':'king-default'),
							'type' : 'button',
							'data-value' : opt.property+'|'+opt.value,
							'data-type' : 1,
							'value' : opt.property,
							'text' : opt.value
						}));
					});
					
					$('#setEnviTypeGroup').find('button').remove();
					$.each(setEnviType,function(index,opt){
						var haveData = false;
						if(dataValues.length>0 && dataValues.indexOf(opt.property+'|'+opt.value)!==-1){
							haveData = true;
						}
						$('#setEnviTypeGroup').append($('<button>',{
							'class' : 'mr5 mb5 king-btn king-btn-mini '+(haveData?'king-info':'king-default'),
							'data-value' : opt.property+'|'+opt.value,
							'data-type' : 2,
							'value' : opt.property,
							'text' : opt.value
						}));
					});
					$('#setPropertyModal').modal('show').draggable({
						cursor: "pointer",
						handle: "div.modal-header"
					});
				} else {
                    printMsg(rs.msg.message, 2);
                }
				$.unload();
			}
		});
		
	});
	
	$('#setServiceStatusGroup,#setEnviTypeGroup').on('click','button',function(e){
		var target = $(this);
		if(target.hasClass('king-default')){
			target.removeClass('king-default').addClass('king-info');
		}else{
			target.removeClass('king-info').addClass('king-default');
		}
	});
	
	$('#setPropertyCheckAll').click(function(){
		$('#setServiceStatusGroup,#setEnviTypeGroup').find('button').removeClass('king-default').addClass('king-info');
	});
	
	$('#setPropertyInverse').click(function(){
		$.each($('#setServiceStatusGroup,#setEnviTypeGroup').find('button'),function(i,opt){
			var target = $(opt);
			if(target.hasClass('king-default')){
				target.removeClass('king-default').addClass('king-info');
			}else{
				target.removeClass('king-info').addClass('king-default');
			}
		})
	});
	
	$('#setPropertySaveBtn').click(function(){
		var buttons = $('#setServiceStatusGroup,#setEnviTypeGroup').find('button.king-info').clone(false);
		$('#setPropertyWarp').find('button').remove();
		if(buttons.length>0){
			$('#setPropertyWarp').find('.btn-toolbar').addClass('none');
			buttons.appendTo($('#setPropertyWarp'));
			$('#getSetsSelectWarp').addClass('block-disabled');
		}else{
			$('#setPropertyWarp').find('.btn-toolbar').removeClass('none');
			$('#getSetsSelectWarp').removeClass('block-disabled');
		}
		$('#setPropertyModal').modal('hide')
	});
	//	SET属性操作事件 end
	
	
	
	//	业务SET操作事件 strat
	$('#getSetsSelectWarp').click(function(){
		if($('#setPropertyWarp').find('button').length>0){
			return false;
		}
		$.load();
		$.ajax({
		type : 'POST',
		url: basePath+"nm/components/nmServerSetAction/getSetsByProperty.action",
		dataType : 'json',
		success : function(rs) {
			if(rs.success){
				var dataArr = rs.data;
				var valueBtns =  $('#getSetsSelectWarp').find('button');
				var dataValues = [];
				$.each(valueBtns,function(index,opt){
					dataValues.push($(opt).attr('data-value'));
				});
				
				$('#getSetsGroup').find('button').remove();
				$.each(dataArr,function(index,opt){
					var haveData = false;
					if(dataValues.length>0 && dataValues.indexOf(opt.setId+'|'+opt.text)!==-1){
						haveData = true;
					}
					$('#getSetsGroup').append($('<button>',{
						'class' : 'mr5 mb5 king-btn king-btn-mini '+(haveData?'king-info':'king-default'),
						'type' : 'button',
						'data-value' : opt.setId+'|'+opt.text,
						'value' : opt.setId,
						'text' : opt.text
					}));
				});
				$('#getSetsSearch').val('');
				$('#getSetsSelectModal').modal('show').draggable({
					cursor: "pointer",
					handle: "div.modal-header"
				});
			} else {
                printMsg(rs.msg.message, 2);
            }
			$.unload();
		}
	});
		

		
	});
	$('#getSetsGroup').on('click','button',function(e){
		var target = $(this);
		if(target.hasClass('king-default')){
			target.removeClass('king-default').addClass('king-info');
		}else{
			target.removeClass('king-info').addClass('king-default');
		}
	});
	$('#getSetsCheckAll').click(function(){
		$('#getSetsGroup').find('button').removeClass('king-default').addClass('king-info');
	});
	$('#getSetsInverse').click(function(){
		$.each($('#getSetsGroup').find('button'),function(i,opt){
			var target = $(opt);
			if(target.hasClass('king-default')){
				target.removeClass('king-default').addClass('king-info');
			}else{
				target.removeClass('king-info').addClass('king-default');
			}
		})
	});
	$('#getSetsSaveBtn').click(function(){
		var buttons = $('#getSetsGroup').find('button.king-info').clone(false);
		$('#getSetsSelectWarp').find('button').remove();
		if(buttons.length>0){
			$('#getSetsSelectWarp').find('.btn-toolbar').addClass('none');
			buttons.appendTo($('#getSetsSelectWarp'));
			$('#setPropertyWarp').addClass('block-disabled');
		}else{
			$('#getSetsSelectWarp').find('.btn-toolbar').removeClass('none');
			$('#setPropertyWarp').removeClass('block-disabled');
		}
		$('#getSetsSelectModal').modal('hide')
	});
	
	$('#getSetsSearch').keyup(function(){
		var searchVal = $.trim($(this).val());
		if(searchVal){
			searchVal = searchVal.toLowerCase();
			$.each($('#getSetsGroup').find('button'),function(i,opt){
				text = $(opt).text().toLowerCase();
				if($(opt).hasClass('btn-default') && text.indexOf(searchVal)===-1){
					$(opt).addClass('none');
				}else{
					$(opt).removeClass('none');
				}
			});
		}
	});
	//	业务SET操作事件 end	
	
	
//	业务模块操作事件 strat
	$('#getModelsWarp').click(function(){
		$.load();
		var setServiceStatusArr = [],setServiceStatus;
		var setEnviTypeArr = [],setEnviType;
		$.each($('#setPropertyWarp>.king-info'),function(i,opt){
			if($(opt).attr('data-type') == 1){
				setServiceStatusArr.push($(opt).val())
			}else if($(opt).attr('data-type') == 2){
				setEnviTypeArr.push($(opt).val())
			}
		})
		if(setServiceStatusArr.length>0){
			setServiceStatus = setServiceStatusArr.join(',');
		}
		if(setEnviTypeArr.length>0){
			setEnviType = setEnviTypeArr.join(',');
		}
		var ccModuleIdArr = [],ccModuleIds;
		$.each($('#getSetsSelectWarp>.king-info'),function(i,opt){
			ccModuleIdArr.push($(opt).val()); 
		})
		if(ccModuleIdArr.length>0){
			ccModuleIds = ccModuleIdArr.join(',');
		}
		$.ajax({
		type : 'POST',
		url: basePath+"nm/components/nmServerSetAction/getModulesByPropertyOrSets.action",
		dataType : 'json',
		data :JSON.stringify({
			setIDs : ccModuleIds,
			setEnviType : setEnviType,
			setServiceStatus : setServiceStatus
		}),
		success : function(rs) {
			if(rs.success){
				var dataArr = rs.data;
				var valueBtns =  $('#getModelsWarp').find('button');
				var dataValues = [];
				$.each(valueBtns,function(index,opt){
					dataValues.push($(opt).val());
				});
				
				$('#getModelsGroup').find('button').remove();
				$.each(dataArr,function(index,dataOpt){
					var haveData = false;
					if(dataValues.length>0 && dataValues.indexOf(dataOpt)!==-1){
						haveData = true;
					}
					$('#getModelsGroup').append($('<button>',{
						'class' : 'mr5 mb5 king-btn king-btn-mini '+(haveData?'king-info':'king-default'),
						'type' : 'button',
						'value' : dataOpt,
						'text' : dataOpt
					}));
				});
				$('#getModelsModal').modal('show').draggable({
					cursor: "pointer",
					handle: "div.modal-header"
				});
			} else {
                 printMsg(rs.msg.message, 2);
            }
			$.unload();
		}
	});
		

		
	});
	$('#getModelsGroup').on('click','button',function(e){
		var target = $(this);
		if(target.hasClass('king-default')){
			target.removeClass('king-default').addClass('king-info');
		}else{
			target.removeClass('king-info').addClass('king-default');
		}
	});
	$('#getModelsCheckAll').click(function(){
		$('#getModelsGroup').find('button').removeClass('king-default').addClass('king-info');
	});
	$('#getModelsInverse').click(function(){
		$.each($('#getModelsGroup').find('button'),function(i,opt){
			var target = $(opt);
			if(target.hasClass('king-default')){
				target.removeClass('king-default').addClass('king-info');
			}else{
				target.removeClass('king-info').addClass('king-default');
			}
		})
	});
	$('#getModelsSaveBtn').click(function(){
		var buttons = $('#getModelsGroup').find('button.king-info').clone(false);
		$('#getModelsWarp').find('button').remove();
		if(buttons.length>0){
			$('#getModelsWarp').find('.btn-toolbar').addClass('none');
			buttons.appendTo($('#getModelsWarp'))
		}else{
			$('#getModelsWarp').find('.btn-toolbar').removeClass('none');
		}
		$('#getModelsModal').modal('hide');
	});
	$('#getModelsSearch').keyup(function(){
		var searchVal = $.trim($(this).val());
		if(searchVal){
			searchVal = searchVal.toLowerCase();
			$.each($('#getModelsGroup').find('button'),function(i,opt){
				text = $(opt).text().toLowerCase();
				if($(opt).hasClass('btn-default') && text.indexOf(searchVal)===-1){
					$(opt).addClass('none');
				}else{
					$(opt).removeClass('none');
				}
			});
		}
	});
	//	业务模块操作事件 end	
	
	//返回操作
	$('#returnBtn').click(function(){
		delete extraObj.data;
		 createNewTab('分组管理', './app/groupList.jsp', '业务管理',extraObj);
	 });
	//保存
	$('#saveGroup').click(function(){
		var name = $.trim($('#name').val());
		var remark = $.trim($('#remark').val());
		var serverSetId = $('#serverSetId').val();
		
		var setServiceStatusArr = [],setServiceStatus;
		var setEnviTypeArr = [],setEnviType;
		$.each($('#setPropertyWarp>.king-info'),function(i,opt){
			if($(opt).attr('data-type') == 1){
				setServiceStatusArr.push($(opt).val())
			}else if($(opt).attr('data-type') == 2){
				setEnviTypeArr.push($(opt).val())
			}
		})
		if(setServiceStatusArr.length>0){
			setServiceStatus = setServiceStatusArr.join(',');
		}
		if(setEnviTypeArr.length>0){
			setEnviType = setEnviTypeArr.join(',');
		}
		var ccModuleIdArr = [],ccModuleIds;
		$.each($('#getSetsSelectWarp>.king-info'),function(i,opt){
			ccModuleIdArr.push($(opt).val()); 
		})
		if(ccModuleIdArr.length>0){
			ccModuleIds = ccModuleIdArr.join(',');
		}
		var moduleNamesArr = [],moduleNames;
		$.each($('#getModelsWarp>.king-info'),function(i,opt){
			moduleNamesArr.push($(opt).val()); 
		})
		if(moduleNamesArr.length>0){
			moduleNames = moduleNamesArr.join(',');
		}
		
		if(!name){
			printMsg('请输入分组名称！',2);
			return false;
		}
		
		$.ajax({
			type : 'POST',
			url: basePath+"nm/components/nmServerSetAction/saveServerSet.action",
			dataType : 'json',
			data : JSON.stringify({
				serverSetId : serverSetId ? serverSetId : 0,
				name : name,
				setEnviType : setEnviType,
				setServiceStatus : setServiceStatus,
				setIDs : ccModuleIds,
				moduleNames : moduleNames,
				remark : remark
			}),
			success : function(rs) {
				if(rs.success){
					delete extraObj.data;
					 createNewTab('分组管理', './app/groupList.jsp', '业务管理',extraObj);
					printMsg('保存成功！',1);
				}else{
					printMsg(rs.msg.message,rs.msg.msgType);
				}
			}
		});
	});
	//初始化测试结果
	$('#testServerBtn').click(function(){
		$.load();
		var setServiceStatusArr = [],setServiceStatus;
		var setEnviTypeArr = [],setEnviType;
		$.each($('#setPropertyWarp>.king-info'),function(i,opt){
			if($(opt).attr('data-type') == 1){
				setServiceStatusArr.push($(opt).val())
			}else if($(opt).attr('data-type') == 2){
				setEnviTypeArr.push($(opt).val())
			}
		})
		if(setServiceStatusArr.length>0){
			setServiceStatus = setServiceStatusArr.join(',');
		}
		if(setEnviTypeArr.length>0){
			setEnviType = setEnviTypeArr.join(',');
		}
		var ccModuleIdArr = [],ccModuleIds;
		$.each($('#getSetsSelectWarp>.king-info'),function(i,opt){
			ccModuleIdArr.push($(opt).val()); 
		})
		if(ccModuleIdArr.length>0){
			ccModuleIds = ccModuleIdArr.join(',');
		}
		var moduleNamesArr = [],moduleNames;
		$.each($('#getModelsWarp>.king-info'),function(i,opt){
			moduleNamesArr.push($(opt).val()); 
		})
		if(moduleNamesArr.length>0){
			moduleNames = moduleNamesArr.join(',');
		}
		$.ajax({
			type : 'POST',
			url: basePath+"nm/components/nmServerSetAction/previewCCHostByServerSet.action",
			dataType : 'json',
			data:JSON.stringify({
				setEnviType : setEnviType,
				setServiceStatus : setServiceStatus,
				setIDs : ccModuleIds,
				moduleNames : moduleNames
			}), 
			success : function(rs) {
				if(rs.success){		
					$('.testIpTable>tbody').remove();
					$('.testIpTable').DataTable({
						lengthChange: false, //不允许用户改变表格每页显示的记录数
				        searching: false, //关闭搜索
				        ordering:false,
				        Info: false,//页脚信息
				        language: {
							search : '',
							lengthMenu : "每页显示 _MENU_ 记录",
							zeroRecords : "没有找到搜索结果",
							info : "每页 9 条,共 _TOTAL_ 条,分页 _PAGE_ / _PAGES_",
							infoEmpty : "",
							infoFiltered : "(从 _MAX_ 条数据中搜索)",
							paginate : {
								first: '|<',
					            last: '>|',
					            previous: '<<',
					            next: '>>'
							}
				        }, //汉化
				        pageLength : 9, //每页显示几条数据
				        pagingType:'full',
						destroy: true,
				        data: rs.data,
				        columns:[{
							data : "ip"
						},{
							data : null,
							render : function(data, type, row, meta) {
								if (row.alived === false) {
									return '<span style="color: red;">Agent未安装</span>';
								}else if(row.alived === -1){
									return '<span style="color: red;">非法IP</span>';
								}else {
									return '<span>Agent正常</span>';
								}
							}
						}]
					});
					$('#testModal').modal();
				}else{
					printMsg(rs.msg.message,2);
				}
				$.unload();
			}
		});
	});
	
	//初始化页面时直接调用
	(function(){
		if(LEVEL === 2){
			$('#setPropertyWarp').parent().addClass('none');
			$('#getSetsSelectWarp').parent().addClass('none');
		}
		if(havePropInObj(extraObj)){//判断扩展参数是否存在
			if(havePropInObj(extraObj.data)){
				getServerSetDetail(extraObj.data.id);
			}
		}
	})();
});