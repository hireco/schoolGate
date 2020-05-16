<div class="body">
   <?php 
	  $index_columns=explode(',',$this->myconfig->item('index_columns'));      	  
   ?>   
   <div id="scroll_div" class="page_div">
      <div id="slides">
				<div class="slides_container">
					<?php 
					 $scroll=$this->functions->get_scroll(15);
					 if(count($scroll)) {
					   	$photos=explode(':',$scroll['photo_list']);
					    $captions=explode('|',$scroll['photo_caption']);
					    $descriptions=explode('|',$scroll['photo_description']);
					    $links=explode('|',$scroll['photo_link']);
					    foreach ($photos as $index => $value) {					   
					?> 
					 <div class="slide">
						<a href="<?php echo $links[$index];?>"  target="_blank"><img src="<?php echo site_url($value);?>" alt=""></a>
						<div class="caption">
							<p class="p1"><?php echo $captions[$index];?></p>
							<p class="p2"><?php echo $descriptions[$index];?></p>
						</div>
					 </div>
					<?php }
					  }
					?>
				</div>
				<a href="#" class="prev"><img src="<?php echo base_url().'skin/'.SKIN_NAME.'/images/';?>arrow-prev.gif"  alt="Arrow Prev"></a>
				<a href="#" class="next"><img src="<?php echo base_url().'skin/'.SKIN_NAME.'/images/';?>arrow-next.gif"  alt="Arrow Next"></a>
	       </div>
   </div>     
   <div id="latest_news" class="page_div">
     <?php 
	   if(isset($index_columns[0])) { 
	      $class_id=$index_columns[0];
          $class_attrs=$this->cms_function->get_attrs($class_id);
          $class_name=$class_attrs['class_name'];
          $class_name_en=$class_attrs['class_name_en'];		  
	 ?>
	 <div class="news_header">
	  <a  class="header_title" href="<?php echo site_url('cms/'.$class_name_en);?>"><?php echo $class_name;?></a>
	  <a class="more_items" href="<?php echo site_url('cms/'.$class_name_en);?>">更多&gt;&gt;</a>
	 </div>	 
	 <div class="news_list">
	 <?php 
	  $entry_list=$this->cms_function->cms_list_of_id($class_id,10);	
	  foreach ($entry_list as $index => $value) {
		$class_attrs=$this->cms_function->get_attrs($value['class_id']);
		$cur_class= $class_attrs['class_name'];
		$cur_class_en= $class_attrs['class_name_en'];
		
		$style=$this->cms_function->title_style($value['title_color'],$value['title_strong']);

		echo '<div class="entry">';
		echo '<a title="'.$cur_class.'" class="entry_class" href="'.site_url('cms/'.$cur_class_en).'">['.$this->str_func->cn_substr($cur_class,4).']</a>';
		echo '<a '.$style.' title="'.$value['cms_title'].'" class="entry_self" href="'.site_url('article/'.$value['cms_title_en']).'">&nbsp;&nbsp;'.$value['cms_title'].'</a>';
		echo '<span class="entry_time">'.date('m-d H:i',$value['post_time']).'</span>';
		echo '</div>';
	  }
     ?>
	 </div>
	 <?php } ?>
   </div>
   <div class="clear-both"></div>
   <div id="left_column" class="page_div">    
	 <div class="pic_links">
	   <?php $this->ads_model->show_ads(4);?>
	 </div>
	 <dl class="select_links">
	     <dt>友情链接</dt>
		 <dd class="hide">
		 <?php
          $friends=$this->myquery->friend_links(); 
          foreach ($friends as $index => $value) 
		  echo '<a href="'.$value['link_url'].'">'.$value['link_title'].'</a>';
		  ?>
		</dd>
	 </dl>	 
   </div>
   <div id="right_column" class="page_div">
    <?php 
	  foreach($index_columns as $index => $value) {
	  if($index==0) continue;
	  
	  $class_id=$value;
      $class_attrs=$this->cms_function->get_attrs($class_id);
      $class_name=$class_attrs['class_name'];
      $class_name_en=$class_attrs['class_name_en'];
	?>
	  <div class="right_column_panel <?php echo $index%2==1?'odd':'even';?>">
	   <div class="news_header">
	     <a class="header_title" href="<?php echo site_url('cms/'.$class_name_en);?>"><?php echo $class_name;?></a>
	     <a class="more_items" href="<?php echo site_url('cms/'.$class_name_en);?>">更多&gt;&gt;</a>
	   </div>	 
	   <div class="news_list">
	   <?php 
		  $entry_list=$this->cms_function->cms_list_of_id($class_id,7);	
		  foreach ($entry_list as $index_i => $value_i) {
			
			$style=$this->cms_function->title_style($value_i['title_color'],$value_i['title_strong']);
		
			echo '<div class="entry">';			
			echo '<a '.$style.' title="'.$value_i['cms_title'].'" class="entry_self" href="'.site_url('cms/view/'.$value_i['index_id']).'">'.$value_i['cms_title'].'</a>';
			echo '<span class="entry_time">'.date('m-d H:i',$value_i['post_time']).'</span>';
			echo '</div>';
		  }
        ?>	   
	   </div>
	  </div>
	<?php } ?>
	  <div class="clear-both"></div>
	</div>
    <div class="clear-both"></div>
</div>
<?php 
$this->my_load->set_js_file('index');
$this->my_load->set_css_file('index');
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/my_slides.css';
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/index.css';	 
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/slides.min.jquery.js';
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/index.js';

?>


