

<div style="font-family: '微软雅黑';min-width:1200px;">
    <div class="container-fluid pl0 pr0">
        <div class="row">
            <div class="col-md-3 col-xs-3">
                <!-- small box -->
                <div class="small-box bg-aqua white">
                    <div class="bg-aqua-h small-box-h text-center">
                        <p style="font-size:50px;"><i class="fa fa-desktop" ></i></p>
                    <p>业务主机数</p>
                </div>
                    <div class="pl20 pr5 pb5 pt5" style="width:65%;">
                     <h3 id="ipTotal" style="font-size:40px;">0</h3>
                     <div class="haveSuccessIp none">
                        <div>agent正常：<span id="successIp">0</span></div>
                        <div>agent未安装：<span id="failIp">0</span></div>
                     </div>
                     <a class="haveSuccessIp none" href="http://o.qcloud.com/console?app=iagent" target="_blank" style="color:#FFFA39;">点击进入安装agent</a>
                    <!--  <p class="noSuccessIp none">你当前的业务主机还未安装蓝鲸agent，请<a href="http://o.qcloud.com/console/?app=agent-install" target="_blank" style="color:#FFFA39;">点击进入安装</a></p> -->
                    </div>
                  </div>
              </div><!-- ./col -->
              <div class="col-md-3 col-xs-3">
                <!-- small box -->
                <div class="small-box bg-green white">
                    <div class="bg-green-h small-box-h text-center">
                        <p style="font-size:50px;"><i class="fa fa-list-alt" ></i></p>
                    <p>常用作业数</p>
                </div>
                    <div class="pl20 pr5 pb5 pt5" style="width:65%;">
                     <h3 id="task" style="font-size:40px;">0</h3>
                    </div>
                  </div>
              </div><!-- ./col -->
              <div class="col-md-3 col-xs-3">
                <!-- small box -->
                <div class="small-box bg-yellow white">
                    <div class="bg-yellow-h small-box-h text-center">
                        <p style="font-size:50px;"><i class="fa fa-calendar" ></i></p>
                    <p>本月执行任务数</p>
                </div>
                    <div class="pl20 pr5 pb5 pt5" style="width:65%;">
                     <h3 id="instanceTotal" style="font-size:40px;">0</h3>
                     <div>
                        <div>执行中：<span id="instanceRunning">0</span></div>
                        <div>成功：<span id="instanceSuccess">0</span></div>
                        <div>失败：<span id="instanceFail">0</span></div>
                     </div>
                    </div>
                  </div>
              </div><!-- ./col -->
              <div class="col-md-3 col-xs-3">
                <!-- small box -->
               <div class="small-box bg-red white">
                <div class="bg-red-h small-box-h text-center">
                        <p style="font-size:50px;"><i class="fa fa-clock-o" ></i></p>
                    <p>定时任务数</p>
                </div>
                <div class="pl20 pr5 pb5 pt5" style="width:65%;">
                     <h3 id="crontabTotal" style="font-size:40px;">0</h3>
                     <div>
                        <div>启动：<span id="crontabRun">0</span></div>
                        <div>暂停：<span id="crontabPause">0</span></div>
                     </div>
                    </div>
                  </div>
              </div><!-- ./col -->
            </div>
         </div>
        <div class="panel panel-default" style="box-shadow:1px 0 10px 1px rgba(0,0,0,.1);">
            <div class="panel-heading" style="background-color: #fff;border: 0;">
                <h3 class="panel-title" style="color: #337ab7;font-size: 18px;font-weight: bold;">历史任务执行情况</h3>
            </div>
            <div class="panel-body">
                <div class="container-fluid">
                    <div id="chart-0" class="ml30 mr30 mb30" style="height: 300px;"></div>
                </div>
            </div>
        </div>
        
        <div class="col-lg-6 col-xs-12 ml0 pl0">
            <div class="panel panel-default" style="box-shadow:1px 0 10px 1px rgba(0,0,0,.1);">
                <div class="panel-heading" style="background-color: #fff;border: 0;">
                    <h3 class="panel-title" style="color: #337ab7;font-size: 18px;font-weight: bold;">任务执行时长统计</h3>
                </div>
                <div class="panel-body">
                    <div class="container-fluid">
                        <div id="chart-1" class="m30"></div>
                        <p class="none" id="chart-1-msg">暂无数据可以统计</p>
                    </div>
                </div>
            </div>
        </div>
            <div class="col-lg-6 col-xs-12 mr0 pr0">
                <div class="panel panel-default" style="box-shadow:1px 0 10px 1px rgba(0,0,0,.1);">
                    <div class="panel-heading" style="background-color: #fff;border: 0;">
                        <h3 class="panel-title" style="color: #337ab7;font-size: 18px; font-weight: bold;">最近任务执行记录&nbsp;&nbsp;&nbsp;&nbsp;<small><a href="javascript:;" id="historyMore">更多</a></small></h3>
                    </div>
                    <div class="panel-body">
                        <div class="container-fluid">
                            <table cellpadding="0" cellspacing="0" border="0"
                                class="table table-striped table-bordered mt20" id="historyList">
                                <thead>
                                    <tr>
                                        <th class="text-left">执行人</th>
                                        <th class="text-left">执行时间</th>
                                        <th class="text-left">当前状态</th>
                                        <th class="text-left">任务名</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    











<script type="text/javascript" src="./js/app/main.js"></script>


