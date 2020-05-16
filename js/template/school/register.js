$(document).ready(function(){
	
	if(top.location.href!=json_str.register_url && !$('#url_togo').val()) 
		$('#url_togo').val(top.location.href);
	
	$('.logout_link,.goback_link').live('click',function(){
		unblock_all();
		remove_pannel('reg_log_pannel');
	});
	
	$('.float_pannel #goto_login').click(function(){
		show_log_pannel();
	});
	
	$('.register_index #goto_login').click(function(){
		location.replace(json_str.base_url+'login');
	});
	
	$('#switch_part').click(function(){
	    var cur_str=$(this).text();
		$('.reg_log_form .second').toggle();
		$(this).toggleClass('slide_down');
		$(this).toggleClass('slide_up');
		$('.register_hints').toggleClass('reg_details_hints');
		$(this).text(cur_str=='完善详细资料'?'关闭详细资料':'完善详细资料');
	});
	
	$('#register_captcha_img').click(function(){
        var cur_src=$(this).attr('src');
        cur_src=cur_src.split('?');
	    $(this).attr('src',cur_src[0]+'?'+Math.random());
    });
	
	$('.reg_username').live('change',function(){
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
		   top_message('您的用户名与您的邮箱前缀不一致，您将不能管理你的人事信息！','','warn');
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
				 else set_style(obj,'ok');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
	
	$('.reg_password').live('change',function(){		
		$('.reg_password_cfm').val('');
		remove_style($('.reg_password_cfm'));
		
		if($(this).val().length<6) {
			top_message('密码长度至少是6个字符');
			set_style($(this),'error');
		}
		else 
			set_style($(this),'ok');
	});
	
	$('.reg_password_cfm').live('change',function(){
		if($(this).val()!=$('#user_pass').val()) {
			top_message('两次输入的密码不一致');
			set_style($(this),'error');
		}
		else set_style($(this),'ok');
	});
	
	$('#called_name').live('change',function(){
		if($(this).val().length==0) {
			top_message('请输入您的称呼，例如张小姐，李先生');
			set_style($(this),'error');
		}
		else set_style($(this),'ok');
	});
	
	$('#cellphone').live('change',function(){
		if($(this).val().length!=0 && !cellphone_check($(this).val())) {
			top_message('您输入的手机号码不正确');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#email').live('change',function(){
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
			   set_style(obj,'ok');
			}
		});
	});
	
	$('#qq').live('change',function(){
		if($(this).val().length!=0 && !qq_check($(this).val())) {
			top_message('您输入的QQ号码不正确');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#birthday').live('change',function(){
    	if($(this).val().length!=0 && !date_check($(this).val())) {
    		top_message('您输入的日期不正确');
			set_style($(this),'error');
    	}
    	else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
    });
	
	chk_captcha('captcha');
	
	$('#nick_name,#real_name').live('change',function(){
		if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#career').click(function(){
        var obj=$('#career');
        var data=$('#career_list').html();
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70');         
    });
	
	$('.career_item').live('click',function(){
		$('#career').val($(this).text());
	});
	
	$('#province').click(function(){
        var obj=$('#province');
        var data=$('#province_list').html();
        obj.blur();        
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'300','150');         
    });
	
	$('.province_item').live('click',function(){
		$('#province').val($(this).text());
	});
	
	$('#career,#province').click(function(event){
		event.stopPropagation();
	});
	
	if($('#birthday').length) {
		addcss2head('js/calendar/calendar-green.css');
	    Calendar.setup({
				inputField     :    "birthday",
				ifFormat       :    "%Y-%m-%d",
				showsTime      :    false,
				timeFormat     :    "24"
		});
	}    

	$('.reg_log_form :input').live('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
			remove_style($(this));
		}
	});

    $('#reg_submit').click(function(event){
		
		setTimeout(register_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function register_validation() {
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
			
			if(!$(this).hasClass('filled')) {
				if($(this).val().length)  set_style($(this),'ok');
				else remove_style($(this)); 
			}				
			else set_style($(this),'ok');
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');
	    
	    data=data+'&gender='+$('[name="gender"]:checked').val()+'&reg_submit=register';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"register/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 $('.register_hints').addClass('reg_ok_hints');
	                	 ajax_success(data,textStatus,json_str.base_url,'json');
	                 }
	                 else ajax_success(data,textStatus,'','json');                
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		         ajax_failed(textStatus);
	 		      }
	    });
	}
});