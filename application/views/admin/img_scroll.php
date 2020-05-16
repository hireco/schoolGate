<?php if($viewer=='index') {?>

<div id="workplace_inner">

 <div class="list">

  <div class="horizon_navi">

   <ul>

    <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">滚动图片</span></a></li>

    <li><a href="javascript:void(0);"><span id="new_scroll" class="horizon_items">新建滚动图片组</span></a></li>

   </ul>   

  </div>

  <div id="clist_data"><?php echo $clist;?></div>

 </div>

 <div class="edit"></div> 

</div>

<?php } else if($viewer=='clist') {?>

   <div class="ul_tables">

    <ul class="table"  style="padding-top:0pt;">

      <li class="id title">序号</li>

      <li class="title long-150">名称</li>

      <li class="title long-100">图片高度</li>

      <li class="title long-100">图片宽度</li>

      <li class="title long-100">图片数目</li>

      <li class="title">调用ID</li>

    </ul>  

    <?php 

    if(is_array($scrolls)) foreach($scrolls as $index => $value){

	  $id=$index+1;

	  $photos=explode(':',$value['photo_list']);

	  $photo_num=count($photos);

      echo '<ul id="'.$value['scroll_id'].'_table" class="table ';

      echo $id%2==1?'odd':'even'; 

      echo ' ">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="long-150" id="title_'.$value['scroll_id'].'">'.$value['scroll_title'].'</li>';

      echo '<li class="long-100">'.$value['photo_height'].'</li>';

      echo '<li class="long-100">'.$value['photo_width'].'</li>';

      echo '<li class="long-100">'.$photo_num.'</li>';

      echo '<li>'.$value['scroll_id'].'</li>';

      echo '</ul>';

      echo "\n";

     }

   ?>

    <div class="clear_both"></div>

    <input type="hidden" name="id_be_selected" id="id_be_selected" value="0"> 

  </div>  

<?php } else if($viewer=='form') {?>

   <form class="my_form" id="scroll_form" accept-charset="utf-8">

     <div class="form_title"><?php echo $add_or_edit=='add'?'填写表单，以增加新的图片滚动组':'编辑已有图片滚动组'?></div>

     <div class="my_form_item">

      <label class="labeltag">滚动组名</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="scroll_title" id="scroll_title" value="<?php echo isset($scroll_title)?$scroll_title:'';?>" />

      <input type="hidden"  id="add_or_edit" name="add_or_edit" value="<?php echo isset($add_or_edit)?$add_or_edit:'add';?>" />

      <input type="hidden"  id="scroll_id" name="scroll_id" value="<?php echo isset($scroll_id)?$scroll_id:'0';?>" />

      <label>*滚动图片组名称，例如”首页滚动”,限10字内</label>

      </span>     

     </div>

     <div class="my_form_item">

      <label class="labeltag">图片宽度</label>

      <span class="mainarea">

      <input type="text" class="enterbox numarea filled"  id="photo_width" name="photo_width" value="<?php echo isset($photo_width)?$photo_width:'800';?>" />

      </span>      

      <span class="mainarea">

      <label>图片高度</label>

      <input type="text" class="enterbox numarea filled"  id="photo_height" name="photo_height" value="<?php echo isset($photo_height)?$photo_height:'600';?>" />

      <label>*单位为像素，限填整数</label>

      </span>     

     </div>

     <div class="my_form_item">

      <label class="labeltag">缩略宽度</label>

      <span class="mainarea">

      <input type="text" class="enterbox numarea filled"  id="thumb_width" name="thumb_width" value="<?php echo isset($thumb_width)?$thumb_width:'90';?>" />

      </span>      

      <span class="mainarea">

      <label>图片高度</label>

      <input type="text" class="enterbox numarea filled"  id="thumb_height" name="thumb_height" value="<?php echo isset($thumb_height)?$thumb_height:'68';?>" />

      <label>*单位为像素，限填整数</label>

      </span>     

     </div>

     <?php 
	     
	     $photos=isset($photo_list)?$this->cms_model->get_thumbs_files($photo_list).'::'.$photo_list:'';
	     $photos=$photos=='::'?'':$photos;

        ?>

     <div class="my_form_item">

      <label class="labeltag">上传图片</label>

      <span class="mainarea">               

       <input type="text" id="photo_list" name="photo_list" class="enterbox filled"  disabled="disabled" value="<?php echo $photos;?>" />	  

       <input type="hidden" id="photo_list_sql" name="photo_list_sql"  value="<?php echo $photos;?>" />

       <input type="hidden" id="photo_list_old" name="photo_list_old"  value="" />

       <input type="hidden" id="img_str" name="img_str" value="<?php echo isset($photo_description)?$photo_description:'';?>" />

       <input type="hidden" id="img_text" name="img_text" value="<?php echo isset($photo_caption)?$photo_caption:'';?>" />

       <input type="hidden" id="img_link" name="img_link" value="<?php echo isset($photo_link)?$photo_link:'';?>" />

       <input type="button" class="my_button" id="upload_image" value="点击上传" /><label>*最多20个图片</label>

      </span>

     </div>

     <div class="my_form_item <?php if(!isset($photo_list)) echo 'hide'; ?>">

      <label class="labeltag" style="vertical-align:top">图片列表</label>

      <span class="mainarea" id="images_just_uploaded" style="display:inline-block;"></span>

     </div>

     <div class="hide">

      <span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('scroll_dir').'/'.date('ym').'/'; ?></span>

	  <span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>

     </div>

     <div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="scroll_submit" name="scroll_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="scroll_cancel" name="scroll_cancel" value="取消" />

      </span>

     </div>

     <?php 

      $data['mylist']=array('crop','thumb');

	  $this->load->view('pannel/context_menu',$data);

    ?>

   </form>

<?php }?>



