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
				},
				'recommend' : function(t) {
					myrecommend(t, '1');
				},
				'no_recommend' : function(t) {
					myrecommend(t, '0');
				}
			},
			itemStyle : {
				border : '1px dashed #cccccc',
				margin : '2px'
			}
		});
	}); // 动态绑定Jquery插件的例子

	$('.add_link').live('click', function() {
		$.ajax({
			type : 'post',
			url : get_url(json_str.admin_base + 'friendlink/add'),
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

	$("#link_submit").live('click', function() {
		var inputs = [];
		var data, flag = 1;

		$('#link_form :input').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			inputs.push(this.name + '=' + escape(this.value));
		});

		if (!flag)
			return false;

		data = inputs.join('&');

		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.admin_base + 'friendlink/submit'),
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

	$("#link_cancel").live('click', function() {
		$('.edit').slideUp();
		$('.list').slideDown();
	});

	// 删除链接--------------------------------------------------//
	$("#delete_link").live('click', function() {

		$.ajax({
			type : 'post',
			data : 'ajax=1&id=' + $('#id_be_selected').val(),
			url : get_url(json_str.admin_base + "friendlink/delete_link/"),
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
		url : get_url(json_str.admin_base + "friendlink/edit/" + id[0]),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if(data.result=='1'){
					$(".edit").html(data.infor);
					$('.list').slideUp();
					$('.edit').slideDown();
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
		"action" : "删除友情链接 ",
		"object" : title,
		"main_infor" : "此举将删除此链接，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type" : "warning",
		"submit" : "delete_link"
	};
	var browser = 'not_ie6';
	$('#id_be_selected').val(ids_to_delete); // saved for delete action to
												// use
	data = $.param(data); // data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data, browser);
}

function myrecommend(obj, value) {
	var ids_selected = get_id_list(obj);

	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value=' + value,
		url : get_url(json_str.admin_base + "friendlink/recommend/"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '1')
							$('.recommend_' + ids[i]).html(
									'<span style="color:green;">√</span>');
						else
							$('.recommend_' + ids[i]).html(
									'<span style="color:red;">×</span>');
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
	var title = '选中的链接';
	var ids_select;

	if ($('.table_li_check:checked').length)
		return title;
	else
		return title = $('#' + obj.id).children().filter('.by_title').text();
}