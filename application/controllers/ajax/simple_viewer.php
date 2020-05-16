<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class simple_viewer extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('user_model');		
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
	}
	
	public function color_picker(){
		echo $this->load->view('ajax/color_picker','',TRUE);
	}
	
	public function show_provinces() {
		$this->user_model->provinces();
	}
	
	public function show_careers() {
		$this->user_model->user_careers();
	}
}

/* End of file show_dialog.php */
/* Location: ./application/controllers/pannel/show_dialog.php */