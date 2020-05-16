$(document).ready(function(){
	
	$('#top_type, #sub_type').click(function(event){
		event.stopPropagation();
	});
	
	$('#top_type').click(function(){
        var obj=$(this);
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,$('#top_types').html(),'70');         
    });
	
	$('.guestbook_top_item').live('click',function(){
		var old=$('#guestbook_form .top_type').val();
		$('#top_type').val($(this).text());
		if(old!=$('#top_type').val()) $('#sub_type').val('');
	});
	
	$('#sub_type').click(function(){
        var obj=$(this);
        var cur_id=$('#top_types ul li:contains("'+$.trim($('#top_type').val())+'")').attr('id').replace('top','sub');
        var data=$('#'+cur_id).html();
        obj.blur();
        if(!$('#top_type').val()) simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,$('#top_types').html(),'70');
        else simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70');      
    });
	
	$('.guestbook_sub_item').live('click',function(){
		$('#sub_type').val($(this).text());
	});
	
	$('#guestbook_captcha_img').click(refresh_captcha);
	
	$('#captcha').live('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_captcha'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 top_message('验证码输入错误');
					 obj.addClass('error');
				 }
				 else obj.removeClass('error');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
	
	$('#guestbook_form :input:not(textarea)').live('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
		}
	});

	$('#sub_guestbook').click(function(event){
		
		setTimeout(guestbook_validation, 250); 
	    event.preventDefault();
	});
	
	function guestbook_validation() {
		var data,flag=1;
		var inputs = [];
		$('#guestbook_form :input').not(':button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) { 
				top_message('请输入'+$(this).prevAll().first().text());
				$(this).focus();
	      		flag=0;  return false;
			}
			
			if($(this).hasClass('error')) {
				top_message('请检查表单输入');
				flag=0;
				return false;
			}
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');
	    
	    data=data+'&sub_guestbook=yes';
	    
	    block_all('<div class="block_msg">正在提交中...</div>');
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"guestbook/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 $('#guestbook_form :input').filter('.filled').val('');
	                	 refresh_captcha();
	                 }
	                 ajax_success(data,textStatus,'','json');                
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 			 },
	 	   error : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		     ajax_failed(textStatus);
	 		     },
	 	   complete: function() { 
	 		     unblock_all(); 
	 		     }	      
	    });
	}
	
	function refresh_captcha() {
		var obj=$('#guestbook_captcha_img');
		var cur_src=obj.attr('src');
	    cur_src=cur_src.split('?');
	    obj.attr('src',cur_src[0]+'?'+Math.random());
	}
});