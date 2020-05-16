$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	initial_class_list(); //初始化可操作分类
	
	//时间范围选择
	if(!checkCookie('time_filter')) 
	   $('.time_filter a#day_0').addClass('selected');
    else 
	   $('.time_filter a#'+getCookie('time_filter')).addClass('selected');
	
	$('.time_filter a').click(function(){
		var time_filter = $(this).attr('id');
		$('.time_filter a').removeClass('selected');
		$(this).addClass('selected');
		
		setCookie('time_filter',time_filter,1000,'/');
		
		refresh_cms_list();
	});
	

	//右键菜单生成
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	       'view':  function(t) {
	    	   var model_table;
			   var cur_id=t.id;
			   cur_id=cur_id.split('_');
			   model_table=$('#'+t.id+' .by_model').attr('id');
			   model_table=model_table.split('_');
			   window_open(get_url(json_str.base_url+'cms/view/'+cur_id[0]),'1024','768',true);
		   },
	       'edit':  function(t) {
			   var cur_id=t.id;
			   cur_id=cur_id.split('_');
			   window.location.href=get_url(json_str.admin_base+'cms_edit/viewer/'+cur_id[0]);
	       },
		   'address': function(t) {		       
			   var obj=$('#'+t.id);
			   var url = $('#' + t.id + ' .by_address').text();
			   try {
				   window.clipboardData.setData('text',url);
				   top_message('成功复制对象地址','','okay');
			   }
			   catch(error) {
				   text_selected('拷贝地址',url, obj);
			   }
		   },
		   'copy_id': function(t) {
			   var obj=$('#'+t.id);
			   var ids=get_id_list(t);
			   
			   try{ $(window.opener.document).find('.copy_id_to_filled').val(ids); }
			   catch(err) { 
				   try {
					   window.clipboardData.setData('text',ids);
					   top_message('成功复制对象ID','','okay');
				   }
				   catch(error)  {
					   text_selected('拷贝ID',ids,obj);
				   }
			   }
		   },
		   'delete': function(t) {
			   mydelete(t);
		   },
		   'trash': function(t) {
			   trash(t);
		   },
		   'recommend':function(t) {
			   set_item_attr(t,'recommend','1','item_timestamp');   
		   },
		   'no_recommend':function(t) {
			   set_item_attr(t,'recommend','0','item_timestamp');   
		   },
		   'headline':function(t) {
			   set_item_attr(t,'headline','1','item_timestamp');
		   },
		   'no_headline':function(t) {
			   set_item_attr(t,'headline','0','item_timestamp');
		   },
		   'hide':function(t) {
			   set_item_attr(t,'hide','1','item_onoff');
		   },
		   'no_hide':function(t) {
			   set_item_attr(t,'hide','0','item_onoff');
		   },
		   'locked':function(t) {
			   set_item_attr(t,'locked','1','item_onoff');
		   },
		   'no_locked':function(t) {
			   set_item_attr(t,'locked','0','item_onoff');
		   },
		   'gotop': function(t) {
			   set_item_attr(t,'top','1','item_timestamp');
		   },
		   'gobottom': function(t) {
			   set_item_attr(t,'top','0','item_timestamp');
		   },
		   'move_to': function(t) {
			   mymove_to(t);
		   }
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });		
	
	//横向导航
	
	$('[class="horizon_items"]').parent().removeClass('selected');
    $('#model_'+$('#model_id').val()).parent().addClass('selected');
	$('#my_cmslist').text('我的'+$('a.selected span.horizon_items').text().replace('列表',''));
	
	$('[class="horizon_items"]').click(function(){
		 var model_id=$(this).attr('id');
		 model_id=model_id.replace('model_','');
		 
		 $('.horizon_items').parent().removeClass('selected');
         $('#model_'+model_id).parent().addClass('selected');
         
		 $('#my_cmslist').text('我的'+$(this).text().replace('列表',''));
         
		 refresh_cms_list();
         
	});
	
	$('#my_cmslist').click(function(){
	     
		 var model_id;
		 
		 if($(this).parent().hasClass('selected')) return false;
		 
		 model_id=$('a.selected span.horizon_items').attr('id');	 
		 
		 $(this).text('我的'+$('a.selected span.horizon_items').text().replace('列表',''));
		 
		 $('.horizon_items').parent().removeClass('selected');
		 $(this).parent().addClass('selected');
		 
		 refresh_cms_list(model_id,1); 
		 
	});
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	search_bubble(); //搜索设置
	
	create_bubble_from($('#hide_for_new'),$('#new_entry')); //new entry menu

	//新建文档事件-----------------------------------------------//
	$('.new_cms_linker').live('click',function(){
		var cur_id=$(this).attr('id');
		cur_id=cur_id.replace('model_id_','');
		window.location.href=json_str.admin_base+'cms_add/'+cur_id;		
	});
	
	//删除内容--------------------------------------------------//
	$("#delete_cms").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"cms_list/delete_cms/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
					   $.each(data.id.split(','), function(i, n){
						   $('#'+n+'_table').remove(); 
					   });
					   sort_pagination($('#'+$('#current_order_by').text()),false);
					}
				    ajax_success(data,textStatus,'','json'); 
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
		   complete: function() { $("#user_dialog").remove(); unblock_all(); }			
	   });	
	});
	
	//移动内容--------------------------------------------------//
	$("#move_cms").live('click',function(){
		var class_id;
		if($('.form_item ul li span.selected').length==0) {
			top_message('请选择目标类'); 
			return false; 
		}
		
		class_id=$('.form_item ul li span.selected').parent().attr("id");
		class_id=class_id.split("_");
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val()+'&class_id='+class_id[1],
			url : get_url(json_str.admin_base+"cms_list/move_cms/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') refresh_cms_list();
	                ajax_success(data,textStatus,'','json');
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
		   complete: function() { $("#user_dialog").remove(); unblock_all(); }			
	   });	
	});
	
	$(".form_item ul li span").live('click',function(){
		
		var my_class= $('#my_class').val();
	    var my_class_array=$('#my_class').val().split(',');	
	    var class_id=$(this).parent().attr("id");
		
		class_id=class_id.split("_"); 
		
        $('.message_top').remove();

		if(my_class && $.inArray(class_id[1],my_class_array) < 0) {
			top_message('您无权操作该栏目！');
			return false;
		}
		
		if(class_id[1]=='0') { 
			top_message('不能移到根分类！');
			return false;
		}
		if(json_str.child_type!='both' && $(this).hasClass('has_sub')) {
			top_message('该分类只能包含子类！');
			return false;
		}
		$(".form_item ul li span").removeClass("selected");
		$(this).addClass("selected");
		
	});	
});

