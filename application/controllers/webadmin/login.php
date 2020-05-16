<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index() {
		
		$data['form']=$this->load->view('admin/login',array('log_viewer' => 'form'),TRUE);
		$data['log_viewer']='index';
		$data['title']='后台管理登录';
		
		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		  'js/admin/myjquery-adminlogin.js'
		),TRUE,'adminlogin');

		$this->load->view('admin/login',$data);
	}
	
	public function ajax()	{
	   
	   $data['form']=$this->load->view('admin/login',array('log_viewer' => 'form'),TRUE);
	   $data['log_viewer']='ajax';
	   
	   echo $this->load->view('admin/login',$data,TRUE);
	}
	
	public function submit() {
	   session_start(); 
		
	   if(!$this->input->post('username_to_login'))  {
	   	  show_404();
	   	  exit;
	   }
	   		   
	   if(!$this->check_captcha()) return $this->echo_infor('验证码错误！');
	   
	   $data=array(
	     'user_name' => $this->input->post('username_to_login'),
	     'user_pass' => md5($this->input->post('password_to_login'))
	   );
	   
	   $this->db->limit(1);
	   $this->db->where($data);
	   $this->db->where('user_admin','1');
	   $this->db->where('user_life','1');
	   $query=$this->db->get('user_member');
	   
	   if(!$query->num_rows()) {
	   	  $this->error_record();
	   	  return $this->echo_infor('错误的用户名和密码'); 
	   }
	   else {
	   	  
		  $row=$query->row_array();
	   	  
		  $data=array(
	   	    'user_name'  => $row['user_name'],
	   	    'user_id'    => $row['user_id'],
	   	    'nick_name'  => $row['nick_name'],
	   	    'user_admin' => $row['user_admin'],
	   	    'user_level' => $row['user_level'],
	   	    'real_name'  => $row['real_name']
	   	  );
		  
	   	  $this->session->set_userdata($data);	
          
          $this->user_cookie('user_name', $row['user_name'],365*24*3600);		  
	   }  
	   
	   $new_data=array(
	     'last_time' => time(),
	     'last_ip' => $this->input->ip_address(),
	     'login_times' => $row['login_times']+1,
	   );
		
	   $this->db->where('user_name',$this->input->post('username_to_login'));
	   $this->db->update('user_member',$new_data);
	   
	   if($this->input->post('url_togo')) $url=$this->input->post('url_togo');
	   else $url=site_url($this->config->item('admin_dir'));
	   
       return $this->echo_infor('登录成功，正在跳转...','1',$url);
	}

	public function logout() {
			   
	   echo $this->load->view('admin/login',array('log_viewer' => 'logout'),TRUE);
	}
	
	private function user_cookie($name,$value='',$life) {
		$cookie = array(
           'name'   => $name,
           'value'  => $value,
           'expire' => $life
        );
        $this->input->set_cookie($cookie);
	}
	
	private function error_record() {
		$data=array(
		  'error_ip'    => $this->input->ip_address(),
		  'error_time'  => time(),
		  'user_name'   => $this->input->post('username_to_login')
 		);
 		
 		$this->db->insert('user_error_log',$data);
	}
	
	private function echo_infor($infor,$result='0',$url='',$user_id=0) {
		$data=array(
		 'infor'   => $infor,
		 'result'  => $result, 
		 'url'     => !$url?($result=='0'?'':'reload'):$url,
		 'user_id' => $user_id
		);

		echo json_encode($data);
	}
	
	private function check_captcha() {
		if($this->myconfig->item('admin_captcha')) {
			if($this->input->post('captcha_to_login')) {
				if(trim(strtolower($this->input->post('captcha_to_login')))!= $_SESSION['captcha'] || empty($_SESSION['captcha']))
			    return FALSE;
			    else return TRUE;
			}
			else return FALSE;
		}
		else return TRUE;
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
