$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); 
			}
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	
    
	$('.config_list').live('click',function(){
		 var config_class=$(this).text();
		 $('.horizon_items').parent().removeClass('selected');
		 $(this).parent().addClass('selected');
		    
		 $.ajax({
			 type: 'post',
			 url:  get_url(json_str.admin_base+'sys_config/clist/ajax'),
			 data: 'config_class='+config_class,
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
	
	$('.config_add').live('click',function(){
		$.get(get_url(json_str.admin_base+'sys_config/add'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});//显示添加配置表单
	
	$('#input_type').live('change',function(){
		if($(this).val()=='text') $('#item_value').html('<input type="text" class="enterbox  keywords filled" name="config_value" id="config_value" value="" /><label>*限100字</label>');
		else if($(this).val()=='textarea') $('#item_value').html('<textarea class="enterbox enterarea filled" name="config_value" id="config_value"></textarea><label class="top">*限100字</label>');
		else if($(this).val()=='radio')  $('#item_value').html('<input type="radio" name="config_value"  id="config_value_1" value="1" checked="checked" /><label>是</label><input type="radio" name="config_value"  id="config_value_0" value="0" /><label>否</label>');
	});//根据参数的类型，分别显示参数的表单项目
	
	$('#config_name').live('change',function(){
		$.post(get_url(json_str.admin_base+'sys_config/chk_config_name'),{config_name: $('#config_name').val()},function(data){
			if(data=='0') { 
				top_message('变量名不符合要求，或者已经存在！');
				$('#config_name').val('');
			}
		});
	});//验证参数名是否符合要求
	
	$("#config_submit").live('click',function(){
	    var config_value;
	    
	    if($('#input_type').val()=='radio') config_value=$('[name="config_value"]:checked').val();
	    else config_value=$.trim($('#config_value').val());
	    
		if(config_value=='') {
	         top_message('取值不能为空，请填写！');
	         return false;
	    } 
	    
		$.ajax({
			 type: 'post',
			 data: 'config_submit='+$('#config_submit').val()+'&config_value='+escape(config_value),
			 url:  get_url(json_str.admin_base+'sys_config/edit/'+$('#config_id').val()+'/1'),
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
	});//提交编辑参数结果
	
	$("#config_add_submit").live('click',function(){
	    var config_value;
	    var data,flag=1;
		var inputs = [];
	    
	    $('#sysconfig_add :input').not('[name="config_value"]').each(function() {
	     	 if($(this).val()=='' && $(this).hasClass('filled')) { 
	   			 top_message('表单尚未填写完整'); 
	   			 flag=0; return false;
	   		 }
	     	 inputs.push(this.name + '=' + escape(this.value));
	    });
	    
	    if(!flag) return false;
	    
	    data=inputs.join('&');
	    
	    if($('#input_type').val()=='radio') config_value=$('[name="config_value"]:checked').val();
	    else config_value=$.trim($('#config_value').val());
	    
		if(config_value=='') {
	         top_message('取值不能为空，请填写！');
	         return false;
	    } 
		
		data=data+'&config_value='+escape(config_value);
		
		$.ajax({
			 type: 'post',
			 data: data+'&config_add_submit='+$('#config_add_submit').val(),
			 url:  get_url(json_str.admin_base+'sys_config/add/1'),
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
	
	$("#config_cancel,#config_add_cancel").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$('.delete_this').live('click',function(){
		var cur_id=$(this).closest('ul').attr('id');
		var title=$('#'+cur_id+' li').filter('.config_title').text();
		var ids_to_delete=cur_id.replace('_table','');
		  
		var data ={
		      	 "title"       : "确认对话框",
		         "action"      : "删除设置项目 ", 
		         "object"      : title,
		         "main_infor"  : "此举将会导致调用该项目的页面出错，确认吗？",
		         "dialog_view" : "dialog_infor",
		         "infor_type"  : "warning",
		         "submit"      : "delete_config"
		        };
		var browser='not_ie6';
		$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
		data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
		show_dialog(data,browser);
	});
	//显示删除项目的提示对话框
	
	$("#delete_config").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"sys_config/delete_config/"),
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
         	   url:  get_url(json_str.admin_base+"sys_config/edit/"+id[0]),
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