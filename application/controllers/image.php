<?php
class Image extends CI_Controller
{
    function  __construct() {
    	parent::__construct();
		
		$this->output->cache(0); //此文件不缓存
    }
    
    function avatar($uid,$size='middle',$random='',$type='') {
		$this->load->library('My_avatar');
		$decode_id=$this->my_avatar->authcode($this->my_avatar->mybase64_code($random,'DECODE'), 'DECODE', $this->my_avatar->imgsalt);
		
		if(empty($random) || $decode_id!=$uid)  $this->move_to_image(base_url().'skin/images/loading_failed.jpg');
		else { 
			$avatar=$this->my_avatar->get_avatar_filepath($uid, $size, $type);
			$avatar = $this->my_avatar->avatardir.DIRECTORY_SEPARATOR.$avatar;
			if(file_exists($avatar)) {			
				$random = !empty($random) ? rand(1000, 9999999) : '';
				$avatar_url = empty($random) ? $avatar : $avatar.'?random='.$random;
				$avatar_url =base_url().$avatar_url;
			} 
			else {
				$avatar_url = base_url().$this->my_avatar->no_avatar_url;
				$avatar='';
			}
			
			if($this->my_avatar->imgsafe) {
				if($avatar) $this->image($avatar);
				else $this->move_to_image($avatar_url);
			} 
			else {
				$this->move_to_image($avatar_url);
			}
			
		}
	}
	
	private function image($filename) {
	   $data=@file_get_contents($filename); 
	   $file_extend=$this->file_extend(basename($filename));	
	   header("Content-type: image/".$file_extend);
	   header("Content-Length: ".strlen($data));
	   echo $data;
	   exit(0);
	}
	
	function file_extend($filename) {
	   $extend =explode(".",$filename);
	   $va=count($extend)-1;   
	   return $extend[$va]=='jpg'?'jpeg':$extend[$va];     
	}
	
	function move_to_image($image_url) {
	   header("HTTP/1.1 301 Moved Permanently");
	   header("Last-Modified:".date('r'));
	   header("Expires: ".date('r', time() + 86400));
	   header('Location: '.$image_url);
	   exit(0);
	}

	function string_image($imgstr=' ') {
		$authnum=$imgstr;
		$this->load->library('common'); 
		$authnum=common::myurlcode($authnum,"DECODE");
		Header("Content-type:image/jpeg"); 
		$im = imagecreate(200,20); //制定图片背景大小 
		$black = ImageColorAllocate($im, 0,0,0); //设定三种颜色 
		$gray = ImageColorAllocate($im, 255,255,255); 
		imagefill($im,0,0,$gray); //采用区域填充法，设定（0,0） 
		imagestring($im, 4, 0, 0, $authnum, $black); 
		ImagePNG($im); 
		ImageDestroy($im);
	}
}

/* End of file image.php */
/* Location: ./application/controllers/image.php */