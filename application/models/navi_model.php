<?php
class Navi_model extends CI_Model
{ 
	var $obj_types=array(
		  '0' => '普通链接',
		  '1' => '内容分类',
		  '2' => '单篇内容',
		  '3' => '人员类别',
		  '4' => '单个人员',
		  '5' => '静态组类',
		  '6' => '静态页面'
		);

	 //导航分类
    var $navi_classes=array(
      '1' => '主导航条',
	  '2' => '底部导航'
    );

    function __construct() {
		parent::__construct();
	}
	
	function has_navi() {
	    return $this->db->count_all_results('add_navigation');
	}

	function title_exist($title, $id, $obj) {
		 
		$this->db->where($obj,$title);	
		$query=$this->db->get('add_navigation');

		if($query->num_rows()) {
			$row=$query->row_array();
			if($row['navi_id']==$id) return false;
			else return true;
		}
		else return false;
	}

	function show_path($navi_id) {
		 $data=array('path' => $this->get_current_path($navi_id));
		 return  $this->my_load->view('pannel/navi_path',$data,TRUE);
	}

	function show_navi($navi_id,$ajax=FALSE) {
		$navi=$this->mysql->row('add_navigation',array('navi_id' => $navi_id));
		if(!$navi) return false;

		$this->db->order_by('navi_priority asc');

		if(!$navi['parent_id']) {
			$navi_list=$this->mysql->rows('add_navigation',array('parent_id' => $navi['navi_id']));
			$top_title=$navi['navi_title'];
		}
		else  {
			$navi_list=$this->mysql->rows('add_navigation',array('parent_id' => $navi['parent_id']));
			$top_title=$this->mysql->item('add_navigation','navi_title',array('navi_id' => $navi['parent_id']));
		}

		$data['navi_list']=$navi_list;
		$data['current_id']=$navi_id;
		$data['top_title']=$top_title;

		if($ajax)  return  $this->my_load->view('pannel/navi',$data,TRUE);
		else $this->my_load->view('pannel/navi',$data);
	}

	function  show_navi_group($navi_type='',$num=10){
		
		if(!$navi_type) return false;

		$this->db->order_by('navi_priority asc');
		$top_navi_list=$this->myquery->navi_list($navi_type,$num);
		
		if(!$top_navi_list) return false;

		foreach($top_navi_list as $index => $value) {
		    $this->db->order_by('navi_priority asc');
			$sub_navi_list[$index]=$this->myquery->navi_list($navi_type, 10,$value['navi_id']);
		}

		$data['navi_type']=$navi_type;
		$data['top_navi_list']=$top_navi_list;
		$data['sub_navi_list']=$sub_navi_list;

		$this->my_load->view('pannel/navi_group',$data);
	    
	}

	public function class_cascade($class_id=0,$hide_id='') {

		$class_attr=$this->get_class_attr($class_id);
		$class_name=$class_attr?$class_attr['class_name']:''; 
		$class_name_en=$class_attr?$class_attr['class_name_en']:'';			

		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority','asc');
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
		  $cur_string ='';

		  if($class_id) {
			  $cur_string ='<li class="with_sub allmenu" id="navi_'.$class_name_en.'"><span id="span_'.$class_id.'"><a    href="'.site_url('cms/'.$class_name_en).'">'.$class_name.'</a><label class="target hide">s</label></span>';			
			  $cur_string.=' <ul class="submenu" id="navi_'.$class_name_en.'_list">'; 
		   }

		   foreach($query->result_array() as $row)
				if($row['class_id']!=$hide_id) $cur_string.=$this->class_cascade($row['class_id'],$hide_id);

		   if($class_id) $cur_string.='</ul></li>';
		}
		else {
			$cur_string ='<li class="no_sub allmenu" id="navi_'.$class_name_en.'" ><span id="span_'.$class_id.'"><a href="'.site_url('cms/'.$class_name_en).'">'.$class_name.'</a><label class="target hide">s</label></span>';				
			$cur_string.='</li>';
		}

		return $cur_string; 
	}


	public function navi_cascade($navi_type='', $navi_id=0,$hide_id='') {

		$navi_attr=$this->get_navi_attr($navi_id);
		$navi_title=$navi_attr?$navi_attr['navi_title']:''; 
		$navi_title_en=$navi_attr?$navi_attr['navi_title_en']:'';
		$target=$navi_attr?$navi_attr['navi_target']:'';
		$navi_url=$navi_attr?$navi_attr['navi_url']:'';

		$this->db->where('parent_id',$navi_id); 
		$this->db->where('navi_type',$navi_type);
		$this->db->order_by('navi_priority','asc');
		$query=$this->db->get('add_navigation');

		if($query->num_rows()) {
		  $cur_string ='';

		  if($navi_id) {
			  $cur_string ='<li class="with_sub allmenu" id="navi_'.$navi_title_en.'"><span id="span_'.$navi_id.'"><a    href="'.$navi_url.'">'.$navi_title.'</a><label class="target hide">'.$target.'</label></span>';			
			  $cur_string.=' <ul class="submenu" id="navi_'.$navi_title_en.'_list">'; 
		   }

		   foreach($query->result_array() as $row)
				if($row['navi_id']!=$hide_id) $cur_string.=$this->navi_cascade($navi_type,$row['navi_id'],$hide_id);

		   if($navi_id) $cur_string.='</ul></li>';
		}
		else {
			$cur_string ='<li class="no_sub allmenu" id="navi_'.$navi_title_en.'" ><span id="span_'.$navi_id.'"><a href="'.$navi_url.'">'.$navi_title.'</a><label class="target hide">'.$target.'</label></span>';				
			$cur_string.='</li>';
		}

		return $cur_string; 
	}

	function get_class_attr($class_id=0) {
		$this->db->where('class_id',$class_id);
		$this->db->limit(1);
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0];
		}
		else return false;
	}


	function get_navi_attr($navi_id=0) {
		$this->db->where('navi_id',$navi_id);
		$this->db->limit(1);
		$query=$this->db->get('add_navigation');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0];
		}
		else return false;
	}

	function get_current_path($navi_id) {
		if($navi_id==0) return '';

		$cur_attrs=$this->get_navi_attr($navi_id);
		$cur_title=$cur_attrs['navi_title'];
		$cur_url=$cur_attrs['navi_url'];
		$cur_parent=$cur_attrs['parent_id'];

		$cur_path=' &gt; <a href="'.$cur_url.'">'.$cur_title.'</a>';

		if($cur_parent==0) return $cur_path;
			
		else {
			$this->db->where('navi_id',$cur_parent);
			$this->db->select('navi_id');
			$query=$this->db->get('add_navigation');
			if($query->num_rows()) {
				$rows=$query->result_array();
				$new_id=$rows[0]['navi_id'];
				return $this->get_current_path($new_id).$cur_path;
			}
			else return $cur_path;
		}
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */