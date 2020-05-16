<ul class="list-unstyled">
	<li><a class="top-nav" href="<?php echo base_url();?>"><span class="glyphicon glyphicon-home"></span> 导航</a></li>
	<li><a class="top-nav" href="<?php echo site_url('people'); ?>">师资力量</a></li>
	<?php
	$top_classes=$this->myquery->cms_class_list(9,0);
	foreach ($top_classes as $index => $value) {
		$sub_classes=$this->myquery->cms_class_list(0,$value['class_id']);

		echo '<li><a class="top-nav" href="#">'.$value['class_name'].'</a>';

		if($sub_classes) echo '<ul class="list-unstyled">';

		foreach($sub_classes as $index_i => $value_i) {
			echo '<li><a class="sub-nav" href="'.site_url('cms/'.$value_i['class_name_en']).'">'.$value_i['class_name'].'</a></li>';
		}

		if($sub_classes) echo '</ul>';

		echo '</li>';
	}
	?>
</ul>