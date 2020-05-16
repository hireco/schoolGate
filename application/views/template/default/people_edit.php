<?php if($viewer=='linker') {?>

<div class="edit_link">
 <a id="amend_mine" href="javascript:void(0);">个人信息设置</a>
 <a id="swfupload_linker" href="javascript:void(0);">上传静态网页包</a>
</div>
<div class="hide">
	<span id="swfupload_filesize" >10 MB</span>
	<span id="swfupload_filenum" >1</span>
	<span id="swfupload_button"><span class="selected">文件包</span></span>
	<span id="swfupload_filetype">WinZip文件包</span>
	<span id="swfupload_filetype_list">*.zip</span>
	<span id="dir_to"><?php echo $html_dir;?></span>
	<span id="upload_url">ajax/people_ajax/upload_zip</span>
</div>

<?php } else if($viewer=='form') {?>

<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/swfupload.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/my/avatar_upload.js"></script>
<script type="text/javascript">
var swfu;
function intial_swfupload() {
	  var settings = {
				flash_url : json_str.base_url+"js/swfupload/swfupload.swf",
				flash9_url : json_str.base_url+"js/swfupload/swfupload_fp9.swf",
				upload_url: json_str.base_url+"people_avatar/upload",
				post_params: {"PHPSESSID" : "<?php echo session_id(); ?>", "file_type" : "image"},

				// File Upload Settings
				file_size_limit : "200 KB",
				file_types : "*.jpg;*.png",
				file_types_description : "JPG Images; PNG Image",
				file_upload_limit : 0,

				custom_settings : {
					upload_target : "divFileProgressContainer",
					thumbnail_height: 300,
					thumbnail_width: 200,
					thumbnail_quality: 100,
					base_dir : json_str.base_url+"js/swfupload/",
					thumbnail_path: json_str.base_url+"people_avatar/thumbnail"
				},
				debug: false,

				// Button Settings
				button_image_url : json_str.base_url+"js/swfupload/SmallSpyGlassWithTransperancy_17x18.png",
				button_placeholder_id : "spanButtonPlaceholder",
				button_width: 180,
				button_height: 18,
				button_text : '<span class="button">点击选择图片 <span class="buttonSmall">(最大200KB)</span></span>',
				button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
				button_text_top_padding: 0,
				button_text_left_padding: 18,
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
				button_cursor: SWFUpload.CURSOR.HAND,
				
				// The event handler functions are defined in imgupload.js
				swfupload_preload_handler : preLoad,
				swfupload_load_failed_handler : loadFailed,
				//file_dialog_start_handler : start_dialog,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete
			};
		swfu = new SWFUpload(settings); 
}

$(document).ready(function(){
    var fls=flashChecker();

    if(!fls.f || parseInt(fls.v) < 15)  {
        $('#swfuploader_div').html('<a href="http://www.adobe.com/go/getflashplayer">请先安装flash插件，点击下载</a>');
        top_message('浏览器不支持flash，请安装后再试！');
        return false;
    }

    else intial_swfupload();
});   
</script>
<div class="form_header">填写您的个人资料，进行修改</div>
<div class="page_form">
    <div class="left_part">
      <dl>
      <dt>中文姓名：</dt>
     <dd>
      <input type="text" class="enterbox shortarea filled" name="cn_name" id="cn_name" disabled="disabled" value="<?php echo $cn_name;?>"  /> <label>*中文姓名不可更改</label>
      </dd>
    </dl>
    <dl>
      <dt>英文姓名：</dt>
      <dd>
      <input type="text" class="enterbox shortarea filled" name="en_name" id="en_name" value="<?php echo $en_name;?>"  /> <label>*若无，请填汉语拼音</label>
      </dd>
    </dl>
    <dl>
      <dt>性别：</dt>
      <dd>
      <input type="radio" name="gender" id="gender_m"  value="m" <?php if($gender=='m')  echo 'checked="checked"';?>/> <label>男</label>
      <input type="radio" name="gender" id="gender_f"  value="f" <?php if($gender=='f')  echo 'checked="checked"';?> /> <label>女</label>
      </dd>
    </dl>             
    <dl>
      <dt>出生年：</dt>
      <dd>
      <select name="born_year" id="born_year">
          <?php $cur=(int)date('Y',time()); for($i=15; $i<80;$i++) {
            echo '<option value="'.($cur-$i).'"'; 
            if($born_year==$cur-$i) echo ' selected="selected" ';
            echo '>'.($cur-$i).'年</option>';
          }
          ?>
      </select>	 <input style="margin-left:10px;" type="checkbox" name="hide_born_year"  <?php echo $hide_born_year=='1'?'checked="checked"':''; ?>  /> <label>是否保密？</label>
      </dd>
    </dl>
    <dl>
      <dt>职称/头衔：</dt>
      <dd>
      <select name="title_id" id="title_id">
          <?php foreach($this->people_model->cn_titles as $index => $value) {
            echo '<option value="'.$index.'"'; 
            if($title_id==$index) echo ' selected="selected" ';
            echo '>'.$value.'</option>';
          }
          ?>
      </select>
      </dd>
    </dl>
    <dl>
      <dt>最高学位：</dt>
      <dd>
      <select name="degree" id="degree">
          <?php foreach($this->people_model->degrees as $index => $value) {
            echo '<option value="'.$index.'"'; 
            if($degree==$index) echo ' selected="selected" ';
            echo '>'.$value.'</option>';
          }
          ?>
      </select>
      </dd>
    </dl>
    </div>
    <div class="right_part">
       <div class="my_avatar" id="thumbnails">
          <img src="<?php echo $avatar?$avatar:site_url('skin/images/no_image.jpg');?>" />
       </div>
       <div class="uploader_div" id="swfuploader_div">
         <form>
		   <div style="width: 180px; height: 18px; border: solid 1px #7FAAFF; background-color: #C5D9FF; padding: 2px;">
			<span id="spanButtonPlaceholder"></span>
		   </div>
		 </form>
		 <div id="divFileProgressContainer" style="display:none;"></div>
	   </div>
       <div class="hide">
        <input type="hidden" name="avatar" id="avatar" value="<?php echo $avatar;?>" />
        <input type="hidden" name="people_id" id="people_id" value="<?php echo $people_id;?>" />
	   </div>
    </div>
    <div class="clear-both"></div>
    <dl>
      <dt>联系电话：</dt>
      <dd>
      <input type="text" class="enterbox filled" name="phone" id="phone" value="<?php echo $phone;?>"/> <label style="margin-right:15px;">*办公电话或个人电话</label>  <input type="checkbox" name="hide_phone"  <?php echo $hide_phone=='1'?'checked="checked"':''; ?>  /> <label>是否保密？</label>
      </dd>
    </dl>
    <dl>
      <dt>电子邮件：</dt>
      <dd>
      <input type="text" class="enterbox filled" name="email" id="email" value="<?php echo $email;?>" /> <label style="margin-right:15px;">*个人电子邮件</label>  <input type="checkbox" name="hide_email" <?php echo $hide_email=='1'?'checked="checked"':''; ?> /> <label>是否保密？</label>
      </dd>
    </dl>
    <dl>
      <dt>邮政编码：</dt>
      <dd>
      <input type="text" class="enterbox shortarea filled" name="zip_code" id="zip_code" value="<?php echo $zip_code;?>"/> <label>*通信邮政编码</label>
      </dd>
    </dl>
    <dl>
      <dt>联系地址：</dt>
      <dd>
      <input type="text" class="enterbox keywords filled" name="office" id="office" value="<?php echo $office;?>" /> <label>*办公室详细地址</label>
      </dd>
    </dl>
    <dl>
      <dt>个人目录：</dt>
      <dd>
      <input type="text" class="enterbox shortarea" name="html_dir" id="html_dir" <?php if($html_dir) echo 'disabled="disabled"';?> value="<?php echo $html_dir;?>" /> <label>在本站的目录，可以放静态个人网页，一旦指定，不可更改！</label>
      </dd>
    </dl>    
    <dl>
      <dt>个人站点：</dt>
      <dd>
      <input type="text" class="enterbox keywords" name="personal_site" id="personal_site" value="<?php echo $personal_site;?>" /> <label>若有，请填写完整的URL路径</label>
      </dd>
    </dl>
    
    <dl>
      <dt>详细介绍：</dt>
      <dd>
      <span>分别在下面填写项目名称和内容</span>
      <span class="span_button" id="add_details">点击增加项目</span>
      </dd>
    </dl>
    
    <div class="details_div">
	<?php       
      if($details) {
      $details=explode('-ddd-',$details); 
      $num=count($details);       
      foreach($details as $index => $value) {
         $detail=explode('-bbb-',$value);
      ?>
       <dl>
       <dt> </dt>
       <dd class="dd_span">
         <span><label class="index_no">项目<?php echo $index+1;?></label><input type="text" class="enterbox shortarea filled detail_item" value="<?php echo $detail[0];?>" /></span>
         <span class="span_textarea"><textarea class="enterbox medium_enterarea filled detail_cont"><?php echo $detail[1];?></textarea></span>
         <span class="delete_item" title="删除此条"></span>
       </dd>
       </dl>
      <?php }
      }
    ?>
   </div>
        
    <dl>
      <dt>&nbsp;</dt>
      <dd class="form_item">
      <input type="button"  class="button" name="people_submit"  id="people_submit"  value="点击提交" />
	  <span class="span_button" id="people_cancel">取消并返回</span>
	  
      </dd>
    </dl>
	
</div>

<?php } ?> 
