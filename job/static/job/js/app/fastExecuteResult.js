//	快速执行脚本和快速分发文件页面的执行结果页面
$('#slideClips').on('click',function(){
	
	$('#script-slide-panel').animate({ 
	    left:$('.king-layout6-sidebar').width()
	 }, 600,function(){		 
		 $('body').css('overflow',"hidden");
		 $('#slideClips').addClass('none');		 
	 });
});
/* 执行结果-滚动条显示隐藏 start */
$("#script-slide-panel .btn-return").on('click',function (){
		$('#script-slide-panel').animate({ 
		    left:'100%'
		 }, 600 ,function (){
			 $('#slideClips').removeClass('none');
			 $('body').css('overflow',"auto");
		});
})
/* 滚动条显示隐藏 end */
var getLogContentByIp = function(ip,stepInstanceId,retryCount,searchText){
	 $('#logContent').parent().divLoad('show');	
     $.ajax({
    	  contentType:'application/x-www-form-urlencoded',
          url: basePath+"nm/jobs/taskResultAction/getLogContentByIp.action",
          dataType:'json',
          data:{
              stepInstanceId:stepInstanceId,
              retryCount : retryCount,
              ip : ip
          },
          success: function(reponseText){
        	  $('#logContent').parent().divLoad('hide');	
        	  var data = reponseText.data;
 			  var $logContent = $('#logContent');
 			  $logContent.html(null);
 			  var logContent = data.logContent; 
 			  logContent = logContent.replace(/\n/gi,'<br>')
 			  if(searchText != undefined){
 				  var regexp = '';
 				  if(searchText.indexOf('/') != -1){
 					 regexp = eval("/\\"+searchText+"/gi");
 				  }else{
 					 regexp = eval("/"+searchText+"/gi");
 				  }
 				  logContent = logContent.replace(regexp,'<span class="exe-result-Highlight">'+searchText+'</span>');
 				  $logContent.html(logContent);
 			  }else{
 				  $logContent.html(logContent);
 			  } 
          },
          error:function(){
        	  $('#logContent').parent().divLoad('hide');
          }
    });
};
var language = {
        search: '全局搜索：',
        lengthMenu: "每页显示 _MENU_ 记录",
        zeroRecords: "没找到相应的数据！",
        info: "分页 _PAGE_ / _PAGES_",
        infoEmpty: "暂无数据！",
        infoFiltered: "(从 _MAX_ 条数据中搜索)",
        paginate: {
          first: '|<',
          last: '>|',
          previous: '<<',
          next: '>>',
          copy :'复制IP'
        }
    };
 var getIpListByResultType = function(stepInstanceId,resultType,retryCount, type){
	$.ajax({
		contentType:'application/x-www-form-urlencoded',
		url : basePath+'nm/jobs/taskResultAction/getIpListByResultType.action',
		dataType : 'json',
		data : {
			stepInstanceId:stepInstanceId,
			retryCount : retryCount,
			resultType : resultType
		},
		success : function(result) {
			 var columns;
		     if(type == 1){
		         $('#returnCode').removeClass('none');
		         columns = [{ "data": "ip" },{ "data": "exitCode" },
		                        {data: null,                                
		                            render : function(data, type, row, meta) {
		                                 return row.totalTime.toFixed(3);
		                            }
		                        }];
		     }else{
		         $('#returnCode').addClass('none');
		         columns =[{ "data": "ip" },
		                    {data: null,                                
		                        render : function(data, type, row, meta) {
		                             return row.totalTime.toFixed(3);
		                        }
		                    }];
		     }
		    
			 $('#ipTable tbody').remove();
			 $('#ipTable').dataTable({
				 	searching: false,
				    ordering:  false,
				    lengthChange: false,
				    Info: false,//页脚信息
				    destroy: true,
				    pageLength : 5,
				    language:language,
				    pagingType:'copy',
			        data : result.data,
			        columns: columns
			   });
			 $('#ipTable tbody').on('click', 'tr', function (e) {
				 	var t = $('#ipTable').DataTable();
	 				var curDom = $(e.currentTarget); 
	 				var row = t.row(curDom);//获取按钮所在的行
	 				var data = row.data(); 
				 	if(curDom.find('.dataTables_empty').length>0){
				 		$('#logContent').html(null);
				 		return ;
				 	}
					curDom.parent().find('tr').removeClass('selectRowStyle');
					curDom.addClass("selectRowStyle");
					var ip;
					if(data.source){
						ip = data.source+':'+data.ip;
					}else{
						ip = data.ip;
					}
			        getLogContentByIp(ip,stepInstanceId,retryCount);
			 });
			 $('#ipTable tbody>tr').eq(0).trigger('click');
		}
	})
 };
  
 

 var getStepExecuteDetail = function(stepInstanceId,retryCount,md5,type,name,operator){
	 $.ajax({
		  contentType:'application/x-www-form-urlencoded',
		  url: basePath+"nm/jobs/taskResultAction/getStepExecuteDetail.action",
		  dataType:'json',
		  data:{
			  stepInstanceId:stepInstanceId,
			  retryCount : retryCount,
			  md5 : md5
		  },
		  success: function(reponseText){
			  if(reponseText.success){
				  var data = reponseText.data,
				  	  newMd5 = reponseText.md5;
				  if(data){
				  	  var gseTaskLog = data.gseTaskLog,
				  	  	stepAnalyseResult = data.stepAnalyseResult;	
				  	  
					 var displayStepType = ['执行脚本','文件传输'];
					 $('#taskName').text(name);
					 $('#operator').text(operator);
					 $('#taskType').text(displayStepType[type-1]);
					 $('#startTime').text(gseTaskLog.startTime==null?'':gseTaskLog.startTime);
					 $('#endTime').text(gseTaskLog.endTime==null?'':gseTaskLog.endTime);
					 $('#totalTime').text(gseTaskLog.totalTime.toFixed(3));
					 $('#taskStatus').text(statueArr[gseTaskLog.status-1]);
					 $('#logContent').html(null);
					 
					 var $progressBarDiv = $('#progressBarDiv');
					 if(gseTaskLog.status==1){
						 $progressBarDiv.css('width','0');
						 $progressBarDiv.attr('class','progress-bar  progress-bar-success');
					 }else if(gseTaskLog.status==2){
						 $progressBarDiv.css('width','50%');
						 $progressBarDiv.attr('class','progress-bar  progress-bar-success');
					 }else if(gseTaskLog.status==3){
						 $progressBarDiv.css('width','100%');
						 $progressBarDiv.attr('class','progress-bar  progress-bar-success');
					 }else if(gseTaskLog.status==4){
						 $progressBarDiv.css('width','100%');
						 $progressBarDiv.attr('class','progress-bar  progress-bar-danger');
					 }
					 
					 $('#taskStatus').removeClass('label');
					 $('#taskStatus').removeClass(function(index, css){
						 return (css.match (/\blabel-\S+/g) || []).join(' ');
					 });
					 if([1,2,3,4,6,7].indexOf(gseTaskLog.status) != -1){
						 $('#taskStatus').addClass("label "+statueColor[gseTaskLog.status]);
					 }
					  
					 var $stepAnalyseResult = $('#stepAnalyseResult');
					 	$stepAnalyseResult.empty();
					 for(var i=0;i<stepAnalyseResult.length;i++){
						 var $li = $('<li></li>');
						 var $a = $('<a  data-toggle="tab" aria-expanded="false" style="cursor:pointer;"></a>')
                         var resultTypeTxt = ((data.stepAnalyseResult[i].resultTypeText == null) ? "执行失败" : data.stepAnalyseResult[i].resultTypeText);
						 $a.text(resultTypeTxt+'('+data.stepAnalyseResult[i].count+')');
						 $a.attr('resultType',data.stepAnalyseResult[i].resultType);
                         if (data.stepAnalyseResult[i].resultTypeText && data.stepAnalyseResult[i].resultTypeText.indexOf('失败') > 0) {
                            $a.addClass('text-danger');
                         } 
                         if (data.stepAnalyseResult[i].resultTypeText && data.stepAnalyseResult[i].resultTypeText.indexOf('成功') > 0) {
                            $a.addClass('text-success');
                         }
						 if(i==0){
							$li.addClass('active');
							$a.attr('aria-expanded',"true");
							window.setTimeout(getIpListByResultType(stepInstanceId,data.stepAnalyseResult[0].resultType,retryCount, type), 1000);
						 }
						 $a.on('click',function(){
							 $('div.panel-setp-detail').addClass('none');
                        	 $('div.panel-setp-result').removeClass('none');
                        	 $('#logContent').html(null);
							 getIpListByResultType(stepInstanceId,$(this).attr('resultType'),retryCount, type);
						 })
						 $li.append($a);
						 $stepAnalyseResult.append($li);
					 }
					 if(!data.isFinished){
						 window.setTimeout(getStepExecuteDetail(stepInstanceId,retryCount,newMd5,type,name,operator), 500);	
					 } 
				  }else{
					  window.setTimeout(getStepExecuteDetail(stepInstanceId,retryCount,newMd5,type,name,operator), 500);
				  }
			  }
		  }
	});
 };
 
 
 //绑定搜索日志
 function initSearchLog(stepInstanceId,retryCount,type){
	 $('#searchByLog').off('click');
	 $('#searchByLog').on('click',function(){
		 var searchText = $.trim($('#searchText').val());	
		 $('#stepAnalyseResult').children().removeClass('active')
		 $('#stepAnalyseResult').children().find('a').attr('aria-expanded',"false");
		 
		 $('#searchLi').remove();
		 var htmlTemp = '<li id="searchLi" class="active"><a data-toggle="tab" aria-expanded="true" resulttype="9" style="cursor:pointer;">搜索结果</a></li>';
		 $('#stepAnalyseResult').append(htmlTemp);
		 $('#searchLi').click(function(){
			 $('div.panel-setp-detail').addClass('none');
			 $('div.panel-setp-result').removeClass('none');
			 $('#logContent').html(null);
			 initSearchTable();
		 })
		 
		 var columns
		 if(type == 1){
			 $('#returnCode').removeClass('none');
			 columns = [{ "data": "ip" },{ "data": "exitCode" },
			                {data: null,    		                	
	                            render : function(data, type, row, meta) {
	                                 return row.totalTime.toFixed(3);
	                            }
	                        }];
		 }else{
			 $('#returnCode').addClass('none');
			 columns =[{ "data": "ip" },
		                {data: null,    		                	
                            render : function(data, type, row, meta) {
                                 return row.totalTime.toFixed(3);
                            }
                        }];
		 }
		 
		 initSearchTable(); 
		 function initSearchTable(){
			 $.ajax({
				    contentType:'application/x-www-form-urlencoded',
		    		url : basePath+'nm/jobs/taskResultAction/getIpListByLogSearch.action',
		    		dataType : 'json',
		    		data:{ 
						stepInstanceId:stepInstanceId,
						retryCount:retryCount,
						searchKey:searchText
					},
		    		success : function(result) {
		    			$('#searchLi>a').text('搜索结果('+result.data.length+')');
		    			 $('#ipTable tbody').remove();
		    			 $('#ipTable').dataTable({
		    				 	searching: false,
		    				    ordering:  false,
		    				    lengthChange: false,
		    				    Info: false,//页脚信息
		    				    destroy: true,
		    				    language:language,
		    				    pageLength : 5,
		    				    pagingType:'copy',
		    			        data:result.data,
		    			        columns:columns
		    		            
		    			   });
		    			 $('#ipTable tbody').on('click', 'tr', function (e){
			    				var t = $('#ipTable').DataTable();
			    				var curDom = $(e.currentTarget); 
			    				var row = t.row(curDom);//获取按钮所在的行
			    				var data = row.data(); 
		    				 	if(curDom.find('.dataTables_empty').length>0){
		    				 		$('#logContent').html(null);
		    				 		return ;
		    				 	}
		    					curDom.parent().find('tr').removeClass('selectRowStyle');
		    					curDom.addClass("selectRowStyle");
		    					var ip;
		    					if(data.source){
		    						ip = data.source+':'+data.ip;
		    					}else{
		    						ip = data.ip;
		    					}
		    			        getLogContentByIp(ip,stepInstanceId,retryCount,searchText);
		    			 });
		    			 $('#ipTable tbody>tr').eq(0).trigger('click');
		    			 if(result.success){
 		    				$('#searchLi>a').text('搜索结果('+result.data.length+')');
 		    			}else{
 		    				$('#searchLi>a').text('搜索结果(0)');
 		    			}
		    		}
			 });
		 }				 
	 }) 
     
     $('#searchText').bind('keyup', function(event){
        if (event.keyCode == 13) {
            $('#searchByLog').trigger('click');
        }
     });
 }