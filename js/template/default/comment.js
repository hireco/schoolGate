$(document).ready(function(){
	comment_page();
	
	$('.reply_comment').live('click',function(){
		var cur_id=$(this).closest('.comment_entry').attr('id').replace('comment_','');
		$.post(get_url(json_str.base_url+'comment/comment_form/'),{object_id:$('.for_id').val(),object_type: $('.for_type').val(),parent_id: cur_id}, function(data){
			$('.comment_form').html('');
			data='<div style="width:700px;">'+data+'</div><div class="closer"></div>';
			float_pannel('comment_pannel',data,'block','200');
		});
	});
	

	$('#comment_captcha_img').live('click',refresh_captcha);
	
	chk_captcha('comment_captcha');
	
	$('#comment_submit').live('click',function(event){
		
		setTimeout(comment_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function comment_validation() {
		var data;
		var inputs = [];
		
		if($.trim($('#comment_content').val())=='')  {
	    	top_message('留言正文未填写！');
      		return false;
	    }
	    
		if($.trim($('#comment_captcha').val())=='')  {
	    	top_message('验证码未填写！');
      		return false;
	    }
		
	    if($('#comment_captcha').hasClass('error')) {
	    	top_message('验证码填写错误！');
	    	return false;
	    }
	    else $('#comment_captcha').removeClass('error');
	    
		$('#my_comment_form :input').not(':button').each(function() {
			inputs.push(this.name + '=' + escape(this.value));
	    });
	    data=inputs.join('&');
	   
	    data=data+'&sub_comment=ajax';
	    
	    block_all('<div class="block_msg">正在提交中...</div>');
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"comment/comment_sub"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') { 
	                	 if($('.comment_form').html()) {
	                		 $('#comment_content').val('');
	                		 $('#comment_captcha').val('');
	                		 $('.form_ok').remove();
	                		 refresh_captcha();
	                	 }
	                	 else $('.float_pannel').remove();
	                 }
	                 ajax_success(data,textStatus,'','json');                
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
	 	   complete: function() { unblock_all(); }
	    });
	}
	
});

function refresh_captcha() {
	var obj=$('#comment_captcha_img');
	var cur_src=obj.attr('src');
    cur_src=cur_src.split('?');
    obj.attr('src',cur_src[0]+'?'+Math.random());
}

function comment_page_callback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.comment_entry').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.comment_entry').eq(i).show();
    }
    return false;
}

function comment_page() {
	var num_entries = $('.comment_entry').length; 
	
	addcss2head('js/pagination/pagination.css'); 
	
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: comment_page_callback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
        next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}