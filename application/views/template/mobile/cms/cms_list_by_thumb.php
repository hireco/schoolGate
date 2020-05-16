<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($class_id);?>
</ol>

<div class="page-header">
  <h4><?php echo $class_name; ?></h4>
</div>

<div id="masonry-container" class="js-masonry row" data-masonry-options='{ "columnWidth": ".img_list_item", "itemSelector": ".img_list_item" }'>
	<?php
	$thumb_scale=$this->myconfig->item('thumb_keep_scale');
	$entry_list=$this->myquery->cms_of_classes($sub_classes,0);
	$entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);

	foreach ($entry_list as $index => $value) {
		$table=$this->myconfig->cms_model($value['model_id'],'table');

		$class_icon_image = $this->cms_function->get_attr($value['class_id'],'icon_image');
		$icon_image =  $value['icon_image']?$value['icon_image']:($class_icon_image?$class_icon_image:site_url('skin/'.SKIN_NAME.'/images/cms_image.jpg'));

		echo '<div class="img_list_item col-xs-12 col-sm-8 col-md-6 col-lg-4"><div class="thumbnail">';
		echo '<a href="'.site_url($table.'/'.$value['cms_title_en']).'"><img class="carousel-inner img-responsive " src="'.$icon_image.'" /></a>';
		echo '<div class="caption">';
		echo '<p>'.my_limiter($value['cms_title'],20).'</p>';
		echo '</div>';
		echo '</div></div>';
	}
	?>
</div>

<div id="page_loading">
</div>

<?php
echo '<ul class="pagination">';
if($pages > 1)  for($i=1;$i<=$pages;$i++) {	   
	  echo '<li'; 
	  if($i==$page_id) echo ' class="active" ';
	  echo '><a href="'.site_url('photo/list/'.$class_name_en.'/'.$i).'">'.$i.'</a></li>';
}
echo '</ul>';
?>

<script>
	$(function() {

		var $container = $('#masonry-container');
		// initialize Masonry after all images have loaded
		$container.imagesLoaded(function () {
			$container.masonry();
		});

		// initial the state of pagination
		var sentIt = true;
		nextHref = $(".pagination .active").next().children('a').attr("href");
		// bind the event of scroll to the window 
		$(window).bind("scroll",function(){
			// check if the browser reaches the bottom of the window
			if( $(document).scrollTop() + $(window).height() > $(document).height() - 30  && sentIt ) {

				// show the loading hint
				$("#page_loading").addClass('page_loading').show("fast");

				// check whether the next page is valid
				if( nextHref != undefined ) {
					// Ajax pagination handle
					$.ajax( {
						url: nextHref,
						type: "POST",
						beforeSend: function(){sentIt = false; }, // Set sentIt as false when ajax requested to forbidden more ajax request
						success: function(data) {
							result = $(data).find("#masonry-container .img_list_item");
							$(".pagination").html($(data).find(".pagination").html());
							nextHref = $(".pagination .active").next().children('a').attr("href");
							$("#masonry-container").append(result);
							// set the new html as transparent
							$newElems = result.css({ opacity: 0 });
							$newElems.imagesLoaded(function(){
								$container.masonry( 'appended', $newElems, true );
								// show the loaded images
								$newElems.animate({ opacity: 1 });
								// hide the loading hint
								$("#page_loading").removeClass('page_loading').hide("slow");
							});

						},
						complete: function(){setTimeout(sentIt = true, 600); } //Set sentIt as True after ajax finished
					});
				} else {
					setTimeout('$("#page_loading").removeClass("page_loading").html("<span>下面没有了</span>");',2000);
					setTimeout('$("#page_loading").html("").hide();',3000);
				}
			}
		});
	});
</script>
<?php
$this->my_load->set_js_file('photo_list');
//$this->my_load->set_css_file('photo_list');
$this->my_load->js_inc_t[]='js/masonry/masonry.pkgd.min.js';
$this->my_load->js_inc_t[]='js/imagesloaded/imagesloaded.pkgd.min.js';
$this->my_load->css_ins[]=<<<EOF
<style>
	body{
		background-color:#000;
		color:#777;
	} 
	.page-header{
		border-bottom-color:#777;
	}
</style>
EOF;
?>

 
