<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

  <?php if(is_array($notice_class)) foreach($notice_class as $index => $value) 

	 echo '<li><a href="javascript:void(0);"><span class="horizon_items notice_list">'.$value.'</span></a></li>';

  ?>

   <li><a href="javascript:void(0);"><span class="horizon_items notice_add">发布信息</span></a></li>

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

      <li class="title long-100">类型</li>            

	  <li class="title long-250">标题</li>

	  <li class="title long-250">内容</li>  

	  <li class="title long-100">时间</li>

	  <li class="title long-100">发布者</li>

	  <li class="title">删除</li>

    </ul>  

    <?php if(is_array($notices)) foreach($notices as $index => $value){

	  $id=$index+1;

	  $poster=$value['user_id']? $this->check->get_attr($value['user_id'],'real_name'):'系统';

	  $source=$value['system']=='1'?'<span class="red">系统</span><span class="delete_forbidden"></span>':'<span class="green">删除</span><span class="delete_this"></span>';

	  echo '<ul id="'.$value['notice_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="long-100">'.$value['notice_class'].'</li>';

	  echo '<li class="long-250 show_title notice_title" title="'.$value['notice_title'].'">'.my_limiter($value['notice_title'],14).'</li>'; 

	  echo '<li class="long-250 show_title" title="'.$value['notice_content'].'">'.my_limiter($value['notice_content'],14).'</li>'; 

	  echo '<li class="long-100">'.date('Y-m-d',$value['post_time']).'</li>';

	  echo '<li class="long-100">'.$poster.'</li>';

	  echo '<li class="source_'.$value['system'].'">'.$source.'</li>';

      echo '</ul>';

      echo "\n";

     }

   ?>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">16</span>

 <?php } else if($action=='form') { ?>

    <form class="my_form" id="sysnotice_form"  accept-charset="utf-8">

	<input type="hidden" name="notice_id" id="notice_id" value="<?php echo isset($notice_id)?$notice_id:'0';?>" />

    <div class="form_title"><?php echo isset($notice_id)?'修改表单内容以编辑信息':'填写表单发布信息';?></div>

    <div class="my_form_item">

      <label class="labeltag">信息类型：</label>

      <span class="mainarea">

      <select id="notice_class" name="notice_class">

        <?php 

          $notice_class=$this->config->item('notice_class');

          foreach ($notice_class as $index => $value) { 

            echo '<option value="'.$value.'"'; 

            if(isset($notice_class) && $value==$notice_class) echo ' selected="selected" ';

            echo '>'.$value.'</option>';

          }

        ?>

      </select>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">信息标题：</label>

      <span class="mainarea">

      <input type="text" class="enterbox title filled" id="notice_title" name="notice_title"  value="<?php echo isset($notice_title)?$notice_title:'';?>" /><label>*中文名称，限20字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag top">信息内容：</label>

      <span class="mainarea" id="item_value">

        <textarea class="enterbox large_enterarea filled" name="notice_content" id="notice_content"><?php echo isset($notice_content)?$notice_content:'';?></textarea><label class="bottom">*限1000字</label>

      </span> 

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="notice_submit" name="notice_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="notice_cancel" name="notice_cancel" value="取消" />

      </span>

    </div>

	</form>

<?php } else if($action=='view') {?>

   <div class="message_viewer">

    <div class="title"><?php echo $notice_class.'：'.$notice_title;?></div>

    <div class="order_detail"><?php echo nl2br($notice_content);?></div>

    <div class="poster_source">

      <span>发布人：<?php echo $user_id? $this->check->get_attr($user_id,'real_name'):'系统';?>┊</span>

      <span style="color:blue">时间：<?php echo date('Y-m-d H:i:s',$post_time);?>┊</span>

      <span style="color:red">IP: <?php echo $post_ip?$post_ip:'unknow';?></span>

    </div>

   </div>

<?php }?>



