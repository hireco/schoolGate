<?php if($log_viewer=='index') { ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html>
    <head>
        <?php
        $meta = array(
            array('name' => 'robots', 'content' => 'no-cache'),
            array('name' => 'Content-Language', 'content' => $this->config->item('language'), 'type' => 'equiv'),
            array('name' => 'Content-type', 'content' => 'text/html; charset='.$this->config->item('charset'), 'type' => 'equiv')
        );
        echo  meta($meta);
        ?>
        <title>后台管理系统登陆</title>
        <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>skin/admin/css/main.css" />
        <?php
        if(isset($cssmin)) echo $cssmin;
        //css includes
        foreach($this->config->item('admin_big_js') as $index => $value)
            echo "<script type=\"text/javascript\" src=\"".base_url().$value."\" charset=\"utf-8\"></script>\n";
        //big js list
        if(isset($js)&&is_array($js)) foreach($js as $index => $value)
            echo "<script type=\"text/javascript\" src=\"".$value."\" charset=\"utf-8\"></script>\n";
        //js which can not be joined
        echo $this->minify->js_mini('',TRUE,'common','common_admin_js');
        //js commonly used by adminnistrator  
        if(isset($jsmin)) echo $jsmin;
        //js includes
        ?>
    </head>
    <body class="login-body">
    <div class="admin_login_form" id="body"><?php echo $form;?></div>
    <div class="login_power_by">
        <span>Powered by </span><a href="<?php echo base_url();?>"><?php echo $this->myconfig->item('site_dns');?></a>
        <span>技术支持：</span><a href="<?php echo base_url();?>"><?php echo $this->config->item('support_company');?></a>
    </div>
    </body>
    </html>

<?php } else if($log_viewer=='ajax') {?>

    <script type="text/javascript" src="<?php echo base_url();?>js/admin/myjquery-adminlogin.js" charset="utf-8"></script>

    <div class="admin_login_form"><?php echo $form; ?></div>

    <div class="closer"></div>

<?php } else if($log_viewer=='form') {?>

    <div class="admin_login_head">
        <h2>管理员登录</h2>
        <a href="<?php echo site_url();?>">返回系统主页</a>
        <?php if($this->config->item('admin_dir')=='admin') {?>
            <div class="admin_dir_warning">
                <span>管理目录为默认目录admin，建议把它修改为其它的，那样会更安全！</span>
                <span class="close_warning"></span>
            </div>
        <?php }?>
    </div>

    <div class="form">

        <form id="loginform" method="post" action="<? echo site_url('fake');?>" target="loginframe">

            <dl class="login_items">

                <dt>用户名：</dt>

                <dd><input type="text" class="login_input filled"  name="username_to_login" id="username_to_login" /></dd>

            </dl>

            <dl class="login_items">

                <dt>密  码：</dt>

                <dd><input type="password" class="login_input filled" name="password_to_login"  id="password_to_login" /></dd>

            </dl>

            <?php if($this->myconfig->item('admin_captcha')) { ?>

                <dl class="login_items">

                    <dt>验证码：</dt>

                    <dd><input type="text" class="captcha_input filled" name="captcha_to_login"  id="captcha_to_login" autocomplete="off" /></dd>

                </dl>

                <div class="captcha_div"><img alt="点击刷新" id="admin_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" /></div>

            <?php }?>

            <dl class="login_items">

                <dt></dt>

                <dd><input type="submit"  class="login_button" value="登 录" id="admin_login_submit" name="admin_login_submit" /></dd>

            </dl>

            <input type="hidden" name="url_togo" id="url_togo" value="<?php echo isset($url_togo)?$url_togo:'';?>" />

            <div class="clear-both"></div>

        </form>

    </div>

    <iframe id="loginframe" name="loginframe" class="hide"></iframe>

    <?php

} else if($log_viewer=='logout') {?>

    <div style="padding-bottom:20px; font-size:14px;">当前的状态为已登录，退出继续操作？</div>

    <div>

        <input type="button"  class="my_button logout_link" id="logout_link" value="确 定" />

        <input type="button"  class="my_button goback_link" id="goback_link" value="返 回" />

    </div>

<?php }?>