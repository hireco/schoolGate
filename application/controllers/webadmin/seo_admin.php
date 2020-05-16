<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Seo_admin extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/seo_admin', 
		array(
		'clist'  => $this->clist(),
		'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/admin/myjquery-seoadmin.js'
		));
		
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
	    
		$this->load->helper('text');
		$this->db->order_by('seo_id asc');
		$query=$this->db->get('add_seo');

		$seos=$query->result_array();
		
		$data=$this->load->view('admin/seo_admin',
		array(
			'action'  => 'clist',
		    'seos' => $seos
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function edit($id=0,$submit=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('seo_id' => $id));
			$query=$this->db->get('add_seo');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，参数不存在！');

			$data=$query->result_array();
			$data[0]['action']='edit';
			return $this->echo_infor($this->load->view('admin/seo_admin',$data[0],TRUE),'1'); 	
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('seo_submit')) 
				return $this->echo_infor('操作非法！');
		    
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			
		    $data=array('seo_title','seo_keywords','seo_description','uri_string');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	
		    
		    $data['uri_string']=str_replace(base_url(), '', $data['uri_string']);

			$this->db->where('seo_id',$id);
			$result=$this->db->update('add_seo',$data);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	function add($submit=0) {
		if($submit==0) {
			$data=array(
		      'action' =>'add',
		      'seo_class' => $this->config->item('seo_class')
		    );
			
			return $this->load->view('admin/seo_admin',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('seo_add_submit')) 
				return $this->echo_infor('操作非法！');
				
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('seo_class','seo_name','seo_title','seo_keywords','seo_description','uri_string');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	
		    
		    $data['uri_string']=str_replace(base_url(), '', $data['uri_string']);
		    
		    $result=$this->db->insert('add_seo',$data);
			
			if($result)  return $this->echo_infor('恭喜，添加成功！','1');	
			else return $this->echo_infor('添加失败，请重来！');
		}
	}
	
	function delete_seo() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$this->db->where(array('seo_id' => $id,'system' => '0'));
		$result=$this->db->delete('add_seo');
		
		if($result)  return $this->echo_infor('成功删除设置项目！','1','',$id);	
		else return $this->echo_infor('不能删除或删除失败，请重来！');
	}
	
	function chk_uri_string() {
		$uri_string=$this->input->post('uri_string');
		$this->db->where('uri_string',str_replace(base_url(),'',$uri_string));
		$query=$this->db->get('add_seo');
		
		if(!ereg("^".base_url(), $uri_string) || strlen($uri_string)>100 || $query->num_rows()) {
			echo '0';
			return FALSE;
		}
		else {
			echo '1';
			return TRUE;
		}
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
