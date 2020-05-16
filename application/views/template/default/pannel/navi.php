<?php if($navi_list) { ?>
<div class="navibar menu_unique hide">
   <div class="navi_top"><?php echo $top_title;?></div>
   <div class="navi_body">
   <?php 
	  foreach($navi_list as $index => $value) {
		 $target=$value['navi_target']=='s'?'_self':'_blank';
   	     echo '<div class="navi_list"><a class="navi_link';
		 if($current_id==$value['navi_id']) echo ' current';
		 echo '" target="'.$target.'" href="'.$value['navi_url'].'">'.$value['navi_title'].'</a></div>';

		 $children=$this->myquery->navi_list(0,$value['navi_id']);

		 foreach($children as $index_i => $value_i) { 
			 
			$target=$value_i['navi_target']=='s'?'_self':'_blank';
   	        echo '<div class="navi_list"><a class="navi_link navi_sub" target="'.$target.'" href="'.$value_i['navi_url'].'">'.$value_i['navi_title'].'</a></div>';
		 
		 }
	  } 
   ?>
   </div>
</div>
<?php } ?>
