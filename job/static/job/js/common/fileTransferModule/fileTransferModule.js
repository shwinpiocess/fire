/*
 * 文件传输模块
 * */

(function($) {
	var FileModule = function(){};
	FileModule.prototype = {
		constructor : FileModule,
		create : function(config){
			var me = this;
			var _temp =['<table class="table table-bordered table-hover fileSourceTable" data-content="必填项">',
				            '<thead>',
				                '<tr style="background: #f6f8f8; border-top: 2px solid rgb(74, 155, 255) !important;">',
				                    '<th style="width: 30%;">文件列表</th>',
				                    '<th style="width: 25%;">服务器地址</th>',
				                    '<th style="width: 25%;">执行账户</th>',
				                    '<th style="width: 20%;">操作</th>',
				                '</tr>',
				            '</thead>',
				            '<tbody>',
				            '</tbody>',
				        '</table>'];
			var _blankTr = '<tr class="blankTr"><td colspan="4" style="text-align: center;">请添加源文件！<input type="hidden" class="fileSource"></td></tr>';
			_temp = _temp.join('');
			me._table = $(_temp); 
			me._tbody = me._table.find('tbody').eq(0);
			me._blankTr = $(_blankTr);
			me._fileSource = me._blankTr.find('.fileSource');
			me.readOnly = config.readOnly;
			me._tbody.append(me._blankTr);
		},
		add : function(_data, _type, isNew){
			var me = this,_tr,accountSelect,ipSelect,readOnly = me.readOnly;
			if(_type==='local'){
				//file、size
				_tr = ['<tr>',
			                '<td><input type="hidden" class="filePath"><span class="fileName"></span></td>',
			                '<td style="position: relative;"><p>本地文件&nbsp;[<span class="fileSize"></span>]</p><div class ="file-table-loadingdiv"></div></td>',
			                '<td>无</td>',
			                '<td><button class="delFile king-btn king-default king-btn-mini mt5 mb5">删除</button></td>',
			            '</tr>'];
			}else{
				//file、account、ipList
				_tr = ['<tr>',
		                '<td><input type="hidden" class="filePath"><ol class="fileDisplay f_save none text-left"></ol><div class="fileEdit f_edit"><textarea class="form-control"></textarea></div></td>',
		                '<td><div class="ipList"></div></td>',
		                '<td><div class="accountEdit f_edit"><select></select></div><span class="account f_save none"></span></td>',
		                '<td><button class="editFile f_save king-btn king-default king-btn-mini mt5 mb5 none">编辑</button><button class="saveFile f_edit king-btn king-default king-btn-mini mt5 mb5">保存</button>&nbsp;<button class="delFile king-btn king-default king-btn-mini mt5 mb5">删除</button></td>',
		            '</tr>'];
			}
			_tr =  $(_tr.join(''));
			
			if(me.accountOptions){
				accountSelect =  _tr.find('.accountEdit>select');
				accountSelect.append(me.accountOptions)
			}
			if(_data && typeof _data === 'object' && _data.file){
				if(_type==='local'){
					var startIndex = -1;
					if(_data.file.lastIndexOf('/') !=-1){
						startIndex = _data.file.lastIndexOf('/');
					}else if (_data.file.lastIndexOf('\\') !=-1){
						startIndex = _data.file.lastIndexOf('\\');
					}
					_tr.find('.filePath').val(_data.file);
					_tr.find('.fileName').text(_data.file.slice(startIndex+1));
					_tr.find('.fileSize').text(_data.size);
					if(!isNew){
						_tr.find('.file-table-loadingdiv').css({'width':'100%','background-color':"#5cb85c",'border': '1px solid #398439'}).text('完成');
					}
				}else{
					_tr.find('.filePath').val(_data.file);
					_tr.find('.ipList').createServerIp({
						mode:2,
						serverSetId : _data.serverSetId,
						ipListString : _data.ipListStatus,
						ccScriptId : _data.ccScriptId || 0,
		            	ccScriptParam : _data.ccScriptParam,
		            	ccScriptName : _data.ccScriptName
					});
					_tr.find('.account').text(_data.account);
					$.each(_data.file.split(','),function(i,opt){
						_tr.find('.fileDisplay').append('<li style="word-break: break-word;">'+opt+'</li>');
					});
					_tr.find('.fileEdit>textarea').val(_data.file.split(',').join('\n'));
					_tr.find('.accountEdit>select').val(_data.account)
					
					_tr.find('.f_save').removeClass('none');
					_tr.find(".show-short-ip").addClass("delOnly");
					
					_tr.find('.f_edit').addClass('none');
					_tr.find('.showModel').addClass('none');
				}
			}else{
				_tr.find('.ipList').createServerIp({mode:2});
			}
			if(!me._blankTr.hasClass('none')){
				me._blankTr.addClass('none');
			}
			if(me.readOnly){
				_tr.find('.delFile,.editFile,.saveFile').addClass('king-disabled');
				_tr.find('.showModel').addClass('none');
			}else{
				//绑定事件
				_tr.find('.delFile').on('click',{tr:_tr} ,me.del);
				_tr.find('.editFile').on('click',{tr:_tr} ,me.edit);
				_tr.find('.saveFile').on('click',{
					tr:_tr,
					fileSource:me._fileSource,
					tbody : me._tbody 
				} ,me.save);
				_tr.find('.fileEdit>textarea').on('keyup',function(){
					if(validSourceFileList){
						validSourceFileList($(this));
					}
				});
				_tr.find('.accountEdit>select').on('change',function(){
					if($(this).val()){
						$(this).next().find('.chosen-single').css('border','1px solid #ddd')
					}else{
						$(this).next().find('.chosen-single').css('border','1px solid red');
						return false;
					}
				});
			}
			me._tbody.append(_tr);
			accountSelect.chosen({width:'100%'});
			
			return _tr;
		},
		del : function(e){
			e.preventDefault();
			var _tr = e.data.tr,
				siblings = _tr.siblings(),
				jqXHR = e.data.jqXHR;
				console.log(e);
			if(jqXHR){
				jqXHR.abort();
			}
			_tr.remove();
			if(siblings.length==1&&siblings.hasClass('blankTr')){
				siblings.removeClass('none');
			}
		},
		edit : function(e){
			e.preventDefault();
			var _tr = e.data.tr;
			_tr.find('.f_save').addClass('none');
			_tr.find(".show-short-ip").removeClass("delOnly");
			_tr.find('.f_edit').removeClass('none');
			_tr.find('.showModel').removeClass('none');
//			_tr.find('.serverip-count-link').css({left:'10px'});
		},
		save : function(e){
			e.preventDefault();
			var _tr = e.data.tr,
				_fileSource = e.data.fileSource,
				_tbody= e.data.tbody,
				_filePath = _tr.find('.filePath'),
				_fileDisplay = _tr.find('.fileDisplay'),
				_fileEdit = _tr.find('.fileEdit>textarea'),
				_ipList = _tr.find('.ipList'),
				_serverSetId = _ipList.find('.hidden-serverSetId-mode2'),
				_serverip = _ipList.find('.hidden-serverip-mode2'),
				_accountEdit = _tr.find('.accountEdit>select'),
				_account = _tr.find('.account'),
				_ccScriptId = _tr.find('.cc-scriptId');
				_editFile = _tr.find('.editFile'),
				_saveFile = _tr.find('.saveFile');
			var textarea,rs=[];
			if(validSourceFileList && (textarea = validSourceFileList(_fileEdit))){
				_filePath.val(textarea.join(','));
				_fileDisplay.empty();
				$.each(textarea,function(i,opt){
					_fileDisplay.append('<li style="word-break: break-word;">'+opt+'</li>');
				});
			}else{
				_filePath.val(null);
				return false;
			}
			if(!(_serverSetId.val()||_serverip.val()||_ccScriptId.val())||(_serverip.val()<1)){
				printMsg('请添加服务器！',2);
				return false;
			}
			if(_accountEdit.val()){
				_accountEdit.next().find('.chosen-single').css('border','1px solid #ddd');
				_account.text(_accountEdit.val())
			}else{
				_accountEdit.next().find('.chosen-single').css('border','1px solid red');
				return false;
			}
			_tr.find('.f_save').removeClass('none');
			_tr.find(".show-short-ip").addClass("delOnly");
			_tr.find('.f_edit').addClass('none');
			_tr.find('.showModel').addClass('none');
//			_tr.find('.serverip-count-link').css({left:'20px'});
			$.each(_tbody.children('tr:not(.blankTr)'),function(i,opt){
				var _tr = $(opt);
				if($(opt).find('.fileName').length>0){//本地
					rs.push({
						file : $(opt).find('.filePath').val(),
						size : $(opt).find('.fileSize').text()
					})
				}else{//远程
					if($(opt).find('.f_edit').hasClass('none')){
						rs.push({
							file : $(opt).find('.filePath').val(),
							ipList : $(opt).find('.hidden-serverip-mode2').val(),
							serverSetId : $(opt).find('.hidden-serverSetId-mode2').val(),
							account : $(opt).find('.account').text(),
							ccScriptId : $(opt).find('.cc-scriptId').val() || 0,
						    ccScriptParam : $.trim($(opt).find('.cc-param-hidden').text())
						});
					}else{
						rs=[];
						return false;
					}
				}
			});
			_fileSource.val(JSON.stringify(rs));
		},
		updateLocalTr : function(_tr, _data){
			var me = this;
			var percent = _data.percent;
			if(_data.percent==100){
				_tr.find('.filePath').val(_data.fileName);  
				_tr.find('.file-table-loadingdiv').css({'width':'100%','background-color':"#5cb85c",'border': '1px solid #398439'}).text('完成');
				me._fileSource.val(JSON.stringify(me.getValue()));
			}else{
				if(95<percent&&percent<100){
					_tr.find('.file-table-loadingdiv').css({'width':'95%'}).text('95%');
				} else{
					_tr.find('.file-table-loadingdiv').css({'width':_data.percent+'%'}).text(_data.percent+'%');
				}
			}
		},
		getAllFileName : function(){
			var me = this,rs = [];
			$.each(me._tbody.find('.fileName'),function(i,opt){
				rs.push($(opt).text());
			});
			return rs;
		},
		setValue : function(data){
			var me = this;
			if(data && data instanceof Array){
				me._fileSource.val(JSON.stringify(data));
				for(var i= 0;i< data.length;i++){
					if(data[i].ipList||data[i].serverSetId||data[i].ccScriptId){
						me.add(data[i]);
					}else{
						me.add(data[i],'local');
					}
				}
			}
		},
		getValue : function(){
			var me = this,rs=[];
			$.each(me._tbody.children('tr:not(.blankTr)'),function(i,opt){
				var _tr = $(opt);
				if(_tr.find('.fileName').length>0){//本地
					rs.push({
						file : _tr.find('.filePath').val(),
						size : _tr.find('.fileSize').text()
					})
				}else{//远程
					if(_tr.find('.f_edit').hasClass('none')){
						rs.push({
							file : $(opt).find('.filePath').val(),
							ipList : $(opt).find('.hidden-serverip-mode2').val(),
							serverSetId : $(opt).find('.hidden-serverSetId-mode2').val(),
							account : $(opt).find('.account').text(),
							ccScriptId : $(opt).find('.cc-scriptId').val() || 0,
						    ccScriptParam : $.trim($(opt).find('.cc-param-hidden').text())
						});
					}else{
						rs=[];
						return false;
					}
				}
			});
			return rs;
		},
		validFileNameRepeat : function(_rs){
			var fileNameList=[],repeat=[];
			$.each(_rs,function(i,opt){
				var file = opt.file,
				fileList = file.split(',');
				for(var j=0;j<fileList.length;j++){
					var startIndex = -1;
					if(fileList[j].lastIndexOf('/') !=-1){
						startIndex = fileList[j].lastIndexOf('/');
					}else if (fileList[j].lastIndexOf('\\') !=-1){
						startIndex = fileList[j].lastIndexOf('\\');
					}
					fileNameList.push(fileList[j].slice(startIndex+1));
				}
			});
			for(var i=0;i< fileNameList .length;i++){
				var name = fileNameList[i];
				fileNameList.splice(i,1);
				if(fileNameList.indexOf(name)!=-1&&repeat.indexOf(name)==-1){
					repeat.push(name);
				}
				i--;
			}
			return repeat; 
		}
	};
	var accountOptions = (function(scope){
		var me = scope;
		$.ajax({
			type : 'post',
			url : basePath+'nm/components/accountAction!searchAccountList.action',
			dataType:'json',
			async : false,
			success:function(result){
				var data = result.data;
				if(data){
					 var inner = '<option></option>';
					 for(var i=0;i< data.length;i++){
						 inner += '<option value="'+data[i].account+'">'+data[i].account+'</option>';                    
					 };
					 me.accountOptions = inner;
				}
			}
		});
	})(FileModule.prototype);
	//添加文件
	//addFile(type,data)
	
	//create()
	
	$.fn.fileTransferModule = function(options) {
		var _this = $(this), that;
			defaults = {
				readOnly : false
			},
			_configObj = $.extend({}, defaults, options);
		var fileModule = new FileModule();
		fileModule.create(_configObj);
		
		_this.append(fileModule._table);
		
		that = {
			table : fileModule._table,
			tbody : fileModule._tbody,
			fileSource : fileModule._fileSource,
			getAllFileName : function(){
				return fileModule.getAllFileName();
			},
			add : function(_data,_type,jqXHR){
				var _tr = fileModule.add(_data,_type,true);
				if(jqXHR){
					_tr.find('.delFile').off('click');
					_tr.find('.delFile').on('click',{tr:_tr,jqXHR:jqXHR} ,fileModule.del);
				}
			},
			updateLocalTr : function(_data,percent){
				$.each(fileModule._tbody.find('.fileName'),function(i,opt){
					if(_data.fileName.indexOf($(opt).text())!=-1){
						fileModule.updateLocalTr($(opt).parentsUntil('tr').parent(),_data);
						return false;
					}
				});
			},
			setValue : function(_data){
				fileModule.setValue(_data);
			},
			getValue : function(){
				return fileModule.getValue();
			},
			validFileNameRepeat : function(_data){
				return fileModule.validFileNameRepeat(_data);
			},
			fail : function(_fileName){
				$.each(fileModule._tbody.find('.fileName'),function(i,opt){
					if(_fileName.indexOf($(opt).text())!=-1){
						$(opt).parentsUntil('tr').parent().find('.delFile').trigger('click');
						return false;
					}
				});
			}
		}
		return that;
	}
})(jQuery);