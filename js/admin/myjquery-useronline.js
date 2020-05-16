$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	//右键菜单生成
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	       'forbidIP':  function(t) {
			   var cur_ip=$('#'+t.id).children().filter('.by_ip').text();
			   $.ajax({
				   type:'post',
				   url: get_url(json_str.admin_base+'user_online/block_ip'),
				   data: 'ip='+cur_ip+'&ajax=1',
				   success : function(data,textStatus){
						try{ 
			                data=eval('(' + data + ')');
						    ajax_success(data,textStatus,'','json'); 
			             }
						 catch(err){
							 ajax_success('操作失败，请重试！',textStatus,'','string');
			            }
					},
				   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
			   });	
	       },
		   'kickout': function(t) {
			   kickout(t);
		   }
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });		
	
	//横向导航
	
	$('#online_list_link').click(function(){
         refresh_online_list();       
	});
	
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	//js对数据排序结束---------------------------------------------//
	
	search_bubble(); //搜索设置
	
	//删除在线访客--------------------------------------------------//
	$("#delete_online").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"user_online/delete_online/"),
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
function kickout(obj) {
	  var title=get_title(obj);
	  var ids_to_delete=get_id_list(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "踢出访客 ", 
	         "object"      : title,
	         "main_infor"  : "此举将踢出访客，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_online"
	        };
	  var browser='not_ie6';
	  $('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
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
	  var title='选中的会员'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_username').text();
}

function refresh_online_list() {	
	$.get(get_url(json_str.admin_base+'user_online/clist/ajax'),function(data){
		$("#clist_data").html(data);
		initPagination();
	});
}
