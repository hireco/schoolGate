<div class="body">
 <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <?php echo $cn_group;?></div>
 
 <div class="page_div" id="sidebar">
   
   
   
   <div class="navibar menu_unique">
   <div class="navi_top">分类列表</div>
   <div class="navi_body">
   <?php $html_list=$this->myquery->html_list();
         foreach($this->html_model->groups as $index => $value) {
            echo '<div class="navi_list"><a class="navi_link';
		    if($cn_group==$value) echo ' current';
		    echo '" href="'.site_url('html/list/'.$value).'">'.$this->html_model->cn_groups[$index].'</a></div>';
         }
   ?>
   </div>
   </div>
   
   <?php $this->ads_model->show_ads(2);?>
 
 </div>
 <div class="page_div" id="mainbar_list"> 
   <div class="class_head">
	<span class="class_title"><?php echo $cn_group; ?></span>
   </div>	
   <div class="class_body">
   <?php 
	$entry_list=$this->myquery->html_list(0,$group_id);
	$entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);
	
	foreach ($entry_list as $index => $value) {
		echo '<div class="list_entry"><a href="'.site_url('html/'.$value['en_title']).'">'.$value['cn_title'].'</a><span class="entry_time">'.date('m-d H:i',$value['post_time']).'</span></div>';
	}
   ?>
   </div>

   <?php 
    echo '<div class="page_navigation"><span>每页'.$per_page_num.'条</span><span>共'.$rows.'条</span><span>'.$page_id.'/'.$pages.'</span>';
    if($pages > 1)  for($i=1;$i<=$pages;$i++) {
       if($i==1 || $i==$pages || abs($i-$page_id)<4) { 
       	  echo '<a href="'.site_url('html/list/'.$group.'/'.$i).'"';
          if($i==$page_id) echo 'class="current"';
          echo '>'.$i.'</a>';
       }
    }
    echo '</div>';
    
   ?>
 </div>

 <div class="clear-both"></div>

</div>
<?php
  $this->my_load->set_js_file('html');
  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/html.js'; 
  $this->my_load->set_css_file('html');
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/html.css';
?>
