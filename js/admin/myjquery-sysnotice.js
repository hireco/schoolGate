$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); 
			},
			'view': function(t) {
				myview(t); 
			}
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	
    
	$('.notice_list').live('click',function(){
		 var notice_class=$(this).text();
		 $('.horizon_items').parent().removeClass('selected');
		 $(this).parent().addClass('selected');
		    
		 $.ajax({
			 type: 'post',
			 url:  get_url(json_str.admin_base+'sys_notice/clist/ajax'),
			 data: 'notice_class='+notice_class,
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
	
	$('.notice_add').live('click',function(){
		$.get(get_url(json_str.admin_base+'sys_notice/add'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});//显示添加配置表单
	
	$('#notice_title').live('change',function(){
		$.post(get_url(json_str.admin_base+'sys_notice/chk_notice_title'),{notice_title: $('#notice_title').val()},function(data){
			if(data=='0') { 
				top_message('该内容标题已经存在！');
				$('#notice_title').val('');
			}
		});
	});//验证参数名是否符合要求
	
	$("#notice_submit").live('click',function(){
	    var data,flag=1;
		var inputs = [];
	    var ajaxurl;
	    
	    if($('#notice_id').val()=='0') ajaxurl=get_url(json_str.admin_base+'sys_notice/add/1');
	    else ajaxurl=get_url(json_str.admin_base+'sys_notice/edit/'+$('#notice_id').val()+'/1');
	    
	    $('#sysnotice_form :input').each(function() {
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
			 data: data+'&notice_submit='+$('#notice_submit').val(),
			 url:  ajaxurl,
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
	
	$("#notice_cancel,#notice_add_cancel").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$('.delete_this').live('click',function(){
		var cur_id=$(this).closest('ul').attr('id');
		var title=$('#'+cur_id+' li').filter('.notice_title').text();
		var ids_to_delete=cur_id.replace('_table','');
		  
		var data ={
		      	 "title"       : "确认对话框",
		         "action"      : "删除信息 ", 
		         "object"      : title,
		         "main_infor"  : "此举将会删除该信息，确认吗？",
		         "dialog_view" : "dialog_infor",
		         "infor_type"  : "warning",
		         "submit"      : "delete_notice"
		        };
		var browser='not_ie6';
		$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
		data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
		show_dialog(data,browser);
	});
	//显示删除项目的提示对话框
	
	$("#delete_notice").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"sys_notice/delete_notice/"),
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

function myedit(obj) {
	 var id=obj.id.split('_');
     $.ajax({
       	   type: 'post',			   
           url:  get_url(json_str.admin_base+"sys_notice/edit/"+id[0]),
           success : function(data,textStatus){
				 try{
				     data = eval('(' + data + ')');				 
					 if(data.result=='1') {
						 $(".edit").html(data.infor);
				         $('.list').slideUp();
				         $('.edit').slideDown();
					 }
					 else ajax_success(data,textStatus,'','json');
				  }
				 catch(err){
				 	 ajax_success('',textStatus,'','string');
				}
         	  },
         error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
    });	
}

function myview(obj) {
	var id = obj.id.split('_');
	var obj=$('#'+obj.id);
    $.get(get_url(json_str.admin_base+"sys_notice/view/"+id[0]),function(data){
    	if(data) {
			simple_viewer(obj.offset().left+100,obj.offset().top+10,data);
		}
		else top_message('对象不存在！');
    });
}
     
    