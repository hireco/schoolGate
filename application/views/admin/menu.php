<?php if ( ! defined('ADMIN')) define('ADMIN', $this->config->item('admin_dir')); ?>

<ul class="navigator">

	<li><a href="<?php echo base_url().ADMIN; ?>"  class="top"><span class="glyphicon glyphicon-home"></span> 后台首页</a></li>

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-tasks"></span> 内容管理</a>

	    <ul class="navi-children">
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_list'); ?>">内容列表</a></li>
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_list/article'); ?>">文章列表</a></li> 	

	        <li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_list/photo'); ?>">图片列表</a></li>

	        <li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_list/video'); ?>">视频列表</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_list/download'); ?>">下载列表</a></li>

		</ul>

	</li> 

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-plus"></span> 内容发布</a>

	    <ul class="navi-children">

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_add/article'); ?>">文章发布</a></li>
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_add/photo'); ?>">图片发布</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_add/video'); ?>">视频发布</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/cms_add/download'); ?>">下载发布</a></li>

		</ul>

	</li>
	
	<li><a href="<?php echo site_url(ADMIN.'/cms_class'); ?>"><span class="glyphicon glyphicon-th-list"></span> 内容分类</a></li>   
	
	<li><a href="<?php echo site_url(ADMIN.'/html_page'); ?>"><span class="glyphicon glyphicon-file"></span> 单页管理</a></li>

	<li><a  href="<?php echo site_url(ADMIN.'/people'); ?>"  class="top"><span class="glyphicon glyphicon-certificate"></span> 人员管理</a>	</li>	

	<li><a  href="<?php echo site_url(ADMIN.'/publication'); ?>"  class="top"><span class="glyphicon glyphicon-book"></span> 论文著作</a>	</li>

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-comment"></span> 留言评论</a>

	    <ul class="navi-children">

	         <li><a class="sub" href="<?php echo site_url(ADMIN.'/guestbook'); ?>">留言管理</a></li>

	         <li><a class="sub" href="<?php echo site_url(ADMIN.'/comment'); ?>">评论管理</a></li>

	    </ul>

	</li>

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-user"></span> 系统用户</a>

	    <ul class="navi-children">

	         <li><a class="sub" href="<?php echo site_url(ADMIN.'/user_member'); ?>">用户管理</a></li>

	         <li><a class="sub" href="<?php echo site_url(ADMIN.'/user_online'); ?>">在线用户</a></li>

	         <li><a class="sub" href="<?php echo site_url(ADMIN.'/user_member/mine'); ?>">我的账号</a></li>

	    </ul>

	</li>

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-th"></span> 区块管理</a>

		<ul class="navi-children">

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/advertise'); ?>">区块元素</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/advertise_setting'); ?>">区块显示</a></li>

		</ul>

	</li>

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-wrench"></span> 辅助功能</a>

		<ul class="navi-children">
			 
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/file_manager'); ?>">附件管理</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/friendlink'); ?>">友情链接</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/img_scroll'); ?>">图片滚动</a></li>
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/sys_notice'); ?>">内部通知</a></li> 
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/excel_data'); ?>">导入导出</a></li>

		</ul>

	</li>	

	<li><a  href="javascript:void(0);"  class="top"><span class="glyphicon glyphicon-cog"></span>  系统设置</a>

		<ul class="navi-children">
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/navi_admin'); ?>">导航设置</a></li>
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/seo_admin'); ?>">优化设置</a></li>			
			
			<li><a class="sub" href="<?php echo site_url(ADMIN.'/redo_keywords'); ?>">清理标签</a></li>

			<li><a class="sub" href="<?php echo site_url(ADMIN.'/sys_config'); ?>">常用参数</a></li>

		    <li><a class="sub" href="<?php echo site_url(ADMIN.'/blockip_admin'); ?>">禁止来源</a></li>

		</ul>

	</li>

	<li><a href="<?php echo site_url(ADMIN.'/about'); ?>"  class="top"><span class="glyphicon glyphicon-tree-conifer"></span>  软件支持</a></li>

</ul>





