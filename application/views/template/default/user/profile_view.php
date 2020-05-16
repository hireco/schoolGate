<div class="profile_div">
   <div class="left_column">
     <div class="my_avatar"><img src="<?php echo $avatar.'?'.time();?>" /></div>
     <div class="agent_record"><span class="title">注册日期</span><span class="value"><?php echo date('Y-m-d',$register_time);?></span></div>
     <div class="agent_record"><span class="title">最新登录</span><span class="value"><?php echo date('Y-m-d',$last_time);?></span></div>
     <div class="agent_record"><span class="title">最新IP</span><span class="value"><?php echo $last_ip;?></span></div>
     <div class="agent_record"><span class="title">登录次数</span><span class="value"><?php echo $login_times;?>次</span></div>
   </div>
   <?php $user_level_array=$this->config->item('user_level');?>
   <div class="right_column">
    <div class="id">
     <div class="items"><span class="item_tag">用户ID：</span><span class="item_value"><?php echo $uuid;?></span></div> 
     <div class="items"><span class="item_tag">账号：</span><span class="item_value"><?php echo $user_name;?></span></div>
     <div class="items"><span class="item_tag">用户级别：</span><span class="item_value"><?php echo $user_level_array[$user_level];?></span> <?php echo $user_admin=='1'?'<a style="color:blue;" href="'.site_url($this->config->item('admin_dir')).'">进入后台管理</a>':'';?></div>
    </div>
    <div class="who"> 
     <div class="items"><span class="item_tag">网络昵称：</span><span class="item_value"><?php echo !$nick_name?'未填':$nick_name;?></span></div>    
     <div class="items"><span class="item_tag">个人称呼：</span><span class="item_value"><?php echo !$called_name?'未填':$called_name;?></span></div>
	 <div class="items"><span class="item_tag">真实姓名：</span><span class="item_value"><?php echo !$real_name?'未填':$real_name;?></span></div>
     <div class="items"><span class="item_tag">性别：</span><span class="item_value"><?php echo $gender=='m'?'男':'女';?></span></div>
     <div class="items"><span class="item_tag">出生年月：</span><span class="item_value"><?php echo !$birthday?'未填':$birthday;?></span></div>
    </div>
    <div class="where">
     <div class="items"><span class="item_tag">省份：</span><span class="item_value"><?php echo !$province?'未填':$province;?></span></div>
     <div class="items"><span class="item_tag">职业：</span><span class="item_value"><?php echo !$career?'未填':$career;?></span></div>
     <div class="items"><span class="item_tag">手机号码：</span><span class="item_value"><?php echo !$cellphone?'未填':$cellphone;?></span></div>
     <div class="items"><span class="item_tag">QQ号：</span><span class="item_value"><?php echo !$qq?'未填':$qq;?></span></div>
     <div class="items"><span class="item_tag">电子邮件：</span><span class="item_value"><?php echo !$email?'未填':$email;?></span></div>
    </div> 
   </div>
   <div class="clear-both"></div>
</div>

