<div id="header_inner">

   <div class="app_title">

     <span id="admin_logo" title="<?php echo $this->config->item('app_title');?>"></span>

     <span id="ajax_loader_box"></span>

   </div>

   <div class="horizon_div">
     <div class="admin_avatar"><span class="glyphicon glyphicon-user"></span></div>
     <div class="hello">您好！<?php $nickname=$this->session->userdata('nick_name'); echo $nickname?$nickname:$this->config->item('default_nickname');?></div>

     <ul class="menu">

       <?php $admin_path=base_url().$this->config->item('admin_dir');?>

       <li><a href="<?php echo $admin_path;?>">首页</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/cms_list/article';?>">文章</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/cms_list/photo';?>">图片</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/cms_list/video';?>">视频</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/publication';?>">论文</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/people';?>">人员</a><span>|</span></li>

       <li><a href="<?php echo base_url();?>" target=_blank>前台</a><span>|</span></li>

       <li><a href="<?php echo $admin_path.'/logout'; ?>">注销</a></li>

     </ul>

   </div>

   <ul class="vice_menu"> 

      <li><a href="<?php echo $admin_path.'/guestbook';?>"><span class="glyphicon glyphicon-comment"></span> 留言</a></li>

      <li><a href="<?php echo $admin_path.'/friendlink';?>"><span class="glyphicon glyphicon-link"></span> 链接</a></li>

      <li><a href="<?php echo $admin_path.'/sys_config';?>"><span class="glyphicon glyphicon-cog"></span> 设置</a></li>

      <li><a href="<?php echo $admin_path.'/skin_admin';?>"><span class="glyphicon glyphicon-adjust"></span> 风格</a></li>

      <li><a href="<?php echo $admin_path.'/refresh_cache';?>"><span class="glyphicon glyphicon-refresh"></span> 更新</a></li>
	  
	  <li><a href="<?php echo $admin_path.'/cms_trash';?>"><span class="glyphicon glyphicon-trash"></span> 回收站</a></li>

   </ul>

</div>