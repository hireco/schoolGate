$(document).ready(function() {
	$('.list_body').html('<li>数据获取中，请稍候...</li>');
	$.post(get_url(json_str.base_url+'ajax/cms_ajax/cms_relate_list/download'),{id:$('#entry_id').val()},function(data){
		$('.list_body').removeClass('list_body_ajax');
		if(data) $('.list_body').html(data);
		else $('.list_body').html('<li>暂无相关内容</li>');
	}); 
	
	show_comment_form($('#entry_id').val(),'download','0');
	show_comment_list($('#entry_id').val(),'download');
	
	$('#show_comment_form').click(function(){
		if($('.comment_form').length==0) top_message('当前内容禁止评论！');
		else if(!$('.comment_form').html()) show_comment_form($('#entry_id').val(),'download','0');
	});

});