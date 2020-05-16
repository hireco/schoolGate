<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($class_id);?>
</ol>

<?php
$entry_list=$this->myquery->cms_of_classes($sub_classes);
$entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);

if(count($entry_list))  {
	echo '<div class="row">';
	foreach ($entry_list as $index => $value) {
		$class_icon_image = $this->cms_function->get_attr($value['class_id'],'icon_image');
		$icon_image =  $value['icon_image']?$value['icon_image']:($class_icon_image?$class_icon_image:site_url('skin/'.SKIN_NAME.'/images/cms_image.jpg'));
		?>
		<div class="cms-list-item col-lg-8 col-md-12 col-sm-24 col-xs-24">
			<a href="<?php echo site_url('cms/view/'.$value['index_id']);?>">
				<div class="img-wrapper">
					<img class="img-responsive" src="<?php echo $icon_image;?>">
				</div>
				<div class="info-wrapper">
					<div class="info-block">
						<p class="cms-list-item-heading <?php if(time()-$value['post_time']<24*3600) echo 'new_item';?>"><?php echo $value['cms_title'];?></p>
						<p class="cms-list-item-text"><?php echo my_limiter($value['cms_description'],40);?></p>
						<p class="cms-date text-right"><em><?php echo date('m-d H:i',$value['post_time']);?></em></p>
					</div>
				</div>
				<div class="divider"></div>
			</a>
		</div>
	<?php }
	echo '</div>';
} else echo '<div class="bg-warning text-warning">暂无内容！</div>'; ?>

<?php
echo '<ul class="pagination">';
if($pages > 1)  for($i=1;$i<=$pages;$i++) {
   if($i==1 || $i==$pages || abs($i-$page_id)<4) { 
	  echo '<li'; 
	  if($i==$page_id) echo ' class="active" ';
	  echo '><a href="'.site_url('cms/'.$class_name_en.'/'.$i).'">'.$i.'</a></li>';
   }
}
echo '</ul>';
?>

<?php echo $this->cms_function->show_navi($class_id);?>
<script>
$(function(){
	$('.cms-list-item-text').each(function(){
		$(this).text($(this).text().replace(/\s/g,''));
	});
})
</script>
	
	

