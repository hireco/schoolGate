$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'delete': function(t) {
				mydelete(t); 
			}
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	
    
	$('.block_list').live('click',function(){
		 
		 $(this).parent().addClass('selected');
		 $.ajax({
			 type: 'post',
			 url:  get_url(json_str.admin_base+'blockip_admin/clist/ajax'),
		     success: function(data,textStatus){
				 if(data){
		            $("#clist_data").html(data);
		            $('.edit').slideUp();
		            $('.list').slideDown();		            
		            initPagination();
				  }
				 else ajax_success('',textStatus,'','string');
			 }
		 });
	});//按类型来刷新配置列表
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true); 
	});
	
	$('.block_add').live('click',function(){
		$.get(get_url(json_str.admin_base+'blockip_admin/add'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});//显示添加配置表单
	
	$('#ip_address').live('change',function(){
		$.post(get_url(json_str.admin_base+'blockip_admin/chk_ip_address'),{ip_address: $('#ip_address').val()},function(data){
			if(data=='0') { 
				top_message('IP地址不符合要求，或者已经存在！');
				$('#ip_address').val('');
			}
		});
	});//验证参数名是否符合要求
	
	$("#blockip_add_submit").live('click',function(){
	    var data,flag=1;
		var inputs = [];
	    
		if($.trim($('#ip_address').val())=='') {
			top_message('请输入IP地址');
			return false;
		}
		
	    $('#blockip_add :input').each(function() {
	     	 if($(this).val()=='' && $(this).hasClass('filled')) { 
	   			 top_message('表单尚未填写完整'); 
	   			 flag=0; return false;
	   		 }
	     	 inputs.push(this.name + '=' + escape(this.value));
	    });
	    
	    if(!flag) return false;
	    
	    data=inputs.join('&');
		
		$.ajax({
			 type: 'post',
			 data: data+'&blockip_add_submit='+$('#blockip_add_submit').val(),
			 url:  get_url(json_str.admin_base+'blockip_admin/add/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,data.url,'json');
					  }
				   catch(err){
					 	 ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交添加参数结果
	
	$("#blockip_add_cancel").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	
	$("#delete_ip").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"blockip_admin/delete_ip/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
						$('#'+data.id+'_table').remove();
						initPagination();
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
	}); //删除某个附加的参数

});

function mydelete(obj) {
	var cur_id=obj.id;
	var title=$('#'+cur_id+' li').filter('.by_ip').text();
	var ids_to_delete=cur_id.replace('_table','');
	  
	var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除封堵IP", 
	         "object"      : title,
	         "main_infor"  : "该被封堵的IP将被放行，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_ip"
	        };
	var browser='not_ie6';
	$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
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