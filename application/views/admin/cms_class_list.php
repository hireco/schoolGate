<?php if($action=='index') { ?>

<div id="workplace_inner">

  <div id="clist_data"><?php echo $clist;?></div>
  
  <div class="edit"></div>

</div>

<?php } else if($action=='clist') {?>

  <div class="horizon_navi">

   <ul>
	<li><a href="javascript:void(0);" class="selected"><span id="class_list" class="horizon_items">分类列表</span></a></li>
    <li><a href="javascript:void(0);"><span id="cascade" class="horizon_items">分类结构</span></a></li>
	<li><a href="javascript:void(0);"><span id="new_class" class="horizon_items">新建分类</span></a></li>

   </ul>   

  </div>

  
  <div class="ul_tables">

    <ul class="table"   style="padding-top:0pt;">

      <li class="id title">编号</li>

      <li class="title">分类ID</li>

      <li class="title long-100">分类名称</li>

	  <li class="title long-120">内容模型</li>

	  <li class="title long-100">上级分类</li>

      <li class="title long">关键字</li>

      <li class="title long">描述</li>

      <li class="title">内容统计</li> 
	  
	  <li class="title">显示</li> 

	  <li class="hide">访问地址</li>

    </ul>  

    <?php if(is_array($classes)) foreach($classes as $index => $value){

      $model=array();

      $model_id=explode(',',$value['model_id']);

      foreach($model_id as $i => $j) {

         $model[]=$this->myconfig->cms_model($j,'name');	

      }	

	  $id=$index+1;
	  
	  $hide=$value['class_hide']?'<span style="color:red;">×</span>':'<span style="color:green;">√</span>';

      echo '<ul title="'.$value['class_name'].'" id="'.$value['class_id'].'_table" class="table ';

      echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="by_class">'.$value['class_id'].'</li>';

      echo '<li class="long-100" id="'.$value['class_id'].'_class_name">'.$value['class_name'].'</li>';

      echo '<li class="long-120">'.implode('、',$model).'</li>';

      echo '<li id="parent_'.$value['parent_id'].'" class="long-100">'.$this->cms_model->get_attr($value['parent_id'],'class_name').'</li>';

	  echo '<li class="long show_title" title="'.$value['class_keywords'].'">'.my_limiter($value['class_keywords'],9).'</li>';

      echo '<li class="long show_title" title="'.$value['class_description'].'">'.my_limiter($value['class_description'],9).'</li>';

      echo '<li class="cms_num">0</li>';
	  
	  echo '<li>'.$hide.'</li>';

	  echo '<li class="hide  by_address">'.site_url('cms/list/'.$value['class_id']).'</li>';

      echo '</ul>';

      echo "\n";

     }
	  
   ?>

    <div class="clear_both"></div>

    <input type="hidden" name="id_to_delete" id="id_to_delete" value="0">     

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">20</span>

<?php } else if($action=='cascade') { ?>
   
   <div class="my_form">
     <div class="form_title">内容分类结构图</div>
	 <ul class="class_cascade"><?php echo $cascade;?></ul>
	 <div class="my_form_item button_row">
	  <label class="labeltag"><a style="color:blue;text-decoration:underline;" href="javascript:void(0);" id="class_cancel">返回分类列表</a></label>
     </div>
   </div>

<?php } ?>



