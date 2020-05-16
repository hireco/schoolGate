<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cms_class extends CI_Controller {
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('cms_model');
		$this->load->model('str_func');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit','address','copy_id','delete','goup','godown','move_to');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/cms_class_list',
		array(
		  'clist'  => $this->clist('index'),
		  'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/pagination/jquery.pagination.js',
		'js/admin/myjquery-cmsclass.js'
		));
		
		$data['cssmin']=$this->minify->css_mini('skin/admin/css/upload_crop.css');
		
		$this->load->view('admin/index',$data);
	}

	public function clist($action='ajax') {
	    $this->load->helper('text');
		$this->db->order_by('class_priority asc, class_id asc');
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$rows=$query->result_array();
			$data=$this->load->view('admin/cms_class_list',array('classes' => $rows,'action'=>'clist'),TRUE);
		}
		else $data=$this->load->view('admin/cms_class_list',array('classes' => '尚未建立分类','action' => 'clist'),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
    

	public function class_cascade() {
	    
		$data=array(
		   'cascade' => $this->get_cascade(0),
		   'action'	 => 'cascade'
		);

		echo $this->load->view('admin/cms_class_list',$data,TRUE);
	}

	public function get_cascade($class_id=0) {

		$class_name=$this->cms_model->get_attr($class_id,'class_name');

		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority','asc');
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$cur_string ='<li id="class_'.$class_id.'">';
			
			$cur_string.='<span id="span_'.$class_id.'" class="class_item closed has_sub">'.$class_name.'(ID:'.$class_id.')</span>';
			$cur_string.='<span class="cont_list">内容列表</span>';
			   
			$cur_string.='<ul id="class_'.$class_id.'_sub" class="hide">';

			foreach($query->result_array() as $row) { 				
				$cur_string.=$this->get_cascade($row['class_id']);
			}

			$cur_string.='</ul></li>';
		}
		else {
			$cur_string ='<li id="class_'.$class_id.'" >';
			$cur_string.='<span id="span_'.$class_id.'" class="class_item has_no_sub">'.$class_name.'(ID:'.$class_id.')</span>';
			$cur_string.='<span class="cont_list">内容列表</span>';
			$cur_string.='</li>';
		}
		return $cur_string; 
	}

	public function get_cms_list($class_id=0) {
	    
		$this->load->helper('text');
		
		$cms_list=$this->cms_model->cms_cascade_list($class_id);
		
		$data='';
		foreach($cms_list as $index => $value) { 
		   $data.='<p><label>
		   <a target="blank" href="'.site_url('cms/view/'.$value['index_id']).'">'.my_limiter($value['cms_title'],20).'</a>
		   </label>
		   </p>';
		}
		echo $data;	
	}

	public function show_children(){
	    $class_id=$this->input->post('class_id');
	    $select_id=$this->input->post('select_id');
	    $hide_id=$this->input->post('hide_id');

		echo $this->cms_model->children_list($class_id,$select_id,$hide_id);
	}
	
	public function move_class() {
	    
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		$data=array('move_type','class_id','to_id');
		$data=elements($data, $_POST);
		extract($data);
	    $result=$this->cms_model->move_class($class_id,$to_id,$move_type);
	    if(!$result) return $this->echo_infor('移动失败，请重试');
	    else return $this->echo_infor('成功移动分类','1');
	}
	
	public function add($submit=0) {
		if($submit==0)	
			return $this->load->view('admin/cms_class_form',array('add_or_edit' => 'add'));
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);	
			
		if(!$this->input->post('class_submit'))  
			return $this->echo_infor('操作非法');	 
        
		foreach($_POST as $index => $value) 
		$_POST[$index]=$this->str_func->utf8_unescape($value);
		    
		$data=array('class_name','class_name_en','model_id','parent_id','class_keywords','class_description','banner_image','icon_image','class_hide','refer_class','index_page','view_right','list_mode');
		$data=elements($data, $_POST,'');		
		$data=common::deep_trim($data);

		$this->db->where(array('class_name' => $data['class_name'],'parent_id' => $data['parent_id']));
		$query=$this->db->get('cms_class');

		if(!$this->check_class_name($data['class_name'],$data['parent_id'])) 
			return $this->echo_infor('该频道已存在于所选父级栏目下，请重新填写！');
				
		$this->db->insert('cms_class',$data);
		$new_id=$this->db->insert_id();
		$this->db->where('class_id',$new_id);
		$this->db->update('cms_class',array('class_priority' => $new_id));
		//插入分类
		
		$to_level=$data['parent_id']==0?1:1+$this->cms_model->get_attr($data['parent_id'],'class_level');
		$this->cms_model->change_level($new_id,$to_level);
        //设置分类级别数
		
		if(!$this->db->affected_rows()) return $this->echo_infor('添加失败，请重来！');					
		else return $this->echo_infor('恭喜，添加成功！','1');
	}

	public function edit($id=0,$submit=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('class_id' => $id));
			$query=$this->db->get('cms_class');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，频道不存在！');

			$data=$query->result_array();
			$data[0]['add_or_edit']='edit';
			
			return $this->load->view('admin/cms_class_form',$data[0]); 	
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('class_submit')) 
				return $this->echo_infor('操作非法！');
			
			foreach($_POST as $index => $value) 
		    $_POST[$index]=$this->str_func->utf8_unescape($value);
		    
		   $data=array('class_name','class_name_en','model_id','parent_id','class_keywords','class_description','banner_image','icon_image','class_hide','refer_class','index_page','view_right','list_mode');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);

			if(!$this->check_class_name($data['class_name'],$data['parent_id'],$id)) 
			return $this->echo_infor('该频道已存在于所选父级栏目下，请重新填写！');
		    
		    $this->db->where('class_id',$id);
			$result=$this->db->update('cms_class',$data);
			//更新分类
			
			$to_level=$data['parent_id']==0?1:1+$this->cms_model->get_attr($data['parent_id'],'class_level');
			$this->cms_model->change_level($id,$to_level);
			//更新分类级别数
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	public function delete_class($id=0) {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$id) 
		return $this->echo_infor('操作非法！');
		
		$this->db->where(array('class_id' => $id));
		$query=$this->db->get('cms_class');
		
		if(!$query->num_rows()) 
			return $this->echo_infor('对不起，内容分类不存在！');
		
		if($this->cms_model->has_sub_class($id))
		    return $this->echo_infor('该分类含有下级，不可删除！');
			
		$result=$this->db->delete('cms_class',array('class_id' => $id));
		
		$this->cms_model->delete_class_content($id);
		
		if($result)  return $this->echo_infor('成功删除该内容分类！','1','',$id); 
		else return $this->echo_infor('删除失败，请重来！');
			 
	}

	public function updown($id=0,$action='up') {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$id) return $this->echo_infor('操作非法！');
		
		$this->db->where(array('class_id' => $id));
		$query=$this->db->get('cms_class');
			
		if(!$query->num_rows()) 
			return $this->echo_infor('对不起，频道不存在！');
			
		$data=$query->result_array();
		$priority=$data[0]['class_priority'];
		$parent_id=$data[0]['parent_id'];
		
		if($action!='up' && $action!='down')
			return $this->echo_infor('操作非法！');
				
		if($action=='up') {
			$this->db->where('class_priority < '.$priority);
			$this->db->order_by('class_priority desc');
			
		}
		else if($action=='down'){
			$this->db->where('class_priority > '.$priority);
			$this->db->order_by('class_priority asc');
		}

		$this->db->where('parent_id', $parent_id);
		$this->db->limit(1);
		$query2=$this->db->get('cms_class');
			
		if(!$query2->num_rows())  
			return $this->echo_infor('频道已在该位置');
				
		$data2=$query2->result_array();
		$id2=$data2[0]['class_id'];
		$priority2=$data2[0]['class_priority'];

		$this->db->where(array('class_id' => $id));
		$this->db->update('cms_class',array('class_priority' => $priority2));

		$this->db->where(array('class_id' => $id2));
		$this->db->update('cms_class',array('class_priority' => $priority));

		if($this->db->affected_rows()) return $this->echo_infor('null','1');
		else return $this->echo_infor('操作失败，请重来！');
	}

    function model_check($class_id,$model_id) {
    	
		$this->db->where('class_id',$class_id);
    	$this->db->select('model_id');
    	$query=$this->db->get('cms_class');
    	if($query->num_rows()) {
    		$rows=$query->result_array();
    		$model_list=explode(',', $rows[0]['model_id']);
    		if(in_array($model_id, $model_list))  echo '1';
    		else echo '0';
    	}
    	else echo '0';
    }
	
    function check_class_name($class_name,$parent_id,$execpt_id='') {
    	$this->db->where(array('class_name' => $class_name,'parent_id' => $parent_id));
		if($execpt_id) $this->db->where('class_id !=', $execpt_id);
		$query=$this->db->get('cms_class');
		if(!$query->num_rows())  return true;
		else return false;
    }
    
	function js_check_class_name($check_obj) {

		$class_id=$this->input->post('class_id');
		$parent_id=$this->input->post('parent_id');

		$$check_obj=$this->input->post('class_name'); 
		$this->db->where($check_obj,$$check_obj); 

		//同属某类的下级类的中文名不能重复，而英文名则必须要求在所有类中是唯一的
		if($check_obj=='class_name') $this->db->where('parent_id',$parent_id); 
		
		$query=$this->db->get('cms_class');
		
		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['class_id']==$class_id)  return true;
			else echo 'error';
			return false;
		}
		else return true;
	}

    function cms_num($class_id='') {
    	
    	$cms_list=$this->cms_model->cms_cascade_list($class_id);
		
		echo count($cms_list);
    }
    
	function class_view_right() { //cms_add调用以取得默认的view_right之值

		$user_level=$this->config->item('user_level');
		
		$class_id=$this->input->post('class_id');
		$view_right_value=$this->cms_model->get_attr($class_id,'view_right');
		$view_right_title=array_key_exists($view_right_value,$user_level)?$user_level[$view_right_value]:'';

		echo  $view_right_value.':'.$view_right_title;
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
