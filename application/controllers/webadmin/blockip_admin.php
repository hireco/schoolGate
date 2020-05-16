<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Blockip_admin extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/blockip_admin', 
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
		'js/admin/myjquery-blockip.js'
		));
		
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
	    
		$this->db->order_by('ip_id asc');
		$query=$this->db->get('sys_blockip');

		$ips=$query->result_array();
		
		$data=$this->load->view('admin/blockip_admin',
		array(
			'action'  => 'clist',
		    'ips' => $ips
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	function add($submit=0) {		
		
		if($submit==0) {
			$data['action'] ='add';			
			return $this->load->view('admin/blockip_admin',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('blockip_add_submit')) 
				return $this->echo_infor('操作非法！');
				
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('ip_address','block_reason');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	

		    $data['block_time']=time();
		    
		    $result=$this->db->insert('sys_blockip',$data);
			
			if($result)  return $this->echo_infor('恭喜，添加成功！','1');	
			else return $this->echo_infor('添加失败，请重来！');
		}
	}
	
	function delete_ip() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$this->db->where(array('ip_id' => $id));
		$result=$this->db->delete('sys_blockip');
		
		if($result)  return $this->echo_infor('成功删除封堵IP！','1','',$id);	
		else return $this->echo_infor('不能删除或删除失败，请重来！');
	}
	
	function chk_ip_address() {
		$ip_address=$this->input->post('ip_address');
		
		if(!preg_match("/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){4}$/", $ip_address.".")) {
			echo '0';
			return FALSE;
		}
		
		$this->db->where('ip_address',$ip_address);
		$query=$this->db->get('sys_blockip');
		
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
