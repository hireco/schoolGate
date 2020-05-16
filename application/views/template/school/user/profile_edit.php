<div class="profile_form">
    <dl>
      <dt>电子邮件：</dt>
      <dd><input type="text"  class="text text_190 filled" name="email"  id="email"  value="<?php echo $email;?>" disabled="disabled" /></dd>
    </dl>
	<dl>
      <dt>个人称呼：</dt>
      <dd><input type="text"  class="text text_60  filled" name="called_name"  id="called_name"  value="<?php echo $called_name;?>" /></dd>
    </dl>                 
    <dl>
      <dt>网络昵称：</dt>
      <dd><input type="text"  class="text text_60" name="nick_name"  id="nick_name"  value="<?php echo $nick_name;?>" /></dd>
    </dl>
    <dl>
      <dt>真实姓名：</dt>
      <dd><input type="text"  class="text text_60" name="real_name"  id="real_name"  value="<?php echo $real_name;?>" /></dd>
    </dl>
    <dl>
      <dt>您的性别：</dt>
      <dd><input type="radio" class="radio" name="gender"  value="m"  <?php if($gender=='m')  echo 'checked="checked"';?>  /><label>男</label> <input class="radio" style="margin-left:20px;" type="radio" name="gender" value="f"  <?php if($gender=='f')  echo 'checked="checked"';?> /><label>女</label></dd>
    </dl>
    <dl>
      <dt>出生日期：</dt>
      <dd><input type="text"  class="text text_100" name="birthday"  id="birthday"  value="<?php echo $birthday;?>" /></dd>
    </dl>
    <dl>
      <dt>职业类型：</dt>
      <dd><input type="text"  class="text text_100" name="career"  id="career"  value="<?php echo $career;?>" /></dd>
    </dl>
    <dl>
      <dt>所在省份：</dt>
      <dd><input type="text"  class="text text_100" name="province"  id="province"  value="<?php echo $province;?>" /></dd>
    </dl>
    <dl>
      <dt>QQ号码：</dt>
      <dd><input type="text"  class="text text_100" name="qq"  id="qq"  value="<?php echo $qq;?>" /></dd>
    </dl>    
	<dl>
      <dt>手机号码：</dt>
      <dd><input type="text"  class="text text_100" name="cellphone"  id="cellphone"  value="<?php echo $cellphone;?>" /></dd>
    </dl>
    <dl>
      <dt>&nbsp;</dt>
      <dd><input type="button"  class="button" name="amend_submit"  id="amend_submit"  value="点击提交" /></dd>
    </dl>
    <div id="province_list" class="hide"><?php $this->user_model->provinces();?></div>
    <div id="career_list" class="hide"><?php $this->user_model->user_careers();?></div>
</div>
<script>
$(document).ready(function(){
	addcss2head('js/calendar/calendar-green.css');
    Calendar.setup({
		inputField     :    "birthday",
		ifFormat       :    "%Y-%m-%d",
		showsTime      :    false,
		timeFormat     :    "24"
	});
});
</script>    
