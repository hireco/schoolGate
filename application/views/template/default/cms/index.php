<div class="body">
<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; 新闻信息</div>
<div class="page_div" id="article_list_left">
  <?php 
    $scroll=$this->functions->get_scroll($this->myconfig->item('cms_scroll_id'));					   
    if(count($scroll)) {
       $photos=explode(':',$scroll['photo_list']);
	   $captions=explode('|',$scroll['photo_caption']);
	   $links=explode('|',$scroll['photo_link']);
			
	   echo '<div id="album"><ul><li>';
	   foreach($photos as $index => $value) echo '<a href="'.$links[$index].'" id="photo_'.($index+1).'"><img alt="'.$captions[$index].'" src="'.$photos[$index].'"></a>';
	   echo '</li></ul>';
	   echo '<span>';
	   foreach($photos as $index => $value) echo '<a href="'.$links[$index].'">'.($index+1).'</a>';
	   echo '</span></div>';
    }
  ?>
<div class="entry_list">
  <?php 
    $entry_list=$this->myquery->cms_list(10,'','top desc,recommend desc, index_id desc');	
	foreach ($entry_list as $index => $value) {
		
		$table=$this->myconfig->cms_model($value['model_id'],'table');
		$cur_class=$this->cms_function->get_attr($value['class_id'],'class_name');
		$cur_class_en= $this->cms_function->get_attr($value['class_id'],'class_name_en');

		echo '<div class="entry"><a  title="'.$cur_class.'" class="entry_class" href="'.site_url('cms/'.$cur_class_en).'">['.$this->str_func->cn_substr($cur_class,4).']</a>';
		echo '<a title="'.$value['cms_title'].'" class="entry_self" href="'.site_url($table.'/'.$value['cms_title_en']).'">&nbsp;&nbsp;'.$value['cms_title'].'</a>';
		echo '<span class="entry_time">'.date('m-d H:i',$value['post_time']).'</span>';
		echo '</div>';
	}
   ?>
</div>
<div class="clear-both"></div>
  
<?php 
	$class_list=$this->myquery->cms_class_list(0,-1,'recommend desc');
	foreach ($class_list as $index => $value) {
		$child_entry[$value['class_id']]=$this->myquery->cms_list(8,'','top desc, recommend desc, index_id desc',$value['class_id']);
	}			
	
    $thumb_scale=$this->myconfig->item('thumb_keep_scale');
	$count=0;
	foreach ($class_list as $index => $value) { 
	 if(count($child_entry[$value['class_id']])) {
		$count++;
		$table=$this->myconfig->cms_model($child_entry[$value['class_id']][0]['model_id'],'table');
		$image_entry=$child_entry[$value['class_id']][0];
		unset($child_entry[$value['class_id']][0]);
		$icon_image=$image_entry['icon_image']?$image_entry['icon_image']:($value['icon_image']?$value['icon_image']:site_url('skin/'.SKIN_NAME.'/images/cms_image.jpg'));
	?>		
	<div class="class_list <?php if($count%2!=0) echo 'list_even';?>">
	  <div class="class_head"><span class="class_title"><?php echo $this->cms_function->get_attr($value['class_id'],'class_name');?></span><a href="<?php echo base_url().'cms/'.$value['class_name_en']; ?>" class="entry_more">更多&gt;&gt;</a></div>
	  <div class="class_body" id="body_with_image">			
		<div class="icon_image_div">
		   <div class="icon_image <?php echo $thumb_scale!='1'?'rescale':'';?>">
			  <a  class="thumb_wrapper" href="<?php echo base_url().'cms/'.$table.'/'.$image_entry['index_id'];?>"><img src="<?php echo $icon_image;?>" /></a>
		   </div>
		</div>
		
		<div class="icon_entry">
		   <div class="title"><a href="<?php echo base_url().'cms/'.$table.'/'.$image_entry['index_id'];?>"><?php echo $image_entry['cms_title'];?></a></div>
		   <div class="abstract"><a href="<?php echo base_url().'cms/'.$table.'/'.$image_entry['index_id'];?>"><?php echo my_limiter($image_entry['cms_description'],50);?></a></div>
		</div>
		
		<div class="clear-both"></div>
	 </div>			
	 <hr />			
	 <ul class="class_body">
		<?php foreach ($child_entry[$value['class_id']] as $index_i => $value_i) {
			$table=$this->myconfig->cms_model($value_i['model_id'],'table');
			echo '<li class="list_entry"><a title="'.$value_i['cms_title'].'" href="'.base_url().'cms/'.$table.'/'.$value_i['index_id'].'">'.$value_i['cms_title'].'</a><span class="entry_time">'.date('d H:i',$value_i['post_time']).'</span></li>';
		}
		?>
	 </ul>
   </div>
  <?php
    if($count%2==0) echo '<div class="clear-both"></div>';
	}
   }
?>
</div>
<div class="page_div" id="article_list_right">
  <?php $this->ads_model->show_ads(2);?>
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('cms');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/cms.js';
$this->my_load->set_css_file('cms');
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/cms.css';
?>
