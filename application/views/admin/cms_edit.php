<div id="workplace_inner">

 <form class="my_form" id="cms_form" accept-charset="utf-8"  autocomplete = "off">

   <div class="form_title">编辑<?php echo $this->myconfig->cms_model($model_id,'name');?>：<?php echo $cms_title;?>  </div>

   <div class="horizon_navi line_navi">

      <ul>

       <li><a href="javascript:void(0)" class="pannel_toggle" id="basic_link"><span>普通项目</span></a></li>

       <li><a href="javascript:void(0)" class="pannel_toggle pannel_selected" id="content_link"><span>主体内容</span></a></li>

       <li><a href="javascript:void(0)" class="pannel_toggle" id="advance_link"><span>高级选项</span></a></li>

      </ul>

      <div class="clear_both"></div>

   </div>

<!-- 基本设置开始 -->

   <div id="basic_link_div">   

    <div class="my_form_item">

      <label class="labeltag">内容标题</label>

      <span class="mainarea">

      <input type="text" class="enterbox title filled" name="cms_title" id="cms_title" value="<?php echo $cms_title;?>" /><label>*内容标题，40字以内</label> 	<label id="switch_for_en_title" style="text-decoration:underline;cursor:pointer;">点击此处优化访问地址</label>
      </span>      

    </div>    

	<div class="my_form_item hide" id="for_en_title">

      <label class="labeltag">英文ID</label>

      <span class="mainarea">

     <input type="text" class="enterbox  keywords filled" name="cms_title_en" id="cms_title_en" value="<?php echo $cms_title_en;?>" />

	  <label>*SEO优化访问ID,80个字符以内</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">内容来源</label>

      <span class="mainarea">      

      <input type="text" class="enterbox mediumarea" name="cms_source" id="cms_source" value="<?php echo $cms_source;?>" />

      </span>

	  <label class="labeltag">作者</label>

      <span class="mainarea">      

      <input type="text" class="enterbox mediumarea" name="cms_writer" id="cms_writer" value="<?php echo $cms_writer;?>" />

      </span>      

    </div>

    <div class="my_form_item">

      <label class="labeltag">所属主栏目</label>

      <span class="mainarea">      

      <select name="class_id" id="class_id">

        <?php echo $class_select;?>

      </select>      

      </span>

      <label class="labeltag">所属副栏目</label>

      <span class="mainarea">      

      <select name="vice_class_id" id="vice_class_id">

        <?php echo $vice_class_select;?>

      </select>      

      </span>

     </div>

     <div class="my_form_item">

      <label class="labeltag">内容关键词</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords" name="cms_keywords" id="cms_keywords" value="<?php echo $cms_keywords;?>" /><label>*关键字，30字以内，以逗号间隔</label>

      </span>      

     </div>

     <div class="my_form_item">

      <label class="labeltag top">摘要或概述</label>

      <span class="mainarea">

      <textarea class="enterbox enterarea" name="cms_description" id="cms_description"><?php echo $cms_description;?></textarea><label class="bottom">*描述文字，不超过100字</label>

      </span>      

     </div>

     <?php if($this->myconfig->cms_model($model_id,'table')!='photo') {?>	

	 <div class="my_form_item">

      <label class="labeltag">内容图标</label>

	  <span class="mainarea">      

	  <input type="text"   id="icon_image" name="icon_image" data-num="1" class="enterbox" disabled='disabled' value="<?php echo $icon_image;?>" />

	  <input type="hidden" id="icon_image_sql" name="icon_image_sql"  value="<?php echo $icon_image;?>" />

	  <input type="hidden" id="icon_image_old" name="icon_image_old"  value="" />

	  <input type="button" class="my_button" id="upload_icon" value="点击上传" />

      <input type="button" class="my_button local_select"  data-for="#icon_image" value="本地选择" />

	  </span>

	</div>

	<?php }?>

	<div class="my_form_item">

      <label class="labeltag">自动选项</label>

	  <span class="mainarea">

	  <input type="checkbox" name="auto_keywords" value="1" checked="checked" id="auto_keywords"/><label>自动获取关键词</label>      

	  <input type="checkbox" name="auto_description" value="1" checked="checked" id="auto_description" /><label>自动获取摘要</label>

	  <input type="checkbox" name="get_remote" value="1" <?php if($this->myconfig->item('get_remote')=='1') echo 'checked="checked"';?> id="get_remote"/><label>远程资源获取</label>

	  <input type="checkbox" name="del_link" value="1" <?php if($this->myconfig->item('del_link')=='1') echo 'checked="checked"'; ?> id="del_link" /><label>删除外链</label>

	  <input type="checkbox" name="icon_first" value="1"  <?php if($this->myconfig->cms_model($model_id,'table')=='photo') echo 'disabled="disabled"'; ?> checked="checked" id="icon_first" /><label>自动获取缩略图</label>

	  <input type="checkbox" name="add_watermark" value="1" <?php if($this->myconfig->item('add_watermark')=='1') echo 'checked="checked"'; ?>  id="add_watermark" /><label>图片加水印</label>	  

	  </span>

	</div>

	</div>

