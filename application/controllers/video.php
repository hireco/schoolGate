<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Video extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('cms_function');
	}

	function _remap($cms_title_en,$array) {
		
		$method='cms_'.__CLASS__;

		$index_id=$this->cms_function->index_by_en_title($cms_title_en);

		if($index_id) {
			if($array) $this->cms_function->$method($index_id,$array[0]);
			else $this->cms_function->$method($index_id);
		}
		else show_404();
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
