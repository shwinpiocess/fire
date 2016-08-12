/**
 * 
 */
$(function($){
     var doStepOperation = function(stepInstanceId, operationCode, taskInstanceId, newMd5){
        $.ajax({
          type : 'post',
          url: basePath+"nm/jobs/taskExecuteAction!doStepOperation.action",
          dataType:'json',
          data:{
              stepInstanceId:stepInstanceId,
              operationCode:operationCode
          },
          success: function(reponseText){
              printMsg(reponseText.msg.message, reponseText.msg.msgType);
              if(reponseText.success){
                  window.setTimeout(function(){                	 
                	  getTaskResult(taskInstanceId, newMd5);
                	  initSearchLog(stepInstanceId,0);
                  }, 500);
              }
          }
        })
    };
    
	var getTaskResult = function(taskInstanceId,md5){
		$.ajax({
			type : 'POST',
			url : basePath + 'nm/jobs/taskResultAction!getTaskResult.action',
			dataType : 'json',
			data : {
				taskInstanceId : taskInstanceId,
				md5 : md5
			},
			success : function(result) {
                if(result.success){
                    var newMd5 = result.md5;
                    var data = result.data;
                    if(data){//装填数据
                        var $table = $('.king-timeline');
                        var taskInstance = data.taskInstance;
                        var blocks = data.blocks;
                        $('#rs-name').html(taskInstance.name);
                        
                        $('#taskStatus').removeClass('label');
	   					$('#taskStatus').removeClass(function(index, css){
	   						return (css.match (/\blabel-\S+/g) || []).join(' ');
	   					});
	   					
	   					$('#rs-status').removeClass('label');
	   					$('#rs-status').removeClass(function(index, css){
	   						return (css.match (/\blabel-\S+/g) || []).join(' ');
	   					});
	   					
                        if([1,2,3,4,6,7].indexOf(taskInstance.status) != -1){ 
	                    	 $('#rs-status').addClass("label "+statueColor[taskInstance.status]);
	                    }                    
                        
                        $('#rs-status').html(statueArr[taskInstance.status-1]);
                        $('#rs-operator').html(taskInstance.operator);
                        $('#rs-startTime').html(taskInstance.startTime==null?'':taskInstance.startTime);
                        $('#rs-endTime').html(taskInstance.endTime==null?'':taskInstance.endTime);
                        $('#rs-totalTime').html(taskInstance.totalTime.toFixed(3));
                        var html = '';
                        for(var i=0; i<blocks.length; i++){
                            var block = blocks[i];
                            html +='<li><i class="fa king-bg-blue">' + ((undefined==block.blockOrd) ? 1 : block.blockOrd) + '</i>'
                                  +'<div class="king-timeline-item">'
                                  +'<div class="king-timeline-header pt0">'
                                  +(block.type==1 ? '<div class="task-detail-header">' : '<div class="task-detail-header2">')  
                                  + '<span class="task-img">'
                                  +(block.type==1 ? '<img class="task-img" src="./img/j.png"/>': '<img class="task-img" src="./img/w.png" style="width:46px;height:46px;margin-top:-1px;" />')
                                  +'</span><lable class="control-label mt5 ml5">步骤名称：'
                                  + ((undefined==block.blockName) ? "" : block.blockName)+'</lable></div>'
                                  + '</div>'
                                  +      '<div class="king-timeline-body">'
                                  +          '<table class="table table-bordered">'
                                  +              '<thead>'
                                  +                  '<tr>'
                                  +                      '<th style="width: 3%;" nowrap="nowrap">序号</th>'
                                  +                      '<th style="width: 20%;" nowrap="nowrap">' + (block.type==1 ? '脚本名称' : '任务名称 ')  +'</th>'
                                  +                      '<th style="width: 5%;" nowrap="nowrap">执行主机数</th>'
                                  +                      '<th style="width: 15%;" nowrap="nowrap">开始时间</th>'
                                  +                      '<th style="width: 15%;" nowrap="nowrap">结束时间</th>'
                                  +                      '<th style="width: 5%;" nowrap="nowrap">总时间(s)</th>'
                                  +                      '<th style="width: 10%;" nowrap="nowrap">状态</th>'
                                  +                      '<th style="width: auto;" nowrap="nowrap">操作</th>'
                                  +                  '</tr>'
                                  +              '</thead>'
                                  +             '<tbody>';
                            var stepInstances = block.stepInstances;
                            for (var j=0; j<stepInstances.length; j++) {
                                var st = stepInstances[j];
                                html +='<tr class="rs_tr"><td>'+(j+1)+'</td><td>'+st.name+'</td><td>'
                                +st.runIPNum+'</td><td>'+(st.startTime==null?'':st.startTime)+'</td><td>'+(st.endTime==null?'':st.endTime)+'</td><td>'
                                +st.totalTime.toFixed(3)+'</td>';
                                
                                if([1,2,3,4,6,7].indexOf(st.status) != -1){       	                    	 	
       	                    	 	html += '<td><span class="label '+statueColor[st.status]+'">';
                                }else{
                                	html += '<td>';
                                }
                                html += statueArr[st.status-1] +
                                '</span></td><td nowrap="nowrap"><a class="step_result '+ ((st.type==3 || st.status==1) ? 'none' : '')+'" data-option="'+st.stepInstanceId+','+st.retryCount+','+st.type+','+st.name+'" href="javascript:void(0)">执行详情</a>&nbsp;&nbsp;';
                                
                                if (null != st.operationList) {
                                    // 操作列表不为空, 并且是文本步骤时候，才添加操作链接。其他步骤类型的操作链接暂时不添加
                                    $.each(st.operationList, function(n, opt){
                                        html +='<a class="operation_list" data-option="'+ st.stepInstanceId+','+ opt.operationCode +',' + st.text + '" href="javascript:void(0)">' + opt.operationName + '</a>&nbsp;&nbsp;';
                                    })
                                }
                                html +='</td></tr>';
                            }
                            html +=              '</tbody>'
                                  +          '</table>'
                                  +      '</div>'
                                  +  '</div>'
                                +'</li>';
                        }
                        html += '<li><i class="fa fa-power-off king-bg-green"></i></li>'
                        $table.empty();
                        $table.append(html);
                        
                        
                        if(!data.isFinished){
                            window.setTimeout(getTaskResult(taskInstanceId,newMd5), 500);   
                        }
                        $table.find('a.step_result').off('click');
                        $table.find('a.step_result').click(function(){
                            var data = $(this).attr('data-option').split(','),
                            stepInstanceId = data[0] , retryCount= data[1],
                            type = data[2],name = data[3];
                             $('body').css('overflow',"hidden");
                              $('#script-slide-panel').animate({ 
                                    left:$('.king-layout6-sidebar').width()
                              }, 1000);
                              
                              getStepExecuteDetail(stepInstanceId,retryCount,null,type,name,taskInstance.operator);                         
                              initSearchLog(stepInstanceId,0,type);
                        });
                        $table.find('a.operation_list').off('click');
                        $table.find('a.operation_list').click(function(){
                            var data = $(this).attr('data-option').split(','),
                            stepInstanceId = data[0], operationCode= data[1], textTip = data[2];
                            //6表示是'继续'
                            if (6 == operationCode) {
                                var tips = ("" == textTip ? "(空)" : textTip) ;
                                confirmModal('暂停描述', tips, function(){
                                    doStepOperation(stepInstanceId, operationCode, taskInstanceId, newMd5);
                                },null,"继续");
                                return;
                            } 
                            doStepOperation(stepInstanceId, operationCode, taskInstanceId, newMd5);
                        });                     
                    }else{
                        window.setTimeout(getTaskResult(taskInstanceId,newMd5), 500);   
                    }
                } else {
                    printMsg(result.msg.message,result.msg.msgType);
                }
            }
		});
	};
	var initTaskList = function(taskInstanceId,_searchdata){
		var _data = {};
		if(havePropInObj(_searchdata)){
			_data =  _searchdata;
		}
		_data['length'] = 100;
		$.ajax({
			type : 'POST',
			url : basePath+'nm/jobs/taskResultAction!searchTaskResultList.action',
			dataType : 'json',
			data : _data,
			success : function(result) {
				var data = result.data;
				if(data){
					var html =''; 
					$.each(data,function(i,opt){
						if(taskInstanceId==opt.taskInstanceId){
							html += '<option value="'+opt.taskInstanceId+'" selected>'+opt.name+'</option>'
						}else{
							html += '<option value="'+opt.taskInstanceId+'">'+opt.name+'</option>'
						}
					})
					$('#taskSelect').append(html);
					$('#taskSelect').chosen({width:'250px'});
				}
			}
		})
	}
	// $('#taskSelect').change(function(){
	// 	createNewTab('作业实例', './app/taskDetail.jsp', '执行详情',extraObj);
	// });
  $('#taskSelect').on('change',function(){
    extraObj.taskInstanceId = $(this).val();
    createNewTab('作业实例', './app/taskDetail.jsp', '执行详情',extraObj);
  });

	$('#returnBtn').click(function(){
		if(havePropInObj(extraObj) && extraObj.historytype){
			if(extraObj.historytype<=1){
				createNewTab('执行历史', './app/taskInstanceList.jsp', '执行历史',extraObj);
			}else if(extraObj.historytype==2){
				createNewTab('常用作业执行', './app/jobList.jsp', '作业执行',extraObj);
			}else if(extraObj.historytype==3){
				extraObj.type = 'edit';
				delete extraObj.taskInstanceId; 
				createNewTab('作业编辑', './app/newTask.jsp', '作业执行',extraObj);
			}
		}else{
			createNewTab('执行历史', './app/taskInstanceList.jsp', '执行历史');
		}
	});
	
	//初始化页面时直接调用
	(function(){
		if(havePropInObj(extraObj)){//判断扩展参数是否存在
			if(extraObj.taskInstanceId){
				getTaskResult(extraObj.taskInstanceId,null);
			}
			if(extraObj.historytype>1){
				$('#taskSelect').remove();
			}else{
				initTaskList(extraObj.taskInstanceId,extraObj.searchdata);
			}
		}
	})();
});
