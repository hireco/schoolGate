<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Publication extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->model('functions');
		$this->load->model('publication_model');
	}

	function _remap($str) {

		$cur_year=date('Y',time());

		if(preg_match('/^[0-9]{4}$/i',$str)) $this->publication_model->pub_list($str);
		else $this->publication_model->pub_list($cur_year);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
