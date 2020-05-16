<?php
class My_image {

	var $photo_markup = '1';
	var $photo_markdown = '1';
	var $photo_wwidth = '22';
	var $photo_wheight = '22';
	var $photo_waterpos = '9';
	var $photo_watertext = 'www.7hn8.com';
	var $photo_fontsize = '5';
	var $photo_fontcolor = '#0000FF';
	var $photo_diaphaneity = '60';
	var $photo_markimg = 'data/water_mark.gif';

	var $cfg_photo_type=array(
	    'gif'  => false,
        'jpeg' => false,
        'wbmp' => false,
        'png'  => false
	);
	var $cfg_photo_typenames = array();
	var $cfg_photo_support = "";
	var $cfg_jpeg_query=100;
	

	function __construct(){

		if(function_exists("imagecreatefromgif") && function_exists("imagegif")){
			$this->cfg_photo_type['gif'] = true;
			$this->cfg_photo_typenames[] = "image/gif";
			$this->cfg_photo_support .= "GIF ";
		}
		if(function_exists("imagecreatefromjpeg") && function_exists("imagejpeg")){
			$this->cfg_photo_type["jpeg"] = true;
			$this->cfg_photo_typenames[] = "image/pjpeg";
			$this->cfg_photo_typenames[] = "image/jpeg";
			$this->cfg_photo_support .= "JPEG ";
		}
		if(function_exists("imagecreatefrompng") && function_exists("imagepng")){
			$this->cfg_photo_type["png"] = true;
			$this->cfg_photo_typenames[] = "image/png";
			$this->cfg_photo_typenames[] = "image/x-png";
			$this->cfg_photo_support .= "PNG ";
		}
		if(function_exists("imagecreatefromwbmp") && function_exists("imagewbmp")){
			$this->cfg_photo_type["wbmp"] = true;
			$this->cfg_photo_typenames[] = "image/wbmp";
			$this->cfg_photo_support .= "WBMP ";
		}
	}

	//水印函数配置和调用
	function WaterImg($srcFile,$fromGo='up')
	{
		if($this->photo_markup!='1') return;

		$info = "";
		$srcInfo = GetImageSize($srcFile,$info);
		$srcFile_w    = $srcInfo[0];
		$srcFile_h    = $srcInfo[1];

		if($srcFile_w < $this->photo_wwidth || $srcFile_h < $this->photo_wheight) return;
		if($fromGo=='up' && $this->photo_markup=='0') return;
		if($fromGo=='down' && $this->photo_markdown=='0') return;

		$trueMarkimg = $this->photo_markimg;
		if(!file_exists($trueMarkimg) || empty($this->photo_markimg))  $trueMarkimg = "";
		$this->ImgWaterMark($srcFile,$this->photo_waterpos,$trueMarkimg,$this->photo_watertext,$this->photo_fontsize,$this->photo_fontcolor,$this->photo_diaphaneity);
	}

