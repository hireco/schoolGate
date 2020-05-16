$(document).ready(function(){
	
	//菜单显示设置
	$('#header_navi .center a').mouseover(function(){
		
		var cur_id=$(this).attr('id');
		cur_id=cur_id.replace('_navi','_sub');
		$('#header_navi .center a').css('color','#ffffff');
        $(this).css('color','gold');
		
        if($('#'+cur_id).length) {
			$('.navi_bottom_link').hide();
			$('#'+cur_id).show();
		} else 	
			$('.navi_bottom_link').hide();
		
	});
	
	if($('.reg_log_form').filter('.reg_form').length) $('#register_button').hide();
	
	$('#register_button').click(function(){
		show_reg_pannel();
	});
	
	$('#login_button').click(function(){
		show_log_pannel();
	});
	
	$('#chkstr').click(function(){
	   var left= Math.round($(this).offset().left);
	   var top = Math.round($(this).offset().top+20);
	   $('#chkimg').remove();
	   $('#body').append('<img id="chkimg" src="'+json_str.base_url+'chkimg/?rnd='+Math.random()+'" />');
	   $('#chkimg').css({'left': left+'px' ,'top' : top + 'px'}).show();
	});
	
	$('#chkstr').blur(function(){
		$('#chkimg').slideUp();
	});
	
	$('#header :input').not('#chkstr').change(function(){
		if($.trim($(this).val())=='') easy_css_msg($(this),'error');
		else easy_css_msg($(this),'ok');
	});
	
	chk_imgstr('chkstr');
	
	$('#login_submit').click(function(event){
		
		setTimeout(slogin_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function slogin_validation() {
		
		var data,flag=1;
		
		$('#header :input').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) { 
				easy_css_msg($(this),'error');
				top_message('请填写完整再提交');  
				flag=0;
				return false;
			}
			
			if($(this).hasClass('error')) {
				top_message('填写有错误，请检查！');
				flag=0;  return false;
			}
		});
		
		if(!flag) return false;
	    
	    data='user_name='+$('#username').val()+'&user_pass='+$('#password').val()+'&captcha='+$('#chkstr').val()+'&log_submit=slogin';
	    data=data+'&ajax=1';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"login/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,json_str.base_url,'json');
	                 }
	                 else ajax_success(data,textStatus,'','json');                
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

function easy_css_msg(obj,type) {
	if(type=='error') 
		obj.addClass('error');	
	else 
		obj.removeClass('error');
}

function chk_imgstr(obj_id) {
	if(!arguments[0]) obj_id='chkstr';
	$('#'+obj_id).live('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'chkimg/input_chk'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 easy_css_msg(obj,'error');
				 }
				 else easy_css_msg(obj,'ok');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
}
