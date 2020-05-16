<div class="row" id="user_menu">
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_profile">
            <img class="img-responsive" src="<?php echo base_url();?>/skin/mobile/images/userProfile.png">
            <span>注册信息</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_avatar">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userAvatar.png">
            <span>设置图像</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="<?php  echo site_url('people/'.$en_id);?>" class="href_item icon_link" id="user_resume">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userResume.png">
            <span>个人简历</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_innercms">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userInfo.png">
            <span>内部信息</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_comment">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userComment.png">
            <span>个人评论</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_guestbook">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userMsg.png">
            <span>留言信息</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="#" class="menu_item icon_link" id="user_profile_password">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userPass.png">
            <span>修改密码</span>
        </a>
    </div>
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
        <a href="<?php  echo site_url('logout');?>" class="href_item icon_link" id="user_logout">
            <img class="img-responsive"  src="<?php echo base_url();?>/skin/mobile/images/userLogout.png">
            <span>注销登录</span>
        </a>
    </div>
</div>

<div class="collapse" id="user_main">
    <ul id="sub_menu_list" class="nav nav-tabs"></ul>
    <div id="user_area"></div>
</div>

<script>
    $(window).load (function(){
            $('body').addClass('darkred');
        }
    );
</script>

<div class="hidden">
    <div id="menu_profile">
        <li class="sub_menu active" id="view_profile" data-url="user/profile"><a href="javascript:void(0);">查看</a></li>
        <li class="sub_menu" id="edit_profile" data-url="user/profile/edit"><a href="javascript:void(0);">编辑</a></li>
        <li class="sub_menu" id="amend_pass" data-url="user/profile/password"><a href="javascript:void(0);">修改密码</a></li>
    </div>
    <div id="menu_avatar" class="nav nav-tabs">
        <li class="sub_menu active" id="show_avatar" data-url="user/avatar"><a href="javascript:void(0);">我的图像</a></li>
        <li class="sub_menu" id="upload_avatar" data-url="user/avatar/swf_avatar"><a href="javascript:void(0);">设置图像</a></li>
    </div>
    <div id="menu_innercms" class="nav nav-tabs">
        <li class="sub_menu  active"><a href="javascript:void(0);">内部信息</a></li>
    </div>
    <div id="menu_guestbook" class="nav nav-tabs">
        <li class="sub_menu  active"><a href="javascript:void(0);">我的留言</a></li>
    </div>
    <div id="menu_comment" class="nav nav-tabs">
        <li class="sub_menu  active"><a href="javascript:void(0);">我的评论</a></li>
    </div>
    <div id="menu_profile_password" class="nav nav-tabs">
        <li class="sub_menu  active"><a href="javascript:void(0);">修改密码</a></li>
    </div>

</div>

<?php 
   $this->my_load->set_js_file('user');
   $this->my_load->js_inc_t[]='js/calendar/calendar.js';
   $this->my_load->js_inc_t[]='js/pagination/jquery.pagination.js';
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/user.js';
   $this->my_load->set_css_file('user');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/user.css';
?>