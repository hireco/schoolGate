/**
 * function of jquery by Snellings Cheng
 * commonly used by admin part of the web
 * @param data
 */
$(document).ready(function(){
	
	var mouse_is_inside= false;

	$.ajaxSetup ({
	   cache    : false, //close AJAX cache
	   dataType : 'html'
    });
	
	$('.float_pannel .closer').live('click',function(){
		$(this).parent().remove();
		unblock_all();
	});
	
	$(".dialog_title div.close").live('click',function(){
		$("#user_dialog").remove();
		unblock_all();
		
	});
	
	$("#dialog_cancel").live('click',function(){
		$("#user_dialog").remove();
		unblock_all();
	});
	
	$("#simple_viewer").live({
		mouseenter: function(){
		   mouse_is_inside = true;
		},
		mouseleave: function(){
		   mouse_is_inside = false; 
		}
	});
	
    $("body").click(function(){ 
 	  if(! mouse_is_inside && !$('#simple_viewer').hasClass('no_dispear_auto'))  $('#simple_viewer').remove();
    });
 
	
	$("#simple_dialog div.closer").live('click',function(){
		$("#simple_dialog").remove();
	});
	
	$("#simple_viewer div.closer").live('click',function(){
		$("#simple_viewer").remove();
		
	});
	
	$('[id$="_table"]').live('mouseover', function(){
		$(this).children().addClass("current");		
	});
	
	$('[id$="_table"]').live('mouseout', function(){
		$(this).children().removeClass("current");		
	});
	
	$('.text_selected').live('click',function(){
		$(this).select();  
        js=$(this).createTextRange();  
        js.execCommand("Copy"); 
	});

	//--------------checkbox选择开始---------------------------//
	$('[class="check_li title"]').live('click',function(){
		var flag='cancel';		 
		$('.table_li_check:visible').each(function(){
		   if(!$(this).attr('checked')){
               $('.table_li_check').attr('checked',false);
				$('.table_li_check:visible').attr('checked',true);
				flag='select';
				return;
			}
		});
			 
	    if(flag=='cancel') $('.table_li_check').attr('checked',false);
	});	
		
	$('.table_li_check:visible').live('click',function(){
		$('.table_li_check:hidden').attr('checked',false);
	});
	 
	$('[id$="_table"]').live('click', function(e){
		var cur_id=$(this).attr('id');
		var flag;
		var event_id=e.target.id;		
		cur_id=cur_id.replace('_table','');
		
		if(event_id.replace('select_','')==cur_id)  {
			$('.table_li_check:hidden').attr('checked',false);
			return true;
		}
		else {
			flag=$('input:checkbox').filter('#select_'+cur_id).attr('checked')?false:true;
			$('input:checkbox').filter('#select_'+cur_id).attr('checked',flag);
			$('.table_li_check:hidden').attr('checked',false);
		}		
	});
	
	//----------------选择结束------------------------//
	
	$('#workplace').ajaxStart(function(){
        $("#ajax_loader_box").html(' <img class="loader" src="'+json_str.base_url+'skin/admin/images/trans_loader.gif" />');
    });

	$("#workplace").ajaxComplete(function(){
		$(".loader").hide();
    });

	//当重新操作时，去掉提示框
	$('input').live('change',function(){	    
	   	$(".message_top").remove();
	});

	$('.local_select').live('click',function(){
		show_image_browser($(this).data('for'));
	});

});

function actual_txtlength (innerhtml,sendback) {
    var string=innerhtml.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
    string=$.trim(string.replace(/&nbsp;/g,''));
    if(sendback=='len') return string.length;
    else return string;
}

