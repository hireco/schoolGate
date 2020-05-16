<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Swfupload extends CI_Controller {

	function __construct(){
		parent::__construct();
		$this->load->library('My_file');
		$this->load->model('functions');
		
		//$this->output->cache(0); //此文件不缓存
    	//注：swfupload的upload()方法不是ajax方式，它实际是通过提交表单的方式上传文件的。
    	//在imgupload末尾使用exit(0)可防止缓存
	}

	function admin_upload() {
		if(!IS_AJAX)  $this->functions->show_msg();
		
		session_start();
		$this->check->check_admin_logged();
		echo $this->load->view('ajax/admin_swfupload','',TRUE);
	}
    
	function user_upload() {
		if(!IS_AJAX)  $this->functions->show_msg();
		
		session_start();
		$this->check->check_user_logged();
		echo $this->load->view('ajax/user_swfupload','',TRUE);
	}
	
	//upload file to remote server
	function upload() {
		// Work-around for setting up a session because Flash Player doesn't send the cookies
		if (isset($_POST["PHPSESSID"])) {
			session_id($_POST["PHPSESSID"]);
		}
		session_start();
		
		if(!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {
			echo "ERROR:错误的上传文件";
			exit(0);
		}
		
		$name = $_FILES["Filedata"]['name'];
		
		if(!$this->input->post('rename_to'))
		$file_name=time().'_'.rand(100,999).'.'.$this->my_file->file_extend($name);
		else $file_name=$this->input->post('rename_to').'.'.$this->my_file->file_extend($name);
		
		if(!$this->input->post('dir_to')) {
			$file_type=$_POST['file_type'];
		    $file_dir=$this->config->item('upload_dir').'/'.$this->config->item($file_type.'_dir').'/'.date('ym');
		    !is_dir($file_dir)?$this->my_file->mk_mydir($file_dir):'';
		}
		else $file_dir=$this->input->post('dir_to');
		
		if(!move_uploaded_file($_FILES["Filedata"]["tmp_name"], $file_dir.'/'.$file_name)) {
			echo "ERROR:上传文件出错";
			exit(0);
		}
		else  echo "SUCCESS:".$file_dir.'/'.$file_name;
		
		exit(0);
	}
}