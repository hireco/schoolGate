$(document).ready(function(){
	
	$('.login_index #goto_register').click(function(){
		location.replace(json_str.base_url+'register');
	});

	$('.log_username').on('change',function(){
		if($.trim($(this).val())=='') {
			toastr.info('用户名不能为空');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});
	
	$('.log_password').on('change',function(){
		if($.trim($(this).val())=='') {
			toastr.info('密码不能为空');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});

	refresh_captcha('login_captcha_img');
	chk_captcha('captcha');
	
	$('#loginform').submit(function(){
		if($(this).hasClass('disabled')) return false;
		setTimeout(login_validation, 250); 
	    event.preventDefault();
    });
	
	function login_validation() {
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
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');
	    
	    data=data+'&cookie_life='+$('[name="cookie_life"]:checked').val()+'&log_submit=login';

		$.ajax({
			type: 'post',
			url:   get_url(json_str.base_url+"login/submit"),
			data:  data,
			beforeSend: function() {
				$('#log_submit').addClass('disabled');
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
						$('#log_submit').removeClass('disabled');
						ajax_success(data,textStatus,'','json');
						//$('.reg_log_form :input.filled').val('');
					}
				}
				catch(err){
					//alert(data);
					spin_update('error');
					$('#log_submit').removeClass('disabled');
					ajax_success('操作失败，请重试！',textStatus,'','string');
				}
			},
			error   : function(XMLHttpRequest, textStatus, errorThrown){
				spin_update('error');
				$('#log_submit').removeClass('disabled');
				ajax_failed(textStatus);
			}
		});
	}	
});