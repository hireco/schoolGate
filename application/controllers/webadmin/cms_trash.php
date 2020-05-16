<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms_trash extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('cms_model');
		$this->load->helper('text');
		
		$this->check->check_admin_logged();
        
	}

	public function index(){
		$data['viewer']='index';
		$data['clist']=$this->clist('index');
		$data['workplace_view']=$this->load->view('admin/cms_trash',$data,TRUE);

		$data['mylist']=array('view','recycle','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/admin/myjquery-cmstrash.js'
		),TRUE,'trash_list');

		$this->load->view('admin/index',$data);
	}

	public function clist($action='index') {
		
		$time_filter=$this->input->cookie('time_filter');
		if($time_filter) {
			$time_filter=explode('_',$time_filter);
			$time_filter=$time_filter[1];	
		}
		
		if(!$this->check->check_if_super_admin()) {	
		
		    $my_class=$this->cms_model->get_my_classes();		    
			if($my_class) $this->db->where_in('class_id',$my_class);
		}
		
		if($time_filter) $this->db->where('post_time >',time()-$time_filter*24*3600); 
		$this->db->order_by('index_id desc');
		$query=$this->db->get('cms_trash');
		$cms_list=$query->result_array();

		$data=$this->load->view('admin/cms_trash',
		array(
		  'viewer'  =>   'clist',
		  'cms_list' =>  $cms_list,
		  'children_list' => $this->cms_model->children_list(),
		  'my_class' =>  isset($my_class)&&$my_class?implode(',',$my_class):''
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
	
	function recycle_cms() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) {
			
			$this->db->limit(1);
			$this->db->where(array('index_id' => $value));
			$query=$this->db->get('cms_trash');

			if(!$query->num_rows())
			return $this->echo_infor('对不起，内容不存在！');
				
			$data=$query->row_array();

			if(!$this->cms_model->check_if_my_classes($data['class_id'])) 
			return $this->echo_infor('对不起，您无权操作该栏目');
            
			unset($data['trash_time'],$data['trasher']);
			
			$result[]=$this->db->insert('cms_index',$data);
			$result[]=$this->db->delete('cms_trash',array('index_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功从回收站恢复内容！','1','',$this->input->post('id'));
			else return $this->echo_infor('恢复失败，请重来！');
	}
	
	public function delete_cms() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) {
			
			$this->db->limit(1);
			$this->db->where(array('index_id' => $value));
			$query=$this->db->get('cms_trash');

			if(!$query->num_rows())
			return $this->echo_infor('对不起，回收站中没有找到该内容！');
				
			$data=$query->row_array();

			if(!$this->cms_model->check_if_my_classes($data['class_id'])) 
			return $this->echo_infor('对不起，您无权操作该栏目');

			$result[]=$this->db->delete('cms_'.$this->myconfig->cms_model($data['model_id'],'table'),array('index_id' => $value));
			$result[]=$this->db->delete('cms_trash',array('index_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功清空该内容！','1','',$this->input->post('id'));
			else return $this->echo_infor('清空内容失败，请重来！');
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
