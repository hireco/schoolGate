<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

     <li><a class="selected" href="javascript:void(0);"><span class="horizon_items setting_list">显示栏目列表</span></a></li>

     <li><a href="javascript:void(0);"><span class="horizon_items setting_add">添加显示栏目</span></a></li>

     <li><a href="<?php echo site_url($this->config->item('admin_dir').'/advertise'); ?>"><span id="advertise_items" class="horizon_items">区块元素管理</span></a></li>

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

      <li class="title long-200">名称</li>

      <li class="title long-250">设置值</li>

      <li class="title">排列方向</li>

      <li class="title">调用ID</li>

      <li class="title">来源</li>

    </ul>  

    <?php if(is_array($settings)) foreach($settings as $index => $value){

      $source=$value['system']=='1'?'<span class="red">系统</span><span class="delete_forbidden"></span>':'<span class="green">附加</span><span class="delete_this"></span>';

	  $direction=$value['direction']=='v'?'竖直':'水平';

	  $id=$index+1;

	  echo '<ul id="'.$value['setting_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="long-200">'.$value['setting_name'].'</li>';

	  echo '<li class="long-250">'.$value['setting_value'].'</li>';

	  echo '<li>'.$direction.'</li>';

	  echo '<li>'.$value['setting_id'].'</li>'; 

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

 <?php } else if($action=='edit') { ?>

    <form class="my_form" id="syssetting_edit"  accept-charset="utf-8">

	<input type="hidden" name="setting_id" id="setting_id" value="<?php echo $setting_id;?>" />

    <div class="form_title">填写表单修改区块显示栏</div>

    <div class="my_form_item">

      <label class="labeltag">显示栏名称：</label>

      <span class="mainarea">

      <?php echo $setting_name?>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">区块元素ID列：</label>

      <span class="mainarea">

       <input type="text" class="enterbox  keywords filled" name="setting_value" id="setting_value" value="<?php echo $setting_value;?>" /> <label>*限30字，以逗号(,)间隔</label> <label class="bubble_linker ads_setting_hint">查看提示</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">排列方向：</label>

      <span class="mainarea">

        <select name="direction" id="direction">

          <option value="v" <?php if($direction=='v') echo 'selected="selected"'; ?>>竖直方向</option>

          <option value="h" <?php if($direction=='h') echo 'selected="selected"'; ?>>水平方向</option>

        </select>

      </span>     

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="setting_submit" name="setting_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="setting_cancel" name="setting_cancel" value="取消" />

      </span>

    </div>

	</form>

	<script>

	 $(document).ready(function(){

		//提示信息

		bubble_initial($('.ads_setting_hint'),'若横向显示，则元素高度应一致<br />若纵向显示，则元素宽度应一致'); 

     });

	</script>

  <?php } else if($action=='add'){?>

    <form class="my_form" id="syssetting_add"  accept-charset="utf-8">

    <div class="form_title">填写表单添加新区块显示栏</div>

    <div class="my_form_item">

      <label class="labeltag">显示栏名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" id="setting_name" name="setting_name" /><label>*中文名称，限15字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">区块元素ID列：</label>

      <span class="mainarea" id="item_value">

        <input type="text" class="enterbox  keywords filled" name="setting_value" id="setting_value" value="" /><label>*限30字，以逗号(,)间隔</label> <label class="bubble_linker ads_setting_hint">查看提示</label>

      </span> 

    </div>

    <div class="my_form_item">

      <label class="labeltag">排列方向：</label>

      <span class="mainarea">

        <select name="direction" id="direction">

          <option value="v">竖直方向</option>

          <option value="h">水平方向</option>

        </select>

      </span>     

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="setting_add_submit" name="setting_add_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="setting_add_cancel" name="setting_add_cancel" value="取消" />

      </span>

    </div>

	</form>

	<script>

	 $(document).ready(function(){

		//提示信息

		bubble_initial($('.ads_setting_hint'),'若横向显示，则元素高度应一致<br />若纵向显示，则元素宽度应一致'); 

     });

	</script>

  <?php }?>



