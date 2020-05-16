var myTimer;
var initial_images='';
var img_text=[];
var img_str=[];
var img_link=[];
//全局变量

$(document).ready(function(){	
	
	$('#new_scroll').click(function(){
		$.ajax({
			type: 'post',
			url : get_url(json_str.admin_base+'img_scroll/form'),
			success : function(data,textStatus){
				initial_images='';
				$(".edit").html(data);
				$('.list').slideUp();
				$('.edit').slideDown(); 
				detect2show_images();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){ 
				ajax_failed(textStatus);
			}		
		});
	});
	
	$("#upload_image").live('click',function(){
		
		if(img_text.length==20) {
			top_message('图片的最大数量为20');
			return false;
		}
	    var data ={
	      	"action"       : 'upload_and_crop',
			"sendback"	   : 'photo_list',
			"t_width"      : $('#thumb_width').val(),
	        "t_height"     : $('#thumb_height').val(),			
			"path"         : $("#upload_dir").html(),
			"preview"      : $("#preview_image").html(),
			"replace"      : '0',
			"reserve"      : '1'
	        };
		show_upload_crop(data);
	});
	
	$(".close_pannel").live('click',function(){
	   	 myTimer=setInterval(detect2show_images, 100);
	});
	
	$('[id^="img_text_"]').live('change',function(){
    	var cur_id=$(this).attr('id');    	
    	var cur_num=parseInt(cur_id.replace('img_text_',''));
    	
    	if(img_text[cur_num]!=$(this).val()) {
    		img_text[cur_num]=$(this).val();
        	$('#img_text').val(img_text.join('|'));  
         }    	
   });
   
   $('[id^="img_str_"]').live('change',function(){
    	var cur_id=$(this).attr('id');    	
    	var cur_num=parseInt(cur_id.replace('img_str_',''));
    	
    	if(img_str[cur_num]!=$(this).val()) {
    		img_str[cur_num]=$(this).val();
        	$('#img_str').val(img_str.join('|'));  
         }    	
   });	
	
	
   $('[id^="img_link_"]').live('change',function(){
   	var cur_id=$(this).attr('id');    	
   	var cur_num=parseInt(cur_id.replace('img_link_',''));
   	
   	if(img_link[cur_num]!=$(this).val()) {
   		img_link[cur_num]=$(this).val();
       	$('#img_link').val(img_link.join('|'));  
        }    	
   });

   $('.goup').live('click',function(){
   	   	var cur_html,pre_html,cur_ope,pre_ope;
		var cur_id=$(this).closest('.nextrow').attr('id'); 
		var pre_id=$('#'+cur_id).prev().attr('id');

		cur_html=$('#'+cur_id).html();
		pre_html=$('#'+pre_id).html();

		cur_ope=$('#'+cur_id+' .operation_span').html();
		pre_ope=$('#'+pre_id+' .operation_span').html();

		$('#'+cur_id).html(pre_html);
		$('#'+pre_id).html(cur_html);

		$('#'+cur_id+' .operation_span').html(cur_ope);
		$('#'+pre_id+' .operation_span').html(pre_ope);

		$('#'+cur_id).attr('id',pre_id);
		$('#'+pre_id).attr('id',cur_id);


		var images_saved,t_imgsrc=[],imgsrc=[],text_saved=[],str_saved=[],link_saved=[];
		$('.nextrow').each(function(i){
		    
			cur_id=$(this).attr('id');
			
			t_imgsrc[i]=$('img#'+cur_id.replace('span','')).attr('src').split('?').shift();
	        t_imgsrc[i]=t_imgsrc[i].replace(json_str.site_base,'');
			imgsrc[i]=t_imgsrc[i].replace(json_str.thumb_prefix,'');
		
			text_saved[i]=$('#'+cur_id.replace('span','_text')).val();
			str_saved[i]=$('#'+cur_id.replace('span','_str')).val();
		    link_saved[i]=$('#'+cur_id.replace('span','_link')).val();
		});
		
		images_saved=t_imgsrc.join(':')+'::'+imgsrc.join(':');
		
		initial_images=images_saved;
		img_text=text_saved;
        img_str=str_saved;
        img_link=link_saved;

        text_saved=text_saved.join('|');
		str_saved=str_saved.join('|');  
		link_saved=link_saved.join('|');
		
		$('#photo_list').val(images_saved); 
 		$('#img_text').val(text_saved);
 		$('#img_str').val(str_saved);
 		$('#img_link').val(link_saved);	
		
   });	

   $('.delete').live('click',function(){
	   var images_saved,t_imgsrc, imgsrc;
	   var cur_id=$(this).closest('.nextrow').attr('id');
	   
	   t_imgsrc=$('img#'+cur_id.replace('span','')).attr('src').split('?').shift();
	   t_imgsrc=t_imgsrc.replace(json_str.site_base,'');
	   imgsrc=t_imgsrc.replace(json_str.thumb_prefix,'');
	   
	   images_saved=$('#photo_list').val();
       images_saved=images_saved.split('::'); //大图小图分界标记
       
       images_saved[0]=images_saved[0].split(':');
       arrayRemoveByValue(images_saved[0], t_imgsrc);
       images_saved[1]=images_saved[1].split(':');
       arrayRemoveByValue(images_saved[1], imgsrc);
       
       images_saved[0]=images_saved[0].join(':');
       images_saved[1]=images_saved[1].join(':');
       
       images_saved=images_saved.join('::');
       if(images_saved=='::')  images_saved='';
	   
	   var int_id=parseInt(cur_id.replace('imgspan_',''));
       var text_saved=$('#img_text').val();       
       text_saved=text_saved.split('|');
       arrayRemoveByValue(text_saved, img_text[int_id]);
       text_saved=text_saved.join('|');
       
       var str_saved=$('#img_str').val();       
       str_saved=str_saved.split('|');
       arrayRemoveByValue(str_saved, img_str[int_id]);
       str_saved=str_saved.join('|');
       
       var link_saved=$('#img_link').val();       
       link_saved=link_saved.split('|');
       arrayRemoveByValue(link_saved, img_link[int_id]);
       link_saved=link_saved.join('|');
       
       $.ajax({
            type: 'post',
            data: 'files='+imgsrc+':'+t_imgsrc+'&retains='+$('#photo_list_sql').val(),
            url:  get_url(json_str.base_url+'ajax/image/delete_images'),
            success: function(data,textStatus){
 				 if(data=='1') {
 					 $('#photo_list').val(images_saved); 
 					 $('#img_text').val(text_saved);
 					 $('#img_str').val(str_saved);
 					 $('#img_link').val(link_saved);
 					 initial_images=images_saved;
 					 $('#'+cur_id).remove();
					 $('.operation_span:first .goup').remove();
 				 }
 				 else ajax_success('删除失败',textStatus,'','string');
 			 },
 			 error:function(textStatus) {
 				 ajax_failed(textStatus);
 			 }
        });
    });
    
    $("#scroll_submit").live('click',function(){
		 scroll_submit();
	});
  
    $("#scroll_cancel").live('click',function(){
		delete_images_cancel();
		refresh_scroll_list();
	});
    
    $('[id$="_table"]').live("mouseover",function(){
    	$(this).contextMenu('mycontext_menu', { 
    		bindings: {			  
    	        'edit': function(t) {
    				myedit(t); },             
    			'delete': function(t) {
    				mydelete(t);}    
    	      },
    	      itemStyle: {	    	 
    	          border: '1px dashed #cccccc',
    	          margin: '2px'
    	      }
    	});
    });
	      	
    
    //删除内容--------------------------------------------------//
	$("#delete_scroll").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"img_scroll/delete_scroll/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
					   $('#'+data.id+'_table').remove();
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
    
	//右键菜单生成
	$('.img_just_uploaded').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	       'thumb': function(t) {
	    	   var cur_id=t.id;
	    	   var imgsrc=$('img#'+cur_id).attr('src').split('?').shift();
	    	   imgsrc=imgsrc.replace(json_str.site_base,'').replace(json_str.thumb_prefix,'');
	    	   imgsrc=imgsrc.replace(json_str.base_url.replace(json_str.site_base,''),'');
	    	   
   			   var data ={
   		      	 "action"       : 'crop',
   		         "t_width"      : $('#thumb_width').val(),
  	             "t_height"     : $('#thumb_height').val(),
   				 "preview"      : imgsrc,
   				 "path"         : imgsrc.replace(basename(imgsrc),''),
   				 "refresh"      : cur_id
   		      };
   			  show_upload_crop(data);	
		   },
		   'crop': function(t) {
			   var cur_id=t.id;
			   var imgsrc=$('img#'+cur_id).attr('src').split('?').shift();
	    	   imgsrc=imgsrc.replace(json_str.site_base,'').replace(json_str.thumb_prefix,'');
	    	   imgsrc=imgsrc.replace(json_str.base_url.replace(json_str.site_base,''),'');
	    	   
	    	   var data ={
   		      	 "action"       : 'crop',
   		         "t_width"      : $('#photo_width').val(),
  	             "t_height"     : $('#photo_height').val(),
   				 "preview"      : imgsrc,
   				 "path"         : imgsrc.replace(basename(imgsrc),''),
   				 "crop_for"     : 'crop'
   		      };
   			  show_upload_crop(data);
		   }
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });
	
});

