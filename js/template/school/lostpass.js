$(document).ready(function(){
	
	$('.lostpass_form').ajaxStart(function(){
		$('#ajax_loading').addClass('ajax_loading');
    });
    
	$('.lostpass_form').ajaxComplete(function(){
		$('#ajax_loading').removeClass('ajax_loading');
    });
	
	$('#lostpass_captcha_img').click(function(){
        var cur_src=$(this).attr('src');
        cur_src=cur_src.split('?');
	    $(this).attr('src',cur_src[0]+'?'+Math.random());
    });
	
	$('#user_name').live('change',function(){
		if($.trim($(this).val())=='') {
			top_message('输入您的账号');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});
	
	$('#email').live('change',function(){
		if($(this).val().length!=0 && !email_check($(this).val())) {
			top_message('请输入正确的邮件地址!');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	chk_captcha('captcha');
	
	$('#new_password').live('change',function(){		
		$('#new_confirm').val('');
		remove_style($('#new_confirm'));
		
		if($(this).val().length<6) {
			top_message('至少输入6个字符');
			set_style($(this),'error');
		}
		else 
			set_style($(this),'ok');
	});
	
	$('#new_confirm').live('change',function(){
		if($(this).val()!=$('#new_password').val()) {
			top_message('两次输入的密码不一致！');
			set_style($(this),'error');
		}
		else set_style($(this),'ok');
	});
	
	$('#lostpass_submit').click(function(){
		setTimeout(lostpass_validation, 250); 
	    //event.preventDefault();
    });
	
	function lostpass_validation() {
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
	    
	    data=data+'&lostpass_submit=yes';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"lostpass/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	     	    	 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,data.url,'json');
	                 }
	                 else {
	                	 ajax_success(data,textStatus,'','json');
	                	 $('.lostpass_form .filled').val('');
	                 }
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请稍后重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
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
	        success : function(data,textStatus){     	     
	     	     try{ 
	     	    	 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,data.url,'json');
	                 }
	                 else {
	                	 ajax_success(data,textStatus,'','json');
	                	 $('.lostpass_form .filled').val('');
	                 }
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请稍后重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		         ajax_failed(textStatus);
	 		      }
	    });
	}
});