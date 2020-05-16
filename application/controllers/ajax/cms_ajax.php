<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms_ajax extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
		
		session_start();  //for captcha	using
	}
	
	function get_pinyin_name($ishead=0) {
	    
		$this->load->helper('pinyin');
		$cn_name=$this->input->post('cn_name');	
		
		if($ishead) echo str_replace('_','-',GetPinyin($cn_name,TRUE));
		else echo str_replace('_','-',GetPinyin($cn_name));

	}

	function check_cms_title($check_obj) {

		$cms_id=$this->input->post('cms_id');
		
		$$check_obj=$this->input->post('cms_title'); 
		$this->db->where($check_obj,$$check_obj); 

		$query=$this->db->get('cms_index');
		
		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['index_id']==$cms_id)  return true;
			else echo 'error';
			return false;
		}
		else return true;
	}

	function cms_relate_list($type='article') {
		$id=$this->input->post('id');
		$this->db->where('index_id',$id);
		$this->db->limit(8);                 //显示相关条目数限制为8
		$query=$this->db->get('cms_index');

		$data=$query->row_array();
		
		$relate=array();
		
		if(count($data)) {
			if($data['relate_list']) {
				$relate_list=explode(',',$data['relate_list']);
				foreach($relate_list as $index => $value) {
					$this->db->where('index_id',$value);
					$this->db->select('index_id,model_id,class_id,cms_title,icon_image');
					$query=$this->db->get('cms_index');
					if($query->num_rows()) $relate[$index]=$query->row_array();
				}
			}
		}
		
		$this->show_cms_list($relate,$type);
	}
	
	private function show_cms_list($relate,$type) { 
		if(is_array($relate)) foreach ($relate as $index_i => $value_i) {        
		  $link=$type=='photo'?'<img title="'.$value_i['cms_title'].'" src="'.$value_i['icon_image'].'" />':$value_i['cms_title'];
		  echo '<li class="item"><a href="'.site_url('cms/'.$type).'/'.$value_i['index_id'].'">'.$link.'</a></li>';
		}
	}

	function add_editor_link() {
		$index_id = $this->input->post('index_id');
		if(!$index_id) return false;

		$this->load->model('cms_function');

		if($this->cms_function->check_if_my_classes($index_id))
			echo '<a href="'.site_url($this->config->item('admin_dir').'/cms_edit/viewer/'.$index_id).'">编辑此文</a>';
		else
			return false;
    }
	
	private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'    => $infor,
		 'result'   => $result, 
		 'url'      => !$url?($result=='0'?'':'reload'):$url,
		 'user_id'  => $id
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
