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
			   window_open(get_url(json_str.base_url+'trash/view/'+cur_id[0]),'1024','768',true);
		   },
	     
		   'delete': function(t) {
			   mydelete(t);
		   },
		   'recycle': function(t) {
			   recycle(t);
		   }
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });		
	
	//横向导航
	
	$('[class="horizon_items"]').click(function(){
         refresh_cms_list();     
	});
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	search_bubble(); //搜索设置

	
	//删除内容--------------------------------------------------//
	$("#delete_cms").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"cms_trash/delete_cms/"),
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
function recycle(obj) {
	  var title=get_title(obj);
	  var ids_to_trash=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_to_trash,
			url : get_url(json_str.admin_base+"cms_trash/recycle_cms/"),
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

function refresh_cms_list() {
	
	$.ajax({
		 type: 'post',
		 url:  get_url(json_str.admin_base+'cms_trash/clist/ajax'),
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