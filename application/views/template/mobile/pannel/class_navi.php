<?php if($navi_list) { ?>
<nav class="navbar navbar-default navbar-inverse" role="navigation" id="class_nav">
   <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse"
         data-target="#class-navbar-collapse">
         <span class="sr-only">选择分类</span>
         <span class="icon-bar"></span>
         <span class="icon-bar"></span>
         <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">相关分类</a>
   </div>
   <div class="collapse navbar-collapse" id="class-navbar-collapse">
      <ul class="nav navbar-nav">
		 <?php 
		   foreach($navi_list as $index => $value) { 
			  $children=$this->myquery->cms_class_list(0,$value['class_id']);
			  
			  echo '<li class="dropdown"><a href="'.site_url('cms/'.$value['class_name_en']).'"'; 
			  if($children) echo 'class="dropdown-toggle" data-toggle="dropdown"';
			  echo '>'.$value['class_name'];			  
			  
			  if($children) echo '<b class="caret"></b>';
			  echo '</a>';

			  if($children) echo '<ul class="dropdown-menu">';
		      
			  foreach($children as $index_i => $value_i) { 
				  echo '<li><a href="'.site_url('cms/'.$value_i['class_name_en']).'">'.$value_i['class_name'].'</a></li>';
			  }

			  if($children) echo '</ul>';

			  echo '</li>';
			}
		 ?>
      </ul>
   </div>
</nav>
<?php } ?>
