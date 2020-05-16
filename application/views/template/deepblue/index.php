<div class="conent_box clearfix">
	<div class="min_banner" id="rolling">
    <!-- /图片滚动 -->
    <div class="row">
                        <div class="span10">
                            <div class="f-rolling clearfix" id="fy-rolling" data-ride="rolling" data-stretch="true" data-auto="true" data-num="6">
                                <div class="f-rolling-whole"></div>
                                
                                <?php 
					 $scroll=$this->functions->get_scroll(16);
					 if(count($scroll)) {
					   	$photos=explode(':',$scroll['photo_list']);
					    $captions=explode('|',$scroll['photo_caption']);
					    $descriptions=explode('|',$scroll['photo_description']);
					    $links=explode('|',$scroll['photo_link']);
						?>
						<ul class="f-rolling-indicators clearfix">
						<?php foreach ($photos as $index => $value) 
                           echo '<li>'.($index+1).'</li>';
						?>
					    </ul>
						<div class="f-rolling-mask">
                        <ul class="f-rolling-images clearfix">
						<?php foreach ($photos as $index => $value) { ?> 
						  <li>
							<a href="<?php echo $links[$index];?>" target="_blank"><img src="<?php echo $value;?>" /></a>
							<div class="f-rolling-text"><p><?php echo $captions[$index];?></p></div>
                          </li>
						<?php } ?>
						</ul>
                        </div>
					<?php } ?> 

                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
    <!-- /图片滚动 -->
    </div>
	
	<?php 
	  $index_columns=explode(',',$this->myconfig->item('index_columns'));      	  
    ?> 
	
    <div class="xinwen_box">
	    <?php 
	   if(isset($index_columns[0])) { 
	      $class_id=$index_columns[0];
		  $class_attrs=$this->cms_function->get_attrs($class_id);
          $class_name=$class_attrs['class_name'];
          $class_name_en=$class_attrs['class_name_en'];
	   ?> 
		<h2><a href="/category/317/"  href="<?php echo site_url('cms/'.$class_name_en);?>"><?php echo $class_name;?></a></h2>
		<ul>
			<?php 
			  $entry_list=$this->cms_function->cms_list_of_id($class_id,8);	
			  foreach ($entry_list as $index => $value) {
				$style=$this->cms_function->title_style($value['title_color'],$value['title_strong']);
				echo '<li><span>'.date('m-d',$value['post_time']).'</span><a '.$style.' title="'.$value['cms_title'].'" href="'.site_url('article/'.$value['cms_title_en']).'">'.$value['cms_title'].'</a></li>';
			  }
            ?>	
		</ul>
		<?php } ?>
	</div>
    <div class="clear"></div>
	<?php 
	  $array=array();
		  
	  foreach($index_columns as $index => $value) {
		  if($index==0) continue;
		  
		  $array[$index]['class_id']=$value;
		  $array[$index]['class_attrs']=$this->cms_function->get_attrs($array[$index]['class_id']);
		  $array[$index]['class_name']=$array[$index]['class_attrs']['class_name'];
		  $array[$index]['class_name_en']=$array[$index]['class_attrs']['class_name_en']; 
		  
		  $array[$index]['entries']='';
		  $entry_list=$this->cms_function->cms_list_of_id($value,7);	
		  foreach ($entry_list as $index_i => $value_i) {
			$style=$this->cms_function->title_style($value_i['title_color'],$value_i['title_strong']);
			$array[$index]['entries'].='<li><span>'.date('m-d',$value_i['post_time']).'</span><a '.$style.' title="'.$value_i['cms_title'].'" href="'.site_url('cms/view/'.$value_i['index_id']).'">'.$value_i['cms_title'].'</a></li>';
		  }
	  }
	  
	  function show_class_name($index,$array) {
		  echo isset($array[$index])?$array[$index]['class_name']:'';
	  }
	  
	  function show_class_link($index,$array) {
		  echo isset($array[$index])?site_url('cms/'.$array[$index]['class_name_en']):'';
	  }
	  
	  function show_entry_list($index,$array) {
		  echo isset($array[$index])?$array[$index]['entries']:'';
	  }
	?>
	
    <div class="list_main">	
		<ul class="list_topbg">
			<li class="hover"><a href="<?php show_class_link(1,$array);?>"  target="_blank"/><?php show_class_name(1,$array);?></a></li>
			<li><a href="<?php show_class_link(2,$array);?>"  target="_blank"/><?php show_class_name(2,$array);?></a></li>
		</ul>  
        <div class="tabbox">
        	<ul>
        		<?php show_entry_list(1,$array); ?>			    
        	</ul>
          <ul>
        		<?php show_entry_list(2,$array); ?>			    
        	</ul>
        </div>
	</div>
  <div class="list_main">	
		<ul class="list_topbg">
			<li class="hover"><a href="<?php show_class_link(3,$array);?>"  target="_blank"/><?php show_class_name(3,$array);?></a></li>
			<li><a href="<?php show_class_link(4,$array);?>"  target="_blank"/><?php show_class_name(4,$array);?></a></li>
		</ul>  
        <div class="tabbox">
        	<ul>
        		<?php show_entry_list(3,$array); ?>			    
        	</ul>
         <ul>
        		<?php show_entry_list(4,$array); ?>		    
        	</ul>
        </div>
	</div>
    <div class="r index_img">
        <?php $this->ads_model->show_ads(5);?>
    </div>
	<div class="clear"></div>
    <div class="list_main">	
		<ul class="list_topbg">
			<li class="hover"><a href="<?php show_class_link(5,$array);?>"  target="_blank"/><?php show_class_name(5,$array);?></a></li>
			<li><a href="<?php show_class_link(6,$array);?>"  target="_blank"/><?php show_class_name(6,$array);?></a></li>
		</ul>  
        <div class="tabbox">
        	<ul>
        		<?php show_entry_list(5,$array); ?>			    
        	</ul>
			<ul style="display:none">
            	<?php show_entry_list(6,$array); ?>
        	</ul>
        </div>
	</div>
  <div class="list_main">	
		<ul class="list_topbg">
			<li class="hover"><a href="<?php show_class_link(7,$array);?>"  target="_blank"/><?php show_class_name(7,$array);?></a></li>
			<li><a href="<?php show_class_link(8,$array);?>"  target="_blank"/><?php show_class_name(8,$array);?></a></li>
		</ul>  
        <div class="tabbox">
        	<ul>
			   <?php show_entry_list(7,$array); ?>			    
        	</ul>
			<ul style="display:none">
            	<?php show_entry_list(8,$array); ?>			    
        	</ul>
        </div>
	</div>
  <div class="Stud_main" style=" display:none">	
		<ul class="Stud_topbg">
			<li class="hover">学生园地</li>
			<!--<li>学生园地</li>-->
		</ul>  
        <div class="Studbox">
        	<dl>
        	
            
        	</dl>
        </div>
	</div>
  <div class="r index_serv">
    	<div class="titer"><h2>服务</h2></div>
        <?php $this->ads_model->show_ads(6);?>
        <?php $this->ads_model->show_ads(7);?>  
    </div>
</div>
<script src="<?php  echo site_url('js/template/'.SKIN_NAME.'/fy-all.min.js'); ?>"></script>
<script type="text/javascript">
	$(".list_topbg li").hover(function(){
		$(this).addClass("hover");
		$(this).siblings().removeClass("hover");
		var ind_num= $(".list_topbg li").index(this);
		$(".tabbox ul").eq(ind_num).show().siblings().hide();		
		});
	$(".Stud_topbg li").hover(function(){
		$(this).addClass("hover");
		$(this).siblings().removeClass("hover");
		var ind_num= $(".Stud_topbg li").index(this);
		$(".Studbox dl").eq(ind_num).show().siblings().hide();		
		});
</script>