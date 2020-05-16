$(document).ready(function() {
	
	//大图重设大小	
	$('.content img').each(function(i){		
		if($(this).width()>600) $(this).width(600);
		if($(this).width()>200) $(this).wrap('<center></center>');		
	});
	
	$('.content img').closest('table').find('*').removeAttr('width style border hspace');
	$('.content img').closest('table').removeAttr('width style cellspacing').attr('border','0').attr('cellpadding','0');
    
	/*
	$(".content").html($(".content").html().replace(/&nbsp;/g,''));
	$(".content span, .content b, .content font").each(function(){  
          var innerHtml=$(this).html();  
          $(this).replaceWith(innerHtml);  
    });
   
    $(".content p, .content div").each(function(){  
          var innerHtml=$(this).html();  
          $(this).replaceWith('<p style="text-indent:30px;">'+innerHtml+'</p>');  
    });
	
	*/
	
	
	$('.content span, .content a, .content font').each(function(){
	    $(this).css({"vertical-align":"baseline"});
	});
	
	$('.list_body').html('<li>数据获取中，请稍候...</li>');
	
	$.post(get_url(json_str.base_url+'ajax/cms_ajax/cms_relate_list/article'),{id:$('#entry_id').val()},function(data){
		$('.list_body').removeClass('list_body_ajax');
		if(data) $('.list_body').html(data);
		else $('.list_body').html('<li>暂无相关内容</li>');
	}); 
	
	show_comment_form($('#entry_id').val(),'article','0');
	show_comment_list($('#entry_id').val(),'article');
	
	$('#show_comment_form').click(function(){
		if($('.comment_form').length==0) top_message('当前内容禁止评论！');
		else if(!$('.comment_form').html()) show_comment_form($('#entry_id').val(),'article','0');
	});
	
	if($('[style*="page-break-after"]').length > 0) {		
		
		$('[style*="page-break-after"]').siblings().hide();
		
		$('.content [style*="page-break-after"]').first().prevAll().show();
		
		for(var i=1;i<=$('[style*="page-break-after"]').length+1;i++) 
			$('#client_page').append('<a href="javascript:void(0);">'+i+'</a>');
		
		$('#client_page a').eq(0).addClass('current');
		if($('#client_page a').length>1)  $('#client_page').append('<a id="next_page" href="javascript:void(0);">后一页</a>');

	}
	
	$('#client_page a').live('click',function(){
		
		if($(this).hasClass('current')) return false;

		if($(this).attr('id')=='next_page') {
			$('#client_page a.current').next().click();
			return false;
		}
		else if($(this).attr('id')=='prev_page') {
			$('#client_page a.current').prev().click();
			return false;
		}
		
		$('[style*="page-break-after"]').siblings().hide();

		if(parseInt($(this).text())==$('[style*="page-break-after"]').length+1) {			
			$('#client_page a#next_page').remove();
			$('[style*="page-break-after"]').last().nextAll().show();
		}
		else {	
			if(parseInt($(this).text())==1) $('#client_page a#prev_page').remove();
			$('[style*="page-break-after"]').eq(parseInt($(this).text())-1).prevUntil('[style*="page-break-after"]').show();
			if($('#client_page a#next_page').length==0) $('#client_page').append('<a id="next_page" href="javascript:void(0);">后一页</a>');
		}
		
		if(parseInt($(this).text())!=1 && $('#client_page a#prev_page').length==0) $('#client_page').prepend('<a id="prev_page" href="javascript:void(0);">前一页</a>');
		
		$('#client_page a').removeClass('current');
		$(this).addClass('current');
	});	
});