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
} else if($log_viewer=='index') { ?>

    <div class="login_index">
    <?php
	if(isset($un_logged))   {
		echo $form;
		$this->my_load->set_css_file('login');
		$this->my_load->set_js_file('login');
		$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/login.js';
	}
	else if(isset($logged)) {
		echo '<div class="panel panel-warning"><div class="panel-heading"><span class="glyphicon glyphicon-warning-sign"></span> 提示信息</div><div class="panel-body">';
		echo $this->my_load->view('login',array('log_viewer' => 'logout'),TRUE);
		echo '</div></div>';
	}
    ?>
  </div>

<?php
} else if($log_viewer=='form') {?>

	<div class="panel panel-info">
		<div class="panel-heading">
			<h3 class="panel-title"><span class="glyphicon glyphicon-user"></span> 欢迎登录</h3>
		</div>
		<div class="panel-body">
			<div class="reg_log_form log_form">
				<form role="form" id="loginform" method="post" action="<?php echo site_url('login/submit');?>" target="loginframe">

					<div class="form-group">
						<input class="form-control log_username filled"  name="user_name" id="user_name" type="text" value="" placeholder="请输入用户名">
					</div>

					<div class="form-group">
						<input class="form-control log_password filled" name="user_pass"  id="user_pass"  type="password" value=""  placeholder="请输入密码">
					</div>

					<div class="form-group">
						<input class="form-control log_captcha filled" name="captcha"  id="captcha" type="text" value=""  autocomplete="off" placeholder="请输入验证码">
					</div>

					<div class="form-group">
						<img alt="点击刷新" id="login_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
						<label class="captcha_hint">看不清？点击刷新</label>
					</div>

					<div class="form-group">
						<button type="submit" name="log_submit"  id="log_submit" class="btn btn-danger btn-block">点击登录</button>
						<input type="hidden"  id="url_togo"  name="url_togo" value="<?php echo isset($url_togo)?$url_togo:'';?>" />
					</div>

					<div class="hidden">
						<input type="radio" class="radio" value="3650"  name="cookie_life"  checked="checked"  />
					</div>

					<div class="form-group">
						<label class="col-xs-4  col-sm-3 col-md-2 control-label"></label>
						<div class="col-xs-8  col-sm-9 col-md-10">
							<a id="forgot_pass" href="<?php echo site_url('lostpass');?>">忘记密码？</a>
							<a id="goto_register" href="javascript:void(0);">注册账号</a>
						</div>
					</div>

				</form>
			</div>

			<iframe id="loginframe" name="loginframe" class="hide"></iframe>

		</div>
	</div>

	<?php
} else if($log_viewer=='logout') {?>
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
