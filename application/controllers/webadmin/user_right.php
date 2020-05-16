<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_right extends CI_Controller {
	
	function __construct(){
    	parent::__construct(); 
    	$this->load->model('admin_model');
    	
    	$this->check->check_admin_logged();
		if(!IS_AJAX) show_404();
    }
    
	public function index(){   
		if(!$this->input->post('ajax') || !$this->input->post('user_id'))
		return $this->echo_infor('操作非法！');
		
        $user_id=$this->input->post('user_id');
		if(!$this->chk_right($user_id))  return $this->echo_infor('对不起，您的权限不够！');
		
		$data['user_id']=$user_id;
		$data['user_name']=$this->check->get_attr($user_id,'user_name'); 
		$data['cms_class']=$this->check->get_attr($user_id,'cms_class');
		$data['user_right']=json_decode($this->get_user_right($user_id),TRUE);
		$data['rights']=$this->admin_model->rights;
		
		return  $this->echo_infor($this->load->view('admin/user_right',$data,TRUE),'1'); 
	}
	
	public function submit() {
		if(!$this->input->post('right_submit') || !$this->input->post('user_id'))
		return $this->echo_infor('操作非法！');
		
		$user_id=$this->input->post('user_id');
		$cms_class=$this->input->post('cms_class');

		if(!$this->chk_right($user_id))  return $this->echo_infor('对不起，您的权限不够！');
		
		foreach ($this->admin_model->rights as $index => $value) {
			$data[$index]=array();
			foreach ($value['functions'] as $index_i => $value_i) {
				$data[$index][$index_i]=$this->input->post($index.'_'.$index_i);
			}
		}
		
		$data=json_encode($data);
		
		$this->db->where('user_id',$user_id);
		$result=$this->db->update('user_member',array('user_right' => $data,'cms_class' => $cms_class));
		
		if($result) return $this->echo_infor('成功设置权限！','1');
		else return $this->echo_infor('权限设置失败，请重试');
	}
	
	private function get_user_right($user_id) {
		$data=array('user_id' => $user_id);
		return $this->mysql->item('user_member','user_right',$data);
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
