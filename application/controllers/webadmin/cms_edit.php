<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms_edit extends CI_Controller {
	
	private $jsfile =array();
	
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('cms_model');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		
		$cms_model=$this->config->item('cms_model');
		foreach($cms_model as $index => $value) 
		   $this->jsfile[$value['table']]='';
		
		$method=array('viewer');
		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
	}
	
	public function viewer($index_id=0) {
        
		if(!$index_id) $this->cms_model->show_msg('内容ID为空');
		
		$this->db->where('index_id',$index_id);
		$query=$this->db->get('cms_index');
		if(!$query->num_rows()) $this->cms_model->show_msg('该ID对应的对象不存在');
		
		$rows=$query->result_array();
		$data=$rows[0];
		
		$data['class_select']=$this->cms_model->class_select_option(0,$data['class_id']);
		$data['vice_class_select']=$this->cms_model->class_select_option(0,$data['vice_class_id']);
		
		$cms_table=$this->myconfig->cms_model($data['model_id'],'table');
		
		$this->db->where('content_id',$data['content_id']);
		$query=$this->db->get('cms_'.$cms_table);
		if(!$query->num_rows())  $this->cms_model->show_msg('对象主体内容为空');
		
		$rows=$query->result_array();
		$data['cms_content']=$rows[0];
		
		$data['workplace_view']=$this->load->view('admin/cms_edit',$data,TRUE);

		$data['js']=array(
		site_url('myjavascript/admin').'/?version='.$this->config->item('js_version')
		);
		
		$jsmin=array(
		'js/calendar/calendar.js',
		'js/admin/myjquery-cmsadd.js'
		);
		
		if($this->jsfile[$cms_table]) array_push($jsmin, $this->jsfile[$cms_table]);		
		$data['jsmin']=$this->minify->js_mini($jsmin,TRUE,'cms_edit_'.$cms_table);
		   
		$data['cssmin']=$this->minify->css_mini(array('skin/admin/css/upload_crop.css','js/swfupload/swfupload.css'));

		$this->load->view('admin/index',$data);
	}

	public function submit_download(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('cms_submit') || !$this->input->post('index_id'))  return $this->echo_infor('非法操作');
		if(!$this->cms_model->check_if_my_classes($this->input->post('class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->check_if_my_classes($this->input->post('old_class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->locked2you($this->input->post('index_id'))) return $this->echo_infor('非法操作或者该内容被锁定！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->multi_replace($this->str_func->special_chars,$this->str_func->utf8_unescape($value));

		$data = $this->index_data($_POST);
			
		$introduction=$this->input->post('introduction');

		//获取远程缩略图
		$icon_first=$this->input->post('icon_first')?'1':'0';
		if(!$data['icon_image']) 
		$data['icon_image']=$this->cms_model->get_body_thumb($introduction,$icon_first,1);
				
		$this->content_filter($data['cms_title'],$introduction,$data['cms_keywords'],$data['cms_description']);
		
		if(strlen($introduction)>65535) return $this->echo_infor('您的内容实在太长了，请删除部分字符或者分多篇发布！');
		
		$this->db->where('index_id',$this->input->post('index_id'));
		$result1=$this->db->update('cms_index',$data);
			 
		$data=array(
			 'introduction' => $introduction,
			 'file_path'    => $this->input->post('all_file_path'),
			 'file_title'   => $this->input->post('all_file_title'), 
			 'show_mode'    => $this->input->post('show_mode')
		);
		
		$this->db->where('index_id',$this->input->post('index_id'));
		$result2=$this->db->update('cms_download',$data);
	    
		if($result1 && $result2)  return $this->echo_infor('下载编辑成功','1','',$this->input->post('index_id'));
		else return $this->echo_infor('下载编辑失败，请重试');
		
	}
	
	public function submit_video(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('cms_submit') || !$this->input->post('index_id'))  return $this->echo_infor('非法操作');
		if(!$this->cms_model->check_if_my_classes($this->input->post('class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->check_if_my_classes($this->input->post('old_class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->locked2you($this->input->post('index_id'))) return $this->echo_infor('非法操作或者该内容被锁定！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->multi_replace($this->str_func->special_chars,$this->str_func->utf8_unescape($value));

		$data = $this->index_data($_POST);
			
		$introduction=$this->input->post('introduction');

		//获取远程缩略图
		$icon_first=$this->input->post('icon_first')?'1':'0';
		if(!$data['icon_image']) 
		$data['icon_image']=$this->cms_model->get_body_thumb($introduction,$icon_first,1);
				
		$this->content_filter($data['cms_title'],$introduction,$data['cms_keywords'],$data['cms_description']);
		
		if(strlen($introduction)>65535) return $this->echo_infor('您的内容实在太长了，请删除部分字符或者分多篇发布！');
		
		$this->db->where('index_id',$this->input->post('index_id'));
		$result1=$this->db->update('cms_index',$data);
			 
		$data=array(
			 'introduction' => $introduction,
			 'video_html'   => $this->input->post('video_html'),
			 'video_url'    => $this->input->post('video_url')
		);
		
		$this->db->where('index_id',$this->input->post('index_id'));
		$result2=$this->db->update('cms_video',$data);
	    
		if($result1 && $result2)  return $this->echo_infor('视频编辑成功','1','',$this->input->post('index_id'));
		else return $this->echo_infor('视频编辑失败，请重试');
		
	}
	
	public function submit_photo(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('cms_submit') || !$this->input->post('index_id'))  return $this->echo_infor('非法操作');
		if(!$this->cms_model->check_if_my_classes($this->input->post('class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->check_if_my_classes($this->input->post('old_class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->locked2you($this->input->post('index_id'))) return $this->echo_infor('非法操作或者该内容被锁定！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->multi_replace($this->str_func->special_chars,$this->str_func->utf8_unescape($value));

		$data = $this->index_data($_POST);

		$photo_list=$this->cms_model->get_photos_files($this->input->post('album_image'));
		$photo_title=$this->input->post('img_text');		
		if($this->myconfig->field_maxlength('cms_photo','photo_list')<strlen($photo_list))
		  return $this->echo_infor('图片数量过大，请删减！');		  
		if($this->myconfig->field_maxlength('cms_photo','photo_title')<strlen($photo_title))
		  return $this->echo_infor('图片说明文字太长，请删减！');  		
			
		$introduction=$this->input->post('introduction');

		//获取第一个图片的缩略图为图片集的缩略图
		$data['icon_image']=$this->cms_model->get_thumbs_files($this->input->post('album_image'),0);  
		
		$this->content_filter($data['cms_title'],$introduction,$data['cms_keywords'],$data['cms_description']);
		
		if(strlen($introduction)>65535) return $this->echo_infor('您的内容实在太长了，请删除部分字符或者分多篇发布！');
		
		$this->db->where('index_id',$this->input->post('index_id'));
		$result1=$this->db->update('cms_index',$data);
			 
		$data=array(
			 'introduction' => $introduction,
			 'photo_list'   => $photo_list,
			 'photo_title'  => $photo_title
		);
		
		$this->db->where('index_id',$this->input->post('index_id'));			 
		$result2=$this->db->update('cms_photo',$data);
	    
		if($result1 && $result2)  return $this->echo_infor('图集编辑成功','1','',$this->input->post('index_id'));
		else return $this->echo_infor('图集编辑失败，请重试');
		
	}
	
	public function submit_article(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('cms_submit') || !$this->input->post('index_id'))  return $this->echo_infor('非法操作');
		if(!$this->cms_model->check_if_my_classes($this->input->post('class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->check_if_my_classes($this->input->post('old_class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');
		if(!$this->cms_model->locked2you($this->input->post('index_id'))) return $this->echo_infor('非法操作或者该内容被锁定！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->multi_replace($this->str_func->special_chars,$this->str_func->utf8_unescape($value));

		$data = $this->index_data($_POST);		
		
		$article_body=$this->input->post('article_body');

		//获取远程缩略图
		$icon_first=$this->input->post('icon_first')?'1':'0';
		if(!$data['icon_image']) 
		$data['icon_image']=$this->cms_model->get_body_thumb($article_body,$icon_first,1);
		
		$this->content_filter($data['cms_title'],$article_body,$data['cms_keywords'],$data['cms_description']);
		
		if(strlen($article_body)>65535) return $this->echo_infor('您的文章实在太长了，请删除部分字符或者分多篇发布！');	

		$this->db->where('index_id',$this->input->post('index_id'));
		$result1=$this->db->update('cms_index',$data);
		
		$this->db->where('index_id',$this->input->post('index_id'));			 
		$result2=$this->db->update('cms_article',array('article_body' => $article_body));
			
		if($result1 && $result2)  return $this->echo_infor('内容编辑成功','1','', $this->input->post('index_id'));
		else return $this->echo_infor('内容编辑失败，请重试');
		
	}

	private function index_data($array) {
	    
		$data=array('class_id','vice_class_id','model_id','cms_title','cms_title_en','cms_stitle',
		'cms_source','cms_writer','cms_keywords','cms_description','icon_image','post_time',
		'jump_url','read_times','view_right','title_color','title_strong','comments','recommend',
		'headline','relate_list'		
		);

		$data=elements($data, common::deep_trim($array));
			
		$timestamp=time();
			
		$data['headline']=$data['headline']?$timestamp:0;
		$data['recommend']=$data['recommend']?$timestamp:0;
		$data['comments']=$data['comments']?'1':'0';
		$data['title_strong']=$data['title_strong']?'1':'0';
		$data['post_time']=$data['post_time']?strtotime($data['post_time']):$timestamp;
		
		$data['last_modify']=$timestamp;
		$data['last_editor']=$this->session->userdata('user_id');

		return $data;
	
	}

	private function content_filter(&$title,&$body,&$keywords,&$abstract) {
	    $auto_keywords=$this->input->post('auto_keywords')?'1':'0';
		$auto_description=$this->input->post('auto_description')?'1':'0';
		$del_link=$this->input->post('del_link')?'1':'0';
		$add_watermark=$this->input->post('add_watermark')?'1':'0';		
		$get_remote=$this->input->post('get_remote')?'1':'0';
			

		//删除fck添加的一些标记
		$body=$this->cms_model->del_fcklink_attr($body);
			
		//获取关键字
		$keywords=$this->cms_model->get_keywords($title,$body,$keywords,30);
		//获取摘要
		$abstract=$this->cms_model->get_abstract($body,$abstract,100);
			
		//获取远程图片
		$body=$this->cms_model->get_remote_images($get_remote,$body,$add_watermark);

		//去掉外链
		$body=$this->cms_model->delete_outer_links($del_link, $body);
	} 
	
	private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result, 
		 'url'    => !$url?($result=='0'?'':'reload'):$url,
		 'id'     => $id
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
