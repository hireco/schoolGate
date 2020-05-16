<?php
class html_model extends CI_Model
{   
	var $groups=array();
	
	var $cn_groups=array();
	
	var $group_ids=array();

    function __construct() {
		parent::__construct();
		$this->load->model('functions');

		$cms_class=$this->myquery->cms_class_list(0,0);	
		foreach($cms_class as $index => $value) {
		    $this->groups[$value['class_id']] =$value['class_name_en'];
			$this->cn_groups[$value['class_id']] =$value['class_name'];
		}												  	
		
		$this->group_ids = array_flip($this->groups);
	}

	function title_exist($title, $id, $obj) {
		 
		$this->db->where($obj,$title);	
		$query=$this->db->get('add_html');

		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['html_id']==$id) return false;
			else return true;
		}
		else return false;
	}

	function html_list($group_id=0,$page_id=1) {
	    
	   if($group_id && !isset($this->groups[$group_id])) $this->functions->show_msg('分类不存在！');
	   
	   $data['group_id']=$group_id;
	   $data['group']=$group_id?$this->html_model->groups[$group_id]:'all';
	   $data['cn_group']=$group_id?$this->html_model->cn_groups[$group_id]:'所有页面';
		
	   $data['page_id']=$page_id<1?1:(int)$page_id;
	   $data['per_page_num']=$this->myconfig->item('cms_per_page_num');
		
	   if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
	   if($group_id) $this->db->where('group_id',$group_id);
	   $this->db->from('add_html');
	   $data['rows']=$this->db->count_all_results();

	   if($data['rows']) {
			$data['pages']=(int)($data['rows']/$data['per_page_num']);
			$data['pages']=($data['rows']%$data['per_page_num'])?($data['pages']+1):$data['pages'];
			//获取记录总数
			if($data['pages'] < $data['page_id']) $this->functions->show_msg('页面不存在！');
		}
	    else {
			$data['pages']=0;
			$data['page_id']=0;
		}
		
		$data['title']=$data['cn_group'];
		
		$data['body']='html/html_list';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	    
	}

	function html_view($html_id) {
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('html_id',$html_id);
	    $query=$this->db->get('add_html');
	    if($query->num_rows()) { 
	    	$row=$query->row_array();
	    	if($row['full_page']=='1') echo $row['html_content'];
	    	else {
	    	    $data=$row;
	    		$data['group']=$this->html_model->groups[$data['group_id']];
		        $data['cn_group']=$this->html_model->cn_groups[$data['group_id']];
		       
				$data['title']=$row['cn_title'];
	    		
	    		$data['body']='html/html_view';
	    		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
	    		$this->load->view('index',$data);
	    	}
	    }
	    else $this->functions->show_msg('该页面不存在，可通过静态页面来设置！');
	}

/**
* @param $html_id,待检测的内容id
* @return  TRUE表示没有锁定，否则表示该内容对该用户是锁定的。
*/
	function locked2you($html_id) {

	    $data=$this->mysql->row('add_html',array('html_id' => $html_id));
		if(!$data)  return FALSE;

		if($data['locked']=='1' && !$this->check->check_if_super_admin()) {
		   //if($data['user_id']!=$this->session->userdata('user_id'))
		        return FALSE;
		}

		return TRUE;

	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */