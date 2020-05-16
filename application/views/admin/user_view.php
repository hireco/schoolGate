<?php if(!IS_AJAX)  echo '<div id="workplace_inner">'; ?>

<div class="my_form"  id="user_profile" data-for="<?php echo $user_id== $this->session->userdata('user_id')?'self':'other';?>">

    <div class="form_title"><?php echo $user_id== $this->session->userdata('user_id')?'我的':'用户';?>注册资料</div>

    <div class="my_form_item">

        <label class="labeltag top">个人图像</label>

          <span class="mainarea">

            <img class="avatar" src="<?php echo $avatar.'?'.time();?>"  />

          </span>

    </div>

    <div class="user_base_infor">

        <div class="my_form_item">

            <label class="labeltag">管理权</label>

          <span class="mainarea">

            <?php echo $user_admin=='0'?'无':'有';?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">会员级别</label>

          <span class="mainarea">

            <?php $data=$this->config->item('user_level'); echo $data[$user_level]; ?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">用户名</label>

          <span class="mainarea">

            <?php echo $user_name;?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">会员称呼</label>

            <span class="mainarea">

             <?php echo $called_name?$called_name:'未设定';?>

            </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">手机号码</label>

           <span class="mainarea">

             <?php echo $cellphone?$cellphone:'未设定';?> 

           </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">电子邮件</label>

          <span class="mainarea">

            <?php echo $email?$email:'未设定';?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">QQ号码</label>

          <span class="mainarea">

            <?php echo $qq?$qq:'未设定';?>

          </span>

        </div>

    </div>
    <div class="user_more_infor <?php echo !isset($user_id)?'hide':'';?>">

        <div class="my_form_item">

            <label class="labeltag">会员昵称</label>

           <span class="mainarea">

            <?php echo $nick_name?$nick_name:'未设定';?>

           </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">会员真名</label>

           <span class="mainarea">

            <?php echo $real_name?$real_name:'未设定';?>

           </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">会员性别</label>

          <span class="mainarea">

           <?php  echo $gender=='f'?'女':'男';?>  

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">出生日期</label>

          <span class="mainarea">

           <?php  echo $birthday?$birthday:'未设定'; ?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">职业类型</label>

          <span class="mainarea">

            <?php echo $career?$career:'未设定';?>

          </span>

        </div>

        <div class="my_form_item">

            <label class="labeltag">所在省份</label>

          <span class="mainarea">

            <?php echo $province?$province:'未设定';?>

          </span>

        </div>

        <?php if($user_id == $this->session->userdata('user_id')) { ?>
            <div class="my_form_item">

                <label class="labeltag">密码</label>

          <span class="mainarea">
              <label id="amend_pass" style="text-decoration:underline; cursor:pointer;">点击修改</label>
          </span>

            </div>
        <?php }  else {?>
            <div class="my_form_item">

                <label class="labeltag">编辑</label>

          <span class="mainarea">
              <input type="hidden" id="user_id" value="<?php echo $user_id;?>" />
              <label id="edit_user" style="text-decoration:underline; cursor:pointer;">点击编辑</label>
          </span>

            </div>
        <?php } ?>

    </div>

    <div class="clear_both"></div>

    <div class="my_form_item  button_row">

        <label class="labeltag"></label>

                  <span class="mainarea">

                   <input type="button" class="my_button" id="user_goback" name="user_goback" value="返回" />

                  </span>

    </div>

</div>

<?php if(!IS_AJAX)  echo '</div>'; ?>

<script>

    $(document).ready(function(){

        $('#edit_user').click(function(){
            edit_user($('#user_id').val());
        })

        $('#user_goback').click(function () {
            if($('#user_profile').data('for')=='other')
                refresh_user_list();
            else
                history.go(-1);
        });

        $('#amend_pass').click(function(){

            var obj=$(this);

            $.get(get_url(json_str.admin_base+"home/password/"),function(data){

                simple_viewer(obj.offset().left-300,obj.offset().top-240,data);

            });

        });

    });

</script>