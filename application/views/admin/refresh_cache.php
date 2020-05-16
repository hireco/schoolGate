<div id="workplace_inner">
  <form class="my_form" accept-charset="utf-8" autocomplete = "off">
    <div class="form_title">更新网站缓存</div>
    <?php if($this->myconfig->item('cache_time')) { ?>
    <div class="my_form_item button_row">
      <label class="labeltag">点击更新</label>
      <span class="mainarea">
           <input type="button" class="my_button" id="start_refresh" name="start_refresh" value="开始更新缓存" />
      </span>
      <span class="mainarea">
           <a style="color:blue; text-decoration:underline" href="<?php echo base_url().$this->config->item('admin_dir').'/sys_config/http_edit/cache_time'; ?>">点击设置缓存时间</a>
      </span>      
    </div>
    <div class="my_form_item button_row" style="margin-top:20px;">
      <label class="labeltag">更新状态</label>
      <span  id="refresh_hint" class="mainarea">尚未开始</span>
      <span  id="refresh_waiting"></span>      
    </div>
    <?php } else echo '<div style="margin-left:20px;"><span>当前没有设置缓存，无需更新 </span> <a href="'.base_url().$this->config->item('admin_dir').'/sys_config/http_edit/cache_time">点击开启缓存</a></div>';?>
  </form>  
  <div class="clear-both"></div>  
</div>
<?php if($this->myconfig->item('cache_time')) { ?>
<script type="text/javascript">
    $(document).ready(function(){
	  $('#start_refresh').click(function(){
         $(this).attr('disabled','disabled');
		 $('#refresh_hint').html('正在处理......');
		 $('#refresh_waiting').addClass('refresh_waiting');
		 
         $.ajax({
        	 type: 'post',
             url:   get_url(json_str.admin_base+'refresh_cache/do_refresh'),
             success : function(data,textStatus){ 
            	 data=eval('(' + data + ')');
                 if(data.result=='1')   
                	 $('#refresh_hint').html('恭喜，处理完成！');                	 
                 else {
                	 $('#refresh_hint').html('处理失败，请稍候重试');
                	 $('#start_refresh').removeAttr('disabled');
                 }
                	 
                 $('#refresh_waiting').removeClass('refresh_waiting');                 
                 ajax_success(data,textStatus,'','json');
          	 },
      	     error   : function(XMLHttpRequest, textStatus, errorThrown){ 
      	    	 $('#refresh_hint').html('处理出错，请重试');
      	    	 $('#refresh_waiting').removeClass('refresh_waiting');
      	    	 $('#start_refresh').removeAttr('disabled');
          	     ajax_failed(textStatus);
          	 }
         });
	   }); 
    });
</script>
<?php }?>