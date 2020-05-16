<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Chkimg extends CI_Controller {

	var $result_string;
	
	function __construct() {
		parent::__construct();
		$this->output->cache(0); //此文件不缓存
	}

	function index() {

		$temp=explode(',', $this->random_string());
		$this->session->set_userdata(array('result_string' => implode('',$temp)));
		
		$im=imagecreatefromjpeg("data/captcha_bg.jpeg");
		$color[0]=imagecolorallocate($im,255,0,9);
		$color[1]=imagecolorallocate($im,0,0,0);
		$color[2]=imagecolorallocate($im,0,0,255);
		$ttf[0]="data/fonts/ariali.ttf";
		$ttf[1]="data/fonts/comic.ttf";
		$ttf[2]="data/fonts/lucon.ttf";

		for($i=0;$i<=4;$i++){
			$chr=$temp[$i]; $fontsize=rand(15,20);
			imagettftext($im,$fontsize, $i*5, 20*$i+5, 25, $color[$i%3], $ttf[$i%3],$chr);
		}
		for($i=0;$i<=20;$i++) {
			$x1=rand(1,80);$y1=rand(1,30);
			imageline($im,$x1,$y1,$x1+1, $y1+1,$color[$i%3]);
		}
		header("content-type: image/jpeg");
		imagejpeg($im);
		imagedestroy($im);
		exit(0);
	}

	function  random_string(){
		$chr_all="";
		for($i=0;$i<=4;$i++){ 
			$flag=rand(0,1); 
			if($flag==1)  $chr[$i]=rand(97,122);
			else  $chr[$i]=rand(48,57);
			$chr[$i]=chr($chr[$i]);
			$chr_all=$chr_all.$chr[$i].",";
		}
		return $chr_all;
	}
	
	function input_chk() {
		if($this->input->post('captcha')==$this->session->userdata('result_string')) echo '1';
		else echo '0';
		exit(0);
	}
}
/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */