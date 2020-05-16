<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('cms_function');
		$this->load->helper('text'); 
		$this->load->model('str_func');
	}

	function index() {

		$data['body']='cms/index';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);

	}
	
	function cms_list($class_id,$page_id=1) {
		
		if(!$class_id) show_404();
		$this->cms_function->cms_list($class_id,$page_id);
	}

	function cms($class_name_en,$page_id=1) {
		
		if(!$class_name_en) show_404();		    
		$class_id=$this->cms_function->class_by_en_name($class_name_en);

		$this->cms_function->cms_list($class_id,$page_id);
	}

	function _remap($func,$array) {

		$method='cms_'.$func;
		
        if($method == 'cms_list') {
		    if(isset($array[1])) $this->cms_list($array[0],$array[1]);
			else if($array) $this->cms_list($array[0]);
			else show_404();
		} 
		else if(method_exists($this->cms_function, $method)) {
			if(isset($array[1])) $this->cms_function->$method($array[0],$array[1]);
			else if($array) $this->cms_function->$method($array[0]);
			else show_404();
		}
		else if($func != 'index') {
			if($array) $this->cms($func,$array[0]);
			else $this->cms($func);
		} 
		else $this->index();
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
