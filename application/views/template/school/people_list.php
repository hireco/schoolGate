<div class="body">
<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <a href="<?php echo site_url('people');?>">师资队伍</a>
<?php if($title_id)  echo '&gt; <a href="'.site_url('people/list/'.$people_title).'">'.$people_title_cn.'</a>'; ?>
</div>
<div class="page_div" id="sidebar">	      
   
   <div class="title_link menu_unique">
   <div class="link_head">分类导航</div>
   <div class="link_body">
   <?php  
	  echo '<a class="top'; 
      if(!$title_id) echo ' current';
      echo '" href="'.site_url('people').'" >全部类型</a>';

	  foreach($this->people_model->groups as $index => $value) {

           echo '<a class="top" href="'.site_url('people/group/'.$index).'">'.$this->people_model->groups[$index][0].'</a>';

		   foreach($this->people_model->groups[$index][1] as $index_i => $value_i) {
		   	  echo '<a class="sub';
			  if($title_id==$value_i) echo ' current ';
			  else if(!in_array($title_id,$this->people_model->groups[$index][1])) echo ' hide ';
			  echo '" href="'.site_url('people/list/'.$this->people_model->titles[$value_i]).'" ';            
              echo '>'.$this->people_model->cn_titles[$value_i].'</a>';  		   
		   }
         }
   ?>
   </div>
   </div>
</div>
<div class="page_div" id="mainbar"> 
  <div class="part_header">
    <div class="name"><?php echo $people_title_cn?>列表</div>
  </div>
  <div class="part_body">    
	 <?php 
	 if(!$title_id){
	   echo '<div class="ucfirst_list">';
	   for($i=65;$i<91;$i++) 
	   echo '<a href="#'.chr($i).'_list">'.chr($i).'</a>';
	   echo '</div>';
     }	 
	 echo ' <div id="people_list">';
	 foreach ($people as $index => $value) {
       echo '<span class="person_link hide"><a class="'.substr(ucfirst($value['en_id']),0,1).'" href="'.site_url('people/'.$value['en_id']).'">'.$value['cn_name'].'</a></span>';
     }
	 echo '</div>';
	?>
  </div>    
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('people');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/people.js';
$this->my_load->set_css_file('people_list');
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/people.css';
?>
