//  快速执行脚本和快速分发文件页面的执行结果页面

var timer = null;
/* 执行结果-滚动条显示隐藏 start */
$("#script-slide-panel .btn-return").on('click', function() {
	$('#script-slide-panel').animate({
		right : '0',
		left : '100%'
	}, 1000, function() {
		$('body').css('overflow', "auto");
		$('div.panel-setp-detail').addClass('none');
		$('div.panel-setp-result').removeClass('none');
		clearTimeout(timer);
	});
})
/* 滚动条显示隐藏 end */
var getLogContentByIp = function(ip, stepInstanceId, retryCount, searchText) {
	$('#logContent').parent().divLoad('show');
	$.ajax({
		type : 'post',
		url : basePath + "nm/jobs/taskResultAction!getLogContentByIp.action",
		dataType : 'json',
		data : {
			stepInstanceId : stepInstanceId,
			retryCount : retryCount,
			ip : ip
		},
		success : function(reponseText) {
			$('#logContent').parent().divLoad('hide');
			var data = reponseText.data;
			var $logContent = $('#logContent');
			$logContent.html(null);
			var logContent = data.logContent;
			logContent = logContent.replace(/\n/gi, '<br>')
			if (searchText != undefined) {
				var regexp = '';
				if (searchText.indexOf('/') != -1) {
					regexp = eval("/\\" + searchText + "/gi");
				} else {
					regexp = eval("/" + searchText + "/gi");
				}
				logContent = logContent.replace(regexp,
						'<span class="exe-result-Highlight">' + searchText
								+ '</span>');
				$logContent.html(logContent);
			} else {
				$logContent.html(logContent);
			}
		},
		error : function() {
			$('#logContent').parent().divLoad('hide');
		}
	});
};
var language = {
	search : '全局搜索：',
	lengthMenu : "每页显示 _MENU_ 记录",
	zeroRecords : "没找到相应的数据！",
	info : "第 _PAGE_ 页 / 共 _PAGES_ 页&nbsp;&nbsp;每页显示 5 条&nbsp;&nbsp;共 _TOTAL_ 条",
	infoEmpty : "暂无数据！",
	infoFiltered : "(从 _MAX_ 条数据中搜索)",
	paginate : {
		first : '|<',
		last : '>|',
		previous : '<<',
		next : '>>',
		copy : '复制IP'
	}
}
var getIpListByResultType = function(stepInstanceId, resultType, retryCount, type, tag) {
	$
			.ajax({
				type : 'POST',
				url : basePath
						+ 'nm/jobs/taskResultAction!getIpListByResultType.action',
				dataType : 'json',
				data : {
					stepInstanceId : stepInstanceId,
					retryCount : retryCount,
					resultType : resultType,
					tag : tag
				},
				success : function(result) {
					var columns
					if (type == 1) {
						$('#returnCode').removeClass('none');
						columns = [
								{
									data : null,
									render : function(data, type, row, meta) {
										var source = row.source;
										if (source && source > 0) {
											return sourceArr[row.source] || '';
										} else {
											return '';
										}
									}
								},
								{
									"data" : "ip"
								},
								{
									data : null,
									render : function(data, type, row, meta) {
										var exitCodeDesc = [];
										exitCodeDesc[1] = "通用错误";
										exitCodeDesc[2] = "shell内建命令使用错误";
										exitCodeDesc[126] = "命令调用无法执行";
										exitCodeDesc[127] = "命令未找到";
										exitCodeDesc[128] = "exit的参数错误";
										exitCodeDesc[255] = "超出范围的返回码";

										var exitCode = row.exitCode;
										if (exitCodeDesc[exitCode] != undefined) {
											var exitCodeContent = exitCode
													+ ' <span class="fa fa-question-circle pull-right" data-toggle="tooltip" data-placement="right" title="'+exitCodeDesc[exitCode]+'"></span>';
											return exitCodeContent;

										} else {
											return exitCode;
										}
									}
								}, {
									data : null,
									render : function(data, type, row, meta) {
										return row.totalTime.toFixed(3);
									}
								} ];
					} else {
						$('#returnCode').addClass('none');
						columns = [ {
							data : null,
							render : function(data, type, row, meta) {
								var source = row.source;
								if (source && source > 0) {
									return sourceArr[row.source] || '';
								} else {
									return '';
								}
							}
						}, {
							"data" : "ip"
						}, {
							data : null,
							render : function(data, type, row, meta) {
								return row.totalTime.toFixed(3);
							}
						} ];
					}

					$('#ipTable tbody').remove();
					$('#ipTable').dataTable({
						searching : false,
						ordering : false,
						lengthChange : false,
						Info : false,// 页脚信息
						destroy : true,
						pageLength : 5,
						language : language,
						pagingType : 'copy',
						data : result.data,
						columns : columns
					});
					$('[data-toggle="tooltip"]').tooltip();
					$('#ipTable tbody')
							.on(
									'click',
									'tr',
									function(e) {
										var t = $('#ipTable').DataTable();
										var curDom = $(e.currentTarget);
										var row = t.row(curDom);// 获取按钮所在的行
										var data = row.data();
										if (curDom.find('.dataTables_empty').length > 0) {
											$('#logContent').html(null);
											return;
										}
										curDom.parent().find('tr').removeClass(
												'selectRowStyle');
										curDom.addClass("selectRowStyle");
										var ip;
										if (data.source) {
											ip = data.source + ':' + data.ip;
										} else {
											ip = data.ip;
										}
										getLogContentByIp(ip, stepInstanceId,
												retryCount);
									});
					$('#ipTable tbody>tr').eq(0).trigger('click');
				}
			})
};

