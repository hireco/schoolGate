<div id="workplace_inner">

    <form class="my_form" id="class_form" accept-charset="utf-8">

        <div class="form_title"><?php echo $add_or_edit=='add'?'填写表单，以增加新的内容分类':'编辑已有内容分类'?></div>

        <div class="my_form_item">

            <label class="labeltag">所属分类</label>

      <span class="mainarea">      

	   <input type="text" name="parent_name" class="enterbox shortarea filled" id="parent_name" disabled="disabled" value="<?php echo $this->cms_model->get_attr(isset($parent_id)?$parent_id:0,'class_name');?>" />

	   <input type="button" name="select_parent" class="my_button" id="select_parent"  value="点击选择"  />

	   <input type="hidden" class="filled" name="parent_id" id="parent_id" value="<?php echo isset($parent_id)?$parent_id:'0';?>" />

	   <input type="hidden" class="filled" id="id_to_select" name="id_to_select" value="<?php echo isset($parent_id)?$parent_id:'0';?>" />

       <input type="hidden" class="filled" id="name_to_select" name="name_to_select" value="<?php echo $this->cms_model->get_attr(isset($parent_id)?$parent_id:0,'class_name');?>" />

      <label>*默认为顶级分类</label>

      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">分类名称</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="class_name" id="class_name" value="<?php echo isset($class_name)?$class_name:'';?>" />

      <input type="hidden"  id="add_or_edit" class="filled" name="add_or_edit" value="<?php echo isset($add_or_edit)?$add_or_edit:'add';?>" />

      <input type="hidden"  id="class_id" name="class_id" value="<?php echo isset($class_id)?$class_id:'';?>" />

	  <label>*填入分类名称，例如”院系新闻”</label>	<label id="switch_for_en_name" style="text-decoration:underline;cursor:pointer;">点击此处优化访问地址</label>

      </span>

        </div>

        <div class="my_form_item hide" id="for_en_name">

            <label class="labeltag">英文ID</label>

      <span class="mainarea">

     <input type="text" class="enterbox filled" name="class_name_en" id="class_name_en" value="<?php echo isset($class_name_en)?$class_name_en:'';?>" />

	  <label>*分类英文ID，例如”schoolnews”,限制在40个字符内</label>

      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">内容模型</label>

      <span class="mainarea">      

	  <?php

      if(isset($model_id)) $model_id=explode(',', $model_id);

      foreach($this->config->item('cms_model') as $index => $value) {

          echo '<input type="checkbox"';

          if(isset($model_id)) echo in_array($index, $model_id)?'checked="checked"':'';

          echo ' name="cms_model" id="cms_model_'.$index.'" value="'.$index.'" /><label>'.$value['name'].'</label>';

      }

      if(isset($model_id)) $model_id=implode(',',$model_id);

      ?>

          <input type="hidden" class="filled" name="model_id"  id="model_id" value="<?php echo isset($model_id)?$model_id:'';?>" />
      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">分类关键词</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled" name="class_keywords" id="class_keywords" value="<?php echo isset($class_keywords)?$class_keywords:'';?>" />

	  <label>*关键字，50字以内，以逗号间隔</label>

      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag" style="vertical-align:top">分类描述</label>

      <span class="mainarea">

      <textarea class="enterbox enterarea filled" name="class_description" id="class_description"><?php echo isset($class_description)?$class_description:'';?></textarea>

	  <label class="bottom">*描述文字，不超过100字</label>

      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">分类图标</label>

	  <span class="mainarea">

	  <input type="text"   id="icon_image" name="icon_image"  data-num="1"  data-preview="#icon_image_preview" class="enterbox" disabled='disabled' value="<?php echo isset($icon_image)?$icon_image:'';?>" />

	  <input type="hidden" id="icon_image_sql" name="icon_image_sql"  value="<?php echo isset($icon_image)?$icon_image:'';?>" />

	  <input type="hidden" id="icon_image_old" name="icon_image_old"  value="" />

	  <input type="button" class="my_button" id="upload_icon" value="点击上传" />

      <input type="button" class="my_button local_select" data-for="#icon_image"  value="本地选择" />

	  </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">分类图片</label>

      <span class="mainarea">

	  <input type="text" id="banner_image" name="banner_image" data-num="1"  data-preview="#banner_image_preview"  class="enterbox" disabled='disabled' value="<?php echo isset($banner_image)?$banner_image:'';?>" />

	  <input type="hidden" id="banner_image_sql" name="banner_image_sql"  value="<?php echo isset($banner_image)?$banner_image:'';?>" />

	  <input type="hidden" id="banner_image_old" name="banner_image_old"  value="" />

	  <input type="button" class="my_button" id="upload_banner" value="点击上传" />

      <input type="button" class="my_button local_select" data-for="#banner_image"  value="本地选择" />

	  </span>

        </div>

        <div class="form_pic_show">
            <div id="icon_image_preview">
                <?php
                if(isset($icon_image) && $icon_image)   echo '<img  id="icon_image_show"   src="'.$icon_image.'" />';
                ?>
            </div>
            <div id="banner_image_preview">
                <?php
                if(isset($banner_image)&& $banner_image) echo '<img  id="banner_image_show" src="'.$banner_image.'" />';
                ?>
            </div>
        </div>

        <div class="my_form_item">

            <label class="labeltag">分类首页</label>

      <span class="mainarea">
	   <select id="index_type" name="index_type">
           <?php
           if(isset($index_page)) {
               $index_type=array_key_exists($index_page,$this->config->item('index_type'))?$index_page:'single';
               $single_page=$index_type=='single'?$index_page:'';
           }
           foreach($this->config->item('index_type') as $index => $value) {
               echo '<option value="'.$index.'"';
               if(isset($index_type)) echo $index_type==$index?' selected="selected"':'';
               echo '>'.$value.'</option>';
           }
           ?>
       </select>
      </span>

        </div>

        <div id="for_single_page" class="my_form_item  <?php if(!isset($single_page) || !$single_page) echo 'hide';?>">

            <label class="labeltag">单页编号</label>

      <span class="mainarea">

      <input type="text" class="enterbox numarea  selected_text" name="single_page" id="single_page" value="<?php echo isset($single_page)?$single_page:'';?>" />
	  <input type="button" class="my_button open_win4select" id="select_single_page" value="点击选择" />
	  <input type="button" class="my_button remove_selected <?php if(!isset($single_page) || !$single_page) echo 'hide';?>" id="remove_single_page" value="清空" />

      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">引用分类</label>

      <span class="mainarea">

      <input type="text" class="enterbox selected_text" name="refer_class" id="refer_class" value="<?php echo isset($refer_class)?$refer_class:'';?>" disabled="disabled"  />
      <input type="button" class="my_button  open_win4select" id="select_refer_class" value="点击选择" />
	  <input type="button" class="my_button  remove_selected <?php if(!isset($refer_class) || !$refer_class) echo 'hide';?>" id="remove_refer_class" value="清空" />
      </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">隐藏分类</label>

      <span class="mainarea">

      <input type="checkbox" name="class_hide" id="class_hide" <?php echo isset($class_hide)?($class_hide=='1'?'checked="checked"':''):'';?> />

	  <label>谨慎设置</label>

      </span>

        </div>

        <div class="my_form_item">
            <label class="labeltag">查看权限</label>

     <span class="mainarea">

     <?php

     $user_level=$this->config->item('user_level');

     ksort($user_level);

     $guest_level_title=end($user_level);
     $level_title=isset($view_right)?$user_level[$view_right]:$guest_level_title;

     $user_level=array_flip($user_level);
     $guest_level_value=$user_level[$guest_level_title];
     $level_value=isset($view_right)?$view_right:$guest_level_value;

     ?>

         <input type="text" class="enterbox shortarea"  name="user_level" id="user_level" value="<?php echo $level_title;?>" />

      <input type="hidden" name="view_right" id="view_right"  value="<?php echo $guest_level_value;?>" />
	  <label>*此为下属内容的默认查看权限，可以发布内容时再进行设置</label>

     </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">列表模式</label>

      <span class="mainarea">

	  <select id="list_mode" name="list_mode">
          <option value="l" <?php echo isset($list_mode)?($list_mode=='l'?'selected="selected"':''):''; ?> >列表模式</option>
          <option value="t" <?php echo isset($list_mode)?($list_mode=='t'?'selected="selected"':''):''; ?> >缩略图模式</option>
      </select>
      
      </span>

        </div>

        <div class="my_form_item button_row">

            <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="class_submit" name="class_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="class_cancel" name="class_cancel" value="取消" />

      </span>

        </div>

        <div class="hide">

            <span id="class_banner_size"><?php echo $this->myconfig->item('class_banner_size'); ?></span>

            <span id="class_icon_size"><?php echo $this->myconfig->item('class_icon_size'); ?></span>

            <span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('class_dir'); ?></span>

            <span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>

        </div>

    </form>

    <div class="clear_both"></div>

</div>



