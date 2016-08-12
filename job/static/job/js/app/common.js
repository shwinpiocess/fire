var statueColor = [];
statueColor[1] = 'label-default';
statueColor[2] = 'label-primary';
statueColor[3] = 'label-success';
statueColor[4] = 'label-danger';
statueColor[6] = 'label-warning';
statueColor[7] = 'label-info';
var currentPage;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix){
    return this.slice(0, prefix.length) === prefix;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

/**
 * 本文件定义一些通用的方法 
 */

$.ajaxSetup({
	type : 'POST', //默认请求方式为post
	timemout : 180000, //默认请求超时时间
	beforeSend : function(xhr){
		xhr.setRequestHeader('X-CSRFToken', CsrfKey);
        xhr.setRequestHeader('APPID', APPID);
	},
	error : function(e){ //默认ajax错误时的处理
		ajaxError(e);
	}
});

/**
 * ajax出错的时候的处理
 * @param e
 */
function ajaxError(e){
    if (e.status == 998) {
//        alert('切换了业务，页面需要重新刷新！');
        window.location.reload();
    }
	if (e.status == 999) {
        var c_url = basePath + 'common/login_error.jsp';
        window.location.href=c_url;
    }else if (!e.responseText){
    	printMsg('没有操作权限', 2);
    	$.unload();
    }else{
    	printMsg('网络异常', 2);
    	$.unload();
    }
};

$.extend({
	load : function(){
		var style = "z-index: 9999;position: fixed;left:0;top:0;text-align:center;width:100%;height:100%;vertial-align:middle;";
		var html = '<div id="loading-warp" style="'+style+'"><img src="./img/loading_2_36x36.gif" style="padding-left:97px;position:absolute;top:50%;margin-top:-36px;"></div>';
		$('body').eq(0).append(html);
	},
	unload : function(){
		$('#loading-warp').remove();
	}
});

function SmoothlyMenu() {
    if ($('body').hasClass('mini-navbar')) {
        $('.king-layout6-sidebar').find('span').css('display','none');
        $('.treeview-menu').addClass('none');
    	$('.king-layout6-sidebar').css('width',62);
    	$('.king-layout6-content').css('margin-left',62);
    	$('.treeview-menu').css({
    	    position: 'absolute',
    	    top: '0',
    	    left: '62px',
    	    background: 'rgb(41, 48, 56);',
    	    width : '190px',
    	    'border-left': '0'
    	});
    } else {
    	$('.king-layout6-content').css('margin-left',230);
		$('.king-layout6-sidebar').css('width',230);
    	 $('.king-layout6-sidebar').find('span').css('display','inline-block');
	     $('.treeview-menu').removeClass('none');
	     $('.treeview-menu').css({
	    	    position: '',
	    	    top: '0',
	    	    left: '62px',
	    	    background: 'rgb(41, 48, 56);',
	    	    width : '100%',
	    	    'border-left': '3px solid #4A9BFF',
	    	    display : 'none'
	    });
	     $('.treeview.active>.treeview-menu').css({
	    	 display : 'block'
	     });
    }
    var left = parseInt($('#script-slide-panel').css('left'));
    if(left<100){
    	$('#script-slide-panel').animate({
    		left : 230
    	},300);
    }else if(left>=100 && left<300){
    	$('#script-slide-panel').animate({
    		left : 62
    	},300);
    }
}
//针对元素增加load
(function($){
	$.fn.divLoad = function(options){ 
		$this = $(this);
		$this.addClass('divLoad-parent');
		$this.find('.loading-warp').remove();
		var width = $this.css('width').replace('px','');
		var height = $this.css('height').replace('px','');
		if(options == "show"){
			var html = '<div class="loading-warp divLoad-shade"><img src="./img/loading_2_36x36.gif" style="margin-top:'+((height/2)-18)+'px"></div>';
			$this.append(html);
			$this.find('.loading-warp').css('height',height).css('width',width);
		}else if(options == "hide"){
			$this.find('.loading-warp').remove();
			$this.removeClass('divLoad-parent');
		}
	}
})(jQuery);

//简单信号量实现
simpleSemaphore = function(){
	var _sem = 0;
	return {
		get : function(){
			return _sem;
		},		
		reset : function(){
			_sem = 0;
		},		
		add : function(){			
			_sem += 1;
			console.log('add, sem=' + _sem);
		},		
		sub : function(callBack){
			_sem -= 1;
			console.log('sub, sem=' + _sem);
			if(callBack && (_sem <= 0)){
				callBack();
			}
		}
	};
};


function havePropInObj(_obj){
	var isObj = false;
	if(_obj && typeof _obj ==='object'){
		for (var prop in _obj){  
			isObj = true;  
			break;  
		}  
	}
	return isObj;
}

function createNewTab(title, url, title2, _extraObj){
	$.load();
	//获取页面扩展参数
	 var haveProp = havePropInObj(_extraObj); 
	 if (haveProp){  
    	extraObj = _extraObj;
	 }else{
    	extraObj = {};
    	if("pushState" in history){
    		var href = url;
	    	if(!((href.indexOf('#')>0 || href=='javascript:;')) && (href.indexOf('http')<0 && href.indexOf('https')<0 && href.indexOf('ftp')<0)){
	    		href = basePath+"?"+href.substr(6,href.length-10);
	    		history.pushState({ href: href }, null, href);
	    	}
    	}
     }
	//获取tab页内容
	$('.king-content').load(url,function(){
		//更新面包屑导航
		if(title&&title2){
			$('#breadcrumb-3').parent().parent().show();
			$('#breadcrumb-3').text(title);
			$('#breadcrumb-2').html('<i class="fa fa-dashboard"></i> ' + title2);
		}else{
			$('#breadcrumb-3').parent().parent().hide();
		}
		currentPage = url;
		$.unload();
	});
}
var pnotify = null;
function printMsg(msg, type){
	if(pnotify && pnotify.state !== 'closed'){
		pnotify.update({
			title:  type === 1 ? "成功":"失败",
			text: msg,
			type: type === 1 ?'success':'error'
		})
		pnotify.queueRemove();
		return false;
	}
	pnotify =  new PNotify({
		title:  type === 1 ? "成功":"失败",
		text: msg,
		addclass: 'ijobs-msg-center',
		type: type === 1 ?'success':'error',
		delay : 1000, 
		stack : {
			dir1 : "down",
			dir2 : "right",
			spacing1 : 0,
			spacing2 : 0
		},
		buttons: {
			closer: false,
			sticker: false
		}
	}); 
}
 
function confirmModal(title,msg,yesFun,noFun,yesBtnText, cancelBtnText){
	var arg = arguments;
	$('#confirmModalTitle').html(title);
	$('#confirmModalContent').html(msg);
	if(yesBtnText){
		$('#yBtn').html(yesBtnText);
	} else {
        $('#yBtn').html('确定');
    }
    if(cancelBtnText){
        $('#cBtn').html(cancelBtnText);
    } else {
        $('#cBtn').html('取消');
    }
	$('#confirmModal').modal();
	$('#yBtn').off('click');
	$('#yBtn').on('click',function(){
		if(arg[2] && typeof arg[2] === 'function'){
			yesFun();
		}
		$('#confirmModal').modal('hide');
	});
	$('#cBtn').off('click');
	$('#cBtn').on('click',function(){
		if(arg[3] && typeof arg[3] === 'function'){
			noFun();
		}
		$('#confirmModal').modal('hide');
	});
}

function confirmModal_yesNoCancel(title,msg,yesFun,noFun,cFun){
	var arg = arguments;
	$('#confirmModalTitle_yesNoCancel').html(title);
	$('#confirmModalContent_yesNoCancel').html(msg);
	$('#confirmModal_yesNoCancel').modal();
	
	$('#yBtn_yesNoCancel').off('click');
	$('#yBtn_yesNoCancel').on('click',function(){		 
		if(arg[2] && typeof arg[2] === 'function'){
			yesFun();
		}
		$('#confirmModal_yesNoCancel').modal('hide');
	});
	
	$('#nBtn_yesNoCancel').off('click');
	$('#nBtn_yesNoCancel').on('click',function(){
		if(arg[3] && typeof arg[3] === 'function'){
			noFun();
		}
		$('#confirmModal_yesNoCancel').modal('hide');
	});
	
	$('#cBtn_yesNoCancel').off('click');
	$('#cBtn_yesNoCancel').on('click',function(){
		if(arg[4] && typeof arg[4] === 'function'){
			cFun();
		}
		$('#confirmModal_yesNoCancel').modal('hide');
	});
}

function expendMenu(index,index2){
	var menus = $('.king-sidebar-menu').children('.treeview'),
		menu = menus[index];
	if(menus.length === 0){
		return false;
	}
	if(menu){
		$(menu).children('a').trigger('click');
		if(index2!='undefined'){
			var m = $(menu).find('.treeview-menu li')[index2];
			if(m){
				$(m).children('a').trigger('click');
			}
		}
	}
}

// 目标服务器校验
function validSpecialPath(value){
	if(/(\/\/|\\\\)+/.test(value)){
         return "路径中不能有重复的“/”或者“\\”";
     }             
     if(/^[a-zA-Z]{1}:(\/|\\){1}/.test(value)){//windows
    	 value = value.toLowerCase();            	 
    	 if(value.indexOf('c:\\windows\\system32') !== -1){
    		 return "windows服务器可设置的目录：除了C:\\WINDOWS\\system32之外的所有目录";
    	 }
         return true;                 
     }else if(/^\//.test(value)){//linux
        var index = value.indexOf('REGEX:');
        if(index!==-1){
            fileName = value.substring(index,value.length-1);
            value = value.substring(0,index);
        }                    
		if(/[\\]/.test(value)){
		return "路径中不能包含特殊字符“\\”";
		}
		value = value.toLowerCase();
		var  allowPath = ['usr', 'data', 'tmp', 'home', 'data1', 'data2', 'data3', 'data4', 'opt'];
		values = value.split('/');
		if(allowPath.indexOf(values[1]) === -1){
			return "linux服务器可设置的目录：/usr, /data,/tmp,/home,/data1,/data2,/data3,/data4,/opt";
		}
		return true;
        
		
     }else { 
         return '非法路径';
     }
}
// 源文件服务器目录校验
function validSourceFileList(textArea){
	if(textArea){
		var fileList = textArea.val().trim().split(/(\n|\r\n)+/g); 
		var errorStr ="";
		var fileListArray = [];
		fileList.forEach(function(item,index,array){
			errorStr = validPaths(item);
			if(!errorStr){
				return;
			}
			if(item.length>1)
				fileListArray.push(item);
		});
		if(errorStr == true){
			textArea.css('border','solid 1px #66AFDF');
			return fileListArray;
		}else{
			textArea.css('border','solid 1px red');
			return false;
		}
	}else{
		return false;
	}
}

function validPaths(value){
	if(value.indexOf(' ')!==-1){
		return "路径中不能有空格";
	}
	if(/(\/\/|\\\\)+/.test(value)){
        return "路径中不能有重复的“/”或者“\\”";
    } 
    if(/^[a-zA-Z]{1}:(\/|\\){1}/.test(value)){//windows
        return true;                 
    }else if(/^\//.test(value)){//linux
        if(/[\\]/.test(value)){
            return "路径中不能包含特殊字符“\\”";
        }
        return true;
    }else {
        return '非法路径';    
    }
}

//时间格式化为日期字符串
function createDateStr(){
	var d = new Date();
	var temp = [d.getFullYear(),d.getMonth()+1,d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds()];
	return temp.join('');
}
//htmlEncode
function htmlDecode(str){
	if(!str) return '';
	var div = $('<div></div>');
	div.html(str);
	return div.text();
}

function allTextHtmlDecode(){
	$('input[type=text],textarea').each(function(){
		var value = $(this).val();
		if(value){
			$(this).val(htmlDecode(value));
		}
	});
}

// 使屏幕滚动到当前元素节点
(function($){
	$.fn.scrollGotoHere = function(){
		var heightPx = $(this).offset().top;
		if(heightPx){
			heightPx=heightPx-150
		}
    	$('html,body').animate({scrollTop: heightPx+'px'}, 200);
	}
})(jQuery);

(function($) {
	var urls = {
	   'user':basePath+'nm/components/accountAction!searchAccountList.action',		// 登记执行账户
	   'remoteFileUser':basePath+'jobs/getUserAccountsByApp.action',	// 远程文件账户 	  
	   'ipListAndServerName':basePath+'nm/personal/appAction!getIpList.action',
	   'ipList':basePath+'nm/personal/appAction!getIpList.action',
	   'serverList':basePath+'/bk/components/searchServerSetList.action'//服务器集合
    };
	
	// 创建chosen 
    $.fn.createChosen = function(options) { 
       var me = this;
       var type = options.type;
       var defaultValue = options.defaultValue; // 默认选中
       var width = options.width;
       if(width){
    	   $(this).chosen({no_results_text:'没有您搜索的',width:width});     
       }else{
    	   $(this).chosen({no_results_text:'没有您搜索的'});   
       }
       var temp='<option></option>';
     
       $.ajax({
          url:urls[type],
          success:function(data){
        	  if ('remoteFileUser' === type){
        		  var data = eval("("+data+")")
        		  $.each(data,function(index,value){        			  
        			  temp+='<option value="'+value.id+'">'+value.accountName+'</option>'; 
        		  });
        	  }else{
        		  var data = eval("("+data+")")
                  $.each(data.data,function(index,value){
                	  if('user' === type ){
                		  if(defaultValue === value.account){
                			  temp+='<option value="'+value.account+'" selected>'+value.account+'</option>';  
                		  }else{
                			  temp+='<option value="'+value.account+'">'+value.account+'</option>';
                		  } 
                	  }else if ('fileServer' === type){            		  
                		  temp+='<option value="'+value.fileServerId+'">'+value.name+'</option>';
                	  }else if ('ipList' === type){
                		  if(defaultValue != undefined){ 
                			  defaultValue.forEach(function(defValue){
                    			  if(defValue === value.ip){
                    				  temp+='<option value="'+value.ip+'" selected>'+'['+value.ip+']'+'</option>';                    				  
                    			  }
                    		  });
                			  temp+='<option value="'+value.ip+'">'+'['+value.ip+']</option>';
                		  }else{
                			  temp+='<option value="'+value.ip+'">'+'['+value.ip+'] '+value.ipDesc+'</option>';
                		  }
                		  
                	  }else if ('serverList' === type){
                		  temp+='<option value="'+value.id+'">'+value.serverSetName+'</option>'; 
                	  }            	  
                  });        		  
        	  }
          $(me).append(temp);
          $(me).trigger("chosen:updated");
          
        }
    });
   }    
})(jQuery);

