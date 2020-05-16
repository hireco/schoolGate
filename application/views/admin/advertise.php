<?php if($viewer=='index') {?>
<div id="workplace_inner">
 <div id="clist_div">
   <div class="horizon_navi">
     <ul>
	  <li><a class="selected" href="javascript:void(0)"><span class="horizon_items">区块元素列表</span></a></li>
	  <li><a href="javascript:void(0)"><span id="add_advertise" class="horizon_items">添加区块元素</span></a></li>
	  <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>
	  <li><a href="<?php echo site_url($this->config->item('admin_dir').'/advertise_setting'); ?>"><span id="advertise_setting" class="horizon_items">区块显示管理</span></a></li>
     </ul>
   </div>
   <div id="clist_data"><?php echo $clist;?></div>
 </div>
 <div class="clear_both"></div>
 <div id="add_div" class="hide">
  <form class="my_form" id="advertise_form" accept-charset="utf-8" autocomplete="off">
   <div class="form_title">添加区块元素</div>   
  
   <div class="my_form_item">
   <label class="labeltag">元素标题</label>
    <span class="mainarea">
    <input type="text" class="enterbox area120 filled" name="ads_title" id="ads_title" value="" />
    <input type="hidden" class="filled" id="ads_id"  name="ads_id" value="0" />
    <label>*元素标题，20字以内</label>
    </span>
   </div>
   
   <div class="my_form_item">
   <label class="labeltag">描述说明</label>
    <span class="mainarea">
    <input type="text" class="enterbox keywords filled" name="ads_hint" id="ads_hint" value="" />
    <label>*元素描述，30字以内</label>
    </span>
   </div>
   
   <div class="my_form_item">
     <label class="labeltag">元素尺寸</label>
     <span class="mainarea">
       <label style="margin-left:0px;">宽度：</label><input type="text" class="enterbox  numarea filled" id="ads_width"  name="ads_width" value="238"  /> <label>*显示宽度</label>
       <label>高度：</label><input type="text" class="enterbox  numarea" id="ads_height"  name="ads_height" value="200" /> <label class="bubble_linker" id="hint_for_adssize">查看提示</label>
     </span>
   </div>
   
   <div class="my_form_item">
     <label class="labeltag">元素类型</label>
     <span class="mainarea">
       <select name="ads_type" id="ads_type">
         <?php 
           $ads_types=$this->ads_model->ads_types;
           foreach ($ads_types as $index => $value) 
           echo '<option value="'.$index.'">'.$value.'</option>';
         ?>
       </select>
     </span>
     <span class="mainarea hide resources_type">
       <input type="radio" value="1" name="to_upload" checked="checked" /><label>新上传</label>
       <input type="radio" value="0" name="to_upload" /><label>URL地址</label>
     </span>
   </div>
  
   <div class="my_form_item for_image shift_div">
    <label class="labeltag">区块图片</label>
    <span class="mainarea div_upload">
     <input type="text"   id="ads_image" name="ads_image" class="enterbox filled"  disabled="disabled" value="" />
	 <input type="hidden" id="ads_image_sql" name="ads_image_sql"  value="" />
	 <input type="hidden" id="ads_image_old" name="ads_image_old"  value="" />
	 <input type="button" class="my_button" id="upload_image" value="点击上传" />
	 
    </span>
    <span class="mainarea hide div_url">
     <input type="text" id="ads_image_url"  name="ads_image_url" data-num="1" class="enterbox keywords filled"  /> 
	 <label>*输入图片完整地址</label>
	 <input type="button" class="my_button local_select"  data-for="#ads_image_url" value="本地选择" />
    </span>
   </div>
   <div class="my_form_item for_image shift_div">
    <label class="labeltag">图片链接</label>
    <span class="mainarea">
     <input type="text"   id="image_link" name="image_link" class="enterbox keywords filled"  value="" />
    </span>
   </div>
   <div class="form_pic_show hide">
    <div id="show_image_div" class="loadimg"></div>
   </div>  
   
   <div class="my_form_item for_flash shift_div">
    <label class="labeltag">动画媒体</label>
    <span class="mainarea div_upload">
     <input type="text" class="enterbox filled" disabled="disabled" name="ads_flash" id="ads_flash" value="" />	
     <input type="button" class="my_button" id="upload_media" value="点击上传" />
    </span>
    <span class="mainarea hide div_url">
     <input type="text" id="ads_flash_url"  name="ads_flash_url" class="enterbox keywords filled"  /> <label>*输入flash完整地址</label>
    </span>
   </div>	
         
   <div class="my_form_item for_script shift_div">
     <label class="labeltag top">其他代码</label>
     <span class="mainarea">
       <textarea class="enterbox medium_enterarea filled" id="ads_script"  name="ads_script"></textarea>
     </span>
   </div>
   
   <div class="my_form_item for_html shift_div">
      <label class="labeltag top">超文本内容</label>
      <span class="mainarea">
      <textarea class="hide"   name="ads_html" id="ads_html"></textarea>
      <?php 
        require_once 'fckeditor/fckeditor.php';
        $sBasePath = base_url().'fckeditor/';
        $oFCKeditor = new FCKeditor('editor_content') ;
        $oFCKeditor->BasePath	= $sBasePath;
        $oFCKeditor->ToolbarSet  = 'Special';
        $oFCKeditor->Width       = '300';
        $oFCKeditor->Height      = '500';
        $oFCKeditor->Value       = '';
        $oFCKeditor->Create();
      ?>
      </span>      
   </div>
   
   <div class="my_form_item for_mysql shift_div">
     <label class="labeltag">数据库定制</label>
     <span class="mainarea">
       <label style="margin-left:0px;">数据对象：</label>
	   <input type="text" class="enterbox shortarea filled" name="mysql_table" id="mysql_table" value="" />
       <label>排序对象：</label>
	   <input type="text" class="enterbox shortarea filled" name="mysql_order_by" id="mysql_order_by" value="" />
       <label>筛选条件：</label>
	   <input type="text" class="enterbox shortarea" name="mysql_where" id="mysql_where" value="" />
     </span>
     <span class="mainarea">
       <label>显示模式：</label>
	   <input type="radio" name="mysql_mode" value="text"  checked="checked" disabled="disabled" /><label>文本</label><input type="radio" name="mysql_mode" value="image" disabled="disabled" /><label>图片</label>
     </span>
   </div>
   <div class="my_form_item for_mysql shift_div">
     <label class="labeltag">显示设置</label>
     <span class="mainarea">
       <label style="margin-left:0px;">排列方向：</label>
	   <input type="text" class="enterbox shortarea" name="mysql_direction" id="mysql_direction" value="" />
       <label>显示数量：</label>
	   <input type="text" class="enterbox numarea filled" name="mysql_num" id="mysql_num" value="10" />
     </span>
     <span class="mainarea hide image_size">
       <label>图片宽度：</label>
	   <input type="text" class="enterbox numarea" name="mysql_width" id="mysql_width" value="" />
       <label>图片高度：</label>
	   <input type="text" class="enterbox numarea" name="mysql_height" id="mysql_height" value="" /> <label class="bubble_linker" id="hint_for_imgsize">查看提示</label>
     </span>     
   </div>
   
   <div class="hide">
     <?php 
       foreach ($this->ads_model->mysql_items as $index => $value) {
       	  echo '<div class="mysql_items">';
       	  echo '<div class="items_object" title="'.$value[0].'">'.$value[1].'</div>';
       	  echo '<ul class="order_items of_'.$value[0].'">';
       	  foreach ($value[2] as $index_i => $value_i) 
       	  echo '<li title="'.$index_i.'">'.$value_i.'</li>';
       	  echo '</ul>';
       	  echo '<ul class="mode_items of_'.$value[0].'">';
       	  foreach ($value[3] as $index_i => $value_i) 
       	  echo '<li title="'.$index_i.'">'.$value_i.'</li>';
       	  echo '</ul>';
       	  echo '</div>';       	  
       }
     ?>
   </div>
   
   <div class="my_form_item button_row">
    <label class="labeltag"></label>
    <span class="mainarea"><input type="button" class="my_button" id="advertise_submit" name="advertise_submit" value="确认后，提交！" /></span>
    <span class="mainarea"> <input type="button" class="my_button" id="advertise_cancel" name="advertise_cancel" value="取消" /></span>
   </div>
   
   <div class="hide">
       <span id="flash_types_list">*.swf;*.flv</span>
       <span id="file_type_selected">flash</span>
       <span class="upload_file_type"><span class="selected">Flash文件</span></span>
       <span id="return_input">ads_flash</span>
   </div>
   <div class="hide">
	    <span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('ads_dir').'/'.date('ym').'/'; ?></span>
		<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
   </div>
   <div class="clear_both"></div>
  </form> 
 </div>
</div>
<?php } else if($viewer=='clist') {?>
  <div class="ul_tables">
    <ul class="table" style="padding-top: 0pt;">
	<li class="id title">编号</li>
	<li class="check_li title">选择</li>
	<li class="hide">默认排序</li>	
	<li class="title long-200 sort_item" id="sort_by_title">元素标题</li>
	<li class="title long-100 sort_item" id="sort_by_type">元素类型</li>
	<li class="title long-100 sort_item" id="sort_by_width">宽度</li>
	<li class="title long-100 sort_item" id="sort_by_height">高度</li>
	<li class="title long-250">说明</li>
	<li class="title sort_item" id="sort_by_id">元素ID</li>
   </ul>
   <span class="hide" id="current_order"></span>
   <span class="hide" id="current_order_by">sort_by_default</span>
   <div class="ul_tables_body">
   <?php if(is_array($advertise_list)) foreach($advertise_list as $index => $value){
	$id=$index+1;
    
	echo '<ul id="'.$value['ads_id'].'_table" class="table ';
	echo $id%2==1?'odd':'even';
	echo ' hide">';
	echo '<li class="id">'.$id.'</li>';
	echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['ads_id'].'" /></li>';
	echo '<li class="by_default hide">'.$id.'</li>';
	echo '<li class="by_title long-200">'.$value['ads_title'].'</li>';
	echo '<li class="by_type long-100">'.$this->ads_model->ads_types[$value['ads_type']].'</li>';
	echo '<li class="by_width long-100">'.$value['ads_width'].'</li>';
	echo '<li class="by_height long-100">'.$value['ads_height'].'</li>';
	echo '<li class="ads_hint long-250" title="'.$value['ads_hint'].'" >'.my_limiter($value['ads_hint'],16).'</li>';
	echo '<li class="by_id">'.$value['ads_id'].'</li>';
	echo '</ul>';
	echo "\n";
   }
   ?>
   </div>
   <input type="hidden" id="id_be_selected" value="0" />
   <div class="clear_both"></div>
  </div>
  <div id="pagination"></div>
  <span id="pagination_num" class="hide">14</span>
  <?php } ?>