//-----右键菜单操作函数----------------------------------------------//
function mydelete(obj) {
	  var title=get_title(obj);
	  var ids_to_delete=get_id_list(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除内容 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除其所有内容，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_cms"
	        };
	  var browser='not_ie6';
	  $('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}

//-----右键菜单操作函数----------------------------------------------//
function trash(obj) {
	  var title=get_title(obj);
	  var ids_to_trash=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_to_trash,
			url : get_url(json_str.admin_base+"cms_list/trash_cms/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
					   $.each(data.id.split(','), function(i, n){
						   $('#'+n+'_table').remove(); 
					   });
					   sort_pagination($('#'+$('#current_order_by').text()),false);
					}
				    ajax_success(data,textStatus,'','json'); 
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
		   complete: function() { $("#user_dialog").remove(); unblock_all(); }			
	   });
}

function set_item_attr(obj,attr,value,action) {
	  
	  var ids_selected=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_selected+'&attr='+attr+'&value='+value,
			url : get_url(json_str.admin_base+"cms_list/"+action),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') {
	                	ids=ids_selected.split(',');
	                	for(var i=0; i<ids.length; i++) {
	                		$('#'+attr+'_'+ids[i]).removeAttr('class');
	                		$('#'+attr+'_'+ids[i]).addClass('attr_'+value);
	                	}
	                	//refresh_cms_list();
	                }
	                ajax_success(data,textStatus,'','json');
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}		
	   });
}

function mymove_to(obj) {
	 var title=get_title(obj);
	 var ids_to_delete=get_id_list(obj);
	 var children_list=$('#hide_for_move').html();
	 
	 var data ={
		 "title"      : "选择移动的目标分类",
		 "object"     : title,
		 "action"     : "选择【"+title+"】的目标类",
		 "dialog_view": "dialog_class_select",				         
		 "main_infor" : children_list, 
		 "submit"     : "move_cms"
	 };
	
	var browser='not_ie6'; 
	$('#id_be_selected').val(ids_to_delete); 
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
}

function get_id_list(obj) {
	  var ids_select;
	  if($('.table_li_check:checked').length) {
		  ids_select=[];
		  $('.table_li_check:checked').each(function(i){
			 var cur_id=$(this).attr('id');
			 cur_id=cur_id.replace('select_','');
			 ids_select[i]=cur_id;
		  });
		  return ids_select=ids_select.join(',');
	  } 
	  else {
		  ids_select=obj.id.split('_'); 
		  return ids_select=ids_select[0];
	  }
}

function get_title(obj) {
	  var title='选中的内容'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_title').text();
}

function refresh_cms_list(current_model,flag) {
	
	var model_id=arguments[0]?arguments[0]:$('a.selected span.horizon_items').attr('id');
	var my_list_only=arguments[1]?arguments[1]:0;
	
	model_id=model_id.replace('model_','');
	
	$.ajax({
		 type: 'post',
		 url:  get_url(json_str.admin_base+'cms_list/clist/ajax'),
		 data: 'model_id='+model_id+'&my_list_only='+my_list_only,
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
	            initial_class_list(); 
				initPagination(); 
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

//过滤不可操作栏目
function initial_class_list() {
    
	var my_class= $('#my_class').val();
	var my_class_array;	

	if(my_class) {
	   my_class_array=$('#my_class').val().split(',');
	   $('body').append('<div id="new_children_list"></div>');
	   $('#hide_for_move li span').each(function(){
	      var cur_id=$(this).parent().attr('id');
		  if(typeof(cur_id)=='undefined') return true;
		  cur_id=cur_id.replace('class_','');
		  
		  if($.inArray(cur_id,my_class_array) >= 0 && $('#new_children_list').find('li#class_'+cur_id).length==0) {
			$(this).parent().clone().appendTo($('#new_children_list')); 
		  }
	   });		   

	   $('#hide_for_move ul li, #search_class_list ul li').remove()
	   $('#hide_for_move ul, #search_class_list ul').html($('#new_children_list').html());
	   $('#new_children_list').remove();
	}
}