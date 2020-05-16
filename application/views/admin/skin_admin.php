<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a href="javascript:void(0);"><span class="horizon_items file_add">添加文件</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items skin_select">界面选择</span></a></li>   

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items list_files" id="css_list">样式文件</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items list_files" id="image_list">图片文件</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items list_files" id="template_list">模板文件</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items list_files" id="js_list">动作脚本</span></a></li>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>

   </ul>   

</div>

<div class="clear_both"></div>  

<div id="clist_data"><?php echo $clist;?></div>

  </div>

  <div class="edit"></div>

  <input type="hidden" id="file_type" value="css" />

  <input type="hidden" id="sub_dir" value="" />

</div>

<?php } else if($action=='clist') {?>

  <div class="ul_tables">

    <div class="horizon_navi_bar">

      <div class="cur_dir"><?php echo $dir;?></div>      

    </div>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>    

    <div class="skin_list">

     <div class="sort_linker">

        <div class="sort_item" id="sort_by_filename">文件名</div>     

	    <div class="sort_item" id="sort_by_timestamp">日期时间</div>

	    <div class="sort_item" id="sort_by_file_dir">目录文件</div>

	    <div class="sort_item" id="sort_by_filetype">文件类型</div>

	    <div class="clear_both"></div>

     </div>

      <div class="skin_list_body">

      <?php 

       $id=0;

       if(is_array($files)) foreach($files as $index => $value) if($value['name']!=$this->my_minify->file_prefix){

      

       $id++;

       if(is_file($dir.'/'.$value['name'])) $style='file';

       else $style='directory';       

       $itemattr=$style=='directory'?'目录':'文件';

       $filetype=$style=='file'?$this->my_file->file_extend($value['name']):'---';

       

       echo '<div id="skin_no'.$id.'" class="file_dir '.$style.' hide">';	  

       echo '<span class="by_default hide">'.$id.'</span>';       	  

       echo '<span class="by_filename" id="filename_'.$id.'">'.$value['name'].'</span>';

	   echo '<span class="by_timestamp" >'.date('Y-m-d H:i:s',$value['date']).'</span>';

	   echo '<span class="by_file_dir">'.$itemattr.'</span>';

	   echo '<span class="by_filetype">'.$filetype.'</span>';

       echo '</div>';

      }

     ?>

     </div>

    </div>

    <input type="hidden" id="file_path" value="<?php echo $dir;?>" />

    <input type="hidden" id="file_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">30</span>

 <?php } else if($action=='edit_file') { ?>

    <form class="my_form" id="file_edit"  accept-charset="utf-8">

	<input type="hidden" name="file" id="file" value="<?php echo isset($file)?$file:'';?>" />

    <input type="hidden" name="path" id="path" value="<?php echo $path;?>" />

    <input type="hidden" name="filename_old" id="filename_old" value="<?php echo isset($filename)?$filename:'';?>" />

    <div class="form_title">填写表单<?php echo isset($filename)?'编辑':'添加';?>文件</div>

    <div class="my_form_item">

      <label class="labeltag">所在目录：</label>

      <span class="mainarea">

      <input type="text"  class="enterbox filepath filled" name="to_path"  id="to_path"  value="<?php echo $path;?>" disabled="disabled" /> 

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">文件名称：</label>

      <span class="mainarea">

      <input type="text"  class="enterbox filled" name="filename"  id="filename"  value="<?php echo isset($file)?$file:'';?>" <?php if(isset($file)) echo 'disabled="disabled"';?> /> <label><?php echo isset($file)?'*文件名和路径不能更改':'*输入文件名（不包含路径）';?></label>

      </span>

      <span class="mainarea hide">

      <input type="checkbox" name="overwrite" id="overwrite" /> <label>*覆盖原文件</label>

      <input type="hidden" name="existing" id="existing" value="0" />

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag top">文件内容：</label>

      <span class="mainarea">

      <textarea class="enterbox file_editor filled"  name="file_content" id="file_content"><?php if(isset($file_content)) echo $file_content;?></textarea>

      </span>     

    </div>	

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="file_submit" name="file_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="file_cancel" name="file_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php } else if($action=='upload_file'){?>

    <form class="my_form"  enctype="multipart/form-data" id="file_upload"  accept-charset="utf-8">

	<input type="hidden" name="path" id="path" value="<?php echo $path;?>" />

    <div class="form_title">选择图片文件上传</div>

    <div class="my_form_item">

      <label class="labeltag">目标目录：</label>

      <span class="mainarea">

      <input type="text"  class="enterbox filepath filled" name="to_path"  id="to_path"  value="<?php echo $path;?>" disabled="disabled" /> 

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">目标名称：</label>

      <span class="mainarea">

      <input type="text"  class="enterbox filled" name="FileName"  id="FileName"  value="" /> <label>*英文字母或者数字,不含后缀</label>

      </span>     

    </div>

    

    <div class="my_form_item">

	<label class="labeltag">选择文件：</label>

	  <span class="mainarea">

	    <input class="enterbox filled" type="text" id="targetFileName" disabled="disabled" />

	    <input type="button" class="my_button" id="upload_linker" name="upload_linker" disabled="disabled" value="点击选择上传" />

	    <input type="button" class="my_button" id="upload_return" name="upload_return" value="返回" />

	  </span>

	  <span class="hide" id="image_types_list">*.jpg;*.jpeg;*.gif;*.png</span>

	  <span class="hide" id="file_type_selected">image</span>

	  <span class="hide upload_file_type"><span class="selected">图片文件</span></span>

	  <span class="hide" id="return_input">targetFileName</span>

	  <span class="hide" id="rename_to">FileName</span>

	  <span class="hide" id="dir_to"><?php echo $this->myconfig->get_template('skin_dir').'/images/';?></span>

    </div>

    <div class="my_form_item hide">

      <label class="labeltag top">成功上传：</label>

      <span class="mainarea" id="just_uploaded"></span>     

    </div> 

  </form>

  <?php } else if($action=='select_skin'){?>

    <form class="my_form" id="class_edit"  accept-charset="utf-8">

    <div class="form_title">选择前台风格</div>

    <div class="my_form_item" id="for_old_class">

      <label class="labeltag">选择风格：</label>

      <span class="mainarea">

      <select id="skin_id" name="skin_id">

        <?php 
          $this->db->where('is_mobile',0);
          $query=$this->db->get('sys_skin');

          $skins=$query->result_array();

          if(count($skins))  foreach ($skins as $index => $value) {

             echo '<option value="'.$value['skin_id'].'"'; 

             if($this->myconfig->get_template('skin_id')==$value['skin_id']) echo ' selected="selected" ';

             echo'>'.$value['skin_title'].'</option>';

          }

          else  

             echo '<option value="0">没有风格可选</option>';

        ?>

      </select> <label>*注意：选择新模板后请更新缓存！</label>

      </span>     

    </div>   

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="skin_submit" name="skin_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="skin_cancel" name="skin_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php } ?>



