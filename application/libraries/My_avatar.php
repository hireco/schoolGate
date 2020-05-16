<?php
/**
 * 
 * This is a class to do the thing related avatar ...
 * @author owner
 *
 */
class My_avatar {
	
	public $avatardir='avatar/saved';
	public $no_avatar_url='skin/admin/images/no_avatar.jpg';
	public $imgsalt='P2kexs9dfe';
	public $imgsafe=0; //0:show the real url of image; 1:hide the url of the image
	public $avatarsize = array('big' => 200, 'middle' =>120, 'small'=>48 );
	public $true_color=1; //0:imagecreate; 1:imagecreatetruecolor
	public $avatar_resize=1; //0: remains height/width=100/100; 1:resize to $avatarsize;
	
	function __construct(){
	}
    
	public function get_avatar_path($uid) {
        $uid = sprintf("%09d", $uid);
        $dir1 = substr($uid, 0, 3);
        $dir2 = substr($uid, 3, 2);
        $dir3 = substr($uid, 5, 2);
        return $dir1.'/'.$dir2.'/'.$dir3;
    }

    public function make_avatar_path($uid, $dir = '.') {
        $uid = sprintf("%09d", $uid);
        $dir1 = substr($uid, 0, 3);
        $dir2 = substr($uid, 3, 2);
        $dir3 = substr($uid, 5, 2);
        !is_dir($dir.'/'.$dir1) && mkdir($dir.'/'.$dir1, 0777);
        !is_dir($dir.'/'.$dir1.'/'.$dir2) && mkdir($dir.'/'.$dir1.'/'.$dir2, 0777);
        !is_dir($dir.'/'.$dir1.'/'.$dir2.'/'.$dir3) && mkdir($dir.'/'.$dir1.'/'.$dir2.'/'.$dir3, 0777);
    }

    
	public function get_avatar_filepath($uid, $size = 'big', $type = '') {
		$size = in_array($size, array('big', 'middle', 'small')) ? $size : 'big';
		$uid = abs(intval($uid));
		$uid = sprintf("%09d", $uid);
		$dir1 = substr($uid, 0, 3);
		$dir2 = substr($uid, 3, 2);
		$dir3 = substr($uid, 5, 2);
		$typeadd = $type == 'real' ? '_real' : '';
		return  $dir1.'/'.$dir2.'/'.$dir3.'/'.substr($uid, -2).$typeadd."_avatar_$size.jpg";
	}
	
	public function make_get_avatar_filepath($uid,$size='big',$type='') {
		        
        $avatarpath = $this->get_avatar_path($uid);
        $avatarrealdir  = realpath( $this->avatardir. DIRECTORY_SEPARATOR . $avatarpath );
	    if(!is_dir( $avatarrealdir )) {
            $this->make_avatar_path( $uid, realpath($this->avatardir) );
        }
        $avatarrealpath = $this->avatardir . DIRECTORY_SEPARATOR. $this->get_avatar_filepath($uid, $size, '');
        //$this->clear_avatar_file($uid);
        return $avatarrealpath;
	}
	
	public function clear_avatar_file($uid){
	    $avatarsize = array( 1 => 'big', 2 => 'middle', 3 => 'small');
	    $avatartype = array( 'real', 'virtual' );
	    $result=array();
	    foreach ( $avatarsize as $size ){
	        foreach ( $avatartype as $type ){
	            $avatarrealpath = realpath( $this->avatardir) . DIRECTORY_SEPARATOR. $this->get_avatar_filepath($uid, $size, $type);
	            if(file_exists($avatarrealpath)) $result[$size]=unlink($avatarrealpath);
	            else $result[$size]=TRUE;
	        }
	    }
	     if(in_array(FALSE, $result))  return FALSE;
	     else return TRUE;
	}

	public function get_avatar_url($uid,$size='middle',$refresh=FALSE) {
	    $avatar_url=$this->get_avatar_filepath($uid, $size, '');
	    if(file_exists(realpath($this->avatardir.DIRECTORY_SEPARATOR.$avatar_url))) {
        	$avatar_url=base_url().$this->avatardir.'/'.$avatar_url;
        	if($refresh==TRUE) return $avatar_url.'?'.rand(100, 999);
        	return $avatar_url;
        }
        else {
        	return base_url().$this->no_avatar_url;         
        }
	}
	
	public function hide_avatar_url($uid,$size='middle') {
		$random=$this->img_random($uid);
    	return site_url('image/avatar/'.$uid.'/'.$size.'/'.$random);
	}
	
	public function list_my_avatar($uid,$refresh=FALSE) {
		foreach($this->avatarsize as $index => $value) 
		$data[$index]=$this->imgsafe==1?$this->hide_avatar_url($uid,$index):$this->get_avatar_url($uid,$index,$refresh);
		
		return $data;
	}
	
