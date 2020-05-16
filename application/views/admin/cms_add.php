<div id="workplace_inner">

    <form class="my_form" id="cms_form" accept-charset="utf-8" autocomplete = "off">

        <div class="form_title">发布新<?php echo $this->myconfig->cms_model($model_id,'name');?>  </div>

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

      <input type="text" class="enterbox title filled" name="cms_title" id="cms_title" value="" /><label>*内容标题，40字以内</label>
	  	<label id="switch_for_en_title" style="text-decoration:underline;cursor:pointer;">点击此处优化访问地址</label>
      </span>

            </div>

            <div class="my_form_item hide" id="for_en_title">

                <label class="labeltag">英文ID</label>

      <span class="mainarea">

     <input type="text" class="enterbox  keywords filled" name="cms_title_en" id="cms_title_en" value="" />

	  <label>*SEO优化访问ID,80个字符以内</label>

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">内容来源</label>

      <span class="mainarea">      

      <input type="text" class="enterbox mediumarea" name="cms_source" id="cms_source" value="<?php echo $this->myconfig->item('default_source');?>" />

      </span>

                <label class="labeltag">作者</label>

      <span class="mainarea">      

      <input type="text" class="enterbox mediumarea" name="cms_writer" id="cms_writer" value="<?php echo $this->myconfig->item('default_writer');?>" />

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">所属主栏目</label>

      <span class="mainarea">      

      <select name="class_id" id="class_id">

          <?php echo $class_select_option;?>

      </select>      

      </span>

                <label class="labeltag">所属副栏目</label>

      <span class="mainarea">      

      <select name="vice_class_id" id="vice_class_id">

          <?php echo $class_select_option;?>

      </select>      

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">内容关键词</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords" name="cms_keywords" id="cms_keywords" value="" /><label>*关键字，30字以内，以逗号间隔</label>

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag top">摘要或概述</label>

      <span class="mainarea">

      <textarea class="enterbox enterarea" name="cms_description" id="cms_description"></textarea><label class="bottom">*描述文字，不超过100字</label>

      </span>

            </div>

            <?php if($this->myconfig->cms_model($model_id,'table')!='photo') {?>

                <div class="my_form_item">

                    <label class="labeltag">内容图标</label>

	  <span class="mainarea">      

	  <input type="text"   id="icon_image" name="icon_image" data-num="1" class="enterbox" disabled='disabled' value="" />

	  <input type="hidden" id="icon_image_sql" name="icon_image_sql"  value="" />

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

	  <input type="checkbox" name="icon_first" value="1"  <?php if($this->myconfig->cms_model($model_id,'table')=='photo') echo 'disabled="disabled"'; ?>  checked="checked" id="icon_first" /><label>自动获取缩略图</label>

	  <input type="checkbox" name="add_watermark" value="1" <?php if($this->myconfig->item('add_watermark')=='1') echo 'checked="checked"'; ?>  id="add_watermark" /><label>图片加水印</label>

	  </span>

            </div>

        </div>

        <!-- 基本设置结束，主体内容开始 -->

        <div id="content_link_div">

            <?php

            $model_table=$this->myconfig->cms_model($model_id,'table');

            $this->load->view('pannel/'.$model_table.'_editor');

            ?>

        </div>

        <!-- 主体内容结束，高级选项开始 -->

        <div id="advance_link_div">

            <div class="my_form_item">

                <label class="labeltag">短标题</label>

      <span class="mainarea">

       <input type="text" class="enterbox" name="cms_stitle" id="cms_stitle" value="" /><label>*简短标题，10字以内</label>

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">跳转网址</label>

      <span class="mainarea">

       <input type="text" class="enterbox jump_url" name="jump_url" id="jump_url" value="" /><label>*访问后自动跳转到该地址</label>

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">发布时间</label>

      <span class="mainarea">

       <input type="text" class="enterbox" name="post_time" id="post_time" value="<?php echo date('Y-m-d H:i:s');?>" />

      </span>



                <label class="labeltag">查看次数</label>

      <span class="mainarea">

       <input type="text" class="enterbox shortarea" name="read_times" id="read_times" value="0" />

         <label class="increase"></label>

         <label class="decrease"></label>

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">设为头条</label>

     <span class="mainarea">

      <input type="radio" name="headline" id="headline_1" value="1" /><label>是</label>

      <input type="radio" name="headline" id="headline_0" value="0" checked="checked" /><label>否 </label>

     </span>

                <label class="labeltag">设为推荐</label>

     <span class="mainarea">

      <input type="radio" name="recommend" id="recommend_1" value="1" /><label>是</label>

      <input type="radio" name="recommend" id="recommend_0" value="0" checked="checked" /><label>否 </label>

     </span>

                <label class="labeltag">查看权限</label>

     <span class="mainarea">

     <?php

     $user_level=$this->config->item('user_level');

     ksort($user_level);

     $guest_level_title=end($user_level);

     $user_level=array_flip($user_level);

     $guest_level_value=$user_level[$guest_level_title];

     ?>

         <input type="text" class="enterbox shortarea"  name="user_level" id="user_level" value="<?php echo $guest_level_title;?>" />

      <input type="hidden" name="view_right" id="view_right"  value="<?php echo $guest_level_value;?>" />

     </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">开放评论</label>

      <span class="mainarea">

      <input type="radio" name="comments" id="comments_1" value="1" checked="checked" /><label>是</label>

      <input type="radio" name="comments" id="comments_0" value="0" /><label>否</label>

      </span>

                <label class="labeltag">标题加粗</label>

      <span class="mainarea">

       <input type="radio" name="title_strong" id="title_strong_1"  value="1" /><label>是</label>

       <input type="radio" name="title_strong" id="title_strong_0"  value="0" checked="checked" /><label>否</label>

      </span>

                <label class="labeltag">标题颜色</label>

      <span class="mainarea">

      <input type="text" name="title_color" class="enterbox shortarea" id="title_color"  value="" />

      </span>

            </div>

            <div class="my_form_item">

                <label class="labeltag">相关内容</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords copy_id_to_filled" name="relate_list" id="relate_list" value="" disabled="disabled"  />

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

       <input type="hidden" name="add_or_edit" id="add_or_edit" value="add" />

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



