<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mysql extends CI_Model {
	
	function __construct(){
		parent::__construct();
	}

	function item($table, $item,$where) {
		$this->db->where($where);
		$query=$this->db->get($table);
		$row=$query->row_array();
		return isset($row[$item])?$row[$item]:'';
	} 
	
	function row($table,$where) {
		$this->db->where($where);
		$this->db->limit(1);
		$query=$this->db->get($table);
		return $query->row_array();
	}
	
	function rows($table,$where,$limit=FALSE) {
		$this->db->where($where);
		if($limit) $this->db->limit($limit);
		$query=$this->db->get($table);
		return $query->result_array();
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
