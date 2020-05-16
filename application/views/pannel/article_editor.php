<script type="text/javascript" src="<?php echo base_url();?>fckeditor/fckeditor.js"></script>
<textarea class="hide" name="article_body" id="article_body"></textarea>
<?php 
   require_once 'fckeditor/fckeditor.php';
   $sBasePath = base_url().'fckeditor/';
   $oFCKeditor = new FCKeditor('editor_content') ;
   $oFCKeditor->BasePath	= $sBasePath;
   $oFCKeditor->ToolbarSet  = 'Admin';
   $oFCKeditor->Width       = '100%';
   $oFCKeditor->Height      = '300';
   $oFCKeditor->Value       = isset($article_body)?$article_body:'';
   $oFCKeditor->Create() ;
?>
<div class="hide">
	<span id="cms_icon_size"><?php echo $this->myconfig->item('article_icon_size'); ?></span>		
	<span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('image_dir').'/'.date('ym').'/'; ?></span>
	<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
</div>
