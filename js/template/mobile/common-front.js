/**
 * function of jquery by Snellings Cheng
 * commonly used by front part of the web
 * @param data
 */

toastr.options = {
    "closeButton": true,
    "preventDuplicates": true,
    "positionClass": "toast-bottom-full-width",
    "timeOut": "5000"
};

$(document).ready(function(){

	$('.logout_link').on('click',function(){
		$.post(get_url(json_str.base_url+'logout/ajax'),function(data){
			if(data=='1') 
				top_message('正在退出，稍候......',my_reload,'success');
			else { 
				set_log_state(false);
				top_message('您没有登录，无需退出！','','warning');
			}
		});		
	});
	
	$('.goback_link').on('click',function(){
		$('#main_body').unblock();
		history.go(-1);
	});
	
	$('.not_found').closest('body').fadeOut(3000,function(){
		location.replace(json_str.base_url);
	});
	
	//分享到其他网站的代码
	if($('.entry_use').length) $.get(get_url(json_str.base_url+'comment/share_this'),function(data){
		$('.entry_use hr').after(data);
	});

	//当重新操作时，去掉提示框
	$('input').on('change',function(){
		toastr.remove();
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
	$('#main_body').block({message: show_msg,overlayCSS: {opacity: 0.2}});
}

function unblock_all(){
	$('#main_body').unblock();
}

function set_log_state() {
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged)  {
			$('.unlogged_state').hide();
			$('.logged_state').show();
		}
		else  {
			$('.logged_state').hide();
			$('.unlogged_state').show();
		}
	});
}

function top_message(msg,callback,type) {
    var flag=arguments[1]?true:false;

    if(flag) {
        toastr.options.onHidden = callback;
        toastr.options.timeOut = 100;
    }

    toastr.remove();

    switch(type) {
        case 'success':
            toastr.success(msg);
            break;
        case 'info':
            toastr.info(msg);
            break;
        case 'warning':
            toastr.warning(msg);
            break;
        default :
            toastr.error(msg);
            break;
    }
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

			//if(textStatus=='0') top_message(response,url?function(){ msg_callback(url); }:'','error');
			//else top_message(response,url?function(){ msg_callback(url); }:'','success');
			//return; //???some thing needed to be redone
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是html和json_string,则为json类型。
		
		if(data.infor=='null') 
			return msg_callback(url);  //指定不显示任何效果

		if(data.result=='0') { 			
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','error');
			// 不能直接回调函数本身，因为会导致top_message的效果丢失

			else  top_message('发生错误!',url?function(){ msg_callback(url); }:'','error');
		}		
	    else if(data.result=='1') {
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','success');
			else top_message('操作完成!',url?function(){ msg_callback(url);}:'','success');
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
    var glyphicon;

    remove_style(obj);

    obj.closest('.form-group').addClass('has-feedback has-'+ type);

    switch (type) {
        case 'error':
            obj.addClass('error');
            glyphicon = 'glyphicon-remove';
            break;
        case 'warning':
            obj.removeClass('error');
            glyphicon = 'glyphicon-warning-sign';
            break;
        case 'success' :
            obj.removeClass('error');
            glyphicon = 'glyphicon-ok'

    }

    obj.after('<span class="glyphicon '+ glyphicon +' form-control-feedback"></span>');

    return obj;

}

function remove_style(obj) {
    obj.removeClass('error');
    obj.closest('.form-group').removeClass('has-error has-success has-warning');
 	obj.next('.glyphicon').remove();

    return obj;
}

function refresh_captcha(obj,captcha_input) {

	var obj= arguments[0]?obj:'captcha_img';
	var captcha_input = arguments[1]?captcha_input:'captcha';

	$('#'+obj).click(function(){
		var cur_src=$(this).attr('src');
		cur_src=cur_src.split('?');
		$(this).attr('src',cur_src[0]+'?'+Math.random());

		$('#'+captcha_input).val('');
		remove_style($('#'+captcha_input));
	});

}

function chk_captcha(obj_id) {
	if(!arguments[0]) obj_id='captcha';
	$('#'+obj_id).on('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_captcha'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 set_style(obj,'error');
                     toastr.error('验证码输入错误');
				 }
				 else set_style(obj,'success');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){
                toastr.error('系统发生意外错误，请稍候重试');
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

function success_show(obj,msg) {
	var msg = arguments[1]?msg:'恭喜！操作成功！';
	obj.html('<div class="text-center alert alert-success"><h3><span class="glyphicon glyphicon-ok"></span> '+msg+'</h3><p class="text-right"><button id="js-redo" class="btn btn-success">重新操作</button></p></div>');
	$('#js-redo').one('click',function () {
		window.location.reload();
	})
}

var iosOverly;
function ajax_sending(){
    $.blockUI({
        message: null,
        onBlock: spin_loading()
    });
}

function ajax_complete(status){
    $.unblockUI({
        onUnblock: function() {
            iosOverly.hide();
        }
    });
}

function spin_update(status) {
    var img = arguments[0]=='success'?'check.png':'cross.png';
    var result = arguments[0]=='success'?"Success!":"Failed!";
    iosOverly.update({
        text: result,
        icon: json_str.base_url+"bower/iOS-Overlay-gh-pages/img/"+img
    });
}

function spin_loading() {
    var opts = {
        lines: 13, // The number of lines to draw
        length: 11, // The length of each line
        width: 5, // The line thickness
        radius: 17, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    var target =  $(".lostpass_form").get(0);
    var spinner = new Spinner(opts).spin(target);
    iosOverly= iosOverlay({
        text: "Loading",
        duration: 0,
        spinner: spinner
    });
    return false;
}