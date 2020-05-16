<?php if($reg_viewer=='ajax') { 	
	if(isset($logged)) { 
		echo '<div class="quit_warning">';
       	echo $this->my_load->view('register',array('reg_viewer' => 'logout'),TRUE);
       	echo '</div>'; 
	}else if(isset($un_logged)) { ?>	   
	   <script type="text/javascript" src="<?php echo base_url();?>js/calendar/calendar.js" charset="utf-8"></script>
	   <script type="text/javascript" src="<?php echo base_url().'js/template/'.SKIN_NAME.'/register.js';?>" charset="utf-8"></script> 
	   <?php echo $form; ?>
	   <div class="closer"></div>
<?php }
} else if($reg_viewer=='index') {?>
  <div class="body">
  <div class="page_div" id="log_reg_side">
    <?php $this->ads_model->show_ads(3);?>
  </div>
  <div class="page_div" id="log_reg_main">
   <div class="register_index">
   <?php 
       if(isset($un_logged))   {
       	  echo $form;
       	  $this->my_load->set_js_file('register');
       	  $this->my_load->js_inc_t[]='js/calendar/calendar.js';
          $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/register.js';
       } 
       else if(isset($logged)) {
       	  echo '<div class="quit_warning">';
       	  echo $this->my_load->view('register',array('reg_viewer' => 'logout'),TRUE);
       	  echo '</div>';
       }
   ?>
   <div class="clear-both"></div>  
  </div>
  </div>
  </div>
<?php     
} else if($reg_viewer=='form') {
   if(!$this->myconfig->item('register_open')) {
  ?>
  <div style="font-size:16px; font-weight:bold;">对不起，本站暂停注册用户，请稍候再来！</div>
  <?php } else {?>
  <div class="register_hints"> </div>
   <div class="reg_log_form reg_form">
    <dl class="first">
      <dt>用户名：</dt>
      <dd><input type="text"  class="reg_username filled" name="user_name"  id="user_name"  value="" /></dd>
    </dl>
    <dl class="first">
      <dt>密 码：</dt>
      <dd><input type="password"  class="reg_password filled" name="user_pass"  id="user_pass"  value="" /></dd>
    </dl>
    <dl class="first">
      <dt>密码确认：</dt>
      <dd><input type="password"  class="reg_password_cfm filled" name="user_pass_cfm"  id="user_pass_cfm"  value="" /></dd>
    </dl>
    <dl class="first">
      <dt>电子邮件：</dt>
      <dd><input type="text"  class="filled" name="email"  id="email"  value="" /></dd>
    </dl>
	<dl class="first">
      <dt>个人称呼：</dt>
      <dd><input type="text"  class="shorter filled" name="called_name"  id="called_name"  value="" /></dd>
    </dl>           
    <dl class="both">
      <dt>验证码：</dt>
      <dd><input type="text"  class="shorter filled" name="captcha"  id="captcha"  value="" /></dd>
    </dl>
    <dl class="both">
      <dt> </dt>
      <dd><a id="switch_part" class="slide_down" href="javascript:void(0);">完善详细资料</a></dd>
    </dl>             
    <dl class="second">
      <dt>网络昵称：</dt>
      <dd><input type="text"  class="shorter" name="nick_name"  id="nick_name"  value="" /></dd>
    </dl>
	<dl class="second">
      <dt>真实姓名：</dt>
      <dd><input type="text"  class="shorter" name="real_name"  id="real_name"  value="" /></dd>
    </dl>
    <dl class="second">
      <dt>性别：</dt>
      <dd><input type="radio" class="radio" name="gender"  value="m"  checked="checked"  /><label>男</label> <input class="radio" style="margin-left:20px;" type="radio" name="gender" value="f" /><label>女</label></dd>
    </dl>
    <dl class="second">
      <dt>出生日期：</dt>
      <dd><input type="text"  name="birthday"  id="birthday"  value="" /></dd>
    </dl>
    <dl class="second">
      <dt>职业类型：</dt>
      <dd><input type="text"  name="career"  id="career"  value="" /></dd>
    </dl>
    <dl class="second">
      <dt>所在省份：</dt>
      <dd><input type="text"  name="province"  id="province"  value="" /></dd>
    </dl>
    <dl class="second">
      <dt>QQ号码：</dt>
      <dd><input type="text"  name="qq"  id="qq"  value="" /></dd>
    </dl>
    <dl class="second">
      <dt>手机号码：</dt>
      <dd><input type="text"  name="cellphone"  id="cellphone"  value="" /></dd>
    </dl>     
    <dl class="both">
      <dt></dt>
      <dd><input type="button"  class="button" name="reg_submit"  id="reg_submit"  value="提交注册" /></dd>
    </dl>
    <div class="captcha_div"><img alt="点击刷新" id="register_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" /><div class="captcha_hint">看不清？点击 图片刷新</div></div>
    <div class="hint_for_switch">
      <p class="hint_text">
        <span>已经有账号？</span>
        <span><label class="tiny_button" id="goto_login" >登 录</label></span>
      </p>
    </div>
    <div id="province_list" class="hide"><?php $this->user_model->provinces();?></div>
    <div id="career_list" class="hide"><?php $this->user_model->user_careers();?></div>    
   </div>
<?php }
} else if($reg_viewer=='logout') {
?>
     <div class="quit_hints">当前的状态为已登录，退出继续操作？</div>
     <div class="quit_buttons">
        <span class="dialog_button logout_link" id="logout_link">确 定</span>
        <span class="dialog_button goback_link" id="goback_link">返 回</span>
     </div>
<?php }?>
