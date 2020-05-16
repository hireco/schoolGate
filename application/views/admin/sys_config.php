<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

  <?php foreach($config_class as $index => $value) 

	 echo '<li><a href="javascript:void(0);"><span class="horizon_items config_list">'.$value.'</span></a></li>';

  ?>

   <li><a href="javascript:void(0);"><span class="horizon_items config_add">添加设置</span></a></li>

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

      <li class="title long-150">名称</li>

	  <li class="title long-200">符号</li>

      <li class="title long-250">设置值</li>      

	  <li class="title long-200">描述</li>  

	  <li class="title long-100">类别</li>

	  <li class="title">来源</li>

    </ul>  

    <?php if(is_array($configs)) foreach($configs as $index => $value){

	  $id=$index+1;

	  $config_value=$value['input_type']=='radio'?($value['config_value']=='1'?'是':'否'):my_limiter($value['config_value'],18);

      $source=$value['system']=='1'?'<span class="red">系统</span><span class="delete_forbidden"></span>':'<span class="green">附加</span><span class="delete_this"></span>';

	  echo '<ul id="'.$value['config_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="long-150 config_title">'.$value['config_title'].'</li>';	  

      echo '<li class="long-200 strong">'.$value['config_name'].'</li>';

	  echo '<li class="long-250 show_title" title="'.$value['config_value'].'">'.$config_value.'</li>'; 

	  echo '<li class="long-200" title="'.$value['config_description'].'">'.my_limiter($value['config_description'],14).'</li>';

	  echo '<li class="long-100">'.$value['config_class'].'</li>';

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

    <form class="my_form" id="sysconfig_edit"  accept-charset="utf-8">

	<input type="hidden" name="config_id" id="config_id" value="<?php echo $config_id;?>" />

    <div class="form_title">填写表单修改参数</div>

    <div class="my_form_item">

      <label class="labeltag">参数名称：</label>

      <span class="mainarea">

      <?php echo $config_title?>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">参数符号：</label>

      <span class="mainarea">

      <?php echo $config_name?>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">相关描述：</label>

      <span class="mainarea">

      <?php echo $config_description;?>  

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag" <?php if($input_type=='textarea') echo 'style="vertical-align:top;"';?>>参数值：</label>

      <span class="mainarea">

      <?php if($input_type=='text')  echo '<input type="text" class="enterbox  keywords filled" name="config_value" id="config_value" value="'.$config_value.'" />';

       else if($input_type=='textarea') echo '<textarea class="enterbox enterarea filled" name="config_value" id="config_value">'.$config_value.'</textarea>'; 

       else if($input_type=='radio') {

      ?><input type="radio" name="config_value"  id="config_value_1" value="1" <?php if($config_value=='1') echo 'checked="checked"';?>  /><label>是</label><input type="radio" name="config_value"  id="config_value_0" value="0" <?php if($config_value=='0') echo 'checked="checked"';?>  /><label>否</label>

      <?php }?>

      <input type="hidden" name="input_type" id="input_type" value="<?php echo $input_type;?>"  />

      </span>     

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="config_submit" name="config_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="config_cancel" name="config_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php } else if($action=='add'){?>

    <form class="my_form" id="sysconfig_add"  accept-charset="utf-8">

    <div class="form_title">填写表单添加新的配置项目</div>

    <div class="my_form_item">

      <label class="labeltag">参数类型：</label>

      <span class="mainarea">

      <select id="config_class" name="config_class">

        <?php 

          $config_class=$this->config->item('cfg_class');

          foreach ($config_class as $index => $value) 

          echo '<option value="'.$value.'">'.$value.'</option>';

        ?>

      </select>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">参数名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" id="config_title" name="config_title" /><label>*中文名称，限12字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">代表符号：</label>

      <span class="mainarea">

      <input type="text" class="enterbox shortarea filled" id="config_name" name="config_name" /><label>*字母-数字或下划线字符串，作为变量名，不可以数字开头，限30字</label>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">相关描述：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled" id="config_description" name="config_description" /><label>*描述说明，限30字</label>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">表单模式：</label>

      <span class="mainarea">

      <select id="input_type" name="input_type">

        <option value="text" selected="selected">文本框</option>

        <option value="textarea">文本区域</option>

        <option value="radio">单项选择</option>

      </select>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">参数值：</label>

      <span class="mainarea" id="item_value">

        <input type="text" class="enterbox  keywords filled" name="config_value" id="config_value" value="" /><label>*限100字</label>

      </span> 

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="config_add_submit" name="config_add_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="config_add_cancel" name="config_add_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php } else if($action=='invalid'){?>

    <form class="my_form" id="sysconfig_add"  accept-charset="utf-8">

    <div class="form_title">进入网站项目设置</div>

    <div style="margin-left:30px;"><?php echo $invalid_infor;?></div>

    </form>

  <?php }?>



