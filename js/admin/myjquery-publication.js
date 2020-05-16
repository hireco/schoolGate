$(document).ready(function() {

	initPagination(); // 初始化分页

	$('[id$="_table"]').live("mouseover", function() {
		$(this).contextMenu('mycontext_menu', {
			bindings : {
				'edit' : function(t) {
					myedit(t);
				},
				'delete' : function(t) {
					mydelete(t);
				}
			},
			itemStyle : {
				border : '1px dashed #cccccc',
				margin : '2px'
			}
		});
	}); // 动态绑定Jquery插件的例子

	//附件上传部分
	$('#upload_file').live('click',function(){
        $('#upload_pannel').remove();
    	$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    		$("body").append(data);
			block_all();
			//阻止其他操作
		    $("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
		    //可移动设置
    	});
    });
	
	$('.resources_type [name="to_upload"]').live('change',function(){
		$('.div_upload').toggle();
		$('.div_url').toggle();
	});
	
	$('.add_pub').live('click', function() {
		$.ajax({
			type : 'post',
			url : get_url(json_str.admin_base + 'publication/add'),
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
    
	$('#pub_type').live('change',function(){
		var cur_val=$(this).val();
		$('.shift_div').hide();
		$('.shift_div.for_'+cur_val).show();
	});	
	
	$('#pub_condition').live('change',function(){
		var cur_val=$(this).val();
		if(cur_val=='published') $('.published').show();
		else $('.published').hide();
	});
	
	$('#cited').live('change',function(){
		if(!num_check($(this).val())) {
			top_message('请输入数字!');
			$(this).val('');
		}
	});
	
	$("#pub_submit").live('click', function() {
		var inputs = [];
		var data, flag = 1;

		$('.my_form_item:visible :input:visible').not(':radio').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			inputs.push(this.name + '=' + escape(this.value));
		});

		if (!flag)	return false;

		data = inputs.join('&');
         
		data=data+'&pub_id='+$('#pub_id').val()+'&to_upload='+$('[name="to_upload"]:checked').val();
		
		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.admin_base + 'publication/submit'),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
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

	$("#pub_cancel").live('click', function() {
		$('.edit').slideUp();
		$('.list').slideDown();
	});

	// 删除条目--------------------------------------------------//
	$("#delete_pub").live('click', function() {

		$.ajax({
			type : 'post',
			data : 'ajax=1&id=' + $('#id_be_selected').val(),
			url : get_url(json_str.admin_base + "publication/delete_pub/"),
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

function myedit(obj) {
	var id = obj.id.split('_');
	$.ajax({
		type : 'post',
		url : get_url(json_str.admin_base + "publication/edit/" + id[0]),
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
		"action" : "删除文章著作",
		"object" : title,
		"main_infor" : "此举将删除此对象，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type" : "warning",
		"submit" : "delete_pub"
	};
	var browser = 'not_ie6';
	$('#id_be_selected').val(ids_to_delete); // saved for delete action to
												// use
	data = $.param(data); // data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data, browser);
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
	var title = '选中的文章著作';
	var ids_select;

	if ($('.table_li_check:checked').length)
		return title;
	else
		return title = $('#' + obj.id).children().filter('.by_title').text();
}