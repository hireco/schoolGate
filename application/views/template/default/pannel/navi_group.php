<?php if($navi_type=='main') { ?>

   <ul class="navi">   
   <li class="left"></li>
   <li class="center">        
	   <?php 
        foreach($top_navi_list as $index => $value) { 
          $target=$value['navi_target']=='s'?'_self':'_blank';	
		  echo '<a target="'.$target.'"';
		  echo ' id="'.$value['navi_title_en'].'_navi"';
		  if(!$index) echo ' class="first" style="color:gold;"';
	      echo ' href="'.$value['navi_url'].'">'.$value['navi_title'].'</a>';
		}
       ?>       
   </li>   
   <li class="right"></li>
  </ul>
  
  <div class="navi_bottom">
    <div class="left_bar"></div>
    <div class="navi_bottom_div">
	<?php 
	  foreach($top_navi_list as $index => $value) {	
	   if($sub_navi_list[$index]) {
		  echo '<ul class="navi_bottom_link '; 
	      if($index) echo 'hide';
		  echo '" id="'.$value['navi_title_en'].'_sub">';
	   }
	   foreach($sub_navi_list[$index] as $index_i => $value_i) {
         echo '<li><a href="'.$value_i['navi_url'].'" >'.$value_i['navi_title'].'</a></li><li class="inter"></li>';
	   }
	  if($sub_navi_list[$index]) echo '</ul>';
     }
	?>
    </div>
    <div class="right_bar"></div>
  </div>

   
<?php } ?>
