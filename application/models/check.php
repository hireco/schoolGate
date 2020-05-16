<?php 
class Check extends CI_Model
{
	function __construct() {
		parent::__construct();        
		
		if(!$this->session->userdata('user_level')) $this->session->set_userdata('user_level','4.0');
		//设置未登录用户的级别

		$this->chk_blockip();
		$this->chk_if_closed();
	}

	function user_is_logged(){
		if($this->session->userdata('user_name')) return TRUE;
		else if($this->get_user_cookie()) return TRUE;
		else return FALSE;
	}

	function admin_is_logged(){
		if($this->session->userdata('user_name') && $this->session->userdata('user_admin')== '1')  return TRUE;
		else if($this->get_user_cookie()) {
			if($this->session->userdata('user_admin') == '1') return TRUE;
			else return FALSE;
		}
		else return FALSE;
	}

	function get_user_cookie() {
		if($this->input->cookie('user_name')) {

			$this->db->limit(1);
			$this->db->where(array('user_name' => $this->input->cookie('user_name')));
			$query=$this->db->get('user_member');

			if($query->num_rows()) {
				$row=$query->row_array();
					
				$timestamep=time();
					
				$new_data['last_time']=$timestamep;
				$new_data['last_ip']=$this->input->ip_address();
				$new_data['login_times']=$row['login_times']+1;

				$this->db->where(array('user_name' => $this->input->cookie('user_name')));
				$this->db->update('user_member',$new_data);
					
				$session_data=array(
			     'user_name'  => $row['user_name'],
			     'user_id'    => $row['user_id'],
			     'nick_name'  => $row['nick_name'],
			     'user_level' => $row['user_level'],
			     'user_admin' => $row['user_admin'],
				 'real_name'  => $row['real_name']
				);
				$this->session->set_userdata($session_data);

				return TRUE;
			}
			else return FALSE;
		}
		else return FALSE;
	}

	function check_user_logged(){
		if(IS_AJAX) $this->check_user_logged_ajax();
		else  $this->check_user_logged_standard();
	}

	function check_user_logged_standard() {
		if($this->user_is_logged()) return TRUE;
		else {
			$data['body']='login';
			$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
			$data['log_viewer']='index';
             
			$data['un_logged']='1';
			
			$data['form']=$this->my_load->view('login',array('log_viewer' => 'form','url_togo' => current_url()),TRUE);
			
			echo $this->load->view('index',$data,TRUE);
		    exit();
		}
	}

	function check_user_logged_ajax() {
		if($this->user_is_logged()) return TRUE;
		else {
			echo '<script>show_log_pannel();</script>';
			exit();
		}
	}

	function check_admin_logged(){
		if(IS_AJAX) $this->check_admin_logged_ajax();
		else  $this->check_admin_logged_standard();
	}

	function check_admin_logged_standard(){
		if($this->admin_is_logged()) return TRUE;
		else {
			//$this->session->sess_destroy();
				
			$data['form']=$this->load->view('admin/login',array('log_viewer' => 'form','url_togo' => current_url()),TRUE);
			$data['log_viewer']='index';
				
			$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
			$data['jsmin']=$this->minify->js_mini(array(
		    'js/admin/myjquery-adminlogin.js'
		    ),TRUE,'adminlogin');

		    echo $this->load->view('admin/login',$data,TRUE);
		    exit();
		}
	}

	function check_admin_logged_ajax() {
		if($this->admin_is_logged()) return TRUE;
		else {
			echo '<script>admin_log_pannel();</script>';
			exit();
		}
	}
    
	function get_user_nickname($user_id,$type='user') {
		$nickname=$this->mysql->item('user_member','nick_name',array('user_id' => $user_id));
		if($nickname) return $nickname;
		return $type=='admin'?$this->config->item('default_admin'):$this->config->item('default_nickname');
	}
	
