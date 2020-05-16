<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Guestbook extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		$this->load->model('guest_model');
		 
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('view','delete','recommend','no_recommend','reply','hide','no_hide');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/guestbook',
		array(
		'clist'  => $this->clist(),
		'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/admin/myjquery-guestbook.js'
		));

		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
			
		$this->db->order_by('guest_id desc');
		$query=$this->db->get('add_guestbook');
		$guestbooks=$query->result_array();

		$data=$this->load->view('admin/guestbook',
		array(
			'action'  => 'clist',
		    'guestbooks' => $guestbooks
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function add() {
		return $this->load->view('admin/guestbook',array('action' => 'post'));
	}
    
	public function view($id=0) {
		if(!$id) return FALSE;		
		$this->db->where(array('guest_id' => $id));
		$query=$this->db->get('add_guestbook');
		if($query->num_rows()) {
		  	$rows=$query->result_array();
		  	$rows[0]['action']='viewer';
		  	$this->db->where('guest_id',$id);
		  	$this->db->update('add_guestbook',array('checked' => '1'));
		  	
		  	if($rows[0]['parent_id']) {
		  		$this->db->where('guest_id',$rows[0]['parent_id']);
		  		$query=$this->db->get('add_guestbook');
		  		if($query->num_rows()) {
		  			$contents=$query->result_array();
		  			$rows[0]['parent_content']=$contents[0]['guest_content'];
		  		}
		  	}
		  	
		  	echo $this->load->view('admin/guestbook',$rows[0],TRUE);
		}
	}
	
	public function reply($id=0) {
		
		if(!$id) return $this->echo_infor('操作非法！');

		$this->db->where(array('guest_id' => $id));
		$query=$this->db->get('add_guestbook');

		if(!$query->num_rows())
		return $this->echo_infor('对不起，对象不存在！');

		$data=$query->result_array();
		$data[0]['action']='post';
		return $this->load->view('admin/guestbook',$data[0]);
	}

	public function submit() {
		
		if(!$this->input->post('guest_submit'))
		return $this->echo_infor('操作非法！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('guest_name','guest_topic','top_type','sub_type','guest_content','guest_id');
		$data=elements($data, $_POST,'');
		$data=common::deep_trim($data);
        
		$timestamep=time();
		
		$data['post_time']=$timestamep;
		$data['post_ip']=$this->input->ip_address();
		
		if($data['guest_id']) {
			
			$this->check->check_admin_right(__CLASS__,'reply');
			
			$data['parent_id']=$data['guest_id'];
			$this->db->where('guest_id',$data['guest_id']);
			$this->db->update('add_guestbook',array('processed' => '1'));
			unset($data['guest_id']);
			$result=$this->db->insert('add_guestbook',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,'post');

			unset($data['guest_id']);
			$result=$this->db->insert('add_guestbook',$data);
		}
			
		if($result)  return $this->echo_infor('恭喜，操作成功！','1');
		else return $this->echo_infor('操作失败，请重来！');
	}
    
	public function delete_entries() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) 
			$result[]=$this->db->delete('add_guestbook',array('guest_id' => $value));
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除留言！','1','',$this->input->post('id'));
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
		    $this->db->where('guest_id',$value);
			$result[]=$this->db->update('add_guestbook',array('recommend' => $recommend?time():0));
		}
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新留言！','1','',$this->input->post('id'));
			else return $this->echo_infor('操作失败，请重来！');
	}
	
	public function hide() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		$hide=$this->input->post('value');
		
		$result=array();		
		foreach ($ids as $index => $value) {
		    $this->db->where('guest_id',$value);
			$result[]=$this->db->update('add_guestbook',array('hide' => $hide));
		}
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新留言！','1','',$this->input->post('id'));
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
