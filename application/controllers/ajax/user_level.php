<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_level extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
		
	}

	public function index(){
		$user_level=$this->config->item('user_level');		
		echo '<ul id="user_level_list">';
		foreach($user_level as $index => $value) {
			echo '<li style="font-size:12px; margin-bottom:4px;" id="'.$index.'">'.$value.'</li>';
		}
		echo '</ul>';
	}
}

/* End of file show_dialog.php */
/* Location: ./application/controllers/pannel/show_dialog.php */