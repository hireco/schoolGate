<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/swfupload.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/swfupload.queue.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/my/fileprogress.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/my/handlers.js"></script>
<script type="text/javascript">
var swfu;
var rename_to=$('#rename_to').length?$('#'+$('#rename_to').text()).val():'';
var dir_to=$('#dir_to').length?$('#dir_to').text():'';
var upload_url=$('#upload_url').length?$('#upload_url').text():'ajax/swfupload/upload';

function intial_swfupload() {
	  var settings = {
				flash_url : json_str.base_url+"js/swfupload/swfupload.swf",
				flash9_url : json_str.base_url+"js/swfupload/swfupload_fp9.swf",
				upload_url: json_str.base_url+upload_url,
				post_params: {"PHPSESSID" : "<?php echo session_id(); ?>", "file_type" : $('#swfupload_filetype').text(),"rename_to" : rename_to,"dir_to" : dir_to},
				file_size_limit : $('#swfupload_filesize').text(),
				file_types : $.trim($('#swfupload_filetype_list').text()),
				file_types_description : $('#swfupload_filetype').text(),
				file_upload_limit : $('#swfupload_filenum').text(),
				file_queue_limit : 0,
				custom_settings : {
					progressTarget    : "fsUploadProgress",
					cancelButtonId    : "btnCancel",
					return_uploaded   : '',
					swfupload_used    : false
				},
				debug: false,

				// Button settings
				button_image_url: json_str.base_url+"js/swfupload/button.png",
				button_width: "128",
				button_height: "29",
				button_placeholder_id: "spanButtonPlaceHolder",
				button_text: '<span class="theFont">选择'+$('#swfupload_button').text()+'</span>',
				button_text_style: ".theFont { font-size: 16; cursor:pointer;}",
				button_text_left_padding: 12,
				button_text_top_padding: 3,
				
				// The event handler functions are defined in handlers.js
				swfupload_preload_handler : preLoad,
				swfupload_load_failed_handler : loadFailed,
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
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
		$('#content').html('<a href="http://www.adobe.com/go/getflashplayer">您的浏览器不支持flash,点击此处下载该插件</a>');
		top_message('浏览器不支持flash，请安装后再试！');

		$('#upload_close').on('click',function(){
			$('#upload_pannel').remove();
			unblock_all();
		});
	}

	else {
		intial_swfupload();

		$('#upload_close').on('click',function(){
			if(swfu.customSettings.swfupload_used===true) {
				$('#add_file').val(swfu.customSettings.return_uploaded);
				$('#swfupload_linker').unbind('click',open_swfupload);
				$('#swfupload_linker').removeClass('effective').addClass('un-effective').text('已经上传完毕');
			}
			$('#upload_pannel').remove();
			unblock_all();
		});

		$('#btnCancel').on('click',function(){
			swfu.cancelQueue();
		});
	}

});   
</script>
<div id="upload_pannel">
<div id="upload_head">文件上传面板</div>
<div id="upload_close"></div>
<div id="content">	
	<form id="uploadform" enctype="multipart/form-data">		
			<div class="fieldset flasharea" id="fsUploadProgress">
			  <span class="legend">文件队列</span>
			</div>
		    <div id="divStatus">尚没有上传文件</div>
			
			<div class="button_div">
			  <span id="spanButtonPlaceHolder"></span>
			  <input id="btnCancel" type="button" value="取消所有上传" disabled="disabled" style="margin-left: 2px; font-size: 8pt; height: 29px;" />
	 	    </div>
	</form>
</div>
</div>