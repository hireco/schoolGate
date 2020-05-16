var cur_photo;
var total_photos;

$(document).ready(function() {

	$('.menu_item').click(function(){
		var cur_action=$(this).attr('id').replaceAll('_','/');
		var cur_menu=$(this).attr('id').replace('user','menu');

		$.post(get_url(json_str.base_url+cur_action),function(data){
			if(data) {
				$('#user_menu').slideUp('fast',function(){

					$('body').removeClass('darkred');
					$('#sub_menu_list').html($('#'+cur_menu).html());
					$('#sub_menu_list').append('<li id="backCenter"><a href="javascript:void(0);">返回</a></li>')
					$('#user_area').html(data);

					$('#user_main').slideDown('fast',function(){
						$('#backCenter').one('click',function(){
							    $('#user_main').slideUp('fast',function(){
								$('body').addClass('darkred');
								$('#user_menu').slideDown('fast');
							});
						});

						$('#sub_menu_list .sub_menu').bind('click',function(){
							if($(this).hasClass('active')) return false;

							$('#sub_menu_list .sub_menu').removeClass('active');
							$(this).addClass('active');
							$.post(get_url(json_str.base_url+$(this).data('url')),function(data){
								if(data) $('#user_area').html(data);
							});
						});
					});
				});
			}
		});
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

function profile_validation() {
	var data,flag=1;
	var inputs = [];

	$('.profile_form :input').not(':radio,:button').each(function() {
		if($(this).val()=='' && $(this).hasClass('filled')) {
			set_style($(this),'error');
			top_message($(this).attr('placeholder'));
	   		flag=0;  return false;
		}

		if($(this).hasClass('error')) {
			top_message('请检查表单输入');
			flag=0;  return false;
		}

		if(!$(this).hasClass('filled')) {
			if($(this).val().length)  set_style($(this),'success');
			else remove_style($(this));
		}
		else set_style($(this),'success');

	   	inputs.push(this.name + '=' + this.value);
   });

   if(!flag) return false;
   data=inputs.join('&');

   data=data+'&amend_submit=profile&ajax=1';

	$.ajax({
		type: 'post',
		url:   get_url(json_str.base_url+"user/profile/submit"),
		data:  data,
		beforeSend: function() {
			$('#amend_submit').addClass('disabled');
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
					ajax_success(data,textStatus,'','json');
					$('#user_profile').click();
				}
				else {
					spin_update('error');
					$('#amend_submit').removeClass('disabled');
					ajax_success(data,textStatus,'','json');
				}
			}
			catch(err){
				spin_update('error');
				$('#amend_submit').removeClass('disabled');
				ajax_success('操作失败，请重试！',textStatus,'','string');
			}
		},
		error   : function(XMLHttpRequest, textStatus, errorThrown){
			spin_update('error');
			$('#amend_submit').removeClass('disabled');
			ajax_failed(textStatus);
		}
	});
}


