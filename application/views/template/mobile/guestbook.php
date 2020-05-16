 <div class="panel panel-info">
     <div class="panel-heading">
      <h3 class="panel-title"><span class="glyphicon glyphicon-pencil"></span> 访客留言</h3>
     </div>
     <div class="panel-body">
      
	    <form id="guestbook_form">
			
			<div class="form-group">
			  <input class="form-control filled"  name="guest_name" type="text" value="" required placeholder="请输入您的名称">
			</div>
			<div class="form-group">
			  <input class="form-control filled"  name="guest_telephone" type="tel" value="" required placeholder="请输入联系电话">
			</div>

			<div class="form-group">
				<div class="btn-group">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
						<span class="top_type_text">留言类型</span> <span class="caret"></span>
					</button>
					<ul class="dropdown-menu top_type"></ul>
				</div>
				<div class="btn-group hidden sub_type_list">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
						<span class="sub_type_text">相关主题</span> <span class="caret"></span>
					</button>
					<ul class="dropdown-menu sub_type"></ul>
				</div>
				<div id="top_types" class="hidden"><?php $this->guest_model->top_types();?></div>
				<div id="sub_types" class="hidden"><?php $this->guest_model->sub_types();?></div>
				<input type="hidden" name="top_type" class="filled" placeholder="请选择留言类型">
				<input type="hidden" name="sub_type" class="filled" placeholder="请选择相关主题">
			</div>

			<div class="form-group">
			  <input class="form-control filled" name="guest_topic" type="text" value="" required placeholder="请输入留言题目">
			</div>
			<div class="form-group">
			  <textarea class="form-control filled"  name="guest_content" row="5" required placeholder="请输入留言内容"></textarea>
			</div>
			<div class="form-group">
			  <input class="form-control filled" name="captcha"  id="captcha" type="text" value="" required placeholder="请输入验证码">
			</div>
			<div class="form-group">
			  <img alt="点击刷新" id="guestbook_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
				 <label class="captcha_hint">看不清？点击刷新</label>
			</div>    
			
			<div class="form-group">
			  <button type="submit" id="sub_guestbook" name="sub_guestbook" class="btn btn-danger btn-block">提交留言</button>
			</div>

			</form>
     </div>

   </div>
 <?php
 $this->my_load->set_js_file('guestbook');
 $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/guestbook.js';
 $this->my_load->set_css_file('guestbook');
 ?>