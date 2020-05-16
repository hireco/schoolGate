<?php if($action=='index') { ?>
<div id="workplace_inner">
  <div class="list">  
   <div id="clist_data"><?php echo $list_data;?></div>
  </div>
  <div class="edit"></div>
</div>
<?php } else if($action=='tlist') { ?> 
 <div class="horizon_navi">

   <ul>
	<li><a href="javascript:void(0);" class="selected"><span id="navi_list" class="horizon_items">导航条列表</span></a></li>
	<li><a href="javascript:void(0);"><span id="new_navi" class="horizon_items">添加导航条</span></a></li>
   </ul>  
  </div>
  
  <div class="ul_tables">

    <ul class="table"   style="padding-top:0pt;">

      <li class="id title">编号</li>

      <li class="title long-120">导航编号</li>
	  <li class="title long-120">导航名称</li>
    </ul>  

    <?php if(is_array($navi_types)) foreach($navi_types as $index => $value){

	  $id=$index+1;	 

      echo '<ul title="'.$value['navi_type'].'" id="'.$value['navi_type'].'_table" class="table ';

      echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="long-120">'.$value['navi_type'].'</li>';
	  
	  echo '<li class="long-120">'.$value['navi_name'].'</li>';
      
	  echo '</ul>';

      echo "\n";

     }
	  
   ?>

    <div class="clear_both"></div>

    <input type="hidden" name="id_to_delete" id="id_to_delete" value="0">     

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">20</span>
<?php } else if($action=='clist') {
  if($this->myconfig->item('navigation')) {
 ?>
  <div class="my_form">
   
   <div class="form_title"><?php echo !$navi_list?'尚未设置导航，这是系统默认导航':'当前导航条：'.$navi_name;?></div>
   <input type="hidden" name="id_to_delete" id="id_to_delete" value="0">
   <input type="hidden" id="navi_type" value="<?php echo $navi_type;?>" />

   <ul class="navi_admin <?php echo !$navi_list?'navi_is_default':'';?>">
<?php
 if($navi_list)   
      echo $this->navi_model->navi_cascade($navi_type,0); 
 else {												  	  
	  
	  echo '<li class="no_sub allmenu" id="navi_index"><span><a href="'.base_url().'">首页</a><label class="target hide">s</label></span></li>';
	  
	  echo $this->navi_model->class_cascade(0);
	 
	  echo '<li class="with_sub allmenu" id="navi_people"><span><a href="'.site_url('people').'">师资力量</a><label class="target hide">s</label></span></li>';
	  echo '<li class="with_sub allmenu" id="navi_publication"><span><a href="'.site_url('publication').'">论文专著</a><label class="target hide">s</label></span>';
	  
	  echo '<li class="submenu_list hide">';  

		   echo '<ul class="submenu" id="navi_people_list">';
		   
		   foreach($this->people_model->groups as $index => $value)

		   echo '<li class="allmenu no_sub" id="navi_people-'.$index.'"><span><a href="'.site_url('people/group/'.$index).'">'.$this->people_model->groups[$index][0].'</a><label class="target hide">s</label></span></li>';
		   
		   echo '</ul>';
			 
		   echo ' <ul class="submenu" id="navi_publication_list">';
		   $cur_year=date('Y',time());
		   $year_back=$this->publication_model->year_back;
		   for($i=$cur_year; $i>$cur_year-$year_back; $i--) 
			  echo '<li class="allmenu no_sub" id="navi_publication-'.$i.'"><span><a href="'.site_url('publication/'.$i).'">'.$i.'年度</a><label class="target hide">s</label></span></li>';
		   echo '</ul>';

	   echo '</li>';
	   
	   
     }
	?>
  </ul>
 
  <div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea multiple_button">  
	   <input type="button" class="my_button hide" id="multiple_navi_submit" name="multiple_navi_submit" value="确认后，提交！" />
       <input type="button" class="my_button hide" id="multiple_navi_cancel" name="multiple_navi_cancel" value="取消" />
	   <input type="button" class="my_button" id="add_navi" name="add_navi" value="添加菜单项" />      
	   <input type="button" class="my_button" id="edit_navi" name="edit_navi" value="编辑菜单项" />    
       <input type="button" class="my_button" id="delete_navi_items" name="delete_navi_items" value="清空菜单项" />
      </span>
	  
	  <?php 
        $data['mylist']=array('edit','goup','godown','delete');
	    $this->load->view('pannel/context_menu',$data);
      ?>

    </div>
   </div>
  <?php } else { ?>
  <div class="my_form">
   <div class="form_title">导航设置</div>
   <div style="margin-left:20px;">
     <span>当前没有启用自定义导航功能，是否现在启用？ </span>
     <a href="<?php echo site_url($this->config->item('admin_dir').'/sys_config/http_edit/navigation')?>">点击启用</a>
   </div>
   </div>

<?php } 
  } else if($action=='edit'){
?>
  <form class="my_form" id="navi_form" accept-charset="utf-8">

    <div class="form_title"><?php echo $add_or_edit=='add'?'填写表单，以增加新的菜单':'编辑已有菜单'?></div>   
	
	<div class="my_form_item">

      <label class="labeltag">菜单名称</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="navi_title" id="navi_title" value="<?php echo isset($navi_title)?$navi_title:'';?>" />

      <input type="hidden"  id="add_or_edit" class="filled" name="add_or_edit" value="<?php echo isset($add_or_edit)?$add_or_edit:'add';?>" />

      <input type="hidden"  id="navi_id" name="navi_id" value="<?php echo isset($navi_id)?$navi_id:'';?>" />

	  <label>*填入菜单名称，例如”机构介绍”，最多10个汉字</label>

      </span>     

    </div>
	
	<div class="my_form_item">

      <label class="labeltag">英文ID</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="navi_title_en" id="navi_title_en" value="<?php echo isset($navi_title_en)?$navi_title_en:'';?>" />

	  <label>*填入英文或者拼音，例如”introduction”,不超过40个字母，禁止空格</label>

      </span>     

    </div>

	<div class="my_form_item">

      <label class="labeltag">链接形式</label>

      <span class="mainarea">
		  <select name="obj_type" id="obj_type">
		  <?php 
		  
		  $obj_types=$this->navi_model->obj_types;

          foreach ($obj_types as $index => $value) { 

            echo '<option value="'.$index.'"'; 
			
            if(isset($obj_type) && $index==$obj_type) echo ' selected="selected" ';

            echo '>'.$value.'</option>';

          }

        ?>
		  </select>    
      </span>      

    </div>

	<div class="my_form_item">

      <label class="labeltag">链接地址</label>

      <span class="mainarea">

      <input type="text" class="enterbox jump_url" name="navi_url" id="navi_url" <?php echo isset($obj_type)? ($obj_type!='0'?'disabled="disabled"':''):''; ?> value="<?php echo isset($navi_url)?$navi_url:'';?>" />
	  <label>*标准的URL地址，带http://,留空则无链接</label>

      </span>

    </div>

    <div class="my_form_item">

      <label class="labeltag">打开方式</label>

      <span class="mainarea">

      <input type="radio" name="navi_target" id="navi_target_s" value="s" <?php echo isset($navi_target)?($navi_target=='s'?'checked="checked"':''):'checked="checked"' ?> /><label>原窗口</label>
	  <input type="radio" name="navi_target" id="navi_target_b" value="b" <?php echo isset($navi_target)?($navi_target=='b'?'checked="checked"':''):'' ?> /><label>新窗口</label>

      </span>      

    </div>	

	<div class="my_form_item">

      <label class="labeltag">上级菜单ID</label>

      <span class="mainarea">
	  
	  <input type="input" class="enterbox numarea" name="parent_id" id="parent_id" disabled="disabled" value="<?php echo isset($parent_id)?$parent_id:''; ?>" />
	  <input type="button" class="my_button" id="select_parent" value="点击选择">
	  <input type="button" class="my_button" id="cancel_parent" value="取消上级">
	  <label>所属上级菜单的ID,不填则为顶级</label>
      </span>      

    </div>
	
	<div class="my_form_item">

      <label class="labeltag">优先级</label>

      <span class="mainarea">

      <input type="input" class="enterbox filled numarea" name="navi_priority" id="navi_priority" value="<?php echo isset($navi_priority)?$navi_priority:''; ?>" /><label>*数字越小优先级越高</label>

      </span>      

    </div>
	
	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea multiple_button">

      <input type="button" class="my_button" id="single_navi_submit" name="single_navi_submit" value="确认后，提交！" />

      <input type="button" class="my_button" id="single_navi_cancel" name="single_navi_cancel" value="取消" />
	  
	  <input type="hidden" id="navi_type" value="<?php echo $navi_type;?>" />
      
	  </span>

    </div>

   </form>
 <?php } else if($action=='new') { ?>
 <form class="my_form" id="new_navi_form" accept-charset="utf-8">

    <div class="form_title">新增导航条</div>   
	
	<div class="my_form_item">

      <label class="labeltag">导航名称</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="navi_name" id="navi_name" value="" />

      <label>*填入导航名称，例如”首页顶部导航”，最多10个汉字</label>

      </span>     

    </div>
	
	<div class="my_form_item">

      <label class="labeltag">英文ID</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled" name="navi_type" id="navi_type" value="" />

	  <label>*填入英文或者数字，例如”main”,不超过10个字母，禁止空格、下划线</label>

      </span>     

    </div>
	
	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea multiple_button">

      <input type="button" class="my_button" id="new_navi_submit" name="new_navi_submit" value="确认后，提交！" />

      <input type="button" class="my_button" id="new_navi_cancel" name="new_navi_cancel" value="取消" />
      
	  </span>

    </div>

   </form>
 <?php } ?>
 



