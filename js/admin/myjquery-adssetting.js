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
    
	$('.setting_list').live('click',function(){
		 
		 $('.horizon_items').parent().removeClass('selected');
		 $(this).parent().addClass('selected');
		 refresh_ads_list();
		 
	});//按类型来刷新配置列表
	
	$('.setting_add').live('click',function(){
		$.get(get_url(json_str.admin_base+'advertise_setting/add'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});//显示添加配置表单
	
	$('#setting_name').live('change',function(){
		$.post(get_url(json_str.admin_base+'advertise_setting/chk_setting_name'),{setting_name: $('#setting_name').val()},function(data){
			if(data=='0') { 
				top_message('名称太长，或者该项目已经存在！');
				$('#setting_name').val('');
			}
		});
	});//验证参数名是否符合要求
	
	$("#setting_submit").live('click',function(){
	    var setting_value,direction;
	    
	    setting_value=$.trim($('#setting_value').val());
	    direction=$('#direction').val();
	    
		if(setting_value=='') {
	         top_message('取值不能为空，请填写！');
	         return false;
	    } 
	    
		$.ajax({
			 type: 'post',
			 data: 'setting_submit='+$('#setting_submit').val()+'&setting_value='+escape(setting_value)+'&direction='+direction,
			 url:  get_url(json_str.admin_base+'advertise_setting/edit/'+$('#setting_id').val()+'/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,'','json');
						 if(data.result=='1')  refresh_ads_list();
					  }
				   catch(err){
					 	 ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交编辑参数结果
	
	$("#setting_add_submit").live('click',function(){
	    var setting_value;
	    var data,flag=1;
		var inputs = [];
	    
	    $('#syssetting_add :input').each(function() {
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
			 data: data+'&setting_add_submit='+$('#setting_add_submit').val(),
			 url:  get_url(json_str.admin_base+'advertise_setting/add/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,'','json');
						 if(data.result=='1')  refresh_ads_list();
					  }
				   catch(err){
					 	 ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交添加参数结果
	
	$("#setting_cancel,#setting_add_cancel").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$('.delete_this').live('click',function(){
		var cur_id=$(this).closest('ul').attr('id');
		var title=$('#'+cur_id+' li').filter('.setting_title').text();
		var ids_to_delete=cur_id.replace('_table','');
		  
		var data ={
		      	 "title"       : "确认对话框",
		         "action"      : "删除设置项目 ", 
		         "object"      : title,
		         "main_infor"  : "此举将会导致调用该项目的页面出错，确认吗？",
		         "dialog_view" : "dialog_infor",
		         "infor_type"  : "warning",
		         "submit"      : "delete_setting"
		        };
		var browser='not_ie6';
		$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
		data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
		show_dialog(data,browser);
	});
	//显示删除项目的提示对话框
	
	$("#delete_setting").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"advertise_setting/delete_setting/"),
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
         	   url:  get_url(json_str.admin_base+"advertise_setting/edit/"+id[0]),
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

function refresh_ads_list() {
	$.ajax({
		 type: 'post',
		 url:  get_url(json_str.admin_base+'advertise_setting/clist/ajax'),
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
				$('.edit').slideUp();
	            $('.list').slideDown();	
	            initPagination();
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

function bubble_initial(obj,html) {

	 addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');   
	 obj.CreateBubblePopup({			
	     selectable: false,
		 position : 'top',
		 align	  : 'center',	
		 innerHtml:  html,
		 innerHtmlStyle: {'text-align':'left','font-size':'12px;'},	
		 themeName: 	'all-black',
		 themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
	 });
}