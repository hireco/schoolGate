/**
 * function of jquery by Snellings Cheng
 * commonly used by front part of the web
 * @param data
 */

var mouse_is_inside = false;

$(document).ready(function(){

	chk_if_logged();

	$('.float_pannel .closer').live('click',function(){
		$(this).parent().remove();
		unblock_all();
	});
	
	$(".simple_dialog div.closer").live('click',function(){
		$(this).parent().remove();		
	});
	
	$(".simple_dialog").live({
	   mouseenter: function(){
		 mouse_is_inside = true;
	   },
	   mouseleave: function(){
		 mouse_is_inside = false; 
	   }
	});

    $("body").click(function(){ 
    	if(! mouse_is_inside)  $('.simple_dialog').remove();
    });
	
	$('.navibar .navi_list').last().css('border-bottom','none');

	$('.logout_link').live('click',function(){
		$.post(get_url(json_str.base_url+'logout/ajax'),function(data){
			if(data=='1') 
				top_message('正在退出，稍候......',my_reload,'okay');
			else { 
				set_log_state(false);
				top_message('您没有登录，无需退出！','','warn');
			}
		});		
	});
	
	$('.goback_link').live('click',function(){
		remove_pannel('reg_log_pannel');
		$('#body').unblock();
		history.go(-1);
	});
	
	$('.not_found').closest('body').fadeOut(3000,function(){
		location.replace(json_str.base_url);
	});
	
	//wrap导航中的文本节点，确保对齐. 
	/*
	$('.page_navi').contents().wrap('<span></span>');
	$('.page_navi a').unwrap();
	//后来发现，可以利用vertical-align:baseline解决此问题，故取消此操作
	*/

	$('span.hot,span.isnew').each(function(){
		$(this).height($(this).parent().height());
	});
	
	//对缩略图的处理
	$('.thumb_wrapper img').each(function(){
		var imgsrc=$(this).attr('src');		 
		var imgWidth  = $(this).parent().width();
		var imgHeight = $(this).parent().height();

		var curWidth =  $(this).width();    // 图片当前宽度
        var curHeight = $(this).height();   // 图片当前高度

		var ratio = 0;

		if(resources_is_img(imgsrc)){
		    if(curWidth < imgWidth) {
				ratio = imgWidth / curWidth;
				$(this).width(imgWidth);
				curHeight = curHeight * ratio;
				$(this).height(curHeight);
			}
			if(curHeight < imgHeight) {
				ratio = imgHeight / curHeight;
				$(this).Height(imgHeight);
				curWidth = curWidth * ratio;
				$(this).width(curWidth);
			}
			
			curWidth =  $(this).width();    // 图片当前宽度
            curHeight = $(this).height();   // 图片当前高度			
			
			if($.browser.msie) {
		       if(parseFloat($.browser.version)<9.0) return true; 
			   //注意 return true means continue and return false means break 
	        }
			
			$(this).parent().css('background-image','url('+imgsrc+')');
			$(this).parent().css('background-size', curWidth+'px'+' '+curHeight+'px'); 
			$(this).parent().css({'width':imgWidth+'px','height':imgHeight+'px'}); 
			$(this).remove();
		}
		else {
			$(this).parent().css('background-color','#ffffff');
			$(this).parent().css('background-image','url('+json_str.base_url+'skin/images/no_image.jpg)'); 
			$(this).remove();
		}
		
	});
	 

	//当重新操作时，去掉提示框
	$('input').live('change',function(){	    
	   	$(".message_top").remove();
	});
});


function my_reload() {
	window.location.reload();
}

function my_close() {
	window.close();
}

function block_all(msg){	
	var show_msg=arguments[0]?arguments[0]:null;
	$('#body').block({message: show_msg,overlayCSS: {opacity: 0.2}});
}

function unblock_all(){	
	$('#body').unblock();
}

function float_pannel(obj_id,data,block,top_p,left_p) {
	var left, top;
	var obj_id=arguments[0]?obj_id:'random_'+parseInt(10*Math.random());
	var data= arguments[1]?data:'';
	
	if(arguments[2]=='block') block_all();
	
	$('body').append('<div id="'+obj_id+'" class="float_pannel hide">'+data+'</div>');
	top=arguments[3]?top_p:Math.round(($('body').height()-$('#'+obj_id).height())/2);
	left=arguments[4]?left_p:Math.round(($('body').width()-$('#'+obj_id).width())/2);
	$('#'+obj_id).css({'left':left+'px','top': top+'px'}).show();

	$('#'+obj_id).draggable({ cursor: 'move' });
	
}

