<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Guestbook extends CI_Controller {
	
    function __construct(){
    	parent::__construct();
    	$this->load->library('common');
    	$this->load->model('functions');
    	    	
    	$this->check->check_user_logged();
    	
    	if(!IS_AJAX) $this->functions->show_msg();
    }
    
    function index() {
    	$user_id=$this->session->userdata('user_id');
    	$this->db->where('user_id',$user_id);
    	$query=$this->db->get('add_guestbook');
    	
    	$data['entry_list']=$query->result_array();
    	
    	$this->my_load->view('user/guestbook',$data);
    }
    
    function view() {
    	$user_id=$this->session->userdata('user_id');
    	$entry_id=$this->input->post('entry_id');
    	
    	$this->db->where(array('user_id' => $user_id,'guest_id' => $entry_id));
    	$query=$this->db->get('add_guestbook');
    	
    	if(!$query->num_rows())  return $this->echo_infor('查看对象不存在！');
    	
    	$data=$query->row_array(); 
    	$data['viewer']='guestbook';
    	$data['replies']='';
    	
    	if($data['processed']=='1') {
    		$this->db->where(array('parent_id' => $entry_id));
    		$query=$this->db->get('add_guestbook');    		
    		if($query->num_rows()) $data['replies']=$query->result_array();
    	}
    	
    	
    	return $this->echo_infor($this->my_load->view('user/entry_viewer',$data,TRUE),'1');
    }
    
    private function echo_infor($infor,$result='0',$url='',$user_id=0) {
		$data=array(
		 'infor'    => $infor,
		 'result'   => $result, 
		 'url'      => !$url?($result=='0'?'':'reload'):$url,
		 'user_id'  => $user_id
		);

		echo json_encode($data);
	}
}

/* End of file avatar.php */
/* Location: ./application/controllers/user/avatar.php */
