<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lostpass extends CI_Controller {
	function __construct(){
		parent::__construct();		
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		
		
		session_start(); //cool captcha 需要启用 session
		
		$this->output->cache(0); //此文件不缓存
	}

    function index() {
            	
       $data['body']='lostpass';  
       $data['viewer']='apply';
       
       $data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
	   $this->load->view('index',$data);
    }
    
    function submit() {
       
       if(!IS_AJAX) $this->functions->show_msg(); 
       
       if(!$this->check->chk_captcha($this->input->post('captcha'))) return $this->echo_infor('错误的验证码输入！');
       if(!$this->input->post('user_name')) return $this->echo_infor('非法操作！');
       
       $this->load->model('send_mail');
       
       foreach($_POST as $index => $value)
	   $_POST[$index]=$this->str_func->utf8_unescape($value);
       
       $user_name=$_POST['user_name'];
       $email=$_POST['email'];
       
       $user_id='user_id';
       
       $data=array(
         'user_name' => $user_name,
         'email'  =>   $email
       );
       
       $this->db->where($data);
       $query=$this->db->get('user_member');
       
       if (!$query->num_rows()) return  $this->echo_infor('错误的用户名和邮箱地址！'); 
       	
       $user_key=md5($user_name+ rand()*100000);
       	    
       $data=$query->row_array();
       	           	    
       $insert_data=array(
       	'base_url'  => 'lostpass/reset',
       	'user_id'   => $data[$user_id],
       	'user_key'  => $user_key,
       	'born_date' => time()
       );
       		
       $this->db->insert('user_link', $insert_data); 
       //insert the link into the database
       		
       $data['mylink']=anchor(site_url('lostpass/reset/'.$data[$user_id].'/'.$user_key),site_url('lostpass/reset/'.$data[$user_id].'/'.$user_key));
       $data['user_name']=$user_name;
       $data['click_for']='请点击下面的地址重置您的用户密码';
       $data['viewer']='mail';

       $content=$this->my_load->view('lostpass',$data,TRUE);      
       
	   $subject='重置用户密码, ';
	   
       $result = $this->send_mail->send($email,$subject,$content);
       	    
       if($result) return $this->echo_infor('请登陆您的邮箱以重置用户密码！','1');
       else return $this->echo_infor('您的请求暂时无法处理，请稍后重试！');
              
    }
    
    function reset($user_id='',$user_key='',$user_type='e') {
      if(!$user_id || !$user_key || !$user_type)  show_404();
      
      
      $expiration = time()-$this->config->item('privacy_link_life'); 	
    	
      $data=array(
          'user_id'      => $user_id, 
          'user_key'     => $user_key,
          'base_url'     => 'lostpass/reset',
          'born_date >'  => $expiration
      );	
      
      $this->db->where($data);
      $query=$this->db->get('user_link');
      
      if (!$query->num_rows()) $this->functions->show_msg();
      
      $data=$query->row_array();
      
      $data['body']='lostpass';
      $data['viewer']='reset';     
       
      $data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
	  $this->load->view('index',$data);
      
   }
    
    function change() {
    	
    	if(!$this->input->post('password')) return $this->echo_infor('非法操作！');
    	
    	$expiration = time()-$this->config->item('privacy_link_life'); 	

    	foreach($_POST as $index => $value)
	    $_POST[$index]=$this->str_func->utf8_unescape($value);
    	
        $data=array(
            'user_id'      =>  $_POST['user_id'], 
            'user_key'     =>  $_POST['user_key'],
            'base_url'     =>  'lostpass/reset',
            'born_date >'  =>  $expiration
        );
        	
        $this->db->where($data);
        $query=$this->db->get('user_link');
        
        if (!$query->num_rows()) return $this->echo_infor('错误的邮件地址！');
        
        $user_id='user_id';
        $user_pass='user_pass';
        
        
        $data = array(
           $user_pass => md5(trim($_POST['password']))
        );
        
        $this->db->where($user_id, $_POST['user_id']);
        $this->db->update('user_member', $data);
        
        
        $data=array('born_date <'  => $expiration);
        $this->delete_link($data);
        
        return $this->echo_infor('恭喜，您已成功设置新密码！','1');
    }
    
    private function delete_link ($binds) {
        $this->db->delete('user_link', $binds); 
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
