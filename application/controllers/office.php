<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Office extends CI_Controller {
	function __construct(){
    	parent::__construct();
    }
    
	public function index()
	{
		$this->load->view('admin/office');
	}
}

/* End of file index.php */
/* Location: ./application/controllers/index.php */