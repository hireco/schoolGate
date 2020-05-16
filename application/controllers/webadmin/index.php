<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller {
	function __construct(){
    	parent::__construct();
    	
    	$this->check->check_admin_logged();
    }
    
	public function index()
	{   
		//内部信息
		$this->db->order_by('notice_id desc');
		$this->db->select('notice_id,notice_title,post_time');
		$this->db->limit(5);
		$query=$this->db->get('sys_notice');
		
		$home['notices']=$query->result_array();		
		$home['viewer']='index';
		
		$data['workplace_view']=$this->load->view('admin/home',$home,TRUE);

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		
		$data['jsmin']=$this->minify->js_mini(array(),FALSE);
		
		$this->load->view('admin/index',$data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
