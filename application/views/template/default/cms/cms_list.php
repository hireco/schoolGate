<div class="body">

<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a><?php echo $this->cms_function->get_current_path($class_id);?></div>

<?php   	
	echo '<div class="page_div" id="article_list_left">'; 
	echo '<div class="class_head">';
	echo '<span class="class_title">'.$class_name.'</span>';
	if($class_level>2) { //对于深层分类，导航显示在列表上方
		$class_list=$this->myquery->cms_class_list(0,$class_id);
        foreach ($class_list as $index => $value)
        echo '<a class="child_class" href="'.site_url('cms/'.$value['class_name_en']).'"><span>'.$value['class_name'].'</span></a>';
	}
	echo '</div>';
		
	echo '<div class="class_body">';	
	$entry_list=$this->myquery->cms_of_classes($sub_classes);
	$entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);
	
	foreach ($entry_list as $index => $value) {
		$table=$this->myconfig->cms_model($value['model_id'],'table');
		echo '<div class="list_entry"><a href="'.base_url().'cms/'.$table.'/'.$value['index_id'].'">'.$value['cms_title'].'</a><span class="entry_time">'.date('m-d H:i',$value['post_time']).'</span></div>';
	}
	echo '</div>';

	echo '<div class="page_navigation"><span>每页'.$per_page_num.'条</span><span>共'.$rows.'条</span><span>'.$page_id.'/'.$pages.'</span>';
	if($pages > 1)  for($i=1;$i<=$pages;$i++) {
	   if($i==1 || $i==$pages || abs($i-$page_id)<4) { 
		  echo '<a href="'.site_url('cms/'.$class_name_en.'/'.$i).'"';
		  if($i==$page_id) echo 'class="current"';
		  echo '>'.$i.'</a>';
	   }
	}
	echo '</div>';

	echo '</div>'; 
 ?>
<div class="page_div" id="article_list_right">
   
    <?php echo $this->cms_function->show_navi($class_id);?>
   <?php $this->ads_model->show_ads(2);?>
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('cms_list');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/cms_list.js';
$this->my_load->set_css_file('cms_list');
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/cms_list.css';
?>
