<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">留言列表</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items add_guestbook">发布留言</span></a></li>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>

   <li class="hide" id="return_to_all"><a href="javascript:void(0)"><span class="horizon_items return_to_all">返回列表</span></a></li>

   </ul>

  </div>

  <div id="clist_data"><?php echo $clist;?></div>

  </div>

  <div class="edit"></div>

</div>

<?php } else if($action=='clist') {?>

  <div class="ul_tables">

    <ul class="table" style="padding-top:0pt;">

      <li class="id title">编号</li>      

      <li class="check_li title">选择</li>

      <li class="hide">默认排序</li>	

      <li class="title long-250 sort_item" id="sort_by_topic">主题</li>

	  <li class="title long-150 sort_item" id="sort_by_type">留言类型</li>

	  <li class="title long-150 sort_item" id="sort_by_post_time">发布时间</li>

      <li class="title sort_item" id="sort_by_checked">查看</li>

      <li class="title sort_item" id="sort_by_processed">处理</li>

      <li class="title sort_item" id="sort_by_recommend">推荐</li>

      <li class="title sort_item" id="sort_by_hide">显示</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>

    <div class="ul_tables_body">  

    <?php if(is_array($guestbooks)) foreach($guestbooks as $index => $value){

	  $id=$index+1;

	  $recommend=$value['recommend']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

      $checked=$value['checked']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $processed=$value['processed']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $hide=!$value['hide']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  echo '<ul id="'.$value['guest_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['guest_id'].'" /></li>';	

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="by_topic long-250">'.$value['guest_topic'].'</li>';	  

      echo '<li class="by_type long-150">'.$value['top_type'].'-'.$value['sub_type'].'</li>';

	  echo '<li class="by_post_time long-150">'.date('Y-m-d H:i:s',$value['post_time']).'</li>';

      echo '<li class="by_checked checked_'.$value['guest_id'].'">'.$checked.'</li>';

      echo '<li class="by_processed processed_'.$value['guest_id'].'">'.$processed.'</li>';

      echo '<li class="by_recommend recommend_'.$value['guest_id'].'">'.$recommend.'</li>';

      echo '<li class="by_hide hide_'.$value['guest_id'].'">'.$hide.'</li>';

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

 <?php } else if($action=='post') { ?>

    <form class="my_form" id="guestbook_form"  accept-charset="utf-8">

	<input type="hidden" name="guest_id" id="guest_id" value="<?php echo isset($guest_id)?$guest_id:0;?>" />

    <div class="form_title"><?php echo isset($guest_id)?'回复':'发布';?>留言</div>

    <div class="my_form_item">

      <label class="labeltag">您的称呼：</label>

      <span class="mainarea">

      <input type="text" class="enterbox shortarea filled"  name="guest_name"  id="guest_name"  value="<?php echo $this->check->get_user_nickname($this->session->userdata('user_id'),'admin');?>" />

      </span>    

    </div>

    <div class="my_form_item">

      <label class="labeltag">内容主题：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="guest_topic"  id="guest_topic"  <?php echo isset($guest_id)?'disabled="disabled"':'';?> value="<?php echo isset($guest_topic)?$guest_topic:'';?>" />

      </span>    

    </div>

    <div class="my_form_item">

      <label class="labeltag">留言类型：</label>

      <span class="mainarea">

      <input id="top_type" name="top_type" class="enterbox shortarea filled"  <?php echo isset($guest_id)?'disabled="disabled"':'';?> type="text" value="<?php echo isset($top_type)?$top_type:'';?>" /><span>留言子类型：</span> <input id="sub_type" name="sub_type" class="enterbox shortarea filled" <?php echo isset($guest_id)?'disabled="disabled"':'';?>  value="<?php echo isset($sub_type)?$sub_type:'';?>" type="text" />

      </span>

      <div id="top_types" class="hide"><?php $this->guest_model->top_types();?></div>

      <div id="sub_types" class="hide"><?php $this->guest_model->sub_types();?></div>     

    </div>

    <?php if(isset($guest_content)) {?>

     <div class="my_form_item">

       <label class="labeltag top">原留言：</label>

       <span class="mainarea" style="display:inline-block; width:500px;">      

       <?php echo $this->str_func->text_filter($guest_content);?>

       </span>   

     </div>

    <?php }?>

	<div class="my_form_item">

      <label class="labeltag top"><?php echo isset($guest_id)?'回复':'发布';?>内容：</label>

      <span class="mainarea">      

      <textarea name="guest_content" class="enterbox enterarea  filled" ></textarea>

      </span>    

    </div>    

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="guest_submit" name="guest_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="guest_cancel" name="guest_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php }  else if($action=='viewer') {?>

   <div class="message_viewer" style="width:400px;">

    <div class="title"><?php echo isset($guest_topic)?$guest_topic:'';?></div>

    <div class="content">

      <div><?php echo isset($guest_content)?$this->str_func->text_filter($guest_content):'';?></div>

      <?php if(isset($parent_content)) echo '<div class="parent">'.$this->str_func->text_filter($parent_content).'<div class="bar">原留言</div></div>';?>

    </div>

    <div class="type">主题分类：<?php echo $top_type.'-'.$sub_type;?></div>

    <div class="poster_source"><span style="color:blue">时间：</span><?php echo isset($post_time)?date('Y-m-d H:i:s',$post_time):'';?> <span style="color:red">IP: </span><?php echo isset($post_ip)?$post_ip:'';?></div>

   </div>

  <?php }?>



