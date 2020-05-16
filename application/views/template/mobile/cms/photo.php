<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($index['class_id']);?>
</ol>

<div class="page-header cms_title">
	<h4><?php echo $index['cms_title']?></h4>
</div>

<div class="cms_content">
  <?php echo $content['introduction']?strip_tags($content['introduction']):'暂无内容'; ?>
</div>

<div id="masonry-container" class="js-masonry row" data-masonry-options='{ "columnWidth": ".img_list_item", "itemSelector": ".img_list_item" }'>
	<?php
	if($content['photo_list']) {

		$photo_list=explode(':',$content['photo_list']);
		$photo_title=explode(':',$content['photo_title']);
		echo '<div class="img_list">';
		foreach ($photo_list as $index_i => $value_i) {
			echo '<div class="img_list_item col-xs-12 col-sm-8 col-md-6 col-lg-4"><div class="thumbnail">';
			echo '<a class="swipebox" href="'.$value_i.'"><img class="carousel-inner img-responsive " src="'.$value_i.'" /></a>';
			echo '<div class="caption">';
			echo '<p>'.$photo_title[$index_i].'</p>';
			echo '</div>';
			echo '</div></div>';
		} echo '</div>';
	} else echo $this->functions->msg4nullcontent();
	?>
</div>

<hr>

<ul class="list-unstyled cms-info-list">
    <li>时间：<?php echo date('Y-m-d H:i:s',$index['post_time'])?></li>
    <li>点击：<?php echo $index['read_times']?>次</li>
	<li>标签：<?php  $tags=explode(',',str_replace('，',',',$index['cms_keywords'])); foreach($tags as $index => $value) {
	     echo '<span class="label label-default">'.$value.'</span> ';
	}?>
	</li>
</ul>


<script>
	$(function() {

		var $container = $('#masonry-container');
		// initialize Masonry after all images have loaded
		$container.imagesLoaded( function() {
			$container.masonry();
		});

		$( '.swipebox' ).swipebox();

	});
</script>
<?php
$this->my_load->set_js_file('photo');
//$this->my_load->set_css_file('photo'); //image path in css file can not be automatically changed
$this->my_load->js_inc_t[]='js/masonry/masonry.pkgd.min.js';
$this->my_load->js_inc_t[]='js/imagesloaded/imagesloaded.pkgd.min.js';
$this->my_load->js_inc_t[]='js/swipebox-master/js/jquery.swipebox.min.js';
$this->my_load->css_inc[]='js/swipebox-master/css/swipebox.min.css';
$this->my_load->css_ins[]=<<<EOF
<style>
	body{
		background-color:#000; 
		color:#777;
	} 
	.page-header{
		border-bottom-color:#777;
	}
	hr {
	    border:0;
		background-color:#777;
		height:1px;
	}
</style>
EOF;
?>

