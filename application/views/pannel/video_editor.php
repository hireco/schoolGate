<script type="text/javascript" src="<?php echo base_url();?>fckeditor/fckeditor.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js"></script>
<div class="my_form_item">
  <label class="labeltag"  style="vertical-align:top">视频介绍</label>
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
<div class="my_form_item">
  <label class="labeltag"  style="vertical-align:top">视频内容</label>
  <span class="mainarea">
  <textarea class="enterbox enterarea" style="width:400px;" name="video_html" id="video_html"><?php echo isset($video_html)?$video_html:'';?></textarea>
  <label class="bottom bubble_linker" id="show_html_example">从视频网站粘贴参照实例</label>
  </span>
</div>
<div class="my_form_item">
  <label class="labeltag">媒体地址</label>
  <span class="mainarea">
  <input type="text" class="enterbox"  style="width:400px;" name="video_url" value="<?php echo isset($video_url)?$video_url:''?>" id="video_url" />
  <label class="bubble_linker" id="show_url_example">引用外站参照实例，与上二者选填其一</label>
  </span>
</div>
<div class="hide">
    <span id="cms_icon_size"><?php echo $this->myconfig->item('video_icon_size'); ?></span>		
	<span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('image_dir').'/'.date('ym').'/'; ?></span>
	<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
</div>
<div id="html_example" class="hide">
   <pre>&lt;embed src="http://player.youku.com/player.php/sid/XMjk1MTIyNzE2/v.swf" 
   allowFullScreen="true" quality="high" width="480" height="400" align="middle" 
   allowScriptAccess="always" type="application/x-shockwave-flash"&gt; &lt;/embed&gt;</pre>
</div>
<div id="url_example" class="hide">
   http://player.youku.com/player.php/sid/XMjk1MTIyNzE2/v.swf
</div>
<script>
 $(document).ready(function(){
	 bubble_initial($('#show_html_example,#show_url_example')); //初始化 
	 $('#show_html_example').SetBubblePopupInnerHtml($('#html_example').html(), true);			 
     $('#show_url_example').SetBubblePopupInnerHtml($('#url_example').html(), true);
 });

 function bubble_initial(obj,html) {

	 addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');   
	 obj.CreateBubblePopup({			
	     selectable: false,
		 position : 'top',
		 align	 : 'center',	
		 innerHtml:  arguments[1]?html:'请稍候...',
		 innerHtmlStyle: {'text-align':'left','font-size':'12px;'},	
		 themeName: 	'all-black',
		 themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
	 });
}
</script>
