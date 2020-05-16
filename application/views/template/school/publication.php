<div class="body">
<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a>
&gt; <a href="<?php echo site_url('publication/'.$pub_time);?>"><?php echo $pub_time?>年度论文著作</a></div>
<div class="page_div" id="sidebar">
   
   <div class="title_link menu_unique">
   <div class="link_head">年度列表</div>
   <div class="link_body">
   <?php $cur_year=date('Y',time()); 
         $year_back=$this->publication_model->year_back;
         for($i=$cur_year; $i>$cur_year-$year_back; $i--) {
           echo '<a href="'.site_url('publication/'.$i).'" class="top';            
           if($pub_time==$i) echo ' current ';
		   echo '">'.$i.'</a>';
         }
   ?>
   </div>
   </div>
   
   <?php $this->ads_model->show_ads(2);?>

</div>

<div class="page_div" id="mainbar">
  
  <?php if(!$papers && !$talks && !$books) {?>
       <div class="no_record">暂无记录</div>
  <?php } ?>

  <?php if($papers) {?>
  <div class="part_header"><div class="name">发表论文</div></div>
  <div class="part_body">
  <?php foreach ($papers as $index => $value) {
      $pub_details=json_decode($value['pub_details'],TRUE);
      $pub_file=json_decode($value['pub_file'],TRUE);
      if($pub_file[0]=='1' && $pub_file[1]) {
      	$filepath=common::myurlcode($pub_file[1]);
      	$filepath=site_url('myfile/download/'.$filepath);
      	$bgfile=common::fileext(basename($pub_file[1])).'.png';
      	$text='下载';
      }
      else if($pub_file[0]=='0' && $pub_file[1]) {
        $filepath=$pub_file[1];
        $bgfile='html.png';
      	$text='点击访问';
      }
  	?>
   <div class="entry_list">
   <span class="index"><?php echo $index+1;?>.</span>
   <span class="authors"><?php echo $value['authors']?></span>
   <span class="title">"<?php echo $value['pub_title']?>"</span>
   <span class="journal"><?php echo $pub_details['journal']?></span>   
   <?php if($pub_details['pub_condition']=='published') {?>
   <span class="volumn"><?php echo $pub_details['volumn']?></span>
   <span class="page"><?php echo $pub_details['page']?></span>
   <span class="year">(<?php echo $value['pub_time']?>)</span>
   <span class="cited"><?php echo $pub_details['cited']?'被引用：'.$pub_details['cited']:'';?></span>
   <?php } else {?>
   <span class="condition"><?php echo $this->publication_model->conditions[$pub_details['pub_condition']]?></span>
   <?php } if(isset($filepath)) 
     echo '<span class="file"><a style="background-image: url('.site_url('skin/'.SKIN_NAME.'/images/'.$bgfile).');" href="'.$filepath.'">'.$text.'</a></span>';
   ?>   
   </div>
  <?php }?>
  </div>
 <?php }?>
 
  <?php if($talks) {?> 
  <div class="part_header"><div class="name">会议报告</div></div>
  <div class="part_body">
  <?php foreach ($talks as $index => $value) {
      $pub_details=json_decode($value['pub_details'],TRUE);
      $pub_file=json_decode($value['pub_file'],TRUE);
      if($pub_file[0]=='1' && $pub_file[1]) {
      	$filepath=common::myurlcode($pub_file[1]);
      	$filepath=site_url('myfile/download/'.$filepath);
      	$bgfile=common::fileext(basename($pub_file[1])).'.png';
      	$text='下载';
      }
      else if($pub_file[0]=='0' && $pub_file[1]) {
        $filepath=$pub_file[1];
        $bgfile='html.png';
      	$text='点击访问';
      }
  	?>
   <div class="entry_list">
   <span class="index"><?php echo $index+1;?>.</span>
   <span class="authors"><?php echo $value['authors']?></span>
   <span class="title">"<?php echo $value['pub_title']?>"</span>
   <span class="meeting"><?php echo $pub_details['meeting']?></span>
   <span class="city"><?php echo $pub_details['meeting_city']?></span>
   <span class="year"><?php echo $value['pub_time']?></span>
   <?php if(isset($filepath)) 
     echo '<span class="file"><a style="background-image: url('.site_url('skin/'.SKIN_NAME.'/images/'.$bgfile).');" href="'.$filepath.'">'.$text.'</a></span>';?>
   </div>
  <?php }?>
  </div>
  <?php }?>
  
  <?php if($books) {?> 
  <div class="part_header"><div class="name">出版专著</div></div>
  <div class="part_body">
  <?php foreach ($books as $index => $value) {
      $pub_details=json_decode($value['pub_details'],TRUE);
      $pub_file=json_decode($value['pub_file'],TRUE);
      if($pub_file[0]=='1' && $pub_file[1]) {
      	$filepath=common::myurlcode($pub_file[1]);
      	$filepath=site_url('myfile/download/'.$filepath);
      	$bgfile=common::fileext(basename($pub_file[1])).'.png';
      	$text='下载';
      }
      else if($pub_file[0]=='0' && $pub_file[1]) {
        $filepath=$pub_file[1];
        $bgfile='html.png';
      	$text='点击访问';
      }
  	?>
   <div class="entry_list">
   <span class="index"><?php echo $index+1;?>.</span>
   <span class="authors"><?php echo $value['authors']?></span>
   <span class="title">"<?php echo $value['pub_title']?>"</span>
   <span class="publisher"><?php echo $pub_details['publisher']?></span>
   <span class="publisher"><?php echo $pub_details['publish_area']?></span>
   <span class="year"><?php echo $value['pub_time']?></span>
   <?php if(isset($filepath))
     echo '<span class="file"><a style="background-image: url('.site_url('skin/'.SKIN_NAME.'/images/'.$bgfile).');" href="'.$filepath.'">'.$text.'</a></span>';?>
   </div>
  <?php }?>
  </div>
  <?php }?>
    
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('publication');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/publication.js';
$this->my_load->set_css_file('publication');
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/publication.css';
?>