function detect2show_images() {
    var images=$('#photo_list').val();
    var imghtml='';          
	if(images!=initial_images) {
		  img_text=$('#img_text').val();
		  img_str=$('#img_str').val();
		  img_link=$('#img_link').val();
		  initial_images=images; 
		  $('#images_just_uploaded').parent().show(function(){
			 images=images.split('::');
			 images=images[0].split(':');
			 img_str=img_str.split('|');
			 img_text=img_text.split('|');
			 img_link=img_link.split('|');
			 $('#images_just_uploaded').html('');
			 for(var i=0;i<images.length;i++){
				if(images[i]) {
				   $('#images_just_uploaded').append('<span class="nextrow" id="imgspan_'+i+'"></span>');
	   			   imghtml='<img id="img_'+i+'" class="img_just_uploaded"  src="'+images[i]+'"  /><span class="imginput" id="imginput_'+i+'"></span>'; 
	   			   if(typeof(img_str[i])=='undefined')  img_str[i]='';
	   			   if(typeof(img_text[i])=='undefined') img_text[i]='';
	   			   if(typeof(img_link[i])=='undefined') img_link[i]='';
	   			   
	   			   $('#imgspan_'+i).append(imghtml);  	   			   
	   			   
	   			   $('#imginput_'+i).append('<span class="left_block"><input type="text" id="img_text_'+i+'"  class="enterbox photo_caption" value="'+img_text[i]+'"   /><label>*图片标题</label></span>');
	   			   $('#imginput_'+i).append('<span class="left_block"><textarea id="img_str_'+i+'" class="enterbox photo_description">'+img_str[i]+'</textarea><label class="textarea_label">*介绍文字</label></span>');
	   			   $('#imginput_'+i).append('<span class="left_block"><input id="img_link_'+i+'" type="text" class="enterbox keywords" value="'+img_link[i]+'"  /><label>*图片链接</label></span>');
	   			   $('#imginput_'+i).append('<span class="operation_span"><span title="点击删除此图" class="left_block delete"></span></span>');
				   if(i!=0) $('#imginput_'+i+' .operation_span').append('<span title="前移此项" class="left_block goup"></span>'); 
				}
		     }
			 $('#img_str').val(img_str.join('|'));
			 $('#img_text').val(img_text.join('|'));
			 $('#img_link').val(img_link.join('|'));
     }); 
	  clearInterval(myTimer);   
  }
}

