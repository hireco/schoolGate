<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Navi_admin extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->helper('text');
		$this->load->model('str_func');
		$this->load->model('cms_model'); 
		$this->load->model('navi_model');
		$this->load->model('people_model');
		$this->load->model('publication_model');

		
		$this->check->check_admin_logged();
		//if($this->uri->segment(3) && !IS_AJAX) show_404();
	}
	
	public function index(){
		$data['list_data']=$this->tlist('index'); 
		$data['action']='index';
		$data['workplace_view']=$this->load->view('admin/navi_admin',$data,TRUE);
		
		$data['mylist']=array('view','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',	
		'js/pagination/jquery.pagination.js',	
		'js/admin/myjquery-naviadmin.js'
		),TRUE,'naviadmin');

		$this->load->view('admin/index',$data);
	}
	
	public function tlist($action='ajax') {		
		
		$this->db->order_by('navi_type_id asc');
		$query=$this->db->get('add_navigation_type');
		$data=$this->load->view('admin/navi_admin',
		array(
		  'action'  =>  'tlist',
		  'navi_types' => $query->result_array()
		),TRUE);
		
		if($action=='ajax') echo $data;
		else return $data;
	}

	public function clist($navi_type='') {
		
		if(!$navi_type)	return $this->echo_infor('对象不存在！');

		$data=$this->load->view('admin/navi_admin',
		array(
		  'action'  =>  'clist',
		  'navi_list' => $this->myquery->navi_list($navi_type,0),
		  'navi_type' => $navi_type,
		  'navi_name' => $this->get_navi_name($navi_type)
		),TRUE);

		echo $data;
	}
    
	public function updown($action='up') {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('id')) return $this->echo_infor('操作非法！');
		
		$id=$this->input->post('id');

		$ids=explode(',',$id);
		
		$result=array();

		foreach ($ids as $index => $value) {
				
				$this->db->where(array('navi_id' => $value));
				
				$query=$this->db->get('add_navigation');
					
				if(!$query->num_rows()) return $this->echo_infor('对不起，对象不存在！');
					
				$data=$query->result_array();
				$priority=$data[0]['navi_priority'];
				$parent_id=$data[0]['parent_id'];
				
				if($action!='up' && $action!='down')  return $this->echo_infor('操作非法！');
						
				if($action=='up') {
					$this->db->where('navi_priority < '.$priority);
					$this->db->order_by('navi_priority desc');
				}
				else if($action=='down'){
					$this->db->where('navi_priority > '.$priority);
					$this->db->order_by('navi_priority asc');
				}
				
				$this->db->where('parent_id', $parent_id);
				$this->db->where_not_in('navi_id', $ids);
				$this->db->limit(1);
				$query2=$this->db->get('add_navigation');
					
				if(!$query2->num_rows()) { 
					if(count($ids)==1) return $this->echo_infor('菜单位置无需移动');
					else continue;
				}
						
				$data2=$query2->result_array();
				$id2=$data2[0]['navi_id'];
				$priority2=$data2[0]['navi_priority'];

				$this->db->where(array('navi_id' => $value));
				$result[]=$this->db->update('add_navigation',array('navi_priority' => $priority2));

				$this->db->where(array('navi_id' => $id2));
				$result[]=$this->db->update('add_navigation',array('navi_priority' => $priority));
		  
		}

		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('操作成功！','1','',$id);
			else return $this->echo_infor('操作失败，请重来！');
	}
	
	public function new_navi($submit=0) {
		
		if($submit==0)	
			return $this->load->view('admin/navi_admin',array('action' => 'new'));
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);	
			
		if(!$this->input->post('new_navi_submit'))  return $this->echo_infor('操作非法');	 
        
		foreach($_POST as $index => $value) 
		$_POST[$index]=$this->str_func->utf8_unescape($value);
		    
		$data=array('navi_type','navi_name');
		$data=elements($data, $_POST,'');		
		$data=common::deep_trim($data);	

		$this->db->insert('add_navigation_type',$data);
		
		if(!$this->db->affected_rows()) return $this->echo_infor('添加失败，请重来！');					
		else return $this->echo_infor('恭喜，添加成功！','1');
		
	}

	public function add($submit=0,$navi_type='') {
		
		if(!$navi_type) return $this->echo_infor('未知对象！');

		if($submit==0)	
			return $this->load->view('admin/navi_admin',array('add_or_edit' => 'add','action' => 'edit','navi_type' => $navi_type));
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);	
			
		if(!$this->input->post('navi_submit'))  return $this->echo_infor('操作非法');	 
        
		foreach($_POST as $index => $value) 
		$_POST[$index]=$this->str_func->utf8_unescape($value);
		    
		$data=array('navi_id','navi_title','navi_title_en','navi_url','navi_target','parent_id','navi_priority');
		$data=elements($data, $_POST,'');		
		$data=common::deep_trim($data);
		$data['navi_type']=$navi_type;


		if($this->navi_model->title_exist($data['navi_title_en'],$data['navi_id'],'navi_title_en')) 
			return	$this->echo_infor('菜单的英文ID有重复！');

		$this->db->insert('add_navigation',$data);
		
		if(!$this->db->affected_rows()) return $this->echo_infor('添加失败，请重来！');					
		else return $this->echo_infor('恭喜，添加成功！','1');
		
	}
	
	public function edit($id=0,$submit=0) {
		if(!$id) return $this->echo_infor('操作非法！');

		if($submit==0){
			$this->db->where(array('navi_id' => $id));
			$query=$this->db->get('add_navigation');
			
			if(!$query->num_rows()) 
				return $this->echo_infor('对不起，导航项目不存在！');

			$data=$query->result_array();
			$data[0]['add_or_edit']='edit';
			$data[0]['action']='edit';

			return $this->load->view('admin/navi_admin',$data[0]); 	
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('navi_submit')) 
				return $this->echo_infor('操作非法！');
			
			foreach($_POST as $index => $value) 
		    $_POST[$index]=$this->str_func->utf8_unescape($value);
		    
		    $data=array('navi_title','navi_title_en','navi_url','navi_target','parent_id','navi_priority');
		    $data=elements($data, $_POST,'');		
		    $data=common::deep_trim($data);
			
			if($this->navi_model->title_exist($data['navi_title_en'],$id,'navi_title_en')) 
			return	$this->echo_infor('菜单的英文ID有重复！');

		    $this->db->where('navi_id',$id);
			$result=$this->db->update('add_navigation',$data);
			//更新菜单项目
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	public function multiple_edit() {

		$last_item_id=$this->last_item_id();

		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
		if(!$this->input->post('navi_submit')) 
			return $this->echo_infor('操作非法！');
		
		foreach($_POST as $index => $value) 
		$_POST[$index]=$this->str_func->utf8_unescape($value);
		
		$data=array('navi_id','navi_title','navi_title_en','parent_id','navi_priority','navi_url','navi_target','navi_type');
		$data=elements($data, $_POST,'');		
		$data=common::deep_trim($data);
		
		$this->clear_navi_items($data['navi_type']);

		for($i=1;$i<=$_POST['navis'];$i++) {
           
		   $navi_title       = 'navi_title_'.$i;  
		   $navi_title_en    = 'navi_title_en_'.$i;
		   $navi_url         = 'navi_url_'.$i;
           $navi_priority    = 'navi_priority_'.$i;
           $navi_target      = 'navi_target_'.$i;
           $parent_id        = 'parent_id_'.$i;  

           $data=array(
              'navi_id'          => $i+$last_item_id,
		      'navi_title'       => $_POST[$navi_title], 
			  'navi_title_en'    => $_POST[$navi_title_en],
			  'navi_url'         => $_POST[$navi_url],
              'navi_priority'    => $_POST[$navi_priority],
              'navi_target'      => $_POST[$navi_target],
              'parent_id'        => $_POST[$parent_id]?($_POST[$parent_id]+$last_item_id):0,
			  'navi_type'        => $_POST['navi_type']
            );
            
			if($this->navi_model->title_exist($data['navi_title_en'],$data['navi_id'],'navi_title_en')) 
			return	$this->echo_infor('菜单的英文ID有重复！');
			
			$result=$this->db->insert('add_navigation',$data);
		}
		
		if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
		else return $this->echo_infor('编辑失败，请重来！');
		
	}

	public function clear_navi() {
		
		$result=array();

		$navi_type=$this->input->post('navi_type');

		if(!$navi_type) return $this->echo_infor('未知对象！');

		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		$result[]=$this->db->delete('add_navigation_type',array('navi_type' => $navi_type));
		$result[]=$this->clear_navi_items($navi_type);

		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除导航！','1');
		else return $this->echo_infor('删除失败，请重来！');
	}

	public function clear_navi_items($navi_type='') {
		
		$ajax=$this->input->post('ajax');

		if(!$navi_type) return $this->echo_infor('未知对象！');

		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		$result=$this->db->delete('add_navigation',array('navi_type' => $navi_type));
		
		if($ajax=='1') {
			if($result)  return $this->echo_infor('成功删除导航！','1');
		    else   return $this->echo_infor('删除失败，请重来！');
		}
		else return $result; 
	}
    
	public function delete_navi_item() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);

		if(!$this->input->post('ajax') || !$this->input->post('id'))
		return $this->echo_infor('操作非法！');

		$id=$this->input->post('id');

		$ids=explode(',',$id);
		
		$result=array();

		foreach ($ids as $index => $value) {
			$this->db->where(array('navi_id' => $value));
			$query=$this->db->get('add_navigation');

			if(!$query->num_rows())
			return $this->echo_infor('对不起，对象不存在！');
				
			$data=$query->result_array();

			$result[]=$this->db->delete('add_navigation',array('navi_id' => $value));
		}
		
		if(array_search(FALSE, $result)===FALSE)  return $this->echo_infor('成功删除菜单！','1','',$id);
			else return $this->echo_infor('删除失败，请重来！');
	}

	function js_check_title($check_obj='navi_title_en') {
		
		$navi_id=$this->input->post('navi_id'); 

		$$check_obj=$this->input->post('title'); 
		$this->db->where($check_obj,$$check_obj);	
		$query=$this->db->get('add_navigation');
		
		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['navi_id']==$navi_id) return true;
			else  echo 'error';
			return false;
		}
		else return true;
	} 

	function js_check_type() {
		
		$navi_type=$this->input->post('navi_type'); 

		$this->db->where('navi_type',$navi_type);	
		$query=$this->db->get('add_navigation_type');
		
		if($query->num_rows()) {
			echo 'error';
			return false;
		}
		else return true;
	} 

	//The functions list as below are for the navigation setup for the cms system.
	
	public function get_cms_classes($class_id=0) {
	   echo $this->cms_model->class_check_cascade($class_id);
	}

	public function get_cms_list($class_id=0) {
	    
		$this->load->helper('text');

		$rows=$this->cms_model->cms_cascade_list($class_id);

		$data='';
		foreach($rows as $index => $value) { 
		   $data.='<p>
		   <input type="hidden" class="obj_url" value="'.site_url('cms/view/'.$value['index_id']).'"/>
		   <input type="checkbox" class="obj_id" value="'.$value['index_id'].'" />
		   <label>
		   <a target="blank" href="'.site_url('cms/view/'.$value['index_id']).'">'.my_limiter($value['cms_title'],20).'</a>
		   </label>
		   </p>';
		} 
		echo $data;
	
	}

	public function get_people_titles() {
	    
		$this->load->model('people_model');
		$titles = $this->people_model->titles;
		$cn_titles = $this->people_model->cn_titles;

		$data='';
		foreach($cn_titles as $index => $value) {
			   $data.='<p class="has_sub">
		       <input type="hidden" class="obj_url" value="'.site_url('people/list/'.$titles[$index]).'"/>
			   <input type="checkbox" class="obj_id" value="'.$index.'" />
			   <label class="people_title_linker">'.$value.'</label>
			   </p>';
		}

		echo $data;
	
	}

	public function get_people_list($title_id='') {

	    if($title_id) $this->db->where('title_id',$title_id);
		$this->db->order_by('people_id desc');
		$query=$this->db->get('add_people');

		$data='';
		if($query->num_rows()) {
			$rows=$query->result_array();
			foreach($rows as $index => $value) {
			   $data.='<p>
			   <input type="hidden" class="obj_url" value="'.site_url('people/'.$value['en_id']).'"/>
			   <input type="checkbox" class="obj_id" value="'.$value['people_id'].'" />
			   <label>
			    <a target="blank" href="'.site_url('people/'.$value['en_id']).'">'.$value['cn_name'].'</a>
			   </label>
			   </p>';
			}
		} 
		echo $data;
	
	}

	public function get_html_groups() {
	    
		$this->load->model('html_model');
		$cn_groups = $this->html_model->cn_groups;
		$groups=$this->html_model->groups;

		$data='';
		foreach($cn_groups as $index => $value) {
			   $data.='<p class="has_sub">
		       <input type="hidden" class="obj_url" value="'.site_url('html/list/'.$groups[$index]).'"/>
			   <input type="checkbox" class="obj_id" value="'.$index.'" />
			   <label class="html_class_linker">'.$value.'</label>
			   </p>';
		}

		echo $data;
	
	}

	public function get_html_list($group_id='') {
	    
		if($group_id) $this->db->where('group_id',$group_id);
		$this->db->order_by('html_id desc');
		$query=$this->db->get('add_html');

		$data='';
		if($query->num_rows()) {
			$rows=$query->result_array();
			foreach($rows as $index => $value) 	{
			   $data.='<p>
			   <input type="hidden" class="obj_url" value="'.site_url('html/'.$value['en_title']).'" />
			   <input type="checkbox" class="obj_id" value="'.$value['html_id'].'" />
			   <label class="">
			     <a target="blank" href="'.site_url('html/'.$value['en_title']).'">'.$value['cn_title'].'</a>
			   </label>
			   </p>';
			}
		} 
		echo $data;
	
	}

	public function navi_cascade($except_id=0) {
	    
		echo '<ul class="navi_admin">'.$this->navi_model->navi_cascade(0, $except_id).'<ul>';
	
	}
    
	function max_priority_num() {
	    
		$this->db->select_max('navi_priority','max');
		$query = $this->db->get('add_navigation');
		
		$row=$query->row_array();

		echo $row['max']?$row['max']:0;
	
	}
	
	function last_item_id() {
	    
		$this->db->select_max('navi_id','max');
		$query = $this->db->get('add_navigation');
		
		$row=$query->row_array();

		return $row['max']?$row['max']:0;
	
	}
	
	function get_navi_name($navi_type='') {
	    
		if(!$navi_type) return '';

		$this->db->where('navi_type',$navi_type);
		$this->db->limit(1);
		$query = $this->db->get('add_navigation_type');
		
		$row=$query->row_array();

		return $row['navi_name']?$row['navi_name']:'';
	
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
