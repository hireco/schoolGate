<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	function __construct(){
    	parent::__construct();    	
    	
    	$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
    }
    
	public function index(){   
		redirect(site_url('admin'));
	}
	
	public function latests(){
		$latests=$entry_list=$this->myquery->cms_list(5,'','index_id desc'); 
		if(!count($latests))  echo '';
		else {
			echo '<ul id="latest_list">';
			foreach($latests as $index => $value) 
				echo '<li>'.($index+1).'. <a title="'.$value['cms_title'].'" target="_blank" href="'.site_url('cms/view/'.$value['index_id']).'">'.$value['cms_title'].'<span class="post_time">['.date('m-d',$value['post_time']).']</span></a></li>';
			echo '</ul>'; 
		}
	}
	
	public function version() {
		echo $this->config->item('app_version');
	}
	
	public function sponsor() {
		echo '暂无赞助链接';
		return false;
	}
	
	public function statistics() {
		$this->db->from('cms_index');
		$cms_num = $this->db->count_all_results();
		
		$this->db->from('cms_class');
		$class_num = $this->db->count_all_results();
		
		$this->db->from('add_people');
		$people_num = $this->db->count_all_results();
		
		$this->db->from('user_member');
		$user_num = $this->db->count_all_results();
		
		foreach($this->config->item('cms_model') as $index => $value) {
			$this->db->from('cms_index');
			$this->db->where('model_id',$index);
			$model_num[$index]=$this->db->count_all_results();
		}
		
		$this->db->from('add_html');
		$html_num = $this->db->count_all_results();
		
		$this->db->from('add_publication');
		$publication_num = $this->db->count_all_results();
		
		$this->db->from('add_guestbook');
		$guestbook_num = $this->db->count_all_results();
		
		$this->db->from('user_comment');
		$comment_num = $this->db->count_all_results();
		
		$this->db->from('sys_notice');
		$notice_num = $this->db->count_all_results();
		
		$this->db->from('cms_trash');
		$trash_num = $this->db->count_all_results();
		
		echo '<ul>';
		echo '<li><span>人员：</span><span class="num">'.$people_num.'</span><span>用户：</span><span class="num">'.$user_num.'</span></li>';
		echo '<li><span>单页：</span><span class="num">'.$html_num.'</span><span>栏目：</span><span class="num">'.$class_num.'</span><span>内容：</span><span class="num">'.$cms_num.'</span><span>回收：</span><span class="num">'.$trash_num.'</span></li>';
		echo '<li>'; 
		foreach($this->config->item('cms_model') as $index => $value) 
		  echo '<span>'.$value['name'].'：</span><span class="num">'.$model_num[$index].'</span>';
		echo '</li>';
		echo '<li><span>论文：</span><span class="num">'.$publication_num.'</span><span>通知：</span><span class="num">'.$notice_num.'</span><span>留言：</span><span class="num">'.$guestbook_num.'</span><span>评论：</span><span class="num">'.$comment_num.'</span></li>';
		echo '</ul>';
	}
	
	public function password() {
		if($this->input->post('pass_submit')) {
			$user_pass_old=md5(trim($this->input->post('old_pass')));
			$user_pass_new=trim($this->input->post('new_pass'));
			$this->db->where(array('user_name' => $this->session->userdata('user_name'),'user_pass' => $user_pass_old));
		    $query=$this->db->get('user_member');
		    if($query->num_rows()) {
                if($query->row()->try_user) return $this->echo_infor('体验用户不能修改密码！');

		    	$this->db->where(array('user_name' => $this->session->userdata('user_name')));
		    	$result=$this->db->update('user_member',array('user_pass' => md5($user_pass_new)));
		    	if($result) return $this->echo_infor('恭喜！成功修改您的密码！','1');
		    	else return $this->echo_infor('对不起，修改失败，请重来！');
		    } 
		    else return $this->echo_infor('错误的旧密码！');
		}
		
		else echo $this->load->view('admin/home',array('viewer' => 'password'),TRUE);
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
