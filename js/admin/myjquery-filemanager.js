$(document).ready(function(){

	file_pagenation();

	$('#'+$('#mode').val()+'_mode a').addClass('selected');

	$('#dir_mode .horizon_items, #thumb_mode .horizon_items').click(function(){
		$('.horizon_items').parent().removeClass('selected');
		$(this).parent().addClass('selected');
	});

	$('#dir_mode, #thumb_mode').click(function(){
		$('#mode').val($(this).data('mode'));
	});

	$('.dirlist .file_name').live('mouseover',function(){
		$('.file_name').removeAttr('style');
		$(this).css({'text-decoration':'underline','color':'blue'});
	});

	$('.file_name').live('mouseout',function(){
		$('.file_name').removeAttr('style');
	});

	$('.dirlist .list_file').live('click',function(){
		var cur_dir=$('#cur_dir').text();
		window_open(get_url(json_str.base_url+cur_dir+'/'+$(this).find('.file_name').text()),'1024','768',true);
	});

	$('.list_dir').live('click',function(){
		list_dir($(this).children().filter('.dir_path').text());
	});

	$('#dir_mode,#thumb_mode').live('click',function(){
		var mode = $(this).data('mode');
		list_dir($('.cur_dir').text(),mode);
	});

	$('#upload_close').live('click',function(){
		list_dir($('.cur_dir').text());
	});

	$('.list_file').live("mouseover",function(){
		$(this).contextMenu('album_context_menu', {
			bindings: {
				'address': function(t) {
					var address=json_str.base_url+$('#cur_dir').text()+'/'+$('#'+t.id).children().filter('.file_name').attr('title');
					try  {
						window.clipboardData.setData('text',address);
						top_message('成功复制文件地址','','okay');
					}
					catch(error) {
						simple_dialog('40%','30%','<p>浏览器的原因，请用鼠标和Ctrl+C拷贝：</p>'+address);
					}
				},
				'delete': function(t) {
					mydelete(t.id);
				}
			},
			onShowMenu: function(e, menu) {
				$('.jqContextMenu:last').css('z-index',1001);
				//blockUI's zIndex is set as 1000, if not this seeting ,sometimes conflict will happen
				//It has inline css style, so a global css file does not affect it.
				return menu;
			},
			itemStyle: {
				border: '1px dashed #cccccc',
				margin: '2px',
			}
		});
	});

	//删除文件--------------------------------------------------//
	$("#delete_file").live('click',function(){

		$.ajax({
			type: 'post',
			data: 'ajax=1&filename='+$('.to_be_deleted').children().filter('.file_name').attr('title')+'&filedir='+$('#cur_dir').text(),
			url : get_url(json_str.admin_base+"file_manager/file_delete"),
			success : function(data,textStatus){
				try{
					data=eval('(' + data + ')');
					if(data.result=='1')  {
						$('.to_be_deleted').remove();
						file_pagenation();
					}
					ajax_success(data,textStatus,'','json');
					$('.to_be_deleted').removeClass('to_be_deleted');
					if($('#mode').val()=='thumb')  $('#masonry-container').masonry();
				}
				catch(err){
					$('.to_be_deleted').removeClass('to_be_deleted');
					ajax_success('操作失败，请重试！',textStatus,'','string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
			complete: function() { $("#user_dialog").remove(); unblock_all(); }
		});
	});

	$('#dialog_cancel, #user_dialog .close').live('click',function(){
		$('.to_be_deleted').removeClass('to_be_deleted');
	});

	create_bubble_from($('#hide_for_upload_menu'),$('#upload_menu')); //show upload submenu

	$('.upload_file_type .select').live('click',function(){
		$('.select').removeClass('selected');
		$(this).addClass('selected');
		$('#file_type_selected').text($(this).attr('id').replace('_file_type',''));

		$('#upload_pannel').remove();
		$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
			$("body").append(data);
			block_all(function(){
				$('#image_browser_panel').block({message: null,overlayCSS: {opacity: 0.1}});
			});
			//阻止其他操作
			$("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
			//可移动设置
		});
	});
});

function mydelete(obj) {
	$('#'+obj).addClass('to_be_deleted');
	var data ={
		"title"       : "确认对话框",
		"action"      : "删除文件",
		"object"      : "删除所选文件",
		"main_infor"  : "此举将彻底删除所选文件，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type"  : "warning",
		"submit"      : "delete_file"
	};
	var browser='not_ie6';
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
}

function return_root(){
	list_dir($('#root').text());
}

function return_upper(){
	var upper_dir=$('#cur_dir').text();
	upper_dir=upper_dir.split('/');
	upper_dir.reverse().shift();
	upper_dir=upper_dir.reverse().join('/');
	if(upper_dir) list_dir(upper_dir);
}

function list_dir(dir,mode,select) {
	var mode = arguments[1]?mode:$('#mode').val();
	var select = arguments[2]?select:$('#select').val();
	$.ajax({
		type: 'post',
		data: 'dir='+dir+'&mode='+ mode+'&select='+select,
		url:  get_url(json_str.admin_base+'file_manager/clist'),
		success : function(data,textStatus){
			$('#myclist_div').html(data);
			file_pagenation();
			$('.cur_dir').text($('#cur_dir').text());
			if($('#cur_dir').text()!=$('#root').text())
				$('#return_upper').show();
			else
				$('#return_upper').hide();
			if($('.list_thumb.list_file').length) selectAction();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}

function selectAction() {
	var acceptor = $($('#images_acceptor').val());
	var imgPreview = acceptor.data('preview');
	var imgNum = acceptor.data('num');
	var imgUrls=[];

	$('.list_thumb .select_it').click(function(){

		if($('.list_thumb .selected').length == imgNum &&  !$(this).hasClass('selected')) {
			top_message('只能选择' + imgNum + '张图片！', '', 'warn');
			return false;
		}
		else $(this).toggleClass('selected');

		if($('.list_thumb .selected').length == imgNum) {
			$('#image_browser_panel').append('<div class="sending_dialog"><a href="javascript:void(0);" class="okay"></a><a href="javascript:void(0);" class="cancel"></a></div>');
			$('.sending_dialog .cancel').one('click',function(){
				$('.sending_dialog').remove();
			})
			$('.sending_dialog .okay').one('click',function(){
				$('.list_thumb .selected').each(function(){
					imgUrls.push($(this).siblings('a').attr('href'));
				})

				acceptor.val(imgUrls.join('|'));

				for(var i in imgUrls)
				   $(imgPreview+' img').eq(i).attr('src',imgUrls[i]);

				top_message('成功选择图片',function(){
					$('#image_browser_panel').remove();
					unblock_all();
				},'okay');
			})
		}
		else $('.sending_dialog').remove();
	});
}


function pageCallback(page_index, jq){
	var $container = $('#masonry-container');
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.page_list_item').hide();

	for(var i=0;i<page_index*items_per_page+items_per_page;i++)
	{
		var $show_item=$('.page_list_item').not('.hide').eq(i);
		$show_item.show();
		$show_item.imagesLoaded(function () {
			$container.masonry();
		});
	}

	return false;
}

function file_pagenation() {
	var num_entries = $('.page_list_item').not('.hide').length;

	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
		callback: pageCallback,
		items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
		next_text: '下一页',
		prev_text: '上一页',
		link_to:   'javascript:void(0)'
	});
}