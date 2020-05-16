<div id="upload_crop_pannel">
<script type="text/javascript" src="<?php echo base_url();?>js/jquery.ajaxupload.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/jquery.imgareaselect.min.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/admin/myjquery-imguploadcrop.js" charset="utf-8"></script>
<div class="width_at_least_500">
<div  class="upload_crop_title">
  <?php echo $action!='crop'?'选择图片':'选择区域' ?>
</div>
<?php if($action!='crop') { ?>
<script>
$(document).ready(function() {
	
	$('#cropimage').live('click',function(){
	   return false;
	});	
	//在火狐下，File input不能完全覆盖图片的位置，导致form遗漏出来部分，
	//点击此部分也会提交，此将避免提交动作。
	
	new AjaxUpload('photoimg', {
		action: $('input#upload_action').val(),
		name: 'photoimg',
		onSubmit:  function(file, extension) {
			$("#save_thumbnail").hide();
			$("#thumbnail_infor").show().html('正在上传中,请稍候...');
		    $('img#photo').imgAreaSelect({ disable:true }); 
		    $('div[class^=imgareaselect-]').hide();
			$('img#photo').addClass('transparent');
			$('#preview img').addClass('transparent');			
		},
		onComplete: function(file, response) {
			try
			{
			   var response = eval('(' + response + ')');
			   $("#thumbnail_infor").hide(); 

               if(response.result=='1') {

            	   if($('#upload_zip').val()=='1') {
                       photos.push(response.photos);	  //将原图信息入栈
                       if(response.thumbnails && $('#action').val()=='upload' && $('#auto_thumb').val()=='1')  
    				     thumbnails.push(response.thumbnails);
    				   $("#thumbnail_infor").fadeIn(1000).html(response.infor).fadeOut(2000);  				   
                   }
                   
                   else if(response.image_name) {
    				   imageWidth  = response.imageWidth;
    			       imageHeight = response.imageHeight;
    			
    			       $('#frame_photo').height(imageHeight);
    			       $('#frame_photo').width(imageWidth); 			
    			       $('img#thumbnail').attr('src', response.image);
    			       $('img#photo').attr('src',response.image);

    				   $('img#photo').removeClass('transparent');
    			       $('#preview img').removeClass('transparent');
    				
    				   reset_body_size();
    			       
    				   $("#thumbnail_infor").fadeIn(1000).html(response.infor).fadeOut(2000);
    				   $('#image_name').val(response.image_name);
    				   $('#simage_name').val(response.simage_name);
    				   
    				   photos.push($("#image_name").val());	  //将原图信息入栈                   
    				   if($('#simage_name').val() && $('#action').val()=='upload' && $('#auto_thumb').val()=='1')  { 
        				   thumbnails.push($("#simage_name").val());  //如果在upload时，也自动产生了缩略图，则缩略图也入栈
    				       $('img#thumbnail').attr('src', $('#path').val()+response.simage_name); 
    				   }

                       $('img#photo').imgAreaSelect({
    		               aspectRatio : aspectRatio, 
    		               handles: true,
    					   parent:  '#imgselect_div',
    			           disable: $("#action").val()=='upload'?true:false,  //仅仅上传图片
                           fadeSpeed: 200,
    		               onSelectChange: preview,
    		               onSelectEnd : show_hint
    	              }); //若disable: true,则imgAreaSelect取消行为
    		       }
               }
                
               else  $("#thumbnail_infor").fadeIn(1000).html(response.infor);	
			}
			catch (err)
			{   alert(response);
				$("#thumbnail_infor").fadeIn(1000).html('上传失败');
			} 			
		}
	});
});
</script>
<form  class="float_left" id="cropimage" method="post" enctype="multipart/form-data">
   <div   class="file_upload_div" >
     <input type="file"    class="file_input" name="photoimg" id="photoimg" />
     <input type="image"   class="image_input" src="<?php echo base_url();?>skin/admin/images/upload_button.jpg" id="image_button" />
   </div>
</form>
<?php } ?>

