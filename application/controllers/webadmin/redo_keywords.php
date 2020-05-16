<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Redo_keywords extends CI_Controller {
	
	function __construct(){
    	parent::__construct(); 
    	
    	$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
    }
    
	public function index(){   
		
		$data['workplace_view']=$this->load->view('admin/redo_keywords','',TRUE);        
		
		$data['js']=array(
		  site_url('myjavascript/admin').'/?version='.$this->config->item('js_version')
		);
		
		$this->load->view('admin/index',$data);
	}

    function handle() {
        
		$query='update cms_index set `cms_keywords`=REPLACE(`cms_keywords`,"，", ",")';

		$this->db->select('index_id, cms_keywords');
		$this->db->from('cms_index');
		$query=$this->db->get();
		$rows=$query->result_array();
		
		foreach($rows as $index => $value ) {
		
		   $cms_keywords=explode(',',$value['cms_keywords']);
		   
		   foreach($cms_keywords as $index_i => $value_i) {
			   if(mb_strlen($value_i,'utf8')<2 || (mb_strlen($value_i,'utf8') <= 4 && preg_match('/^[A-Za-z0-9]+$/i',$value_i)) || (mb_strlen($value_i,'utf8') > 6 && !preg_match('/^[A-Za-z0-9]+$/i',$value_i)))
				   unset($cms_keywords[$index_i]);  
		   }

		   $cms_keywords= implode(',',$cms_keywords);
		   $this->db->where('index_id',$value['index_id']);
		   $this->db->update('cms_index',array('cms_keywords' => $cms_keywords));
		}

		return $this->echo_infor('成功处理','1');
	}

	private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result, 
		 'url'    => !$url?($result=='0'?'':'reload'):$url,
		 'id'     => $id
		);

		echo json_encode($data);
	}
}