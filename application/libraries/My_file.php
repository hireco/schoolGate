<?php
class My_file{
    
	var $CI;
	var $upload_files;
	var $image_types;
	var $flash_types;
	var $media_types;
	var $file_types;
	
    
	public function __construct(){
	   $this->CI =& get_instance();
	   $this->upload_files=$this->CI->config->item('upload_files');
	   foreach ($this->CI->config->item('upload_type_class') as $index => $value) {
	   	  $vars=$index.'_types';
	   	  $this->$vars=implode('|', $value);
	   }
	}

	function mk_mydir($truepath,$mmode=0777){
		if(!is_dir($truepath)){
			$oldumask=umask(0);
			mkdir($truepath,$mmode,TRUE);
			umask($oldumask);
			chmod($truepath,$mmode);
			return TRUE;
		}else{
			return FALSE;
		}
	}
	
	function is_img($fileName){
		$items=$this->image_types;
		if(preg_match("/\.(".$items.")$/",strtolower($fileName))) return 1;
		else return 0;
	} 
	
	function is_flash($fileName){
		$items=$this->flash_types;
		if(preg_match("/\.(".$items.")$/",strtolower($fileName))) return 1;
		else return 0;
	}

	function is_media($fileName){
		$items=$this->media_types;
		if(preg_match("/\.(".$items.")$/",strtolower($fileName))) return 1;
		else return 0;
	}
	
	function is_upload_files($fileName){
		$items=$this->upload_files;
		if(preg_match("/\.(".$items.")$/",strtolower($fileName))) return 1;
		else return 0;
	}
	
	function is_valid_file($fileName){
		$items=$this->file_types;
		if(preg_match("/\.(".$items.")$/",strtolower($fileName))) return 1;
		else return 0;
	}
	
	function file_extend($filename) {
		$extend =explode(".",$filename);
		$va=count($extend)-1;
		return $extend[$va];
	}
}
/* End of file Common.php */
/* Location: ./application/libraries/Common.php */