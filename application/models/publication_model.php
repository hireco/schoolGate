<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Publication_model extends CI_Model
{
	var $pub_types=array(
	  'paper' =>   '论文',
	  'book' =>    '著作',
	  'talk' =>    '报告'
	);
	
	var $conditions=array(
	  'preprint' => '预印本',
	  'submitted' => '已提交',
	  'published' => '已发表'
	);

	var $pub_terms=array(
	   'meeting_city' => '会议地点',
	   'meeting' => '会议名称',       
	   'pub_condition' => '发布状态',
	   'journal' => '期刊名',
	   'volumn' => '卷',
	   'cited' => '引用数',
	   'publisher' => '出版商',
	   'publish_area' => '地区',
	   'authors' => '作者',
	   'page' => '页码'	
	);
	
	var $year_back=2;
	
	function __construct() {
		parent::__construct();
		$this->pub_terms=array_merge($this->pub_terms,$this->conditions, $this->pub_types);
	}

	function pub_list($pub_time='') {
        
		$this->db->order_by('pub_id desc');
		$this->db->where(array('pub_time' => $pub_time,'pub_type' => 'paper'));
        $query=$this->db->get('add_publication');		
        $data['papers']=$query->result_array();
        
        $this->db->order_by('pub_id desc');
        $this->db->where(array('pub_time' => $pub_time,'pub_type' => 'book'));
        $query=$this->db->get('add_publication');		
        $data['books']=$query->result_array();
        
        $this->db->order_by('pub_id desc');
        $this->db->where(array('pub_time' => $pub_time,'pub_type' => 'talk'));
        $query=$this->db->get('add_publication');		
        $data['talks']=$query->result_array();
        
        $data['pub_time']=$pub_time;
        
        $data['body']='publication';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}
		
}
