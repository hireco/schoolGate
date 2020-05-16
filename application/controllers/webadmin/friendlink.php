<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Friendlink extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		 
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit','delete','recommend','no_recommend');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/friendlink',
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
		'js/admin/myjquery-friendlink.js'
		));

		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
			
		$this->db->order_by('recommend desc');
		$query=$this->db->get('add_link');
		$links=$query->result_array();

		$data=$this->load->view('admin/friendlink',
		array(
			'action'  => 'clist',
		    'links' => $links
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function add() {
		return $this->load->view('admin/friendlink',array('action' => 'edit'));
	}

	public function edit($id=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		$this->db->where(array('link_id' => $id));
		$query=$this->db->get('add_link');

		if(!$query->num_rows())
		return $this->echo_infor('对不起，参数不存在！');

		$data=$query->result_array();
		$data[0]['action']='edit';
		return $this->echo_infor($this->load->view('admin/friendlink',$data[0],TRUE),'1');
	}

	public function submit() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('link_submit'))
		return $this->echo_infor('操作非法！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('link_title','link_url','link_logo','link_id');
		$data=elements($data, $_POST,'');
		$data=common::deep_trim($data);

		if($data['link_id']) {
			$this->db->where('link_id',$data['link_id']);
			$result=$this->db->update('add_link',$data);
		}
		else {
			unset($data['link_id']);
			$result=$this->db->insert('add_link',$data);
		}
			
		if($result)  return $this->echo_infor('恭喜，编辑成功！','1');
		else return $this->echo_infor('编辑失败，请重来！');
	}
    
	public function delete_link() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) 
			$result[]=$this->db->delete('add_link',array('link_id' => $value));
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除链接！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
	}
	
	public function recommend() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		$recommend=$this->input->post('value');
		
		$result=array();		
		foreach ($ids as $index => $value) {
		    $this->db->where('link_id',$value);
			$result[]=$this->db->update('add_link',array('recommend' => $recommend?time():0));
		}
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新链接！','1','',$this->input->post('id'));
			else return $this->echo_infor('操作失败，请重来！');
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
