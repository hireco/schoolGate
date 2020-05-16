$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	//名称检验
	$('#en_title').live('keyup',function(){
		$('#visiting_url').text(json_str.base_url+'html/view/'+$(this).val());
	});

	$('#cn_title').live('change',function(){
		var obj=$(this);
	    
		if(speical_chars(obj.val())) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"html_page/js_check_title/"+obj.attr('id')),{html_id: $('#html_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名页面已经存在！'); 
			   return false;
		   } 
		   else  $.post(get_url(json_str.base_url+'ajax/cms_ajax/get_pinyin_name'),{cn_name : obj.val()},function(data){
			      $('#en_title').val(data);	
				  $('#visiting_url').text(json_str.base_url+'html/view/'+data);
		      });
	     }); 	
	});

	$('#switch_for_en_title').live('click',function(){
	     $('#for_en_title').toggle();
	});

	$('#en_title').live('change',function(){
		var obj=$(this);
		var data=obj.val();
	    
		if(!seo_url_check(data)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"html_page/js_check_title/"+obj.attr('id')),{html_id: $('#html_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名页面已经存在！'); 
			   obj.val('');
			   return false;
		   } 
	     }); 	

		$('#visiting_url').text(json_str.base_url+'html/view/'+obj.val());	
	});
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//切换标签
    $('.horizon_items').live('click',function(){
     var cur_id=$(this).attr('id').split('_');
     
     $('.horizon_items').removeClass('selected');
     $(this).addClass('selected');
     
     $.ajax({
        type: 'post',
        url:   get_url(json_str.admin_base+'html_page/'+cur_id[1]),
        success: function(data,textStatus) {
        	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
            $('#data_viewer').html(data); 
            if(cur_id[1]=='edit' && cur_id[0]=='full')  { 
            	oEditor.Config['FullPage']=true; 
            	oEditor.SwitchEditMode();
            	
            	if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
            	//必须切换到所见即所得的模式
            	
            	oEditor.SetHTML('<html dir="ltr"><head><title></title></head><body><p>&nbsp;</p></body></html>'); 
            	$('#fckeditor_div').show();
            	
            	$('#full_page').val('1');
            	$('#part_page_warning').hide();
            }
            else if(cur_id[1]=='edit' && cur_id[0]=='part')  { 
            	oEditor.Config['FullPage']=false;
            	oEditor.SwitchEditMode();
            	
            	if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
            	//必须切换到所见即所得的模式
            	$('#fckeditor_div').show();
            	
            	$('#full_page').val('0');
            	$('#part_page_warning').show();
            }
            else { 
            	$('#fckeditor_div').hide();
            	initPagination(); //重新分页
            }
        },
        error: function(textStatus) {
        	ajax_failed(textStatus);
        }
      });       
    });

	//生成右键菜单
    $('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); 
			}, 
			'address': function(t) {		       
			   var obj=$('#'+t.id);
			   text_selected('拷贝地址',$('#'+t.id+' .by_address').text(),obj);
		   },
		   'copy_id': function(t) {
			   var obj=$('#'+t.id);
			   var ids=get_id_list(t);
			   
			   try{ $(window.opener.document).find('.copy_id_to_filled').val(ids); }
			   catch(err) { 
				   if($.browser.msie)  window.clipboardData.setData('text',ids); 
				   else  text_selected('拷贝ID',ids,obj);
			   }
		   },
		   'locked':function(t) {
			   set_item_attr(t,'locked','1','item_onoff');
		   },
		   'no_locked':function(t) {
			   set_item_attr(t,'locked','0','item_onoff');
		   }, 
		   'hide':function(t) {
			   set_item_attr(t,'hide','1','item_onoff');
		   },
		   'no_hide':function(t) {
			   set_item_attr(t,'hide','0','item_onoff');
		   },    
			'delete': function(t) {
				mydelete(t);},
		    'view': function(t) {
		    	myview(t);},
		    'show': function(t) {
		    	myshow(t);}
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });

    $('#html_submit').live('click',function(){
        var data;
    	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
    	var innerhtml=oEditor.GetXHTML(true);
    	if(actual_txtlength(innerhtml,'len')==0) {
            top_message('请输入主体内容');
            return false;
        }
    	else $('#html_content').val(innerhtml);
    	 
    	if($.trim($('#cn_title').val())=='') {
    		top_message('请输入中文名称！');
    		return false;
    	} 

    	if($.trim($('#en_title').val())=='') { 
    		top_message('请输入访问英文ID！');
    		return false;
    	}
        
    	data='group_id='+$('#group_id').val()+'&full_page='+$('#full_page').val()+'&html_id='+$('#html_id').val()+'&cn_title='+escape(beforeEscape($('#cn_title').val()))+'&en_title='+escape(beforeEscape($('#en_title').val()))+'&html_content='+escape(beforeEscape($('#html_content').val()));
        
    	$.ajax({
       	    type: 'post',
            url:   get_url(json_str.admin_base+"html_page/edit"),
            data:  data,
            success : function(data,textStatus){ 
				 try{ 
	                data=eval('(' + data + ')');
					ajax_success(data,textStatus,data.url,'json');
                 }
				 catch(err){
	                 //alert(data);
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
			 },
			 error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
        });	
    });	

    $("#delete_page").live('click',function(){		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_to_delete').val(),
			url : get_url(json_str.admin_base+"html_page/delete_html/"),
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
    
    $("#html_cancel").live('click',refresh_pages_list);
});
  
  function myview(obj) {
	  var id=obj.id.split('_');
	  window.open(get_url(json_str.admin_base+"html_page/preview/"+id[0]),'newwin','toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=no');
  }  
  
  function myshow(obj) {
	  var id=$('#'+obj.id+' .by_en_title').text();
	  window_open(get_url(json_str.base_url+"html/"+id),'1024','768',true);
  }
  
  function set_item_attr(obj,attr,value,action) {
	  
	  var ids_selected=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_selected+'&attr='+attr+'&value='+value,
			url : get_url(json_str.admin_base+"html_page/"+action),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') {
	                	ids=ids_selected.split(',');
	                	for(var i=0; i<ids.length; i++) {
	                		$('#'+attr+'_'+ids[i]).removeAttr('class');
	                		$('#'+attr+'_'+ids[i]).addClass('attr_'+value);
	                	}
	                	//refresh_pages_list();
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

  function myedit(obj) {
	  var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
	  var id=obj.id.split('_');
	  var page_mode =$.trim($('#'+obj.id).children().filter('.page_mode').text())=='是'?true:false;
	  
	  $('.horizon_items').removeClass('selected');
	  page_mode?$('#full_edit').addClass('selected'):$('#part_edit').addClass('selected');
	  
	  $.ajax({
      	   type: 'post',
      	   data: 'html_id='+id[0],
      	   url:  get_url(json_str.admin_base+"html_page/edit"),
      	   success : function(data,textStatus){
      		    $('#data_viewer').html(data);
		 		
		 		if(page_mode) oEditor.Config['FullPage']=true;
		 		else oEditor.Config['FullPage']=false;
		 		
		 		oEditor.SwitchEditMode();
		 		
		 		if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
		 		//必须切换到所见即所得的模式
		 		
		 		oEditor.SetHTML($('#html_content').val());					 		
		 		$('#fckeditor_div').show();
		 		
		 		$('#full_page').val(page_mode?'1':'0');
		 		if(!page_mode) $('#part_page_warning').show();
      	  },
      	  error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
     });	
  }

  function mydelete(obj) {
	  
	  var title=get_title(obj);
	  var ids_to_delete=get_id_list(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除静态页面 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除其所有内容，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_page"
	        };
	  var browser='not_ie6';
	  $('#id_to_delete').val(ids_to_delete); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
  }
  
  function refresh_pages_list() {
	    $.get(get_url(json_str.admin_base+'html_page/pages'),function(data){
	    	$('#data_viewer').html(data);
	    	$('#fckeditor_div').hide();
			
	    	initPagination(); //重新分页
	    	sort_pagination($('#'+$('#current_order_by').text()),false);
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
		 return title=$('#'+obj.id).children().filter('.by_cn_title').text();
}