$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	//右键菜单生成
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {
			  'view':function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  $.post(get_url(json_str.admin_base+'user_member/other'),{user_id :cur_id[0]},function(data){
					  try{
						  data=eval('(' + data + ')');
						  if(data.result=='0')  ajax_success(data.infor,data.result,'','string');
					  }
					  catch(err){
						  $(".view").html(data);
						  $('.list').slideUp(function(){
							  $('.view').slideDown();
						  });
					  }
				  });
			  },
			  'edit':  function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  edit_user(cur_id[0]);
			  },
			  'delete': function(t) {
				  mydelete(t);
			  },
			  'dieuser': function(t) {
				  setlife(t,'0');
			  },
			  'lifeuser': function(t) {
				  setlife(t,'1');
			  },
			  'right' : function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  $.post(get_url(json_str.admin_base+'user_right'),{user_id :cur_id[0],ajax :'yes'},function(data){
					  try{
						  data=eval('(' + data + ')');
						  if(data.result=='1') {
							  $(".edit").html(data.infor);
							  $('.list').slideUp('fast',function(){
								  $('.edit').slideDown();
							  });
						  }
						  else ajax_success(data.infor,data.result,'','string');
					  }
					  catch(err){
						  ajax_success('操作失败，请重试！',textStatus,'','string');
					  }
				  });
			  }
	      },
	      onShowMenu: function(e, menu) {
	          if ($(e.target).parent().find('.is_admin').text()=='0' || $(e.target).parent().find('.is_super_admin').text()=='0.0') {
	            $('#right', menu).remove();
	          }
	          return menu;
	     },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });		
	
	//横向导航
	
	$('#user_list_link').click(function(){
         refresh_user_list();       
	});
	
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	//js对数据排序结束---------------------------------------------//
	
	search_bubble(); //搜索设置
	
	//新建用户-----------------------------------------------//
	$('#new_entry').live('click',function(){		
		$.get(get_url(json_str.admin_base+'user_member/edit_member/form'), function(data){
			$(".edit").html(data);
			$('.list').slideUp('fast',function(){
				$('.edit').slideDown();
			});
		});		
	});
	
	//删除用户--------------------------------------------------//
	$("#delete_user").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"user_member/delete_user/"),
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
	         "action"      : "删除用户 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除用户的资料，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_user"
	        };
	  var browser='not_ie6';
	  $('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}

function setlife(obj,value) {
	var ids_selected=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_selected+'&value='+value,
			url : get_url(json_str.admin_base+"user_member/set_life/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') {
	                	ids=ids_selected.split(',');
	                	for(var i=0; i<ids.length; i++) {
	                		if(value=='1') $('.user_life_'+ids[i]).html('<span style="color:green;">√</span>');
	                		else $('.user_life_'+ids[i]).html('<span style="color:red;">×</span>');
	                	}
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
	  var title='选中的用户'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_title').text();
}

function refresh_user_list() {	
	$.get(get_url(json_str.admin_base+'user_member/clist/ajax'),function(data){
		$("#clist_data").html(data);
		$('.edit').slideUp('fast',function(){
			$('.view').slideUp('fast',function(){
				$('.list').slideDown();
				initPagination();
			});
		});
	});
}

function edit_user(user_id) {

	$.post(get_url(json_str.admin_base+'user_member/edit_member/form'),{user_id :user_id},function(data){
		try{
			data=eval('(' + data + ')');
			if(data.result=='0')  ajax_success(data.infor,data.result,'','string');
		}
		catch(err){
			$(".edit").html(data);
			$('.view').slideUp('fast',function(){
				$('.list').slideUp(function(){
					$('.edit').slideDown();
				});
			});
		}
	});
}
