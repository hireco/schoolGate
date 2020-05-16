<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Image extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->helper('array');
		$this->load->model('functions');
		
		$this->output->cache(0); //此文件不缓存

		//if(!IS_AJAX) show_404(); //注：upload_crop->upload()不是ajax方式，ajaxupload实际是通过提交表单的方式上传文件的。
		$this->check->check_admin_logged();
	}

	function  upload_crop($action='viewer') {
	   $this->load->model('upload_crop');
	   
	   if($action=='viewer'){
	   	   if($this->input->post('ajax')==1) {
		       $post=$_POST;			   
			   $post['upload_action'] = current_url().'/upload';
			   $post['crop_action']=current_url().'/crop';
			   $post['thumb_action']=current_url().'/thumb';
			   $post['clear_action']=current_url().'/clear';	       
			   
			   $this->upload_crop->viewer($post); 
			   
	      }
		  else show_404();
	   }		 	   
	   else if($action=='upload')  
		   $this->upload_crop->upload();  
	   else if($action=='crop')    
		   $this->upload_crop->crop();
	   else if($action=='thumb')
	       $this->upload_crop->thumb();
	   else if($action=='clear')  
		   $this->upload_crop->clear();
	   else show_404();
   }

   function delete_images() {
        
   	    if(!IS_AJAX)  $this->functions->show_msg();
         
		$files=$this->input->post('files');
		$retains=$this->input->post('retains');
		
		$files=str_replace('::',':',$files);
		$files=explode(':',$files);
		$retains=str_replace('::',':',$retains);
		$retains=explode(':',$retains);
		
		$result=array();

		foreach($files as $index => $value) {
			if(in_array($value, $retains)) $result[]=TRUE;
			else {
				$file=str_replace(base_url(), '', 'http://'.$_SERVER["HTTP_HOST"].$value);
				if(is_file($file)) $result[]=unlink($file);
				else $result[]=TRUE;
			}					 
		}

		if(array_search(FALSE,$result)===FALSE) 
			echo '1';
		else 
			echo '0';
	}
}