var getStepExecuteDetail = function(stepInstanceId, retryCount, md5, type,
		name, operator) {
	$
			.ajax({
				type : 'post',
				url : basePath
						+ "nm/jobs/taskResultAction!getStepExecuteDetail.action",
				dataType : 'json',
				data : {
					stepInstanceId : stepInstanceId,
					retryCount : retryCount,
					md5 : md5
				},
				success : function(reponseText) {
					if (reponseText.success) {
						var data = reponseText.data, newMd5 = reponseText.md5;
						if (data) {
							var gseTaskLog = data.gseTaskLog, stepAnalyseResult = data.stepAnalyseResult, stepDetail = data.stepDetail;

							var displayStepType = [ '执行脚本', '文件传输', '文本步骤' ];
							$('#taskName').text(name);
							$('#operator').text(stepDetail.account);
							$('#taskType').text(displayStepType[type - 1]);
							$('#startTime').text(gseTaskLog.startTime);
							$('#endTime').text(
									gseTaskLog.endTime == null ? ' '
											: gseTaskLog.endTime);
							$('#totalTime').text(
									gseTaskLog.totalTime.toFixed(3));
							$('#taskStatus').text(
									statueArr[gseTaskLog.status - 1]);
							$('#logContent').html(null);
							var $progressBarDiv = $('#progressBarDiv');
							if (gseTaskLog.status == 1) {
								$progressBarDiv.css('width', '0');
								$progressBarDiv.attr('class',
										'progress-bar  progress-bar-success');
							} else if (gseTaskLog.status == 2) {
								$progressBarDiv.css('width', '50%');
								$progressBarDiv.attr('class',
										'progress-bar  progress-bar-success');
							} else if (gseTaskLog.status == 3) {
								$('#taskStatus').attr('class', '')
								$progressBarDiv.css('width', '100%');
								$progressBarDiv.attr('class',
										'progress-bar  progress-bar-success');
							} else if (gseTaskLog.status == 4) {
								$('#taskStatus').attr('class', '')
								$progressBarDiv.css('width', '100%');
								$progressBarDiv.attr('class',
										'progress-bar  progress-bar-danger');
							}

							$('#taskStatus').removeClass('label');
							$('#taskStatus')
									.removeClass(
											function(index, css) {
												return (css
														.match(/\blabel-\S+/g) || [])
														.join(' ');
											});
							if ([ 1, 2, 3, 4, 6, 7 ].indexOf(gseTaskLog.status) != -1) {
								$('#taskStatus').addClass("label " + statueColor[gseTaskLog.status]);
							}

							var $stepAnalyseResult = $('#stepAnalyseResult');
							$stepAnalyseResult.empty();
							
							for ( var i = 0; i < stepAnalyseResult.length; i++) {
								var $li = $('<li></li>');
								var $a = $('<a  data-toggle="tab" aria-expanded="false" style="cursor:pointer;"></a>')
								var resultTypeTxt = ((data.stepAnalyseResult[i].resultTypeText == null) ? "执行失败"
										: data.stepAnalyseResult[i].resultTypeText);
								var aText = resultTypeTxt + '(' + data.stepAnalyseResult[i].count + ')';
								if(data.stepAnalyseResult[i].tag != ''){
									aText = resultTypeTxt + '[' +data.stepAnalyseResult[i].tag+ '](' + data.stepAnalyseResult[i].count + ')';
								}								
								
								var ipResultTips = [];
								ipResultTips[104] = '请参考下表中返回码的错误提示信息';
								var resultType = data.stepAnalyseResult[i].resultType;
								if(ipResultTips[resultType] != undefined){
									aText += ' <span class="fa fa-question-circle"  data-toggle="tooltip" data-placement="top" title="' + ipResultTips[resultType] + '"></span>';
								}
								$a.append(aText);
								
								$a.attr('resultType', data.stepAnalyseResult[i].resultType);
								$a.attr('tag', data.stepAnalyseResult[i].tag);
								if (data.stepAnalyseResult[i].resultTypeText
										&& data.stepAnalyseResult[i].resultTypeText.indexOf('失败') > 0) {
									$a.addClass('text-danger');
								}
								if (data.stepAnalyseResult[i].resultTypeText
										&& data.stepAnalyseResult[i].resultTypeText.indexOf('成功') > 0) {
									$a.addClass('text-success');
								}

								if (i == 0) {
									$li.addClass('active');
									$a.attr('aria-expanded', "true");
									window.setTimeout(
													getIpListByResultType(
															stepInstanceId,
															data.stepAnalyseResult[0].resultType,
															retryCount, type, data.stepAnalyseResult[0].tag),
													1000);
								}
								$a.on('click',
										function() {
											$('div.panel-setp-detail')
													.addClass('none');
											$('div.panel-setp-result')
													.removeClass('none');
											$('#logContent').html(null);
											getIpListByResultType(
													stepInstanceId,
													$(this).attr('resultType'),
													retryCount, type, $(this).attr('tag'));
										})
								$li.append($a);
								$stepAnalyseResult.append($li);
							}
							$('[data-toggle="tooltip"]').tooltip();

							var $li = $('<li class="fr"></li>');
							var $a = $('<a  data-toggle="tab" aria-expanded="false" style="cursor:pointer;">查看步骤详情</a>')
							$a.click(function() {
								$('div.panel-setp-result').addClass('none');
								$('div.panel-setp-detail').removeClass('none');
								getStepDetail(stepDetail);
							})
							$li.append($a);
							$stepAnalyseResult.append($li);

							// 步骤详情
							if (!data.isFinished) {
								timer = window.setTimeout(getStepExecuteDetail(
										stepInstanceId, retryCount, newMd5,
										type, name, operator), 500);
							}
						} else {
							timer = window.setTimeout(getStepExecuteDetail(
									stepInstanceId, retryCount, newMd5, type,
									name, operator), 500);
						}
					}
				}
			});
};

