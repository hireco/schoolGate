<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['admin_big_js']=array(
 'js/jquery-1.7.min.js',
 'js/jquery-ui-1.8.14.custom.min.js'
);//后台大js文件，这些文件比较大，应该优先客户端缓存，防止被多次下载消耗带宽

$config['common_admin_js']=array(
 'js/jquery.blockUI.js',
 'js/jsfunction.js',
 'js/admin/myjquery-common-admin.js'
);//后台通用js, 这些文件数量多体积小，所以应该合并以减少http连接次数

$config['js_version']='201206';

$config['username_most_length']="15";
$config['username_least_length']="5";
$config['nickname_most_length']='15';
$config['password_least_length']="8";
$config['password_most_length']="40";
$config['intro_most_length']="200";
$config['type_name_most_length']="12";
$config['type_name_least_length']="2";
$config['privacy_link_life']=24*3600;
$config['max_type_level']=3;

$config['thumb_prefix']='t_'; //不要中途修改！

$config['site_base']="http://".$_SERVER["HTTP_HOST"];
$config['admin_dir']='webadmin';
$config['upload_dir']='upload';
$config['httpdown_dir']='down';

//subdirectories under upload or down etc.
//some of them should be according with FCK configration. 
$config['image_dir']='image';
$config['album_dir']='album';
$config['file_dir']='file';
$config['media_dir']='media';
$config['flash_dir']='flash'; 
$config['scroll_dir']='scroll'; 
$config['class_dir']='class';
$config['ads_dir']='ads';

$config['upload_files']='txt|jpg|jpeg|bmp|gif|png|swf|flv|rmvb|rm|avi|mp3|mp4|doc|pdf|css|js|html|htm|ppt|xls|rar|zip|gz';
$config['upload_type_class']=array(
'image' => array('jpg','jpeg','png','bmp','gif'),
'flash' => array('swf','flv'),
'media' => array('rmvb','rm','avi','mp3','mp4'),
'file'  => array('txt','doc','pdf','css','js','html','htm','ppt','xls','rar','zip','gz')
); //后台上传的附件的种类

$config['app_title']='学院网站管理系统';
$config['admin_title']='学院后台管理系统';
$config['app_version']='SchoolGate-1.0';
$config['copyright']='Copyright 2011-2020 All Rights Reserved 某某大学某某学院版权所有';
$config['complaint_email']='snellings@163.com';
$config['support_company']='一线网络';
$config['support_url']='www.sitepage.cn';
$config['software_title']='SchoolGate学院网站系统';
$config['tech_qq']='11484251';
$config['tech_email']='11484251@qq.com';
$config['developer']='东阿克米';
$config['developer_qq']='11484251';
$config['developer_tel']='13570020837';

$config['cms_model']=array(
  1 => array('name' => '文章', 'table' => 'article', 'brief' => 'a'),
  2 => array('name' => '图片', 'table' => 'photo', 'brief' => 'p'),
  3 => array('name' => '视频', 'table' => 'video', 'brief' => 'v'),
  4 => array('name' => '下载', 'table' => 'download', 'brief' => 'd')
);

$config['child_type']='class'; //拥有子类的分类是否可以含有内容,both表示可以，否则为class

$config['comment_type']=array(
'article'  => '文章',
'photo'    => '图片',
'video'    => '影片',
'download' => '下载',
'page'     => '单页'
);

$config['user_level']=array(
  '0.0' => '超级管理员',
  '1.0' => '普通管理员',
  '2.0' => '高级用户',
  '3.0' => '普通用户',
  '4.0' => '访客'
); //以便日后添加中间的级别，可以用小数如1.5等

$config['default_admin']='管理员';
$config['default_nickname']='网友';
$config['default_realname']='不露真名';

//SEO的分类设置
$config['seo_class']=array('文章','图片','视频','下载','其他');

//站点设置分类
$config['cfg_class']=array('机构设置','网站设置','图片设置','内容设置','数据显示');

//内部信息分类
$config['notice_class']=array('人事信息','招生信息','网站管理','其他信息');

//栏目首页模式
$config['index_type']=array(
   'children' => '下级内容列表',
   'first' => '第一个子类',
   'single' => '指定单页'
);

//时间默认为中国大陆时间
date_default_timezone_set("PRC");

/* End of file MY_config.php */
/* Location: ./application/config/MY_config.php */
