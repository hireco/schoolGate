<?php if($reg_viewer=='ajax') { 	
	if(isset($logged)) { 
		echo '<div class="quit_warning">';
       	echo $this->my_load->view('register',array('reg_viewer' => 'logout'),TRUE);
       	echo '</div>'; 
	}else if(isset($un_logged)) { ?>
	   <script type="text/javascript" src="<?php echo base_url().'js/template/'.SKIN_NAME.'/register.js';?>" charset="utf-8"></script> 
	   <?php echo $form; ?>
	   <div class="closer"></div>
    <?php }
} else if($reg_viewer=='index') { ?>
    <div class="register_index">
        <?php
        if(isset($un_logged))   {
            echo $form;
            $this->my_load->set_js_file('register');
            $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/register.js';
        }
        else if(isset($logged)) {
            echo '<div class="panel panel-warning"><div class="panel-heading"><span class="glyphicon glyphicon-warning-sign"></span> 提示信息</div><div class="panel-body">';
            echo $this->my_load->view('register',array('reg_viewer' => 'logout'),TRUE);
            echo '</div></div>';
        }
        ?>
    </div>
    <?php
} else if($reg_viewer=='form') {
   if(!$this->myconfig->item('register_open')) {
  ?>
       <div style="block-center">对不起，本站暂停注册用户，请稍候再来！</div>
   <?php } else {?>

       <div class="panel panel-info">
           <div class="panel-heading">
               <h3 class="panel-title"><span class="glyphicon glyphicon-user"></span> 欢迎注册</h3>
           </div>
           <div class="panel-body">
               <div class="reg_log_form reg_form">
                   <form role="form"  method="post" action="<?php echo site_url('sorry');?>">

                       <div class="form-group">
                           <input class="reg_username form-control filled"  name="user_name" id="user_name" type="text" value="" required placeholder="请输入用户名">
                       </div>
                       <div class="form-group">
                           <input class="reg_password form-control filled"  name="user_pass"  id="user_pass"  type="password" value="" required placeholder="请输入密码">
                       </div>
                       <div class="form-group">
                           <input class="reg_password_cfm form-control filled" name="user_pass_cfm"  id="user_pass_cfm"  type="password" value="" required placeholder="请确认密码">
                       </div>
                       <div class="form-group">
                           <input class="form-control filled" name="email"  id="email" type="email" value="" required  placeholder="请输入电子邮件地址" >
                       </div>
                       <div class="form-group">
                           <input class="form-control filled" name="captcha"  id="captcha" type="text" value="" required placeholder="请输入验证码">
                       </div>
                       <div class="form-group">
                           <img alt="点击刷新" id="register_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
                           <label class="captcha_hint">看不清？点击刷新</label>
                       </div>
                       <div class="form-group">
                           <button type="submit" name="reg_submit"  id="reg_submit" class="btn btn-danger btn-block">点击注册</button>
                       </div>
                       <div class="form-group">
                           <a  id="goto_login"  href="javascript:void(0);">点击登录</a>
                       </div>

                   </form>
               </div>

           </div>
       </div>

   <?php }
} else if($reg_viewer=='logout') {
?>
    <div class="bg-warning text-warning">当前的状态为已登录，退出继续操作？</div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <button class="btn btn-block btn-warning logout_link" id="logout_link">退 出</button>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <button class="btn btn-block btn-primary goback_link" id="goback_link">取 消</button>
            </div>
        </div>
    </div>
<?php }?>
