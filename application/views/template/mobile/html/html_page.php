<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($class_id);?>
</ol>

<div class="page-header">
	<h4><?php echo $cn_title; ?></h4>
</div>

<div class="cms_content">
	   <?php echo $html_content;?>
</div>

<?php echo $this->cms_function->show_navi($class_id);?>

<script>
$(document).ready(function() {	
	
	$('.cms_content img').each(function(i){
	     $(this).closest('table').after('<div class="cms_images" style="padding:5px;"></div>');
	});

	$('.cms_content img').each(function(i){
		 $('.cms_images').eq(i).append($(this).clone().addClass('carousel-inner img-responsive img-rounded'));
	});
	
	$('.cms_content img').closest('table').remove();

	$('.cms_content table').find('*').removeAttr('width style border hspace');
	$('.cms_content table').removeAttr('width style cellspacing').attr('border','0').attr('cellpadding','0').addClass('table').wrap('<div class="table-responsive"></div>');

	$('.table-responsive').before('<div class="visible-xs alert alert-info alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>左右滑动以查看表格</div>');

});
</script>