function remove_pannel(obj_id) {
	$('#'+obj_id).remove();
	unblock_all();
}

function show_reg_pannel() {
	
	remove_pannel('reg_log_pannel');
	
	if($('.reg_log_form').filter('.reg_form').length) return false;
	
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged) $.get(get_url(json_str.base_url+'register/logout'),function(data){
				float_pannel('reg_log_pannel',data,'block','200'); 
			});
		else  $.get(get_url(json_str.base_url+'register/ajax'),function(data){
				float_pannel('reg_log_pannel',data,'block','200'); 
			});
	});
}

function show_log_pannel(){
	
	remove_pannel('reg_log_pannel');
	
	if($('.reg_log_form').filter('.log_form').length) return false;	
	
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged)  $.get(get_url(json_str.base_url+'login/logout'),function(data){
			float_pannel('reg_log_pannel',data,'block','200'); 
		});	
		else  $.get(get_url(json_str.base_url+'login/ajax'),function(data){
			float_pannel('reg_log_pannel',data,'block','200'); 
		});
	});
}

function set_log_state(data) {
		if(data.logged)  {
			$('#unlogged_state').hide();
			$('#logged_state').html(data.logged_state).show();
		}
		else  {
			$('#logged_state').hide();
			$('#unlogged_state').show();
		}
}

function chk_if_logged() {
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		try{
			data=eval('(' + data + ')');
			set_log_state(data);
			add_editor_link(data.logged);
		}
		catch(e) {
			top_message('系统有错误，请稍后再试');
		}
	});
}


function add_editor_link(logged) {

	if(!logged) return false;

	if($('.infors .source').length) {
		$.post(get_url(json_str.base_url+'ajax/cms_ajax/add_editor_link'),{index_id: $('#entry_id').val()},function(data){
			$('.infors .source').after(data);
		})
	}
}

function top_message(msg,callback,addclass,bgcolor,ftcolor,bdcolor) {
	var scrolltop = $(document).scrollTop();
	var flag=arguments[1]?true:false;
	var bg,ft,wd,ht,bd;
	
	$(".message_top").remove();
	$("body").prepend('<div class="message_top"><div class="icon"></div><div class="hint_text">'+msg+'</div></div>');
	$('.message_top').prepend('<div class="rt_corner"></div>');
	
	bg=arguments[3]?arguments[3]:$(".message_top").css("background-color");
	ft=arguments[4]?arguments[4]:$(".message_top").css("color");
	bd=arguments[5]?arguments[5]:$(".message_top").css("border");
	
	wd=$(".message_top").width();
	ht=$(".message_top").height();
	
	wd=-parseInt(wd/2); 
	ht=-parseInt(ht/2)+scrolltop; 
	//-ht/2 makes its center point's position just at the site set in css file.
	//+scrolltop makes it changing with the scroll which happens before it shows.

	$('.message_top').draggable({ cursor: 'move' });
	
	$('.rt_corner').click(
		function(){$(this).parent().remove();
	});

	arguments[2]?$(".message_top .icon").addClass(addclass):$(".message_top .icon").addClass('error');

	$(".message_top").css({'border-color' : bd, 'background-color' : bg, 'color' : ft, 'margin-left' : wd+'px', 'margin-top' : ht+'px' });

	if(flag)  $(".message_top").fadeOut(1000,callback);
	else $(".message_top").fadeOut(20000);
}

function  simple_dialog(x_pos,y_pos,data,width,height) {
	$('.simple_dialog').remove();
	$('body').append('<div class="simple_dialog"></div>');
	$('.simple_dialog').html('<div class="closer"></div>');
	$('.simple_dialog').append(data);
	$('.simple_dialog').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('.simple_dialog').css({"width":width});
	if(arguments[4]) $('.simple_dialog').css({"height":height});
	$('.simple_dialog').delay(5000).fadeOut(3000);

	$('.simple_dialog').draggable({ cursor: 'move' });
}

