<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Comment extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->helper('array');
		$this->load->model('str_func');
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
		
		session_start();
	}

	function comment_form() {
		$data=array(
		 'viewer'      => 'form',
		 'object_id'   => $this->input->post('object_id'),
		 'object_type' => $this->input->post('object_type'),
		 'parent_id'   => $this->input->post('parent_id') 
		);
		
		echo $this->my_load->view('comment',$data,TRUE);
	}
	
	function comment_list() {
		$data=array(
		 'object_id'   => $this->input->post('object_id'),
		 'object_type' => $this->input->post('object_type')
		);
		
		$cons=array('post_time <' => time()-(int)$this->myconfig->item('comment_hide_time'));
		$this->db->where($cons);
		$this->db->where($data);
		$this->db->where('hide','0');		

		$this->db->order_by('post_time asc');
		$query=$this->db->get('user_comment');
		$data['comments']=$query->result_array();
		
		$data['viewer']='list';
		echo $this->my_load->view('comment',$data,TRUE);
	}
	
	function comment_sub(){
		if(!$this->input->post('sub_comment')) return $this->echo_infor('无效的操作！');
		if(!$this->check->chk_captcha($this->input->post('comment_captcha'))) return $this->echo_infor('错误的验证码输入！');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);
		
		$data=array('comment_content','object_id','object_type','parent_id');

		$data=elements($data, common::deep_trim($_POST));
		
		$data['post_time']=time();
		$data['post_ip']=$this->input->ip_address();
		if($this->session->userdata('user_id')) {
			$data['user_id']=$this->session->userdata('user_id');
			$data['nick_name']=$this->session->userdata('nick_name');
		}
		
		$result=$this->db->insert('user_comment',$data);
		$comment_id=$this->db->insert_id();
		
		if((int)$data['parent_id']!=0) {
			$this->db->where('comment_id',$data['parent_id']);
			$this->db->update('user_comment',array('replied'=> '1'));
		} 
		
		if(!$result) return $this->echo_infor('评论失败，请重试！');
		return $this->echo_infor('您的评论已经提交,正在等待审核...','1','',$comment_id);
	}
	
	private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'    => $infor,
		 'result'   => $result, 
		 'url'      => !$url?($result=='0'?'':'reload'):$url,
		 'user_id'  => $id
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
