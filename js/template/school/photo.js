$(document).ready(function(){
	
	var current_img_url=$('.imglist .imgsrc').first().text();
	
	$('.list_body').html('<li>数据获取中，请稍候...</li>');
	$.post(get_url(json_str.base_url+'ajax/cms_ajax/cms_relate_list/photo'),{id:$('#entry_id').val()},function(data){
		$('.list_body').removeClass('list_body_ajax');
		if(data) $('.list_body').html(data);
		else $('.list_body').addClass('no_list').html('<li>暂无相关内容</li>');
	}); 
	
	show_comment_form($('#entry_id').val(),'photo','0');
	show_comment_list($('#entry_id').val(),'photo');
	
	$('#show_comment_form').click(function(){
		if($('.comment_form').length==0) top_message('当前内容禁止评论！');
		else if(!$('.comment_form').html()) show_comment_form($('#entry_id').val(),'photo','0');
	});
	
	$('.album .left').css('cursor','url('+json_str.base_url+json_str.image_path+'cursor_left.cur),auto;');
	$('.album .right').css('cursor','url('+json_str.base_url+json_str.image_path+'cursor_right.cur),auto;');
	
	intial_album($('.imglist .imgsrc').first(),$('.imglist .imgtext').first());
	
	$('.album .left, .album .right').click(function(event){auto_slide(event);});
	
	if($('.imglist').length>1) setInterval(auto_slide, 20000);
	
	$('#fullsize_icon').click(function(){
		var left, top;
		block_all();
		$('.fullsize_pannel').remove();
		$('body').append('<div class="fullsize_pannel"><img src="'+current_img_url+'" /><div class="close" title="关闭"></div></div>');
		left=Math.round(($('body').width()-$('.fullsize_pannel').width())/2);
		top=100+$(document).scrollTop();
		$('.fullsize_pannel').css({'left':left+'px','top': top+'px'}).show();
	});
	
	$('.fullsize_pannel .close').live('click',function(){
		unblock_all();
		$('.fullsize_pannel').remove();
	});
	
	function intial_album(src_obj,text_obj) {
		
		$('.imglist').removeClass('current');
		src_obj.parent().addClass('current');
		
		current_img_url=src_obj.text();
		
		$('.album .image').css('background-image','url('+src_obj.text()+')');	
		$('.album .photo_title').text('图片说明：'+(text_obj.text()?text_obj.text():'暂无'));
    }
	
	function auto_slide(event) {
	    var arrow,obj;
	    
	    if($('.fullsize_pannel').length==1) return false; //大图显示时暂停轮换图片
	    
	    arrow=arguments[0]?$(event.target).attr('class'):'right';
	    obj=$('.imglist').filter('.current');	
	 
	    if(arrow=='right') { 
		   if(obj.next().length) intial_album(obj.next().children().eq(0),obj.next().children().eq(1));
		   else if($('.imglist').length>1)  intial_album($('.imglist .imgsrc').first(),$('.imglist .imgtext').first());
	    }
	    else if(arrow=='left') {
		   if(obj.prev().length) intial_album(obj.prev().children().eq(0),obj.prev().children().eq(1));
		   else if($('.imglist').length>1)  intial_album($('.imglist .imgsrc').last(),$('.imglist .imgtext').last());
	    }	 
	}
});
