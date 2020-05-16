<div class="body" id="header">
  <div id="header_top">
    <div class="left_bar"></div>
    <div class="center_bar">
      <div class="left">          
         <label><?php echo $this->myconfig->item('site_name')?></label>                  
      </div>
      <div class="right" id="unlogged_state">
	     <div id="top_navi">
		  <label><a class="a_text" href="http://www.tsinghua.edu.cn" target=_blank>学校主页</a><span>|</span></label>
		  <label><a class="a_text" href="https://portal.pku.edu.cn/" target=_blank>办公门户</a><span>|</span></label>
		  <label><a class="a_text" href="http://webmail.scut.edu.cn/scutmail" target=_blank>电子邮件</a><span>|</span></label>
		  <label><a class="a_text" id="form_opener" href="javascript:void(0);">用户登录</a></label>
		 </div>
		 <div id="form_opened" class="hide">
          <label>用户名：</label><input class="text filled" type="text" name="username" id="username" />
          <label>密码：</label><input class="text filled" type="password" name="password" id="password" />
          <label>验证码：</label><input class="text filled" type="text" name="chkstr" id="chkstr" />
          <span class="button" id="login_submit">登录</span>
          <span class="button" id="register_button">注册</span>
		 </div>
      </div>
      <div class="right" id="logged_state"></div>    
    </div>
    <div class="right_bar"></div>
  </div>
  <div id="header_body">
    <div id="logo" class="header_divs"><a title="<?php echo $this->myconfig->item('site_name')?>" href="<?php echo base_url();?>"><?php echo $this->myconfig->item('site_name')?></a></div>
    <div class="header_aid"><?php $this->ads_model->show_ads(1);?></div>
  </div>  
  <div id="header_navi">
  <div class="navi">
    <div class="left"></div>
    <div class="center">
	    <ul>	
		 <?php 		 
			 
		 if($this->myconfig->item('navigation') && $this->navi_model->has_navi()) $this->navi_model->show_navi_group('main',12);
		 else {
			  
			 echo '<li class="topmenu index"><a href="'.base_url().'">首页</a></li>';
			 
			 echo '<li class="topmenu"><a href="'.site_url('people').'">师资力量</a>';
		     echo ' <ul class="submenu">';
		     echo '<li><a href="'.site_url('people/list/fellow').'">院士</a></li>';
		     echo '<li><a href="'.site_url('people/list/professor').'">教授</a></li>'; 
		     echo '<li><a href="'.site_url('people/list/viceprofessor').'">副教授</a></li>';
		     echo '</ul>';
		     echo'</li>';

			 $top_classes=$this->myquery->cms_class_list(9,0);
	         foreach ($top_classes as $index => $value) {              		   
	         echo '<li class="topmenu"><a href="'.site_url('cms/'.$value['class_name_en']).'">'.$value['class_name'].'</a>';
	         
			 $sub_classes=$this->myquery->cms_class_list(0,$value['class_id']);  

			 if($sub_classes) echo ' <ul class="submenu">';
	         foreach($sub_classes as $index_i => $value_i) {		      
	           echo '<li><a href="'.site_url('cms/'.$value_i['class_name_en']).'">'.$value_i['class_name'].'</a></li>';     
	         }  

			 if($sub_classes) echo ' </ul>';
	         
			 echo '</li>';
           } 
 
 		    echo '<li class="topmenu"><a href="'.site_url('publication').'">论文专著</a>';
		    echo ' <ul class="submenu">';
		    $cur_year=date('Y',time());         
            for($i=$cur_year; $i>$cur_year-5; $i--) 
			  echo '<li><a href="'.site_url('publication/'.$i).'">'.$i.'年度</a></li>';
		    echo '</ul>';
		    echo'</li>';

		  }

		 ?>
	   </ul>
    </div>   
    <div class="right"></div>
   </div>  
  </div>
  <div class="clear-both"></div>
</div>
<?php 
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/header.js';
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/header.css';
?>
