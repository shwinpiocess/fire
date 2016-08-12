
<div class="form-group">
	<label class="col-sm-2 control-label">定时规则<span class="red">&nbsp;*&nbsp;</span>:</label>
	<div class="col-sm-10">
		<label class="radio-inline"> <input type="radio"
			name="cronMode" checked="checked" class="cron-rd-chk cron-sel" value="0"> 勾选
		</label> <label class="radio-inline"> <input type="radio"
			name="cronMode" class="cron-rd-chk cron-def" value="1">自定义
		</label>
	</div>
</div>
<div class="form-group">
	<div class="col-sm-offset-2 col-sm-10">
		<div class="cron-box" id="cron-box">
			<ul class="nav nav-tabs" id="cronTab">
				<li class="active"><a href="#cronTab-1" data-toggle="tab">分钟</a></li>
				<li><a href="#cronTab-2" data-toggle="tab">小时</a></li>
				<li><a href="#cronTab-3" data-toggle="tab">天</a></li>
				<li><a href="#cronTab-4" data-toggle="tab">月</a></li>
				<li><a href="#cronTab-5" data-toggle="tab">星期</a></li>
			</ul>
			<div class="tab-content">
				<div class="tab-pane fade in active" id="cronTab-1">
						<div class="row ml15 mr5 pt5 pb0">
							<label class="radio-inline">
								<input type="radio" name="minMode" class="cron-rd-chk min-loop" checked="checked">循环：</label>
							<div style="display: inline-block;">
								从第&nbsp;
								<input type="number"  value="0" min="0" max="59" maxlength="2" style="width:40px;" name="min-from">
								&nbsp;分钟开始，每隔&nbsp;
								<input type="number" value="5" min="1" max="50" maxlength="2" style="width:40px;" name="min-space">
								&nbsp;分钟执行
							</div>
						</div>
						<div class="row ml15 mr5 pt5 pb0">
							<label class="radio-inline">
								<input type="radio" name="minMode" class="cron-rd-chk min-designated">指定：</label>
							<div class="label-d">
								<label class="checkbox-inline ml10"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="0"><span class="check-span">0</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="1"><span class="check-span">1</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="2"><span class="check-span">2</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="3"><span class="check-span">3</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="4"><span class="check-span">4</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="5"><span class="check-span">5</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="6"><span class="check-span">6</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="7"><span class="check-span">7</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="8"><span class="check-span">8</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="9"><span class="check-span">9</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="10"><span class="check-span">10</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="11"><span class="check-span">11</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="12"><span class="check-span">12</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="13"><span class="check-span">13</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="14"><span class="check-span">14</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="15"><span class="check-span">15</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="16"><span class="check-span">16</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="17"><span class="check-span">17</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="18"><span class="check-span">18</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="19"><span class="check-span">19</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="20"><span class="check-span">20</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="21"><span class="check-span">21</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="22"><span class="check-span">22</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="23"><span class="check-span">23</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="24"><span class="check-span">24</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="25"><span class="check-span">25</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="26"><span class="check-span">26</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="27"><span class="check-span">27</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="28"><span class="check-span">28</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="29"><span class="check-span">29</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="30"><span class="check-span">30</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="31"><span class="check-span">31</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="32"><span class="check-span">32</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="33"><span class="check-span">33</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="34"><span class="check-span">34</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="35"><span class="check-span">35</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="36"><span class="check-span">36</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="37"><span class="check-span">37</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="38"><span class="check-span">38</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="39"><span class="check-span">39</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="40"><span class="check-span">40</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="41"><span class="check-span">41</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="42"><span class="check-span">42</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="43"><span class="check-span">43</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="44"><span class="check-span">44</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="45"><span class="check-span">45</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="46"><span class="check-span">46</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="47"><span class="check-span">47</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="48"><span class="check-span">48</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="49"><span class="check-span">49</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="50"><span class="check-span">50</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="51"><span class="check-span">51</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="52"><span class="check-span">52</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="53"><span class="check-span">53</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="54"><span class="check-span">54</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="55"><span class="check-span">55</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="56"><span class="check-span">56</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="57"><span class="check-span">57</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="58"><span class="check-span">58</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="min-checkbox" value="59"><span class="check-span">59</span></label>
							</div>
						</div>
				</div>
				<div class="tab-pane fade" id="cronTab-2">
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="hourMode" class="cron-rd-chk hour-loop" checked="checked">每小时</label>
					</div>
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="hourMode" class="cron-rd-chk hour-designated">指定：</label>
						<div class="label-d">
							<label class="checkbox-inline ml10"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="0"><span class="check-span">0</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="1"><span class="check-span">1</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="2"><span class="check-span">2</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="3"><span class="check-span">3</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="4"><span class="check-span">4</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="5"><span class="check-span">5</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="6"><span class="check-span">6</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="7"><span class="check-span">7</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="8"><span class="check-span">8</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="9"><span class="check-span">9</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="10"><span class="check-span">10</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="11"><span class="check-span">11</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="12"><span class="check-span">12</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="13"><span class="check-span">13</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="14"><span class="check-span">14</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="15"><span class="check-span">15</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="16"><span class="check-span">16</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="17"><span class="check-span">17</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="18"><span class="check-span">18</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="19"><span class="check-span">19</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="20"><span class="check-span">20</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="21"><span class="check-span">21</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="22"><span class="check-span">22</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="hour-checkbox" value="23"><span class="check-span">23</span></label>
						</div>
					</div>
				</div>
				<div class="tab-pane fade" id="cronTab-3">
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="dayMode" class="cron-rd-chk day-loop" checked="checked">每天</label>
					</div>
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="dayMode" class="cron-rd-chk day-designated">指定：</label>
						<div class="label-d">
							<label class="checkbox-inline ml10"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="1"><span class="check-span">1</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="2"><span class="check-span">2</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="3"><span class="check-span">3</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="4"><span class="check-span">4</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="5"><span class="check-span">5</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="6"><span class="check-span">6</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="7"><span class="check-span">7</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="8"><span class="check-span">8</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="9"><span class="check-span">9</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="10"><span class="check-span">10</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="11"><span class="check-span">11</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="12"><span class="check-span">12</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="13"><span class="check-span">13</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="14"><span class="check-span">14</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="15"><span class="check-span">15</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="16"><span class="check-span">16</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="17"><span class="check-span">17</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="18"><span class="check-span">18</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="19"><span class="check-span">19</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="20"><span class="check-span">20</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="21"><span class="check-span">21</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="22"><span class="check-span">22</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="23"><span class="check-span">23</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="24"><span class="check-span">24</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="25"><span class="check-span">25</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="26"><span class="check-span">26</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="27"><span class="check-span">27</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="28"><span class="check-span">28</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="29"><span class="check-span">29</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="30"><span class="check-span">30</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="day-checkbox" value="31"><span class="check-span">31</span></label>
						</div>
					</div>
				</div>
				<div class="tab-pane fade" id="cronTab-4">
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="monthMode" class="cron-rd-chk month-loop" checked="checked">每月</label>
					</div>
					<div class="row ml15 mr5 pt5 pb0">
						<label class="radio-inline">
							<input type="radio" name="monthMode" class="cron-rd-chk month-designated">指定：</label>
						<div class="label-d">
							<label class="checkbox-inline ml10"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="1"><span class="check-span">1</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="2"><span class="check-span">2</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="3"><span class="check-span">3</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="4"><span class="check-span">4</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="5"><span class="check-span">5</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="6"><span class="check-span">6</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="7"><span class="check-span">7</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="8"><span class="check-span">8</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="9"><span class="check-span">9</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="10"><span class="check-span">10</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="11"><span class="check-span">11</span></label>
							<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="month-checkbox" value="12"><span class="check-span">12</span></label>
						</div>
					</div>
				</div>
				<div class="tab-pane fade" id="cronTab-5">
					<div class="row ml15 mr5 pt5 pb0">
						<div class="pb5">
							<label class="checkbox-inline">
								<input type="checkbox" name="weekEnable" class="cron-rd-chk week-enable">使用星期</label>
						</div>
						<div class="label-d">
							<div class="pb5 ml10">
								<label class="radio-inline">
									<input type="radio" name="weekMode" class="cron-rd-chk week-loop" checked="checked" checked="checked">每星期</label>
							</div>
							<div class="pb5 ml10">
								<label class="radio-inline">
									<input type="radio" name="weekMode" class="cron-rd-chk week-designated">指定：</label>
							</div>
							<div class="ml10">
								<label class="checkbox-inline ml10"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="1"><span class="check-span w40">星期日</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="2"><span class="check-span w40">星期一</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="3"><span class="check-span w40">星期二</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="4"><span class="check-span w40">星期三</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="5"><span class="check-span w40">星期四</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="6"><span class="check-span w40">星期五</span></label>
								<label class="checkbox-inline"><input type="checkbox" class="cron-rd-chk" name="week-checkbox" value="7"><span class="check-span w40">星期六</span></label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row mr5 pt5 pb0">
				<label class="filter-label">表达式：</label>
				<input type="text" class="form-control" name="cronExpression" readonly style="width:250px;display:inline-block;">
			</div>
		</div>
		
		<div class="cron-box none" id="cron-define">
			<!-- <p>1-7或SUN-SAT代表星期，其中1代表周日SUN</p>
			<p>对于一次性的定时调度规则，请务必加上年份</p>
			<p>定时任务的频次不能快于每5分钟一次</p>
			<table style="font: 11">
				<tr>
					<td width="70">字段域</td>
					<td width="120">允许的值</td>
					<td width="100">允许的字符</td>
				</tr>
				<tr>
					<td>秒</td>
					<td>0-59</td>
					<td>, - * /</td>
				</tr>
				<tr>
					<td>分</td>
					<td>0-59</td>
					<td>, - * /</td>
				</tr>
				<tr>
					<td>小时</td>
					<td>0-23</td>
					<td>, - * /</td>
				</tr>
				<tr>
					<td>日期</td>
					<td>1-31</td>
					<td>, - * ? / L W C</td>
				</tr>
				<tr>
					<td>月份</td>
					<td>1-12或JAN-DEC</td>
					<td>, - * /</td>
				</tr>
				<tr>
					<td>星期</td>
					<td>1-7或SUN-SAT</td>
					<td>, - * ? / L C #</td>
				</tr>
				<tr>
					<td>年(可选)</td>
					<td>留空 1970-2099</td>
					<td>, - * /</td>
				</tr>
			</table>
			<br />
			<p style="color: #800080">注意:日期和星期必须有一个为?问号</p>
			<p>例：</p>
			<p>'0 0 12 * * ?' 表示每天中午12点触发</p>
			<p>'0 0/5 14,18 * * ?'在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发</p> -->
			<img src="./img/cron-d.png" class="mt5 mb5"/>
			<div class="row mr5 pt5 pb0">
				<label class="filter-label">表达式：</label>
				<input type="text" class="form-control" name="cronExpression" style="width:250px;display:inline-block;">
			</div>
		</div>
	</div>
</div>
