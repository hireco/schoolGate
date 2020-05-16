<form class="my_form" id="user_form" accept-charset="utf-8"  autocomplete = "off">

        <div class="form_title">欢迎<?php echo isset($user_id)?'编辑':'添加新';?>用户</div>

        <?php if(isset($avatar)) {?>
            <div class="my_form_item">

                <label class="labeltag top">用户图像</label>

              <span class="mainarea">
                  <img class="avatar" src="<?php echo $avatar.'?'.time();?>"  />
              </span>

            </div>
        <?php } ?>

       <input type="hidden" id="user_id"  name="user_id"  value="<?php echo isset($user_id)?$user_id:0;?>" />

    <div class="user_base_infor">

       <div class="my_form_item">

         <label class="labeltag">管理权</label>

          <span class="mainarea">

            <input type="radio" name="user_admin" id="user_admin_0" value="0"  <?php echo isset($user_admin)?($user_admin=='0'?'checked="checked"':''):'';?> /><label>无</label>

            <input type="radio" name="user_admin" id="user_admin_1" value="1"  <?php echo $this->session->userdata('user_level')!='3.0'?'disabled="disabled"':'';  echo isset($user_admin)?($user_admin=='1'?'checked="checked"':''):'';?> /><label>有</label>

          </span>      

       </div>

       <div class="my_form_item">

         <label class="labeltag">用户级别</label>

          <span class="mainarea">

            <?php foreach ($this->config->item('user_level') as $index => $value) { 

              if($value!='访客') {

                  echo '<input type="radio" name="user_level" id="user_level_'.str_replace('.', '_',$index).'" value="'.$index.'"'; 

                  echo isset($user_level)?($user_level==$index?'checked="checked"':''):'';

                  if($this->session->userdata('user_level')!='0.0' && $index <= $this->session->userdata('user_level')) echo ' disabled="disabled" ';

                  echo ' /><label>'.$value.'</label>'; 

                  echo "\n";

              }            	 

            }

            ?>

          </span>      

       </div>

        <div class="my_form_item">

            <label class="labeltag">是否体验用户</label>

            <span class="mainarea">

            <input type="checkbox"  name="try_user" id="try_user" value="1" <?php echo isset($try_user) ? ($try_user?'checked="checked"':'') : '';?> /><label>体验用户除了不可修改密码外，与正式用户一样</label>

          </span>

        </div>

       <div class="my_form_item">

         <label class="labeltag">用户名</label>

          <span class="mainarea">

            <input type="text" class="enterbox shortarea filled" name="user_name" id="user_name" value="<?php echo isset($user_name)?$user_name:'';?>" /><label>*登录账号</label>
          </span>      

       </div>

       <div class="my_form_item">

         <label class="labeltag">密码</label>

          <span class="mainarea">

            <input type="text" class="enterbox shortarea <?php echo !isset($user_id)?'filled':'';?>" name="user_pass" id="user_pass" value="" /><label>*<?php echo !isset($user_id)?'登录密码':'留空则不变';?></label>

          </span>      

       </div>

       <div class="my_form_item">

          <label class="labeltag">用户称呼</label>

            <span class="mainarea">

             <input type="text" class="enterbox shortarea" name="called_name" id="called_name" value="<?php echo isset($called_name)?$called_name:'';?>" /><label>*例如张先生，王小姐等</label>

            </span>      

          </div>

        <div class="my_form_item">

            <label class="labeltag">真实姓名</label>

           <span class="mainarea">

            <input type="text" class="enterbox shortarea" name="real_name" id="real_name" value="<?php echo isset($real_name)?$real_name:'';?>" /><label>*管理用户必须注明真实姓名</label>

           </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">电子邮件</label>

          <span class="mainarea">

            <input type="text" class="enterbox mediumarea" name="email" id="email" value="<?php echo isset($email)?$email:'';?>" /> <label>*个人电子邮件</label> <label style="cursor:pointer;text-decoration:underline;" id="fullinfor_clicker">完整用户资料</label>

          </span>

        </div>

       </div>

       <div class="user_more_infor <?php  echo !isset($user_id)?'hide':''; ?>">

           <div class="my_form_item">

               <label class="labeltag">用户昵称</label>

           <span class="mainarea">

            <input type="text" class="enterbox shortarea" name="nick_name" id="nick_name" value="<?php echo isset($nick_name)?$nick_name:'';?>" />  <label>显示在前台</label>

           </span>

           </div>

         <div class="my_form_item">

         <label class="labeltag">用户性别</label>

          <span class="mainarea">

            <input type="radio" class="radio" name="gender"  value="f"  <?php echo isset($gender)?($gender=='f'?'checked="checked"':''):'';?>  /><label>女</label>

            <input class="radio" style="margin-left:20px;" type="radio" name="gender" value="m" <?php echo isset($gender)?($gender=='m'?'checked="checked"':''):'';?> /><label>男</label>

          </span>

         </div>

         <div class="my_form_item">

         <label class="labeltag">出生日期</label>

          <span class="mainarea">

            <input type="text" class="enterbox shortarea" name="birthday" id="birthday" value="<?php echo isset($birthday)?$birthday:'';?>" />

          </span>

         </div>

         <div class="my_form_item">

         <label class="labeltag">职业类型</label>

          <span class="mainarea">

            <input type="text" class="enterbox shortarea" name="career" id="career" value="<?php echo isset($career)?$career:'';?>" />

          </span>

         </div>

         <div class="my_form_item">

         <label class="labeltag">所在省份</label>

          <span class="mainarea">

            <input type="text" class="enterbox shortarea" name="province" id="province" value="<?php echo isset($province)?$province:'';?>" />

          </span>

         </div>

         <div class="my_form_item">

         <label class="labeltag">QQ号码</label>

          <span class="mainarea">

            <input type="text" class="enterbox mediumarea" name="qq" id="qq" value="<?php echo isset($qq)?$qq:'';?>" />

          </span>

         </div>

           <div class="my_form_item">

               <label class="labeltag">手机号码</label>

           <span class="mainarea">

            <input type="text" class="enterbox mediumarea" name="cellphone" id="cellphone" value="<?php echo isset($cellphone)?$cellphone:'';?>" />

           </span>

           </div>

      </div>

      <div class="clear_both"></div>

      <div class="my_form_item button_row">

        <label class="labeltag"></label>

        <span class="mainarea">

          <input type="button" class="my_button" id="user_submit" name="user_submit" value="确认后，提交！" />

        </span>

        <span class="mainarea">

          <input type="button" class="my_button" id="user_cancel" name="user_cancel" value="取消" />

        </span>

     </div>    

</form>

<script>

 $(document).ready(function(){

	 if($('#user_id').val()=='0') {

		 $('#user_admin_0').attr('checked',true);

		 $('[name="user_level"]').eq(3).attr('checked',true);

		 $('[name="gender"]').last().attr('checked',true);

	 }



     addcss2head('js/calendar/calendar-green.css');

     Calendar.setup({

		 inputField     :    "birthday",

		 ifFormat       :    "%Y-%m-%d",

		 showsTime      :    false,

		 timeFormat     :    "24"

	 });

 });

</script>