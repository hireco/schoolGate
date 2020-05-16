<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profile extends CI_Controller {
	
    function __construct(){
    	parent::__construct();
    	$this->load->library('common');
    	$this->load->helper('array');
    	$this->load->library('my_avatar');
    	$this->load->model('str_func');
    	$this->load->model('user_model');
    	$this->load->model('functions');
    	    	
    	$this->check->check_user_logged();
    	
    	if(!IS_AJAX) $this->functions->show_msg();
    }
    
    function index() {
    	$user_id=$this->session->userdata('user_id');
    	$this->db->where('user_id',$user_id);
    	$query=$this->db->get('user_member');
    	
    	if(!$query->num_rows()) show_404();
    	
    	$rows=$query->result_array();
    	$data=$rows[0];
    	$data['avatar']=$this->my_avatar->get_avatar_url($user_id,'middle');
    	
    	$this->my_load->view('user/profile_view',$data);
    }
    
    function edit() {
    	$user_id=$this->session->userdata('user_id');
    	$this->db->where('user_id',$user_id);
    	$query=$this->db->get('user_member');
    	
    	if(!$query->num_rows()) show_404(); 
    	
    	$rows=$query->result_array();
    	$data=$rows[0];
    	
    	$this->my_load->view('user/profile_edit',$data);
    } 

    function submit() {
    	if(!$this->input->post('amend_submit')) return $this->echo_infor('非法操作');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('nick_name','real_name','called_name','cellphone',
		'qq','email','career','province','gender','birthday');
		
		$data=elements($data, common::deep_trim($_POST));
		$data['amend_time']=time();
		
		$user_id=$this->session->userdata('user_id');

		$this->db->where('user_id',$user_id);
		$this->db->update('user_member',$data);
		
		if($this->db->affected_rows()) {
			$this->session->set_userdata('nick_name',$data['nick_name']);
			return $this->echo_infor('恭喜您，修改成功！正在跳转...','1');
		}
		else return $this->echo_infor('系统出错，修改失败，请重试！');
    }
   
    function password() {
		if($this->input->post('pass_submit')) {
			$user_pass_old=md5(trim($this->input->post('old_pass')));
			$user_pass_new=trim($this->input->post('new_pass'));
			$this->db->where(array('user_name' => $this->session->userdata('user_name'),'user_pass' => $user_pass_old));
		    $query=$this->db->get('user_member');
		    if($query->num_rows()) {
                if($query->row()->try_user) return $this->echo_infor('体验用户不能修改密码！');

		    	$this->db->where(array('user_name' => $this->session->userdata('user_name')));
		    	$result=$this->db->update('user_member',array('user_pass' => md5($user_pass_new)));
		    	if($result) return $this->echo_infor('恭喜！成功修改您的密码！','1');
		    	else return $this->echo_infor('对不起，修改失败，请重来！');
		    } 
		    else return $this->echo_infor('错误的旧密码！');
		}
		
		$this->my_load->view('user/password');
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
