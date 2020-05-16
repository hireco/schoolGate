<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class People_avatar extends CI_Controller {
	function __construct(){
		parent::__construct();
	}

	function upload() {
	    if (isset($_POST["PHPSESSID"])) {
			session_id($_POST["PHPSESSID"]);
		}
		session_start();
		
		$this->load->library('My_file');
		
		if(!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {
			echo "ERROR:错误的上传文件";
			exit(0);
		}
		
		if (!isset($_SESSION["file_info"])) {
        		$_SESSION["file_info"] = array();
        		$_SESSION["file_url"] = array();
        }
        
        $imagevariable = file_get_contents($_FILES["Filedata"]["tmp_name"]);
		$file_id = md5($_FILES["Filedata"]["tmp_name"] + rand()*100000);        
        $_SESSION["file_info"][$file_id] = $imagevariable;        
        
		$file_name=time().'_'.rand(100,999).'.'.$this->my_file->file_extend($_FILES["Filedata"]['name']);
		$file_type=$_POST['file_type'];
		$file_dir=$this->config->item('upload_dir').'/'.$this->config->item($file_type.'_dir').'/'.date('ym').'/';
		!is_dir($file_dir)?$this->my_file->mk_mydir($file_dir):'';
		
		$_SESSION["file_url"][$file_id] = $file_dir.$file_name;
		
		if(!move_uploaded_file($_FILES["Filedata"]["tmp_name"], $file_dir.$file_name)) {
			echo "ERROR:上传文件出错";
			exit(0);
		}        
        else echo "FILEID:" . $file_id;	// Return the file id to the script
        
        exit(0); //防止生成缓存文件
	}
	
	function thumbnail($id='') {
	    if (isset($_POST["PHPSESSID"])) {
			session_id($_POST["PHPSESSID"]);
		}
		session_start();
		 
		$image_id = $id==''?false:$id; 
		
		if ($image_id === false) {
			header("HTTP/1.1 500 Internal Server Error");
			echo "No ID";
			exit(0);
		}
		
		if (!is_array($_SESSION["file_info"]) || !isset($_SESSION["file_info"][$image_id])) {
			header("HTTP/1.1 404 Not found");
			exit(0);
		}
		
		header("Content-type: image/jpeg") ;
		header("Content-Length: ".strlen($_SESSION["file_info"][$image_id]));
		echo $_SESSION["file_info"][$image_id];
		exit(0);
	}

	function avatar_url() {
		if (isset($_POST["PHPSESSID"])) {
			session_id($_POST["PHPSESSID"]);
		}
		session_start();
		 
		$image_id = $this->input->post('image_id');
		$prefix_str=str_replace($this->config->item('site_base'),'',base_url());
		echo $prefix_str.$_SESSION["file_url"][$image_id];
		
		exit(0);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
