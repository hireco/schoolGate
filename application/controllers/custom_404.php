<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Custom_404 extends CI_Controller {
	function __construct(){
		parent::__construct();
	}

    public function index(){
        $this->output->set_status_header('404');

		$data=array(
			'title'=>   '404 Page Not Found',
			'viewer' => '404_error',
			'infor'  => 'The page you requested was not found.'
		);

		if(isset($this->my_load)) echo $this->my_load->view('show_msg',$data,TRUE);
		else echo $this->load->view('show_msg',$data,TRUE);

		exit(0);
    }
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */