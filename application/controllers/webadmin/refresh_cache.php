<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Refresh_cache extends CI_Controller {
	function __construct(){
    	parent::__construct(); 
    	
    	$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
    }
    
	public function index(){   
		
		$data['workplace_view']=$this->load->view('admin/refresh_cache','',TRUE);        
		
		$data['js']=array(
		  site_url('myjavascript/admin').'/?version='.$this->config->item('js_version')
		);
		
		$this->load->view('admin/index',$data);
	}
	
	public function do_refresh() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		$this->load->helper('file');
		
		$result=TRUE;
		
		$lifetime=time()-$this->myconfig->item('cache_time')*60;
		
		$files=get_filenames(APPPATH.'cache/',TRUE);
		
		foreach ($files as $index => $value) {
		  	$filename=basename($value);
		  	if(is_file($value) && strlen($filename)==32 )
		  	$result=unlink($value);
		}
		
		if($result) return $this->echo_infor('成功更新缓存文件','1');
		else return $this->echo_infor('更新缓存失败');
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

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
