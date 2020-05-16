<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms_list extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('cms_model');
		$this->load->helper('text');
		
		$this->check->check_admin_logged();
		$cms_model=$this->config->item('cms_model');
		foreach($cms_model as $index => $value) 
		   $method[]=$value['table'];
		
		$method[]='';

		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
	}

	public function index($model_id=0){
		$data['viewer']='index';
		$data['clist']=$this->clist('index',$model_id);
		$data['workplace_view']=$this->load->view('admin/cms_list',$data,TRUE);

		$data['mylist']=array('edit','view','address','copy_id','recommend','no_recommend','headline','no_headline','gotop','gobottom','hide','no_hide','locked','no_locked','move_to','trash','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
		'js/admin/myjquery-cmslist.js'
		),TRUE,'cms_list');

		$this->load->view('admin/index',$data);
	}

	public function clist($action='index',$model_id_get=0) {
		
		$my_list_only=$this->input->post('my_list_only');
		$model_id_post=$this->input->post('model_id');
		
		$time_filter=$this->input->cookie('time_filter');
		if($time_filter) {
			$time_filter=explode('_',$time_filter);
			$time_filter=$time_filter[1];	
		}
		
		$model_id=$model_id_post?$model_id_post:$model_id_get;
		
		$user_id=$this->session->userdata('user_id');
		
		if(!$this->check->check_if_super_admin()) {	
		
		    $my_class=$this->cms_model->get_my_classes();		    
			if($my_class) $this->db->where_in('class_id',$my_class);
		}
		
		$this->db->order_by('headline desc, recommend desc, top desc, index_id desc');
		if($my_list_only) $this->db->where('user_id',$user_id);
		if($model_id) $this->db->where(array('model_id' => $model_id));
        if($time_filter) $this->db->where('post_time >',time()-$time_filter*24*3600); 
		
		$query=$this->db->get('cms_index');
		$cms_list=$query->result_array();

		$data=$this->load->view('admin/cms_list',
		array(
		  'viewer'  =>   'clist',
		  'cms_list' =>  $cms_list,
		  'model_id' =>  $model_id,
		  'children_list' => $this->cms_model->children_list(),
		  'my_class' =>  isset($my_class)&&$my_class?implode(',',$my_class):'' 
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
    
	public function item_timestamp() {
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');
		
		$ids=explode(',',$this->input->post('id'));
		$attr=$this->input->post('attr');
		$attr_value=$this->input->post('value');
		$attr_value=$attr_value?time():0;
		
		$this->check->check_admin_right(__CLASS__,$attr);

		$str_show=$attr_value?$attr:'no_'.$attr;
		$str_show=lang_value('attr_'.$str_show);
		
		$this->db->where_in('index_id',$ids);
		$result=$this->db->update('cms_index',array($attr => $attr_value));
		
		if($result)  {
			if(!$this->db->affected_rows()) return $this->echo_infor('无需'.$str_show);
			else return $this->echo_infor('成功'.$str_show,'1','',$this->input->post('id'));
		}
		else return $this->echo_infor('操作失败，请重来！');
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
		
		$this->db->where_in('index_id',$ids);
		$result=$this->db->update('cms_index',array($attr => $attr_value));
		
		if($result)  {
			if(!$this->db->affected_rows()) return $this->echo_infor('无需'.$str_show);
			else return $this->echo_infor('成功'.$str_show,'1','',$this->input->post('id'));
		}
		else return $this->echo_infor('操作失败，请重来！');
	}

	public function move_cms() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id') || !$this->input->post('class_id'))
		return $this->echo_infor('操作非法！');
        
		if(!$this->cms_model->check_if_my_classes($this->input->post('class_id'))) return $this->echo_infor('对不起，您无权操作该栏目');

		$ids=explode(',',$this->input->post('id'));
		$class_id=$this->input->post('class_id');
		
		if($this->config->item('child_type')!='both' && $this->cms_model->has_sub_class($class_id)) 
		return $this->echo_infor('此类下只允许存在子类！');
		
		$this->db->where_in('index_id',$ids);
		$this->db->where('class_id !='.$class_id);	
		$result=$this->db->update('cms_index',array('class_id' => $class_id));
		
		if($result)  {
			if(!$this->db->affected_rows()) return $this->echo_infor('内容无需移动！');
			else return $this->echo_infor('成功移动内容！','1','',$this->input->post('id'));
		}
		else return $this->echo_infor('移动失败，请重来！');
	}	
	
	function trash_cms() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) {
			
			if(!$this->cms_model->locked2you($value)) return $this->echo_infor('对不起，内容被锁定！');
			
			$this->db->limit(1);
			$this->db->where(array('index_id' => $value));
			$query=$this->db->get('cms_index');

			if(!$query->num_rows())
			return $this->echo_infor('对不起，内容不存在！');
				
			$data=$query->row_array();

			if(!$this->cms_model->check_if_my_classes($data['class_id'])) 
			return $this->echo_infor('对不起，您无权操作该栏目');
            
			$data['trash_time']=time();
			$data['trasher']= $this->session->userdata('user_id');
			
			$result[]=$this->db->insert('cms_trash',$data);
			$result[]=$this->db->delete('cms_index',array('index_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功回收该内容到垃圾站！','1','',$this->input->post('id'));
			else return $this->echo_infor('回收失败，请重来！');
	}
	
	
	public function delete_cms() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$ids=explode(',',$this->input->post('id'));
		
		$result=array();		
		foreach ($ids as $index => $value) {
			
			if(!$this->cms_model->locked2you($value)) return $this->echo_infor('对不起，内容被锁定！');
			
			$this->db->limit(1);
			$this->db->where(array('index_id' => $value));
			$query=$this->db->get('cms_index');

			if(!$query->num_rows())
			return $this->echo_infor('对不起，内容不存在！');
				
			$data=$query->row_array();

			if(!$this->cms_model->check_if_my_classes($data['class_id'])) 
			return $this->echo_infor('对不起，您无权操作该栏目');

			$result[]=$this->db->delete('cms_'.$this->myconfig->cms_model($data['model_id'],'table'),array('index_id' => $value));
			$result[]=$this->db->delete('cms_index',array('index_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除该内容！','1','',$this->input->post('id'));
			else return $this->echo_infor('删除失败，请重来！');
	}

	public function article() {
		$model_table=__FUNCTION__;
		$model_id=$this->myconfig->cms_model_id($model_table);
		$this->index($model_id);
	}

	public function photo() {
		$model_table=__FUNCTION__;
		$model_id=$this->myconfig->cms_model_id($model_table);
		$this->index($model_id);
	}

	public function video() {
		$model_table=__FUNCTION__;
		$model_id=$this->myconfig->cms_model_id($model_table);
		$this->index($model_id);
	}
	
	public function download() {
		$model_table=__FUNCTION__;
		$model_id=$this->myconfig->cms_model_id($model_table);
		$this->index($model_id);
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
