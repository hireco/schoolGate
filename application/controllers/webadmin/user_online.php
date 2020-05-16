<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_online extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->helper('text');

		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index($model_id=0){
		$data['viewer']='index';
		$data['clist']=$this->clist('index');
		$data['workplace_view']=$this->load->view('admin/user_online',$data,TRUE);

		$data['mylist']=array('forbidIP','kickout');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/calendar/calendar.js',
		'js/admin/myjquery-useronline.js'
		),TRUE,'user_online');

		$this->load->view('admin/index',$data);
	}

	public function clist($action='ajax') {
		$this->db->order_by('last_activity desc');
		$query=$this->db->get('user_session');
		$user_list=$query->result_array();

		$data=$this->load->view('admin/user_online',
		array(
		  'viewer'  =>  'clist',
		  'user_list' => $user_list
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function delete_online() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));

		$result=array();
		foreach ($ids as $index => $value) {
			if($this->chk_right($value)) $result[]=$this->db->delete('user_session',array('session_id' => $value));
			else $result[]=FALSE;
		}		
        
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功踢出该访客！','1','',$this->input->post('id'));
		else return $this->echo_infor('操作失败或者您的权限不够！');
	}
    
    public function block_ip() {
    	
    	$this->check->check_admin_right(__CLASS__,__FUNCTION__);
    	
    	if(!$this->input->post('ajax') || !$this->input->post('ip'))
		return $this->echo_infor('操作非法！');
		
		if($this->input->ip_address()==$this->input->post('ip')) 
		   return $this->echo_infor('错误，不可以封堵您自己的IP！');
		
		$this->db->where('ip_address',$this->input->post('ip'));
		$query=$this->db->get('sys_blockip');
		if($query->num_rows()) 
		   return $this->echo_infor('成功封堵该IP地址','1');
		
		$this->db->insert('sys_blockip',array('ip_address' => $this->input->post('ip'),'block_reason' => '直接封堵在线用户', 'block_time' => time()));
		
		if($this->db->insert_id()) return $this->echo_infor('成功封堵该IP地址','1');
		else return $this->echo_infor('操作失败，请重试！');
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
	
	private function chk_right($id) {
		$this->db->where('session_id',$id);
		$query=$this->db->get('user_session');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$user_data=$this->session->_unserialize($rows[0]['user_data']);
			
			$user_id=isset($user_data['user_id'])?$user_data['user_id']:'0';
			$user_level=isset($user_data['user_level'])?$user_data['user_level']:'4.0';
			
			if($user_level > $this->session->userdata('user_level')) return TRUE;
			else if($this->session->userdata('user_level')=='0.0' && $user_id !=$this->session->userdata('user_id')) return TRUE;
			else return FALSE;
		}
		return FALSE;
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
