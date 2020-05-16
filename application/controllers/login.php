<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		$this->load->model('functions');
		
        session_start(); //cool captcha 需要启用 session
        
        $this->output->cache(0); //此文件不缓存
	}
	
	public function index() {		
		
		$data['title']='会员登录';
		
		$data['body']=strtolower(__CLASS__);
		
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
         
		$data['log_viewer']='index';
		
		if($this->check->user_is_logged()) $data['logged']='1';
	    else $data['un_logged']='1';
	   
		$data['form']=$this->my_load->view('login',array('log_viewer' => 'form'),TRUE);
		
		$this->load->view('index',$data);
	}
	
	public function ajax()	{
	   
	   if(!IS_AJAX) $this->functions->show_msg();
	   
	   if($this->check->user_is_logged()) $data['logged']='1';
	   else $data['un_logged']='1';
	  
	   $data['form']=$this->my_load->view('login',array('log_viewer' => 'form'),TRUE);
	   $data['log_viewer']='ajax';
	   
	   echo $this->my_load->view('login',$data,TRUE);
	}
	
	public function submit() {
		
		if(!IS_AJAX) $this->functions->show_msg();
		
		if(!$this->input->post('log_submit')) return $this->echo_infor('非法操作');
		if($this->input->post('log_submit')=='slogin') {
			if($this->input->post('captcha')!=$this->session->userdata('result_string'))
			return $this->echo_infor('错误的验证码输入！');
		}
		else if(!$this->check->chk_captcha($this->input->post('captcha'))) return $this->echo_infor('错误的验证码输入！');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('user_name','user_pass');
		$data=elements($data, common::deep_trim($_POST));
		$data['user_pass']=md5($data['user_pass']);
		
		$this->db->where($data);
		$this->db->where('user_life','1');
		$this->db->limit(1);

		$query=$this->db->get('user_member',$data);
		
		if($query->num_rows()) {
			
			$row=$query->row_array();
			
			$timestamep=time();
			
			$new_data['last_time']=$timestamep;		
		    $new_data['last_ip']=$this->input->ip_address();	
		    $new_data['login_times']=$row['login_times']+1;
		
		    $this->db->where($data);
		    $this->db->update('user_member',$new_data);
			
		    $session_data=array(
			  'user_name'  => $row['user_name'],
			  'user_id'    => $row['user_id'],
			  'nick_name'  => $row['nick_name'],
			  'user_level' => $row['user_level'],
			  'user_admin' => $row['user_admin'],
		      'real_name'  => $row['real_name']
			);
			
			$cookie_life = $this->input->post('cookie_life')?$this->input->post('cookie_life'):365;
			
			$this->session->set_userdata($session_data);

			$this->user_cookie('user_name', $row['user_name'],$cookie_life*24*3600);
			
			if($this->input->post('url_togo')) $url=$this->input->post('url_togo');
			else $url=base_url();
			
			return $this->echo_infor('恭喜您，登录成功！正在跳转...','1',$url,$row['user_id']);
		}
		else return $this->echo_infor('错误的用户名和密码！');
		
	}
	
	public function logout() {
	   if(!IS_AJAX) $this->functions->show_msg();	   
	   echo $this->my_load->view('login',array('log_viewer' => 'logout'),TRUE);
	}
	
	public function chk_if_logined() {
		if(!IS_AJAX) $this->functions->show_msg();
		
		if($this->check->user_is_logged()) {
			 $logged_state=$this->my_load->view('user/logged','',TRUE);
			 echo json_encode(array('logged' => TRUE,'logged_state' => $logged_state));
		}
		else echo json_encode(array('logged' => FALSE,'logged_state' => ''));
	}
	
	private function user_cookie($name,$value='',$life) {
		$cookie = array(
           'name'   => $name,
           'value'  => $value,
           'expire' => $life
        );
        $this->input->set_cookie($cookie);
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
