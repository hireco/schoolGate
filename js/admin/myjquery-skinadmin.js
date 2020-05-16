var myTimer;
var initial_image='';

$(document).ready(function(){
	
	myinitPagination(); //初始化分页
	
	$('.by_filename').live('mouseover',function(){
		$('.by_filename').removeAttr('style');
		$(this).css({'text-decoration':'underline','color':'blue'});
	});
	
	$('.by_filename').live('mouseout',function(){
		$('.by_filename').removeAttr('style');
	});
	
	//右键菜单生成
	$('.file .by_filename').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
		   'edit':  function(t) {
			   myedit(t);   
		   },
		   'delete': function(t) {
			   mydelete(t);
		   }
	      },
	      onShowMenu: function(e, menu) {
	        if ($('#file_type').val()=='image') 
		      $('#edit', menu).remove();		      
		    return menu;
		  },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });
	
	$('.list_files').live('click',function(){
		$('#file_type').val($(this).attr('id').replace('_list',''));
		$('#sub_dir').val('');
		refresh_files_list();
	});
	
	$('.by_filename').live('click',function(){
		if($(this).parent().hasClass('file')) return false;
		$('#sub_dir').val($(this).html());
		refresh_files_list();
	});
	
	//数据排序
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//删除内容--------------------------------------------------//
	$("#delete_file").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&'+$('#file_be_selected').val(),
			url : get_url(json_str.admin_base+"skin_admin/delete_file/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.result)  {
					   $('span#'+data.id).parent().remove();
					   myinitPagination();
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
	
	$('.skin_select').click(function(){
		$.get(get_url(json_str.admin_base+'skin_admin/select_skin'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});
	
	$("#skin_cancel,#file_cancel,#upload_return").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$("#skin_submit").live('click',function(){
	    var data;
	    
	    if(!$('#skin_id').val()) {
	    	top_message('请选择您的风格');
	    	return false;
	    }
	    
		data='skin_submit=yes&skin_id='+$('#skin_id').val();
		
		$.ajax({
			 type: 'post',
			 data: data,
			 url:  get_url(json_str.admin_base+'skin_admin/select_skin/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');
						 ajax_success(data,textStatus,'','json');
					  }
				   catch(err){
					    ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交风格选择
	
	//提交添加文档
	$('#file_submit').live('click',function(){
         var data=[],url,flag=1,value;
         
         if($('#existing').val()=='1' && !$('#overwrite').attr('checked')) {
        	 top_message('同名文件存在，请选择覆盖或者修改文件名！');
        	 return false;
         }
         
         $('#file_edit :input').not(':checkbox').each(function(){
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message('表单尚未填写完整'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
			 value = $(this).attr('name')=='file_content'?beforeEscape($.trim($(this).val())):$.trim($(this).val());
			 data.push($(this).attr('name')+'='+escape(value));
         });
         
         if(!flag) return false;
         
         $('#file_edit :checkbox:checked').each(function() {
         	 data.push(this.name + '=yes');
         });
         
         data=data.join('&');
         
         data=data+'&subdir='+$('#sub_dir').val();
        
         if($('#filename_old').val()) url=get_url(json_str.admin_base+'skin_admin/edit_file/1');
         else url=get_url(json_str.admin_base+'skin_admin/add_file/1');
         
         $.ajax({
            type: 'post',
            url : url,
            data: data,
            success : function(data,textStatus){   	       	     
       	        try{ 
                   data=eval('(' + data + ')'); 
                   if(data.result=='1') {
                	   ajax_success(data,textStatus,'current','json');
                	   refresh_files_list();                	                   	   
                   }
                   else  ajax_success(data,textStatus,'current','json');
                } 
   			    catch(err){
   			    	
   			    	ajax_success('操作失败，请重试！',textStatus,'','string');
                }
   	       },
   	       error  : function(XMLHttpRequest, textStatus, errorThrown){
   	   	        ajax_failed(textStatus);
   	   	   }         
         }); 
	});
	
	$('.horizon_items').click(function(){
		 $('.horizon_items').parent().removeClass('selected');
         $(this).parent().addClass('selected'); 
	});
	
	$('.file_add').live('click',function(){
		
		var path=$('#file_path').val();
		var type=$('#file_type').val();
		
		$.ajax({
			type :  'post',
			url  :  get_url(json_str.admin_base+'skin_admin/add_file/0'),
			data :  'path='+path+'&type='+type,
			success: function(data,textStatus){
				data = eval('(' + data + ')');
				if(data.result=='1') $('.list').slideUp('fast',function(){
					$('.edit').slideDown('fast',function(){
						$(this).html(data.infor);
					});
				});
				else ajax_success(data.infor,textStatus,'','string');
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		});		
	});	
	
	$('#upload_linker').live('click',function(){
		$('#just_uploaded').parent().hide();
		
		$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    		$("body").append(data);
			block_all();
			$("#upload_pannel").draggable({ cursor: 'move' });
    	});
	});
	
	$('#FileName').live('keyup',function(){
		if($(this).val()) $('#upload_linker').attr('disabled',false);
		else $('#upload_linker').attr('disabled',true);
	});
	
	$('#upload_close').live('click',function(){
	   	 myTimer=setInterval(detect2show_images, 100);
	});
	    
	function detect2show_images() {
	  var image=$('#targetFileName').val();        
	  if(image!=initial_image) {
	   	 initial_image=image; 
	   	 $('#just_uploaded').parent().show(function(){
	   		$('#just_uploaded').html('<img class="img_just_uploaded"  src="'+json_str.base_url+initial_image+'"  />');
	    }); 
	        clearInterval(myTimer);
	   }
   }
	
   $('#filename').live('change',function(){
	  var filename=$(this).val();
	  var path=$('#to_path').val();
	  $.post(get_url(json_str.admin_base+'skin_admin/check_if_existing'),{filename :filename, path :path},function(data){
  		  if(data) {
  			  top_message('同名文件已经存在，请选择是否覆盖');
  			  $('#existing').val('1');
  			  $('#overwrite').parent().show();
  		  }else {
			  $('#existing').val('0');
			  $('#overwrite').parent().hide();
  		  }
  	  });
	  
   });
   
   $('#FileName').live('change',function(){
		  var filename=$(this).val();
		  var cur_file,ext;
		  $('.file_dir.file .by_filename').each(function(){
			 cur_file=$(this).text();
			 ext=cur_file.split('.').pop();
			 cur_file=cur_file.replace('.'+ext,'');
			 if(cur_file==filename) {
				 top_message('注意：后缀为'+ext+'的同名文件存在，上传相同格式将覆盖之！');
				 return false;
			 }
		  });
   });
   
});

function mypageselectCallback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.skin_list .file_dir').filter('[id^="skin_no"]').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.skin_list .file_dir').filter('[id^="skin_no"]').not('.page_exception_items').eq(i).show();
    }
    return false;
}

function myinitPagination() {
	var num_entries = $('.skin_list .file_dir').filter('[id^="skin_no"]').not('.page_exception_items').length; 
	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: mypageselectCallback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
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
	
	$(".skin_list_body").jSort({
        sort_by: 'span.'+cur_id,
        item: 'div',
        order: current_order,
        is_num: is_num
    });
	
	myinitPagination();
}

function refresh_files_list() {
	
	$.ajax({
		 type: 'post',
		 data: 'filetype='+$('#file_type').val()+'&subdir='+$('#sub_dir').val(),
		 url:  get_url(json_str.admin_base+'skin_admin/clist/ajax'),
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
				$('.edit').slideUp();
        		$('.list').slideDown();
	            myinitPagination();
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

function get_file_selected(obj) {
	  var path=$('#file_path').val();
	  var file=$('#'+obj.id).html(); 
	  var subdir=$('#sub_dir').val();
	  return {"path" : path,"file" : file ,"id" : obj.id, "subdir" : subdir};
}

function get_title(obj) {
	  return $('#'+obj.id).text();
}

//右键菜单函数

function myedit(obj) {
	
	var path=$('#file_path').val();
	var file=$('#'+obj.id+'').html();
	var subdir=$('#sub_dir').val();
	
	$.ajax({
		type :  'post',
		url  :  get_url(json_str.admin_base+'skin_admin/edit_file/0'),
		data :  'path='+path+'&file='+file+'&subdir='+subdir,
		success: function(data,textStatus){
			data = eval('(' + data + ')');
			if(data.result=='1') 
			    $('.list').slideUp('fast',function(){
					$('.edit').slideDown('fast',function(){
						$(this).html(data.infor);
					});
			   });
			else ajax_success(data.infor,textStatus,'','string');
     	 },
     	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}

function mydelete(obj) {
	  var title=get_title(obj);
	  var file_selected=get_file_selected(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除文件 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除该文件，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_file"
	        };
	  var browser='not_ie6';
	  $('#file_be_selected').val($.param(file_selected)); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}