<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a><?php echo $this->cms_function->get_current_path($class_id);?></div>
  <div class="page_div" id="cms_left" >
    <div class="title"><?php echo $cn_title;?></div>
    
	<div class="content">
     <?php echo $html_content;?>
    </div>

  </div>
  <div class="page_div" id="cms_right">
   
   <?php echo $this->cms_function->show_navi($class_id);?>
   <?php $this->ads_model->show_ads(31);?>
  </div> 
 <div class="clear-both"></div>
</div>
<?php
  $this->my_load->set_js_file('page');
  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/page.js'; 
  $this->my_load->set_css_file('page');
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/page.css';
?>
