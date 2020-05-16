$(document).ready(function(){
   
   if(top.location.href!=json_str.admin_login_url && !$('#url_togo').val()) 
	 $('#url_togo').val(top.location.href.split('#').shift());	
   
   $('.logout_link').live('click',function(){
	    $.get(get_url(json_str.admin_base+'logout/ajax'),function(data){
			if(data=='1') 
				top_message('正在退出，稍候......',my_reload,'okay');
			else 
				top_message('您没有登录，无需退出！',my_reload,'warn');
		});
	});
	
	$('.goback_link').live('click',function(){
		history.go(-1);
	});
   
   $('#admin_captcha_img').click(function(){
         var cur_src=$(this).attr('src');
         cur_src=cur_src.split('?');
	     $(this).attr('src',cur_src[0]+'?'+Math.random());
   });

   if(!$('.float_pannel').length)  {
	   $('.admin_dir_warning').fadeIn(1000);
	   $('.close_warning').click(function(){
		   $(this).parent().fadeOut('fast');
	   });
   }
   
   $('#loginform').submit(function(){
	     submit_login();
   });   
});

function submit_login(){
	   var data,flag=1;
	   var inputs = [];
	   $('.admin_login_form :input').each(function() {
   	      if($(this).val()=='' && $(this).hasClass('filled')) { 
   		  $(this).css({'border':'1px solid red'});
   		  top_message('表单尚未填写完整'); 
				 flag=0; return false;
		  }
   	      $(this).removeAttr('style');
   	      inputs.push(this.name + '=' + escape(this.value));
       });
	   
	   if(!flag) return false;
       data=inputs.join('&');
    
       $.ajax({
   	     type: 'post',
         url:   get_url(json_str.admin_base+'login/submit'),
		 cache: false,
         data:  data,
         success : function(data,textStatus){ 
				 try{ 
	                data=eval('(' + data + ')');
					ajax_success(data,textStatus,'','json');
					if(data.result=='1') 
						window.location.href=get_url(data.url);
                 } 
				 catch(err){
	                ajax_success('暂时不能登录，请重试！',textStatus,'','string');
	             }
		 },
		 error  : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
      });
}