<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Player extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->model('myplayer');
		$this->output->cache(0); //此文件不缓存
	}

	public function index($format,$array)	{
		echo $this->myplayer->get_script($format,$array);
	}
	
	public function _remap($format,$array) {
		$this->index($format, $array);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
