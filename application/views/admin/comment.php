<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">评论列表</span></a></li>

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

      <li class="title long-250 sort_item" id="sort_by_topic">内容主题</li>

      <li class="title long-250 sort_item" id="sort_by_content">内容主题</li>

	  <li class="title sort_item" id="sort_by_type">对象类型</li>

	  <li class="title long-150 sort_item" id="sort_by_post_time">发布时间</li>

      <li class="title sort_item" id="sort_by_checked">查看</li>

      <li class="title sort_item" id="sort_by_processed">回复</li>

      <li class="title sort_item" id="sort_by_hide">显示</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>

    <div class="ul_tables_body">  

    <?php if(is_array($comments)) foreach($comments as $index => $value){

	  

      $id=$index+1;

	  $checked=$value['checked']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $replied=$value['replied']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $hide=!$value['hide']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  

	  $comment_type=$this->config->item('comment_type');

	  $object_title=$this->functions->get_object_title($value['object_type'],$value['object_id']);

	  

	  $item_title=$object_title?$object_title:'不存在或已删除';

	  

	  echo '<ul id="'.$value['comment_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['comment_id'].'" /></li>';	

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="by_topic long-250" '.($object_title?'':'style="text-decoration:line-through;"').' title="'.$item_title.'">'.my_limiter($item_title,14).'</li>';

      echo '<li class="by_content long-250" title="'.$value['comment_content'].'">'.my_limiter($value['comment_content'],14).'</li>';		  

      echo '<li class="by_type">'.$comment_type[$value['object_type']].'</li>';

	  echo '<li class="by_post_time long-150">'.date('Y-m-d H:i:s',$value['post_time']).'</li>';

      echo '<li class="by_checked checked_'.$value['comment_id'].'">'.$checked.'</li>';

      echo '<li class="by_processed processed_'.$value['comment_id'].'">'.$replied.'</li>';

      echo '<li class="by_hide hide_'.$value['comment_id'].'">'.$hide.'</li>';

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

    <form class="my_form" id="comment_form"  accept-charset="utf-8">

	<input type="hidden" name="comment_id"  id="comment_id" value="<?php echo isset($comment_id)?$comment_id:0;?>" />

    <input type="hidden" name="object_type" id="object_type" value="<?php echo isset($object_type)?$object_type:0;?>" />

    <input type="hidden" name="object_id"   id="object_id" value="<?php echo isset($object_id)?$object_id:0;?>" />

    <div class="form_title">回复评论</div>

    <?php if(isset($comment_content)) {?>

     <div class="my_form_item">

       <label class="labeltag top">原评论：</label>

       <span class="mainarea" style="display:inline-block; width:500px;">      

       <?php echo $this->str_func->text_filter($comment_content);?>

       </span>   

     </div>

    <?php }?>

	<div class="my_form_item">

      <label class="labeltag top">回复内容：</label>

      <span class="mainarea">      

      <textarea name="comment_content" id="comment_content" class="enterbox enterarea filled" ></textarea>

      </span>    

    </div>    

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="comment_submit" name="comment_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="comment_cancel" name="comment_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php }  else if($action=='viewer') {

     $comment_type=$this->config->item('comment_type'); 

  ?>

   <div class="message_viewer" style="width:400px;">

    <div class="title"><a target=_blank href="<?php echo site_url($object_type.'/view/'.$object_id);?>">相关主题：<?php echo isset($object_id)?$this->functions->get_object_title($object_type,$object_id):'';?></a></div>

    <div class="content">

      <div><?php echo isset($comment_content)?$this->str_func->text_filter($comment_content):'';?></div>

      <?php if(isset($parent_content)) echo '<div class="parent">'.$this->str_func->text_filter($parent_content).'<div class="bar">原评论内容</div></div>';?>

    </div>

    <div class="type">主题所属类型：<?php echo $comment_type[$object_type];?></div>

    <div class="poster_source"><span style="color:blue">时间：</span><?php echo isset($post_time)?date('Y-m-d H:i:s',$post_time):'';?> <span style="color:red">IP: </span><?php echo isset($post_ip)?$post_ip:'';?></div>

   </div>

  <?php }?>



