$(document).ready(function(){
	
	if(top.location.href!=json_str.login_url && !$('#url_togo').val()) 
		$('#url_togo').val(top.location.href.split('#').shift());
	
	$('.logout_link,.goback_link').live('click',function(){
		unblock_all();
		remove_pannel('reg_log_pannel');
	});
	
	$('.float_pannel #goto_register').click(function(){
		show_reg_pannel();
	});
	
	$('.login_index #goto_register').click(function(){
		location.replace(json_str.base_url+'register');
	});
	
	$('#login_captcha_img').click(function(){
        var cur_src=$(this).attr('src');
        cur_src=cur_src.split('?');
	    $(this).attr('src',cur_src[0]+'?'+Math.random());
    });
	
	$('.log_username').live('change',function(){
		if($.trim($(this).val())=='') {
			top_message('用户名不能为空');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});
	
	$('.log_password').live('change',function(){		
		if($.trim($(this).val())=='') {
			top_message('密码不能为空');
			set_style($(this),'error');
		}
		else remove_style($(this));
	});
	
	chk_captcha('captcha');
	
	$('#loginform').submit(function(){
		setTimeout(login_validation, 250); 
	    //event.preventDefault();
    });
	
	function login_validation() {
		var data,flag=1;
		var inputs = [];
		$('.reg_log_form :input').not(':radio,:button').each(function() {
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
	    
	    data=data+'&cookie_life='+$('[name="cookie_life"]:checked').val()+'&log_submit=login';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"login/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,data.url,'json');
	                 }
	                 else {
	                	 ajax_success(data,textStatus,'','json');
	                	 $('.reg_log_form .filled').val('');
	                 }
	              } 
	 			 catch(err){
	 				 //alert(data);
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		         ajax_failed(textStatus);
	 		      }
	    });
	}	
});