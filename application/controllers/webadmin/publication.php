<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Publication extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->helper('text');
		$this->load->model('str_func');
		$this->load->model('publication_model');
		 
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/publication',
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
		'js/admin/myjquery-publication.js'
		));
		
        $data['cssmin']=$this->minify->css_mini(array('skin/admin/css/upload_crop.css','js/swfupload/swfupload.css')); 
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
			
		$this->db->order_by('pub_id desc');
		$query=$this->db->get('add_publication');
		$publications=$query->result_array();

		$data=$this->load->view('admin/publication',
		array(
			'action'  => 'clist',
		    'publications' => $publications
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function add() {
		return $this->load->view('admin/publication',array('action' => 'edit'));
	}

	public function edit($id=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		$this->db->where(array('pub_id' => $id));
		$query=$this->db->get('add_publication');

		if(!$query->num_rows())
		return $this->echo_infor('对不起，参数不存在！');

		$data=$query->result_array();
		$data[0]['action']='edit';
		return $this->echo_infor($this->load->view('admin/publication',$data[0],TRUE),'1');
	}

	public function submit() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('pub_submit'))
		return $this->echo_infor('操作非法！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('pub_title','pub_type','authors','pub_time');
		$data=elements($data, $_POST,'');
        $data['user_id']=$this->session->userdata('user_id');
        
        switch ($data['pub_type']) {
        	case 'paper':
        	$data['pub_details']=array(
        	  'pub_condition' => $_POST['pub_condition'],
        	  'journal' => $_POST['journal']        	  
        	);
        	if($_POST['pub_condition']=='published') {
        		$data['pub_details']['volumn']=$_POST['volumn'];
        		$data['pub_details']['page']=$_POST['page'];
        		$data['pub_details']['cited'] =$_POST['cited'];
        	}
        	break;
        	
        	case 'book':
        	$data['pub_details']=array(
        	  'publisher' => $_POST['publisher'],
        	  'publish_area' => $_POST['publish_area']
        	);
        	break;
        	
        	case 'talk':
        	$data['pub_details']=array(
        	  'meeting'  => $_POST['meeting'],
        	  'meeting_city' => $_POST['meeting_city']
        	);
        	break;
        }
		
        $data['pub_details']=json_encode($data['pub_details']);
        
        switch ($_POST['to_upload']) {
        	case '1':
        	$data['pub_file']=array(
        	  '1',
        	  $_POST['file_uploaded']
        	);
        	break;
        	
        	case '0':
        	$data['pub_file']=array(
        	  '0',
        	  $_POST['file_url']
        	);
        	break;
        }
        
        $data['pub_file']=json_encode($data['pub_file']);
        
        $pub_id=$this->input->post('pub_id');
		
		if($pub_id) {
			$this->db->where('pub_id',$pub_id);
			$result=$this->db->update('add_publication',$data);
		}
		else {
			$result=$this->db->insert('add_publication',$data);
		}
			
		if($result)  return $this->echo_infor('恭喜，编辑成功！','1');
		else return $this->echo_infor('编辑失败，请重来！');
	}
    
	public function delete_pub() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) 
			$result[]=$this->db->delete('add_publication',array('pub_id' => $value));
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除对象！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
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
