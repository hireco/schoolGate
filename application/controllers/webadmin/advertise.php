<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Advertise extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->helper('text');
		$this->load->model('str_func');
		$this->load->model('ads_model');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index() {
		$data['viewer']='index';
		$data['clist']=$this->clist();
		$data['workplace_view']=$this->load->view('admin/advertise',$data,TRUE);
		$data['mylist']=array('edit','delete','crop');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/admin/myjquery-advertise.js'
		));
         
	    $data['cssmin']=$this->minify->css_mini(array('skin/admin/css/upload_crop.css','js/swfupload/swfupload.css'));	
		$this->load->view('admin/index',$data);
	}

	public function clist($action='index') {
		$this->db->order_by('ads_id desc');
		$query=$this->db->get('add_ads');
		$advertise_list=$query->result_array();

		$data=$this->load->view('admin/advertise',
		array(
		  'viewer'  =>  'clist',
		  'advertise_list' => $advertise_list
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}

	public function submit(){
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ads_title'))
		return $this->echo_infor('非法操作');

		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array('ads_title','ads_hint','ads_width','ads_height','ads_type');
		$data=elements($data, $_POST);
        
		switch($data['ads_type']) {
			case "html":
				$data['ads_content']=$_POST['ads_html'];
				break;
			case "image":
			    $image_array=array(
			      'ads_image'  => $_POST['to_upload']=='1'?$_POST['ads_image']:$_POST['ads_image_url'],
			      'image_link' => $_POST['image_link']
			    );
			    $data['ads_content']=json_encode($image_array);	
				break;
			case "flash":
				$data['ads_content']=$_POST['to_upload']=='1'?$_POST['ads_flash']:$_POST['ads_flash_url'];
				break;
			case "script":
				$data['ads_content']=$_POST['ads_script'];
				break;
			default:
				$mysql_array=array(
				  'table'     => $_POST['mysql_table'],
				  'order_by'  => $_POST['mysql_order_by'],
				  'where'     => $_POST['mysql_where'],
				  'num'       => $_POST['mysql_num'],
				  'direction' => $_POST['mysql_direction'],
				  'mode'      => $_POST['mysql_mode']
				);
				if($_POST['mysql_mode']=='image'){
					$mysql_array['width']=$_POST['mysql_width'];
					$mysql_array['height']=$_POST['mysql_height'];
				}
				$data['ads_content']=json_encode($mysql_array);		
		}
		
		$ads_id=$this->input->post('ads_id');
		
		if($ads_id) {
			$this->db->where('ads_id',$ads_id);
			$result=$this->db->update('add_ads',$data);			
		}
		else {
			$result=$this->db->insert('add_ads',$data);
			$ads_id=$this->db->insert_id();
		}

		if($result) return $this->echo_infor('成功发布 广告项目','1','',$ads_id);
		else return $this->echo_infor('广告项目发布失败，请重试');
	}

	public function delete_advertise() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) 
			$result[]=$this->db->delete('add_ads',array('ads_id' => $value));
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除广告项目！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
	}
	
	public function ads_content($ads_id='') {
		
		if(!$ads_id) return FALSE;
		
		$this->db->where('ads_id',$ads_id);
		$this->db->select('ads_content');
		$query=$this->db->get('add_ads');
		if($query->num_rows()) {
		   $rows=$query->result_array();
		   echo $rows[0]['ads_content'];	
		}
		else return FALSE;
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