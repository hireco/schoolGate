<?php if($navi_type=='main') { 
	
	 foreach($top_navi_list as $index => $value) { 
       $target=$value['navi_target']=='s'?'_self':'_blank';		   
	   echo '<li class="topmenu '.(!$index?'index':'').'"><a target="'.$target.'"';
	   echo ' href="'.$value['navi_url'].'">'.$value['navi_title'].'</a>';
	   if($sub_navi_list[$index]) echo ' <ul class="submenu">';
	   foreach($sub_navi_list[$index] as $index_i => $value_i) {
		 $target=$value_i['navi_target']=='s'?'_self':'_blank';
	     echo '<li><a target="'.$target.'" href="'.$value_i['navi_url'].'">'.$value_i['navi_title'].'</a></li>';     
	   }
       if($sub_navi_list[$index]) echo ' </ul>';
	   echo '</li>';
   }
   
 } ?>
