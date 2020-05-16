<div class="profile_form">

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">邮件地址</span>
            <input type="text"  class="form-control filled" name="email"  id="email"  value="<?php echo $email;?>" disabled="disabled" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">您的称呼</span>
            <input type="text"  class="form-control filled" name="called_name"  id="called_name"  value="<?php echo $called_name;?>" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">您的昵称</span>
            <input type="text"  class="form-control" name="nick_name"  id="nick_name"  value="<?php echo $nick_name;?>" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">您的真名</span>
            <input type="text"  class="form-control" name="real_name"  id="real_name"  value="<?php echo $real_name;?>" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">性别</span>
            <select name="gender" class="form-control">
                <option value="m" <?php if($gender=='m')  echo 'selected="selected"';?>>男</option>
                <option value="f" <?php if($gender=='f')  echo 'selected="selected"';?>>女</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">您的生日</span>
            <input type="text"  class="form-control" name="birthday"  id="birthday"  value="<?php echo $birthday;?>" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">来自地区</span>
             <select class="form-control" name="province">
                 <?php if(isset($province))  echo '<option value="'.$province.'" selected>'.$province.'</option>';?>
             </select>
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">来自地区</span>
            <select class="form-control" name="career">
                <?php if(isset($career))  echo '<option value="'.$career.'" selected>'.$career.'</option>';?>
            </select>
        </div>
    </div>

    <div id="province_list" class="hidden"><?php $this->user_model->provinces();?></div>
    <div id="career_list" class="hidden"><?php $this->user_model->user_careers();?></div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">qq号码</span>
            <input type="text"  class="form-control" name="qq"  id="qq"  value="<?php echo $qq;?>" />
        </div>
    </div>

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">手机号码</span>
            <input type="text"  class="form-control" name="cellphone"  id="cellphone"  value="<?php echo $cellphone;?>" />
        </div>
    </div>

    <div class="form-group">
        <input type="button"  class="btn btn-danger btn-block" name="amend_submit"  id="amend_submit"  value="点击提交" />
    </div>

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

    $('#called_name').on('change',function(){
        if($(this).val().length==0) {
            top_message('请输入您的称呼，例如张小姐，李先生');
            set_style($(this),'error');
        }
        else set_style($(this),'success');
    });

    $('#cellphone').on('change',function(){
        if($(this).val().length!=0 && !cellphone_check($(this).val())) {
            top_message('您输入的手机号码不正确');
            set_style($(this),'error');
        }
        else if($(this).val().length) set_style($(this),'success');
        else remove_style($(this));
    });

    $('#email').on('change',function(){
        if(!email_check($(this).val())) {
            top_message('您输入的邮件地址不正确');
            set_style($(this),'error');
        }
        else set_style($(this),'success');
    });

    $('#qq').on('change',function(){
        if($(this).val().length!=0 && !qq_check($(this).val())) {
            top_message('您输入的QQ号码不正确');
            set_style($(this),'error');
        }
        else if($(this).val().length) set_style($(this),'success');
        else remove_style($(this));
    });

    $('#nick_name').on('change',function(){
        if($(this).val().length) set_style($(this),'success');
        else remove_style($(this));
    });

    $('.province_item').each(function(){
        $('[name="province"]').append('<option value="'+$(this).text()+'">'+$(this).text()+'</option>');
    });

    $('.career_item').each(function(){
        $('[name="career"]').append('<option value="'+$(this).text()+'">'+$(this).text()+'</option>');
    });

    $('.profile_form :input').on('keyup',function(){
        if($.trim($(this).val()).length!=$(this).val().length) {
            top_message('不能输入空格！');
            $(this).val('');
            remove_style($(this));
        }
    });

    $('#amend_submit').on('click',function(event){
        if($(this).hasClass('disabled')) return false;
        setTimeout(profile_validation, 250);
        event.preventDefault();

    });
});
</script>    
