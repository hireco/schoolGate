<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">链接列表</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items add_link">添加链接</span></a></li>

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

      <li class="title long-150">名称</li>

	  <li class="title long-250">地址</li>

      <li class="title long-350">logo</li>

      <li class="title">推荐</li>

    </ul>  

    <?php if(is_array($links)) foreach($links as $index => $value){

	  $id=$index+1;

	  $logo=$value['link_logo']?'<a href="'.$value['link_url'].'" target=_blank><img src="'.$value['link_logo'].'" style="border:0px; height:20px;padding-bottom:3px;" /></a>':'';

	  $recommend=$value['recommend']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

      echo '<ul id="'.$value['link_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['link_id'].'" /></li>';	

      echo '<li class="long-150 by_title">'.$value['link_title'].'</li>';	  

      echo '<li class="long-250">'.$value['link_url'].'</li>';

	  echo '<li class="long-350">'.$logo.'</li>';

      echo '<li class="recommend_'.$value['link_id'].'"  title='.$value['recommend'].'>'.$recommend.'</li>';

	  echo '</ul>';

      echo "\n";

     }

   ?>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

 <?php } else if($action=='edit') { ?>

    <form class="my_form" id="link_form"  accept-charset="utf-8">

	<input type="hidden" name="link_id" id="link_id" value="<?php echo isset($link_id)?$link_id:0;?>" />

    <div class="form_title">填写表单<?php echo isset($link_id)?'修改':'添加';?>链接</div>

    <div class="my_form_item">

      <label class="labeltag">链接名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="link_title"  id="link_title"  value="<?php echo isset($link_title)?$link_title:'';?>" />

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">网站地址：</label>

      <span class="mainarea">

      <input type="text" class="enterbox jump_url filled"  name="link_url"  id="link_url" value="<?php echo isset($link_url)?$link_url:'';?>" />

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">网站logo：</label>

      <span class="mainarea">

      <input type="text" class="enterbox jump_url"  name="link_logo"  id="link_logo" value="<?php echo isset($link_logo)?$link_logo:'';?>" />

      </span>     

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <label for="link_submit"><input type="button" class="my_button" id="link_submit" name="link_submit" value="确认后，提交！" /></label>

      </span>

      <span class="mainarea">

      <label for="link_cancel"><input type="button" class="my_button" id="link_cancel" name="link_cancel" value="取消" /></label>

      </span>

    </div>

	</form>

  <?php } ?>



