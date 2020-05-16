<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; 我的账户</div>
  <div class="page_div" id="left_menu">
  
    <div class="menu_item current" id="user_profile">用户资料</div>
    <div class="menu_item" id="user_avatar">设置图像</div>
    <div class="href_item"><a href="<?php  echo site_url('people/'.$en_id);?>">我的简历</a></div>
    <div class="menu_item" id="user_innercms">内部信息</div>
    <div class="menu_item" id="user_guestbook">我的留言</div>
    <div class="menu_item" id="user_comment">我的评论</div>
  </div>
  <div class="page_div" id="current_heading">
    <div class="sub_menu_list"><span class="sub_menu sub_current" id="view_profile">我的资料</span><span class="sub_menu" id="edit_profile">编辑资料</span><span class="sub_menu" id="amend_pass">修改密码</span></div>
    <div id="ajax_loading">&nbsp;</div>
  </div>
  <div class="page_div" id="main_area"></div>
  <div class="hide">
    <div id="menu_profile"><span class="sub_menu sub_current" id="view_profile">我的资料</span><span class="sub_menu" id="edit_profile" >编辑资料</span><span class="sub_menu" id="amend_pass">修改密码</span></div>
    <div id="menu_avatar"><span class="sub_menu sub_current" id="show_avatar">我的图像</span><span class="sub_menu" id="upload_avatar">设置图像</span></div>
    <div id="menu_innercms"><span class="sub_menu  sub_current">内部信息</span></div>
	<div id="menu_guestbook"><span class="sub_menu  sub_current">我的留言</span></div>
    <div id="menu_comment"><span class="sub_menu  sub_current">我的评论</span></div>
  </div>
  <div class="clear-both"></div>
</div>
<?php 
   $this->my_load->set_js_file('user');
   $this->my_load->js_inc_t[]='js/calendar/calendar.js';
   $this->my_load->js_inc_t[]='js/pagination/jquery.pagination.js';
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/user.js';
   $this->my_load->set_css_file('user');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/user.css';
?>
