<div class="body">
<div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <a href="<?php echo site_url('people');?>">师资队伍</a>
&gt; <a href="<?php echo site_url('people/list/'.$this->people_model->titles[$people['title_id']]);?>"><?php echo $this->people_model->cn_titles[$people['title_id']]?></a> &gt; <?php echo $people['cn_name']?></div>
<div class="page_div" id="list_right">
   
   <div class="title_link menu_unique">
   <span class="top_tag">分类导航</span>
   <?php  
	   echo '<span class="top"><a href="'.site_url('people/group').'" >全部类型</a></span>';

	  foreach($this->people_model->groups as $index => $value) {
           echo '<span class="top"><a href="'.site_url('people/group/'.$index).'" ';            
           echo '>'.$this->people_model->groups[$index][0].'</a></span>';

		   foreach($this->people_model->groups[$index][1] as $index_i => $value_i) {
		   	  echo '<span class=" sub'; 
               if($people['title_id']==$value_i) echo ' current '; 
			   else if(!in_array($people['title_id'],$this->people_model->groups[$index][1])) echo ' hide ';
               echo '"><a href="'.site_url('people/list/'.$this->people_model->titles[$value_i]).'" ';            
               echo '>'.$this->people_model->cn_titles[$value_i].'</a></span>';  		   
		   }
         }
   ?>
   </div>
</div>
<div class="page_div" id="list_left">  
  <div id="view_pannel">
    <div class="part_header">
      <div class="name"><?php echo $people['cn_name']?></div>
      <script>
	   $(document).ready(function(){
		   $.post(get_url(json_str.base_url+'ajax/people_ajax/add_editor_link'),{people_id: $('#people_id').val()},function(data){
			   $('#people_id').before(data);
		   });
	   });
	  </script>
      <input type="hidden" id="people_id" value="<?php echo $people['people_id'];?>" />
    </div>
    <div class="part_body">
      <div class="left_column">
	    <?php $thumb_scale=$this->myconfig->item('thumb_keep_scale');?>
        <div class="avatar_div"><a class="thumb_wrapper <?php if($thumb_scale!='1')  echo 'rescale';?>"><img src="<?php echo $people['avatar']?$people['avatar']:'';?>" /></a></div>
      </div>
      <div class="right_column">
        <?php 
		  $email_str=$people['email']?common::myurlcode($people['email']):'';
		  $phone_str=$people['phone']?common::myurlcode($people['phone']):'';
		?>
        <div class="item_list"><span class="tag">姓名：</span><span class="cont"><?php echo $people['cn_name'].'('.$people['en_name'].')'; ?></span></div>
        <div class="item_list"><span class="tag">性别：</span><span class="cont"><?php echo $people['gender']?($people['gender']=='m'?'男':'女'):''; ?></span></div>
		
		<?php if($people['hide_born_year']=='0') {?>
		<div class="item_list"><span class="tag">年龄：</span><span class="cont"><?php $cur_year=(int)date('Y',time()); echo $people['born_year']?$cur_year-$people['born_year']:'';?></span></div>
        <?php } ?>

		<div class="item_list"><span class="tag">职称/头衔/类别：</span><span class="cont"><?php echo $this->people_model->cn_titles[$people['title_id']]?></span></div>
        <div class="item_list"><span class="tag">最高学位：</span><span class="cont"><?php echo $this->people_model->degrees[$people['degree']];?></span></div>
        
		<?php if($people['hide_phone']=='0') {?>
		<div class="item_list"><span class="tag">联系电话：</span><span class="cont"><?php echo $phone_str?'<img src="'.site_url('image/string_image/'.$phone_str).'" />':''; ?></span></div>
		<?php } if($people['hide_email']=='0') {?>
        <div class="item_list"><span class="tag">电子邮件：</span><span class="cont"><?php echo $email_str?'<img src="'.site_url('image/string_image/'.$email_str).'" />':''; ?></span></div>
		<?php } ?>

        <div class="item_list"><span class="tag">邮编：</span><span class="cont"><?php echo $people['zip_code'];?></span></div>
        <div class="item_list"><span class="tag">联系地址：</span><span class="cont"><?php echo $people['office'];?></span></div>
        <div class="item_list"><span class="tag">个人站点：</span><span class="cont"><?php echo $people['personal_site']?'<a class="cont" href="'.$people['personal_site'].'" target="_blank">'.$people['personal_site'].'</a>':'';?></span></div>
      </div>
      <div class="clear-both"></div>
      <div class="details_list">
        <?php 
        $details=$people['details'];
        if(isset($details) && $details) {
        	$details=explode('-ddd-',$details); 
            foreach($details as $index => $value) {
            $detail=explode('-bbb-',$value);
       ?>
       <div class="detail_item"><?php echo $detail[0]?></div>
       <div class="detail_cont"><?php echo nl2br(strip_tags($detail[1]));?></div>
       <?php }
        }
       ?>
      </div>
    </div>
  </div>  
    
</div>
<div class="clear-both"></div>
</div>
<?php
$this->my_load->set_js_file('people');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/people.js';
$this->my_load->set_css_file('people_view');
$this->my_load->css_inc[]='js/swfupload/swfupload.css';
$this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/people.css';
?>
