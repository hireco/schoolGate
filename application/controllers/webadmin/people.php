<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class People extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->helper('text');
		$this->load->model('str_func');
		$this->load->model('people_model');
		 
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit','hide','no_hide','locked','no_locked','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/people_list',
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
		'js/admin/myjquery-people.js'
		));
		
        $data['cssmin']=$this->minify->css_mini(array('skin/admin/css/upload_crop.css','js/swfupload/swfupload.css')); 
		$this->load->view('admin/index',$data);
	}

	public function clist($action='') {
			
		$this->db->order_by('en_name asc');
		$query=$this->db->get('add_people');
		$people=$query->result_array();

		$data=$this->load->view('admin/people_list',
		array(
			'action'  => 'clist',
		    'people' => $people
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function add() {
		return $this->load->view('admin/people_edit');
	}

	public function edit($id=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		$this->db->where(array('people_id' => $id));
		$query=$this->db->get('add_people');

		if(!$query->num_rows())
		return $this->echo_infor('对不起，参数不存在！');

		$data=$query->row_array();
		return $this->echo_infor($this->load->view('admin/people_edit',$data,TRUE),'1');
	}

	public function submit() {
		$this->load->library('My_file');
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('people_submit'))
		return $this->echo_infor('操作非法！');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('user_name','en_id','en_name','cn_name','gender','born_year','avatar','title_id','degree','phone','zip_code','office','email','html_dir','personal_site','details','hide_phone','hide_email','hide_born_year');
		$data=elements($data, $_POST,'');      
        
		if(strlen($data['details'])>65535) return $this->echo_infor('您的内容实在太长了，超出数据库字段长度，请尝试设置个性化主页！');

        $people_id=$this->input->post('people_id');
		
		if($people_id) {
			$this->db->where('people_id',$people_id);
			$result=$this->db->update('add_people',$data);
		}
		else {
			$result=$this->db->insert('add_people',$data);
			$people_id=$this->db->insert_id();
		}
         
		$html_dir='public_html/'.$data['html_dir'];
		if(!is_dir($html_dir)) {
			$this->my_file->mk_mydir($html_dir);
			$filename=$html_dir.'/index.html';
			$data['people_id']=$people_id;
			$content=$this->my_load->view('public_html',$data,TRUE);
			$fp=fopen($filename, 'w');
			fwrite($fp, $content);
			fclose($fp);
		}
		
		if($result)  return $this->echo_infor('恭喜，编辑成功！','1');
		else return $this->echo_infor('编辑失败，请重来！');
	}
	
	public function locked() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		$locked=$this->input->post('value');
		
		$result=array();		
		foreach ($ids as $index => $value) {
			$this->db->where('people_id',$value);
			if($locked=='1') $result[]=$this->db->update('add_people',array('locked' => '1'));
			else $result[]=$this->db->update('add_people',array('locked' => '0'));
		}
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新！','1','',$this->input->post('id'));
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
			$this->db->where('people_id',$value);
			if($hide=='1') $result[]=$this->db->update('add_people',array('hide' => '1'));
			else $result[]=$this->db->update('add_people',array('hide' => '0'));
		}
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新！','1','',$this->input->post('id'));
			else return $this->echo_infor('操作失败，请重来！');
	}
	
	public function delete_people() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) 
			$result[]=$this->db->delete('add_people',array('people_id' => $value));
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除对象！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
	}
	
	public function check_username() {
	   
		$user_name=$this->input->post('user_name');		
		$this->db->where('user_name',$user_name);
		$query=$this->db->get('user_member');

		if($query->num_rows()) echo '1';
		else echo '0';

	}

	public function check_en_id() {
	   
		$en_id=$this->input->post('en_id');  
		$people_id=$this->input->post('people_id'); 
		
		$this->db->where('en_id',$en_id); 
		$query=$this->db->get('add_people');

		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['people_id']==$people_id) return true;
			else echo 'error';
			return false;
		}
		else return true;

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
