<?php
class Guest_model extends CI_Model
{
	var $top_type=array(
	  '科研事务',
	  '行政事务',
	  '合作事务',
	  '网站相关'
	  );
	  
    var $sub_type=array(
      '论文查询|科研报告|其他',
      '人员询问|意见建议|其他',
      '实验合作|意见建议|其他',
      '故障报告|意见建议|其他'
    );
    	
	function __construct() {
		parent::__construct();
	}
	
	function top_types() {
		echo '<ul>';
		foreach ($this->top_type as $index => $value) 
		echo '<li class="guestbook_top_item" id="top_item_'.$index.'">'.$value.'</li>';
		echo '</ul>';
	}
	
	function sub_types() {
	    foreach ($this->sub_type as $index => $value) {
		  echo '<div id="sub_item_'.$index.'"><ul>';
		  $sub_list=explode('|',$value);
		  foreach ($sub_list as $index_i => $value_i) echo '<li class="guestbook_sub_item">'.$value_i.'</li>';
		  echo '</ul></div>';
		  echo "\n";
	   }
	}
	
	function show_children($guest_id) {
		$this->db->where('parent_id',$guest_id);
		$this->db->where('hide','0');
		$this->db->select('guest_id,guest_content,post_time,guest_name');
		$query=$this->db->get('add_guestbook');
		$rows=$query->result_array();
		foreach ($rows as $index => $value) {
			echo '<div class="children">';
			echo '<div class="child_header">'.$value['guest_name'].' 于  '.date('Y-m-d H:i:s',$value['post_time']).' 发表回复</div>';
		    echo '<div class="child_body">'.$value['guest_content'].'</div>';
		    $this->show_children($value['guest_id']);
			echo '</div>';
		}
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */