<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">人员列表</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items add_people">添加人员</span></a></li>

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

      <li class="title long-80">姓名</li>
	  
	  <li class="title long-150">英文姓名</li>

      <li class="title">性别</li>	  

      <li class="title long-100">头衔/职称</li>

      <li class="title long-100">最高学位</li>

      <li class="title">年龄</li>

      <li class="title long-100">对应用户</li>

      <li class="title">锁定</li>

      <li class="title">显示</li>

    </ul>  

    <?php if(is_array($people)) foreach($people as $index => $value){

	  

      $id=$index+1;

      $gender=$value['gender']?($value['gender']=='m'?'男':'女'):'';
	  $title= $this->people_model->cn_titles[$value['title_id']];
	  $degree= $this->people_model->degrees[$value['degree']];
	  $age=$value['born_year']?(int)date('Y',time())-(int)$value['born_year']:'';

	  $locked=$value['locked']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';
	  $hide=$value['hide']?'<span style="color:red;">×</span>':'<span style="color:green;">√</span>';	 

	  echo '<ul id="'.$value['people_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

	  if($value['locked']=='1')   echo ' locked';

	  if($value['hide']=='1')   echo ' hidden';

	  

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['people_id'].'" /></li>';	

      echo '<li class="long-80">'.$value['cn_name'].'</li>';
      
	  echo '<li class="long-150">'.$value['en_name'].'</li>';

	  echo '<li>'.$gender.'</li>'; 

	  echo '<li class="long-100">'.$title.'</li>';

	  echo '<li class="long-100">'.$degree.'</li>';

      echo '<li>'.$age.'</li>';

      echo '<li class="long-100">'.$value['user_name'].'</li>';

      echo '<li class="locked_'.$value['people_id'].'">'.$locked.'</li>';

      echo '<li class="hide_'.$value['people_id'].'">'.$hide.'</li>';

	  echo '</ul>';

      echo "\n";

     }

   ?>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>
  <span id="pagination_num" class="hide">20</span>
 <?php } ?>