<input type="hidden"  name="action"        id="action"        value="<?php echo $action; ?>" />
<input type="hidden"  name="upload_action" id="upload_action" value="<?php echo $upload_action; ?>" />
<input type="hidden"  name="crop_action"   id="crop_action"   value="<?php echo $crop_action; ?>" />
<input type="hidden"  name="thumb_action"  id="thumb_action"  value="<?php echo $thumb_action; ?>" />
<input type="hidden"  name="clear_action"  id="clear_action"  value="<?php echo $clear_action; ?>" />

<input type="hidden"  name="sendback"    id="sendback"    value="<?php echo $sendback;?>" />
<input type="hidden"  name="refresh"     id="refresh"     value="<?php echo $refresh;?>" />
<input type="hidden"  name="reserve"     id="reserve"     value="<?php echo $reserve;?>" />
<input type="hidden"  name="crop_for"    id="crop_for"    value="<?php echo $crop_for;?>" />
<input type="hidden"  name="crop_new"    id="crop_new"    value="<?php echo $crop_new;?>" />
<input type="hidden"  name="upload_zip"  id="upload_zip"  value="<?php echo $upload_zip;?>" />
<input type="hidden"  name="auto_thumb"  id="auto_thumb"  value="<?php echo $auto_thumb;?>" />
<input type="hidden"  name="imageWidth"  id="imageWidth"  value="<?php echo $imageWidth;?>" />
<input type="hidden"  name="imageHeight" id="imageHeight" value="<?php echo $imageHeight;?>" />
<input type="hidden"  name="t_width"     id="t_width"     value="<?php echo $t_width;?>" />
<input type="hidden"  name="t_height"    id="t_height"    value="<?php echo $t_height;?>" />

<input type="hidden"  name="path"          id="path"  value="<?php echo $path;?>" />
<input type="hidden"  name="image_name"    id="image_name"    value="<?php if($action=='crop') echo basename($image_name);?>" />
<input type="hidden"  name="simage_name"   id="simage_name"   value="" />
<input type="hidden"  name="x1" id="x1" value="0" />
<input type="hidden"  name="y1" id="y1" value="0" />
<input type="hidden"  name="x2" id="x2" value="0" />
<input type="hidden"  name="y2" id="y2" value="0" />
<input type="hidden"  name="w"  id="w"  value="0" />
<input type="hidden"  name="h"  id="h"  value="0" />

<div  class="thumbnail_infor save_thumbnail" id="save_thumbnail"></div>
<div  class="thumbnail_infor save_thumbnail" id="save_cropimg"></div>
<div  class="thumbnail_infor" id="thumbnail_infor"></div>
</div>

<div  class="clear_both"></div>
<?php if($show_preview=='1') {?>
<div class="demo">	
	<div  id="photo_uploaded">
    <div class="instructions"><?php if($action!='upload') echo '拖动选取区域'; else echo '上传预览'; ?></div> 
     <div class="frame" id="frame_photo" style="width: <?php echo $imageWidth;?>px; height: <?php echo $imageHeight;?>px; margin: 0pt 0.3em;">
       <img src="<?php echo base_url().$image; ?>" id="photo" />
     </div>
    </div>    
    <?php if($action!='upload' || ($action=='upload' && $auto_thumb=='1')) {?>
	<div id="preview_column">
    <div class="instructions">选区预览 </div>  
     <div class="frame" style="width: <?php echo $t_width;?>px;  height: <?php echo $t_height;?>px;">
      <div id="preview" style="width: <?php echo $t_width;?>px;  height: <?php echo $t_height;?>px; overflow: hidden;">
        <img id="thumbnail" style="width: <?php echo $t_width;?>px;  height: <?php echo $t_height;?>px;" src="<?php echo base_url().$image; ?>">
      </div>
     </div>
    </div>
    <?php }?>    
	<div class="clear_both"></div>	
</div>
<?php }?>

<div class="close_pannel"></div>
<div id="imgselect_div" class="imgselect_div"></div>
</div>
