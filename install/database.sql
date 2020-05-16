SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP TABLE IF EXISTS `add_about`;
CREATE TABLE IF NOT EXISTS `add_about` (
  `about_id` tinyint(4) unsigned NOT NULL,
  `about_name` varchar(10) NOT NULL,
  `about_content` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_ads`;
CREATE TABLE IF NOT EXISTS `add_ads` (
  `ads_id` int(11) unsigned NOT NULL,
  `ads_title` varchar(20) NOT NULL,
  `ads_width` smallint(6) unsigned NOT NULL,
  `ads_height` smallint(6) unsigned NOT NULL,
  `ads_type` varchar(10) NOT NULL,
  `ads_content` varchar(5000) NOT NULL,
  `ads_hint` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_ads_setting`;
CREATE TABLE IF NOT EXISTS `add_ads_setting` (
  `setting_id` int(11) unsigned NOT NULL,
  `setting_name` varchar(15) NOT NULL,
  `setting_value` varchar(30) NOT NULL,
  `system` char(1) NOT NULL DEFAULT '0',
  `direction` char(1) NOT NULL DEFAULT 'v'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_guestbook`;
CREATE TABLE IF NOT EXISTS `add_guestbook` (
  `guest_id` int(11) unsigned NOT NULL,
  `parent_id` int(11) unsigned NOT NULL DEFAULT '0',
  `guest_name` varchar(15) NOT NULL,
  `top_type` varchar(10) NOT NULL,
  `sub_type` varchar(10) NOT NULL,
  `guest_telephone` varchar(13) DEFAULT NULL,
  `guest_topic` varchar(25) NOT NULL,
  `guest_content` varchar(200) NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `post_ip` varchar(15) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `checked` char(1) NOT NULL DEFAULT '0',
  `processed` char(1) NOT NULL DEFAULT '0',
  `recommend` int(10) unsigned NOT NULL DEFAULT '0',
  `hide` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_html`;
CREATE TABLE IF NOT EXISTS `add_html` (
  `html_id` smallint(6) unsigned NOT NULL,
  `group_id` smallint(6) NOT NULL,
  `en_title` varchar(40) NOT NULL,
  `cn_title` varchar(20) NOT NULL,
  `html_content` text NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_modify` int(10) unsigned NOT NULL,
  `last_editor` int(11) unsigned NOT NULL,
  `full_page` char(1) NOT NULL DEFAULT '0',
  `locked` char(1) NOT NULL DEFAULT '0',
  `hide` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_link`;
CREATE TABLE IF NOT EXISTS `add_link` (
  `link_id` int(11) unsigned NOT NULL,
  `link_url` varchar(50) NOT NULL,
  `link_title` varchar(12) NOT NULL,
  `link_logo` varchar(60) DEFAULT NULL,
  `recommend` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_navigation`;
CREATE TABLE IF NOT EXISTS `add_navigation` (
  `navi_id` int(11) unsigned NOT NULL,
  `navi_title` varchar(10) NOT NULL,
  `navi_title_en` varchar(50) NOT NULL,
  `navi_url` varchar(100) NOT NULL,
  `navi_target` char(1) NOT NULL,
  `parent_id` smallint(6) unsigned NOT NULL,
  `navi_priority` int(11) NOT NULL,
  `navi_type` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_navigation_type`;
CREATE TABLE IF NOT EXISTS `add_navigation_type` (
  `navi_type_id` smallint(6) NOT NULL,
  `navi_type` varchar(10) NOT NULL,
  `navi_name` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `add_navigation_type` (`navi_type_id`, `navi_type`, `navi_name`) VALUES
(1, 'main', '主页导航'),
(2, 'mb-main', '移动版导航');

DROP TABLE IF EXISTS `add_people`;
CREATE TABLE IF NOT EXISTS `add_people` (
  `people_id` int(11) unsigned NOT NULL,
  `user_name` varchar(15) NOT NULL,
  `en_id` varchar(24) NOT NULL,
  `en_name` varchar(25) NOT NULL,
  `cn_name` varchar(10) NOT NULL,
  `gender` char(1) NOT NULL DEFAULT 'm',
  `born_year` varchar(4) NOT NULL,
  `avatar` varchar(80) NOT NULL,
  `title_id` char(2) NOT NULL,
  `degree` varchar(10) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `office` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `personal_site` varchar(60) NOT NULL,
  `details` text NOT NULL,
  `locked` char(1) NOT NULL DEFAULT '0',
  `hide` char(1) NOT NULL DEFAULT '0',
  `html_dir` varchar(15) NOT NULL,
  `hide_phone` char(1) NOT NULL DEFAULT '0',
  `hide_email` char(1) NOT NULL DEFAULT '0',
  `hide_born_year` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_publication`;
CREATE TABLE IF NOT EXISTS `add_publication` (
  `pub_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `pub_type` varchar(10) NOT NULL,
  `pub_title` varchar(200) NOT NULL,
  `authors` varchar(100) NOT NULL,
  `pub_details` varchar(200) NOT NULL,
  `pub_file` varchar(200) NOT NULL,
  `pub_time` varchar(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_scroll`;
CREATE TABLE IF NOT EXISTS `add_scroll` (
  `scroll_id` int(11) unsigned NOT NULL,
  `scroll_title` varchar(10) NOT NULL,
  `photo_list` varchar(1200) NOT NULL,
  `photo_description` varchar(1000) NOT NULL,
  `photo_caption` varchar(400) NOT NULL,
  `photo_link` varchar(2000) NOT NULL,
  `photo_width` smallint(6) unsigned NOT NULL,
  `photo_height` smallint(6) unsigned NOT NULL,
  `thumb_width` smallint(6) unsigned NOT NULL,
  `thumb_height` smallint(6) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `add_seo`;
CREATE TABLE IF NOT EXISTS `add_seo` (
  `seo_id` int(11) unsigned NOT NULL,
  `seo_name` varchar(15) NOT NULL,
  `seo_class` varchar(6) NOT NULL,
  `seo_title` varchar(20) NOT NULL,
  `seo_keywords` varchar(50) NOT NULL,
  `seo_description` varchar(100) NOT NULL,
  `uri_string` varchar(100) NOT NULL,
  `system` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE IF NOT EXISTS `cms_article` (
  `content_id` int(11) unsigned NOT NULL,
  `index_id` int(11) unsigned NOT NULL,
  `article_body` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_class`;
CREATE TABLE IF NOT EXISTS `cms_class` (
  `class_id` smallint(6) unsigned NOT NULL,
  `class_name` varchar(10) NOT NULL,
  `class_name_en` varchar(40) NOT NULL,
  `model_id` varchar(5) NOT NULL,
  `parent_id` smallint(6) unsigned NOT NULL,
  `class_level` tinyint(4) unsigned NOT NULL,
  `class_keywords` varchar(50) NOT NULL,
  `class_description` varchar(100) NOT NULL,
  `class_priority` smallint(6) unsigned NOT NULL,
  `recommend` int(10) unsigned NOT NULL,
  `class_admin` varchar(50) NOT NULL,
  `last_activity` varchar(50) NOT NULL,
  `class_hide` char(1) NOT NULL DEFAULT '0',
  `icon_image` varchar(80) NOT NULL,
  `banner_image` varchar(80) NOT NULL,
  `refer_class` varchar(30) NOT NULL,
  `index_page` varchar(10) NOT NULL,
  `view_right` float(2,1) NOT NULL DEFAULT '0.0',
  `list_mode` char(1) NOT NULL DEFAULT 'l'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_download`;
CREATE TABLE IF NOT EXISTS `cms_download` (
  `content_id` int(11) unsigned NOT NULL,
  `index_id` int(11) unsigned NOT NULL,
  `introduction` varchar(1000) NOT NULL,
  `file_path` varchar(1000) NOT NULL,
  `file_title` varchar(1000) NOT NULL,
  `show_mode` char(1) NOT NULL DEFAULT 'g'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_index`;
CREATE TABLE IF NOT EXISTS `cms_index` (
  `index_id` int(11) unsigned NOT NULL,
  `class_id` smallint(6) unsigned NOT NULL,
  `vice_class_id` smallint(6) unsigned NOT NULL,
  `model_id` tinyint(4) unsigned NOT NULL,
  `content_id` int(11) unsigned NOT NULL,
  `cms_title` varchar(40) NOT NULL,
  `cms_title_en` varchar(80) NOT NULL,
  `cms_stitle` varchar(10) NOT NULL,
  `cms_source` varchar(10) NOT NULL,
  `cms_writer` varchar(10) DEFAULT NULL,
  `cms_keywords` varchar(30) NOT NULL,
  `cms_description` varchar(100) NOT NULL,
  `icon_image` varchar(100) NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `jump_url` varchar(100) NOT NULL,
  `read_times` smallint(6) unsigned NOT NULL DEFAULT '0',
  `view_right` float(2,1) NOT NULL DEFAULT '0.0',
  `title_color` char(7) NOT NULL,
  `title_strong` char(1) NOT NULL DEFAULT '0',
  `comments` char(1) NOT NULL DEFAULT '1',
  `recommend` int(10) unsigned NOT NULL,
  `top` int(10) unsigned NOT NULL,
  `hide` char(1) NOT NULL DEFAULT '0',
  `headline` int(10) unsigned NOT NULL,
  `last_modify` int(10) unsigned NOT NULL,
  `last_editor` int(11) unsigned NOT NULL,
  `relate_list` varchar(100) NOT NULL,
  `locked` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_photo`;
CREATE TABLE IF NOT EXISTS `cms_photo` (
  `content_id` int(11) unsigned NOT NULL,
  `index_id` int(11) unsigned NOT NULL,
  `introduction` varchar(500) NOT NULL,
  `photo_list` varchar(2500) NOT NULL COMMENT 'pic1:pic2:pic3:....',
  `photo_title` varchar(1000) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_trash`;
CREATE TABLE IF NOT EXISTS `cms_trash` (
  `index_id` int(11) unsigned NOT NULL,
  `class_id` smallint(6) unsigned NOT NULL,
  `vice_class_id` smallint(6) unsigned NOT NULL,
  `model_id` tinyint(4) unsigned NOT NULL,
  `content_id` int(11) unsigned NOT NULL,
  `cms_title` varchar(40) NOT NULL,
  `cms_title_en` varchar(80) NOT NULL,
  `cms_stitle` varchar(10) NOT NULL,
  `cms_source` varchar(10) NOT NULL,
  `cms_writer` varchar(10) DEFAULT NULL,
  `cms_keywords` varchar(30) NOT NULL,
  `cms_description` varchar(100) NOT NULL,
  `icon_image` varchar(100) NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `jump_url` varchar(100) NOT NULL,
  `read_times` smallint(6) unsigned NOT NULL DEFAULT '0',
  `view_right` float(2,1) NOT NULL DEFAULT '0.0',
  `title_color` char(7) NOT NULL,
  `title_strong` char(1) NOT NULL DEFAULT '0',
  `comments` char(1) NOT NULL DEFAULT '1',
  `recommend` int(10) unsigned NOT NULL,
  `top` int(10) unsigned NOT NULL,
  `hide` char(1) NOT NULL DEFAULT '0',
  `headline` int(10) unsigned NOT NULL,
  `last_modify` int(10) unsigned NOT NULL,
  `last_editor` int(11) unsigned NOT NULL,
  `relate_list` varchar(100) NOT NULL,
  `locked` char(1) NOT NULL DEFAULT '0',
  `trash_time` int(10) unsigned NOT NULL,
  `trasher` int(11) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cms_video`;
CREATE TABLE IF NOT EXISTS `cms_video` (
  `content_id` int(11) unsigned NOT NULL,
  `index_id` int(11) unsigned NOT NULL,
  `introduction` varchar(1000) NOT NULL,
  `video_html` varchar(500) NOT NULL,
  `video_url` varchar(200) DEFAULT NULL,
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sys_blockip`;
CREATE TABLE IF NOT EXISTS `sys_blockip` (
  `ip_id` int(11) unsigned NOT NULL,
  `ip_address` varchar(15) NOT NULL,
  `block_reason` varchar(20) NOT NULL,
  `block_time` int(10) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE IF NOT EXISTS `sys_config` (
  `config_id` smallint(6) unsigned NOT NULL,
  `config_title` varchar(12) NOT NULL,
  `config_name` varchar(30) NOT NULL,
  `config_value` varchar(100) NOT NULL,
  `config_description` varchar(30) NOT NULL,
  `config_class` varchar(10) NOT NULL,
  `input_type` varchar(10) NOT NULL DEFAULT 'text',
  `system` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `sys_config` (`config_id`, `config_title`, `config_name`, `config_value`, `config_description`, `config_class`, `input_type`, `system`) VALUES
(1, '全局关键字', 'keywords', '高能物理，粒子物理，光学，凝聚态物理，材料物理与化学，天体物理', '全局使用的关键字', '网站设置', 'textarea', '1'),
(2, '全局描述', 'description', '北方大学，作为北京市属重点高校，其物理化学学院具有一流的教学和科研力量，面向全国招生，欢迎加入。', '网站的描述，首页meta描述', '网站设置', 'textarea', '1'),
(3, '网站名称', 'site_name', '北方大学物理化学学院', '网站名称，例如湖南旅游之窗', '网站设置', 'text', '1'),
(4, '网站首页标题', 'site_title', '欢迎光临北方大学物理化学学院', '网站首页标题', '网站设置', 'text', '1'),
(5, '机构名称', 'organization', '北方大学物理与化学学院', '机构名称', '机构设置', 'text', '1'),
(6, 'icp备案号', 'icp', '粤ICP备1603254号', 'icp备案号', '网站设置', 'text', '1'),
(7, '内容自动图标大小', 'cms_icon_size', '120:80', '文章，图片，视频自动获取图标宽高比', '图片设置', 'text', '1'),
(8, '内容来源列表', 'source', '华工新闻网,广州日报,南方日报', '内容来源，用“,”间隔，要求半角', '内容设置', 'textarea', '1'),
(9, '作者列表', 'writer', '研究主任,本站编辑', '作者，用“,”间隔，要求半角', '内容设置', 'textarea', '1'),
(10, '默认内容来源', 'default_source', '物理化学学院', '默认内容来源', '内容设置', 'text', '1'),
(11, '默认内容作者', 'default_writer', '本站编辑', '默认内容作者', '内容设置', 'text', '1'),
(12, '图片水印', 'add_watermark', '1', '图片是否加水印', '图片设置', 'radio', '1'),
(13, '下载远程资源', 'get_remote', '0', '是否下载远程资源', '内容设置', 'radio', '1'),
(14, '删除站外链接', 'del_link', '0', '是否删除站外链接', '内容设置', 'radio', '1'),
(15, '检查内容模型', 'check_model', '1', '发布内容时，是否检查内容模型的匹配性', '内容设置', 'radio', '1'),
(16, '网站域名', 'site_dns', 'example.com', '网站域名，含www', '网站设置', 'text', '1'),
(17, '办公地点', 'address', '北京市海淀区东方街第五路291号', '办公详细地点', '机构设置', 'text', '1'),
(18, '机构电话', 'main_telephone', '020-85543288', '联系电话', '机构设置', 'text', '1'),
(19, '机构传真', 'fax', '020-35531800', '机构传真号码', '机构设置', 'text', '1'),
(20, '电子邮件', 'email', 'webmaster@example.com', '电子邮件地址', '机构设置', 'text', '1'),
(21, '版权信息', 'copyright', '版权所有 北方大学物理化学学院(example.com)', '网站版权信息', '网站设置', 'text', '1'),
(22, '相册图片裁剪大小', 'album_img_size', '700:500', '相册图片的裁剪宽高比', '图片设置', 'text', '1'),
(23, '一般图片裁剪大小', 'image_img_size', '600:480', '普通图片的裁剪宽高比', '图片设置', 'text', '1'),
(24, '栏目图标大小', 'class_icon_size', '100:100', '栏目图标的宽高比', '图片设置', 'text', '1'),
(25, '栏目banner大小', 'class_banner_size', '400:100', '栏目banner的宽高比', '图片设置', 'text', '1'),
(26, '后台登陆验证', 'admin_captcha', '1', '后台登陆是否启用验证码', '网站设置', 'radio', '1'),
(27, '关闭网站访问', 'site_closed', '0', '对非管理用户是否关闭网站前台访问', '网站设置', 'radio', '1'),
(28, '网站关闭原因', 'closed_infor', '网站正在排除故障，故暂时关闭，请稍侯再来！', '当网站设置为关闭时，此项生效', '网站设置', 'text', '1'),
(29, '新闻页滚动图片组ID', 'cms_scroll_id', '8', '新闻页滚动图片组的调用ID，请在滚动图片列表中获取', '数据显示', 'text', '0'),
(30, '新评论隐藏时间值', 'comment_hide_time', '300', '新评论内容隐藏时间，单位：秒', '数据显示', 'text', '0'),
(31, 'IP数据隐藏部分数', 'ip_hidden_num', '2', 'IP地址四个部分隐藏的数量，最少1个，最多4个', '数据显示', 'text', '0'),
(32, '访客IP对外隐藏', 'ip_hide', '1', '在评论，留言前台显示中是否隐藏IP', '数据显示', 'radio', '0'),
(33, '留言和评论的法律提示', 'post_state', '文明社会从理性发帖开始，谢绝带有地域攻击和人身攻击、有关政治的言论；禁止有损社会安定、民族团结的言论。网友评论仅供网友表达个人看法，并不表明本站同意其观点或证实其描述。', '简短的说明有关留言和评论的注意事项', '数据显示', 'textarea', '0'),
(34, '首页滚动图片组ID', 'index_scroll_id', '7', '首页滚动图片组的调用ID，请在滚动图片列表中获取', '数据显示', 'text', '0'),
(35, '用户可上传的文件类型', 'user_filetypes', 'html,htm,js,css,jpg,png,gif,bmp,jpeg,doc,pdf,ps,rar,zip,eps', '用户可以上传或者被打包后上传的文件类型，用,间隔', '网站设置', 'text', '1'),
(36, '内容列表每页显示的数', 'cms_per_page_num', '15', '内容列表每页显示的数目', '数据显示', 'text', '0'),
(37, '图片分页模式', 'photo_page_mode', 'client', '选择服务器端分页，填写server，否则填写client', '数据显示', 'text', '0'),
(38, '文章分页模式', 'article_page_mode', 'client', '选择服务器端分页，填写server，否则填写client', '数据显示', 'text', '0'),
(39, '是否开放注册', 'register_open', '1', '开放注册条件，若为1则开放，否则禁止注册', '网站设置', 'radio', '1'),
(40, '缩略图显示保持比例', 'thumb_keep_scale', '1', '缩略图的显示是否保持原有的比例', '数据显示', 'radio', '0'),
(41, '人员图片裁剪大小', 'people_avatar_size', '144:160', '人员展示部分图像裁剪的宽和高', '图片设置', 'text', '1'),
(42, '文章缩略图大小', 'article_icon_size', '150:117', '文章内容缩略图片的宽和高的值', '图片设置', 'text', '1'),
(43, '图片内容缩略图大小', 'photo_icon_size', '150:100', '图片内容的缩略图的宽和高', '图片设置', 'text', '1'),
(44, '视频内容的缩略图大小', 'video_icon_size', '100:80', '视频内容的缩略图的宽和高的值', '图片设置', 'text', '1'),
(45, '缓存时间设置', 'cache_time', '0', '是否启用全站缓存，填写缓存分钟数，若0为则不缓存', '网站设置', 'text', '1'),
(46, '自定义导航', 'navigation', '1', '是否启用自定义导航功能', '网站设置', 'radio', '1'),
(47, '首页推荐栏目', 'index_columns', '109,58,5,32,19,5,30,33', '首页推荐栏目ID,以逗号间隔', '数据显示', 'text', '0'),
(48, '开放评论', 'open_comment', '1', '是否开放前台评论', '网站设置', 'radio', '0');

DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE IF NOT EXISTS `sys_notice` (
  `notice_id` int(11) unsigned NOT NULL,
  `notice_title` varchar(20) NOT NULL,
  `notice_class` varchar(10) NOT NULL,
  `notice_content` varchar(1000) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `post_ip` varchar(15) NOT NULL,
  `system` char(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `sys_skin`;
CREATE TABLE IF NOT EXISTS `sys_skin` (
  `skin_id` smallint(6) unsigned NOT NULL,
  `skin_name` varchar(20) NOT NULL,
  `skin_title` varchar(20) NOT NULL,
  `js_dir` varchar(30) NOT NULL,
  `template_path` varchar(30) NOT NULL,
  `skin_dir` varchar(30) NOT NULL,
  `main_css` varchar(50) NOT NULL,
  `is_mobile` tinyint(1) NOT NULL DEFAULT '0',
  `selected` char(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `sys_skin` (`skin_id`, `skin_name`, `skin_title`, `js_dir`, `template_path`, `skin_dir`, `main_css`, `is_mobile`, `selected`) VALUES
(1, 'default', '默认模板', 'js/template/default', 'template/default/', 'skin/default', 'skin/default/css/main.css', 0, '0'),
(2, 'school', '学院派', 'js/template/school', 'template/school/', 'skin/school', 'skin/school/css/main.css', 0, '1'),
(3, 'mobile', '移动端', 'js/template/mobile', 'template/mobile/', 'skin/mobile', 'skin/mobile/css/main.css', 1, '1'),
(4, 'deepblue', '深蓝', 'js/template/deepblue', 'template/deepblue/', 'skin/deepblue', 'skin/deepblue/css/main.css', 0, '0');

DROP TABLE IF EXISTS `user_comment`;
CREATE TABLE IF NOT EXISTS `user_comment` (
  `comment_id` int(11) unsigned NOT NULL,
  `object_id` int(11) unsigned NOT NULL,
  `object_type` varchar(10) NOT NULL,
  `parent_id` int(11) unsigned NOT NULL DEFAULT '0',
  `comment_content` varchar(200) NOT NULL,
  `hide` char(1) NOT NULL DEFAULT '0',
  `replied` char(1) NOT NULL DEFAULT '0',
  `checked` char(1) NOT NULL DEFAULT '0',
  `post_ip` varchar(15) NOT NULL,
  `post_time` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `nick_name` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_error_log`;
CREATE TABLE IF NOT EXISTS `user_error_log` (
  `error_id` int(11) unsigned NOT NULL,
  `error_ip` varchar(15) NOT NULL DEFAULT 'unknown',
  `error_time` int(10) unsigned NOT NULL,
  `user_name` varchar(15) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_link`;
CREATE TABLE IF NOT EXISTS `user_link` (
  `link_id` int(10) unsigned NOT NULL,
  `base_url` varchar(40) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `user_key` varchar(32) NOT NULL,
  `born_date` int(10) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_member`;
CREATE TABLE IF NOT EXISTS `user_member` (
  `user_id` int(11) unsigned NOT NULL,
  `uuid` int(11) unsigned NOT NULL,
  `user_name` varchar(15) NOT NULL,
  `user_pass` varchar(32) NOT NULL,
  `nick_name` varchar(15) NOT NULL,
  `real_name` varchar(4) NOT NULL,
  `called_name` varchar(6) NOT NULL,
  `cellphone` varchar(20) NOT NULL,
  `qq` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `career` varchar(10) NOT NULL,
  `province` varchar(3) NOT NULL,
  `user_admin` char(1) NOT NULL DEFAULT '0',
  `user_right` varchar(5000) NOT NULL,
  `cms_class` varchar(100) NOT NULL,
  `user_level` varchar(3) NOT NULL DEFAULT '3.0',
  `last_time` int(10) unsigned NOT NULL,
  `last_ip` varchar(15) NOT NULL,
  `login_times` int(11) unsigned NOT NULL,
  `register_time` int(10) unsigned NOT NULL,
  `amend_time` int(10) unsigned NOT NULL,
  `gender` char(1) NOT NULL DEFAULT 'm',
  `birthday` varchar(10) NOT NULL,
  `user_life` char(1) NOT NULL DEFAULT '1',
  `try_user` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `user_member` (`user_id`, `uuid`, `user_name`, `user_pass`, `nick_name`, `real_name`, `called_name`, `cellphone`, `qq`, `email`, `career`, `province`, `user_admin`, `user_right`, `cms_class`, `user_level`, `last_time`, `last_ip`, `login_times`, `register_time`, `amend_time`, `gender`, `birthday`, `user_life`, `try_user`) VALUES
(1, 26, 'laozhang', 'fc72690b34b82a14e140ef6a9e0f25a2', '风轻云淡', '张三', '老张', '13760612786', '11484251', '11484251@163.com', '', '', '1', '', '59', '0.0', 1589363999, '127.0.0.1', 579, 0, 1337426076, 'm', '', '1', 0);

DROP TABLE IF EXISTS `user_session`;
CREATE TABLE IF NOT EXISTS `user_session` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(16) NOT NULL DEFAULT '0',
  `user_agent` varchar(50) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE `add_about`
  ADD PRIMARY KEY (`about_id`);

ALTER TABLE `add_ads`
  ADD PRIMARY KEY (`ads_id`);

ALTER TABLE `add_ads_setting`
  ADD PRIMARY KEY (`setting_id`);

ALTER TABLE `add_guestbook`
  ADD PRIMARY KEY (`guest_id`);

ALTER TABLE `add_html`
  ADD PRIMARY KEY (`html_id`), ADD UNIQUE KEY `en_title` (`en_title`), ADD UNIQUE KEY `cn_title` (`cn_title`);

ALTER TABLE `add_link`
  ADD PRIMARY KEY (`link_id`);

ALTER TABLE `add_navigation`
  ADD PRIMARY KEY (`navi_id`);

ALTER TABLE `add_navigation_type`
  ADD PRIMARY KEY (`navi_type_id`);

ALTER TABLE `add_people`
  ADD PRIMARY KEY (`people_id`);

ALTER TABLE `add_publication`
  ADD PRIMARY KEY (`pub_id`);

ALTER TABLE `add_scroll`
  ADD PRIMARY KEY (`scroll_id`);

ALTER TABLE `add_seo`
  ADD PRIMARY KEY (`seo_id`);

ALTER TABLE `cms_article`
  ADD PRIMARY KEY (`content_id`);

ALTER TABLE `cms_class`
  ADD PRIMARY KEY (`class_id`);

ALTER TABLE `cms_download`
  ADD PRIMARY KEY (`content_id`);

ALTER TABLE `cms_index`
  ADD PRIMARY KEY (`index_id`), ADD UNIQUE KEY `index_id` (`index_id`);

ALTER TABLE `cms_photo`
  ADD PRIMARY KEY (`content_id`);

ALTER TABLE `cms_trash`
  ADD PRIMARY KEY (`index_id`), ADD UNIQUE KEY `index_id` (`index_id`);

ALTER TABLE `cms_video`
  ADD PRIMARY KEY (`content_id`);

ALTER TABLE `sys_blockip`
  ADD PRIMARY KEY (`ip_id`), ADD UNIQUE KEY `ip_address` (`ip_address`);

ALTER TABLE `sys_config`
  ADD PRIMARY KEY (`config_id`), ADD UNIQUE KEY `config_name` (`config_name`);

ALTER TABLE `sys_notice`
  ADD PRIMARY KEY (`notice_id`);

ALTER TABLE `sys_skin`
  ADD PRIMARY KEY (`skin_id`);

ALTER TABLE `user_comment`
  ADD PRIMARY KEY (`comment_id`);

ALTER TABLE `user_error_log`
  ADD PRIMARY KEY (`error_id`);

ALTER TABLE `user_link`
  ADD PRIMARY KEY (`link_id`);

ALTER TABLE `user_member`
  ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `UserName` (`user_name`), ADD UNIQUE KEY `uuid` (`uuid`);

ALTER TABLE `user_session`
  ADD PRIMARY KEY (`session_id`);


ALTER TABLE `add_about`
  MODIFY `about_id` tinyint(4) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_ads`
  MODIFY `ads_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_ads_setting`
  MODIFY `setting_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_guestbook`
  MODIFY `guest_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_html`
  MODIFY `html_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_link`
  MODIFY `link_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_navigation`
  MODIFY `navi_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_navigation_type`
  MODIFY `navi_type_id` smallint(6) NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_people`
  MODIFY `people_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_publication`
  MODIFY `pub_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_scroll`
  MODIFY `scroll_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `add_seo`
  MODIFY `seo_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_article`
  MODIFY `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_class`
  MODIFY `class_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_download`
  MODIFY `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_index`
  MODIFY `index_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_photo`
  MODIFY `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `cms_video`
  MODIFY `content_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `sys_blockip`
  MODIFY `ip_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `sys_config`
  MODIFY `config_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `sys_notice`
  MODIFY `notice_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `sys_skin`
  MODIFY `skin_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_comment`
  MODIFY `comment_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_error_log`
  MODIFY `error_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_link`
  MODIFY `link_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_member`
  MODIFY `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
