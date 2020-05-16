<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Photo extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('cms_function');
	}

	function photo_list($class_name_en,$page_id=1) {
		
		if(!$class_name_en) show_404();		    
		$class_id=$this->cms_function->class_by_en_name($class_name_en);

		$this->cms_function->cms_list($class_id,$page_id,'cms_list_by_thumb');
	}

	function _remap($para,$array) {
		
		if($para == 'list') {
		    if(isset($array[1])) $this->photo_list($array[0],$array[1]);
			else if($array) $this->photo_list($array[0]);
			else show_404();
		} 
		else {
			$method='cms_'.__CLASS__;
		    $index_id=$this->cms_function->index_by_en_title($para);
			if($index_id) {
			  if($array) $this->cms_function->$method($index_id,$array[0]);
			  else $this->cms_function->$method($index_id);
		    }
		    else show_404();
		}
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
