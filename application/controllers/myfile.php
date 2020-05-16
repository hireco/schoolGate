<?php
class Myfile extends CI_Controller
{
    function  __construct() {
    	parent::__construct();
    	$this->load->library('My_file');
		$this->load->library('Common');
		$this->load->helper('file');
    }
    
    function download($filepath,$filename=FALSE) {

		if(empty($filepath)) show_404();

		$filepath=common::myurlcode($filepath,'DECODE');

		if(!is_file($filepath)) show_404();

	    $mime_type=get_mime_by_extension(basename($filepath));	
		$filename=$filename?common::myurlcode($filename,'DECODE'):basename($filepath);
	    header('Content-disposition: attachment; filename="'.$filename.'"');
	    header("Content-type: ".$mime_type);	    
	    readfile($filepath);
	    exit(0);
	}
}

/* End of file image.php */
/* Location: ./application/controllers/image.php */