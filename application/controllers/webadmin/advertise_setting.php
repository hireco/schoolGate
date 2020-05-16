<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Advertise_setting extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');	
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/advertise_setting', 
		array(
		'clist'  => $this->clist(),
		'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/admin/myjquery-adssetting.js'
		));
		
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
	    
		$this->load->helper('text');
		$this->db->order_by('setting_id asc');

		$query=$this->db->get('add_ads_setting');

		$settings=$query->result_array();

		$data=$this->load->view('admin/advertise_setting',
		array(
			'action'  => 'clist',
		    'settings' => $settings
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function edit($id=0,$submit=0) {		
		
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('setting_id' => $id));
			$query=$this->db->get('add_ads_setting');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，参数不存在！');

			$data=$query->result_array();
			$data[0]['action']='edit';
			return $this->echo_infor($this->load->view('admin/advertise_setting',$data[0],TRUE),'1'); 	
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('setting_submit')) 
				return $this->echo_infor('操作非法！');
		    
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('setting_value','direction');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);

			$this->db->where('setting_id',$id);
			$result=$this->db->update('add_ads_setting',$data);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	function add($submit=0) {
		if($submit==0) {
			$data['action']='add';
			return $this->load->view('admin/advertise_setting',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('setting_add_submit')) 
				return $this->echo_infor('操作非法！');
				
			foreach($_POST as $index => $value)
		    $_POST[$index]=$this->str_func->utf8_unescape($value);	
				
			$data=array('setting_name','setting_value','direction');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);	
		    
		    $data['system']='0';
		    
		    $result=$this->db->insert('add_ads_setting',$data);
			
			if($result)  return $this->echo_infor('恭喜，添加成功！','1');	
			else return $this->echo_infor('添加失败，请重来！');
		}
	}
	
	function delete_setting() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$this->db->where(array('setting_id' => $id,'system' => '0'));
		$result=$this->db->delete('add_ads_setting');
		
		if($result)  return $this->echo_infor('成功删除广告栏设置！','1','',$id);	
		else return $this->echo_infor('不能删除或删除失败，请重来！');
	}
	
	function chk_setting_name() {
		$setting_name=$this->input->post('setting_name');
		$this->db->where('setting_name',$setting_name);
		$query=$this->db->get('add_ads_setting');
		
		if(mb_strlen($setting_name)>15 || $query->num_rows()) {
			echo '0';
			return FALSE;
		}
		else {
			echo '1';
			return TRUE;
		}
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
