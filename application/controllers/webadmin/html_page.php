<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Html_page extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');		
		$this->load->model('cms_model');
		$this->load->model('str_func');
		$this->load->model('html_model');
		
		$this->check->check_admin_logged();
		$method=array('','preview');
		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
	}

	public function index() {
		$data['mylist']=array('view','address','copy_id','show','edit','locked','no_locked','hide','no_hide','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		
		$data['viewer'] = 'index';
		$data['data_viewer']=$this->pages('for_index');
		$data['workplace_view']=$this->load->view('admin/html_page',$data,TRUE);
        $data['workplace_view'].=$data['mymenu'];
        
		$data['js']=array(
		   site_url('myjavascript/admin').'/?version='.$this->config->item('js_version')		   
		);
		$data['jsmin']=$this->minify->js_mini(array(
		  'js/jquery.contextmenu.r2.js',
		  'js/jquery.jsort.js',
		  'js/pagination/jquery.pagination.js',
		  'js/admin/myjquery-htmlpage.js'
		  ));
		          
		$this->load->view('admin/index',$data);
	}

	public function edit(){
		if($this->input->post('cn_title')) {
			 
		    foreach($_POST as $index => $value) 
		    $_POST[$index]=$this->str_func->multi_replace($this->str_func->special_chars,$this->str_func->utf8_unescape($value));
			
			$data=array('group_id','cn_title','en_title','html_content','html_id','full_page');
		    $data=elements($data, common::deep_trim($_POST));
		    extract($data);
		    
			if($this->html_model->title_exist($en_title,$html_id,'en_title')) 
			return	$this->echo_infor('英文ID有重复！');

		    //删除fck添加的一些标记
		    $html_content=$this->cms_model->del_fcklink_attr($html_content); 
		    
		    //获取远程图片
		    $html_content=$this->cms_model->get_remote_images($this->myconfig->item('get_remote'),$html_content,$this->myconfig->item('add_watermark'));		
		    
		    //去掉外链
		    $html_content=$this->cms_model->delete_outer_links($this->myconfig->item('del_link'), $html_content);
		    
		    //转换编码为UTF-8
		    $html_content=preg_replace('/<meta.+charset.+>/','<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />',$html_content);
		    
		    if($full_page=='0') {
		    	$html_content=preg_replace("/<(\!.*?)>/si","",$html_content);      //去掉DOCTYPE
		    	$html_content=preg_replace("/<\!--.*?-->/si","",$html_content);    //去掉注释
		    	$html_content=preg_replace("/<(\/?html.*?)>/si","",$html_content); //过滤html标签
		    	$html_content=preg_replace("/<(\/?body.*?)>/si","",$html_content); //过滤body标签
		    	$html_content=preg_replace('/<head>.+head>/','',$html_content);    //去掉头部
		    } 
		    
			if(strlen($html_content)>65535) return $this->echo_infor('您的内容实在太长了，请删除部分字符或者分多个页面发布！');

		    $user_id=$this->session->userdata('user_id');
		    $post_time=time(); 
		    
		    $array=array(
			  'group_id' => $group_id,
		      'cn_title' => $cn_title,
		      'en_title' => $en_title,
		      'html_content' => $html_content
		    );
		    
			$result='';

		    if($html_id) {		    	
				$this->check->check_admin_right(__CLASS__,'edit');
				if(!$this->html_model->locked2you($html_id)) return $this->echo_infor('对不起，内容被锁定！');

				$array['last_editor'] = $user_id;
				$array['last_modify'] = $post_time;	
				
				$this->db->where('html_id',$html_id);
		    	$result=$this->db->update('add_html',$array);
		    }
		    else {
		    	$this->check->check_admin_right(__CLASS__,'add');
				
				$array['user_id']= $user_id;
		    	$array['post_time'] = $post_time;
		    	$array['full_page']= $full_page;

		    	$result=$this->db->insert('add_html',$array);
		    }
		    if(!$result) return $this->echo_infor('编辑失败，请重试');
		    else return $this->echo_infor('编辑成功','1');		    	
		}
		else {
	       if($html_id=$this->input->post('html_id'))  
			   $data=$this->mysql->row('add_html',array('html_id' => $html_id)); 
	       
		   $data['viewer'] ='edit';			   
		   echo $this->load->view('admin/html_page',$data,TRUE); 
		}
	}
    
	function js_check_title($check_obj='en_title') {
		
		$html_id=$this->input->post('html_id'); 

		$$check_obj=$this->input->post('title'); 
		$this->db->where($check_obj,$$check_obj);	
		$query=$this->db->get('add_html');
		
		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['html_id']==$html_id) return true;
			else echo 'error';
			return false;
		}
		else return true;
	} 

	public function pages($mode='for_ajax'){
	    $data=array('viewer' => 'pages');
	    
	    $this->db->order_by('group_id asc, html_id asc');
	    $query=$this->db->get('add_html');
	    if($query->num_rows()) $data['pages']=$query->result_array();
	    else $data['pages']='';
	    
		$data_viewer=$this->load->view('admin/html_page',$data,TRUE);
		if($mode=='for_index') return $data_viewer;
		else echo $data_viewer;
	}
	
	public function item_onoff() {
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');
		
		$ids=explode(',',$this->input->post('id'));
		$attr=$this->input->post('attr');
		$attr_value=$this->input->post('value');
		
		$this->check->check_admin_right(__CLASS__,$attr);

		$str_show=$attr_value?$attr:'no_'.$attr;
		$str_show=lang_value('attr_'.$str_show);
		
		$this->db->where_in('html_id',$ids);
		$result=$this->db->update('add_html',array($attr => $attr_value));
		
		if($result)  {
			if(!$this->db->affected_rows()) return $this->echo_infor('无需'.$str_show);
			else return $this->echo_infor('成功'.$str_show,'1','',$this->input->post('id'));
		}
		else return $this->echo_infor('操作失败，请重来！');
	}

	public function delete_html() {

	    $this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
  		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) {
			
			if(!$this->html_model->locked2you($value)) return $this->echo_infor('对不起，内容被锁定！');
			
			$row=$this->mysql->row('add_html',array('html_id' => $value));
			if(!$row) return $this->echo_infor('对不起，内容不存在！');

			$result[]=$this->db->delete('add_html',array('html_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除该内容！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
	}

	public function preview($html_id) {
	    $this->db->where('html_id',$html_id);
	    $query=$this->db->get('add_html');
	    if($query->num_rows()) { 
	    	$rows=$query->result_array();
	    	$this->load->view('admin/common',array('body' => $rows[0]['html_content']));
	    }
	    else show_404();
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