function scroll_submit(){
	var flag=1;
	var inputs=[];
	
	$('#scroll_form :input').each(function() {
	  	 if($(this).val()=='' && $(this).hasClass('filled')) { 
	  		$(this).css({'border':'1px solid red'});
	  		top_message('表单尚未填写完整'); 
			flag=0; return false;
		 }
	  	 $(this).removeAttr('style');
	  	 inputs.push(this.name + '=' + escape(this.value));
	});
	
	if(!flag) return false;
	
	data=inputs.join('&');
	
	$.ajax({
	  	   type: 'post',
	       url:   get_url(json_str.admin_base+"img_scroll/submit"),
	       data:  data,
	       success : function(data,textStatus){	    	          
	    	     try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1')  {	
	                	delete_images_sql();
	                	ajax_success(data,textStatus,'reload','json');
	                }
	                ajax_success(data,textStatus,'','json');
	                
	             } 
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
		   },
		   error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}

function myedit(obj) {
	var id_to_edit=obj.id.split('_');
	
	$.ajax({
	  	   type: 'post',
	       url:   get_url(json_str.admin_base+"img_scroll/form"),
	       data:  'scroll_id='+id_to_edit[0],
	       success : function(data,textStatus){	    	          
	    	   initial_images='';
			   $(".edit").html(data);
			   $('.list').slideUp();
			   $('.edit').slideDown(); 
			   detect2show_images();  
		   },
		   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
			   ajax_failed(textStatus);
		   }
	}); 
}

function mydelete(obj) {	  
	  var id_to_delete=obj.id.split('_');
	  var title=$('#title_'+id_to_delete[0]).text();
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除滚动图片组 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除该滚动图片组，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_scroll"
	        };
	  var browser='not_ie6';
	  $('#id_be_selected').val(id_to_delete[0]); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}

function refresh_scroll_list() {	
	$.get(get_url(json_str.admin_base+'img_scroll/clist/ajax'),function(data){
		$("#clist_data").html(data);
		$('.edit').html('').slideUp();
		$('.list').slideDown();
	});
}