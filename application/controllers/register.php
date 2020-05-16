<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Register extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		$this->load->model('functions');
		$this->load->model('user_model');
		
		session_start(); //cool captcha 需要启用 session
		
		$this->output->cache(0); //此文件不缓存
	}

	public function index() {
		
		$data['title']='会员注册';
		
		$data['body']=strtolower(__CLASS__);
		
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
         
		$data['reg_viewer']='index';
		
		if($this->check->user_is_logged()) $data['logged']='1';
	    else $data['un_logged']='1';
	   
		$data['form']=$this->my_load->view('register',array('reg_viewer' => 'form'),TRUE);
		
		$this->load->view('index',$data);
	}
	
	public function ajax()	{
	   
	   if(!IS_AJAX) $this->functions->show_msg();
	   
	   if($this->check->user_is_logged()) $data['logged']='1';
	   else $data['un_logged']='1';
	  
	   $data['form']=$this->my_load->view('register',array('reg_viewer' => 'form'),TRUE);
	   $data['reg_viewer']='ajax';
	   
	   echo $this->my_load->view('register',$data,TRUE);
	}
	
	public function submit() {
		
		if(!IS_AJAX) $this->functions->show_msg();
		
		if(!$this->input->post('reg_submit')) return $this->echo_infor('非法操作');
		if(!$this->check->chk_captcha($this->input->post('captcha'))) return $this->echo_infor('错误的验证码输入！');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('user_name','user_pass','nick_name','real_name',
		'called_name','cellphone','qq','email','career','province',
		'gender','birthday'			
		);
		
		$data=elements($data, common::deep_trim($_POST));
		
		$timestamep=time();
		
		$data['last_time']=$timestamep;
		$data['register_time']=$timestamep;
		$data['amend_time']=$timestamep;
		$data['last_ip']=$this->input->ip_address();
		$data['login_times']=1;		
		$data['user_pass']=md5($data['user_pass']);
		$data['uuid']=$this->myuuid(); //随机ID
		
		if($this->check->chk_username($data['user_name'])) return $this->echo_infor('对不起，用户名已经被注册！');
		
		$this->db->insert('user_member',$data);
		
		if($this->db->affected_rows()) {
			$user_id=$this->db->insert_id();
			
			$session_data=array(
			  'user_name'  => $data['user_name'],
			  'user_id'    => $user_id,
			  'nick_name'  => $data['nick_name'],
			  'user_level' => '3.0',
			  'user_admin' => '0'
			);
			
			$this->session->set_userdata($session_data);

			return $this->echo_infor('恭喜您，注册成功！正在跳转...','1','',$user_id);
		}
		else return $this->echo_infor('系统出错，注册失败，请重试！');
		
	}
	
	public function logout() {
	   if(!IS_AJAX) $this->functions->show_msg();
	   echo $this->my_load->view('register',array('reg_viewer' => 'logout'),TRUE);
	}
	
	public function chk_username($username='') {
	   if(!IS_AJAX) $this->functions->show_msg();
	   if($this->check->chk_username($username)) echo '1';
	   else echo '0';
	}
	
	public function chk_email() {
	   if(!IS_AJAX) $this->functions->show_msg();
	   $email=array('email' => $this->input->post('email'));

	   $is_member=$this->mysql->row('user_member',$email);
	   $in_people=$this->mysql->row('add_people',$email);
	   
	   if(!$is_member && $in_people) echo '1'; //邮件存在于后台导入的邮件列表中，且未被注册，则可注册用户
	   else echo '0';
	 
	}

	public function chk_captcha($captcha='') {
	   if(!IS_AJAX) $this->functions->show_msg();
	   if($this->check->chk_captcha($captcha)) echo '1';
	   else echo '0';
	}
	
	private function myuuid() {
    	$uuid=rand(1942,9999999999);
    	$query = $this->db->get_where('user_member', array('uuid' => $uuid),1);
        if ($query->num_rows() == 0){
        	return $uuid;
         }
         else{
         	$uuid=$this->myuuid();
         	return $uuid;
         }
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

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