	//水印生成函数
	function ImgWaterMark($srcFile,$w_pos=0,$w_img="",$w_text="",$w_font=5,$w_color="#FF0000",$w_pct) {

		$font_type = 'data/fonts/ggbi.ttf';
		if(empty($srcFile) || !file_exists($srcFile)) return ;

		$info = '';
		$srcInfo = getimagesize($srcFile,$info);
		$srcFile_w    = $srcInfo[0];
		$srcFile_h    = $srcInfo[1];

		switch($srcInfo[2]){
			case 1 :
				if(!function_exists("imagecreatefromgif")) return;
				$srcFile_img = imagecreatefromgif($srcFile);
				break;
			case 2 :
				if(!function_exists("imagecreatefromjpeg")) return;
				$srcFile_img = imagecreatefromjpeg($srcFile);
				break;
			case 3 :
				if(!function_exists("imagecreatefrompng")) return;
				$srcFile_img = imagecreatefrompng($srcFile);
				break;
			case 6:
				if(!function_exists("imagewbmp")) return;
				$srcFile_img = imagecreatefromwbmp($srcFile);
				break;
			default :
				return;
		}

		//读取水印图片
		if(!empty($w_img) && file_exists($w_img)){

			$ifWaterImage = 1;
			$info = '';
			$water_info = getimagesize($w_img,$info);
			$width      = $water_info[0];
			$height     = $water_info[1];

			switch($water_info[2]){
				case 1 :
					if(!function_exists("imagecreatefromgif")) return;
					$water_img = imagecreatefromgif($w_img);
					break;
				case 2 :
					if(!function_exists("imagecreatefromjpeg")) return;
					$water_img = imagecreatefromjpeg($w_img);
					break;
				case 3 :
					if(!function_exists("imagecreatefrompng")) return;
					$water_img = imagecreatefrompng($w_img);
					break;
				case 6 :
					if(!function_exists("imagecreatefromwbmp")) return;
					$srcFile_img = imagecreatefromwbmp($w_img);
					break;
				default :
					return;
			}
		}
		else{
			$ifWaterImage = 0;
			$ifttf = 1;
			@$temp = imagettfbbox($w_font,0,$font_type,$w_text);
			$width = $temp[2] - $temp[6];
			$height = $temp[3] - $temp[7];
			unset($temp);
			if(empty($width)&&empty($height)){
				$width = strlen($w_text) * 10;
				$height = 20;
				$ifttf = 0;
			}
		}

		//水印位置
		if($w_pos==0){ //随机位置
			$wX = rand(0,($srcFile_w - $width));
			$wY = rand(0,($srcFile_h - $height));
		}else if($w_pos==1){ //左上角
			$wX = 5;
			if($ifttf==1) $wY = $height + 5;
			else $wY = 5;
		}else if($w_pos==2){ //左中
			$wX = 5;
			$wY = ($srcFile_h - $height) / 2;
		}else if($w_pos==3){ //左下
			$wX = 5;
			$wY = $srcFile_h - $height - 5;
		}else if($w_pos==4){ //上中
			$wX = ($srcFile_w - $width) / 2;
			if($ifttf==1) $wY = $height + 5;
			else $wY = 5;
		}else if($w_pos==5){ //正中
			$wX = ($srcFile_w - $width) / 2;
			$wY = ($srcFile_h - $height) / 2;
		}else if($w_pos==6){ //下中
			$wX = ($srcFile_w - $width) / 2;
			$wY = $srcFile_h - $height - 5;
		}else if($w_pos==7){ //右上
			$wX = $srcFile_w - $width - 5;
			if($ifttf==1) $wY = $height + 5;
			else $wY = 5;
		}else if($w_pos==8){ //右中
			$wX = $srcFile_w - $width - 5;
			$wY = ($srcFile_h - $height) / 2;
		}else if($w_pos==9){ //右下
			$wX = $srcFile_w - $width - 5;
			$wY = $srcFile_h - $height - 5;
		}else{ //中
			$wX = ($srcFile_w - $width) / 2;
			$wY = ($srcFile_h - $height) / 2;
		}
		//写入水印
		imagealphablending($srcFile_img, true);
		if($ifWaterImage){
			imagecopymerge($srcFile_img, $water_img, $wX, $wY, 0, 0, $width,$height,$w_pct);
		}else{
			if(!empty($w_color) && (strlen($w_color)==7)){
				$R = hexdec(substr($w_color,1,2));
				$G = hexdec(substr($w_color,3,2));
				$B = hexdec(substr($w_color,5));
			}else{
				return;
			}
			if($ifttf==1) imagettftext($srcFile_img, $w_font, 0, $wX, $wY, imagecolorallocate($srcFile_img,$R,$G,$B), $font_type, $w_text);
			else imagestring($srcFile_img,$w_font,$wX,$wY,$w_text,imagecolorallocate($srcFile_img,$R,$G,$B));
		}
		//保存结果
		switch($srcInfo[2]){
			case 1 :
				if(function_exists("imagegif")) imagegif($srcFile_img,$srcFile);
				break;
			case 2 :
				if(function_exists("imagejpeg")) imagejpeg($srcFile_img,$srcFile);
				break;
			case 3 :
				if(function_exists("imagepng")) imagepng($srcFile_img,$srcFile);
				break;
			case 6 :
				if(function_exists("imagewbmp")) imagewbmp($srcFile_img,$srcFile);
				break;
			default :
				return;
		}
		if(isset($water_info)) unset($water_info);
		if(isset($water_img)) imagedestroy($water_img);
		unset($srcInfo);
		imagedestroy($srcFile_img);
	}

