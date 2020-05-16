<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Guestbook extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		$this->load->model('guest_model');
		
		session_start(); //cool captcha 需要启用 session
	}

	public function index() {
		
		$data['title']='客户留言';
		
		$data['body']=strtolower(__CLASS__);
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
		$this->load->view('index',$data);
	}
	
	public function submit() {
		if(!$this->input->post('sub_guestbook')) return $this->echo_infor('非法操作');
		if(!$this->check->chk_captcha($this->input->post('captcha'))) return $this->echo_infor('错误的验证码输入！');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('guest_name','top_type','sub_type','guest_telephone','guest_topic','guest_content');
		
		$data=elements($data, common::deep_trim($_POST));
		
		$timestamep=time();
		
		$data['post_time']=$timestamep;
		$data['post_ip']=$this->input->ip_address();
		$data['user_id']=$this->session->userdata('user_id'); //若未登录则为0值
				
		$this->db->insert('add_guestbook',$data);
		
		if($this->db->affected_rows()) {
			$guest_id=$this->db->insert_id();
			return $this->echo_infor('恭喜您，留言发布成功！','1','',$guest_id);
		}
		else return $this->echo_infor('系统出错，留言失败，请重试！');
	}
	
	private function echo_infor($infor,$result='0',$url='',$guest_id=0) {
		$data=array(
		 'infor'    => $infor,
		 'result'   => $result, 
		 'url'      => !$url?($result=='0'?'':'reload'):$url,
		 'guest_id'  => $guest_id
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
