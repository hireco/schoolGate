<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class About extends CI_Controller {
	function __construct(){
    	parent::__construct(); 	
    	$this->check->check_admin_logged();
    }
    
	public function index(){   
		
		$data['workplace_view']=$this->load->view('admin/about','',TRUE);

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		
		$data['jsmin']=$this->minify->js_mini(array(),FALSE);
		
		$this->load->view('admin/index',$data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
