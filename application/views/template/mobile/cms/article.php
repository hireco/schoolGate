<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($index['class_id']);?>
</ol>

<div class="page-header cms_title">
	<h4><?php echo $index['cms_title']?></h4>
</div>

<div class="cms_content">
	   <?php echo $content['article_body']; ?>
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
$(document).ready(function() {	
    
	$(".cms_content").html($(".cms_content").html().replace(/&nbsp;/g,''));
	
	
	 
	$('.cms_content table img').each(function(i){
	    if($(this).width()>200) $(this).closest('table').after('<div class="cms_images" style="padding:5px;"></div>');
	});

	$('.cms_content table img').each(function(i){
		if($(this).width()>200) $('.cms_images').eq(i).append($(this).clone());
	});
	
	$('.cms_content img').closest('table').remove();

	$('.cms_content img').each(function(){
	    if($(this).width()>200) {
			$(this).addClass('carousel-inner img-responsive img-rounded');
		    $(this).wrap('<a href="'+$(this).attr('src')+'" class="swipebox"></a>');
		}
	})
	
	$( '.swipebox' ).swipebox();

	$('.cms_content table').find('*').removeAttr('width style border hspace');
	$('.cms_content table').removeAttr('width style cellspacing').addClass('table').wrap('<div class="table-responsive"></div>');

	$('.table-responsive').before('<div class="visible-xs alert alert-info alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>左右滑动以查看表格</div>');

});
</script>
<?php
  $this->my_load->set_js_file('article');
  $this->my_load->js_inc_t[]='js/swipebox-master/js/jquery.swipebox.min.js';
  $this->my_load->css_inc[]='js/swipebox-master/css/swipebox.min.css';
?>
