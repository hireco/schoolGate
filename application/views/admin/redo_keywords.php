<div id="workplace_inner">
  <form class="my_form" accept-charset="utf-8" autocomplete = "off">
    <div class="form_title">整理内容关键词</div>    
    <div class="my_form_item button_row">
      <label class="labeltag">点击开始</label>
      <span class="mainarea">
           <input type="button" class="my_button" id="start_redo" name="start_redo" value="整理关键词" />
      </span>      
    </div>
    <div class="my_form_item button_row" style="margin-top:20px;">
      <label class="labeltag">当前状态</label>
      <span  id="redo_hint" class="mainarea">尚未开始</span>
      <span  id="redo_waiting"></span>      
    </div>
  </form>  
  <div class="clear-both"></div>  
</div>

<script type="text/javascript">
    $(document).ready(function(){
	  $('#start_redo').click(function(){
         $(this).attr('disabled','disabled');
		 $('#redo_hint').html('正在处理......');
		 $('#redo_waiting').addClass('refresh_waiting');
		 
         $.ajax({
        	 type: 'post',
             url:   get_url(json_str.admin_base+'redo_keywords/handle'),
             success : function(data,textStatus){ 
            	 data=eval('(' + data + ')');
                 if(data.result=='1')   
                	 $('#redo_hint').html('恭喜，处理完成！');                	 
                 else {
                	 $('#redo_hint').html('处理失败，请稍候重试');
                	 $('#start_redo').removeAttr('disabled');
                 }
                	 
                 $('#redo_waiting').removeClass('refresh_waiting');                 
                 ajax_success(data,textStatus,'','json');
          	 },
      	     error   : function(XMLHttpRequest, textStatus, errorThrown){ 
      	    	 $('#redo_hint').html('处理出错，请重试');
      	    	 $('#redo_waiting').removeClass('refresh_waiting');
      	    	 $('#start_redo').removeAttr('disabled');
          	     ajax_failed(textStatus);
          	 }
         });
	   }); 
    });
</script>