<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller {
    
    function __construct(){
    	parent::__construct();
    	$this->load->library('Common');
		$this->load->model('user_model');

    	$this->check->check_user_logged();
    	
    	$this->output->cache(0); //此文件不缓存
    }
    
    function index() {
    	
    	$data['title']='用户中心';
		$data['en_id']= $this->user_model->people_en_id();
    	
    	$data['body']='user/index';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
		$this->load->view('index',$data);
    }
}

/* End of file index.php */
/* Location: ./application/controllers/user/index.php */
