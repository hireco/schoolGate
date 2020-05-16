<form class="my_form" id="people_form"  accept-charset="utf-8">
    <input type="hidden" name="people_id" id="people_id" value="<?php echo isset($people_id)?$people_id:0;?>" />
    <div class="form_title">填写表单<?php echo isset($people_id)?'修改':'添加';?>人员信息</div>
    <div class="my_form_item">
      <label class="labeltag">对应用户名：</label>
      <span class="mainarea">
        <input type="text" class="enterbox shortarea" name="user_name" id="user_name" value="<?php echo isset($user_name)?$user_name:'';?>"  /> <label>可留空，若填写，则对应用户可管理自己的个人信息</label>
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">中文姓名：</label>
      <span class="mainarea">
        <input type="text" class="enterbox shortarea filled" name="cn_name" id="cn_name" value="<?php echo isset($cn_name)?$cn_name:'';?>"  /> <label>*中文真实姓名</label>
      </span>     
    </div>    
    <div class="my_form_item">
      <label class="labeltag">英文姓名：</label>
      <span class="mainarea">
        <input type="text" class="enterbox filled" name="en_name" id="en_name" value="<?php echo isset($en_name)?$en_name:'';?>" /> <label>*若没有，请填写汉语拼音</label>
	   <input type="hidden" class="enterbox filled" name="en_id" id="en_id" value="<?php echo isset($en_id)?$en_id:'';?>" />
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">性别：</label>
      <span class="mainarea">
        <input type="radio" name="gender" id="gender_m"  value="m" <?php if((isset($gender) && $gender=='m') || !isset($gender) ||!$gender )  echo 'checked="checked"';?>/> <label>男</label>
        <input type="radio" name="gender" id="gender_f"  value="f" <?php if(isset($gender) && $gender=='f')  echo 'checked="checked"';?> /> <label>女</label>
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">出生年：</label>
      <span class="mainarea">
        <select name="born_year" id="born_year">
          <?php $cur=(int)date('Y',time()); for($i=15; $i<80;$i++) {
            echo '<option value="'.($cur-$i).'"'; 
            if(isset($born_year) && $born_year==$cur-$i) echo ' selected="selected" ';
            echo '>'.($cur-$i).'年</option>';
          }
          ?>
        </select> <input style="margin-left:10px;" type="checkbox" name="hide_born_year"  <?php echo isset($hide_born_year)?($hide_born_year=='1'?'checked="checked"':''):''; ?>  /> <label>是否保密？</label>
      </span>     
    </div>    
    <div class="my_form_item">
      <label class="labeltag">头衔/职称：</label>
      <span class="mainarea">
        <select name="title_id" id="title_id">
          <?php 
		  foreach($this->people_model->groups as $i => $j) {
		   	  echo '<option value="" style="color:gray">'.$j[0].'</option>';
		   foreach($j[1] as $m => $n) {
             echo '<option value="'.$n.'"'; 
             if(isset($title_id) && $title_id==$n) echo ' selected="selected" ';
             echo '>&nbsp;&nbsp;'.$this->people_model->cn_titles[$n].'</option>';
		  }
          }	
          ?>
        </select>
      </span>     
    </div>    
    <div class="my_form_item">
      <label class="labeltag">最高学位：</label>
      <span class="mainarea">
        <select name="degree" id="degree">
          <?php foreach($this->people_model->degrees as $index => $value) {
            echo '<option value="'.$index.'"'; 
            if(isset($degree) && $degree==$index) echo ' selected="selected" ';
            echo '>'.$value.'</option>';
          }
          ?>
        </select>
      </span>     
    </div>    
    
    <div class="my_form_item">
      <label class="labeltag">联系电话：</label>
      <span class="mainarea">
        <input type="text" class="enterbox filled" name="phone" id="phone" value="<?php echo isset($phone)?$phone:'';?>"/> <label>*办公电话或个人电话</label> <input type="checkbox" name="hide_phone"  <?php echo isset($hide_phone)?($hide_phone=='1'?'checked="checked"':''):''; ?>  /> <label>是否保密？</label>
      </span>     
    </div>    
    <div class="my_form_item">
      <label class="labeltag">办公地址：</label>
      <span class="mainarea">
        <input type="text" class="enterbox keywords filled" name="office" id="office" value="<?php echo isset($office)?$office:'';?>" /> <label>*办公室详细地址</label>
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">邮政编码：</label>
      <span class="mainarea">
        <input type="text" class="enterbox shortarea filled" name="zip_code" id="zip_code" value="<?php echo isset($zip_code)?$zip_code:'';?>"/> <label>*通信邮政编码</label> 
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">电子邮件：</label>
      <span class="mainarea">
        <input type="text" class="enterbox filled" name="email" id="email" value="<?php echo isset($email)?$email:'';?>" /> <label>*电子邮件地址</label>  <input type="checkbox" name="hide_email" <?php echo isset($hide_phone)?($hide_email=='1'?'checked="checked"':''):''; ?> /> <label>是否保密？</label>
      </span>     
    </div>
    <div class="my_form_item">
      <label class="labeltag">个人目录：</label>
      <span class="mainarea">
        <input type="text" class="enterbox shortarea" name="html_dir" id="html_dir" <?php if(isset($html_dir) && $html_dir) echo 'disabled="disabled"';?> value="<?php echo isset($html_dir)?$html_dir:'';?>" /> <label>在本站的目录，可以放静态个人网页，一旦指定，不可更改！</label>
      </span>     
    </div>        
    <div class="my_form_item">
      <label class="labeltag">个人网址：</label>
      <span class="mainarea">
        <input type="text" class="enterbox keywords" name="personal_site" id="personal_site" value="<?php echo isset($personal_site)?$personal_site:'';?>" /> <label>若有，请填写完整的URL路径</label>
      </span>     
    </div>
    
    <div class="my_form_item">
      <label class="labeltag">个人图片：</label>
	  <span class="mainarea">
	  <input type="text"   id="avatar" name="avatar" data-num="1"  data-preview="#avatar_preview" class="enterbox" disabled='disabled' value="<?php echo isset($avatar)?$avatar:'';?>" />
	  <input type="hidden" id="avatar_sql" name="avatar_sql"  value="<?php echo isset($avatar)?$avatar:'';?>" />
	  <input type="hidden" id="avatar_old" name="avatar_old"  value="" />
	  <input type="button" class="my_button" id="upload_avatar" value="点击上传" />
      <input type="button" class="my_button local_select"  data-for="#avatar" value="本地选择" />
	  </span>
	</div>
	 <div class="form_pic_show" id="avatar_preview">
	<?php 
	  if(isset($avatar) && $avatar)   echo '<img  id="avatar_show"   src="'.$avatar.'" />';
	?>
	</div>
    <div class="hide">
	    <span id="people_avatar_size"><?php echo $this->myconfig->item('people_avatar_size'); ?></span>		
		<span id="upload_dir"><?php echo $this->config->item('upload_dir').'/'.$this->config->item('image_dir').'/'.date('ym').'/'; ?></span>
		<span id="preview_image">skin/admin/images/banner_icon_sample.jpg</span>
	</div>
	
	<div class="my_form_item">
      <label class="labeltag">详细介绍：</label>
      <span class="mainarea">分别在下面填写项目名称和内容</span>
      <span class="mainarea"><input type="button" class="my_button" name="add_details"  id="add_details"  value="增加项目" /></span>
    </div>
    
   <div class="details_div">
	<?php 
      if(isset($details) && $details) {
      $details=explode('-ddd-',$details); 
      $num=count($details);       
      foreach($details as $index => $value) {
         $detail=explode('-bbb-',$value);
      ?>
       <div class="my_form_item">
       <label class="labeltag"> </label>
       <span class="mainarea div_span">
         <span><label class="index_no">项目<?php echo $index+1;?></label><input type="text" class="enterbox shortarea filled detail_item" value="<?php echo $detail[0];?>" /></span>
         <span class="span_textarea"><textarea class="enterbox medium_enterarea filled detail_cont"><?php echo $detail[1];?></textarea></span>
         <span class="delete_item" title="删除此条"></span>
       </span>
       </div>
      <?php }
      }
    ?>
    <script>
      $(document).ready(function(){
         if(!$('.div_span').length) add_detail_form();
      });
    </script>
   </div>
     
	<div class="my_form_item button_row">
      <label class="labeltag"></label>
      <span class="mainarea">
      <label for="link_submit"><input type="button" class="my_button" id="people_submit" name="people_submit" value="确认后，提交！" /></label>
      </span>
      <span class="mainarea">
      <label for="link_cancel"><input type="button" class="my_button" id="people_cancel" name="people_cancel" value="取消" /></label>
      </span>
    </div>
 </form>