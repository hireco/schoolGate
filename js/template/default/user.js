var cur_photo;
var total_photos;

$(document).ready(function() {
	
	//左边栏和导航菜单的部分开始
	
	$('#main_area').ajaxStart(function(){
		$('#ajax_loading').addClass('ajax_loading');
    });
    
	$('#main_area').ajaxComplete(function(){
		$('#ajax_loading').removeClass('ajax_loading');
    });
	
	$('#main_area').ajaxError(function(){
		$('#main_area').html('').addClass('loading_failed');
    });
	
	$('#main_area').ajaxSuccess(function(){
		$('#main_area').removeClass('loading_failed');
		$('.profile_div span:contains("未填")').css('color','#EE9572');
    });
	
	$.post(get_url(json_str.base_url+$('.menu_item').filter('.current').attr('id').replace('_','/')),function(data){
		if(data) $('#main_area').html(data);
	});
	
	$('.menu_item').click(function(){
		var cur_action=$(this).attr('id').replace('_','/');
		var cur_menu=$(this).attr('id').replace('user','menu');
		if($(this).hasClass('current')) return false;
		
		$('.menu_item').removeClass('current');
		$(this).addClass('current');
		
		$('.sub_menu_list').html($('#'+cur_menu).html());
		
		$.post(get_url(json_str.base_url+cur_action),function(data){
			if(data) $('#main_area').html(data);
		});
	});
	
	$('.sub_menu_list .sub_menu').live('click',function(){
		$('.sub_menu_list .sub_menu').removeClass('sub_current');
		$(this).addClass('sub_current');
	});
	
	$('#show_avatar').live('click',function(){
		$.post(get_url(json_str.base_url+'user/avatar'),function(data){
			if(data) $('#main_area').html(data);
		});		
	});
	
	$('#upload_avatar').live('click',function(){
		$.post(get_url(json_str.base_url+'user/avatar/swf_avatar'),function(data){
		    if(data) $('#main_area').html(data);
	    });
	});
	
	$('#view_profile').live('click',function(){
		$.post(get_url(json_str.base_url+'user/profile'),function(data){
			if(data) $('#main_area').html(data);
		});		
	});
	
	$('#edit_profile').live('click',function(){
		$.post(get_url(json_str.base_url+'user/profile/edit'),function(data){
			if(data) $('#main_area').html(data);
		});		
	})
	
	$('#amend_pass').live('click',function(){
		$.post(get_url(json_str.base_url+"user/profile/password"),function(data){
			if(data) $('#main_area').html(data); 
	    }); 
	});	
	
	$('.entry_viewer div.closer').live('click',function(){
		$('#show_entry').remove();
	});
	
	$('.menu_item, .sub_menu_list .sub_menu').live('click',function(){
		$('#show_entry').remove();
	});
	
	/*--------用户资料编辑部分开始----------*/
	
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
		if(!email_check($(this).val())) {
			top_message('您输入的邮件地址不正确');
			set_style($(this),'error');
		} 
		else set_style($(this),'ok');
	});
	
	$('#qq').live('change',function(){
		if($(this).val().length!=0 && !qq_check($(this).val())) {
			top_message('您输入的QQ号码不正确');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#nick_name').live('change',function(){
		if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#career').live('click',function(){
        var obj=$('#career');
        var data=$('#career_list').html();
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70');         
    });
	
	$('#province').live('click',function(){
        var obj=$('#province');
        var data=$('#province_list').html();
        obj.blur();        
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'300','150');         
    });
	
	$('#career,#province').live('click',function(event){
		event.stopPropagation();
	});
	
	$('.profile_form :input').live('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
			remove_style($(this));
		}
	});

	$('#amend_submit').live('click',function(event){
			
		setTimeout(profile_validation, 250); 
		event.preventDefault();
		    
	});
	
	$('.career_item').live('click',function(){
		$('#career').val($(this).text());
	});	
	
	$('.province_item').live('click',function(){
		$('#province').val($(this).text());
	});	
	
});

function updateavatar() {
	$('#show_avatar').click();
}

function my_page_callback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):15;
	$('.my_entries').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.my_entries').eq(i).show();
    }
    return false;
}

function my_page() {
	var num_entries = $('.my_entries').length; 
	
	addcss2head('js/pagination/pagination.css'); 
	
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: my_page_callback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):15,
        next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}

function  entry_viewer(obj_id,x_pos,y_pos,data,width,height) {
	$('.entry_viewer').remove();
	$('body').append('<div id="'+obj_id+'" class="entry_viewer"></div>');
	$('#'+obj_id).html('<div class="closer"></div><div class="menu">查看内容</div>');
	$('#'+obj_id).append(data);
	$('#'+obj_id).css({"left":x_pos,"top":y_pos});
	if(arguments[4]) $('#'+obj_id).css({"width":width});
	if(arguments[5]) $('#'+obj_id).css({"height":height});
}

function profile_validation() {
	var data,flag=1;
	var inputs = [];

	$('.profile_form :input').not(':radio,:button').each(function() {
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
	    
   data=data+'&gender='+$('[name="gender"]:checked').val()+'&amend_submit=profile&ajax=1';
	    
   $.ajax({
		   type: 'post',
	       url:   get_url(json_str.base_url+"user/profile/submit"),
	       data:  data,
	       success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,'','json');
	                	 $('#view_profile').click();
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
