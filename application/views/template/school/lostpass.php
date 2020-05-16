<?php 
 
 $this->my_load->set_js_file('lostpass');
 $this->my_load->set_css_file('lostpass');
 $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/lostpass.js'; 
 $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/lostpass.css';
 
if($viewer=='apply') {?>
<div class="body">
 <div class="page_div" id="lostpass_sidebar">
  <?php $this->ads_model->show_ads(3);?>
 </div>
 <div class="page_div" id="lostpass_mainbar">
   
  <div class="form_index">
    <div class="form_heading">
      <div class="title">您好！填写表单，系统将为您发送邮件</div>
      <div class="hint">提示：忘记您的注册邮件？联系管理员</div>
     </div>
     <div class="lostpass_form">     
     <dl>
       <dt>用户名：</dt>
       <dd><input type="text" name="user_name" id="user_name" class="filled" value="" />
       </dd>
     </dl>        
     <dl>
         <dt>邮件地址：</dt>
         <dd><input type="text" name="email" id="email" class="filled" value="" />
         </dd>
     </dl>
     <dl>
        <dt>验证码：</dt>
        <dd><input type="text"  class="shorter filled" name="captcha"  id="captcha"  value="" /></dd>
     </dl>        
     <dl>
      <dt> </dt>
      <dd class="captcha_dd">
	  <img alt="点击刷新" id="lostpass_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
	  <span class="captcha_hint">点击刷新验证码</span>
	  </dd>
     </dl>
     <dl>
        <dt></dt>
        <dd>
          <input type="button"  class="button" name="lostpass_submit"  id="lostpass_submit"  value="点击提交" />
          <span id="ajax_loading"></span>
        </dd>
     </dl>
  </div>
 </div>
 </div>
 <div class="clear-both"></div>
</div>
<?php } else if($viewer=='reset') {?>
<div class="body">
 <div class="page_div" id="lostpass_sidebar">
  <?php $this->ads_model->show_ads(3);?>
 </div>
 <div class="page_div" id="lostpass_mainbar">
 
  <div class="form_index">
    <div class="form_heading">
      <div class="title">请填写表单设置您的新密码</div>
	  <div class="hint">提示：不要将您的密码告诉其他人</div> 
     </div>
     <div class="lostpass_form">     
     <dl>
         <dt>新密码：</dt>
         <dd><input type="password" name="password" id="new_password" class="enterbox filled" value="" />
         </dd>
     </dl>        
     <dl>
         <dt>重复密码：</dt>
         <dd><input type="password" name="confirm" id="new_confirm" class="enterbox filled" value="" />
         </dd>
     </dl>
     <dl>
        <dt></dt>
        <dd>
          <input class="button" type="button" name="submit_change" id="submit_change" value="点击提交" />
          <span id="ajax_loading"></span>
          <input type="hidden" id="user_id" name="user_id" value="<?php echo $user_id?>" />
          <input type="hidden" id="user_key" name="user_key" value="<?php echo $user_key?>"  />
        </dd>
     </dl>
   </div>
  </div>
 </div>
</div>     
<?php } else if($viewer=='mail') {?>
<?php echo doctype(); ?>
<html>
<head>
<?php $this->my_load->view('meta'); ?>
</head>
<body>
  <div id="center_body">
    <div id="center_main">
     <div class="user_setting_main">
       <?php echo '尊敬的'.$user_name.'用户，您好！'; ?>      
       <br />
	   <br />
       <?php echo $click_for;?>
       <br />
	   <br />
       <?php echo $mylink; ?>       
       <br />
	   <br />
                    温馨提示：
       <br />
                    这封邮件含有您重置密码的页面的链接地址，请不要将它转发给其他人。
       <br /> 
                    链接的有效期是 <?php $seconds=$this->config->item('privacy_link_life'); $days=$seconds/(3600*24).'天'; ?>，请确保在有效期内访问该页面。
       <br />
	   <br />
       <div style="padding:5px; broder-top:1px dotted #cecece;">
       <br />            
                    来自<?php echo $this->myconfig->item('site_name');?>的邮件
       <br />
                    本邮件由系统自动发送，请勿回复此邮件！
	   <br />       
	                <a style="color:blue; text-decoration:underline;" href="http://<?php echo $this->myconfig->item('site_dns');?>"><?php echo $this->myconfig->item('site_dns');?></a>
       </div>
	 </div>
    </div>       
  </div>  
  <div id="footer" style="padding:20px;">
  <a href="<?php echo base_url();?>" target=_blank><img src="<?php echo base_url().'skin/'.SKIN_NAME.'/images/logo.gif'; ?>" border="0px" /></a>
  </div>
</body>
</html>
<?php } ?>