function myblocking(result,infor,goto_url,bind_func) {
	var flag=arguments[0]?true:false;
	var callback_on_unblock=arguments[3]?true:false;
	if(flag=="") {
		$.blockUI({ 
			onBlock: function() { $("body").unbind('keydown');},
			message: '<h1><img src="'+base_url+'skin/images/busy.gif" />正在处理，请稍后...</h1>', 
            css: { padding: '15px' },
            fadeIn: 100
        });	
	}
	else {
		$.unblockUI({fadeOut:100});
		if(result=='success') {
			$.blockUI({ 
				onBlock: function() { $("body").unbind('keydown');},
				message: infor, 
                css: { backgroundColor: '#008B00', color: '#fff' },
                fadeIn :100
            });
			$.unblockUI({fadeOut:1000});
		} 
		else {
			$.blockUI({ 
				onBlock: function() { $("body").unbind('keydown');},
				message: infor, 
                css: { backgroundColor: '#CD5555', color: '#fff' },
                fadeIn :100
            });
			if(callback_on_unblock) {
				$.unblockUI({
					onUnblock: function(){ $("body").bind('keydown',bind_func); },
					fadeOut:3000
				});
			}
			else {
				$.unblockUI({fadeOut:3000});
			}
		}
		if(goto_url)  location.replace(goto_url);
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

function my_reload() {
	window.location.reload();
}

function my_close() {
	window.close();
}

function block_all(action){

	if(arguments[0]) action();

	if($('#body .blockUI').length)  return false;

	$('#body').block({
		message: null,
		overlayCSS: {opacity: 0.1}
	});
}

function unblock_all(){
	if($('.blockUI').length>1)
		$('.blockUI:last').parent().unblock();
	else
		$('#body').unblock();
}

function ajax_success(response,textStatus,url,dataType) {	
	var dataType= arguments[0]?(arguments[3]?dataType:'json_string'):'string';	
	//必须放在前面！如果放在下句的后面，因为在下句后，arguments[0]变成了非空。

	var response= arguments[0]?response:'无显示信息'; 
	var textStatus= arguments[1]?textStatus:'success';
	var url= arguments[2]?url:'';

	if(textStatus=='0') {
		return top_message(response,url?function(){ msg_callback(url); }:'','error'); //forget why
	}

	else if(response && textStatus=='success') {//此为ajax成功被执行之意，不是指达到操作目的
	    
		if(dataType=='string')   { 
			if(response=='null') 
			return msg_callback(url);  //指定不显示任何效果

			else top_message(response,url?function(){ msg_callback(url); }:'','okay');

			return;
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是string和json_string,则为json类型。
		
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
	if(textStatus=='error') top_message('发生系统错误，请稍后重试！',url?function(){msg_callback(url); }:'','error');
}

function msg_callback(url){
	var url= arguments[0]?url:'';
	if(url=='current')  return;
	else if(url=='reload')  my_reload();
	else if(url!='')  goto_url(url,1000);
}

function  simple_dialog(x_pos,y_pos,data,width,height) {
	$('#simple_dialog').remove();
	$('body').append('<div id="simple_dialog"></div>');
	$('#simple_dialog').html('<div class="closer"></div>');
	$('#simple_dialog').append(data);
	$('#simple_dialog').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('#simple_dialog').css({"width":width}); 
	if(arguments[4]) $('#simple_dialog').css({"height":height});
	$('#simple_dialog').delay(5000).fadeOut(3000);
}

function  simple_viewer(x_pos,y_pos,data,width,height) {
	$('#simple_viewer').remove();
	$('body').append('<div id="simple_viewer"></div>');
	$('#simple_viewer').html('<div class="viewer_menu"></div>');
	$('.viewer_menu').html('<div class="menu_title"></div><div class="closer"></div>');
	$('#simple_viewer').append(data);
	$('#simple_viewer').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('#simple_viewer').css({"width":width});
	if(arguments[4]) $('#simple_viewer').css({"height":height});
	
	//$('#simple_viewer').draggable({ cursor: 'move' });

	$('.viewer_menu').css({cursor: 'move'});
	$('#simple_viewer').draggable({ cursor: 'move',handle:'.viewer_menu' });
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

function admin_log_pannel(){
	var left;
	
	remove_pannel('admin_log_pannel');
	
	$.post(get_url(json_str.admin_base+'login/ajax'),{ajax:1},function(data){
		float_pannel('admin_log_pannel',data,'block','200'); 
	});
}

function  show_dialog(data,browser){
	
	$("#user_dialog").remove();	
	
	if($.browser.msie) {
		if(parseFloat($.browser.version)<7.0) browser='ie6';
	}
	
	$.ajax({
       	 type: 'post',
       	 data: data+'&browser='+browser,
       	 url:  get_url(json_str.base_url+'ajax/show_dialog'),
         success : function(data,textStatus){
        	 var json_data=data;
        	 var data = eval('(' + data + ')');
        	 if(data.result='1') { 
        		 $("body").append(data.infor);
				 
				 var main_height=$(".dialog_body .main_infor").height();
				 var main_width = $(".dialog_body .main_infor").width();

				 main_height=main_height>400?400:main_height;
				 main_width=main_width>800?800:main_width; 
				 $(".dialog_body .main_infor").css({"overflow":"auto","height":main_height+"px","width": main_width+"px"});

        		 set_dialog_height($(".dialog_body").height()+120);
				 block_all(); 
				 //$("#user_dialog").draggable({ cursor: 'move' });

				 $('.dialog_title').css({cursor: 'move'});
	             $('#user_dialog').draggable({ cursor: 'move',handle:'.dialog_title,.dialog_footer' });
        	 }
        	 else ajax_success(json_data,textStatus);
         },
			 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
    });
}

function set_dialog_height(my_height) {
	var total_height=my_height;
	var margin_top=my_height/2;
	var inner_height=my_height-20;
	$("#user_dialog").css({"height" : total_height+"px","margin-top" : "-"+margin_top+"px"});
	$(".left_border").css({"height" : inner_height+"px"});
	$(".right_border").css({"height" : inner_height+"px"});
	$(".center").css({"height" : inner_height+"px"});
}

function show_image_browser(images_acceptor) {

	$('#image_browser_panel,#opener_id').remove();

	$.ajax({
		type: 'post',
		url:  get_url(json_str.admin_base+'file_manager/image_browser'),
		success : function(data,textStatus){

			$("body").append('<div id="image_browser_panel"><input type="hidden" id="images_acceptor" value="'+images_acceptor+'">'+data+'</div>');
			block_all();
			//阻止其他操作
			$("#image_browser_panel").draggable({ cursor: 'move',handle:'.horizon_navi' });
			//可移动设置
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}


function show_upload_crop(data) {

	 $('#upload_crop_pannel').remove();
	 
	 $('div[class^=imgareaselect-]').hide(); 
	 //if parent of imgAareaSelect is not within the $('#upload_crop_pannel'), this is a must!

	 data.ajax=1; 
	 //增加一个json元素，作为POST数据进行校验，防止简单的直接访问ajax数据
	 //这是一个较松的阻挡访客直接输入ajax地址访问的方法，当然会有php级的更严格的阻止方法。
	 //但是，对于注册用户或者一般管理员，由于他们已经被身份认定了，严格的方法反而不适用，这个方法可以阻止一个生手查看js代码。

	 $.ajax({
       	 type: 'post',
       	 data: data,
       	 url:  get_url(json_str.base_url+'ajax/image/upload_crop'),
         success : function(data,textStatus){
			try{ 
	             data=eval('(' + data + ')');
				 ajax_success(data,textStatus,'','json'); 
               }catch(err){
				 if(data)  {					 
					 $("body").append(data);
					 block_all();
					 //阻止其他操作
					 $("#upload_crop_pannel").draggable({ cursor: 'move' });
					 //可移动设置
				 }
                 else ajax_success('',textStatus,'','string');
	           }
         },
			error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
     });
}

function delete_images_sql() {
	 $('[id$="_sql"]').each(function(){		
	 	if($(this).val()) {		 	   
	 	   $.post(get_url(json_str.base_url+'ajax/image/delete_images'),{files: $(this).val(),retains : $(this).prev().val()},function(rs){
			   if(rs=='0') ajax_success('有错误产生，请报告！',textStatus,'','string');
		   });		   
	    } 	
    });
}

function delete_images_cancel() {
	 $('[id$="_sql"]').each(function(){
	 	if($(this).prev().val()) {
		   $.post(get_url(json_str.base_url+'ajax/image/delete_images'),{files: $(this).prev().val(),retains: $(this).val()},function(rs){
			   if(rs=='0') ajax_success('有错误产生，请报告！',textStatus,'','string');
		   });		   
	    } 	
   });
}

function addcss2head(cssfile) {
	if($('link').filter('[href$="'+cssfile+'"]').length==0){
	   $('head').append('<link rel="stylesheet"  type="text/css"  href="'+json_str.base_url+cssfile+'" />');
    }
}


function text_selected(title,text,obj) {
    var data=title + '：<input class="text_selected" style="margin:5px; width:200px; height:22px; border:1px solid #cccccc;" type="text" value="'+text+'"/>';
	simple_viewer(obj.offset().left+100,obj.offset().top+10,data);
}

//一般列表分页功能函数
//page_execption_items 是特殊情况下需要过滤的数据，例如搜索时不符合要求的。
function pageselectCallback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.ul_tables ul').filter('[id$="_table"]').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.ul_tables ul').filter('[id$="_table"]').not('.page_exception_items').eq(i).show();
    }
    return false;
}

function initPagination() {
	var num_entries = $('.ul_tables ul').filter('[id$="_table"]').not('.page_exception_items').length; 
	
	
	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: pageselectCallback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
        num_display_entries: 8,
		next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}

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

function bubble_initial(obj,html) {
	
	addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');
	obj.CreateBubblePopup({			
		selectable: true,
		position : 'bottom',
		align	 : 'center',	
		innerHtml:  arguments[1]?html:'It is coming...',
		innerHtmlStyle: {'background-color':'#E0EEE0','text-align':'left','font-size':'12px;'},	
		themeName: 	'azure',
		themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
    });
}

function create_bubble_from(from_obj,to_obj) {
	bubble_initial(to_obj,from_obj.html());
	from_obj.remove();
} 

function do_query(){
	
	var objs=$('.ul_tables_body ul');
	var total_str='';
	var search_obj='';
	var cur_id=[];

	$('.ul_tables_body ul').addClass('page_exception_items');
	$('.ul_tables_body ul').hide();
	
	$('#my_search .inputarea').each(function(){
		 search_obj=$(this).val();
		 cur_id=$(this).attr('id').split('_');
		 if(search_obj) objs=objs.find('.by_'+cur_id[1]+':contains("'+search_obj+'")').parent();
		 total_str+=search_obj;
	});

	objs.removeClass('page_exception_items');
	objs.show();
	
	initPagination();

	if($.trim(total_str)) $('#return_to_all').show();
	else $('#return_to_all').hide();
}

function search_bubble() {
    
	if(!$('#show_query_bar').length) return; 

	bubble_initial($('#show_query_bar'),'<div id="my_search">'+$('#hide_for_query').html()+'</div>'); //初始化
	
	$('#hide_for_query').remove();

	$('[id^="select_bar"]').live('click',function(){
    	$('[id^="select_bar"]').not('#'+$(this).attr('id')).next().hide();
    	$(this).next().toggle();
    }); //冒泡内标签事件处理 
	
	$('#my_search ul.pop_ul li span').live('click',function(){
		var cur_id=$(this).closest('[class="hide pop_ul"]').attr('id');	
		var query_str=$(this).hasClass('no_limit')?'':$(this).text();
		
		$('#'+cur_id+' span').removeClass('selected');
		$(this).addClass('selected');
		
		cur_id=cur_id.replace('_list','');

		$('#my_search #'+cur_id).val(query_str); 
		//前面不加#my_search,会导致值被填入后来由于ajax更新带来的同名对象中
		
		do_query();
	});

	$('#my_search .inputarea').live('keyup',do_query); //启动搜索

	$('#return_to_all').live('click',function(){
		$('.ul_tables_body ul').removeClass('page_exception_items');
		initPagination();
		$(this).hide();
	}); //取消搜索结果，返回全部列表
}