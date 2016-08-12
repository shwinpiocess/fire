(function($) {
	function getCCScriptCode(codeMirrorObject) {
        codeMirrorObject.temps.SHELL = function(){
            var shell = [];
                shell.push('#!/bin/bash', '',
                        '# 单一或组合使用如下定义的CC原生脚本、任意指定查询参数、即可获取到所需要的CC配置数据',
                        '# 请确保查询结果中有且仅有一列的标题为InnerIP（位置不限）',
                        '# 请确保涉及CC的key（也就是CC各属性字段名）及其value的大小写正确',
                        '# 请确保输出查询结果时各列以制表符（tab）分隔',
                        '',
                        '# CC original query shell script',
                        '',
                        '# 路径请不要修改',
                        'CCSHPATH="/usr/local/tms_cc/queryScript"',
                        'CCSERVNAME="【CC业务名】"',
                        '# 查询主机',
                        'GETHOST="$CCSHPATH/tms_getHostList.sh -a=$CCSERVNAME"',
                        '# 查询业务',
                        'GETAPP="$CCSHPATH/tms_getAppList.sh"',
                        '# 查询业务模块',
                        'GETMODULE="$CCSHPATH/tms_getAppModuleList.sh -a=$CCSERVNAME"',
                        '# 查询分布模块',
                        'GETTOPOMODULE="$CCSHPATH/tms_getTopoModuleList.sh -a=$CCSERVNAME"',
                        '# 查询set列表',
                        'GETSET="$CCSHPATH/tms_getTopoSetList.sh -a=$CCSERVNAME"',
                        '# 查询set属性',
                        'GETSETPROPERTY="$CCSHPAH/tms_getSetProperty.sh -a=$CCSERVNAME"',
                        '# 查询模块属性',
                        'GETMODULEPROPERTY="$CCSHPATH/tms_getModuleProperty.sh -a=$CCSERVNAME"',
                        '# 查询主机属性',
                        'GETHOSTPROPERTY="$CCSHPATH/tms_getHostProperty.sh -a=$CCSERVNAME"',
                        '',
                        '# my query method here...', '');
                return shell.join('\n');
        }();
    }
    function getDefaultScriptCode(codeMirrorObject) {
        codeMirrorObject.temps.SHELL = function(){
            var shell = [];
                shell.push('#!/bin/bash', '',
                        'anynowtime="date +\'%Y-%m-%d %H:%M:%S\'"',
                        'NOW="echo [\\`$anynowtime\\`][PID:$$]"', '',
                        '#####可在脚本开始运行时调用，打印当时的时间戳及PID。', 'function job_start',
                        '{', '    echo "`eval $NOW` job_start"', '}', '',
                        '#####可在脚本执行成功的逻辑分支处调用，打印当时的时间戳及PID。',
                        'function job_success', '{', '    MSG="$*"',
                        '    echo "`eval $NOW` job_success:[$MSG]"',
                        '    exit 0', '}', '',
                        '#####可在脚本执行失败的逻辑分支处调用，打印当时的时间戳及PID。',
                        'function job_fail', '{', '    MSG="$*"',
                        '    echo "`eval $NOW` job_fail:[$MSG]"', '    exit 1',
                        '}', '', 'job_start', '', '######可在此处开始编写您的脚本逻辑代码',
                        '######作业平台中执行脚本成功和失败的标准只取决于脚本最后一条执行语句的返回值',
                        '######如果返回值为0，则认为此脚本执行成功，如果非0，则认为脚本执行失败', '');
                return shell.join('\n');
        }();
    }
	var codeMirrorObject = { 
		editor : null,
		modes : [ 'text/x-sh', 'text/plain', 'text/x-perl', 'text/x-python' ],
		temps : {
			SHELL : function() {
				var shell = [];
				shell.push('#!/bin/bash', '',
						'anynowtime="date +\'%Y-%m-%d %H:%M:%S\'"',
						'NOW="echo [\\`$anynowtime\\`][PID:$$]"', '',
						'#####可在脚本开始运行时调用，打印当时的时间戳及PID。', 'function job_start',
						'{', '    echo "`eval $NOW` job_start"', '}', '',
						'#####可在脚本执行成功的逻辑分支处调用，打印当时的时间戳及PID。',
						'function job_success', '{', '    MSG="$*"',
						'    echo "`eval $NOW` job_success:[$MSG]"',
						'    exit 0', '}', '',
						'#####可在脚本执行失败的逻辑分支处调用，打印当时的时间戳及PID。',
						'function job_fail', '{', '    MSG="$*"',
						'    echo "`eval $NOW` job_fail:[$MSG]"', '    exit 1',
						'}', '', 'job_start', '', '######可在此处开始编写您的脚本逻辑代码',
						'######作业平台中执行脚本成功和失败的标准只取决于脚本最后一条执行语句的返回值',
						'######如果返回值为0，则认为此脚本执行成功，如果非0，则认为脚本执行失败', '');
				return shell.join('\n');
			}(),
			BAT : function() {
				return '';
			}(),
			PERL : function() {
				var perl = [];
				perl.push(
					'#!/usr/bin/perl',
					'',
					'use strict;',
					'',
					'sub job_localtime {',
					'    my @n = localtime();',
					'    return sprintf("%04d-%02d-%02d %02d:%02d:%02d",$n[5]+1900,$n[4]+1,$n[3], $n[2], $n[1], $n[0] );',
					'}',
					'',
					'#####可在脚本开始运行时调用，打印当时的时间戳及PID。',
					'sub job_start {',
					'    print "[",&job_localtime,"][PID:$$] job_start\\n";',
					'}',
					'',
					'#####可在脚本执行成功的逻辑分支处调用，打印当时的时间戳及PID。',
					'sub job_success {',
					'    print "[",&job_localtime,"][PID:$$] job_success:[@_]\\n";',
					'    exit 0;',
					'}',
					'',
					'#####可在脚本执行失败的逻辑分支处调用，打印当时的时间戳及PID。',
					'sub job_fail {',
					'    print "[",&job_localtime,"][PID:$$] job_fail:[@_]\\n";',
					'    exit 1;', '}', '', 'job_start;', '',
					'######可在此处开始编写您的脚本逻辑代码',
					'######iJobs中执行脚本成功和失败的标准只取决于脚本最后一条执行语句的返回值',
					'######如果返回值为0，则认为此脚本执行成功，如果非0，则认为脚本执行失败', '');
				return perl.join('\n');
			}(),
			PYTHON : function() {
				var python = [];
				python.push(
					'#!/usr/bin/env python',
					'# -*- coding: utf8 -*-',
					'',
					'import datetime',
					'import os',
					'import sys',
					'',
					'def _now(format="%Y-%m-%d %H:%M:%S"):',
					'    return datetime.datetime.now().strftime(format)',
					'',
					'#####可在脚本开始运行时调用，打印当时的时间戳及PID。',
					'def job_start():',
					'    print "[%s][PID:%s] job_start" % (_now(), os.getpid())',
					'',
					'#####可在脚本执行成功的逻辑分支处调用，打印当时的时间戳及PID。',
					'def job_success(msg):',
					'    print "[%s][PID:%s] job_success:[%s]" % (_now(), os.getpid(), msg)',
					'    sys.exit(0)',
					'',
					'#####可在脚本执行失败的逻辑分支处调用，打印当时的时间戳及PID。',
					'def job_fail(msg):',
					'    print "[%s][PID:%s] job_fail:[%s]" % (_now(), os.getpid(), msg)',
					'    sys.exit(1)', '',
					'if __name__ == \'__main__\':', '',
					'    job_start()', '',
					'######可在此处开始编写您的脚本逻辑代码',
					'######iJobs中执行脚本成功和失败的标准只取决于脚本最后一条执行语句的返回值',
					'######如果返回值为0，则认为此脚本执行成功，如果非0，则认为脚本执行失败', '');
				return python.join('\n');
			}()
		},
		base64encode : function(str) {
			if (str.length === 0) {
				return ''
			}
			var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1,
					-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
					-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
					-1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56,
					57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3,
					4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
					20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28,
					29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
					44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

			var base64encode = function(str) {
				var out, i, len;
				var c1, c2, c3;

				len = str.length;
				i = 0;
				out = "";
				while (i < len) {
					c1 = str.charCodeAt(i++) & 0xff;
					if (i == len) {
						out += base64EncodeChars.charAt(c1 >> 2);
						out += base64EncodeChars.charAt((c1 & 0x3) << 4);
						out += "==";
						break;
					}
					c2 = str.charCodeAt(i++);
					if (i == len) {
						out += base64EncodeChars.charAt(c1 >> 2);
						out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
								| ((c2 & 0xF0) >> 4));
						out += base64EncodeChars.charAt((c2 & 0xF) << 2);
						out += "=";
						break;
					}
					c3 = str.charCodeAt(i++);
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt(((c1 & 0x3) << 4)
							| ((c2 & 0xF0) >> 4));
					out += base64EncodeChars.charAt(((c2 & 0xF) << 2)
							| ((c3 & 0xC0) >> 6));
					out += base64EncodeChars.charAt(c3 & 0x3F);
				}
				return out;
			}
			var utf16to8 = function(str) {
				var out, i, len, c;

				out = "";
				len = str.length;
				for (i = 0; i < len; i++) {
					c = str.charCodeAt(i);
					if ((c >= 0x0001) && (c <= 0x007F)) {
						out += str.charAt(i);
					} else if (c > 0x07FF) {
						out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
						out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
						out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
					} else {
						out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
						out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
					}
				}
				return out;
			}
			return base64encode(utf16to8(str));
		},
		setValue : function(type){
			this.editor.setValue(type);
			
		},
		setMode : function(mode) {
			this.editor.setOption('mode', mode);
		},
		changeType : function(type,$curDom) {
			$curDom.find('.hidden-scriptCodeType').val(type);
			switch (type) {
			case '1':
				this.setMode(this.modes[0]);
				this.setValue(this.temps.SHELL);
				break;
			case '2':
				this.setMode(this.modes[1]);
				this.setValue(this.temps.BAT);
				break;
			case '3':
				this.setMode(this.modes[2]);
				this.setValue(this.temps.PERL);
				break;
			case '4':
				this.setMode(this.modes[3]);
				this.setValue(this.temps.PYTHON);
				break;
			default:
				break;
			}
		},
		createCodeMirroe : function($curDom,configObj) {		
			var me = this;
			var node = $curDom.find('.code-cont-text');
			var selectType1 = $curDom.find('input[name="codeType"]');
			$(selectType1).on('click', function() {
				me.changeType($(this).val(),$curDom)
			});
			var tips = $('<span class="priview-span ps1" data-toggle="tooltip" data-placement="right" title="请确保脚本为非交互式脚本，并且在本地调测通过。"><i class="fa fa-question-circle"></i></span>');
			$curDom.append(tips);
			tips.css({'position':'absolute','left':configObj.width,'top':0});
			tips.tooltip();
			if (node && 'TEXTAREA' === node[0].tagName) {
				this.editor = CodeMirror.fromTextArea(node[0], {
					theme : 'erlang-dark',
					lineNumbers : true,
					styleActiveLine : true,
					matchBrackets : true,
					readOnly:configObj.readOnly,
					extraKeys: {
				        "F11": function(cm) {
				         if(configObj.beforeFullscreen){
				        	 configObj.beforeFullscreen($curDom,cm);	
				         }
				          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
				          var escTip =  $('<div class="escTip red" style="z-index:3001;font-size:16px;position: fixed;top: 10px;left:50%;text-align: center;opacity: 1;font-weigth:bold;background-color: #fff;padding:5px;width:400px;margin-left:-200px;">您现在处于全屏模式，按&nbsp;<img src="./img/Esc.png" style="padding-bottom: 4px;">&nbsp;键可以退出全屏！</div>');
				          if(cm.getOption("fullScreen")){
				        	  $(document.body).append(escTip);
				        	  escTip.animate({
				        		  opacity : '0'
				        	  },5000,function(){
				        		  escTip.remove();
				        	  });
				          }else{
				        	  $(document.body).find('.escTip').stop().remove();
				          }
				        },
				        "Esc": function(cm) {
				         if(configObj.beforeEsc){
					        	 configObj.beforeEsc($curDom,cm);	
					     }
				          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
				          $(document.body).find('.escTip').stop().remove();
				        }
				      }
				});				
				this.changeType('1',$curDom);
			}
		}
	};
	
	function inherit(p){ 
		function f(){};
		f.prototype = p;
		return new f();
	}
 
	
	$.fn.codeMirror = function(options){ 
		var defaults = {
				width : '700px', 
			    readOnly :false,
			    shellOnly : false
		}		
		var configObj = $.extend({}, defaults, options);
		
		var $this = $(this);
		var chil = $this.children();
		if(chil && chil.length>0){
			$this.children().remove();
		}		
		var disabled ='';
		if(configObj && configObj.readOnly){
			disabled='disabled';
		}
        
		var htmltemp = '<input class="hidden-scriptCodeType" type="hidden"><input class="hidden-scriptCode-content" type="hidden"><div class="code-title" style="width:'+configObj.width+';"><div class="code-type">';
            if (configObj && configObj.shellOnly) {
                htmltemp+='<label class="radio-inline"><input type="radio" value="1" name="codeType" checked="checked" disabled>shell</label>';
                getCCScriptCode(codeMirrorObject);
            }else {
                htmltemp+='<label class="radio-inline"><input type="radio" value="1" name="codeType" checked="checked" '+disabled+'>shell</label>';
    			htmltemp+='<label class="radio-inline"><input type="radio"value="2" name="codeType" '+disabled+'>bat</label>';
    			htmltemp+='<label class="radio-inline"><input type="radio" value="3" name="codeType" '+disabled+'>perl</label>';
    			htmltemp+='<label class="radio-inline"><input type="radio" value="4" name="codeType" '+disabled+'>python</label>';
                getDefaultScriptCode(codeMirrorObject);
            }
			htmltemp+='<span class="code-fullscreen" title="全屏"></span></div></div><div style="width:'+configObj.width+';height:300px;" class="code-cont"><textarea class="code-cont-text" name="codeCont"></textarea></div>';
		
			if($this.length) $this = $this.eq(0);
			$this.append(htmltemp);	
	 
		var codeMir = inherit(codeMirrorObject);
		
		codeMir.createCodeMirroe($this,configObj);
        
        var codeVlaue = codeMir.editor ? codeMir.editor.getValue() : '';
		$this.find('.hidden-scriptCode-content').val(codeMir.base64encode(codeVlaue));
        
		codeMir.editor.on("change", function(){ 
			var codeVlaue = codeMir.editor ? codeMir.editor.getValue() : '';
			$this.find('.hidden-scriptCode-content').val(codeMir.base64encode(codeVlaue));
		});
		$this.on('click','.code-cont',function(){
			if($(this).popover){
				$(this).popover('hide');
			}
		});
		$this.on('click','.code-fullscreen',function(){
			if(configObj.beforeFullscreen){
	        	 configObj.beforeFullscreen($this,codeMir.editor);	
	        }
			codeMir.editor.setOption("fullScreen", !codeMir.editor.getOption("fullScreen"));
			codeMir.editor.focus();
			var escTip =  $('<div class="escTip red" style="z-index:3001;font-size:16px;position: fixed;top: 10px;left:50%;text-align: center;opacity: 1;font-weigth:bold;background-color: #fff;padding:5px;width:400px;margin-left:-200px;">您现在处于全屏模式，按&nbsp;<img src="./img/Esc.png" style="padding-bottom: 4px;">&nbsp;键可以退出全屏！</div>');
	         $(document.body).append(escTip);
	         escTip.animate({
	        	 opacity : '0'
	         },5000,function(){
	        	 escTip.remove();
	         });
		});
		var methods = {
				setValue : function(type){
					codeMir.editor.setValue(type); 
					$this.find('.hidden-scriptCode-content').val(codeMir.base64encode(type));
				},
				getRawValue: function(){
					var codeVlaue = codeMir.editor ? codeMir.editor.getValue() : '';
			        return codeVlaue;
			    },
			    getValue: function(){
			    	var codeVlaue = codeMir.editor ? codeMir.editor.getValue() : '';
			        return codeMir.base64encode(codeVlaue);
			    },
				getType : function(){
					return $this.find('input[name="codeType"]:checked').val();
				},
                setType : function(type){
                    if(!type)return false;
                    $this.find('.hidden-scriptCodeType').val(type); 
                    $.each($this.find('input[name="codeType"]'),function(i,opt){
                        $(opt).prop("checked", function( i, val ) {
                          return type==$(opt).val();
                        });
                        if($(opt).prop("checked")){
                        	window.setTimeout(function(){
                        		codeMir.setMode(codeMir.modes[parseInt($(opt).val())-1]);
                        	}, 100);
                        }
                    })
                   
                }
		}
		return methods;
	}
})(jQuery);