<!-- 基本设置结束，主体内容开始 -->

   <div id="content_link_div">

     <?php

       $model_table=$this->myconfig->cms_model($model_id,'table'); 

       $this->load->view('pannel/'.$model_table.'_editor',$cms_content);

     ?>     

   </div>

<!-- 主体内容结束，高级选项开始 -->

   <div id="advance_link_div">     

     <div class="my_form_item">

      <label class="labeltag">短标题</label>

      <span class="mainarea">

       <input type="text" class="enterbox" name="cms_stitle" id="cms_stitle" value="<?php echo $cms_stitle;?>" /><label>*简短标题，10字以内</label>

      </span>      

     </div>

     <div class="my_form_item">

      <label class="labeltag">跳转网址</label>

      <span class="mainarea">

       <input type="text" class="enterbox jump_url" name="jump_url" id="jump_url" value="<?php echo $jump_url; ?>" /><label>*访问后自动跳转到该地址</label>

      </span>      

     </div>

     <div class="my_form_item">

      <label class="labeltag">发布时间</label>

      <span class="mainarea">

       <input type="text" class="enterbox" name="post_time" id="post_time" value="<?php echo date('Y-m-d H:i:s',$post_time);?>" />

      </span>

      

      <label class="labeltag">查看次数</label>

      <span class="mainarea">

       <input type="text" class="enterbox shortarea" name="read_times" id="read_times" value="<?php echo $read_times;?>" />

         <label class="increase"></label>

         <label class="decrease"></label>

      </span> 

     </div>

    <div class="my_form_item">   

     <label class="labeltag">设为头条</label>

     <span class="mainarea">

      <input type="radio" name="headline" id="headline_1" value="1" <?php if($headline)  echo 'checked="checked"'; ?>  /><label>是</label>

      <input type="radio" name="headline" id="headline_0" value="0" <?php if(!$headline)  echo 'checked="checked"'; ?> /><label>否 </label>

     </span>

     <label class="labeltag">设为推荐</label>

     <span class="mainarea">

      <input type="radio" name="recommend" id="recommend_1" value="1" <?php if($recommend)  echo 'checked="checked"'; ?> /><label>是</label>

      <input type="radio" name="recommend" id="recommend_0" value="0" <?php if(!$recommend)  echo 'checked="checked"'; ?> /><label>否 </label>

     </span>

     <label class="labeltag">查看权限</label>

     <span class="mainarea">

     <?php

        $user_level=$this->config->item('user_level');        

        $level_title=$user_level[$view_right];

     ?>

      <input type="text" class="enterbox shortarea"  name="user_level" id="user_level" value="<?php echo $level_title;?>" />

      <input type="hidden" name="view_right" id="view_right"  value="<?php echo $view_right;?>" />

     </span>           

     </div>

     <div class="my_form_item">

      <label class="labeltag">开放评论</label>

      <span class="mainarea">

      <input type="radio" name="comments" id="comments_1" value="1" <?php if($comments)  echo 'checked="checked"'; ?> /><label>是</label>

      <input type="radio" name="comments" id="comments_0" value="0" <?php if(!$comments)  echo 'checked="checked"'; ?>/><label>否</label>

      </span>

      <label class="labeltag">标题加粗</label>

      <span class="mainarea">      

      <input type="radio" name="title_strong" id="title_strong_1"  value="1" <?php if($title_strong)  echo 'checked="checked"'; ?> /><label>是</label>

      <input type="radio" name="title_strong" id="title_strong_0"  value="0" <?php if(!$title_strong)  echo 'checked="checked"'; ?> /><label>否</label>

      </span>

      <label class="labeltag">标题颜色</label>

      <span class="mainarea">

      <input type="text" name="title_color" class="enterbox shortarea" id="title_color"  value="<?php echo $title_color;?>" />

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">相关内容</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords copy_id_to_filled" name="relate_list" id="relate_list" value="<?php echo isset($relate_list)?$relate_list:'';?>" disabled="disabled"  />

      <input type="button" class="my_button" id="select_relate_list" value="点击选择" />

      </span>      

     </div>

   </div>

<!-- 高级选项结束 -->	

   <div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="cms_submit" name="cms_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="cms_cancel" name="cms_cancel" value="取消" />

      </span>

      <span class="hide">
	   
	   <input type="hidden" name="old_class_id"   id="old_class_id"  value="<?php echo $class_id;?>" />

       <input type="hidden" name="index_id"   id="index_id"  value="<?php echo $index_id;?>" />

       <input type="hidden" name="add_or_edit" id="add_or_edit" value="edit" />

       <input type="hidden" name="model_id" id="model_id" value="<?php echo $model_id;?>"  />

       <input type="hidden" name="model_table" id="model_table" value="<?php echo $model_table;?>" />

       <input type="hidden" name="check_model" id="check_model" value="<?php echo $this->myconfig->item('check_model');?>" />
	   
	   <?php 
	       if(!$this->check->check_if_super_admin()) $my_class=implode(',',$this->cms_model->get_my_classes());
	   ?>
	   <input type="hidden" name="my_class"	id="my_class" value="<?php echo isset($my_class)?$my_class:'';?>" />

      </span>

   </div>   	

  </form>  

  <div class="clear_both"></div>

</div>



