<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Avatar extends CI_Controller {
	
    function __construct(){
    	parent::__construct();
    	$this->load->model('swf_avatar');
    	$this->load->model('functions');
    	
    	$this->output->cache(0); //此文件不缓存
    	//注：它实际是通过提交表单的方式上传文件的,不是ajax
    }
	
	function crossdomain() {
	    $data = file_get_contents('crossdomain.xml');
		echo $data;
	}
    
    function index() {
    	
    	$this->check->check_user_logged();
    	
    	if(!IS_AJAX) $this->functions->show_msg();
    	
    	$data['avatar']=$this->my_avatar->list_my_avatar($this->session->userdata('user_id'),TRUE);
    	$this->my_load->view('user/avatar',$data);
    }
    
    function swf_avatar() {
    	
    	if(IS_AJAX) {
    		$this->check->check_user_logged();  
    		$this->swf_avatar->index();
    	} 
    	else if($this->input->get('a')) $this->swf_avatar->index();
    	else show_404();
    }
}

/* End of file avatar.php */
/* Location: ./application/controllers/user/avatar.php */
