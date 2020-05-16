$(document).ready(function() {

	initPagination(); // 初始化分页
    
	$('#add_details').live('click',add_detail_form);
	
	$('.delete_item').live('click',function(){
		$(this).closest('.my_form_item').remove();
		
		$('.index_no').each(function(i){
			var cur_no=i+1;
			$(this).text('项目'+cur_no);
		});
	});
	
	$('[id$="_table"]').live("mouseover", function() {
		$(this).contextMenu('mycontext_menu', {
			bindings : {
				'edit' : function(t) {
					myedit(t);
				},
				'delete' : function(t) {
					mydelete(t);
				},
				'locked' : function(t) {
					mylock(t,'1');
				},
				'no_locked' : function(t) {
					mylock(t,'0');
				},
				'hide' : function(t) {
					myhide(t,'1');
				},
				'no_hide' : function(t) {
					myhide(t,'0');
				}
			},
			onShowMenu: function(e, menu) {
		          if ($(e.target).parent().hasClass('locked')) $('#locked', menu).remove();
		          else $('#no_locked', menu).remove();
		          
		          if ($(e.target).parent().hasClass('hidden')) $('#hide', menu).remove();
		          else $('#no_hide', menu).remove();
		          
		          return menu;
		    },
			itemStyle : {
				border : '1px dashed #cccccc',
				margin : '2px'
			}
		});
	}); // 动态绑定Jquery插件的例子
	
	$('.add_people').live('click', function() {
		$.ajax({
			type : 'post',
			url : get_url(json_str.admin_base + 'people/add'),
			success : function(data, textStatus) {
				if (data) {
					$(".edit").html(data);
					$('.list').slideUp();
					$('.edit').slideDown();
				} else
					ajax_success('', textStatus, '', 'string');
			}
		});
	});
    
	$("#upload_avatar").live('click',function(){
	    var size=$("#people_avatar_size").html();
	    size=size.split(':');
	    var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'avatar',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html(),
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});
	
	$('#personal_site').live('change',function(){
		if(!url_check($(this).val())) {
			top_message('请输入包含http://的完整网址!');
			$(this).val('');
		}
	});
	
	$('#email').live('change',function(){
		if(!email_check($(this).val())) {
			top_message('请输入正确的电子邮件地址!');
			$(this).val('');
		}
	});
	
	$('#user_name').live('change',function(){
		if($(this).val()) $.post(get_url(json_str.admin_base+'people/check_username'),{user_name : $('#user_name').val()},function(data){
			 if(data=='0') { 
				 $('#user_name').val('');
				 top_message('该用户不存在！');
			 }
		});
	});

	$('#cn_name').live('change',function(){
		var obj=$(this);
		var str=obj.val();
		
		if(!chinese_check(str)) {
			top_message('请输入中文姓名!');
			$(this).val('');
		}

		if(str) $.post(get_url(json_str.base_url+'ajax/people_ajax/get_pinyin_name'),{cn_name : str},function(data){
			
			str=data.replace(/\s/g,'');
			
			$('#en_name').val(data);
			
			$.post(get_url(json_str.admin_base+"people/check_en_id"),{en_id: str, people_id : $('#people_id').val()},function(data){
		       if(data=='error') {
			      top_message('英文名有重复，请修改！'); 
			      $('#en_name').val('');
			      return false;
		       } 
			   $('#en_id').val(str);
	        }); 
		});


	});
	
	$('#en_name').live('change',function(){
		var obj=$(this);
		var str=obj.val();
		str=str.replace(/\s/g,'');

		if(!seo_url_check(str)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"people/check_en_id"),{en_id: str, people_id : $('#people_id').val()},function(data){
		   if(data=='error') {
			   top_message('英文名有重复，请修改！'); 
			   obj.val('');
			   return false;
		   } 
		   $('#en_id').val(str);
	     }); 
			
	});

	$('#title_id').live('change',function(){
	  	 if($(this).val()=='')  {
			 top_message('请修改具体的头衔类别！');
		     return false;
		 }
	});

	$('#html_dir').live('change',function(){
		
		$.post(get_url(json_str.base_url+'ajax/people_ajax/chk_html_dir'),{html_dir: $('#html_dir').val()},function(data){
			data = eval('(' + data + ')');
			if(data.result=='0') { 
				top_message(data.infor);
				$('#html_dir').val('');
			}
			else $('#personal_site').val(json_str.base_url+'public_html/'+$('#html_dir').val());
		});
		
	});
	
	$("#people_submit").live('click', function() {
		var inputs = [],details=[];
		var data, flag = 1;

		$('#people_form :input').not(':radio,:checkbox').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			if(!$(this).hasClass('detail_item') && !$(this).hasClass('detail_cont')) inputs.push(this.name + '=' + escape(this.value));
		});
		
		if (!flag)	return false;

		data = inputs.join('&');
        
		if($('#title_id').val()=='') {
		     top_message('请选择人员的头衔类型');
			 return false;
		} 

		data=data+'&gender='+$('[name="gender"]:checked').val()+'&hide_phone='+($('[name="hide_phone"]:checked').length?'1':'0')+'&hide_email='+($('[name="hide_email"]:checked').length?'1':'0')+'&hide_born_year='+($('[name="hide_born_year"]:checked').length?'1':'0');

		if($('.div_span').length) {
			$('.detail_item').each(function(i){
				details.push(escape($(this).val()+'-bbb-'+$('.detail_cont').eq(i).val()));
			});
			data=data+'&details='+details.join('-ddd-');
		}

		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.admin_base + 'people/submit'),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
					delete_images_sql();
					ajax_success(data, textStatus, data.url, 'json');
				} catch (err) {
					ajax_success('', textStatus, '', 'string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				ajax_failed(textStatus);
			}
		});
	});

	$("#people_cancel").live('click', function() {
		delete_images_cancel();
		$('.edit').slideUp();
		$('.list').slideDown();
	});

	// 删除条目--------------------------------------------------//
	$("#delete_people").live('click', function() {

		$.ajax({
			type : 'post',
			data : 'ajax=1&id=' + $('#id_be_selected').val(),
			url : get_url(json_str.admin_base + "people/delete_people/"),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
					if (data.id) {
						$.each(data.id.split(','), function(i, n) {
							$('#' + n + '_table').remove();
						});
						initPagination();
					}
					ajax_success(data, textStatus, '', 'json');
				} catch (err) {
					ajax_success('操作失败，请重试！', textStatus, '', 'string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				ajax_failed(textStatus);
			},
			complete : function() {
				$("#user_dialog").remove();
				unblock_all();
			}
		});
	});

});

