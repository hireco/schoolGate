<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_member extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->helper('text');
		$this->load->model('str_func');

		$this->check->check_admin_logged();
		$method=array('','other','mine');
		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
	}

	public function index(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		$data['viewer']='index';
		$data['clist']=$this->clist('index');
		$data['workplace_view']=$this->load->view('admin/user_list',$data,TRUE);

		$data['mylist']=array('view','edit','right','dieuser','delete','lifeuser');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/calendar/calendar.js',
		'js/admin/myjquery-userlist.js',
		'js/admin/myjquery-useredit.js',
		'js/admin/myjquery-userright.js'
		),TRUE,'user_list');

		$this->load->view('admin/index',$data);
	}

	public function clist($action='ajax') {
		$this->db->order_by('last_time desc');
		$query=$this->db->get('user_member');
		$user_list=$query->result_array();

		$data=$this->load->view('admin/user_list',
		array(
		  'viewer'  =>  'clist',
		  'user_list' => $user_list
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function delete_user() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));

		$result=array();
		foreach ($ids as $index => $value) {
		   if($this->chk_right($value)) $result[]=$this->db->delete('user_member',array('user_id' => $value));
		   else $result[]=FALSE;
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除该用户！','1','',$this->input->post('id'));
		else return $this->echo_infor('对不起，您没有相应的权限！');
	}
    
    public function set_life() {
		
    	$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
        $user_life=$this->input->post('value');
        
		$result=array();
		foreach ($ids as $index => $value) {
			if($this->chk_right($value))  {
				   $this->db->where('user_id',$value);
				   $result[]=$this->db->update('user_member',array('user_life' => $user_life));
		    }
			else $result[]=FALSE;
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功更新对象！','1','',$this->input->post('id'));
		else return $this->echo_infor('对不起，您没有相应的权限！');
	}
	
	public function edit_member($action='form') {
		if($action=='form')  {
			if($this->input->post('user_id')) {
				
				$this->check->check_admin_right(__CLASS__,'view');
				
				$user_id=$this->input->post('user_id');
				
				if(!$this->chk_right($user_id))  return $this->echo_infor('对不起，您没有相应的权限！');
				
				$this->db->where('user_id',$user_id);
				$this->db->limit(1);
				$query=$this->db->get('user_member');
				if($query->num_rows()) {
					$row = $query->row_array();
					$this->load->library('my_avatar');
					$row['avatar']=$this->my_avatar->get_avatar_url($user_id,'middle');
					echo $this->load->view('admin/user_edit',$row,TRUE);
				}
				else return $this->echo_infor('对象不存在！');
			}
			else echo $this->load->view('admin/user_edit','',TRUE);
		}
				
		else if($action=='submit') {
			
			if(!$this->input->post('user_submit')) return $this->echo_infor('非法操作');
			
			foreach($_POST as $index => $value)
			$_POST[$index]=$this->str_func->utf8_unescape($value);

			$data=array('user_name','user_pass','nick_name','real_name',
		        'called_name','cellphone','qq','email','career','province',
		        'gender','birthday','user_level','user_admin','try_user'
		    );	

			$data=elements($data, common::deep_trim($_POST));			

			if($this->input->post('user_id')) { 
				
				$this->check->check_admin_right(__CLASS__,'edit');

				$user_id=$this->input->post('user_id');
				
				if(!$this->chk_right($user_id))  return $this->echo_infor('对不起，您没有相应的权限！');
				
				$this->db->where('user_id',$user_id);
				if(!$data['user_pass']) unset($data['user_pass']);
				else $data['user_pass']=md5($data['user_pass']);
				
				$this->db->update('user_member',$data);
				
				$sucessful_infor='成功编辑会员！';
			}
			else {
				$this->check->check_admin_right(__CLASS__,'add');
				
				if($this->check->chk_username($data['user_name'])) return $this->echo_infor('对不起，用户名已经被注册！');
				
				$timestamep=time();

			    $data['last_time']=$timestamep;
			    $data['register_time']=$timestamep;
			    $data['last_ip']=$this->input->ip_address();
			    $data['login_times']=0;
			    $data['uuid']=$this->myuuid(); //随机ID
			
				$data['user_pass']=md5($data['user_pass']);
				$this->db->insert('user_member',$data);
				$user_id=$this->db->insert_id();
				
				$sucessful_infor='成功添加会员！';
			}			

			if($this->db->affected_rows()) {
				return $this->echo_infor($sucessful_infor,'1','',$user_id);
			}
			else return $this->echo_infor('没有修改任何信息，请重试！');
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
	
	private function myuuid() {
    	$uuid=rand(1942,9999999999);
    	$query = $this->db->get_where('user_member', array('uuid' => $uuid),1);
        if ($query->num_rows() == 0){
        	return $uuid;
         }
         else{
         	$uuid=$this->myuuid();
         	return $uuid;
         }
    }
	
	private function chk_right($id) {
		$this->db->where('user_id',$id);
		$query=$this->db->get('user_member');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$user_level=$rows[0]['user_level'];
			$user_id=$rows[0]['user_id'];
			if($user_level > $this->session->userdata('user_level')) return TRUE;
			else if($this->session->userdata('user_level')=='0.0' && $user_id !=$this->session->userdata('user_id')) return TRUE;
			else return FALSE;
		}
		return FALSE;
	}

	public function other(){
		$this->check->check_admin_right(__CLASS__,'view');
		$user_id = $this->input->post('user_id');
		$this->view($user_id);
	}

	public function mine() {
		$user_id = $this->session->userdata('user_id');
		$this->view($user_id);
	}

	private function view($user_id='') {
		if(!$user_id)
			return IS_AJAX?$this->echo_infor('对象不存在！'):show_404('对象不存在！');

		$this->db->where('user_id',$user_id);
		$this->db->limit(1);
		$query=$this->db->get('user_member');

		if($query->num_rows()) {
			$data=$query->row_array();
		}
		else  return IS_AJAX?$this->echo_infor('对象不存在！'):show_404('对象不存在！');

		$this->load->library('my_avatar');
		$data['avatar']=$this->my_avatar->get_avatar_url($user_id,'middle');
		$data['workplace_view']=$this->load->view('admin/user_view',$data,TRUE);

		if(IS_AJAX) {
			echo $data['workplace_view'];
			return;
		}

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));

		$data['jsmin']=$this->minify->js_mini(array(),FALSE);

		$this->load->view('admin/index',$data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
