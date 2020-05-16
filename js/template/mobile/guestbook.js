$(document).ready(function(){
	
	$('.guestbook_top_item').each(function(){
		$('.top_type').append('<li data-type="'+$(this).attr('id')+'"><a href="#">'+$(this).text()+'</a></li>');
	});

	$('.guestbook_sub_item').each(function(){
		$('.sub_type').append('<li '+ ($(this).closest('div').attr('id')=='sub_item_1'?'':'class="collapse"')+' data-type="'+$(this).closest('div').attr('id')+'"><a href="#">'+$(this).text()+'</a></li>');
	});

	$('.top_type li a').click(function(){
		var cur_type = $(this).parent().data('type');
		$('.sub_type li').each(function(){
			if($(this).data('type').replace('sub_','') == cur_type.replace('top_',''))
				$(this).removeClass('collapse');
			else
				$(this).addClass('collapse');
		});
		$('.top_type_text').text($(this).text());
		$('[name="top_type"]').val($(this).text());
		$('.sub_type_list').removeClass('hidden');
		remove_style($('[name="top_type"]'));
	});

	$('.sub_type li a').click(function(){
		$('.sub_type_text').text($(this).text());
		$('[name="sub_type"]').val($(this).text());
		remove_style($('[name="sub_type"]'));
	});

	refresh_captcha('guestbook_captcha_img');
	chk_captcha('captcha');
	
	$('#guestbook_form :input:not(textarea)').on('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
		}
	});

	$('#guestbook_form :input').on('change',function(){
		if($.trim($(this).val())=='') {
			top_message($(this).attr('placeholder'));
			set_style($(this),'error');
		}
		else remove_style($(this));
	});

	$('#sub_guestbook').click(function(event){
		if($(this).hasClass('disabled')) return false;
		setTimeout(guestbook_validation, 250); 
	    event.preventDefault();
	});
	
	function guestbook_validation() {
		var data,flag=1;
		var inputs = [];
		$('#guestbook_form :input').not(':button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) { 
				top_message($(this).attr('placeholder'),'','error');
				set_style($(this),'error');
	      		flag=0;  return false;
			}
			
			if($(this).hasClass('error')) {
				set_style($(this),'error');
				top_message('请检查表单输入');
				flag=0;
				return false;
			}
			else remove_style($(this));
			
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
			beforeSend: function() {
				$('#sub_guestbook').addClass('disabled');
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
	                	 //$('#guestbook_form :input').filter('.filled').val('');
						// refresh_captcha('guestbook_captcha_img');
						 success_show($('#guestbook_form'),'恭喜！留言发布成功！');
	                 }
					 else {
						 spin_update('error');
						 $('#sub_guestbook').removeClass('disabled');
					 }
	                 ajax_success(data,textStatus,'','json');                
	              } 
	 			 catch(err){
					 spin_update('error');
					 $('#sub_guestbook').removeClass('disabled');
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 			 },
	 	   error : function(XMLHttpRequest, textStatus, errorThrown){
			   spin_update('error');
			   $('#sub_guestbook').removeClass('disabled');
	 		     ajax_failed(textStatus);
	 		     }
	    });
	}
});