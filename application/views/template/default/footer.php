<div class="body" id="footer">
  <div class="footer_navi">	      
      <a href="<?php echo base_url();?>">首页</a> <span>|</span>
	  <a href="<?php echo site_url('cms');?>">信息中心</a> <span>|</span>
	  <a href="<?php echo site_url('guestbook');?>">访客留言</a> <span>|</span> 
      <a href="<?php echo site_url('register');?>">注册用户</a> <span>|</span> 
      <a href="<?php echo site_url('login');?>">用户登录</a> <span>|</span>
	  <a href="<?php echo site_url('user');?>">用户中心</a>
  </div>
  <div class="footer_text">
    <div>
      <?php if($organization=$this->myconfig->item('organization')) echo '<span>'.$organization.'</span>';?> 
      <?php if($address=$this->myconfig->item('address')) echo '<span>办公地点：'.$address.'</span>'; ?>        
    </div>
    <div>
      <?php if($main_telephone=$this->myconfig->item('main_telephone')) echo '<span>联系电话：'.$main_telephone.'</span>';?> 
      <?php if($fax=$this->myconfig->item('fax')) echo '<span>传真：'.$fax.'</span>';?>
      <?php if($email=$this->myconfig->item('email')) echo '<span>电子邮件：'.$email.'</span>';?>
    </div>
    <div>
      <?php if($copyright=$this->myconfig->item('copyright')) echo '<span>'.$copyright.'</span>';?>
    </div>
  </div>
</div>
<?php 
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/footer.css';
?>