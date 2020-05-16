<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Myjavascript extends CI_Controller {
	function __construct(){
    	parent::__construct();
    	$this->output->cache(0); //此文件不缓存
    }
    
	public function index(){
		$this->index_value();
	}
	
	public function admin() {
		$this->admin_value();
	}
	
	public function admin_value() {
		
		$json_str=array(
		'base_url'       => base_url(),
		'url_suffix'     => $this->config->item('url_suffix'),
		'admin_base'     => base_url().$this->config->item('admin_dir').'/',
		'thumb_prefix'   => $this->config->item('thumb_prefix'),
		'site_base'      => $this->config->item('site_base'),
		'child_type'     => $this->config->item('child_type'),
		'admin_login_url'=> site_url($this->config->item('admin_dir').'/login')
		);
		
		echo 'var json_str='.json_encode($json_str).';';
	}
	
	public function index_value() {
		
		$json_str=array(
		'base_url'      => base_url(),
		'url_suffix'    => $this->config->item('url_suffix'),
		'thumb_prefix'  => $this->config->item('thumb_prefix'),
		'site_base'     => $this->config->item('site_base'),
		'child_type'    => $this->config->item('child_type'),
		'register_url'  => site_url('register'),
		'login_url'     => site_url('login'),
		'image_path'    => $this->myconfig->get_template('skin_dir').'/images/'
		);
		
		echo 'var json_str='.json_encode($json_str).';';
	}
	
}

/* End of file index.php */
/* Location: ./application/controllers/index.php */
