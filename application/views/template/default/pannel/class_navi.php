<?php if($navi_list) { ?>
<div class="navibar menu_unique">
   <div class="navi_top"><?php echo $top_title;?></div>
   <div class="navi_body">
   <?php 
	   foreach($navi_list as $index => $value) {		 
   	     echo '<div class="navi_list"><a class="navi_link';
		 if($current_id==$value['class_id']) echo ' current';
		 echo '" href="'.site_url('cms/'.$value['class_name_en']).'">'.$value['class_name'].'</a></div>';

		 $children=$this->myquery->cms_class_list(0,$value['class_id']);

		 foreach($children as $index_i => $value_i) { 
			 
   	        echo '<div class="navi_list"><a class="navi_link navi_sub';
			if($current_id==$value_i['class_id']) echo ' current';
			echo '" href="'.site_url('cms/'.$value_i['class_name_en']).'">'.$value_i['class_name'].'</a></div>';
		 
		 }
	  }
   ?>
   </div>
</div>
<?php } ?>
