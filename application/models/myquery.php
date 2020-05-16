<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Myquery extends CI_Model {   	
	
	function __construct(){
		parent::__construct();
		$this->load->library('Common');	 			
	}
	
	//查询友情链接
	function friend_links($num=40,$order_by='recommend desc,link_id asc') {
		$friends=array();
		$this->db->order_by($order_by);
		if($num) $this->db->limit($num);
		$query=$this->db->get('add_link');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$friends=$rows;
		}
		return $friends;
	}
	
	function total_cms($model_type='',$class_id=0,$classes=array(),$where=array()) {
	    
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0'); 
		
		if($model_type) $this->db->where('model_id',$this->myconfig->cms_model_id($model_type));
		if($class_id) $this->db->where('class_id',$class_id);
		if($classes) $this->db->where_in('class_id',$classes);
		if($where) $this->db->where($where);

		$this->db->from('cms_index');
		
		return $this->db->count_all_results();

	}
	
	//cms内容列表
	function cms_list($num=10,$model_type='',$order_by='top desc, post_time desc',$class_id=0) {
		$cms_list=array();
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		
		$this->db->order_by($order_by);			
		if($model_type) $this->db->where('model_id',$this->myconfig->cms_model_id($model_type));
		if($num) $this->db->limit($num); 		
		if($class_id) $this->db->where('class_id',$class_id);
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
		    $rows=$query->result_array();
		    $cms_list=$rows;	
		}	
		return $cms_list;
	}
	
	function cms_of_ids($ids=array(), $num=0,$model_type='',$order_by='top desc, post_time desc') {
	    $cms_list=array();
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		
		$this->db->order_by($order_by);
		if($model_type) $this->db->where('model_id',$this->myconfig->cms_model_id($model_type));
		if($num) $this->db->limit($num); 		
		if($ids) $this->db->where_in('index_id',$ids);
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
		    $rows=$query->result_array();
		    $cms_list=$rows;	
		}	
		return $cms_list;
	}

	function cms_of_classes($classes=array(), $num=0,$model_type='',$order_by='top desc, post_time desc') {
	    $cms_list=array();
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		
		$this->db->order_by($order_by);		
		if($model_type) $this->db->where('model_id',$this->myconfig->cms_model_id($model_type));
		if($num) $this->db->limit($num); 		
		if($classes) $this->db->where_in('class_id',$classes);
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
		    $rows=$query->result_array();
		    $cms_list=$rows;	
		}	
		return $cms_list;
	}

	//获取文章分类
	//   parent_id的值来选取
	//   -1表示不做分类限制
	//   0 表示仅顶级分类
	//   其他自然数表示某个分类的子类
	function cms_class_list($num=10,$parent_id=-1,$order_by='class_priority asc',$where_in=array()) {
		$class_list=array();
		$this->db->order_by($order_by);
		if($parent_id!=-1) $this->db->where('parent_id',$parent_id);
		if(count($where_in)) $this->db->where_in('class_id',$where_in);
		if($num) $this->db->limit($num);
		$query=$this->db->get('cms_class');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$class_list=$rows;
		}
		return $class_list;
	}

	//静态内容列表
	function html_list($num=10,$group_id=0,$order_by='last_modify desc, post_time desc') {
		$html_list=array();
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		
		$this->db->order_by($order_by);
		if($num) $this->db->limit($num);		
		if($group_id) $this->db->where('group_id',$group_id);
		$query=$this->db->get('add_html');
		if($query->num_rows()) {
		    $rows=$query->result_array();
		    $html_list=$rows;	
		}	
		return $html_list;
	}
	
	function html_of_ids($ids=array(), $order_by='last_modify desc, post_time desc') {
	    $html_list=array();
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		
		$this->db->order_by($order_by);
		if($ids) $this->db->where_in('html_id',$ids);
		$query=$this->db->get('add_html');
		if($query->num_rows()) {
		    $rows=$query->result_array();
		    $html_list=$rows;	
		}	
		return $html_list;
	}

	function navi_list($navi_type='', $num=10,$parent_id=0,$order_by='navi_type asc, navi_priority asc') {
		$navi_list=array();
		$this->db->order_by($order_by);
		if($parent_id!=-1) $this->db->where('parent_id',$parent_id);
		if($navi_type) $this->db->where('navi_type',$navi_type);
		if($num) $this->db->limit($num);
		$query=$this->db->get('add_navigation');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$navi_list=$rows;
		}
		return $navi_list;
	}
	
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
