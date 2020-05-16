<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sys_notice extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('view','edit');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/sys_notice', 
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
		'js/admin/myjquery-sysnotice.js'
		));
		
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
	    
		$this->load->helper('text');
		$this->db->order_by('notice_id desc');
		
		if($notice_class=$this->input->post('notice_class'))
		 $this->db->where(array('notice_class' => $notice_class));

		$query=$this->db->get('sys_notice');

		$notices=$query->result_array();

		$data=$this->load->view('admin/sys_notice',
		array(
			'action'  => 'clist',
		    'notices' => $notices,
			'notice_class' => $this->config->item('notice_class')
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
    
	public function view($id=0) {
		$this->db->where(array('notice_id' => $id));
		$query=$this->db->get('sys_notice');
			
		if(!$query->num_rows()) 
			return $this->echo_infor('对不起，参数不存在！');

		$data=$query->result_array();
		$data[0]['action']='view';
		return $this->load->view('admin/sys_notice',$data[0]);
	}
	
	public function edit($id=0,$submit=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('notice_id' => $id));
			$query=$this->db->get('sys_notice');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，参数不存在！');

			$data=$query->result_array();
			$data[0]['action']='form';
			return $this->echo_infor($this->load->view('admin/sys_notice',$data[0],TRUE),'1'); 	
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('notice_submit')) 
				return $this->echo_infor('操作非法！');
		    
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('notice_title','notice_content','notice_class');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);

			$this->db->where('notice_id',$id);
			$result=$this->db->update('sys_notice',$data);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	function add($submit=0) {
		if($submit==0) {
			$data['action']='form';
			return $this->load->view('admin/sys_notice',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('notice_submit')) 
				return $this->echo_infor('操作非法！');
				
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('notice_title','notice_content','notice_class');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	
		    
		    $data['system']='0';
		    $data['user_id']=$this->session->userdata('user_id');
		    $data['post_time']=time();
		    $data['post_ip']=$this->input->post('ip_address');
		    
		    $result=$this->db->insert('sys_notice',$data);
			
			if($result)  return $this->echo_infor('恭喜，添加成功！','1');	
			else return $this->echo_infor('添加失败，请重来！');
		}
	}
	
	function delete_notice() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$this->db->where(array('notice_id' => $id,'system' => '0'));
		$result=$this->db->delete('sys_notice');
		
		if($result)  return $this->echo_infor('成功删除设置项目！','1','',$id);	
		else return $this->echo_infor('不能删除或删除失败，请重来！');
	}
	
	function chk_notice_title() {
		$notice_title=$this->input->post('notice_title');
		$this->db->where('notice_title',$notice_title);
		$query=$this->db->get('sys_notice');
		
		if($query->num_rows()) {
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