	public function check_avatar($uid,$size='middle',$type='') {
		$avatar=$this->get_avatar_filepath($uid, $size, $type);
		$avatar = $this->avatardir.DIRECTORY_SEPARATOR.$avatar;
		if(file_exists($avatar))  return TRUE;
		else return FALSE;
	}

	public function mybase64_code($string,$action='ENCODE') {
    	if($action=='ENCODE'){
    	    return str_replace('=', '', base64_encode($string));
    	}
    	else if($action=='DECODE'){ 
    		return base64_decode($string);	
    	}    
    }
    
	public function img_random($uid) {
   	    return  $this->mybase64_code($this->authcode($uid,'ENCODE',$this->imgsalt));
	}
	
	/**
	 * 
	 * upload avatar by CI's class which uses GD's imagecreate function resulting in bad quality
	 */
    public function avatar_resize($uid,$source_img,$size) {
		
    	$CI =& get_instance(); 
    	     
    	$imgcfg['image_library'] = 'gd';
        $imgcfg['source_image'] = $source_img;        
        $imgcfg['create_thumb'] = FALSE;
        $imgcfg['maintain_ratio'] = TRUE;        
        $imgcfg['width'] = $this->avatarsize[$size];
        $imgcfg['height'] = $this->avatarsize[$size];
        $imgcfg['new_image'] = $this->make_get_avatar_filepath($uid,$size,'');
        
        $CI->load->library('image_lib', $imgcfg);
        if($CI->image_lib->resize()) return $imgcfg['new_image'];
	}
	
	/**
	 * 
	 * upload avatar using imagecreatetruecolor function to ensure the image's good quality
	 */
	public function avatar_resize_true($uid,$source_img,$size) {
		$img = imagecreatefromjpeg($source_img);
		if (!$img) 	return FALSE;
		
		$width = imageSX($img);
		$height = imageSY($img);
		if (!$width || !$height) return FALSE;
		
		$target_width = $this->avatarsize[$size];
		$target_height = $this->avatarsize[$size];
		$target_ratio = $target_width / $target_height;
		$img_ratio = $width / $height;
		
		if ($target_ratio > $img_ratio) {
			$new_height = $target_height;
			$new_width = $img_ratio * $target_height;
		} else {
			$new_height = $target_width / $img_ratio;
			$new_width = $target_width;
		}
		
		if ($new_height > $target_height) {
			$new_height = $target_height;
		}
		if ($new_width > $target_width) {
			$new_height = $target_width;
		}
		
		$new_img = ImageCreatetruecolor($this->avatarsize[$size], $this->avatarsize[$size]);
		if (!@imagefilledrectangle($new_img, 0, 0, $target_width-1, $target_height-1, 0)) return FALSE;
		if (!@imagecopyresampled($new_img, $img, ($target_width-$new_width)/2, ($target_height-$new_height)/2, 0, 0, $new_width, $new_height, $width, $height)) return FALSE;
		
		$object_img= $this->make_get_avatar_filepath($uid,$size,'');
		if(imagejpeg($new_img,$object_img,100)) return $object_img;    	        
	}
	
	public function avatar_only_upload($uid,$source_img,$size) {
		
		$object_img= $this->make_get_avatar_filepath($uid,$size,'');
			 
		if(copy($source_img, $object_img)) return $object_img;     	        
	}
	
	public static function authcode($string, $operation = 'DECODE', $key, $expiry = 0) {
        
        $ckey_length = 4;	
        if(empty($key)){
            exit('PARAM $key IS EMPTY! ENCODE/DECODE IS NOT WORK!');
        }else{
            $key = md5($key);
        }


        $keya = md5(substr($key, 0, 16));
        $keyb = md5(substr($key, 16, 16));
        $keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length): substr(md5(microtime()), -$ckey_length)) : '';

        $cryptkey = $keya.md5($keya.$keyc);
        $key_length = strlen($cryptkey);

        $string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d', $expiry ? $expiry + time() : 0).substr(md5($string.$keyb), 0, 16).$string;
        $string_length = strlen($string);

        $result = '';
        $box = range(0, 255);

        $rndkey = array();
        for($i = 0; $i <= 255; $i++) {
            $rndkey[$i] = ord($cryptkey[$i % $key_length]);
        }

        for($j = $i = 0; $i < 256; $i++) {
            $j = ($j + $box[$i] + $rndkey[$i]) % 256;
            $tmp = $box[$i];
            $box[$i] = $box[$j];
            $box[$j] = $tmp;
        }

        for($a = $j = $i = 0; $i < $string_length; $i++) {
            $a = ($a + 1) % 256;
            $j = ($j + $box[$a]) % 256;
            $tmp = $box[$a];
            $box[$a] = $box[$j];
            $box[$j] = $tmp;
            $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
        }

        if($operation == 'DECODE') {
            if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
                return substr($result, 26);
            } else {
                return '';
            }
        } else {
            return $keyc.str_replace('=', '', base64_encode($result));
        }

    }
    
}

/* End of file Avatar.php */
/* Location: ./application/libraries/Avatar.php */