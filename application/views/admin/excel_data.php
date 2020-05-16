<?php if($viewer=='index') { ?>
<div id="workplace_inner">
	
	<div class="horizon_navi line_navi">

      <ul>

        <li><a href="javascript:void(0);"><span id="export_pannel"  class="selected horizon_items">导出数据</span></a></li>

        <li><a href="javascript:void(0);"><span id="import_pannel"   class="horizon_items">导入数据</span></a></li>

      </ul>

      <div class="clear_both"></div>

   </div>
   
   <form class="my_form" id="cms_form" accept-charset="utf-8" autocomplete = "off">
   
   <div id="data_viewer">

   <?php echo $data_viewer;?>

   </div>    
   
   </form>

   <div class="clear_both"></div>
  
</div>

<?php } else if($viewer=='export') { ?>

<iframe id="fileDownFrame" src="" style="display:none; visibility:hidden;"></iframe>
	
	<div class="my_form_item">
        <label class="labeltag">Excel文件类型</label>
	    <span class="mainarea">
		  <input type="checkbox" class="filetype" value="xls" checked="checked" /><label>xls</label>
          <input type="checkbox" class="filetype" value="xlsx" /><label>xlsx</label>
		</span>
    </div>

    <div class="my_form_item">
        <label class="labeltag">人员数据</label>
        <span class="mainarea">          
		  <input type="button" class="my_button export_data"  id="people" value="点击导出" />
		  <a href="javascript:void(0);" style="margin-left:10px;text-decoration:underline;" class="download_file"></a>
        </span>
    </div> 
	
	<div class="my_form_item">
        <label class="labeltag">论文著作</label>
        <span class="mainarea">          
		  <input type="button" class="my_button export_data"  id="publication" value="点击导出" />
		  <a href="javascript:void(0);" style="margin-left:10px;text-decoration:underline;" class="download_file"></a>
        </span>
    </div> 

	<div class="my_form_item button_row">
        <label class="labeltag">清除文件</label>
        <span class="mainarea">
          <input type="button" class="my_button" id="clear_file" value="清除数据" />
        </span>
        <span class="mainarea" id="clear_result">问了安全起见，请清除导出文件</span>
    </div>

<?php } else if($viewer=='import') { ?>
  
    <div class="my_form_item">
        <label class="labeltag">选择对象</label>       
		<span class="mainarea">          
		   <input type="checkbox" checked="checked" class="import_type" value="people" /> <label>人员资料</label>	  
        </span>
		<span class="mainarea">  
		   <input type="checkbox" class="import_type" value="publication" /> <label>论文著作</label>		  
        </span>
    </div>
	
	<div class="my_form_item">
        <label class="labeltag step_tag">第一步</label> 
		<span class="mainarea">          
		  <input type="button" class="my_button upload_file" value="上传数据" />
		  <input type="button" class="my_button import_data hide" value="导入数据" />		  
        </span>
    </div>
	
	<div class="my_form_item">
        <label class="labeltag"></label> 
		<span class="mainarea">注意：请谨慎选择上传，要核对好上传对象，并确保数据格式文件没有被更改！
        </span>
    </div>
	<div class="my_form_item">
        <label class="labeltag">Excel文件模板</label> 
		<span class="mainarea">
		<a style="color:blue;text-decoration:underline;" href="<?php echo site_url('data/people.xls');?>">人员数据</a>
		<a style="color:blue;text-decoration:underline;" href="<?php echo site_url('data/publication.xls');?>">论文著作</a>
        </span>
    </div>

	<div class="upload_file_type hide">
     <span id="excel_types_list">*.xls;*.xlsx</span>
     <span id="file_type_selected">excel</span>
	 <span class="selected">Excel文件</span>
	 <span id="dir_to">tmp</span>
	 <input type="hidden" id="uploaded_file_url" value="" />
    </div>

<?php } ?>






