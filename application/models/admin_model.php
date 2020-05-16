<?php  
class Admin_model extends CI_Model
{
	var $rights=array(
	  'advertise' => array(
	     'title' => '区块元素',
	     'functions' => array(
	        'submit' => '编辑元素',
	        'delete_advertise' => '删除元素'
	     )
	  ), 
	  'advertise_setting' => array(
	     'title' => '区块显示',
	     'functions' => array(
	        'edit'  => '编辑项目',
	        'add'   => '添加项目',
	        'delete_setting' => '删除项目'
	     )
	  ),
	  'blockip_admin' => array(
	     'title' => '封堵地址',
	     'functions' => array(
	        'add' => '新增封堵',
	        'delete_ip'  => '删除封堵'
	     )
	  ),  
	  'cms_class' => array(
	     'title' => '内容分类',
	     'functions' => array(
	        'move_class' => '移动分类',
	        'add'  => '添加分类',
	        'edit'  => '编辑分类',
	        'delete_class' => '删除分类',
	        'updown' => '升降分类'
	     )
	  ),
	  'cms_add' => array(
	     'title' => '内容发布',
	     'functions' => array(
	        'submit_article' => '发布文章',
	        'submit_video'  => '发布影片',
	        'submit_photo'  => '发布图片',
			'submit_download' => '发布下载'
	     )
	  ),
	  'cms_edit' => array(
	     'title' => '内容编辑',
	     'functions' => array(
	        'submit_article' => '编辑文章',
	        'submit_video'  => '编辑影片',
	        'submit_photo'  => '编辑图片',
			'submit_download' => '编辑下载'
	     )
	  ),
	  'cms_list' => array(
	     'title' => '内容管理',
	     'functions' => array(
	        'recommend' => '设置推荐',
	        'top' => '设置置顶', 			
			'headline' => '设置头条',
			'hide' => '设置隐藏',
			'locked' => '设置锁定',
		    'move_cms'  => '移动内容',
			'trash_cms'  => '入回收站',
	        'delete_cms'  => '删除内容',
	     )
	  ),
	  'cms_trash' => array(
	     'title' => '回收操作',
	     'functions' => array(
			'recycle_cms'  => '恢复内容',
	        'delete_cms'   => '删除内容',
	     )
	  ),
	  'comment' => array(
	     'title' => '评论管理',
	     'functions' => array(
	        'submit'  => '回复评论',
	        'delete_entries' => '删除评论',
	        'hide' => '隐藏显示'
	     )
	  ),
	  'file_manager' => array(
	     'title' => '文件管理',
	     'functions' => array(
	        'file_delete'  => '删除文件'
	     )
	  ),
	  'friendlink' => array(
	     'title' => '友情链接',
	     'functions' => array(	        
	        'recommend'  => '推荐条目',
	        'delete_link'  => '删除条目',
	        'submit' => '新增与编辑'
	     )
	  ),
	  'guestbook' => array(
	     'title' => '留言管理',
	     'functions' => array(	        
	        'delete_entries' => '删除反馈',
	        'hide' => '隐藏显示',
	        'recommend' => '推荐反馈',
	        'post' => '发布留言',
			'reply' => '回复留言'
	     )
	  ),
      'html_page' => array(
	     'title' => '静态页面',
	     'functions' => array(       
	        'delete_html' => '删除页面',
			'add' =>  '添加页面',
	        'edit' => '编辑页面',
			'hide' => '设置隐藏',
			'locked' => '设置锁定'
	     )
	  ),
	  'img_scroll' => array(
	     'title' => '滚动图片',
	     'functions' => array(       
	        'delete_scroll' => '删除条目',
	        'add' => '添加条目',
			'edit' => '编辑条目'
	     )
	  ),
	  'refresh_cache' => array(
	     'title' => '清空缓存',
	     'functions' => array(	        
	        'do_refresh'  => '清空缓存'
	     )
	  ),
	  'seo_admin' => array(
	     'title' => '优化管理',
	     'functions' => array(	        
	        'add'  => '添加优化',
	        'edit'  => '编辑优化',
	        'delete_seo' => '删除优化' 
	     )
	  ),
	  'skin_admin' => array(
	     'title' => '模板样式',
	     'functions' => array(
	        'select_skin' => '选择模板',
	        'edit_file'  => '编辑文件',
	        'add_file'   => '添加文件',
	        'delete_file' => '删除文件'
	     )
	  ),
	  'sys_config' => array(
	     'title' => '网站设置',
	     'functions' => array(	        
	        'add'  => '添加项目',
	        'edit' => '修改设置',
	        'delete_config' => '删除项目'	         
	     )
	  ),
	  'sys_notice' => array(
	     'title' => '内部通知',
	     'functions' => array(	        
	        'add'  => '发布通知',
	        'edit' => '修改通知',
	        'delete_notice' => '删除通知'	         
	     )
	  ),
	  'user_member' => array(
	     'title' => '用户管理',
	     'functions' => array(
			 'index'   => '查看列表',
			 'view'  => '查看用户',
			 'delete_user'  => '删除用户',
			 'set_life' => '激活用户',
			 'add' => '添加用户',
			 'edit' => '编辑用户'
	     )
	  ),
	  'user_online' => array(
	     'title' => '在线访客',
	     'functions' => array(	        
	        'delete_online'  => '临时踢出',
	        'block_ip' => '封堵访问', 	         
	     )
	  ),
	  'people' => array(
	     'title' => '人员管理',
	     'functions' => array(	        
	        'submit'  => '添加修改',
	        'hide'   => '隐藏人员',
	        'locked' => '锁定人员',
	        'delete_people' => '删除人员', 	         
	     )
	  ),
	  'publication' => array(
	     'title' => '论文著作',
	     'functions' => array(	        
	        'submit'  => '添加修改',
	        'delete_pub' => '删除对象', 	         
	     )
	  ),
	   'navi_admin' => array(
	     'title' => '导航设置',
	     'functions' => array(	        
	        'updown'  => '移动菜单项',
	        'add' => '添加菜单项',
			'edit' => '编辑菜单项',
			'mutiple_edit' =>'多重编辑',
			'clear_navi' => '清空导航',
			'delete_navi' => '删除菜单项'
	     )
	  ),
	  'excel_data' => array(
	     'title' => '导入导出',
	     'functions' => array(	        
	        'export_people'  => '导出人员',	
			'export_publication'  => '导出论文',
	        'import_people' => '导入人员', 
			'import_publication' => '导入论文'
	     )
	  )
	);

	function __construct() {
		parent::__construct();
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */