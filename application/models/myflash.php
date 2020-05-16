<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Myflash extends CI_Model
{
	function __construct() {
		parent::__construct();
		$this->load->model('functions');
	}
	
	function sinaflash($scroll_id=0,$width=950,$height=90,$img_width=120,$img_height=75,$vspace=20,$hspace=15) {
		
		if(!$scroll_id) return FALSE;
		
		$scroll=$this->functions->get_scroll($scroll_id);
		if(!count($scroll)) return FALSE; 
		
		$links=explode('|',$scroll['photo_link']);
		$thumbs=explode(':',$this->functions->get_thumbs_files($scroll['photo_list']));
		
		$data=array(
		  'width'      => $width,
		  'height'     => $height,
		  'img_width'  => $img_width,
		  'img_height' => $img_height,
		  'vspace'     => $vspace,
		  'hspace'     => $hspace,
		  'num'        => count($thumbs),
		  'thumbs'     => $thumbs,
		  'links'      => $links 
		);
		echo $this->load->view('pannel/sinaflash',$data,TRUE);
	}
	
}
