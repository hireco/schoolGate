<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Img_scroll extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('cms_model');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['viewer']='index';
		$data['clist']=$this->clist();
		$data['workplace_view']=$this->load->view('admin/img_scroll',$data,TRUE);
		$data['mylist']=array('edit','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];		
		
		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/admin/myjquery-imgscroll.js'
		));
				
		$data['cssmin']=$this->minify->css_mini('skin/admin/css/upload_crop.css');
		
		$this->load->view('admin/index',$data);
	}
     
    public function clist($action='index') {
    	$this->db->order_by('scroll_id asc');
    	$query=$this->db->get('add_scroll');
    	
    	if($query->num_rows()) {
    		$data=$query->result_array();
    	}
    	else $data='';
    	
    	$data=$this->load->view('admin/img_scroll',array('scrolls' => $data,'viewer' => 'clist'),TRUE);
        
    	if($action=='ajax') echo $data;
		else return $data;
    }
	
    public function submit(){
    	
    	if(!$this->input->post('scroll_submit')) return $this->echo_infor('非法操作');
		
		foreach($_POST as $index => $value)
		$_POST[$index]=$this->str_func->utf8_unescape($value);

		$data=array(
		  'photo_list'        => $this->cms_model->get_photos_files($this->input->post('photo_list')),
		  'photo_caption'     => $this->input->post('img_text'),
		  'photo_description' => $this->input->post('img_str'),
		  'photo_link'        => $this->input->post('img_link'),
		  'scroll_title'      => $this->input->post('scroll_title'),
		  'photo_width'       => $this->input->post('photo_width'),
		  'photo_height'      => $this->input->post('photo_height'),
		  'thumb_width'       => $this->input->post('thumb_width'),
		  'thumb_height'      => $this->input->post('thumb_height'),
		);
		
		$this->db->where(array('scroll_title' => $this->input->post('scroll_title')));
		$this->db->where('scroll_id != '.$this->input->post('scroll_id'));
		$query=$this->db->get('add_scroll');
		if($query->num_rows()) return $this->echo_infor('滚动图片组重名，请重新命名！');
		
		if($scroll_id=$this->input->post('scroll_id')) {
			
			$this->check->check_admin_right(__CLASS__,'edit');
			
			$this->db->where(array('scroll_id' => $scroll_id));
			$result=$this->db->update('add_scroll',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,'add');

			$result=$this->db->insert('add_scroll',$data);
			$scroll_id=$this->db->insert_id();
		}
		if($result) return $this->echo_infor('成功发布滚动图片组','1','',$scroll_id);
		else return $this->echo_infor('发布滚动图片失败！请重试');
    }
    
    public function form() {
    	if($scroll_id=$this->input->post('scroll_id')) {
    		$add_or_edit='edit';
    		$this->db->where('scroll_id',$scroll_id);
    		$query=$this->db->get('add_scroll');
    		if($query->num_rows()) {
    			$rows=$query->result_array();
    			$data=$rows[0];
    		}
    	} 
    	else {
    		$add_or_edit='add';
    		$scroll_id=0;
    	}
    	
    	 $data['add_or_edit'] = $add_or_edit;
    	 $data['viewer'] = 'form';
    	 $data['scroll_id'] = $scroll_id;
    	
    	echo $this->load->view('admin/img_scroll',$data,TRUE);
    }
    
    public function delete_scroll(){
    	
    	$this->check->check_admin_right(__CLASS__,__FUNCTION__);
    	
    	if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');
		$result=$this->db->delete('add_scroll',array('scroll_id' => $id));
		
		if($result) return $this->echo_infor('成功删除滚动图片组','1','',$id);
		else $this->echo_infor('删除失败，请重来！');
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