function ajax_success(response,textStatus,url,dataType) {	
	var dataType= arguments[0]?(arguments[3]?dataType:'json_string'):'string';	
	//必须放在前面！如果放在下句的后面，因为在下句后，arguments[0]变成了非空。

	var response= arguments[0]?response:'无返回信息'; 
	var textStatus= arguments[1]?textStatus:'success';
	var url= arguments[2]?url:'';

	if(response && textStatus=='success') {//此为ajax成功被执行之意，不是指达到操作目的
	    
		if(dataType=='string')   { 
			if(response=='null') 
			return msg_callback(url);  //指定不显示任何效果
			
			if(textStatus=='0') top_message(response,url?function(){ msg_callback(url); }:'','error');
			else top_message(response,url?function(){ msg_callback(url); }:'','okay');
			return;
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是html和json_string,则为json类型。
		
		if(data.infor=='null') 
			return msg_callback(url);  //指定不显示任何效果

		if(data.result=='0') { 			
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','fail');	
			// 不能直接回调函数本身，因为会导致top_message的效果丢失

			else  top_message('发生错误!',url?function(){ msg_callback(url); }:'','fail');
		}		
	    else if(data.result=='1') { 	    	
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','okay');
			else top_message('操作完成!',url?function(){ msg_callback(url);}:'','okay');
		}
	}
	else  top_message(response,url?function(){ msg_callback(url);}:'','error');
}	
//回调函数本可以直接带参数调用，不需要用function(data){ myfunction(data)}的繁琐方式
//但是，如果主调函数是有效果的，这样做效果将失去，因此这里都乖乖的用这种繁琐形式了！


function ajax_failed(textStatus,url) {
	var url= arguments[0]?url:'';
	if(textStatus=='error') top_message('系统错误，请稍后重试！',url?function(){msg_callback(url); }:'','error');
}

function msg_callback(url){
	var url= arguments[0]?url:'';
	if(url=='current')  return;
	else if(url=='reload')  my_reload();
	else if(url!='')  goto_url(url,1000);
}

function set_style(obj,type) {
	if(type=='error') {
		obj.addClass('error');	      		 
  		obj.nextAll().remove();
  		obj.after('<div class="form_error"> </div>');
	}
	else {
		obj.removeClass('error');
     	obj.nextAll().remove();
		obj.after('<div class="form_ok"> </div>');
	}
}

function remove_style(obj) {
	obj.removeClass('error');
	obj.removeClass('ok');
 	obj.nextAll().remove();
}

function chk_captcha(obj_id) {
	if(!arguments[0]) obj_id='captcha';
	$('#'+obj_id).live('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_captcha'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 set_style(obj,'error');
					 top_message('验证码输入错误');
				 }
				 else set_style(obj,'ok');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
}

function show_comment_form(object,type,parent) {
	if($('.comment_form').length) $.post(get_url(json_str.base_url+'comment/comment_form/'),{object_id:object,object_type: type,parent_id: parent}, function(data){
		$('.comment_form').html(data);
	});
}

function show_comment_list(object,type) {
	if($('.comment_list').length) $.post(get_url(json_str.base_url+'comment/comment_list/'),{object_id:object,object_type: type}, function(data){
		$('.comment_list').html(data);
		$('.comment_parent_id').each(function(){
			var parent_id=$(this).text();
			var cur_div=$(this).parent();
			if(parent_id!='0'){
				cur_div.append('<div class="comment_parent"></div>');
				$('#comment_'+parent_id).children().eq(2).clone().prependTo(cur_div.children().filter('.comment_parent'));
				$('#comment_'+parent_id).children().eq(1).clone().prependTo(cur_div.children().filter('.comment_parent'));
			}
		});
		$('.comment_parent .reply_comment').remove();
	});
}

function addcss2head(cssfile) {
	if($('link').filter('[href$="'+cssfile+'"]').length==0){
	   $('head').append('<link rel="stylesheet"  type="text/css"  href="'+json_str.base_url+cssfile+'" />');
    }
}

function  show_ajax_loading(x_pos,y_pos) {
	$('.wait_loading').remove();
	$('body').append('<div class="wait_loading"></div>');
	$('.wait_loading').css({"left":x_pos,"top":y_pos});
}

function remove_ajax_loading() {
	$('.wait_loading').remove();
}