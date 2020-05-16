<?php if($navi_type=='mb-main') { ?>
	<ul class="list-unstyled">
		<li><a class="top-nav" href="<?php echo base_url();?>"><span class="glyphicon glyphicon-home"></span> 首页</a></li>
		<?php
		foreach($top_navi_list as $index => $value) {
			$target=$value['navi_target']=='s'?'_self':'_blank';

			echo '<li class="'.(!$index?'index':'').'">';
			echo '<a class="top-nav" target="'.$target.'" href="'.$value['navi_url'].'">'.$value['navi_title'].'</a>';

			if($sub_navi_list[$index]) echo '<ul class="list-unstyled">';

			foreach($sub_navi_list[$index] as $index_i => $value_i) {
				echo '<li><a class="sub-nav" target="'.$target.'" href="'.$value_i['navi_url'].'">'.$value_i['navi_title'].'</a></li>';
			}

			if($sub_navi_list[$index]) echo '</ul>';

			echo '</li>';
		}
		?>
	</ul>
<?php } ?>
