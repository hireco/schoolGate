<div class="user_content">

    <div class="avatar-wrapper text-center"><img class="img-circle" src="<?php echo $avatar.'?'.time();?>" /></div>

    <?php $user_level_array=$this->config->item('user_level');?>

    <div class="user_info bg-success text-success">
        <div><span class="item_title">用户ID：</span><span class="item_value"><?php echo $uuid;?></span></div>
        <div><span class="item_title">账号：</span><span class="item_value"><?php echo $user_name;?></span></div>
        <div><span class="item_title">用户级别：</span><span class="item_value"><?php echo $user_level_array[$user_level];?></span> <?php echo $user_admin=='1'?'<a style="color:blue;" href="'.site_url($this->config->item('admin_dir')).'">后台管理</a>':'';?></div>
    </div>

    <div class="user_info bg-warning text-warning">
        <div><span class="item_title">网络昵称：</span><span class="item_value"><?php echo !$nick_name?'未填':$nick_name;?></span></div>
        <div><span class="item_title">个人称呼：</span><span class="item_value"><?php echo !$called_name?'未填':$called_name;?></span></div>
        <div><span class="item_title">真实姓名：</span><span class="item_value"><?php echo !$real_name?'未填':$real_name;?></span></div>
        <div><span class="item_title">性别：</span><span class="item_value"><?php echo $gender=='m'?'男':'女';?></span></div>
        <div><span class="item_title">出生年月：</span><span class="item_value"><?php echo !$birthday?'未填':$birthday;?></span></div>
    </div>

    <div class="user_info bg-danger text-danger">
        <div><span class="item_title">省份：</span><span class="item_value"><?php echo !$province?'未填':$province;?></span></div>
        <div><span class="item_title">职业：</span><span class="item_value"><?php echo !$career?'未填':$career;?></span></div>
        <div><span class="item_title">手机号码：</span><span class="item_value"><?php echo !$cellphone?'未填':$cellphone;?></span></div>
        <div><span class="item_title">QQ号：</span><span class="item_value"><?php echo !$qq?'未填':$qq;?></span></div>
        <div><span class="item_title">电子邮件：</span><span class="item_value"><?php echo !$email?'未填':$email;?></span></div>
    </div>

    <div class="user_info bg-info text-info">
        <div><span class="item_title">注册日期：</span><span class="item_value"><?php echo date('Y-m-d',$register_time);?></span></div>
        <div><span class="item_title">最新登录：</span><span class="item_value"><?php echo date('Y-m-d',$last_time);?></span></div>
        <div><span class="item_title">最新IP：</span><span class="item_value"><?php echo $last_ip;?></span></div>
        <div><span class="item_title">登录次数：</span><span class="item_value"><?php echo $login_times;?>次</span></div>
    </div>

</div>
<script>
    $('.item_value').each(function(){
        if($(this).text()=='未填')  $(this).css('color','gray');
    })
</script>

