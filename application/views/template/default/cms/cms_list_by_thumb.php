<div class="body">

<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a><?php echo $this->cms_function->get_current_path($class_id);?></div>
<div class="page_div" id="thumb_list">
<?php 	
	echo '<div class="list_title">'.$class_name.'</div>';
    echo '<div class="class_body">';

    $thumb_scale=$this->myconfig->item('thumb_keep_scale');	
	$entry_list=$this->myquery->cms_of_classes($sub_classes,0);
	$entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);
	
	foreach ($entry_list as $index => $value) {
		$table=$this->myconfig->cms_model($value['model_id'],'table');
		echo '<div class="photo_item"><div class="photo_icon ';
		if($thumb_scale!='1')  echo 'rescale';
		echo '"><a class="img_insert thumb_wrapper" href="'.site_url($table.'/'.$value['cms_title_en']).'"><img src="'.$value['icon_image'].'" /></a></div><div class="img_title"><a href="'.site_url($table.'/'.$value['cms_title_en']).'">'.$value['cms_title'].'</a></div></div>';
	}
   
    echo '<div class="clear-both"></div></div><div class="clear-both"></div>';

    echo '<div class="page_navigation"><span>每页'.$per_page_num.'条</span><span>共'.$rows.'条</span><span>'.$page_id.'/'.$pages.'</span>';
    if($pages > 1)  for($i=1;$i<=$pages;$i++) {
       if($i==1 || $i==$pages || abs($i-$page_id)<4) { 
       	  echo '<a href="'.site_url('photo/list/'.$class_name_en.'/'.$i).'"';
          if($i==$page_id) echo 'class="current"';
          echo '>'.$i.'</a>';
       }
    }
    echo '</div>';
    
?>
</div>

<div class="page_div" id="thumb_list_right">
   
    <?php echo $this->cms_function->show_navi($class_id);?>
   <?php $this->ads_model->show_ads(2);?>
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('photo_list');
$this->my_load->set_css_file('photo_list'); 
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/thumb_list.css';
?>
