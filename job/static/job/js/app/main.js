/**
 * 
 */
$(function(){
	var chartData_0,chartData_1; 
	$('#historyMore').click(function(){
		createNewTab('执行历史', './app/taskInstanceList.jsp', '执行历史');
	});
	function chartLine(_data){
		var dataArr = [];
		var dataDate = _data.date;
		for(var i=0;i<dataDate.length;i++){
			if(i%2==1){
				dataDate[i]='';
			}
		}
		if(_data.success){
			dataArr.push({
				name : '等待执行(个)',
				data : _data.success,
				color : '#00a65a'
			})
		}
		if(_data.total){
			dataArr.push({
				name : '总数(个)',
				data : _data.total,
				color : '#428bca'
			})
		}
		
		$("#chart-0").kendoChart({
	        legend: {
	           position: "top",
	    	   labels: {
	    		   font : '13px 微软雅黑'
	    	   }
	        },
	        theme : 'bootstrap',
	        seriesDefaults: {
	            type: "line",
	            style: "smooth",
	            labels: {
		    		font : '13px 微软雅黑'
		    	}
	        },
	        series: dataArr,
	        valueAxis: {
                labels: {
                    template: "#:value#"
                }
            },
	        categoryAxis : {
	            majorGridLines : {
	                visible: false
	            },
	            categories : dataDate,
	            labels: {
	                rotation: "auto",
	                font : '13px 微软雅黑'
	            }
	        },
	        tooltip: {
	            visible: true,
	            template: "#= value #",
	            labels: {
		    		font : '13px 微软雅黑'
		    	}
	        }
	    });  
	}
	function chartPie(_data){
		if(!_data['total']){
			$('#chart-1-msg').removeClass('none');
		}else{
			
			var dataArr =[{
				category: "1分钟内",
				value: _data['lessThanOne']
			},{
				category: "1-3分钟内",
				value: _data['oneToThree']
			},{
				category: "3-5分钟",
				value: _data['threeToFive']
			},{
				category: "5-10分钟",
				value: _data['fiveToTen']
			},{
				category: "10-30钟",
				value: _data['tenToHalf']
			},{
				category: "30分钟以上",
				value: _data['moreThanHalf']
			}]
			$("#chart-1").kendoChart({
				legend: {
					position: "top",
					margin: {bottom:30},
					labels: {
						font : '13px 微软雅黑'
					}
				},
				theme : 'bootstrap',
				seriesDefaults: {
					labels: {
						template: "#= category # ： #= kendo.format('{0:P}', percentage)#",
						position: "outsideEnd",
						visible: true,
						background: "transparent",
						font : '13px 微软雅黑'
					}
				},
				series: [{
					type: "pie",
					data:dataArr
				}],
				tooltip: {
					visible: true,
					template: "#= category # ： #= kendo.format('{0:P}', percentage) #",
					labels: {
						font : '13px 微软雅黑'
					}
				}
			});  
		}
	}
	function tableList(_data){
		$('#historyList').DataTable({
			 bAutoWidth: false,
			 bLengthChange: false,
			 bProcessing: false,
			 ordering:false,
			 searching:false,
			 info :false,
			 paging:false,
			 data : _data,
			 columns : [
	            {data:"operator"},         
	            {data:"totalTime"},         
	            {	
	            	data:null,
		            orderable:false,
		            render : function(data, type, row, meta){
		                  return statueArr[data.status-1];
		            }
	            },         
	            {
	            	data:null,
		            orderable:false,
		            render : function(data, type, row, meta){
		                  return '<a href="javascript:;" class="link">'+data.name+'</a>';
		            }
	            }
	          ],
			 language:{
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
		 }); 
		$("#historyList tbody").on('click', 'a.link', function(){
			var t = $("#historyList").DataTable();//注意大小写
			var row = t.row($(this).parents('tr')), //获取按钮所在的行
			data = row.data();
			createNewTab('作业实例', './app/taskDetail.jsp', '执行详情' , {
				taskInstanceId : data.taskInstanceId,
				historytype : 1
			});
		});
	}
	function init(){
		$.ajax({
          type : 'post',
          url: basePath+"nm/personal/appAction!getStatistic.action",
          dataType:'json',
          success: function(rs){
             if(rs.success){
            	 var data = rs.data;
            	 if(data.ip&&data.ip.total>0){
            		 $('#ipTotal').text(data.ip.total||0);
            		 $('#successIp').text(data.ip.alive||0);
            		 $('#failIp').text(data.ip.inactive||0);
        			 $(".haveSuccessIp").removeClass('none');
//            		 $(".noSuccessIp").addClass('none');
            		 if(data.ip.inactive == 0){
            		 	$('a.haveSuccessIp').addClass('none');
            		 }
            	 }else{
            		 $(".haveSuccessIp").addClass('none');
//            		 $(".noSuccessIp").removeClass('none');
            	 }
            	 if(window.self.location.hostname.indexOf(".qcloud.") === -1){
//            	 	$(".noSuccessIp").addClass('none');
            	 	$('a.haveSuccessIp').addClass('none');
            	 }
            	 $('#task').text(data.task||0);
            	 if(data.instanceStatus){
            		 $('#instanceTotal').text(data.instanceStatus.total||0);
//            		 $('#instanceBlank').text(data.instanceStatus.blank||0);
            		 $('#instanceRunning').text(data.instanceStatus.running||0);
            		 $('#instanceSuccess').text(data.instanceStatus.success||0);
            		 $('#instanceFail').text(data.instanceStatus.fail||0);
//            		 $('#instanceWaiting').text(data.instanceStatus.waiting||0);
            	 }
            	 if(data.crontab){
            		 $('#crontabTotal').text(data.crontab.total||0);
            		 $('#crontabRun').text(data.crontab.run||0);
            		 $('#crontabPause').text(data.crontab.pause||0);
//            		 $('#crontabFinish').text(data.crontab.finish||0);
            	 }
            	 
            	 if(data.instanceDate){//线图
            		 chartData_0 = data.instanceDate;
            		 chartLine(chartData_0);
            	 }
            	 if(data.instanceTotalTime){//饼图
            		 chartData_1 = data.instanceTotalTime;
            		 chartPie(chartData_1)
            	 }
            	 
            	 if(data.instanceList){
            		 tableList(data.instanceList)
            	 }
             }
          }
        });
	}
	init();
	 $(window).resize(function() {
		 chartLine(chartData_0);
		 chartPie(chartData_1)
     })
});