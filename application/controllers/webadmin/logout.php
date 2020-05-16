<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logout extends CI_Controller {
	function __construct(){
		parent::__construct();
		
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index()	{
	   if($this->check->user_is_logged()) {
	   	  $this->session->sess_destroy();
	   	  $this->delete_cookie('user_name');
	   	  redirect(base_url());
	   }
	   else redirect(base_url());
	}

	public function ajax() {
   	
   	   if($this->check->user_is_logged()) {
	   	  $this->session->sess_destroy();
	   	  $this->delete_cookie('user_name');
	   	  echo '1';
	   }
	   else echo '0';
   }
   
	private function delete_cookie($name) {
		$cookie = array(
           'name'   => $name,
           'value'  => ''
        );
        $this->input->set_cookie($cookie);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
