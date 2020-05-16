<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class People extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->model('functions');
		$this->load->model('people_model');
		$this->load->model('str_func');
		$this->load->helper('array');
		$this->load->helper('text');
	}
	
	function people_group($group_id=0) {
        $this->people_model->people_group($group_id);
	}

	function people_list($title='') {
        
		$title_id= $title?$this->people_model->title_ids[$title]:'';

		$this->people_model->people_list($title_id);
	}
	
	function people_view($en_id='') {
		
		$this->db->where('en_id',$en_id);
	    $query=$this->db->get('add_people');
		$row=$query->row_array();

		if(!$row)  $this->functions->show_msg('错误的访问请求');
        
		$this->people_model->people_view($row['people_id']);
	}
	
	function people_edit($action='form') {
		if(!IS_AJAX)  $this->functions->show_msg();
		
		if(!$this->check->user_is_logged()) 
		return $this->echo_infor('访客无权操作，请先登录！');
	
		$people_id=$this->input->post('people_id');		
		$this->db->where('people_id',$people_id);
		$query=$this->db->get('add_people');
		
		if(!$query->num_rows()) return $this->echo_infor('对不起，人员信息不存在');
		
		$row=$query->row_array();
	
		if($action=='form') {
			
			$data = $row;
		    if($data['locked']=='1' || $data['user_name']!=$this->session->userdata('user_name')) 
		    return $this->echo_infor('您无权修改该信息');
		
		    session_start();
			
		    $data['viewer']='form';
		    $this->echo_infor($this->my_load->view('people_edit',$data,TRUE),'1');
		}
		else if($action=='submit') {
			
			$this->load->library('My_file');
			
			foreach($_POST as $index => $value)
			$_POST[$index]=$this->str_func->utf8_unescape($value);
			
			$data=array('en_name','cn_name','gender','born_year','avatar','title_id','degree','phone','zip_code','office','email','html_dir','personal_site','details','hide_phone','hide_email','hide_born_year');
			$data=elements($data, $_POST,'');
			
			if(strlen($data['details'])>65535) return $this->echo_infor('您的内容实在太长了，超出数据库字段长度，请尝试设置个性化主页！');		
			
			$this->db->where(array('people_id' => $people_id, 'user_name' => $this->session->userdata('user_name')));
			$result=$this->db->update('add_people',$data);
			
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
			
			if($result)  {
				$this->output->delete_cache('people/'.$row['en_id']);
				return $this->echo_infor('恭喜，编辑成功！','1');
			}
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}
	
	function _remap($method,$str) {
		switch ($method) {
			
			case 'group':	
			if($str && array_key_exists($str[0],$this->people_model->groups)) $this->people_group($str[0]);
			else $this->people_group();
			break;
			
			case 'list':			
			if($str && in_array($str[0],$this->people_model->titles)) $this->people_list($str[0]);
			else show_404();
			break;
			
			case 'edit':			
			if($str) $this->people_edit($str[0]);
			else $this->people_edit();
			break;
			
			case 'view':
			if($str) $this->people_model->people_view($str[0]);
			else  show_404();
			break;

			default:
			if($method == 'index') $this->people_list();
			else $this->people_view($method);		
			break;
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
