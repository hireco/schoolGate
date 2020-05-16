<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Innercms extends CI_Controller {
	
    function __construct(){
    	parent::__construct();
    	$this->load->model('cms_function');
		$this->load->helper('text'); 
		$this->load->model('str_func');
    	    	
    	$this->check->check_user_logged();
    	
    	if(!IS_AJAX) $this->functions->show_msg();
    }
    
    function index() {
    	$cur_user_level=$this->session->userdata('user_level');	   
			
		$this->db->order_by('top desc, post_time desc');
		$this->db->where('view_right >=', $cur_user_level);  
		$this->db->where('view_right <=', 3.0);
		
		$query=$this->db->get('cms_index');

		$data['entry_list']=$query->result_array();
    	
    	$this->my_load->view('user/innercms',$data);
    }
    
    
}

/* End of file avatar.php */
/* Location: ./application/controllers/user/avatar.php */