	function get_attr($user_id,$attr){
		$this->db->where('user_id',$user_id);
		$this->db->limit(1);
		$query=$this->db->get('user_member');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0][$attr];
		}
		else return ($user_id==0 && $attr=='nick_name')?'佚名':'';
	}
     
	function check_if_super_admin() {
		if($this->session->userdata('user_name') && $this->session->userdata('user_level')=='0.0') return TRUE;
		else return FALSE; 
	}

	public function chk_username($username='') {
		$user_name=$username?$username:$this->input->post('user_name');
		$this->db->where('user_name',$user_name);
		$query=$this->db->get('user_member');
		if($query->num_rows()) return TRUE;
		else return FALSE;
	}

	function chk_captcha($captcha='') {
		$captcha_input=$captcha?$captcha:$this->input->post('captcha');
		if(trim(strtolower($captcha_input))!= $_SESSION['captcha'] || empty($_SESSION['captcha']))
		return FALSE;
		else return TRUE;
	}

	function chk_blockip(){
		$ip_address=$this->input->ip_address();
		$this->db->where('ip_address',$ip_address);
		$query=$this->db->get('sys_blockip');

		if($query->num_rows()) {
			show_404();
			exit();
		}
	}

	function chk_if_closed() {

		$path=explode('/',str_replace(base_url(), '', current_url()));
		if($path[0]==$this->config->item('admin_dir') || $path[0]=='myjavascript') return FALSE;

		else if($this->myconfig->item('site_closed')!='1' || $this->admin_is_logged()) return FALSE;
		else {
			$infor=$this->myconfig->item('closed_infor');
			$data=array(
			 'title'=> '网站暂停访问！',
			 'viewer' => 'site_closed',
			 'infor'  => $infor?$infor:'网站在故障排除中...'
			 );
			 echo $this->load->view('show_msg',$data,TRUE);
			 exit();
		}
	}

	function uid_is_logged($session_id,$ip_address,$uid) {
		//if(!$this->check_cookie()) return FALSE;
		return $this->check_session($session_id,$ip_address,$uid);
	}


	function check_session($session_id,$ip_address,$uid) {
		$this->db->where('session_id', $session_id);
		if ($this->session->sess_match_ip == TRUE)
		{
			$this->db->where('ip_address', $ip_address);
		}

		$query = $this->db->get($this->session->sess_table_name);

		// No result?  Kill it!
		if ($query->num_rows() == 0)
		{
			$this->session->sess_destroy();
			return FALSE;
		}

		// Is there custom data?  If so, add it to the main session array
		$row = $query->row();
		if (isset($row->user_data) AND $row->user_data != '')
		{
			$custom_data = $this->session->_unserialize($row->user_data);
			if(abs((int)$custom_data['user_id'])===$uid) return TRUE;
			else return FALSE;
		}
		else return FALSE;
	}

	function check_cookie() {
		$session = $this->input->cookie($this->session->sess_cookie_name);
		//echo $session;
		if ($session === FALSE)  return FALSE;

		if ($this->session->sess_encrypt_cookie == TRUE)
		{
			$session = $this->encrypt->decode($session);
		}
		else
		{
			$hash	 = substr($session, strlen($session)-32); // get last 32 chars
			$session = substr($session, 0, strlen($session)-32);

			if ($hash !==  md5($session.$this->session->encryption_key))
			{
				$this->session->sess_destroy();
				return FALSE;
			}
		}

		$session = $this->session->_unserialize($session);

		if ( ! is_array($session) OR ! isset($session['session_id']) OR ! isset($session['ip_address']) OR ! isset($session['user_agent']) OR ! isset($session['last_activity']))
		{
			$this->session->sess_destroy();
			return FALSE;
		}

		if (($session['last_activity'] + $this->session->sess_expiration) < $this->session->now)
		{
			$this->session->sess_destroy();
			return FALSE;
		}

		// Does the IP Match?
		if ($this->session->sess_match_ip == TRUE AND $session['ip_address'] != $this->input->ip_address())
		{
			$this->session->sess_destroy();
			return FALSE;
		}

		// Does the User Agent Match?
		if ($this->session->sess_match_useragent == TRUE AND trim($session['user_agent']) != trim(substr($this->input->user_agent(), 0, 50)))
		{
			$this->session->sess_destroy();
			return FALSE;
		}

		return TRUE;
	}
	
	function check_admin_right($class,$function,$type='json') {
		if($this->check_if_super_admin()) return TRUE; 
		
		$class=strtolower($class);
		$function=strtolower($function);
				
		$user_id=$this->session->userdata('user_id');
		$my_right=json_decode($this->mysql->item('user_member','user_right',array('user_id' => $user_id)),TRUE);
		
		if(isset($my_right[$class][$function]) && $my_right[$class][$function]=='1') return TRUE;
		else if(IS_AJAX)  {
			if($type=='json') return $this->echo_infor('对不起，您无权进行此操作！');
			else echo '<script>top_message("对不起，您没有权限！")</script>';
			exit(0);
		}
		else {
			$data['workplace_view']=$this->load->view('admin/without_right','',TRUE);
			$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
			echo $this->load->view('admin/index',$data,TRUE);
			exit(0);
		}
	}
	
	private function echo_infor($infor,$result='0',$url='current',$id=0) {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result, 
		 'url'    => !$url,
		 'id'     => $id
		 );

		echo json_encode($data);
		exit(0);
	 }
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */
