<div class="body" id="header">
  <div id="header_top">
    <div class="left_bar"></div>
    <div class="center_bar">
      <div class="left">          
         <label><?php echo $this->myconfig->item('site_name')?></label>                  
      </div>
      <div class="right" id="unlogged_state">
         <label>用户名：</label><input class="text filled" type="text" name="username" id="username" />
         <label>密码：</label><input class="text filled" type="password" name="password" id="password" />
         <label>验证码：</label><input class="text filled" type="text" name="chkstr" id="chkstr" />
         <span class="button" id="login_submit">登录</span>
         <span class="button" id="register_button">注册</span>
      </div>
      <div class="right" id="logged_state"></div>    
    </div>
    <div class="right_bar"></div>
  </div>
  <div id="header_body">
    <div id="logo" class="header_divs"><a title="<?php echo $this->myconfig->item('site_name')?>" href="<?php echo base_url();?>"><?php echo $this->myconfig->item('site_name')?></a></div>
    <div class="header_aid"><?php $this->ads_model->show_ads(8);?></div>
  </div>  
  <div id="header_navi">

  <?php 
    if($this->myconfig->item('navigation') && $this->navi_model->has_navi()) $this->navi_model->show_navi_group('main',11);
    else {  
  ?>

  <ul class="navi">   
   <li class="left"></li>
   <li class="center">
       <a id="index_navi" class="first" style="color:gold;" href="<?php echo base_url();?>">首页</a>       
	   <?php 
        $top_classes=$this->myquery->cms_class_list(9,0);
          foreach ($top_classes as $index => $value) {
        	echo '<a id="'.$value['class_name_en'].'_navi" href="'.site_url('cms/'.$value['class_name_en']).'" >'.$value['class_name'].'</a>';
        }
       ?>
       <a id="people_navi" href="<?php echo site_url('people');?>">研究人员</a>
   </li>   
   <li class="right"></li>
  </ul>
  
  <div class="navi_bottom">
    <div class="left_bar"></div>
    <div class="navi_bottom_div">
	
	<ul class="navi_bottom_link" id="index_sub">      
       <li><a href="<?php echo site_url('cms');?>" >新闻信息</a></li><li class="inter"></li>
	   <li><a href="<?php echo site_url('people');?>" >研究人员</a></li><li class="inter"></li>
       <li><a href="<?php echo site_url('publication');?>" >科研成果</a></li><li class="inter"></li>
    </ul>
    <?php 
	   foreach($top_classes as $index => $value) {
		 
		 $sub_classes=$this->myquery->cms_class_list(12,$value['class_id']); 	     
		 echo '<ul class="navi_bottom_link hide" id="'.$value['class_name_en'].'_sub">';        
         foreach ($sub_classes as $index_i => $value_i) {
        	if($index_i!=0) echo '<li class="inter"></li>';
        	echo '<li><a href="'.site_url('cms/'.$value_i['class_name_en']).'" >'.$value_i['class_name'].'</a></li>';
         }
		 echo '</ul>';
	   }
      ?>

    <ul class="navi_bottom_link hide" id="people_sub">      
       <li><a href="<?php echo site_url('people/list/fellow');?>" >院士</a></li><li class="inter"></li>
	   <li><a href="<?php echo site_url('people/list/professor');?>" >教授</a></li><li class="inter"></li>
       <li><a href="<?php echo site_url('people/list/vice-professor');?>" >副教授</a></li><li class="inter"></li>
	   <li><a href="<?php echo site_url('people/list/lecturer');?>" >讲师</a></li><li class="inter"></li>
    </ul>   
	
    </div>
    <div class="right_bar"></div>
  </div>
  
  <?php } ?>

  </div>
  <div class="clear-both"></div>
</div>
<?php 
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/header.js';
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/header.css';
?>
