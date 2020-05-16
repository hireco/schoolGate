<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller {
	function __construct(){
    	parent::__construct();
    	$this->load->model('myquery');    	
    	$this->load->model('cms_function');
    	$this->load->model('functions');
		$this->load->model('str_func');
    }
    
	public function index()
	{
		//$data['body']=strtolower(__CLASS__);
		
		$data['header']='header';
    	$data['body']='index';
    	$data['footer']='footer';
		
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
		$this->load->view('index',$data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/index.php */
