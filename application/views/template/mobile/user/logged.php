<label><?php $nickname=$this->session->userdata('nick_name'); echo $nickname?$nickname:$this->config->item('default_nickname');?>，您好，欢迎来到<?php echo $this->myconfig->item('site_name');?>！</label>
<a class="button" href="<?php echo site_url('user');?>">用户中心</a>
<span class="button logout_link">注销</span>

