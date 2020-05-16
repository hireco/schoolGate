$(document).ready(function() {

	initPagination(); // 初始化分页

	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	$('[id$="_table"]').live("mouseover", function() {
		$(this).contextMenu('mycontext_menu', {
			bindings : {
				'view' : function(t) {
					myview(t);
				},
				'reply' : function(t) {
					myreply(t);
				},
				'delete' : function(t) {
					mydelete(t);
				},
				'hide' : function(t) {
					myhide(t, '1');
				},
				'no_hide' : function(t) {
					myhide(t, '0');
				}				
			},
			itemStyle : {
				border : '1px dashed #cccccc',
				margin : '2px'
			}
		});
	}); // 动态绑定Jquery插件的例子
	
	$('#top_type').live('click',function(){
        var obj=$(this);
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,$('#top_types').html(),'70');         
    });
	
	$('.comment_top_item').live('click',function(){
		var old=$('#top_type').val();
		$('#top_type').val($(this).text());
		if(old!=$('top_type').val()) $('#sub_type').val('');
	});
	
	$('#sub_type').live('click',function(){
        var obj=$(this);
        var cur_id=$('#top_types ul li:contains("'+$('#top_type').val()+'")').attr('id').replace('top','sub');
        var data=$('#'+cur_id).html();
        obj.blur();
        if(!$('#top_type').val()) simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,$('#top_types').html(),'70');
        else simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70');      
    });
	
	$('.comment_sub_item').live('click',function(){
		$('#sub_type').val($(this).text());
	});
	
	
	$("#comment_submit").live('click', function() {
		var inputs = [];
		var data, flag = 1;
		
		$('#simple_dialog').remove();
		
		$('#comment_form :input').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			inputs.push(this.name + '=' + escape(this.value));
		});

		if (!flag) return false;

		data = inputs.join('&');

		data = 'comment_submit=ajx&'+data;
			
		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.admin_base + 'comment/submit'),
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

	$("#comment_cancel").live('click', function() {
		$('#simple_dialog').remove();
		$('.edit').slideUp();
		$('.list').slideDown();
	});

	// 删除评论--------------------------------------------------//
	$("#delete_comment").live('click', function() {

		$.ajax({
			type : 'post',
			data : 'ajax=1&id=' + $('#id_be_selected').val(),
			url : get_url(json_str.admin_base + "comment/delete_entries/"),
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

function sort_pagination(obj,reverse) {
	var cur_id=obj.attr('id');
	var current_order;
	var is_num=false;
	
	$('#current_order_by').text(cur_id); 
	//记录当前排序目标，以备它用，例如局部删除后刷新列表
	
	cur_id=cur_id.replace('sort_','');
	if(obj.hasClass('is_num')) is_num=true;
	
	if(cur_id=='by_default') {
		$('#sort_by_default').hide();
		current_order='asc'; $('#current_order').text(''); 
	}
	else {
		$('#sort_by_default').show();
		current_order=$('#current_order').text();
		if(reverse==true) current_order=current_order?(current_order=='desc'?'asc':'desc'):'asc';
		$('#current_order').text(current_order); //记录当前排序顺序，以便进行反序排列
	}
	
	$(".ul_tables_body").jSort({
        sort_by: 'li.'+cur_id,
        item: 'ul',
        order: current_order,
        is_num: is_num
    });
	
	$('.ul_tables_body').children().each(function(i){
		$(this).removeClass('even');
		$(this).removeClass('odd');
		$(this).addClass((i+1)%2==1?'odd':'even');
		$(this).children().filter('li.id').text(i+1);
	});
	
	initPagination();
}

function myreply(obj) {
	var id = obj.id.split('_');
	$.get(get_url(json_str.admin_base + "comment/reply/" + id[0]),function(data){
		if (data) {
			$(".edit").html(data);
			$('.list').slideUp();
			$('.edit').slideDown();
		} 
		else top_message('错误的操作对象！');
	});
}

function myview(obj) {
	var id = obj.id.split('_');
	var obj=$('#'+obj.id);
	$.get(get_url(json_str.admin_base+"comment/view/" + id[0]),function(data){
		if(data) {
			simple_viewer(obj.offset().left+100,obj.offset().top+10,data);
			$('.checked_' + id[0]).html('<span style="color:green;">√</span>');
		}
		else top_message('对象不存在！');
	});
}

function mydelete(obj) {
	var title = get_title(obj);
	var ids_to_delete = get_id_list(obj);

	var data = {
		"title" : "确认对话框",
		"action" : "删除评论 ",
		"object" : title,
		"main_infor" : "此举将删除所选评论，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type" : "warning",
		"submit" : "delete_comment"
	};
	var browser = 'not_ie6';
	$('#id_be_selected').val(ids_to_delete); // saved for delete action to
												// use
	data = $.param(data); // data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data, browser);
}

function myhide(obj, value) {
	var ids_selected = get_id_list(obj);

	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value=' + value,
		url : get_url(json_str.admin_base + "comment/hide/"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '0')
							$('.hide_' + ids[i]).html(
									'<span style="color:green;">√</span>');
						else
							$('.hide_' + ids[i]).html(
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
	var title = '选中的评论';
	var ids_select;

	if ($('.table_li_check:checked').length)
		return title;
	else
		return title = $('#' + obj.id).children().filter('.by_content').text();
}