function add_detail_form() {
	 var num=$('.div_span').length+1;
	 var index=num-1;
	 var position;
	 if(index) $('.div_span').closest('.my_form_item').last().after('<div class="my_form_item"><label class="labeltag"> </label><span class="mainarea div_span"></span></div>');
	 else $('.details_div').html('<div class="my_form_item"><label class="labeltag"> </label><span class="mainarea div_span"></span></div>');
	 $('.div_span').last().html('<span><label class="index_no">项目'+num+'</label><input type="text" class="enterbox shortarea filled detail_item" /></span>');
	 $('.div_span span').last().after('\n<span class="span_textarea"><textarea class="enterbox medium_enterarea filled detail_cont"></textarea></span><span class="delete_item" title="删除此条"></span>');
}

function myedit(obj) {
	var id = obj.id.split('_');
	$.ajax({
		type : 'post',
		url : get_url(json_str.admin_base + "people/edit/" + id[0]),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if(data.result=='1'){
					$(".edit").html(data.infor);
					$('.list').slideUp();
					$('.edit').slideDown();
					
					var cur_val=$('#pub_type').val();
					$('.shift_div').hide();
					$('.shift_div.for_'+cur_val).show();
					
					cur_val=$('#pub_condition').val();
					if(cur_val=='published') $('.published').show();
					else $('.published').hide();
				} 
				else ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function mydelete(obj) {
	var title = get_title(obj);
	var ids_to_delete = get_id_list(obj);

	var data = {
		"title" : "确认对话框",
		"action" : "删除人员信息",
		"object" : title,
		"main_infor" : "此举将删除此对象，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type" : "warning",
		"submit" : "delete_people"
	};
	var browser = 'not_ie6';
	$('#id_be_selected').val(ids_to_delete); // saved for delete action to
												// use
	data = $.param(data); // data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data, browser);
}

function mylock(obj,value) {
	var ids_selected = get_id_list(obj);
	
	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value='+value,
		url : get_url(json_str.admin_base + "people/locked"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '1') {
							$('.locked_' + ids[i]).html('<span style="color:green;">√</span>');
							$('.locked_' + ids[i]).parent().addClass('locked');
						}
						else {
							$('.locked_' + ids[i]).html('<span style="color:red;">×</span>');
							$('.locked_' + ids[i]).parent().removeClass('locked');
						}
					}
				}
				ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('操作失败，请重试！', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function myhide(obj,value) {
	var ids_selected = get_id_list(obj);
	
	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value='+value,
		url : get_url(json_str.admin_base + "people/hide"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '1') {
							$('.hide_' + ids[i]).html('<span style="color:red;">×</span>');
							$('.hide_' + ids[i]).parent().addClass('hidden');
						}
						else {
							$('.hide_' + ids[i]).html('<span style="color:green;">√</span>');
							$('.hide_' + ids[i]).parent().removeClass('hidden');
						}
					}
				}
				ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('操作失败，请重试！', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function get_id_list(obj) {
	var ids_select;
	if ($('.table_li_check:checked').length) {
		ids_select = [];
		$('.table_li_check:checked').each(function(i) {
			var cur_id = $(this).attr('id');
			cur_id = cur_id.replace('select_', '');
			ids_select[i] = cur_id;
		});
		return ids_select = ids_select.join(',');
	} else {
		ids_select = obj.id.split('_');
		return ids_select = ids_select[0];
	}
}

function get_title(obj) {
	var title = '选中的人员';
	var ids_select;

	if ($('.table_li_check:checked').length)
		return title;
	else
		return title = $('#' + obj.id).children().filter('.by_title').text();
}

