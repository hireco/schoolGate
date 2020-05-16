<?php
class Html extends CI_Controller
{
	function  __construct() {
    	parent::__construct();
    	$this->load->model('html_model');	
    }

    function html_view($en_title) {
	    
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('en_title',$en_title);
	    $query=$this->db->get('add_html');
		$row=$query->row_array();

		if(!$row)  $this->functions->show_msg('错误的访问请求');

		$this->html_model->html_view($row['html_id']);
	}
	
	function html_list($group='',$page_id=1) {
	   
	   if($group) {
		   if(!isset($this->html_model->group_ids[$group])) $this->functions->show_msg('分类不存在！');
		   $group_id= $this->html_model->group_ids[$group];
		   $this->html_model->html_list($group_id,$page_id);
	   }
	   else  
		   $this->html_model->html_list(0,$page_id);
	    
	}

	function _remap($method,$str) {
		switch ($method) {
			
			case 'list':
			if($str && in_array($str[0],$this->html_model->groups)) {
				if(isset($str[1])) $this->html_list($str[0],$str[1]);
				else  $this->html_list($str[0]);
			}			
			else  $this->html_list();
			break;

			default:
			if($method && $method!='index') $this->html_view($method);
			else  $this->html_model->html_list();
			break;
		}
	}
}

/* End of file image.php */
/* Location: ./application/controllers/image.php */