	//图片缩略图自动生成
	function ImageResize($srcFile,$toW,$toH,$toFile="")
	{
		if($toFile==""){ $toFile = $srcFile; }
		$info = "";
		$srcInfo = GetImageSize($srcFile,$info);

		switch ($srcInfo[2])
		{
			case 1:
				if(!$this->cfg_photo_type['gif']) return false;
				$im = imagecreatefromgif($srcFile);
				break;
			case 2:

				if(!$this->cfg_photo_type['jpeg']) return false;
				$im = imagecreatefromjpeg($srcFile);
				break;
			case 3:
				if(!$this->cfg_photo_type['png']) return false;
				$im = imagecreatefrompng($srcFile);
				break;
			case 6:
				if(!$this->cfg_photo_type['wbmp']) return false;
				$im = imagecreatefromwbmp($srcFile);
				break;
		}

		$srcW=ImageSX($im);
		$srcH=ImageSY($im);
		$toWH=$toW/$toH;
		$srcWH=$srcW/$srcH;

		if($toWH<=$srcWH){
			$ftoW=$toW;
			$ftoH=$ftoW*($srcH/$srcW);
		}
		else{
			$ftoH=$toH;
			$ftoW=$ftoH*($srcW/$srcH);
		}

		if($srcW>$toW||$srcH>$toH)
		{
			if(function_exists("imagecreatetruecolor")){
				$ni = imagecreatetruecolor($ftoW,$ftoH);
				if($ni) imagecopyresampled($ni,$im,0,0,0,0,$ftoW,$ftoH,$srcW,$srcH);
				else{
					$ni=imagecreate($ftoW,$ftoH);
					imagecopyresized($ni,$im,0,0,0,0,$ftoW,$ftoH,$srcW,$srcH);
				}
			}else{
				$ni=imagecreate($ftoW,$ftoH);
				imagecopyresized($ni,$im,0,0,0,0,$ftoW,$ftoH,$srcW,$srcH);
			}

			switch ($srcInfo[2])
			{
					
				case 1:
					imagegif($ni,$toFile);
					break;
				case 2:
					imagejpeg($ni,$toFile,$this->cfg_jpeg_query);
					break;
				case 3:
					imagepng($ni,$toFile);
					break;
				case 6:
					imagebmp($ni,$toFile);
					break;
				default:
					return false;
			}
			imagedestroy($ni);
		}else{
			copy($srcFile,$toFile);
		}
		imagedestroy($im);
		return true;
	}

	//获取一个远程图片,返回的是文件路径
	//$remote_imgurl是远程url地址，必须由http://开头
	//$saved_dir是相对系统base_url()的目录路径。
	//返回一个相对base_url()的文件路径
	function  get_content_url($remote_imgurl,$saved_dir) {
		
		if(!preg_match("/base_url()/",$remote_imgurl)){  //如果是本站图片，就不获取了。
			
			$img_dir = $saved_dir.strftime("%y%m",time()); 			
			
			if(!is_dir($img_dir))  @mkdir($img_dir);
				
			$file_name = date('dHis',time()).mt_rand(100, 999);
			$file_suffix=explode(".",basename($remote_imgurl));
				
			$file_suffix[1]=strtolower($file_suffix[1]);
			$sparr = Array("jpeg","jpg","gif","png","bmp");
				
			if(!in_array($file_suffix[1],$sparr))  return ""; //安全检查
				
			$file_name =$file_name.".".$file_suffix[1];				

			$imgfile=file_get_contents($remote_imgurl);
			
			if($imgfile) {
				$imgname = $img_dir."/".$file_name;
				$fp=@fopen($imgname, "a");
				fwrite($fp,$imgfile);
				fclose($fp);
			}
			else $imgname='';
			
		}
		else {
		    $imgname=str_replace(base_url(), '', $remote_imgurl); 
		}
		return $imgname;
	}
}