<script type="text/javascript" src="<?php echo base_url();?>fckeditor/fckeditor.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/admin/myjquery-photoadd.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/jquery.contextmenu.r2.js"></script>
<div class="my_form_item">
  <label class="labeltag"></label>
  <span class="mainarea">
  <?php 
	$album_image=isset($photo_list)?$this->cms_model->get_thumbs_files($photo_list).'::'.$photo_list:'';
	$album_image=$album_image=='::'?'':$album_image;
  ?>
  <input type="button" class="my_button" id="upload_image" value="点击上传" />
  <input type="checkbox" id="is_upload_zip" name="is_upload_zip"  value="1" /><label>上传ZIP压缩文件包</label>
  <input type="hidden" id="img_text" name="img_text" value="<?php echo isset($photo_title)?$photo_title:'';?>" />
  <input type="hidden" id="album_image" name="album_image" class="enterbox filled" value="<?php echo $album_image;?>" />	  
  <input type="hidden" id="album_image_sql" name="album_image_sql"  value="<?php echo $album_image;?>" />
  <input type="hidden" id="album_image_old" name="album_image_old"  value="" />
  </span>
</div>
<div class="my_form_item <?php if(!isset($photo_list)) echo 'hide'; ?>">
  <label class="labeltag" style="vertical-align:top">图片列表</label>
  <span class="mainarea" id="album_just_uploaded"></span>
</div>
<div class="my_form_item">
  <label class="labeltag"></label>
  <span class="mainarea">
  <input type="button" class="my_button" id="fckediror_pannel_link" value="填写介绍内容" />
  </span>
</div>
<div id="fckeditor_pannel" class="my_form_item">
<label class="labeltag" style="vertical-align:top">相册介绍</label>
<span class="mainarea">
 <textarea class="hide" name="introduction" id="introduction"></textarea>
 <?php 
   require_once 'fckeditor/fckeditor.php';
   $sBasePath = base_url().'fckeditor/';
   $oFCKeditor = new FCKeditor('editor_content') ;
   $oFCKeditor->BasePath	= $sBasePath;
   $oFCKeditor->ToolbarSet  = 'Simple';
   $oFCKeditor->Width       = '800';
   $oFCKeditor->Height      = '200';
   $oFCKeditor->Value       = isset($introduction)?$introduction:'';
   $oFCKeditor->Create() ;
?>
 </span>
</div>
<div class="hide">
    <span id="album_img_size"><?php echo $this->myconfig->item('album_img_size'); ?></span>
    <span id="cms_icon_size"><?php echo $this->myconfig->item('photo_icon_size'); ?></span>		
	<span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('album_dir').'/'.date('ym').'/'; ?></span>
	<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
</div>
<?php 
    $data['mylist']=array('crop','thumb');
	$this->load->view('pannel/context_menu',$data);
?>
