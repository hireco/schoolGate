$(document).ready(function(){
	
	$('.register_index #goto_login').click(function(){
		location.replace(json_str.base_url+'login');
	});
	
	$('.reg_username').on('change',function(){
		var obj=$(this);		
		
		if($.trim(obj.val())=='') {
			set_style(obj,'error');
			top_message('用户名不能为空');
			return false;
		}
		
		if($.trim(obj.val()).length>15 || $.trim(obj.val()).length<3) {
			set_style(obj,'error');
			top_message('用户名的长度必须在3~15个字符之间');
			return false;	
		}			
		
		if(speical_chars($.trim(obj.val()))) {
			set_style(obj,'error');
			top_message('用户名不能含有特殊字符！');
			return false;
		}
		//提示用户名最好为邮箱前缀
		if(email_check($('#email').val())) {
		   var email=$('#email').val().split('@');
		   if(email[0]!=obj.val()) 
		   top_message('您的用户名与您的邮箱前缀不一致，您将不能管理你的人事信息！','','warning');
		}
		
		$.ajax({
			type : 'post',
			data : 'user_name='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_username'),
			success : function(data,textStatus){
				 if(data=='1')  {
					 set_style(obj,'error');
					 top_message('该用户名已经占用');
				 }
				 else set_style(obj,'success');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
	
	$('.reg_password').on('change',function(){		
		$('.reg_password_cfm').val('');
		remove_style($('.reg_password_cfm'));
		
		if($(this).val().length<6) {
			top_message('密码长度至少是6个字符');
			set_style($(this),'error');
		}
		else 
			set_style($(this),'success');
	});
	
	$('.reg_password_cfm').on('change',function(){
		if($(this).val()!=$('#user_pass').val()) {
			top_message('两次输入的密码不一致');
			set_style($(this),'error');
		}
		else set_style($(this),'success');
	});
	
	$('#email').on('change',function(){
		var obj= $(this);
		
		if(!email_check(obj.val())) {
			top_message('您输入的邮件地址不正确');
			set_style(obj,'error');
			return false;
		} 
		
		$.post(get_url(json_str.base_url+'register/chk_email'),{email: obj.val()},function(data){
		    if(data=='0') {
			   set_style(obj,'error');
			   top_message('该邮件地址暂不能注册，请与管理员联系');
			}  
			else {
			   //提示用户名最好为邮箱前缀
		       var email=obj.val().split('@');
		       if(email[0]!=$('.reg_username').val()) 
		       top_message('您的用户名与您的邮箱前缀不一致，您将不能管理你的人事信息！','','warn');
			   set_style(obj,'success');
			}
		});
	});

	refresh_captcha('register_captcha_img');
	chk_captcha('captcha');

	$('.reg_log_form :input').on('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
			remove_style($(this));
		}
	});

    $('#reg_submit').click(function(event){
		if($(this).hasClass('disabled')) return false;
		setTimeout(register_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function register_validation() {
		var data,flag=1;
		var inputs = [];
		$('.reg_log_form :input').not(':radio,:button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) {
				top_message($(this).attr('placeholder'),'','error');
				set_style($(this),'error');
	      		flag=0;  return false;
			}
			
			if($(this).hasClass('error')) {
				flag=0;  return false;
			}
			
			if(!$(this).hasClass('filled')) {
				if($(this).val().length)  set_style($(this),'success');
				else remove_style($(this)); 
			}				
			else set_style($(this),'success');
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');
	    
	    data=data+'&gender='+$('[name="gender"]:checked').val()+'&reg_submit=register';

		$.ajax({
			type: 'post',
			url:   get_url(json_str.base_url+"register/submit"),
			data:  data,
			beforeSend: function() {
				$('#reg_submit').addClass('disabled');
				ajax_sending();
			},
			complete:function() {
				ajax_complete();
			},
			success : function(data,textStatus){
				try{
					var data=eval('(' + data + ')');
					if(data.result=='1') {
						spin_update('success');
						ajax_success(data,textStatus,json_str.base_url,'json');
					}
					else {
						spin_update('error');
						$('#reg_submit').removeClass('disabled');
						ajax_success(data,textStatus,'','json');
						//$('.reg_log_form :input.filled').val('');
					}
				}
				catch(err){
					spin_update('error');
					$('#reg_submit').removeClass('disabled');
					ajax_success('操作失败，请重试！',textStatus,'','string');
				}
			},
			error   : function(XMLHttpRequest, textStatus, errorThrown){
				spin_update('error');
				$('#reg_submit').removeClass('disabled');
				ajax_failed(textStatus);
			}
		});
	}
});