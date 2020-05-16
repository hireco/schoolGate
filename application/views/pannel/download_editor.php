<script type="text/javascript" src="<?php echo base_url();?>fckeditor/fckeditor.js"></script>
<script>
$(document).ready(function(){
  
  initial_files_list();
  
  //附件上传部分
  $('#upload_file').live('click',function(){
    
	$('#upload_pannel').remove();
  	
	$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
   		$("body").append(data);
		block_all();
		//阻止其他操作
		$("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
		//可移动设置
   	});

	 $('#upload_close').live('click',function(){
		  var files=[],names=[];
		  if($('#uploaded_file_url_list').val()) {
			  files=$('#uploaded_file_url_list').val().split(':');
			  names=$('#uploaded_file_name_list').val().split(':');
			  $('.files_number').text('已上传'+files.length+'个文件');
			  for(var i=0;i<files.length;i++) {
				 
				 if($('.file_path[value="'+files[i]+'"]').length) continue;
				 
				 $('#upload_files .mainarea').append('<div class="file_index"><label>链接名称</label><input type="hidden" id="file_index_'+i+'" class="file_path" value="'+files[i]+'"/><input class="enterbox title filled" class="file_title" value="'+names[i]+'" /><label>对应文件：</label><label class="file">'+basename(files[i])+'</label><label id="del_index_'+i+'" class="delete_item" title="删除"></label></div>');

				 $('#del_index_'+i).bind('click',function(){
				       ajax_delete_file($(this));
				 });

			  }
		  }
     });
 });

 //删除文件--------------------------------------------------//

	function ajax_delete_file(obj){
  		
		var cur_id=obj.attr('id').replace('del_index_','');
		var filename= basename($('#file_index_'+cur_id).val());
		var filedir= $('#file_index_'+cur_id).val().replace(filename,'');
		
		filedir=filedir.substring(0,filedir.length-1);

  		$.ajax({
  			type: 'post',
  			data: 'ajax=1&filename='+filename+'&filedir='+filedir,
  			url : get_url(json_str.admin_base+"file_manager/file_delete"),
  			success : function(data,textStatus){
  				try{ 
  	                data=eval('(' + data + ')');
  					if(data.result=='1')  js_remove_file(cur_id);
  				    ajax_success(data,textStatus,'','json');
  				    
  	             }
  				 catch(err){
  					ajax_success('操作失败，请重试！',textStatus,'','string');
  	            }
  			},
  		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
  		   complete: function() { $("#user_dialog").remove(); unblock_all(); }			
  	   });	
  	}

	function js_remove_file(file_id) {

	   $('#file_index_'+file_id).parent().remove(); 
	   $('#del_index_'+file_id).unbind('click');

	   var files=$('#uploaded_file_url_list').val().split(':');
	   var names=$('#uploaded_file_name_list').val().split(':');

	   for(var i=0; i<files.length;i++)
		   if($('.file_path[value="'+files[i]+'"]').length==0) {
		     arrayRemoveByValue(files,files[i]);
			 arrayRemoveByValue(names,names[i]);
	   }
	   
	   $('#uploaded_file_url_list').val(files.join(':'));
	   $('#uploaded_file_name_list').val(names.join(':'));

	   $('.files_number').text('已上传'+$('.file_index').length+'个文件'); 	  	
   }

   function initial_files_list() {
      if($('#all_file_path').val()) {
		  var files=$('#all_file_path').val().split(':');		   
		  var names=$('#all_file_title').val().split(':');

		  $('.files_number').text('已上传'+files.length+'个文件');

		  for(var i=0;i<files.length;i++) {
					 
			  if($('.file_path[value="'+files[i]+'"]').length) continue;
			 
			  $('#upload_files .mainarea').append('<div class="file_index"><label>链接名称</label><input type="hidden" id="file_index_'+i+'" class="file_path" value="'+files[i]+'"/><input class="enterbox title filled" class="file_title" value="'+names[i]+'" /><label>对应文件：</label><label class="file">'+basename(files[i])+'</label><label id="del_index_'+i+'" class="delete_item" title="删除"></label></div>');

			  $('#del_index_'+i).bind('click',function(){
				   ajax_delete_file($(this));
			  });
		  }
     }

   }

});
</script>
<div class="my_form_item">
  <label class="labeltag"  style="vertical-align:top">文件介绍</label>
  <span class="mainarea">
  <textarea class="hide" name="introduction" id="introduction"></textarea>
  <?php 
   require_once 'fckeditor/fckeditor.php';
   $sBasePath = base_url().'fckeditor/';
   $oFCKeditor = new FCKeditor('editor_content') ;
   $oFCKeditor->BasePath	= $sBasePath;
   $oFCKeditor->ToolbarSet  = 'Basic';
   $oFCKeditor->Width       = '600';
   $oFCKeditor->Height      = '100';
   $oFCKeditor->Value       = isset($introduction)?$introduction:'';
   $oFCKeditor->Create() ;
  ?>
  </span>
</div>
<div id="upload_files" class="my_form_item">
  <label class="labeltag" style="vertical-align: top">上传文件</label>
  <span class="mainarea">
  	  <input type="button" class="my_button" id="upload_file" value="点击上传" />
	  <input type="hidden" id="uploaded_file_url_list" value="<?php echo isset($file_path)?$file_path:'';?>" />
	  <input type="hidden" id="uploaded_file_name_list" value="<?php echo isset($file_title)?$file_title:'';?>" />
	  <input type="hidden" id="all_file_title" name="all_file_title" value="<?php echo isset($file_title)?$file_title:'';?>" />
	  <input type="hidden" id="all_file_path"  name="all_file_path" value="<?php echo isset($file_path)?$file_path:'';?>" />
	  <label class="files_number">尚未上传文件</label>
  </span>
</div>
<div class="my_form_item">
  <label class="labeltag" style="vertical-align: top">显示方式</label>
  <span class="mainarea">
  	  <select id="show_mode" name="show_mode">
	    <option value="g" <?php echo isset($show_mode)?($show_mode=='c'?'selected="selected"':''):''; ?>>一般方式</option>
		<option value="d" <?php echo isset($show_mode)?($show_mode=='d'?'selected="selected"':''):''; ?>>直接下载</option>		
	  </select> <label>注意：多个文件，请选择一般方式。</label>
  </span>
</div>
<div class="hide">
    <span id="cms_icon_size"><?php echo $this->myconfig->item('video_icon_size'); ?></span>		
	<span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('image_dir').'/'.date('ym').'/'; ?></span>
	<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
</div>
<div class="hide">
    <span id="file_types_list">*.gif;*.jpg;*.jpeg;*.png;*.txt;*.ps;*.pdf;*.eps;*.zip;*.doc;*.tar;*.gz;*.rar;*.xls;*.xlsx;*.docx;*.ppt</span>
    <span id="file_type_selected">file</span>
    <span class="upload_file_type"><span class="selected">文档文件</span></span>
    <span id="return_input">file_uploaded</span>
</div>
