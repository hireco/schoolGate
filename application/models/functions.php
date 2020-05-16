<?php
class Functions extends CI_Model
{
	function __construct() {
		parent::__construct();
	}
    
	function get_scroll($scroll_id) {
		
		$this->db->where('scroll_id',$scroll_id);
		$query=$this->db->get('add_scroll');
		
		$scroll=$query->row_array();
		
		return $scroll;
	}
	
	function get_object_title($object_type,$object_id) {
		
		switch($object_type) {
			
			case "article":
			case "photo":
			case "video":
			case "download":
				$object_title=$this->get_cms_title($object_id);
				break;
		}
		
		return $object_title;
	}
	
	function get_cms_title($id) {
		$this->db->where('index_id', $id);
		$this->db->select('cms_title');
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
			$rows=$query->result_array();
			return $rows[0]['cms_title'];
		}
		else return '';
	}
	
	function show_msg($infor='您访问的页面不存在！',$viewer='404_error',$title='页面没找到') {
		$data=array(
			 'title'=> $title,
			 'viewer' => $viewer,
			 'infor'  => $infor
			);
		echo $this->my_load->view('show_msg',$data,TRUE);
		exit();
	}
	
	function msg4nullcontent() {
		echo '<div class="not_found"><div class="hint">没有找到内容，将自动跳转到首页...</div></div>';
	}
	
    function get_thumbs_files($photos,$single='') {
		
		$thumbs=array();
		
		if(strpos($photos, '::')===FALSE) {
		$photos=explode(':', $photos);			
			foreach ($photos as $index => $value) {
				if(strpos(basename($value), $this->config->item('thumb_prefix'))===FALSE)
				   $thumbs[$index]=str_replace(basename($value), $this->config->item('thumb_prefix').basename($value), $value);
				else  $thumbs[$index]=$value;
			}
		}
		else {
		   $photos=explode('::', $photos);
		   $thumbs=explode(':', $photos[0]);
		}
		
		if($single==='') return  implode(':', $thumbs);
		else return $thumbs[abs((int)$single)];
	}
	
	function get_photos_files($thumbs,$single='') {
		
		$photos=array();
		
		if(strpos($thumbs, '::')===FALSE) {
		   $thumbs=explode(':', $thumbs);			
		   foreach ($thumbs as $index => $value) {
		   	    $photos[$index]=str_replace($this->config->item('thumb_prefix'), '', $value);
		   }
		}
		else {
		   $thumbs=explode('::', $thumbs);
		   $photos=explode(':', $thumbs[1]);
		}
		
		if($single==='') return  implode(':', $photos);
		else return $photos[abs((int)$single)];
   }
   
   function show_telephone($telephone) {
		if($this->myconfig->item('show_telephone')=='1') return $telephone;
		else return $this->myconfig->item('default_telephone');
   }
   
   function show_qq($qq) {
   	    if(!preg_match("/^\d{4,14}$/",$qq)) return false;
   	    $site_name=$this->config->item('site_name');
   	    if($this->myconfig->item('show_qq_link')=='0') return  $qq;
   	    else return '<a target="_blank" href="tencent://message/?uin='.$qq.'&amp;Site='.$site_name.'&amp;Menu=yes"><img src="http://wpa.qq.com/pa?p=1:'.$qq.':5" alt="'.$site_name.'" border="0" height="13" width="55"></a>';
   }
}
/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */