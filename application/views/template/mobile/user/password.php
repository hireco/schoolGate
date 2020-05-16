<div class="profile_form">
	<div class="form-group">
		<div class="input-group">
			<span  class="input-group-addon">旧密码：</span>
			<input type="password" class="form-control filled" name="old_pass" id="old_pass" />
		</div>
	</div>
	<div class="form-group">
		<div class="input-group">
			<span class="input-group-addon">新密码：</span>
			<input type="password" class="form-control filled" name="new_pass" id="new_pass" />
		</div>
	</div>
	<div class="form-group">
		<div class="input-group">
			<span class="input-group-addon">确认新密码：</span>
			<input type="password" class="form-control filled" name="new_pass_cfm" id="new_pass_cfm" />
		</div>
	</div>
	<div class="form-group">
		<input type="button"  class="btn btn-danger btn-block" name="amend_password"  id="amend_password"  value="点击提交" />
	</div>
</div>
<script type="text/javascript">
  $(document).ready(function(){

      var flag=1;

      $('#old_pass').change(function(){
 		 check_pass($('#old_pass'));
 	  });

	  $('#new_pass').change(function(){
		  $('#new_pass_cfm').val('');
		  remove_style($('#new_pass_cfm'));
		  check_new_pass($('#new_pass'));
	  });

	  $('#new_pass_cfm').change(function(){
		 check_new_pass_cfm($('#new_pass_cfm'));
	  });

	  $('#amend_password').click(function(){
		  var data;
		  var inputs = [];

		  if(!check_pass($('#old_pass'))) return false;
		  if(!check_new_pass($('#new_pass'))) return false;
		  if(!check_new_pass_cfm($('#new_pass_cfm'))) return false;

		  $('.profile_form :input').not(':button').each(function() {
			  remove_style($(this));
			  inputs.push(this.name + '=' + this.value);
		  });

		  if(!flag) return false;

		  data=inputs.join('&');
		  data=data+'&pass_submit=ajax&ajax=1';

		  $.ajax({
			  type: 'post',
			  data: data,
			  url:  get_url(json_str.base_url+"user/profile/password"),
			  beforeSend: function() {
				  $('#amend_password').addClass('disabled');
				  ajax_sending();
			  },
			  complete:function() {
				  ajax_complete();
			  },
			  success : function(data,textStatus){
				  try{
					  data=eval('(' + data + ')');
					  if(data.result=='1') {
						  spin_update('success');
						  ajax_success(data,textStatus,'reload','json');

					  }
					  else {
						  spin_update('error');
						  $('#amend_password').removeClass('disabled');
						  ajax_success(data,textStatus,'','json');
					  }
				  }
				  catch(err){
					  spin_update('error');
					  $('#amend_password').removeClass('disabled');
					  ajax_success('操作失败，请重试！',textStatus,'','string');
				  }
			  },
			  error   : function(XMLHttpRequest, textStatus, errorThrown){
				  spin_update('error');
				  $('#amend_password').removeClass('disabled');
				  ajax_failed(textStatus);
			  }
		  });
	  });

      function check_pass(obj) {
        if($.trim(obj.val())=='') {
        	top_message('请输入旧密码');
			set_style(obj,'error');
			flag=0;
			return false;
        }
        else {
        	remove_style(obj);
        	flag=1;
        	return true;
        }
      }

      function check_new_pass(obj) {
        if(obj.val().length<6) {
              flag=0;
              set_style(obj,'error');
  			  top_message('密码长度至少是6个字符');
  			  return false;
  		}
  		else {
  			flag=1;
  			remove_style(obj);
  			return true;
  		}
      }

      function check_new_pass_cfm(obj) {
    	if(obj.val()!=$('#new_pass').val()) {
            flag=0;
            set_style(obj,'error');
  			top_message('两次输入的密码不一致');
  			return false;
  		}
  		else {
  			flag=1;
  			remove_style(obj);
  			return true;
  		}
      }
  });
</script>  