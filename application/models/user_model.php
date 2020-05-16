<?php  
class User_model extends CI_Model
{
	var $career_types=array(
	  '教育科研',
	  '商业',
	  '技术工作',
	  '政府部门',
	  '农业',
	  '自由职业',
	  '其他'
	  );
	  
	var $identity_types=array(
	  '10' => '身份证',
	  '20' => '军官证',
	  '30' => '护照'
	);

	var $provinces=array(
	'山东','江苏','安徽','浙江','福建','上海','广东',
	'广西','海南','湖北','湖南','河南','江西','北京',
	'天津','河北','山西','内蒙古','宁夏','新疆','青海',
	'陕西','甘肃','四川','云南','贵州','西藏','重庆',
	'辽宁','吉林','黑龙江','台湾','香港','澳门'	
	);
	
	function __construct() {
		parent::__construct();
	}

	function user_careers() {
		echo '<ul>';
		foreach ($this->career_types as $index => $value)
		echo '<li class="career_item">'.$value.'</li>';
		echo '</ul>';
	}

	function provinces() {
		foreach ($this->provinces as $value)
		echo '<span class="province_item">'.$value.'</span>';
	}
	
	function identity_types() {
		echo '<ul>';
		foreach ($this->identity_types as $index => $value)
		echo '<li class="identity_item" id="identity_type_'.$index.'">'.$value.'</li>';
		echo '</ul>';
	}

	function people_en_id() {
		$user_name = $this->session->userdata('user_name');
		$this->db->where('user_name',$user_name);
		$this->db->select('en_id');
		$this->db->limit(1);
		$query=$this->db->get('add_people');
		if($query->num_rows()) {
			$row = $query->row_array();
			return $row['en_id'];
		}
		else return false;
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */