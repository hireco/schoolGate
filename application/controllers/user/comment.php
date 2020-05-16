<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Comment extends CI_Controller {
	
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
    	$query=$this->db->get('user_comment');
    	
    	$data['entry_list']=$query->result_array();
    	
    	$this->my_load->view('user/comment',$data);
    }
    
    function view() {
    	$user_id=$this->session->userdata('user_id');
    	$entry_id=$this->input->post('entry_id');
    	
    	$this->db->where(array('user_id' => $user_id,'comment_id' => $entry_id));
    	$query=$this->db->get('user_comment');
    	
    	if(!$query->num_rows())  return $this->echo_infor('查看对象不存在！');
    	
    	$data=$query->row_array(); 
    	$data['viewer']='comment';
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
