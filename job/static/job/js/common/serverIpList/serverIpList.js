
(function($) {	
	var ipListData = [],//远程ip列表数据对象字面量
		ccTreeData = [], //远程cc数据对象字面量
		serverListData = [],//服务器集 
		ccScriptList = [],//cc脚本参数
		templateEl = $('#serverIpModel'),//使用的DOM模版
		tableLanguage = {
			search : '',
			lengthMenu : "每页显示 _MENU_ 记录",
			zeroRecords : "请选择服务器",
			info : "分页 _PAGE_ / _PAGES_",
			infoEmpty : "",
			infoFiltered : "(从 _MAX_ 条数据中搜索)",
			paginate : {
				first: '|<',
	            last: '>|',
	            previous: '<<',
	            next: '>>'
			}
		};//datatables汉化

	//异步缓存远程数据
	(function(){
		$.ajax({
			type : 'POST',
			url: basePath+"nm/personal/appAction!getCCModuleTree.action",
			dataType : 'json',
			success : function(rs) {
				if(rs.success){
					var dataArr = rs.data;
					$.each(dataArr,function(index,opt){
						opt.text = opt.text+'  ['+opt.hostNum+']'
						$.each(opt.items,function(i,item){
							item.text = item.text+'  ['+item.hostNum+']'
							if(item.hostNum>0){
								item.items = [];
								item.virtual = true;
							}
						});
						ccTreeData.push(opt);
					})
				}
			}
		});
		$.ajax({
			type : 'POST',
			url: basePath+"nm/components/nmServerSetAction!searchServerSet.action",
			dataType : 'json',
			success : function(rs) {
				serverListData = rs.data;
			}
		});
		$.ajax({
			type : 'POST',
			url: basePath+"nm/components/scriptAction!getScriptList.action",
			dataType : 'json',
			data : {
				isCCScript : 1
			},
			success : function(rs) {
				ccScriptList = rs.data;
			}
		});
	})();
	//手动添加模块dom数据初始化
	function initDefineMode(nameBox,areaBox,typeManually){
//		sourceArr= {1:'平台1',2:'平台2'}
		var _htmlNames='', _htmlAreas=''; 
		if(havePropInObj(sourceArr)){
			for(var prop in sourceArr){
				_htmlNames += '<label class="radio-inline"> <input type="radio" value="'+prop+'" name="platFrom">'+sourceArr[prop]+'</label> '
				_htmlAreas += '<textarea class="form-control server-ip-textarea plat-area-'+prop+' none" rows="3" placeholder="平台['+sourceArr[prop]+'],请输入IP，以“空格”或者“回车”或者“;”分隔"  style="height: 345px"></textarea>'
			}
		}else{
			_htmlNames += '<label class="radio-inline"> <input type="radio" value="1" name="platFrom" checked="checked">未知</label> '
			_htmlAreas += '<textarea class="form-control server-ip-textarea plat-area-1 none" rows="3" placeholder="平台[未知],请输入IP，以“空格”或者“回车”或者“;”分隔"  style="height: 345px"></textarea>'
		}
		nameBox.html(_htmlNames);
		if (typeManually!=1) {
			areaBox.html(_htmlAreas);
		}
		nameBox.find('input[name="platFrom"]').first().prop('checked',true);
		areaBox.find('.server-ip-textarea').addClass('none');
		areaBox.find('.server-ip-textarea').first().removeClass('none');
		nameBox.find('input[name="platFrom"]').off('click');
		nameBox.on('click','input[name="platFrom"]',function(e){
			areaBox.find('.server-ip-textarea').addClass('none');
			areaBox.find('.plat-area-'+$(e.currentTarget).val()).removeClass('none');
		});
		typeManually=1;
		return typeManually;
	}
	function ServerIp(wrapper,configObj){
		var me = this;
		me.configObj = configObj;
		me.mode = configObj.mode;
		me.typeManually=0;
		
		if(wrapper.find('.serverIp-Model-IsExist').length>0){
			wrapper.find('.serverIp-Model-IsExist').remove();		
		}
		//混入复制Ip组件
		ZeroClipboard.config({ moviePath: './js/common/ux/ZeroClipboard/ZeroClipboard.swf',zIndex:10000});
		
		var _modalEl = templateEl.clone().removeAttr('id').removeClass('none');//克隆模版
		me.modalEl = _modalEl;
		me.showModel = _modalEl.find('.showModel');//操作入口
		me.serverIpModal = _modalEl.find('.serverIpModal');//弹出窗口
		me.serverSelect = _modalEl.find('input[name=serverSelect]');//切换模块的对象
		me.ipChoose = _modalEl.find('.ipChoose-tab-pane');//模块1
		me.configCenter = _modalEl.find('.configCenter-tab-pane');//模块2
		me.manually = _modalEl.find('.manually-tab-pane');//模块3
		me.group = _modalEl.find('.group-tab-pane');//模块4
		me.ccScript = _modalEl.find('.cc-tab-pane');//模块5
		
		me.serverIpTable = _modalEl.find('.serverIpTable');//模块1数据模版对象
		me.treeviewByAjax = _modalEl.find('.treeviewByAjax');//模块2数据模版对象
		me.groupTable = _modalEl.find('.groupTable');//模块4数据模版对象
		
		me.filterText = _modalEl.find('.filterText');//搜索
		me.searchFeedback = _modalEl.find('.search-feedback');//点击搜索
		me.groupfilterText = _modalEl.find('.groupfilterText');//分组搜索
		me.modalLoading = _modalEl.find('.modal-loading-wrap');//加载状态
		me.groupbtn = _modalEl.find('.groupbtn');//添加分组
		me.groupNameInput = _modalEl.find('.groupNameInput');//添加分组
		me.copyIPByPage = new ZeroClipboard(_modalEl.find('.copyIPByPage'));		
		me.copyAllPageIP = new ZeroClipboard(_modalEl.find('.copyAllPageIP'));
		me.copyAllPageIP.me= me;
		me.copyIPByPage.me= me;
		if(me.mode===1){
			me.modalEl.find('.serverIpMode-2').remove();
			
			me.btnGroup = _modalEl.find('.btnGroup');//操作按钮区
			me.copyBtn = _modalEl.find('.copy-serverip-btn');//操作按钮区
			me.clearBtn = _modalEl.find('.clearBtn');//操作按钮区
			me.clearNotInstalledBtn = _modalEl.find('.clear-not-installed-Btn');//操作按钮区
			me.serveripInput = _modalEl.find('.hidden-serverip-string');//最终数据存放区
			me.serverSetId = _modalEl.find('.hidden-serverSetId');//服务器集Id
			
			me.serverIpResultTable = _modalEl.find('.serverIpResultTable');//结果集Table
			me.serverText = _modalEl.find('.server-text');//结果数展示
			
			me.clip = new ZeroClipboard(_modalEl.find('.copy-serverip-btn'));			
            me.clipAgentNotInstall = new ZeroClipboard(_modalEl.find('.copy-not-installed-agent-serverip-btn'));
            me.clipAgentNotInstall.me= me;
            me.clip.me= me;
			
			me.modalEl.find('.serverIp-result-table').css('width',configObj.width);
			me.modalEl.find('.buttonGroup').css('width',configObj.width);
			
			if(configObj && configObj.readOnly){
				_modalEl.find('.buttonGroup').hide();
			}
		}else if(me.mode === 2){
			me.modalEl.find('.serverIpMode-1').remove();
			me.serveripInput = _modalEl.find('.hidden-serverip-mode2');//最终数据存放区
			me.serverSetId = _modalEl.find('.hidden-serverSetId-mode2');//服务器集Id
			me.serveripCountLink = _modalEl.find('.serverip-count-link');
			me.showShortIp = _modalEl.find('.show-short-ip');
			me.resultModal = _modalEl.find('.resultModal');//结果ip显示mode
			me.serverIpMode2Table = _modalEl.find('.serverIpMode2Table');
		}
		if(me.configObj.ccEnable){
			me.ccName = _modalEl.find('.cc-name');//cc  脚本名称
			me.ccParam = _modalEl.find('.cc-param');//cc 参数
			me.ccTestBtn = _modalEl.find('.cc-test-btn');//cc 测试按钮
			me.ccTestRs = _modalEl.find('.cc-test-rs');//cc 测试结果
			me.ccIpCount = _modalEl.find('.cc-ip-count');//cc Ip数量

			me.ccResultBox = _modalEl.find('.ccResultBox');//cc 页面展示模块
			me.ccRsId = _modalEl.find('.cc-scriptId');//cc 页面展示模块
			me.ccRsName = _modalEl.find('.cc-name-hidden');//cc 页面展示模块
			me.ccRsParam = _modalEl.find('.cc-param-hidden');//cc 页面展示模块
			me.ccNoRsParam = _modalEl.find('.cc-no-param-hidden');//cc 页面展示模块
			me.ccResultModal = _modalEl.find('.ccResultModal');//结果ip显示mode
			me.ccModeTable = _modalEl.find('.ccModeTable');
		}else{
			me.serverSelect.last().parent().addClass('none');
		}
		
		me.selectedAllChecks = _modalEl.find('.selectedAllChecks');//全选复选框
		me.selectAll = _modalEl.find('.selectAll');//全选复选框
		me.checkIpList = []; 
		me.checkIpListFile = []; 
		me.checkIpListGroup = [];
		me.checkServerSetId = 0; 
		me.checkModuleIds = 0;
		me.ajaxCountArr = [];
	}
	ServerIp.prototype = {
		constructor : ServerIp,
		modalEl : null,
		serverIpModal : null,
		create : function(wrapper){
			var me = this;
			me.modalElInit();//初始化模版配置
			me.bindEvent();
			wrapper.append(me.modalEl);//加入页面
			return wrapper;
		},
		//克隆模版初始化配置方法
		modalElInit : function(){
			var me = this,ipArray,configObj = me.configObj,ip,source;
//			me.serverSelect.chosen({width:'200px'})
			//给定默认IP值的处理
			me.checkServerSetId = configObj.serverSetId;
			if(configObj.ccScriptId){
				me.setccValue({
					ccScriptId : configObj.ccScriptId,
					ccScriptName : configObj.ccScriptName||'',
					ccScriptParam : configObj.ccScriptParam||''
				})
			}else if(configObj.ipListString){
				try {
					var ipList =  configObj.ipListString;
					ipList.map(function(v){
						me.checkIpList.push({
							source : v.source,
							ip: v.ip,
							alived : ((v.valid !== 'undefined' && v.valid !==0) ? v.alived : -1) 
						});
					})
					if(me.checkIpList.length>0){
						me.setValue();
						me.initResultTable();
					}
				} catch (e) {
					console.error(e)
				}
				
			}
		},
		bindEvent : function(){
			var me = this,modalEl = me.modalEl;
			modalEl.on('click','.showModel',me.modalEvent.showModal.bind(me));
			modalEl.on('change','input[name=serverSelect]',me.modalEvent.serverSelectChange.bind(me));
			modalEl.on('click','.savebtn',me.modalEvent.save.bind(me));
			modalEl.on('click','.cancelbtn',me.modalEvent.cancel.bind(me));
			modalEl.on('keydown','.filterText',me.modalEvent.filterText.bind(me));
			modalEl.on('click','.search-feedback',me.modalEvent.searchFeedback.bind(me));
			modalEl.on('keyup','.groupfilterText',me.modalEvent.groupfilterText.bind(me));
			modalEl.on('click','.selectedAllChecks',me.modalEvent.selectAllByPage.bind(me));
			modalEl.on('change','.selectAll',me.modalEvent.selectAll.bind(me));
			modalEl.on('click','.groupbtn',me.modalEvent.groupAdd.bind(me));
			me.copyAllPageIP.on('mousedown', me.modalEvent.copyAllPageIP);
			me.copyIPByPage.on('mousedown',me.modalEvent.copyIPByPage);
			if(me.mode===1){
				me.clip.on('mousedown',me.modalEvent.copyIp);
				me.clipAgentNotInstall.on('mousedown',me.modalEvent.copyAgentNotInstallIp);
				modalEl.on('click','.clearBtn',me.modalEvent.clearIp.bind(me));
				modalEl.on('click','.clear-not-installed-Btn',me.modalEvent.clearNotInstallIp.bind(me));
			}else{
				modalEl.on('click','.serverip-count-link', me.modalEvent.showMode2.bind(me));
				modalEl.on('click','.hideMode2', me.modalEvent.hideMode2.bind(me));
			}
			if(me.configObj.ccEnable){
				modalEl.on('click','.cc-test-btn',me.modalEvent.ccTest.bind(me));
				modalEl.on('click','.cc-showModel',me.modalEvent.showModal.bind(me));
				modalEl.on('click','.cc-showTest',me.modalEvent.showTest.bind(me));
				modalEl.on('click','.ccHideMode', me.modalEvent.hideTest.bind(me));
			}
		},
		//克隆模版初始化事件方法
		modalEvent : {
			copyAllPageIP: function(cb){
				if(!$(this).hasClass('copyAllPageIP')){
					return;
				}
				var ips = [];				
				$.ajax({
					type : 'POST',
					url : basePath + 'nm/personal/appAction!getIpList.action', 
					async : false,
					dataType : 'json',
					success : function(rs) {
						ips = rs.data.map(function(v){
							return v.ip;
						});
						var len = ips.length;
						if(len){
							cb.me.copyAllPageIP.setText(ips.join(' \n'));
							printMsg('已复制'+len+'条IP记录',1);
						}else{
							printMsg('没有Ip可以复制',2);
						}
					}
				});
			},
			copyIPByPage : function(cb){
				if(!$(this).hasClass('copyIPByPage')){
					return;
				} 
				dataArr = cb.me.checkIpList,
				ips = [];
				ips = dataArr.map(function(v){
					return v.ip;
				});
				var len = ips.length;
				if(len){
					cb.me.copyIPByPage.setText(ips.join(' \n'));
					printMsg('已复制'+len+'条IP记录',1);
				}else{
					printMsg('没有Ip可以复制',2);
				}
			},
			showModal : function(e){
				var me = this,currentTarget = $(e.currentTarget);
				e.preventDefault();
				if(currentTarget.popover){
					currentTarget.popover('hide');
				}
				if(me.configObj.ccEnable && me.ccRsId.val()){
					me.serverSelect.last().prop('checked',true);
					me.changeShowModel('5');
					me.ccParam.text(me.ccRsParam.text()=='无'?'':me.ccRsParam.text());
					me.serverIpModal.modal().draggable({
						cursor: "pointer",
						handle: "div.serverIpListtabs"
					});
					me.ccName.val(me.ccRsId.val());
					return;
				}
				if(ipListData){
					me.changeShowModel();
					me.serverIpModal.modal().draggable({
						cursor: "pointer",
						handle: "div.serverIpListtabs"
					});
					
				}else{
                    var localHostName = window.self.location.hostname;
                    if (localHostName.indexOf(".bkclouds.") > 0) {
                        var weburl = 'http://cc.o.bkclouds.cc/';
    					confirmModal('提示','当前业务下没有可用的机器。<br>请前往配置平台导入主机',function(){
    							window.open(weburl,'_blank');
    					});
                    } else {
                        var weburl = 'http://www.qcloud.com/';
                        confirmModal('提示','当前业务下没有可用的机器。<br>您可前往<a href="'+weburl+' " target="_blank">腾讯云</a>购买',function(){
                                window.open(weburl,'_blank');
                        });
                    }
				}
			},
			selectAllByPage :function(e){
				var me = this,
					datatable = me.serverIpTable.DataTable(),
					dataArr = datatable.data(),
					currentTarget = $(e.currentTarget);
				if(me.selectAll.prop('checked')){
					return false;
				}
				if(currentTarget.prop('checked')){
					dataArr.map(function(v){
						me.checkIpList = JSON.parse(JSON.stringify(me.checkIpList).replace(new RegExp(JSON.stringify(v)+',?', "g"),'').replace(/,]$/,']'));
						me.checkIpList.push(v);
					});
					me.serverIpTable.find('.userChecks:enabled').prop('checked',true);
				}else{
					dataArr.map(function(v){
						me.checkIpList = JSON.parse(JSON.stringify(me.checkIpList).replace(new RegExp(JSON.stringify(v)+',?', "g"),'').replace(/,]$/,']'));
					});
					me.serverIpTable.find('.userChecks').prop('checked',false);
				}
			},
			selectAll :function(e){
				var me = this,
					currentTarget = $(e.currentTarget);
				me.checkIpList = [];
				me.serverIpTable.find('.userChecks').prop('checked',false).prop('disabled',false);
				me.serverIpTable.find('.select_all_flag').removeClass('agent-error-tr');
				if(currentTarget.prop('checked')){
					me.modalLoading.removeClass('none');
					$.ajax({
						type : 'POST',
						url : basePath + 'nm/personal/appAction!getIpList.action', 
						data : {
							searchCond : $.trim(me.filterText.val())
						},
						dataType : 'json',
						success : function(rs) {
							var len = rs.data.length;
							me.modalLoading.addClass('none');
							if(len){
								me.checkIpList = rs.data;
								me.serverIpTable.find('.userChecks').prop('checked',true).prop('disabled',true);
								me.serverIpTable.find('.select_all_flag').addClass('agent-error-tr');
								printMsg('已选择'+len+'条数据',1);
							}else{
								printMsg('没有数据',2);
							}
							
						}
					});
				}
			},
			serverSelectChange : function(e){
				var me = this,currentTarget = $(e.currentTarget);
				me.changeShowModel(currentTarget.val());
			},
			checkTr : function(e){
				e.stopPropagation();
				var me = this,row,data,point,userChecks
					datatable = me.serverIpTable.DataTable(),
					currentTarget = $(e.currentTarget),
					target = $(e.target);
				if(me.selectAll.prop('checked')){
					return false;
				}
				if(target.attr('type') === 'checkbox' && target.hasClass('userChecks')){
					userChecks = currentTarget;
					row = datatable.row(currentTarget.parents('tr'));
					data = row.data();
				}else{
					userChecks = currentTarget.find('.userChecks');
					row = datatable.row(currentTarget);
					data = row.data();
//					if(data.alived){
						userChecks.prop('checked',!userChecks.prop('checked'));
//					}
				}
//				if(!data.alived){
//					return;
//				}else{
					$.each(me.checkIpList,function(i,opt){
					// $.each(checkIpListAll,function(i,opt){
						// if(opt.ip === data.ip){
						if((opt.ip === data.ip) && (opt.source === data.source)){
							point = i;
							return false;
						}
					});
					if(userChecks.prop('checked') && point === undefined){
						me.checkIpList.push(data);
//						if(alivedIpListData.length===me.checkIpList.length){
//							me.selectedAllChecks.prop('checked',true);
//						}
					}else{
						if(point>=0){
							me.checkIpList.splice(point,1);
							me.selectedAllChecks.prop('checked',false);
						}
					}
//				}
			},
			groupCheckTr : function(e){
				e.stopPropagation();
				var me = this,row,data,point,userChecks
				datatable = me.groupTable.DataTable(),
				currentTarget = $(e.currentTarget),
				target = $(e.target);
                row = datatable.row(currentTarget);
                data = row.data();
				if(target.attr('type') === 'radio' && target.attr('name') === 'groupRadio'){
					userChecks = currentTarget;
				}else{
					userChecks = currentTarget.find('input[name=groupRadio]');
					userChecks.prop('checked',true);
				}
				me.checkServerSetId = userChecks.val();
                if (data) {
    				me.checkModuleIds = data.id;
                    if (!(me.checkServerSetId)) {
                        me.checkServerSetId = data.id;
                    }
                }
			},
			delOneResult : function(e){
				e.stopPropagation();
				var me = this,
				currentTarget = $(e.currentTarget),
				datatable = me.serverIpResultTable.DataTable(),
				row = datatable.row(currentTarget.parents('tr')),
				data = row.data();
				me.checkIpList=[];
				this.checkIpList=[];
				// me.checkIpList = me.checkIpList.filter(function(v){
				// checkIpListAll = checkIpListAll.filter(function(v){
				me.checkIpListFile = me.checkIpListFile.filter(function(v){
					if (data.ip) {
						if(v.ip == data.ip &&v.source == data.source){
							return false;
						}
						return true;
					}
					
				});
				row.remove().draw(false);
				me.setValue();
				var value = me.serveripInput.val();
				if(value){
                    var count = me.checkIpListFile.length;
                    var alivedCount =0,unalivedCount = 0;
                    $.each(me.checkIpListFile,function(i,opt){
                        if(opt.alived===1){
                            alivedCount++;
                        }else{
                            unalivedCount++;
                        }
                    });
                    if(me.checkServerSetId){
                        groupTip ='<span class="fb">[分组]</span>';
                    }else{
                        groupTip = '';
                    }
                    var unalivedTip = ''
                    if (unalivedCount > 0) {
                        unalivedTip  = '，<span class="text-danger">Agent未安装'+unalivedCount+'台</span>';
                    }
                    me.serverText.html('共'+count+'台，Agent正常'+alivedCount+'台' + unalivedTip + groupTip).removeClass('none');
                
					if(me.configObj && typeof me.configObj.ipOnChange =='function'){
						me.configObj.ipOnChange(value, value.split(',').length);
					}
				}else{
					me.serverText.empty().addClass('none');
					if(me.configObj && typeof me.configObj.ipOnChange =='function'){
						me.configObj.ipOnChange(null,0);
					}
				}
			},
			delOneShortIp : function(e){
				e.stopPropagation();
				var me = this,
				currentTarget = $(e.currentTarget),
				datatable = me.showShortIp.DataTable(),
				row = datatable.row(currentTarget.parents('tr')),
				data = row.data();
				me.checkIpList=[];
				this.checkIpList=[];
				// me.checkIpList = me.checkIpList.filter(function(v){
				// checkIpListAll = checkIpListAll.filter(function(v){
				me.checkIpListFile = me.checkIpListFile.filter(function(v){
					if(v.ip == data.ip &&v.source == data.source){
						return false;
					}
					return true;
				});
				row.remove().draw(false);
				me.setValue();
				var value = me.serveripInput.val();
				
				if(value){
					me.serveripCountLink.html('共'+value.split(',').length+'台').removeClass('text-no-number');
					if(me.configObj && typeof me.configObj.ipOnChange =='function'){
						me.configObj.ipOnChange(value,value.split(',').length);
					}
				}else{
					// console.log(me.serverText);
					// me.serverText.empty().addClass('none');
					me.serveripCountLink.html('共0台').removeClass('text-no-number');
					if(me.configObj && typeof me.configObj.ipOnChange =='function'){
						me.configObj.ipOnChange(null,0);
					}
				}
				me.serverIpMode2Table.find('tbody').remove();
				me.serverIpMode2Table.DataTable({
					lengthChange: false, //不允许用户改变表格每页显示的记录数
			        searching: false, //关闭搜索
			        column:'1:0',
					ordering:true,
			        Info: false,//页脚信息
			        language: {
						search : '',
						lengthMenu : "每页显示 _MENU_ 记录",
						zeroRecords : "没有找到搜索结果",
						info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 9 条&nbsp;&nbsp;共 _TOTAL_ 条",
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
			        pagingType:'input',
					destroy: true,
			        // data:me.checkIpList,
			        // data:checkIpListAll,
			        data:me.checkIpListFile,
			        columns:[{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							if (row.alived === 0) {
								return '<span style="color: red;">Agent未安装</span>';
							}else if(row.alived === -1){
								return '<span style="color: red;">非法IP</span>';
							}else {
								return '<span>Agent正常</span>';
							}
						}
					}]
				});
				$("table.dataTable thead").attr("title","排序");
			},
			copyIp : function(cb){
				if(!$(this).hasClass('copy-serverip-btn')){
					return;
				}
				value = cb.me.serveripInput.val();
				value =value.replace(/\d+\:/g , '');
				cb.me.clip.setText(value.replace(/,/g , '\n'));
				if(value){
					printMsg('已复制'+value.split(',').length+'条IP记录',1);
				}else{
					printMsg('没有Ip可以复制',2);
				}
			},
            copyAgentNotInstallIp : function(cb){
            	if(!$(this).hasClass('copy-not-installed-agent-serverip-btn')){
					return;
				}
            	
                datatable = cb.me.serverIpResultTable.DataTable(),
                data = datatable.data();
                var agentNotInstall = '',
                    count=0;
                for(var i=0,len=data.length;i<len;i++){
                    if(data[i].alived === 0){
                        agentNotInstall += data[i].ip;
                        agentNotInstall += '\n';
                        count++;
                    }
                }
                cb.me.clipAgentNotInstall.setText(agentNotInstall);
                if(count > 0){
                    printMsg('已复制'+count+'条IP记录',1);
                }else{
                    printMsg('没有Ip可以复制',2);
                }
            },
			clearIp : function(e){

				var me = this;
				this.checkIpList=[];
				me.checkIpList=[];
				confirmModal('提示','是否要清空所选择IP',function(){
					me.serverIpResultTable.DataTable().clear().draw();
					// me.checkIpList = [];
					// checkIpListAll = [];
					me.checkIpListFile = [];
					me.setValue();
					me.serverText.addClass('none').empty();
				});
			},
			clearNotInstallIp : function(e){
				var me = this,
					datatable = me.serverIpResultTable.DataTable(),
					data = datatable.data();
					me.checkIpList=[];
					this.checkIpList=[];
				confirmModal('提示','是否要清空所有Agent未安装的服务器',function(){
					// me.checkIpList = [];
					// checkIpListAll = [];
					me.checkIpListFile = [];
					for(var i=0,len=data.length;i<len;i++){
						if(data[i].alived == 1){
							// me.checkIpList.push(data[i])
							// checkIpListAll.push(data[i])
							me.checkIpListFile.push(data[i]);
						}
					}
					me.setValue();
					me.initResultTable();
				});
			},
			filterText : function(e){
				var me = this,
					searchCond =$.trim(me.filterText.val());
				if(e.keyCode === 13){
					me.checkIpList = [];
					me.selectAll.prop('checked',false);
					me.loadServerIpTable({searchCond : searchCond});
					return false;
				}
			},
			searchFeedback : function(e){
				var me = this,
					searchCond =$.trim(me.filterText.val());
					me.checkIpList = [];
					me.selectAll.prop('checked',false);
					me.loadServerIpTable({searchCond : searchCond})
			},
			groupfilterText : function(e){
				var me = this,
				value =$.trim(me.groupfilterText.val()),
				datatable = me.groupTable.DataTable();
				me.reset();
				datatable.search(value).draw();	
			},
			showMode2 : function(e){
				var me = this,
					currentTarget = $(e.currentTarget);
				if(currentTarget.hasClass('text-no-number')){
					return false;
				}else{
					me.resultModal.modal('show');
				}
			},
			hideMode2 : function(e){
				var me = this;
				me.resultModal.modal('hide');
			},
			showTest : function(e){
				var me = this;
				me.ccResultModal.modal('show');
//				me.ccResultModal.divLoad('show');
				$.ajax({
	    			type : 'POST',
	    			url: basePath+"nm/components/scriptAction!getIpListByCCScriptId.action",
	    			dataType : 'json',
					data:{
						scriptId: me.ccRsId.val()
					}, 
					success : function(rs) {
						if(rs.success){		
							me.ccModeTable.find('tbody').remove();
							me.ccModeTable.DataTable({
								lengthChange: false, //不允许用户改变表格每页显示的记录数
						        searching: false, //关闭搜索
						        column:'1:0',
								ordering:true,
						        Info: false,//页脚信息
						        language: {
									search : '',
									lengthMenu : "每页显示 _MENU_ 记录",
									zeroRecords : "没有找到搜索结果",
									info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 9 条&nbsp;&nbsp;共 _TOTAL_ 条",
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
						        data: rs.ipList,
						        columns:[{
									data : "InnerIP"
								},{
									data : null,
									render : function(data, type, row, meta) {
										if (row.alived === 0) {
											return '<span style="color: red;">Agent未安装</span>';
										}else if(row.alived === -1){
											return '<span style="color: red;">非法IP</span>';
										}else {
											return '<span>Agent正常</span>';
										}
									}
								}]
							});
							$("table.dataTable thead").attr("title","排序");
						}else{
							printMsg(rs.msg.message,2);
						}
//						me.ccResultModal.divLoad('hide');
					}
				});
			},
			hideTest : function(e){
				var me = this;
				me.ccResultModal.modal('hide');
			},
			save : function(e){
				$.load();
				var me = this,
					checkedNodes = [] ,
					checkedVal;

				function D(){
					me._cancel();
					$.unload();
				}

				function C(treeView){
					if(checkedVal === '2'){
						me.checkNodes(treeView.dataSource.view(), checkedNodes);
			    		me.checkIpList = checkedNodes;
					}
					if(checkedVal === '3'){
						if(!me.processManually()){
							return false;
						}
						me.modalLoading.removeClass('none');
						var checkIpData =[];
						me.serverArea.each(function(i,opt){
							var textArea = $.trim($(opt).val());
							if(textArea){
								var platFrom = me.platFrom.eq(i).val()
								checkIpData.push({
									source : me.platFrom.eq(i).val(),
									sourceName : sourceArr[platFrom],
									ipList : textArea.replace(/^\s\s+|\s+/g,',')
								})
							}
								
						});
						$.ajax({
			    			type : 'POST',
			    			url: basePath+"nm/personal/appAction!checkIp.action",
			    			dataType : 'json',
							data:{
								checkIPObj : JSON.stringify(checkIpData)
							}, 
							success : function(rs) {
								if(rs.success){		
									me.checkIpList = rs.data;
									if(me.checkIpList.length>0){
										me.setValue();
										me.initResultTable();
									}
									me._cancel();
									$.unload();
								}else{
									me.checkServerSetId = 0;
									me.checkIpList = [];
								}
								if(rs.msg){
									printMsg(rs.msg.message,2);
								}
							}
						});
					}
					if(checkedVal === '4'){
						if(!me.checkModuleIds) {
							me._cancel();
							$.unload();
							return;
						}
						me.modalLoading.removeClass('none');
						$.ajax({
			    			type : 'POST',
			    			url: basePath+"nm/components/nmServerSetAction!getCCHostByServerSet.action",
			    			dataType : 'json',
							data:{
								serverSetId: me.checkModuleIds
							}, 
							success : function(rs) {
								if(rs.success){		
									var dataList =  rs.data, dataArr = [];
									$.each(dataList,function(i, opt){
										dataArr.push({
											 text : opt.ipDesc +' ['+opt.ip+']',
							                 ip: opt.ip,
							                 moduleId: opt.moduleId,
							                 source : opt.source,
						                	 alived : opt.alived
										});
									});
									me.checkIpList = dataArr;
									if(dataList.length===0){
										printMsg('从配置平台获取到的IP为空！',2);
									}
								}else{
									me.checkServerSetId = 0;
									me.checkIpList = [];
								}
								if(me.checkIpList.length>0){
									me.setValueGroup();
									me.initResultTableGroup();
								}
								me._cancel();
								$.unload();
							}
						});
						return false;
					}
					if(checkedVal === '5'){
						me.setccValue();
						me._cancel();
						$.unload();
						return false;
					}
					if(me.checkIpList.length>0){
						me.setValue();
						me.initResultTable();
					}

					D();
				}

				function B(){
					var treeView = me.treeviewByAjax.data("kendoTreeView");
					checkedVal = me.serverSelect.filter(':checked').val();
					C(treeView);
				}
				var tim = setTimeout(B,500);
			},
			cancel : function(e){
				var me = this;
				me._cancel();
			},
			ccTest : function(e){
				var me = this,
					scriptId = me.ccName.val(),
				    ccParams = $.trim(me.ccParam.val());
				   if(scriptId){
						me.ccTestRs.val('');
						me.ccIpCount.text('');
						$.ajax({
			    			type : 'POST',
			    			url: basePath+"nm/components/scriptAction!getCCScriptTestResultById.action",
			    			dataType : 'json',
							data:{
								scriptId: scriptId,
								ccParams : ccParams
							}, 
							success : function(rs) {
								if(rs.success){		
									me.ccTestRs.val(rs.ccresult);
									me.ccIpCount.text('执行记录数为['+rs.ipCount+']条');
								}else{
									printMsg(rs.msg.message,2);
								}
							}
						});
				   }
			},
			groupAdd : function(e){
				var me = this,moduleNames=[],name = $.trim(me.groupNameInput.val()),
					treeView = me.treeviewByAjax.data("kendoTreeView"),
				 	dataSource = treeView.dataSource.view();
                if(LEVEL === 2){
    				if(dataSource[0]&&dataSource[0].hasChildren){
    					$.each(dataSource[0].children.view(),function(i,o){
    						if(o.checked){
    							moduleNames.push($.trim(o.text.replace(/\s\[\d+\]$/,'')))
    						}
    					})
    					if(!name){
    						printMsg("请输入分组名称！",2);
    						return false;
    					}
    					if(moduleNames.length){
    						$.ajax({
    			    			type : 'POST',
    			    			url: basePath+"nm/components/nmServerSetAction!saveServerSet.action",
    			    			dataType : 'json',
    							data:{
    								name : name,
    								moduleNames : moduleNames.toString()
    							}, 
    							success : function(rs) {
    								if(rs.success){
    									printMsg('保存成功！',1);
    									$.ajax({
    										type : 'POST',
    										url: basePath+"nm/components/nmServerSetAction!searchServerSet.action",
    										dataType : 'json',
    										success : function(rs) {
    											serverListData = rs.data;
    											me.loadGroupTable();
    										}
    									});
    								}else{
    									printMsg(rs.msg.message,rs.msg.msgType);
    								}
    							}
    						});
    					}else{
    						printMsg("请选择分组的模块！",2);
    					}
    				}else{
    					printMsg("没有可配置数据！",2);
    				}
                } else {
                    for(var i=0; i<dataSource.length; i++) {
                        if(dataSource[i]&&dataSource[i].hasChildren){
                            $.each(dataSource[i].children.view(),function(i,o){
                                if(o.checked){
                                    moduleNames.push($.trim(o.text.replace(/\s\[\d+\]$/,'')))
                                }
                            })
                        }
                    }
                    if(!name){
                        printMsg("请输入分组名称！",2);
                        return false;
                    }
                    if(moduleNames.length){
                        $.ajax({
                            type : 'POST',
                            url: basePath+"nm/components/nmServerSetAction!saveServerSet.action",
                            dataType : 'json',
                            data:{
                                name : name,
                                moduleNames : moduleNames.toString()
                            }, 
                            success : function(rs) {
                                if(rs.success){
                                    printMsg('保存成功！',1);
                                    $.ajax({
                                        type : 'POST',
                                        url: basePath+"nm/components/nmServerSetAction!searchServerSet.action",
                                        dataType : 'json',
                                        success : function(rs) {
                                            serverListData = rs.data;
                                            me.loadGroupTable();
                                        }
                                    });
                                }else{
                                    printMsg(rs.msg.message,rs.msg.msgType);
                                }
                            }
                        });
                    }else{
                        printMsg("请选择分组的模块！",2);
                    }
                }
			}
		},
		_ccReset : function(){
			var me = this;
			me.ccRsId.val(null)
			me.ccRsName.text('');
			me.ccRsParam.text('');
			me.ccResultBox.addClass('none');
		},
		_cancel : function(){
			var me = this;
			me.modalLoading.addClass('none');
			me.filterText.val(null);
			me.groupfilterText.val(null);
			me.serverIpModal.modal('hide');
			me.serverSelect.eq(0).prop('checked',true);
            if(me.configObj.ccEnable){
    			me.ccName.find('option').first().prop('selected',true);
    			me.ccParam.valueOf(null);
    			me.ccTestRs.valueOf(null);
    			me.ccIpCount.text('');
            }
		},
		changeShowModel : function(type){
			var me = this ,
				subIndex = 0,
				treeData = Object.create(ccTreeData);
			me.reset();
			me.ipChoose.addClass('none');
			me.configCenter.addClass('none');
			me.manually.addClass('none');
			me.group.addClass('none');
			me.ccScript.addClass('none');
			me.selectAll.parent().addClass('none');
			me.modalEl.find('.copyIPByPage').addClass('none');
			me.modalEl.find('.copyAllPageIP').addClass('none');
			me.groupbtn.addClass('none').prop('disabled',true);
			me.groupNameInput.addClass('none').prop('disabled',true).val(null);
			if(type === '2'){

				me.configCenter.removeClass('none');
				me.groupbtn.removeClass('none');
				me.groupNameInput.removeClass('none');
				me.treeviewByAjax.remove();
				me.treeviewByAjax = $('<div class="treeviewByAjax"></div>');
				me.configCenter.find('.treeviewDiv').append(me.treeviewByAjax);
				me.treeviewByAjax.kendoTreeView({
					// template: '<span title="#= item.title #">#= item.text.length>85?item.text.slice(0,85)+"...":item.text #<span>',
				    template: '<span title="#= !(item.title)?item.text:item.title #">#= item.text.length>85?item.text.slice(0,85)+"...":item.text #<span>',
				    // template: '<span title="#= !(item.title)?item.text:item.title #">#= item.text.length>85?item.text.slice(0,85)+"...":item.text #<span>#= !(item.items)?"<span class=tplIcon >复制</span>":"" #',
				    checkboxes : {
				    	checkChildren : true
				    },
				    dataSource : treeData,
				    check : function(e){
				    	var treeView = me.treeviewByAjax.data("kendoTreeView"),
				    		dataItem = treeView.dataItem(e.node),
				    		ajaxSubItems=[];

				    	//配置平台，输入分组名称编辑--start
				    	var liGroup = $('.treeviewByAjax>ul>li');
                        if(LEVEL === 2){
                            var count = 0;
                            $.each(liGroup,function(i,opt){
                                var groupcheck = me.isGropuCheckbox($(opt));
                                if (groupcheck) {
                                    count++;
                                }
                            });
                            if(count){
                                me.groupbtn.prop('disabled',false);
                                me.groupNameInput.prop('disabled',false);
                            }else{
                                me.groupbtn.prop('disabled',true);
                                me.groupNameInput.prop('disabled',true);
                            }
                        } else {
                            var count = 0;
                            var cNum = 0;
                            var childUlGroup = liGroup.children('.k-group').children('li');
                            $.each(childUlGroup,function(i,opt){
                                // var groupcheck = me.isGropuCheckbox($(opt));
                                var groupcheck = me.isGropuCheckLevel($(opt));
                                if (groupcheck[0]>0) {
                                    count++;
                                }
                                if (groupcheck[1]>0) {
                                	cNum++;
                                }
                            });
                            /*if(count){
                                me.groupbtn.prop('disabled',false);
                                me.groupNameInput.prop('disabled',false);
                            }else{
                                me.groupbtn.prop('disabled',true);
                                me.groupNameInput.prop('disabled',true);
                            }*/
                            if (cNum>0) {
                            	me.groupbtn.prop('disabled',true);
                                me.groupNameInput.prop('disabled',true);
                            }else if(count>0){
                            	me.groupbtn.prop('disabled',false);
                                me.groupNameInput.prop('disabled',false);
                            }else{
                            	me.groupbtn.prop('disabled',true);
                                me.groupNameInput.prop('disabled',true);
                            }
                        }
				    	
				    	//配置平台，输入分组名称可编辑--end

			    		// me.isGropuCheckbox($(treeView.root));
			    		if(dataItem.setId && dataItem.hostNum){//一级节点
				    		subItems = dataItem.items;
			    			subIndex = 0;
			    			me.ajaxCountArr = [];
				    		for(var i=0;i<subItems.length;i++){ 
					    		if(subItems[i].hostNum && !subItems[i].expanded){
					    			ajaxSubItems.push(subItems[i]);
					    			treeView.expand($(e.node).children('ul:eq(0)').children('li').eq(i));
					    		}
					    	}
				    		for(var i=0;i<ajaxSubItems.length;i++){ 
				    			me.ajaxCountArr[i] = false;
				    		}
				    		if(me.ajaxCountArr.length>0){
				    			var timer  = window.setInterval(function(){
				    				var loadFlag = true;
				    				for(var i=0;i<me.ajaxCountArr.length;i++){
				    					if(!me.ajaxCountArr[i]){
				    						loadFlag = false;
				    						break;
				    					}
				    				}
				    				if(loadFlag){
				    					me.modalLoading.addClass('none');
						    			me.ajaxCountArr = [];
				    					window.clearInterval(timer);
				    				}
				    			}, 1000);
				    		}
				    	}else{
				    		if(!dataItem.setId){
				    			if(dataItem.moduleId && dataItem.hostNum>0){
				    				subIndex = 0;
				    				treeView.expand($(e.node));
				    			}
				    		} 
				    	}
				    },
				    expand:function(e){
				    	var treeView = me.treeviewByAjax.data('kendoTreeView'),
				    		dataItem = treeView.dataItem(e.node);
				    	if(!dataItem.setId && dataItem.hostNum){
				    		window.setTimeout(function(){
				    			me.addChildItem(dataItem,  $(e.node), subIndex++);
							}, 100)
				    	}
				    }
				});
			}else if(type === '3'){
				me.manually.removeClass('none');
				//初始化手动添加模块
				me.typeManually=initDefineMode(me.modalEl.find('.plat-name-box'),me.modalEl.find('.plat-area-box'),me.typeManually);
				me.serverArea = me.modalEl.find('.server-ip-textarea');//模块3数据模版对象
				me.platFrom = me.modalEl.find('input[name="platFrom"]');
			}else if(type === '4'){
				me.group.removeClass('none');
				me.loadGroupTable();
			}else if(type === '5'){
				me.ccScript.removeClass('none');
				me.ccName.empty();
				$.each(ccScriptList,function(i,opt){
					me.ccName.append('<option value="'+opt.scriptId+'">'+opt.name+'</option>')
				});
				me.ccName.chosen({width:'618px'});
				
			}else{
				me.ipChoose.removeClass('none');
				me.selectAll.parent().removeClass('none');
				me.modalEl.find('.copyIPByPage').removeClass('none');
				me.modalEl.find('.copyAllPageIP').removeClass('none');
				me.loadServerIpTable();
			}
		},
		loadServerIpTable : function(_data){
			var me = this;
			me.serverIpTable.find('tbody').remove();
			me.serverIpTable.on('preXhr.dt', function ( e, settings, data ) {
				me.modalLoading.removeClass('none');
		    } ).on('xhr.dt', function ( e, settings, json, xhr ) {
				me.modalLoading.addClass('none');
		    }).DataTable({
				lengthChange: false, //不允许用户改变表格每页显示的记录数
		        searching: false, //关闭搜索
		        ordering:false,
		        Info: false,//页脚信息
		        pagingType:'input',
		        language: {
					search : '',
					lengthMenu : "每页显示 _MENU_ 记录",
					zeroRecords : "没有找到搜索结果",
					info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 7 条&nbsp;&nbsp;共 _TOTAL_ 条",
					infoEmpty : "",
					infoFiltered : "(从 _MAX_ 条数据中搜索)",
					paginate : {
						first: '|<',
			            last: '>|',
			            previous: '<<',
			            next: '>>'
					}
		        }, //汉化
		        processing: false,
	            serverSide: true,
		        pageLength : 7, //每页显示几条数据
				destroy: true,
				ajax:{
					 "type": "POST",
					 "data": _data,
					 "url":  basePath + 'nm/personal/appAction!getIpList.action',
					 "error":function(e){
							ajaxError(e);					 
					 }
				 },		
				columns:[{
					data:null,
			    	render : function(data, type, row, meta){
			    		var checked = '', selectAllClass = '',disabled = '';
			    		if(me.checkIpList.length){
			    			me.checkIpList.map(function(v){
			    				if(data.ip === v.ip && data.source === v.source ){
			    					checked = 'checked'
			    				}
			    			})
			    		}
			    		if(me.selectAll.prop('checked')){
			    			selectAllClass = 'agent-error-tr';
			    			disabled = 'disabled'
			    		}
			    		return '<input value="'+data.ip+'" type="checkbox" class="userChecks select_all_flag'+selectAllClass+'"'+ checked+' '+disabled+'>';
					}
				},{
	        		   data:null,
	        		   render : function(data, type, row, meta) {
	                       	var source = data.source;
	        				var selectAllClass = '';
	                       	if(me.selectAll.prop('checked')){
				    			selectAllClass = 'agent-error-tr'
				    		}
	                       	if(source&&source>0){
	                       		return '<span class="select_all_flag '+selectAllClass+'">'+((undefined === sourceArr[row.source] || ""==sourceArr[row.source]) ? '未知' : sourceArr[row.source]) + '</span>' || '';
	                       	}else{
	                       		return '';
	                       	}
	                   	}
	           },{
				   data:null,
				   render : function(data, type, row, meta){
					   var selectAllClass = '';
                      	if(me.selectAll.prop('checked')){
			    			selectAllClass = 'agent-error-tr'
			    		}
				        return '<span class="select_all_flag '+selectAllClass+'">'+data.ip+'</span>';
				   }
			   },{
	        	   data:null,
				   render : function(data, type, row, meta){
					   var selectAllClass = '';
                      	if(me.selectAll.prop('checked')){
			    			selectAllClass = 'agent-error-tr'
			    		}
				        return !!(data.alived)?'<span class="text-success select_all_flag '+selectAllClass+'">Agent正常</span>':'<span class="text-danger select_all_flag '+selectAllClass+'">Agent未安装</span>';
				   }
	           },{
        		   data:null,
				   render : function(data, type, row, meta){
					   var selectAllClass = '';
                      	if(me.selectAll.prop('checked')){
			    			selectAllClass = 'agent-error-tr'
			    		}
				        return '<span class="select_all_flag '+selectAllClass+'" '+'title="'+data.ipDesc+'">'+((data.ipDesc && data.ipDesc.length>16)?data.ipDesc.slice(0,16)+'...':data.ipDesc)+'</span>';
				   }
	           }],
	           preDrawCallback : function(){
	        	   me.selectedAllChecks.prop('checked',false);
	           }
			 });
			me.serverIpTable.off('click', '.userChecks,tbody>tr')
			me.serverIpTable.on('click', '.userChecks,tbody>tr' , me.modalEvent.checkTr.bind(me));
		},
		loadGroupTable : function(){
			var me = this;
			me.groupTable.find('tbody').remove();
			me.groupTable.DataTable({
				lengthChange: false, //不允许用户改变表格每页显示的记录数
//			        searching: false, //关闭搜索
		        ordering:false,
		        Info: false,//页脚信息
		        pagingType:'input',
		        language: {
					search : '',
					lengthMenu : "每页显示 _MENU_ 记录",
					zeroRecords : "没有找到分组，请到分组管理下添加！",
					info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 7 条&nbsp;&nbsp;共 _TOTAL_ 条",
					infoEmpty : "",
					infoFiltered : "(从 _MAX_ 条数据中搜索)",
					paginate : {
						first: '|<',
			            last: '>|',
			            previous: '<<',
			            next: '>>'
					}
		        }, //汉化
		        pageLength : 7, //每页显示几条数据
				destroy: true,
		        data:serverListData,
		        columns:[{
					data:null,
			    	render : function(data, type, row, meta){
			    		return '<input value="'+data.id+'" type="radio" name="groupRadio">';
					}
				},{
				   data:null,
				   render : function(data, type, row, meta){
				        return '<span title="'+data.name+'">'+data.name.slice(0,20)+(data.name.length>20?'...':'')+'</span>';
				   }
			   },{
	        	   data:null,
				   render : function(data, type, row, meta){
				   		if(!data.remark) return '';
					   return '<span title="'+data.remark+'">'+data.remark.slice(0,30)+(data.remark.length>30?'...':'')+'</span>';
				   }
	           }]
			 });
			me.group.find('.dataTables_filter').parent().parent().addClass('none');
			me.group.off('click', '.userChecks,tbody>tr')
			me.group.on('click', '.userChecks,tbody>tr' , me.modalEvent.groupCheckTr.bind(me));
		},
		isGropuCheckbox : function(rootNode){
			var me = this,groupcheck = false,//组全选标记
    			checkboxNodes = rootNode.find(':checkbox');
    			
    			/*$(checkboxNodes).each(function(i){
    				console.log(this)
    			})*/
			
		    	$.each(checkboxNodes,function(i,opt){
		    		if(i ===0 ){
		    			if($(opt).prop('checked')){
		    				groupcheck = true;
		    				return false;
		    			}
		    			if($(opt).prop('indeterminate')){
		    				groupcheck = true;
		    				return true;
		    			}
		    			return false;
		    		}
		    		if($(opt).prop('indeterminate')){
						groupcheck = false;
		    			return false;
		    		}
		    	});
	    	return groupcheck;
		},
		isGropuCheckLevel : function(rootNode){
			var me = this,groupcheck = [0,0,0],//组全选标记
    			checkboxNodes = rootNode.find(':checkbox');
			var opt = checkboxNodes[0];
			if($(opt).prop('checked')){
				groupcheck[0]++;
			}
			if($(opt).prop('indeterminate')){
				groupcheck[1]++;
			}
			if($(opt).prop('unchecked')){
				groupcheck[2]++;
			}
	    	return groupcheck;
		},
		addChildItem : function(dataItem, domItem, subIndex){	
			var me = this,
				treeView = me.treeviewByAjax.data('kendoTreeView');
			if(dataItem.moduleId && dataItem.virtual){
				me.modalLoading.removeClass('none');
				$.ajax({
	    			type : 'POST',
	    			url: basePath+"nm/personal/appAction!getCCHosts.action",
	    			dataType : 'json',
					data:{
						ccModuleIds:dataItem.moduleId
					}, 
					success : function(rs) {
						if(rs.success ){
							var dataList =  rs.data;
                            var arrOpt = [];
							$.each(dataList,function(i, opt){
								opt.title = ' ['+opt.ip+'] ['+(!!opt.alived?'Agent正常':'Agent未安装')+'] ' + opt.ipDesc;
								opt.text = ' ['+opt.ip+'] '+(!!opt.alived?'<span class="text-success">[Agent正常]</span> ':'<span class="text-danger">[Agent未安装]</span> ') + opt.ipDesc;
								arrOpt.push(opt);
							});
                            treeView.append(arrOpt, domItem);
						} else {
                            printMsg(rs.msg.message, 2);
                        }
						if(me.ajaxCountArr.length>0){
							me.ajaxCountArr[subIndex] = true;
						}else{
							me.modalLoading.addClass('none');
							me.ajaxCountArr = [];
						}
					}
				});
				dataItem.virtual = false;
			}
		} ,
		checkNodes : function(nodes, checkedNodes){
			var me= this,node;
			for (var i = 0; i < nodes.length; i++) {
				node = nodes[i];
                if (node.checked && node.ip) {
                    checkedNodes.push({
                    	alived: node.alived,
                    	ip: node.ip,
                    	source : node.source
                    });
                }
                if (node.hasChildren) {
                	me.checkNodes(node.children.view(), checkedNodes);
                }
            }
		},
		//手动添加IP
		processManually:function(){
			var me = this,ipArry,worngArr = [];
			me.serverArea.each(function(i,opt){
				worngArr = [];
				var textArea = $.trim($(opt).val());
				if(textArea){
					ipArry = textArea.replace(/^\s\s+|\s+/g,';').split(';');
					$.each(ipArry,function(i,ip){
						if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ip)){
							worngArr.push(ip);
						}
					})
					if(worngArr.length>0){
						printMsg('输入IP字符： 【'+worngArr.join(',')+'】不合法,请修改',2);
						me.platFrom.eq(i).trigger('click');
						return false;
					}
				}
			});
			if(worngArr.length>0){
				return false;
			}
			return true;
		},
		initResultTable : function(){
			var me = this,groupTip, 
				// count = me.checkIpList.length;
				// count = checkIpListAll.length;
				count = me.checkIpListFile.length;
			if(me.mode===1){
				me.modalEl.find('.serverIp-result-table').removeClass('none');
				me.serverIpResultTable.removeClass('none');
				me.btnGroup.removeClass('none');
				me.serverIpResultTable.find('tbody').remove();
				me.serverIpResultTable.dataTable({
					bLengthChange : false,
					column:'1:0',
					ordering:true,
					bFilter : true,
					// data : me.checkIpList,
					// data : checkIpListAll,
					data : me.checkIpListFile,
					language : tableLanguage,
					pageLength : 5,
					page:true,
					info:true,
					destroy: true,
					pagingType:'input',
					columns : [{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							if (row.alived === 0) {
								return '<span style="color: red;">Agent未安装</span>';
							}else if(row.alived === -1){
								return '<span style="color: red;">非法IP</span>';
							}else {
								return '<span>Agent正常</span>';
							}
						}
					},{
						data : null,
						orderable:false,
						render : function(data, type, row, meta) {
							var rs = '<button type="button" class="king-btn king-default king-btn-mini delBtn " title="删除">删除</button>';
							if(me.checkServerSetId||me.configObj.readOnly){
								rs = '<button type="button" class="king-btn king-default king-btn-mini delBtn king-disabled" title="删除">删除</button>';
							}
							return rs;
						}
					}]
				});	
				$("table.dataTable thead").attr("title","排序");
                $(".dataTables_filter input").attr("placeholder", "输入关键字过滤");
                
				if(count>0){
                    var alivedCount =0,unalivedCount = 0;
                    $.each(me.checkIpListFile,function(i,opt){
                        if(opt.alived===1){
                            alivedCount++;
                        }else{
                            unalivedCount++;
                        }
                    });
					if(me.checkServerSetId){
						groupTip ='<span class="fb">[分组]</span>';
					}else{
						groupTip = '';
					}
                    var unalivedTip = ''
                    if (unalivedCount > 0) {
                        unalivedTip  = '，<span class="text-danger">Agent未安装'+unalivedCount+'台</span>';
                    }
                    me.serverText.html('共'+count+'台，Agent正常'+alivedCount+'台' + unalivedTip + groupTip).removeClass('none');
				}else{
					me.serverText.empty().addClass('none');
				}
				if(me.checkServerSetId||me.configObj.readOnly){
					me.clearBtn.addClass('none');
					me.clearNotInstalledBtn.addClass('none');
					me.serverIpResultTable.off('click', '.delBtn');
				}else{
					me.clearBtn.removeClass('none');
					me.clearNotInstalledBtn.removeClass('none');
					me.serverIpResultTable.on('click', '.delBtn' , me.modalEvent.delOneResult.bind(me));
				}
			}else if(me.mode === 2){
				me.modalEl.find('.buttonGroup-2').removeClass('none');
				me.modalEl.find('.show-short-ip').removeClass('none');
				me.showShortIp.empty();
				me.showShortIp.find('tbody').remove();
				me.showShortIp.dataTable({
					bLengthChange : false,
					ordering:false,
					bFilter : false,
					data : me.checkIpListFile,
					language : tableLanguage,
					pageLength : 5,
					zeroRecords : false,
					page:true,
					info:true,
					destroy: true,
					pagingType:'simple',
					columns : [{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							var rs = '<button type="button" class="btnShort delBtnShort" title="删除">×</button>';
							/*if(me.checkServerSetId||me.configObj.readOnly){
								
								rs = '<button type="button" class="btnShort delBtnShort king-disabled" title="删除">×</button>';
							}else{
								rs = '<button type="button" class="btnShort delBtnShort" title="删除">×</button>';
							}*/
							return rs;
						}
					}]
				});	
				if(count>0){
					me.serveripCountLink.html('共'+count+'台').removeClass('text-no-number');
				}else{
					me.serveripCountLink.html('共0台').addClass('text-no-number');
				}
				/*if(count>0){

					if(count<= 5){
						for(var i = 0; i<count ; i++){
							// me.showShortIp.append('<li>' + me.checkIpList[i].ip+ '</li>');
							// me.showShortIp.append('<li>' + checkIpListAll[i].ip+ '</li>');
							me.showShortIp.append('<li>' + me.checkIpListFile[i].ip+ '</li>');
							me.serveripCountLink.css({left:'10px'});
						}
					}
					me.showShortIp.removeClass('none');
					me.serveripCountLink.html('共'+count+'台').removeClass('text-no-number');
					me.showModel.text('更改');
				}else{
					me.showShortIp.addClass('none');
					me.serveripCountLink.html('共0台').addClass('text-no-number');
					me.showModel.text('添加');
				}*/
				me.serverIpMode2Table.find('tbody').remove();
				me.serverIpMode2Table.DataTable({
					lengthChange: false, //不允许用户改变表格每页显示的记录数
			        searching: false, //关闭搜索
			        column:'1:0',
					ordering:true,
			        Info: false,//页脚信息
			        language: {
						search : '',
						lengthMenu : "每页显示 _MENU_ 记录",
						zeroRecords : "没有找到搜索结果",
						info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 9 条&nbsp;&nbsp;共 _TOTAL_ 条",
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
			        pagingType:'input',
					destroy: true,
			        // data:me.checkIpList,
			        // data:checkIpListAll,
			        data:me.checkIpListFile,
			        columns:[{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							if (row.alived === 0) {
								return '<span style="color: red;">Agent未安装</span>';
							}else if(row.alived === -1){
								return '<span style="color: red;">非法IP</span>';
							}else {
								return '<span>Agent正常</span>';
							}
						}
					}]
				});
				$("table.dataTable thead").attr("title","排序");
				me.showShortIp.on('click', '.delBtnShort' , me.modalEvent.delOneShortIp.bind(me));
			/*if(me.checkServerSetId||me.configObj.readOnly){
					me.showShortIp.off('click', '.delBtnShort');
				}else{
					me.showShortIp.on('click', '.delBtnShort' , me.modalEvent.delOneShortIp.bind(me));
				}*/
			}
		},
		initResultTableGroup : function(){
			var me = this,groupTip, 
				count = me.checkIpListGroup.length;
			if(me.mode===1){
				me.modalEl.find('.serverIp-result-table').removeClass('none');
				me.serverIpResultTable.removeClass('none');
				me.btnGroup.removeClass('none');
				me.serverIpResultTable.find('tbody').remove();
				me.serverIpResultTable.dataTable({
					bLengthChange : false,
					column:'1:0',
					ordering:true,
					bFilter : true,
					// data : me.checkIpList,
					// data : checkIpListAll,
					data : me.checkIpListGroup,
					language : tableLanguage,
					pageLength : 5,
					page:true,
					info:true,
					destroy: true,
					pagingType:'input',
					columns : [{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							if (row.alived === 0) {
								return '<span style="color: red;">Agent未安装</span>';
							}else if(row.alived === -1){
								return '<span style="color: red;">非法IP</span>';
							}else {
								return '<span>Agent正常</span>';
							}
						}
					},{
						data : null,
						orderable:false,
						render : function(data, type, row, meta) {
							var rs = '<button type="button" class="king-btn king-default king-btn-mini delBtn " title="删除">删除</button>';
							if(me.checkServerSetId||me.configObj.readOnly){
								rs = '<button type="button" class="king-btn king-default king-btn-mini delBtn" title="删除">删除</button>';
							}
							return rs;
						}
					}]
				});	
				$("table.dataTable thead").attr("title","排序");
                $(".dataTables_filter input").attr("placeholder", "输入关键字过滤");
				if(count>0){
                    var alivedCount =0,unalivedCount = 0;
                    if(me.checkServerSetId){
                        $.each(me.checkIpListGroup,function(i,opt){
                            if(opt.alived===1){
                                alivedCount++;
                            }else{
                                unalivedCount++;
                            }
                        });
                        groupTip ='<span class="fb">[分组]</span>';
                    }else{
                        $.each(me.checkIpListFile,function(i,opt){
                            if(opt.alived===1){
                                alivedCount++;
                            }else{
                                unalivedCount++;
                            }
                        });
                        groupTip = '';
                    }
                    var unalivedTip = ''
                    if (unalivedCount > 0) {
                        unalivedTip  = '，<span class="text-danger">Agent未安装'+unalivedCount+'台</span>';
                    }
                    me.serverText.html('共'+count+'台，Agent正常'+alivedCount+'台' + unalivedTip + groupTip).removeClass('none');
                
				}else{
					me.serverText.empty().addClass('none');
				}
				if(me.checkServerSetId||me.configObj.readOnly){
					me.clearBtn.addClass('none');
					me.clearNotInstalledBtn.addClass('none');
					me.serverIpResultTable.off('click', '.delBtn');
				}else{
					me.clearBtn.removeClass('none');
					me.clearNotInstalledBtn.removeClass('none');
					me.serverIpResultTable.on('click', '.delBtn' , me.modalEvent.delOneResult.bind(me));
				}
			}else if(me.mode === 2){
				me.modalEl.find('.buttonGroup-2').removeClass('none');
				me.modalEl.find('.show-short-ip').removeClass('none');
				me.showShortIp.empty();
				me.showShortIp.find('tbody').remove();
				me.showShortIp.dataTable({
					bLengthChange : false,
					ordering:false,
					bFilter : false,
					data : me.checkIpListGroup,
					language : tableLanguage,
					pageLength : 5,
					zeroRecords : false,
					page:true,
					info:true,
					destroy: true,
					pagingType:'simple',
					columns : [{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							var rs = '<button type="button" class="btnShort delBtnShort" title="分组添加不能删除">×</button>';
							/*if(me.checkServerSetId||me.configObj.readOnly){
								
								rs = '<button type="button" class="btnShort delBtnShort king-disabled" title="删除">×</button>';
							}else{
								rs = '<button type="button" class="btnShort delBtnShort" title="删除">×</button>';
							}*/
							return rs;
						}
					}]
				});	


				if(count>0){
					me.serveripCountLink.html('共'+count+'台'+'[分组]').removeClass('text-no-number');
				}else{
					me.serveripCountLink.html('共0台').addClass('text-no-number');
				}
				me.serverIpMode2Table.find('tbody').remove();
				me.serverIpMode2Table.DataTable({
					lengthChange: false, //不允许用户改变表格每页显示的记录数
			        searching: false, //关闭搜索
			        column:'1:0',
					ordering:true,
			        Info: false,//页脚信息
			        language: {
						search : '',
						lengthMenu : "每页显示 _MENU_ 记录",
						zeroRecords : "没有找到搜索结果",
						info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 9 条&nbsp;&nbsp;共 _TOTAL_ 条",
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
			        pagingType:'input',
					destroy: true,
			        data:me.checkIpListGroup,
			        columns:[{
						data : "ip"
					},{
						data : null,
						render : function(data, type, row, meta) {
							if (row.alived === 0) {
								return '<span style="color: red;">Agent未安装</span>';
							}else if(row.alived === -1){
								return '<span style="color: red;">非法IP</span>';
							}else {
								return '<span>Agent正常</span>';
							}
						}
					}]
				});
				$("table.dataTable thead").attr("title","排序");
				if(me.checkServerSetId||me.configObj.readOnly){
					me.showShortIp.off('click', '.delBtnShort');
				}else{
					me.showShortIp.on('click', '.delBtnShort' , me.modalEvent.delOneShortIp.bind(me));
				}
			}
		},
		setValue : function(data){
			var me = this,ips=[],ipsAll=[];
			var meCheckIpList=me.checkIpList;
			// $.each(meCheckIpList,function(i,list){
			// 	console.log("1");
			// 	$.each(checkIpListAll,function(j,all){
			// 		console.log("2");
			// 		if(list.ip === all.ip){
			// 			meCheckIpList.pop(list);
			// 		}
			// 	});
			// });
			// $.each(meCheckIpList,function(i,List){
			// 	checkIpListAll.push(List);
			// });

			// if (meCheckIpList.length>0 && checkIpListAll.length>0) {
			if (meCheckIpList.length>0 && me.checkIpListFile.length>0) {
				// var arrCheckIpList=checkIpListAll.concat(meCheckIpList);
				var arrCheckIpList=me.checkIpListFile.concat(meCheckIpList);
				var tmp={};
				var newArr=[];
				for(var i=0,len=arrCheckIpList.length;i<len;i++){
					var obj=arrCheckIpList[i];
					var ip=obj.ip;
					var source=obj.source;
					if (!tmp[ip+source]) {
						newArr.push(obj);
						tmp[ip+source]=obj;
					}
				}
				// checkIpListAll=newArr;
				me.checkIpListFile=newArr;
			// }else if (meCheckIpList.length>0 && checkIpListAll.length<1){
			}else if (meCheckIpList.length>0 && me.checkIpListFile.length<1){
				for (var k = 0; k < meCheckIpList.length; k++) {
			  	// checkIpListAll.push(meCheckIpList[k]);
			  	me.checkIpListFile.push(meCheckIpList[k]);
			  }
			} 
			// checkIpListAll=me.checkIpList;
			// me.serveripInput.data('ipList', me.checkIpList);
			// me.serveripInput.data('ipList', checkIpListAll);
			me.serveripInput.data('ipList', me.checkIpListFile);
			// $.each(me.checkIpList,function(i,opt){
			// $.each(checkIpListAll,function(i,opt){
			$.each(me.checkIpListFile,function(i,opt){
				ips.push(opt.source+':'+opt.ip);
			});
			if(ips.length>0){
				me.serveripInput.val(ips.join(','));
			}else{
				me.serveripInput.val(null);
			}
			me.serverSetId.val(me.checkServerSetId);
			if(me.configObj && typeof me.configObj.ipOnChange =='function'){
				me.configObj.ipOnChange(me.serveripInput.val(),ips.length);
			}
			if(me.configObj.ccEnable){
				me.ccName.val(0);
				me._ccReset();
			}
		},
		setValueGroup : function(data){
			var me = this,ips=[],ipsAll=[];
			var meCheckIpList=me.checkIpList;
			me.checkIpListGroup=[];
			me.checkIpListFile=[];
			if (meCheckIpList.length>0) {
				for (var k = 0; k < meCheckIpList.length; k++) {
				  	me.checkIpListGroup.push(meCheckIpList[k]);
				  }
			}
            
			me.serveripInput.data('ipList', me.checkIpListGroup);
			$.each(me.checkIpListGroup,function(i,opt){
				ips.push(opt.source+':'+opt.ip);
			});
			if(ips.length>0){
				me.serveripInput.val(ips.join(','));
			}else{
				me.serveripInput.val(null);
			}
			me.serverSetId.val(me.checkServerSetId);
			if(me.configObj && typeof me.configObj.ipOnChange =='function'){
				me.configObj.ipOnChange(me.serveripInput.val(),ips.length);
			}
			if(me.configObj.ccEnable){
				me.ccName.val(0);
				me._ccReset();
			}
		},
		setccValue : function(data){
			var me = this,scriptId,ccName,ccParam;
			if(data){
				scriptId = data.ccScriptId||0;
				ccName = data.ccScriptName||'';
				ccParam = data.ccScriptParam;
			}else{
				scriptId = me.ccName.val();
				ccName = me.ccName.find('option:selected').text();
				ccParam = me.ccParam.val();
			}
			if(!scriptId) return;
			
            if(me.configObj.ccEnable){
    			me.ccRsId.val(scriptId);
    			me.ccRsName.text(ccName||'');
    			me.ccRsParam.text(ccParam||'');
    			me.ccNoRsParam.text(ccParam==''?'无':'');
    			me.ccResultBox.removeClass('none');
            }
			me.checkIpList = [];
			me.serveripInput.val(null);
			me.serverSetId.val(0);
			if(me.mode==1){
				me.serverIpResultTable.off('click', '.delBtn');
				me.modalEl.find('.server-text').addClass('none');
				me.modalEl.find('.serverIp-result-table').addClass('none');
				me.btnGroup.addClass('none');
                if(me.configObj.ccEnable){
				    me.ccResultBox.find('.cc-showModel').addClass('none');
                }
			}
			if(me.mode==2){
				me.showShortIp.off('click', '.delBtnShort');
				me.modalEl.find('.buttonGroup-2').addClass('none');
			}	
			if(me.configObj && typeof me.configObj.ccOnChange =='function'){
				me.configObj.ccOnChange();
			}
		},
//		getValue : function(){
//			return me.serveripInput.val();
//		},
		reset : function(){
			var me = this;
			me.checkIpList = []; 
			me.checkServerSetId = 0;
			me.ajaxCountArr = [];
			me.selectedAllChecks.prop('checked',false);
			me.selectAll.prop('checked',false);
			me.group.find('input[name=groupRadio]').prop('checked',false);
		}
	}
	$.fn.createServerIp = function(options){	
		if(!templateEl) return;
		var _this = $(this),that,
			defaults = {
				width: '650px',
				mode : 1,
			    ipListString:null,
			    serverSetId:0,
			    readOnly :false,
			    mini:false,
			    ccEnable : false,
			    ipOnChange : function(){},
			    ccOnChange : function(){}
			},
			_configObj = $.extend({}, defaults, options);  
		var serverIp = new ServerIp(_this,_configObj);
			serverIp.create(_this,_configObj);
		
		that = {
			element :  _this
		}
		return that;
	}	
})(jQuery);