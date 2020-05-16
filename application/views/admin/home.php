<?php if ( ! defined('ADMIN')) define('ADMIN', $this->config->item('admin_dir'));
if($viewer=='index') {   	
?>
<div id="workplace_inner">
  <div class="welcome_home"><span class="glyphicon glyphicon-dashboard"></span> 欢迎使用<?php echo $this->config->item('software_title');?>!</div>
  <div class="system_infor">
    <div class="user_infor">
      <div class="div_title"><span class="glyphicon glyphicon-user"></span> 用户信息</div>
      <div class="infor_lists">
        <ul>
          <li>
            <span class="title">用户名：</span>
            <span><?php echo $this->session->userdata('user_name')?></span>
            <span class="title">昵称：</span>
            <span><?php echo $this->session->userdata('nick_name')?></span>
            <span class="title">真名：</span>
            <span><?php echo $this->session->userdata('real_name')?></span>
          </li>
          <li>
            <span class="title">用户级别：</span>
            <span><?php $user_level=$this->config->item('user_level'); echo $user_level[$this->session->userdata('user_level')]; ?></span>
            <span class="title">修改密码：</span>
            <a id="amend_pass" href="#">点击修改</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="dynamic_infor">
      <div class="div_title"><span class="title_span"><span class="glyphicon glyphicon-info-sign"></span> 管理员内部通知信息</span><span class="more_span"><a href="<?php echo site_url(ADMIN.'/sys_notice'); ?>">更多</a></span></div>
      <div class="infor_lists">
        <ul id="notice_list">
          <?php 
           foreach($notices as $index => $value)
           echo '<li class="list_rows"><span class="items" id="notice_'.$value['notice_id'].'"><a href="javascript:void(0);">'.$value['notice_title'].'</a></span> <span class="date">'.date('Y-m-d',$value['post_time']).'</span></li>';
          ?>
        </ul>       
      </div>
    </div>
    <div class="system_envir">
      <div class="div_title"><span class="glyphicon glyphicon-align-justify"></span> 系统参数</div>
      <div class="infor_lists">
        <ul>
          <li><span class="title">当前IP：</span><span class="list_content"><?php echo $this->input->ip_address();?></span></li>
          <li><span class="title" style="vertical-align:top;">客户端来源：</span><span class="list_content" title="<?php echo $this->input->user_agent();?>"><?php echo $this->input->user_agent();?></span></li>
          <li><span class="title">当前时间：</span><span class="list_content"><?php echo date('Y-m-d:H:i:s',$this->input->server('REQUEST_TIME'));?></span></li>
          <li><span class="title">服务器环境：</span><span class="list_content"><?php echo PHP_OS.'/'.$this->input->server('SERVER_SOFTWARE').'/php'.PHP_VERSION;?></span></li>
        </ul>
      </div>
    </div>
    <div class="develope_infor">
      <div class="div_title"><span class="glyphicon glyphicon-fire"></span> 技术支持</div>
      <div class="infor_lists">
        <ul>
          <li><span class="title">联系院系：</span><span class="list_content"><a target=_blank href="http://<?php echo $this->config->item('support_url');?>"><?php echo $this->config->item('support_company');?></a></span></li>
          <li><span class="title">技术支持：</span><span class="list_content"><?php echo $this->config->item('developer');?></span></li>
          <li><span class="title">联系QQ：</span><span class="list_content"><?php echo $this->config->item('developer_qq');?> <a target=_blank href="tencent://message/?uin=<?php echo $this->config->item('developer_qq');?>&Site=一线网络&Menu=yes" ><img border="0" src="http://wpa.qq.com/pa?p=1:<?php echo $this->config->item('developer_qq');?>:5" width="55" height="13" alt="<?php echo $this->config->item('developer');?>"></a></span></li>
          <li><span class="title">支持电话：</span><span class="list_content"><?php echo $this->config->item('developer_tel');?></span></li>
          <li><span class="title">邮件地址：</span><span class="list_content"><?php echo $this->config->item('tech_email');?></span></li>
        </ul>
      </div>
    </div>    
  </div>
  <div class="home_right_column">
    <div class="latest_cms">
      <div class="div_title"><span class="glyphicon glyphicon-tasks"></span> 最新内容</div>
      <div class="infor_lists"></div>
    </div> 
    <div class="content_stat">
      <div class="div_title"><span class="glyphicon glyphicon-stats"></span> 数据统计</div>
      <div class="infor_lists"></div>
    </div>
	<div class="system_update">
      <div class="div_title"><span class="glyphicon glyphicon-bell"></span> 系统更新</div>
      <div class="infor_lists"></div>
    </div>
	<div class="commercial_linkers">
      <div class="div_title"><span class="glyphicon glyphicon-paperclip"></span> 赞助链接</div>
      <div class="infor_lists"></div>
    </div>
  </div>
  <div class="clear-both"></div>  
</div>
<script type="text/javascript">
  $(document).ready(function(){
	  window.opener=null; 
	  $('#left_column').show();

	  $('#amend_pass').click(function(){
          var obj=$(this);
          $.get(get_url(json_str.admin_base+"home/password/"),function(data){
        	  simple_viewer(obj.offset().left+40,obj.offset().top+40,data);
          }); 
	  });

	  $('#notice_list li span.items a').click(function(){
    	  var id = $(this).parent().attr('id').split('_');
    	  var obj=$('#'+$(this).parent().attr('id'));
    	  $.get(get_url(json_str.admin_base+"sys_notice/view/"+id[1]),function(data){
    	    	if(data) {
    				simple_viewer(obj.offset().left+50,obj.offset().top+10,data);
    			}
    			else top_message('对象不存在！');
    	    });
      });
	  
	  $('.home_right_column .infor_lists').html('正在读取...');
	  
	  $.get(get_url(json_str.admin_base+"home/latests"),function(data){
		  $('.latest_cms .infor_lists').html(data);
	  });
	  $.get(get_url(json_str.admin_base+"home/statistics"),function(data){
		  $('.content_stat .infor_lists').html(data);
	  });
	  $.get(get_url(json_str.admin_base+"home/version"),function(data){
		  $('.system_update .infor_lists').html(data);
	  });
	  $.get(get_url(json_str.admin_base+"home/sponsor"),function(data){
		  $('.commercial_linkers .infor_lists').html(data);
	  });
  });
</script>
<?php } else if($viewer=='password') {?>
  <form class="my_form"  style="width:350px;"  id="password_form" accept-charset="utf-8">
    <div class="form_title"><span class="glyphicon glyphicon-lock"></span> 修改管理密码</div>
    <div class="my_form_item">
      <label class="labeltag" style="width:80px;">原密码</label>
      <span class="mainarea">
      <input type="password" class="enterbox mediumarea filled" name="old_pass" id="old_pass" /><label>*</label>
      </span>      
    </div>
    <div class="my_form_item">
      <label class="labeltag" style="width:80px;">新密码</label>
      <span class="mainarea">
      <input type="password" class="enterbox mediumarea filled" name="new_pass" id="new_pass" /><label>*</label>
      </span>      
    </div>
    <div class="my_form_item">
      <label class="labeltag" style="width:80px;">确认新密码</label>
      <span class="mainarea">
      <input type="password" class="enterbox mediumarea filled" name="new_pass_cfm" id="new_pass_cfm" /><label>*</label>
      </span>      
    </div>
    <div class="my_form_item button_row">
      <label class="labeltag" style="width:80px;">&nbsp;</label>
      <span class="mainarea">
      <input type="button" class="my_button" id="pass_submit" name="pass_submit" value="确认后，提交！" />
      </span>
      <span class="mainarea">
      <input type="button" class="my_button" id="pass_cancel" name="pass_cancel" value="取消" />
      </span>
   </div>
  </form>
  <script type="text/javascript">
  $(document).ready(function(){

      var flag=1;

      $('#old_pass').live('change',function(){		
  		 check_pass($('#old_pass'));
  	  });
  	  
	  $('#new_pass').live('change',function(){		
		  $('#new_pass_cfm').val('');
		  $('#new_pass_cfm').removeAttr('style');
		  check_new_pass($('#new_pass'));
	  });
	  	
	  $('.new_pass_cfm').live('change',function(){ 
		 check_new_pass_cfm($('#new_pass_cfm'));
	  });

      $('#pass_cancel').live('click',function(){
          $('#simple_viewer').remove();
      });

      $('#pass_submit').live('click',function(){
    	  var data;
    	  var inputs = [];

    	  if(!check_pass($('#old_pass'))) return false;
          if(!check_new_pass($('#new_pass'))) return false;
          if(!check_new_pass_cfm($('#new_pass_cfm'))) return false;
          
    	  $('#password_form :input').not(':button').each(function() {
    		 $(this).removeAttr('style');
    		 inputs.push(this.name + '=' + this.value);
    	  });
    			 
    	  if(!flag) return false;

    	  data=inputs.join('&'); 
    	  data=data+'&pass_submit=ajax';
          
    	  $.ajax({
             type: 'post',
             data: data,
             url:   get_url(json_str.admin_base+"home/password"),
             success : function(data,textStatus){    	     
        	     try{ 
                    data=eval('(' + data + ')');
                    if(data.result=='1') {
                    	$('#simple_viewer').remove();
                    }
                    ajax_success(data,textStatus,'','json');                
                 } 
    			 catch(err){
    				 ajax_success('操作失败，请重试！',textStatus,'','string');
                 }
    	   },
    	   error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
          });	 
      });

      function check_pass(obj) {
        if($.trim(obj.val())=='') {
        	flag=0;
            obj.css({'border':'1px solid red'});
			top_message('请输入旧密码！');
			return false;
        }
        else {
        	flag=1;
  			obj.removeAttr('style');
  			return true;
        }
      }

      function check_new_pass(obj) {
        if(obj.val().length<6) {
              flag=0;
              obj.css({'border':'1px solid red'});
  			  top_message('密码长度至少是6个字符');
  			  return false;
  		}
  		else {
  			flag=1;
  			obj.removeAttr('style');
  			return true;
  		}
      }

      function check_new_pass_cfm(obj) {
    	if(obj.val()!=$('#new_pass').val()) { 
            flag=0;
            obj.css({'border':'1px solid red'});
  			top_message('两次输入的密码不一致');
  			return false;
  		}
  		else {
  			flag=1;
  			obj.removeAttr('style');
  			return true;
  		}
      }    
  });
  </script>
<?php }?>