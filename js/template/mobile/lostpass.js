$(document).ready(function(){
	
	$('#user_name').on('change',function(){
		if($.trim($(this).val())=='') {
			top_message('输入您的账号');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});
	
	$('#email').on('change',function(){
		if($(this).val().length!=0 && !email_check($(this).val())) {
			top_message('请输入正确的邮件地址!');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'success');
		else remove_style($(this));
	});

	refresh_captcha('lostpass_captcha_img');
	chk_captcha('captcha');
	
	$('#new_password').on('change',function(){		
		$('#new_confirm').val('');
		remove_style($('#new_confirm'));
		
		if($(this).val().length<6) {
			top_message('至少输入6个字符');
			set_style($(this),'error');
		}
		else 
			set_style($(this),'success');
	});
	
	$('#new_confirm').on('change',function(){
		if($(this).val()!=$('#new_password').val()) {
			top_message('两次输入的密码不一致！');
			set_style($(this),'error');
		}
		else set_style($(this),'success');
	});
	
	$('#lostpass_submit').click(function(){
		if($(this).hasClass('disabled')) return false;
		setTimeout(lostpass_validation, 250); 
	    //event.preventDefault();
    });

	function lostpass_validation() {
		var data,flag=1;
		var inputs = [];
		$('.lostpass_form :input').not(':button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) {
				top_message($(this).attr('placeholder'),'','error');
				set_style($(this),'error');
				flag=0;  return false;
			}

			if($(this).hasClass('error')) {
				flag=0;  return false;
			}

			inputs.push(this.name + '=' + escape(this.value));
		});

		if(!flag) return false;
		data=inputs.join('&');

		data=data+'&lostpass_submit=yes';

		$.ajax({
			type: 'post',
			url:   get_url(json_str.base_url+"lostpass/submit"),
			data:  data,
			beforeSend: function() {
				$('#lostpass_submit').addClass('disabled');
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
						success_show($('.lostpass_form').parent(),'恭喜！邮件已成功发送您的邮箱！');
					}
					else {
						spin_update('error');
						$('#lostpass_submit').removeClass('disabled');
						//$('.lostpass_form .filled').val('');
					}
					ajax_success(data,textStatus,'','json');
				}
				catch(err){
					spin_update('error');
					$('#lostpass_submit').removeClass('disabled');
					ajax_success('操作失败，请稍后重试！',textStatus,'','string');
				}
			},
			error   : function(XMLHttpRequest, textStatus, errorThrown){
				spin_update('error');
				$('#lostpass_submit').removeClass('disabled');
				ajax_failed(textStatus);
			}
		});
	}
	
	$('#submit_change').click(function(){
		setTimeout(changepass_validation, 250); 
	    //event.preventDefault();
    });
	
	function changepass_validation() {
		var data,flag=1;
		var inputs = [];
		$('.lostpass_form :input').not(':button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) { 
				set_style($(this),'error');
	      		flag=0;  return false;
			}
			
			if($(this).hasClass('error')) {
				flag=0;  return false;
			}
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');

		$.ajax({
			type: 'post',
			url:   get_url(json_str.base_url+"lostpass/change"),
			data:  data,
			beforeSend: function() {
				$('#submit_change').addClass('disabled');
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
						ajax_success(data,textStatus,data.url,'json');
					}
					else {
						spin_update('error');
						$('#submit_change').removeClass('disabled');
						ajax_success(data,textStatus,'','json');
						$('.lostpass_form .filled').val('');
					}
				}
				catch(err){
					spin_update('error');
					$('#submit_change').removeClass('disabled');
					ajax_success('操作失败，请稍后重试！',textStatus,'','string');
				}
			},
			error   : function(XMLHttpRequest, textStatus, errorThrown){
				spin_update('error');
				$('#submit_change').removeClass('disabled');
				ajax_failed(textStatus);
			}
		});
	}
});