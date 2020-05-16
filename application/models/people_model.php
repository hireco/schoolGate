<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class People_model extends CI_Model
{
	var $groups=array(
	  'fellow' => array('院士',array('1')),
	  'senior' => array('正高',array('2','6')),
	  'associate' => array('副高',array('3','7','8','9')),
	  'intermediate' => array('中级',array('4','10','11','12')),
	  'others' => array('初级及其他',array('5','13'))
	);

	var $titles=array(
	  '1'  => 'fellow',
	  '2'  => 'professor',
	  '3'  => 'vice-professor',
	  '4'  => 'lecturer',
	  '5'  => 'assistant',
	  '6'  => 'senior-researcher',
	  '7'  => 'senior-engineer',
	  '8'  => 'senior-experimentalist',
	  '9'  => 'researcher',
	  '10' => 'engineer',
	  '11' => 'experimentalist',
	  '12' => 'research-assistant',
	  '13' => 'others'	
	);
	
	var $cn_titles=array(
	  '1'  => '双聘院士',
	  '2'  => '教授',
	  '3'  => '副教授',
	  '4'  => '讲师',
	  '5'  => '助教',
	  '6'  => '研究员',
	  '7'  => '高级工程师',
	  '8'  => '高级实验师',
	  '9'  => '副研究员',
	  '10' => '工程师',
	  '11' => '实验师',
	  '12' => '助理研究员',
	  '13' => '其他人员'
	);
	

	var $degrees=array(
	  'bachelor' => '学士',
	  'master'  => '硕士',
	  'doctor'  => '博士',
	  'others' => '其他类型'
	);

	var $group_of_title=array(
		'1'  => 'fellow',
		'2'  => 'senior',
		'3'  => 'associate',
		'4'  => 'intermediate',
		'5'  => 'others',
		'6'  => 'senior',
		'7'  => 'associate',
		'8'  => 'associate',
		'9'  => 'associate',
		'10' => 'intermediate',
		'11' => 'intermediate',
		'12' => 'intermediate',
		'13' => 'others'
	);

	var $title_ids=array();

	function __construct() {
		parent::__construct();
		$this->title_ids = array_flip($this->titles);
	}
	function people_group($group_id) {
        
		if($group_id) $title_id=$this->groups[$group_id][1];

		$this->db->order_by('en_name asc');
		$this->db->where('hide',0);
		if($group_id) $this->db->where_in('title_id', $title_id);
		$query=$this->db->get('add_people');		
        $data['people']=$query->result_array();
        
        $data['people_group_cn']= $group_id?$this->groups[$group_id][0]:'全部';

		$data['group_id']=$group_id;

        $data['body']='people_group';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}
	
	function people_list($title_id) {
        
		$this->db->order_by('en_name asc');
		$this->db->where('hide',0);
		if($title_id) $this->db->where('title_id', $title_id);
		$query=$this->db->get('add_people');		
        $data['people']=$query->result_array();
        
        $data['people_title']= $title_id?$this->titles[$title_id]:'';
		$data['people_title_cn']= $title_id?$this->cn_titles[$title_id]:'全部';

		$data['title_id']=$title_id;

        $data['body']='people_list';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}	

	function people_view($people_id=0) {
        
		$this->db->where(array('people_id' => $people_id));
        $query=$this->db->get('add_people');		
        if(!$query->num_rows()) $this->functions->show_msg();
       
        $data['people']=$query->row_array();
        
        if($data['people']['hide']=='1' && $this->session->userdata('user_name')!=$data['people']['user_name'])
        $this->functions->show_msg();
        
		$data['body']='people_view';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}

}
