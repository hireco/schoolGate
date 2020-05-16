<?php if($log_viewer=='ajax') { 	
	if(isset($logged)) {
		echo '<div class="quit_warning">';
       	echo $this->my_load->view('login',array('log_viewer' => 'logout'),TRUE);
       	echo '</div>'; 
	}else if(isset($un_logged)) { ?> 	   
	   <script type="text/javascript" src="<?php echo base_url().'js/template/'.SKIN_NAME.'/login.js';?>" charset="utf-8"></script> 
	   <?php echo $form; ?>
	   <div class="closer"></div>
	<?php }
} else if($log_viewer=='index') {?>
  <div class="body">
   <div class="page_div" id="log_reg_side">
    <?php $this->ads_model->show_ads(3);?>
   </div>
   <div class="page_div" id="log_reg_main"> 
   <div class="login_index">
   <?php 
       if(isset($un_logged))   {
       	  echo $form; 
       	  $this->my_load->set_js_file('login');
       	  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/login.js'; 
       }
       else if(isset($logged)) {
       	  echo '<div class="quit_warning">';
       	  echo $this->my_load->view('login',array('log_viewer' => 'logout'),TRUE);
       	  echo '</div>';
       }
   ?>
   <div class="clear-both"></div>  
  </div>
  </div>
  </div>
<?php    
} else if($log_viewer=='form') {?>
   <div class="login_hints">
    <div class="login">填写表单登录</div>
    <div class="register"><a href="<?php echo site_url('register');?>">没有注册？请点击注册</a></div>
    <div class="clear-both"></div>
   </div>
   <div class="reg_log_form log_form">
    <form id="loginform" method="post" action="<? echo site_url('fake');?>" target="loginframe">
    <dl>
      <dt>用户名：</dt>
      <dd><input type="text"  class="log_username filled" name="user_name"  id="user_name" /></dd>
    </dl>
    <dl>
      <dt>密 码：</dt>
      <dd><input type="password"  class="log_password filled" name="user_pass"  id="user_pass" /></dd>
    </dl>    
    <dl>
      <dt>验证码：</dt>
      <dd><input type="text"  class="log_captcha shorter filled" name="captcha"  id="captcha"  value="" autocomplete="off"/></dd>
    </dl>
    <dl>
      <dt> </dt>
      <dd class="captcha_dd"><img alt="点击刷新" id="login_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" /><div class="captcha_hint">看不清？点击图片刷新</div></dd>
    </dl>
    <dl>
      <dt>有效期：</dt>
      <dd>
        <input type="radio" class="radio" value="0" name="cookie_life"  /><label>即时</label>
        <input type="radio" class="radio" value="1" name="cookie_life"  /><label>一天</label>
        <input type="radio" class="radio" value="7"  name="cookie_life"  checked="checked"  /><label>一周</label>
        <input type="radio" class="radio" value="30" name="cookie_life" /><label>一月</label>
      </dd>
    </dl>
    <dl>
      <dt></dt>
      <dd>
        <input type="submit"  class="button" name="log_submit"  id="log_submit"  value="点击登录" />
		<a id="forgot_pass" href="<?php echo site_url('lostpass');?>">忘记密码？</a>
        <input type="hidden"  id="url_togo"  name="url_togo" value="<?php echo isset($url_togo)?$url_togo:'';?>" />
      </dd>
    </dl>    
    <div class="hint_for_switch">
      <p class="hint_text">
        <span>没有账号？</span>
        <span><label class="tiny_button" id="goto_register" >注 册</label></span>
      </p>
    </div>
    </form>    
   </div>
   <iframe id="loginframe" name="loginframe" class="hide"></iframe>
<?php 
} else if($log_viewer=='logout') {?>
   <div class="quit_hints">当前的状态为已登录，退出继续操作？</div>
   <div class="quit_buttons">
        <span class="dialog_button logout_link" id="logout_link">确 定</span>
        <span class="dialog_button goback_link" id="goback_link">返 回</span>
   </div>
<?php }?>
