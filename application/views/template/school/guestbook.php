<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; 访客留言</div>
   <div class="page_div" id="guestbook_side">
     <?php $this->ads_model->show_ads(3);?>
   </div>
   <div class="page_div" id="guestbook_div">
    <div class="page_hint" id="guestbook_hint">访客留言</div>
    <div class="page_form" id="guestbook_form">
      <div class="form_item">
         <span>您的称呼</span><input name="guest_name" class="guest_name filled" type="text" value="<?php echo $this->check->get_user_nickname($this->session->userdata('user_id'),'admin');?>" />
      </div>
      <div class="form_item">
         <span>问题类型</span><input id="top_type" name="top_type" class="top_type filled" type="text"> &gt; <span style="display:none">留言子类型</span> <input id="sub_type" name="sub_type" class="sub_type filled" type="text" />
         <div id="top_types" class="hide"><?php $this->guest_model->top_types();?></div>
         <div id="sub_types" class="hide"><?php $this->guest_model->sub_types();?></div>
      </div>
      <div class="form_item">
         <span>您的电话</span><input name="guest_telephone" class="guest_telephone filled" type="text" value="" />
      </div>
      <div class="form_item">
         <span>留言主题</span><input name="guest_topic" class="guest_topic filled" type="text" value="" />
      </div>
      <div class="form_item"> 
         <span style="vertical-align:top">留言内容</span><textarea name="guest_content" class="guest_content filled"></textarea>
      </div>
      <div class="form_item">
        <span>验证码</span><input type="text" class="guest_captcha filled" name="captcha"  id="captcha"  value="" autocomplete="off"/> *看不清？请点击图片
      </div>
      <div class="form_item">
        <span></span><img alt="点击刷新" id="guestbook_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
      </div>
      <div class="form_item">
         <span></span><input type="button" class="button" value="提交留言" id="sub_guestbook" name="sub_guestbook" />
      </div>
    </div>
  </div>
</div>
<?php 
   $this->my_load->set_js_file('guestbook');
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/guestbook.js';
   $this->my_load->set_css_file('guestbook');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/guestbook.css';
?>
