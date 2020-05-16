<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Upload_crop extends CI_Model{

	private $defaults=array(
		  'action'         => 'upload_and_crop', // 操作类型，有四种选择					 
		  'upload_action'  => '',    //upload action target
		  'crop_action'    => '',    //crop action target
	      'thumb_action'   => '',    //thumb action target
		  'clear_action'   => '',	 //clear action target	       
   	      'valid_formats'  => array("jpg", "png", "gif", "bmp","jpeg"),	 
	      'show_preview'   => '1',   //是否显示上传图片
	      'preview'        => 'skin/admin/images/preview.jpg', //例图
	      't_width'        => 120,
	      't_height'       => 120,
	      't_prefix'       => 't_',
	      'auto_thumb'     => '1',     //在纯粹upload的操作类型下，是否也自动产生缩略图
	      'upload_zip'     => '0',     //在纯粹upload下，上传的文件是否是zip格式。
	      'crop_for'       => 'thumb', //在纯粹crop下，裁剪保存为缩略图还是大图,thumb为缩略图,crop为大图
	      'crop_new'       => '0',     //在纯粹crop下，裁剪的图片是否重新命名,'1'为重命名，'0'用原名
	      'path'           => 'upload/',
		  'replace'        => '1',     //同一个上传界面下，反复上传的保留条件
	      'reserve'        => '0',     //反复打开上传界面，上次上传的保留条件  
		  'sendback'	   => '',      //上传结果回填表单ID
	      'refresh'        => ''       //在纯粹crop下，裁剪完成后，更新裁剪图片的ID
	);
	//default settings

	private $setting=array(); //real settings for action
	private $params=array(
			  'action','upload_action','crop_action','thumb_action','clear_action',
			  'preview','show_preview','t_width','t_height','auto_thumb',
			  'upload_zip','crop_for','crop_new','path','replace','reserve',
			  'sendback','refresh'); //list of setting items which can be reset

	private $dir_available='upload';
	private $action_available=array(
			  'upload',           //只是上传图片，不保留缩略图，但是可以选择是否自动产生。
			  'crop',			  //对服务器上已有图片进行手动缩略
			  'upload_for_crop',  //上传图片获取，手动获取缩略图后，删除原图
			  'upload_and_crop'	  //既保留大图，也保留手动获取的小图
	);

	function __construct(){
		parent::__construct();
		$this->load->library('Common');
		$this->load->library('My_array');
		$this->load->helper('array');
		$this->load->library('My_image');
		$this->load->library('my_file');

		$this->setting = common::getInstanceOf('my_array');
		$this->setting->set($this->defaults); //do initial setting
		$this->setting->set(array('t_prefix' => $this->config->item('thumb_prefix')));
		//thumb prefix should be the same as config value.
	}


	public function viewer($post) {

		$this->my_setting($post);  //对upload_crop模块进行参数设置
		if(!$this->check_params()) {
			show_404();
			exit;
		} //检查配置参数是否合法

		foreach($this->defaults as $index => $value) {
			$data[$index]=$this->setting->$index;
		}
		$data=json_encode($data);
		$this->session->set_userdata('forajax',$data);	//保存对模块的设置，已备后用。

		if(!is_file($this->setting->preview))  {
			echo json_encode(array(
				'infor'      => '该图片不存在！',
				'result'     => '0'
			));
			return false;
		}

		list($imageWidth, $imageHeight, $imageType) = getimagesize($this->setting->preview);

		$data=array(
		      'action'        => $this->setting->action,
			  'upload_action' => $this->setting->upload_action,
			  'crop_action'	  => $this->setting->crop_action,
		      'thumb_action'  => $this->setting->thumb_action,
			  'clear_action'  => $this->setting->clear_action,
		      't_width'       => $this->setting->t_width,
		      't_height'      => $this->setting->t_height,
		      'imageWidth'    => $imageWidth,
		      'imageHeight'   => $imageHeight,
		      'auto_thumb'    => $this->setting->auto_thumb,
		      'upload_zip'    => $this->setting->upload_zip,
		      'crop_for'      => $this->setting->crop_for,
		      'crop_new'      => $this->setting->crop_new, 
		      'path'          => str_replace("http://".$_SERVER["HTTP_HOST"], '', base_url().$this->setting->path),	 
		      'image'	      => $this->setting->preview.'?'.rand(1,999),
		      'image_name'    => $this->setting->preview,
		      'show_preview'  => $this->setting->show_preview,
		      'reserve'       => $this->setting->reserve,
			  'sendback'	  => $this->setting->sendback,
		      'refresh'       => $this->setting->refresh
		);

		$this->load->view('ajax/upload_crop',$data);
	}

	public function upload_zip($tmp,$name,$dir){

		$this->load->library('zip_class');
		!is_dir($dir)?$this->my_file->mk_mydir($dir):'';

		if(!preg_match('/\.zip$/mis',$name))
		return $this->echo_infor('选择的文件不是 ZIP文件');
			
		$result=$this->zip_class->Extract($tmp,$dir);
		if($result==-1)  return $this->echo_infor('文件'.$name.'错误');

		$photos=array();

		foreach($this->zip_class->files_list as $index => $value){
			$ext=$this->file_extend($value);
			$new_name = time().'_'.rand(100,999).'.'.$ext;
			if(!in_array(strtolower($ext),$this->setting->valid_formats)) {
				@unlink($value);
				$this->zip_class->total_files--;
			}
			else {
				@rename($value,$dir.$new_name);
				$photos[]=$dir.$new_name;
			}
		}

		if(!$this->zip_class->total_files) return $this->echo_infor('解压文件中没有图片文件！');

		$thumbnails='';
		if($this->setting->auto_thumb=='1'&& $this->setting->action=='upload') {
			$thumbnails=array();
			foreach ($photos as $index => $value) {
				$result=$this->my_image->ImageResize($value,$this->setting->t_width,$this->setting->t_height,$dir.$this->setting->t_prefix.basename($value));
				if($result) $thumbnails[$index]=$this->setting->t_prefix.basename($value);
			}
		}
		
		foreach ($photos as $index => $value) 
		   $photos[$index]=str_replace($dir, '', $value);
		
		$data=array(
		'photos'     => implode(':', $photos),	//filename of photo
		'thumbnails' => implode(':', $thumbnails), //filename of thumbnail
		'infor'      => '上传解压完成,共获取'.$this->zip_class->total_files.'个文件',
		'result'     => '1'
		);

		echo json_encode($data);

	}

	public function upload() {

		if($data=$this->session->userdata('forajax')) {
			$data=json_decode($data);
			$this->setting->set($data);
		}

		$imageWidth =$this->setting->imageWidth;
		$imageHeight=$this->setting->imageHeight;
		$path = $this->setting->path;
		$valid_formats = $this->setting->valid_formats;
		$image_name=$this->setting->image_name;
			
		if(!isset($_FILES['photoimg']))
		return $this->echo_infor('操作非法！');
			
		$name = $_FILES['photoimg']['name'];
		$tmp = $_FILES['photoimg']['tmp_name'];
		$size = $_FILES['photoimg']['size'];
		
		if(!strlen($name)) return $this->echo_infor('请选择目标文件');
				
		if($this->setting->upload_zip=='1' && $this->setting->action=='upload')  
		    $this->upload_zip($tmp,$name,$path);
		
		else {

			$ext=$this->file_extend($name);
			if(!in_array(strtolower($ext),$valid_formats) || $size>(768*1024))
			return $this->echo_infor('图片尺寸过大，或图片格式不符合要求');
				
			$image_name = time().'_'.rand(100,999).'.'.$ext;
				
			!is_dir($path)?$this->my_file->mk_mydir($path):'';
				
			if(!move_uploaded_file($tmp, $path.$image_name))
			return $this->echo_infor('操作失败，请稍候重试');
				
			list($imageWidth, $imageHeight, $imageType) = getimagesize($path.$image_name);
				
			$simage_name='';
			if($this->setting->auto_thumb=='1'&& $this->setting->action=='upload') {
				$result=$this->my_image->ImageResize($path.$image_name,$this->setting->t_width,$this->setting->t_height,$path.$this->setting->t_prefix.$image_name);
				if($result) $simage_name=$this->setting->t_prefix.$image_name;
			}//在纯upload的情况下，也可以自动产生缩略图。

			if($this->myconfig->item('add_watermark')=='1' && $this->setting->action!='upload_for_crop') $this->my_image->WaterImg($path.$image_name, 'down');
			
			$data=array(
		     'image'       => base_url().$path.$image_name, //url address	     
		     'image_name'  => $image_name,	//filename of photo
		  	 'simage_name' => $simage_name, //filename of thumbnail
			 'imageWidth'  => $imageWidth,
		     'imageHeight' => $imageHeight,
		     'infor'  => '图片上传成功',
		     'result' => '1'
		     );

		     echo json_encode($data);
		}
	}
    
	public function save_area($todo='crop') {
		
		if(!in_array($todo, array('crop','thumb'))) 
		   return $this->echo_infor('操作非法！');
		
		if($this->setting->action=='crop') $crop_new=$this->input->post('crop_new');
		else $crop_new='0';
		
		if($data=$this->session->userdata('forajax')) {
			$data=json_decode($data);
			$this->setting->set($data);
		}
		
		$path=$this->setting->path;
		$t_width  = $this->setting->t_width;
		$t_height = $this->setting->t_height;

		$data=array('t','img','w','h','x1','y1');
		$data=elements($data, $_POST,NULL);
        
		if(common::has_null_element($data))
		return $this->echo_infor('操作非法！');
			
		extract($data);
		
		if($todo=='thumb') {
			if($crop_new!='1') $new_name = $this->setting->t_prefix.$img;
			else $new_name = $this->setting->t_prefix.time().'_'.rand(100,999).'.'.$this->file_extend($img);
		}
        else if($todo=='crop') {
        	if($crop_new!='1') $new_name = $img;
        	else $new_name = time().'_'.rand(100,999).'.'.$this->file_extend($img);
        }
		
		if(!is_file($path.$img))
		return $this->echo_infor('对象不存在！');
			
		list($imagewidth, $imageheight, $imageType) = @getimagesize($path.$img);
		$imageType = @image_type_to_mime_type($imageType);
			
		$ratio = ($t_width/$w);
		$nw = ceil($w * $ratio);
		$nh = ceil($h * $ratio);
		$nimg = @imagecreatetruecolor($nw,$nh);

		switch($imageType) {
			case "image/gif":
				$im_src=@imagecreatefromgif($path.$img);
				break;

			case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
				$im_src=@imagecreatefromjpeg($path.$img);
				break;

			case "image/png":
			case "image/x-png":
				$im_src=@imagecreatefrompng($path.$img);
				break;
		}

		@imagecopyresampled($nimg,$im_src,0,0,$x1,$y1,$nw,$nh,$w,$h);

		switch($imageType) {
			case "image/gif":
				$result=@imagegif($nimg,$path.$new_name);
				break;

			case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
				$result=@imagejpeg($nimg,$path.$new_name,90);
				break;

			case "image/png":
			case "image/x-png":
				$result=@imagepng($nimg,$path.$new_name);
				break;
		}
			
		if($result) {
			$image=array(
				'simage'      => base_url().$path.$new_name.'?'.rand(1,999),
				'simage_name' => $new_name      	
			);
			$infor=$todo=='thumb'?'成功保存缩略图':'成功保存裁剪的图片';
			return $this->echo_infor($infor,'1',$image);
		}
		else return $this->echo_infor('对不起，操作失败！');
	}
	
	public function thumb() {
		$this->save_area('thumb');
	}
	
	public function crop() {        
        $this->save_area('crop');
	}

	public function clear() {
			
		if($data=$this->session->userdata('forajax')) {
			$data=json_decode($data);
			$this->setting->set($data);
		}
			
		$data=array('old_images','photos','thumbnails');
		$data=elements($data, $_POST,NULL);

		if(!$data['photos'] && !$data['thumbnails'])
		return $this->echo_infor('没有任何图片');

		$old_images=str_replace('::',':',$data['old_images']);
		$old_images=explode(':',$old_images);

		$photos=explode(':',$data['photos']);
		$thumbnails=explode(':',$data['thumbnails']);

		$infor='成功处理图片';
		$result='1';

		switch($this->setting->action) {
			case "upload_for_crop":
				foreach($photos as $index => $value)
				@unlink($this->setting->path.$value); //删除原图
					
				if($this->setting->replace=='1')
				$thumbnails=array($this->keep_last($thumbnails,$this->setting->path));
					
				$files_list=array('photos' => '','thumbnails' => implode(':',$thumbnails));
				if(!$files_list['thumbnails'])  {
					$infor='没有缩略图生成';
					$result='0';
				}
				break;

			case "upload_and_crop":
				$files_list=$this->check_couples($photos,$thumbnails,$this->setting->path);
				if(!$files_list['photos'] || !$files_list['thumbnails'])  {
					$infor='没有上传图片以及缩略图';
					$result='0';
				}
				break;

			case "upload":
				if($this->setting->replace=='1')
				$photos=array($this->keep_last($photos,$this->setting->path));
					
				if($this->setting->auto_thumb=='1')
				$files_list=array('photos' => implode(':', $photos), 'thumbnails' => implode(':',$thumbnails));
				else
				$files_list=array('photos' => implode(':', $photos), 'thumbnails' => '');

				if(!$files_list['photos'])  {
					$infor='没有上传图片';
					$result='0';
				}
				break;

			case "crop":
				if($this->setting->replace=='1')
				$thumbnails=array($this->keep_last($thumbnails,$this->setting->path));

				$files_list=array('photos' => '','thumbnails' => implode(':',$thumbnails));
				if(!$files_list['thumbnails'])  {
					$infor='没有生成缩略图';
					$result='0';
				}
				break;
		}
			
		if($result=='1')  $this->delete_olds($old_images,$this->setting->path);
			
		return $this->echo_infor($infor,$result,$files_list);
	}

	private function delete_olds($files,$path) {
		foreach($files as $index => $value) {
			if(@is_file($path.$value))
			@unlink($path.$value);
		}
	}

	private function keep_last($files,$path) {
		if(count($files)) {
			$file=$files[count($files)-1];
			foreach($files as $index => $value) {
				if($value!=$file) @unlink($path.$value);
			}
			return $file;
		}
		return '';
	}

	private function check_couples($photos,$thumbnails,$path){

		$photos_list=array();
		$thumbnails_list=array();

		foreach($photos as $index => $value) {
			if(array_search($this->setting->t_prefix.$value,$thumbnails)===FALSE)
			@unlink($path.$value);
			else $photos_list[]=$value;
		}
		foreach($thumbnails as $index => $value) {
			if(array_search(str_replace($this->setting->t_prefix,'',$value),$photos)===FALSE)
			@unlink($path.$value);
			else $thumbnails_list[]=$value;
		}
			
		if($this->setting->replace=='1') {
			$photos_list=array($this->keep_last($photos_list,$this->setting->path));
			$thumbnails_list=array($this->keep_last($thumbnails_list,$this->setting->path));
		}
			
		return array(
			     'thumbnails' => implode(':', $thumbnails_list), 
				 'photos'     => implode(':', $photos_list)
		);
	}

	private function my_setting($post) {
		$list=$this->params;              //可允许被设置的项目
		$post=common::deep_trim($post);   //去掉提交字符中的空格
		$data=elements($list, $post,'');  //去掉提交的不安全变量，限定可允许的变量
		$data=common::delete_null($data); //去掉没有被设定(空的)的变量
		$this->setting->set($data);		  //所有不等于空的变量传给setting进行设置，其他的值按照默认设置。
	}

	private function check_params() {
		if(!in_array($this->setting->action,$this->action_available))  return FALSE; 	//检查操作行为类别
			
		$path=explode('/',$this->setting->path);
		if($path[0]!=$this->dir_available) return FALSE;  //检查文件夹位置

		//更多检查待添加...
		return TRUE;
	}

	private function file_extend($filename) {
		$extend =explode(".",$filename);
		$va=count($extend)-1;
		return $extend[$va];
	}

	private function echo_infor($infor,$result='0',$image='') {
		$data=array(
			 'infor'  => $infor,
			 'result' => $result, 
			 'image'  => $image
		);

		echo json_encode($data);
	}

}


/* End of file upload_crop.php */
/* Location: ./application/models/upload_crop.php */
