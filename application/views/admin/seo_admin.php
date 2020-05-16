<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

  <ul>

   <li><a href="javascript:void(0);" class="selected"><span class="horizon_items seo_list">SEO列表</span></a></li>   

   <li><a href="javascript:void(0)"><span  class="horizon_items seo_add">新建SEO</span></a></li>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span  class="horizon_items  sort_by_default">SEO默认排序</span></a></li>

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

      <li class="hide">默认排序</li>

      <li class="title sort_item" id="sort_by_class">分类</li>

      <li class="title sort_item" id="sort_by_name">名称</li>      

	  <li class="title long-100 sort_item" id="sort_by_url">URL</li>

      <li class="title long-150">标题</li>

      <li class="title long-250">关键词</li>      

	  <li class="title long-250">描述</li>

	  <li class="title sort_item" id="sort_by_source">来源</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>  

    <div class="ul_tables_body">

    <?php if(is_array($seos)) foreach($seos as $index => $value){

	  $id=$index+1;

	  $source=$value['system']=='1'?'<span style="color:green;">系统</span><span class="delete_forbidden"></span>':'<span style="color:red;">附加</span><span class="delete_this"></span>';

	  echo '<ul id="'.$value['seo_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="by_class">'.$value['seo_class'].'部分</li>';

      echo '<li class="by_name">'.$value['seo_name'].'</li>';

      echo '<li class="by_url long-100" title="'.site_url($value['uri_string']).'">'.my_limiter($value['uri_string'],10).'</li>';

      echo '<li class="long-150 show_title" title="'.$value['seo_title'].'">'.my_limiter($value['seo_title'],10).'</li>'; 

	  echo '<li class="long-250 show_title" title="'.$value['seo_keywords'].'">'.my_limiter($value['seo_keywords'],18).'</li>'; 

	  echo '<li class="long-250" title="'.$value['seo_description'].'">'.my_limiter($value['seo_description'],18).'</li>';

      echo '<li class="by_source source_'.$value['system'].'">'.$source.'</li>';

	  echo '</ul>';

      echo "\n";

     }

   ?>

   </div>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">16</span>

 <?php } else if($action=='edit') { ?>

    <form class="my_form" id="addseo_edit"  accept-charset="utf-8">

	<input type="hidden" name="seo_id" id="seo_id" value="<?php echo $seo_id;?>" />

    <div class="form_title">填写表单修改参数</div>

    <div class="my_form_item">

      <label class="labeltag">标题：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" id="seo_title" name="seo_title"  value="<?php echo $seo_title;?>" /><label>*中文 标题，限20字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">关键词：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled" id="seo_keywords" name="seo_keywords"  value="<?php echo $seo_keywords;?>" /><label>*限50字,以逗号间隔</label>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag top">相关描述：</label>

      <span class="mainarea">

      <textarea class="enterbox enterarea filled" name="seo_description" id="seo_description"><?php echo $seo_description;?></textarea><label class="top">*限100字</label>

      </span>     

    </div>	

    <div class="my_form_item">

      <label class="labeltag">访问地址：</label>

      <span class="mainarea" id="item_value">

        <input type="text" class="enterbox  keywords filled" name="uri_string" id="uri_string" value="<?php echo site_url($uri_string);?>" /><label>*限100字符，必须以<?php echo base_url();?>开头</label>

      </span> 

    </div>	

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="seo_submit" name="seo_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="seo_cancel" name="seo_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php } else if($action=='add'){?>

    <form class="my_form" id="addseo_add"  accept-charset="utf-8">

    <div class="form_title">填写表单添加新的SEO项目</div>

    <div class="my_form_item">

      <label class="labeltag">项目分组：</label>

      <span class="mainarea">

      <select id="seo_class" name="seo_class">

        <?php 

          foreach ($seo_class as $index => $value)

          echo '<option value="'.$value.'">'.$value.'部分</option>';

        ?>        

      </select>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">项目名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" id="seo_name" name="seo_name" /><label>*名称，便于识别，限15字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">标题：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" id="seo_title" name="seo_title" /><label>*中文标题，限20字</label>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">关键词：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled" id="seo_keywords" name="seo_keywords" /><label>*meta-Keywords 限50字,以逗号间隔</label>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag top">摘要：</label>

      <span class="mainarea">

      <textarea class="enterbox enterarea filled" name="seo_description" id="seo_description"></textarea><label class="top">*meta-description 限100字</label>

      </span>     

    </div>	

    <div class="my_form_item">

      <label class="labeltag">访问地址：</label>

      <span class="mainarea" id="item_value">

        <input type="text" class="enterbox  keywords filled" name="uri_string" id="uri_string" value="<?php echo base_url();?>" /><label>*限100字符，必须以<?php echo base_url();?>开头</label>

      </span> 

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="seo_add_submit" name="seo_add_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="seo_add_cancel" name="seo_add_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php }?>



