<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sys_config extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		$method=array('','http_add','http_edit');
		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/sys_config', 
		array(
		'clist'  => $this->clist(),
		'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/pagination/jquery.pagination.js',
		'js/admin/myjquery-sysconfig.js'
		));
		
		$this->load->view('admin/index',$data);
	}
    
	public function http_edit($name='') {
		
		$this->db->where(array('config_name' => $name));
		$query=$this->db->get('sys_config');

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		
		if($query->num_rows()) {
		  $data['jsmin']=$this->minify->js_mini(array(
		   'js/jquery.contextmenu.r2.js',
		   'js/pagination/jquery.pagination.js',
		   'js/admin/myjquery-admin-function.js',
		   'js/admin/myjquery-sysconfig.js'
		  ));
		  	
		  $tmp_data=$query->row_array();
		  $tmp_data['action']='edit';
		}
		else {
		  $tmp_data['action']='invalid';
		  $tmp_data['invalid_infor']='<span>不存在的配置项目</span> <a href="'.base_url().$this->config->item('admin_dir').'/sys_config/http_add">点击创建</a>';
		}
		
		$data['workplace_view']=$this->load->view('admin/sys_config',$tmp_data,TRUE);
		
		$this->load->view('admin/index',$data);
	}
	
	public function http_add() {
		
		$tmp_data['action']='add';
		
		$data['workplace_view']=$this->load->view('admin/sys_config',$tmp_data,TRUE);
		
		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		   'js/jquery.contextmenu.r2.js',
		   'js/pagination/jquery.pagination.js',
		   'js/admin/myjquery-admin-function.js',
		   'js/admin/myjquery-sysconfig.js'
		));
		
		$this->load->view('admin/index',$data);
	}
	
	public function clist($action='') {
	    
		$this->load->helper('text');
		$this->db->order_by('config_name asc');
		
		if($config_class=$this->input->post('config_class'))
		 $this->db->where(array('config_class' => $config_class));

		$query=$this->db->get('sys_config');

		$configs=$query->result_array();

		$data=$this->load->view('admin/sys_config',
		array(
			'action'  => 'clist',
		    'configs' => $configs,
			'config_class' => $this->config->item('cfg_class')
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
    
	public function edit($id=0,$submit=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('config_id' => $id));
			$query=$this->db->get('sys_config');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，参数不存在！');

			$tmp_data=$query->row_array();
			$tmp_data['action']='edit';
			return $this->echo_infor($this->load->view('admin/sys_config',$tmp_data,TRUE),'1'); 
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('config_submit')) 
				return $this->echo_infor('操作非法！');
		    
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('config_value');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);

			$this->db->where('config_id',$id);
			$result=$this->db->update('sys_config',$data);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	function add($submit=0) {
		if($submit==0) {
			$data['action']='add';
			return $this->load->view('admin/sys_config',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('config_add_submit')) 
				return $this->echo_infor('操作非法！');
				
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('config_title','config_name','config_class','config_value','input_type','config_description');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	
		    
		    $data['system']='0';
		    
		    $result=$this->db->insert('sys_config',$data);
			
			if($result)  return $this->echo_infor('恭喜，添加成功！','1');	
			else return $this->echo_infor('添加失败，请重来！');
		}
	}
	
	function delete_config() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$this->db->where(array('config_id' => $id,'system' => '0'));
		$result=$this->db->delete('sys_config');
		
		if($result)  return $this->echo_infor('成功删除设置项目！','1','',$id);	
		else return $this->echo_infor('不能删除或删除失败，请重来！');
	}
	
	function chk_config_name() {
		$config_name=$this->input->post('config_name');
		$this->db->where('config_name',$config_name);
		$query=$this->db->get('sys_config');
		
		if(!ereg("^[a-z_][a-z0-9_]+$", $config_name) || strlen($config_name)>30 || $query->num_rows()) {
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
