<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Send_mail extends CI_Model {

	var $recipient_types=array(
	   'e' => 'employee',
	   'c' => 'customer',
	   'o' => 'others'	  
	);

	function __construct(){
		parent::__construct();	
		
		$this->load->library('My_mail');
	}
    
    function send($email,$subject,$content) {
       
       $subject="=?UTF-8?B?".base64_encode($subject.'来自'.$this->myconfig->item('site_name'))."?=";
       	   
       $mail_set=array(
         'SMTPServer'	        =>  'smtp.163.com',      //for 163, this is smtp.163.com		
         'SMTPServerUserName'	=>	'snellings',         //for 163, this only needs account					
         'SMTPServerPassword'	=>	'kennedyisafool',  				 
         'MailFrom'			    =>	'snellings@163.com', 
         'smtpport'             =>  25,
         'mailtype'             =>  'HTML',       	
       	 'MailtoAddress'	    =>  $email,		
         'Subject'		        =>  $subject,
         'MailBody'             =>  $content
       );
       	    
       $this->my_mail->smtp($mail_set['SMTPServer'],$mail_set['smtpport'],true,$mail_set['SMTPServerUserName'],$mail_set['SMTPServerPassword'],$mail_set['MailFrom']);	
       
	   $result=$this->my_mail->sendmail($mail_set['MailtoAddress'],$mail_set['MailFrom'],$mail_set['Subject'],$mail_set['MailBody'],$mail_set['mailtype']);

	   return $result;
              
    }
	
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
