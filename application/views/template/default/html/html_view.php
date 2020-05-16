<?php 
   $cn_group=$this->html_model->cn_groups[$group_id];
   $group= $this->html_model->groups[$group_id];
?>
<div class="body">

<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <a href="<?php echo site_url('html/list/'.$group);?>"><?php echo $cn_group;?></a>  &gt; <?php echo $cn_title;?></div>
 
 <div class="page_div" id="sidebar">
   
   
   
   <div class="title_link menu_unique">
   <span class="top_tag"><?php echo $cn_group?></span>
   <?php $html_list=$this->myquery->html_list();
         foreach($html_list as $index => $value) {
           echo '<span class="top';
		   if($en_title==$value['en_title']) echo ' current ';
		   echo '"><a href="'.site_url('html/'.$value['en_title']).'" ';        
		   echo '>'.$value['cn_title'].'</a></span>';
         }
   ?>
   </div>
   
   <?php $this->ads_model->show_ads(2);?>
 
 </div>

 <div class="page_div" id="mainbar_view">
   <div class="part_header">
      <div class="name"><?php echo $cn_title;?></div>
   </div>
   <div class="part_body">
   <?php echo $html_content;?>
   </div>
 </div>

 <div class="clear-both"></div>

</div>
<?php
  $this->my_load->set_js_file('html');
  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/html.js'; 
  $this->my_load->set_css_file('html');
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/html.css';
?>