function getIpResultTips(resultType){
	var ipResultTips = [];
	ipResultTips[104] = '请参考下表中返回码的错误提示信息';
	return ipResultTips[resultType] == undefined ? '' : ipResultTips[resultType];
}

function getStepDetail(data) {
	if (data.type == 1) {
		$('#setp-detail-script').removeClass('none');
		$('#setp-detail-file').addClass('none');
		var codeMir = $('#codeDiv').codeMirror({
			readOnly : true
		});
		$('#scriptParam').val(data.scriptParam);
		$('#scriptTimeout').val(data.scriptTimeout);
		var scriptContent = data.scriptContent.replace(/@##@/g, "\r\n");
		codeMir.setValue(scriptContent);
		codeMir.setType(data.scriptType);
	} else if (data.type == 2) {
		$('#tbodyView').empty();
		$('#setp-detail-file').removeClass('none');
		$('#setp-detail-script').addClass('none');
		$('#fileTargetPath').val(data.fileTargetPath);
		var temp = "";
		data.fileSource.forEach(function(v, i) {
			var fileList, serverAddress, account
			if (!v.account) {
				fileList = (v.file.indexOf('/') != -1 ? v.file.slice(v.file
						.lastIndexOf('/') + 1)
						: v.file.indexOf('\\') != -1 ? v.file.slice(v.file
								.lastIndexOf('\\') + 1) : v.file);
				serverAddress = '本地文件';
				account = "无";
			} else {
				fileList = v.file;
				var olHtml = '<ol style="text-align: left;">';
				v.ipList.split(',').forEach(function(ipstr, i) {
					if (ipstr.indexOf(':') !== -1) {
						olHtml += '<li>' + ipstr.split(':')[1] + '</li>';
					} else {
						olHtml += '<li>' + ipstr + '</li>';
					}
				});
				olHtml += "</ol>";
				serverAddress = olHtml;
				account = v.account;
			}
			temp += '<tr><td style="width: 30%;">' + fileList + '</td>';
			temp += '<td style="width: 15%;">' + serverAddress + '</td>';
			temp += '<td style="width: 15%;" class="issue-info"><span>'
					+ account + '</span></td></tr>';
		})
		$('#tbodyView').append(temp);

		$('#fastPushFileTable').dataTable({
			bPaginate : true,
			bLengthChange : false,
			bFilter : false,
			bSort : false,
			bInfo : true,
			bAutoWidth : false,
			pageLength : 5,
			destroy : true,
			language : language,
			pagingType : 'input'
		});
	}
}

// 绑定搜索日志
function initSearchLog(stepInstanceId, retryCount, type) {

	$('#searchByLog').off('click');
	$('#searchByLog')
			.on(
					'click',
					function() {
						var searchText = $.trim($('#searchText').val());
						$('#stepAnalyseResult').children()
								.removeClass('active')
						$('#stepAnalyseResult').children().find('a').attr(
								'aria-expanded', "false");

						$('#searchLi').remove();
						var htmlTemp = '<li id="searchLi" class="active"><a data-toggle="tab" aria-expanded="true" resulttype="9" style="cursor:pointer;">搜索结果</a></li>';
						$('#stepAnalyseResult').append(htmlTemp);
						$('#searchLi').click(function() {
							$('div.panel-setp-detail').addClass('none');
							$('div.panel-setp-result').removeClass('none');
							$('#logContent').html(null);
							initSearchTable();
						})

						var columns
						if (type == 1) {
							$('#returnCode').removeClass('none');
							columns = [ {
								data : null,
								render : function(data, type, row, meta) {
									var source = row.source;
									if (source && source > 0) {
										return sourceArr[row.source] || '';
									} else {
										return '';
									}

								}
							}, {
								"data" : "ip"
							}, {
								"data" : "exitCode"
							}, {
								data : null,
								render : function(data, type, row, meta) {
									return row.totalTime.toFixed(3);
								}
							} ];
						} else {
							$('#returnCode').addClass('none');
							columns = [ {
								data : null,
								render : function(data, type, row, meta) {
									var source = row.source;
									if (source && source > 0) {
										return sourceArr[row.source] || '';
									} else {
										return '';
									}

								}
							}, {
								"data" : "ip"
							}, {
								data : null,
								render : function(data, type, row, meta) {
									return row.totalTime.toFixed(3);
								}
							} ];
						}

						initSearchTable();
						function initSearchTable() {
							$
									.ajax({
										type : 'POST',
										url : basePath
												+ 'nm/jobs/taskResultAction!getIpListByLogSearch.action',
										dataType : 'json',
										data : {
											stepInstanceId : stepInstanceId,
											retryCount : retryCount,
											searchKey : searchText
										},
										success : function(result) {
											$('#ipTable tbody').remove();
											$('#ipTable').dataTable({
												searching : false,
												ordering : false,
												lengthChange : false,
												Info : false,// 页脚信息
												destroy : true,
												language : language,
												pageLength : 5,
												pagingType : 'copy',
												data : result.data,
												columns : columns

											});
											$('#ipTable tbody')
													.on(
															'click',
															'tr',
															function(e) {
																var t = $(
																		'#ipTable')
																		.DataTable();
																var curDom = $(e.currentTarget);
																var row = t
																		.row(curDom);// 获取按钮所在的行
																var data = row
																		.data();
																if (curDom
																		.find('.dataTables_empty').length > 0) {
																	$(
																			'#logContent')
																			.html(
																					null);
																	return;
																}
																curDom
																		.parent()
																		.find(
																				'tr')
																		.removeClass(
																				'selectRowStyle');
																curDom
																		.addClass("selectRowStyle");
																var ip;
																if (data.source) {
																	ip = data.source
																			+ ':'
																			+ data.ip;
																} else {
																	ip = data.ip;
																}
																getLogContentByIp(
																		ip,
																		stepInstanceId,
																		retryCount,
																		searchText);
															});
											$('#ipTable tbody>tr').eq(0)
													.trigger('click');
											if (result.success) {
												$('#searchLi>a')
														.text(
																'搜索结果('
																		+ result.data.length
																		+ ')');
											} else {
												$('#searchLi>a')
														.text('搜索结果(0)');
											}
										}
									});
						}
					})

	$('#searchText').bind('keyup', function(event) {
		if (event.keyCode == 13) {
			$('#searchByLog').trigger('click');
		}
	});
}
