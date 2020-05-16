var myTimer;
var initial_images='';
var img_text=[];
var delimg_hint=1;
//全局变量

$(document).ready(function(){
	
	detect2show_images();
	
	//右键菜单生成
	$('.img_just_uploaded').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	       'thumb': function(t) {
	    	   var cur_id=t.id;
	    	   var imgsrc=$('img#'+cur_id).attr('src').split('?').shift();
	    	   imgsrc=imgsrc.replace(json_str.site_base,'').replace(json_str.thumb_prefix,'');
	    	   imgsrc=imgsrc.replace(json_str.base_url.replace(json_str.site_base,''),'');
	    	   
	    	   var size=$("#cms_icon_size").html();
   		       size=size.split(':');
   			   var data ={
   		      	 "action"       : 'crop',
   		         "t_width"      : size[0],
  	             "t_height"     : size[1],
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
	    	   
	    	   var size=$("#album_img_size").html();
   		       size=size.split(':');
   			   var data ={
   		      	 "action"       : 'crop',
   		         "t_width"      : size[0],
  	             "t_height"     : size[1],
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
	
	$("#upload_image").live('click',function(){
		var size=$("#cms_icon_size").html();
	    size=size.split(':');
		var data ={
	      	"action"       : 'upload',
			"sendback"	   : 'album_image',
			"t_width"      : size[0],
	        "t_height"     : size[1],
			"path"         : $("#upload_dir").html(),
			"replace"      : '0',
			"reserve"      : '1',
			"show_preview" : '0',
			"upload_zip"   : $('#is_upload_zip').attr('checked')?'1':'0'
	        };
		show_upload_crop(data);
	});

    $(".close_pannel").live('click',function(){
   	 myTimer=setInterval(detect2show_images, 100);
    });
    
  	function detect2show_images() {
         var images=$('#album_image').val();
         var imghtml='';          
   	  if(images!=initial_images) {
   		  img_text=$('#img_text').val();
   		  initial_images=images; 
   		  $('#album_just_uploaded').parent().show(function(){
   			 images=images.split('::');
   			 images=images[0].split(':');
   			 img_text=img_text.split(':');
   			 for(var i=0;i<images.length;i++){ 
   	   			   if(images[i])  	   			   
    			   imghtml+='<img id="img_'+i+'" class="img_just_uploaded"  onerror="remove_this(this);" src="'+images[i]+'"  />';
   	   			   if(typeof(img_text[i])=='undefined') img_text[i]='';
   			 }
   			 $('#album_just_uploaded').html(imghtml);
   			 $('#img_text').val(img_text.join(':'));
   			 $('img.img_just_uploaded').load(create_iconbar); 
   			 //重新布局图片的作用，不会重新下载图片的，load是用cache欺骗人的。
          }); 
    	  clearInterval(myTimer);   
	  }
    }

    $('#fckediror_pannel_link').live('click',function(){
    	$('#fckeditor_pannel').toggle();
    });
    
    $('.pannel_toggle').live('click',function(){
    	var cur_id=$(this).attr('id')+'_div';    	
        if(cur_id=='content_link_div')  
        	$('.img_corner_btn').show();
        else 
        	$('.img_corner_btn').hide();
    });

    $('.close_bubblepopup').live('click',function(){
    	$('.delimg_icon').RemoveBubblePopup();
    	delimg_hint=0;
    }); 
    
    $('.img_text_input').live('mouseout',function(){
    	var cur_id=$(this).attr('id');    	
    	var cur_num=parseInt(cur_id.replace('text_img_',''));
    	
    	if(img_text[cur_num]!=$(this).val()) {
    		img_text[cur_num]=$(this).val();
        	$('#img_text').val(img_text.join(':'));  
        	
        	icon_id=cur_id.replace('text','iconbar');
        	$('#'+icon_id).children().filter('.editimg_icon').SetBubblePopupInnerHtml('说明文字<input type="text" value="'+img_text[cur_num]+'" class="img_text_input" id="'+cur_id+'"  />', true);    		
    	}    	
    });
    
    $('.delimg_icon').live('click',function(){
        var cur_id=$(this).parent().attr('id');
        
        var t_imgsrc, imgsrc, images_saved;
        cur_id=cur_id.replace('iconbar_','');
        t_imgsrc=$('#'+cur_id).attr('src').split('?').shift();
        t_imgsrc=t_imgsrc.replace(json_str.site_base,'');  //in ie6, src has been added http://www.xxx.com automatically
        imgsrc=t_imgsrc.replace(json_str.thumb_prefix,'');
        
        images_saved=$('#album_image').val();
        
        images_saved=images_saved.split('::'); //大图小图分界标记
        
        images_saved[0]=images_saved[0].split(':');
        arrayRemoveByValue(images_saved[0], t_imgsrc);
        images_saved[1]=images_saved[1].split(':');
        arrayRemoveByValue(images_saved[1], imgsrc);
        
        images_saved[0]=images_saved[0].join(':');
        images_saved[1]=images_saved[1].join(':');
        
        images_saved=images_saved.join('::');
        if(images_saved=='::')  images_saved='';
        
        var text_saved=$('#img_text').val();
        var text_id=parseInt(cur_id.replace('img_',''));
         
        text_saved=text_saved.split(':');
        arrayRemoveByValue(text_saved,img_text[text_id]);
        text_saved=text_saved.join(':');
        
        $.ajax({
            type: 'post',
            data: 'files='+imgsrc+':'+t_imgsrc+'&retains='+$('#album_image_sql').val(),
            url:  get_url(json_str.base_url+'ajax/image/delete_images'),
            success: function(data,textStatus){
 				 if(data=='1') {
 					 $('#album_image').val(images_saved);
 					 $('#img_text').val(text_saved);
 					 $('#'+cur_id).remove();
 					 $('#iconbar_'+cur_id).children().RemoveBubblePopup();
 					 initial_images=images_saved;
 					 create_iconbar();
 				 }
 				 else ajax_success('删除失败',textStatus,'','string');
 			 },
 			 error:function(textStatus) {
 				 ajax_failed(textStatus);
 			 }
        });
    });
 });

function create_iconbar() {
    $('.img_corner_btn').remove();
    $('.img_just_uploaded').each(function(){
    	var left=$(this).offset().left+3; 
    	var top=$(this).offset().top+3;
    	$('body').append('<div class="img_corner_btn" style="left:'+left+'px; top:'+top+'px;" id="iconbar_'+$(this).attr('id')+'"></div>');
    	$('#iconbar_'+$(this).attr('id')).append('<div class="editimg_icon"></div><div class="delimg_icon"></div>');
   	}); 
    
    if(delimg_hint==1) {
        bubble_initial($('.editimg_icon,.delimg_icon')); //初始化 
        $('.delimg_icon').SetBubblePopupInnerHtml('点击删除<a title="关闭" class="close_bubblepopup" href="javascript:void(0);"></a>', true);
    }
    else {
    	bubble_initial($('.editimg_icon')); //初始化 			 
    }
    
    $('.editimg_icon').each(function(){
        var cur_id=$(this).parent().attr('id');
        cur_id=cur_id.replace('iconbar','text');
        var cur_num=parseInt(cur_id.replace('text_img_',''));
        $(this).SetBubblePopupInnerHtml('说明文字<input value="'+img_text[cur_num]+'" type="text" class="img_text_input" id="'+cur_id+'"  />', true);
    });
}

function bubble_initial(obj,html) {
	
	addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');
	obj.CreateBubblePopup({			
		selectable: true,
		position : 'top',
		align	 : 'center',	
		innerHtml:  arguments[1]?html:'请稍候...',
		innerHtmlStyle: {'text-align':'left','font-size':'12px;'},	
		themeName: 	'blue',
		themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
    });
}

function remove_this(obj) {
	top_message('有图片不存在，自动清除中...',function(){
		$('#iconbar_'+obj.id+' .delimg_icon').click();
	},'warn');
}