<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class People_ajax extends CI_Controller {
	
	var $valid_formats;
		
	function __construct(){
		parent::__construct();
		$this->load->model('functions');
		$this->valid_formats=explode(',',$this->myconfig->item('user_filetypes'));		
	}
    
	function add_editor_link() {
		
		$people_id = $this->input->post('people_id');
		
		$this->db->where('people_id',$people_id);
	    $query=$this->db->get('add_people');
		$row=$query->row_array();
		
		if($this->check->user_is_logged() && $this->session->userdata('user_name')==$row['user_name']) {
			$data['viewer']='linker';
			$data['html_dir']=$row['html_dir'];
			echo $this->my_load->view('people_edit',$data,TRUE);
		}
	}
	
	function get_pinyin_name() {
	    
		$this->load->helper('pinyin');
		$cn_name=$this->input->post('cn_name');	
		$en_name=explode('_',GetPinyin($cn_name));
		$str='';

		foreach($en_name as $index => $value) {
			if($index > 1) $str.=$value;
		    else $str.=' '.ucfirst($value);
		}

		echo trim($str);

	}

	function chk_html_dir() {
		if(!IS_AJAX)  $this->functions->show_msg();
		
		$html_dir=$this->input->post('html_dir');		
		if(!ereg("^[a-z_][a-z0-9_]+$", $html_dir))  
		 return $this->echo_infor('至少两个字符，以字母开头，只包含字母、数字和下划线，字母限小写');
		else if(strlen($html_dir)>15) 
		 return $this->echo_infor('长度不超过15');
		else if(is_dir('public_html/'.$html_dir)) 
		 return $this->echo_infor('该目录已经存在！');
		else 
		 return $this->echo_infor('目录名正确!','1');
	}
	
	public function upload_zip(){
        
		if (isset($_POST["PHPSESSID"])) {
			session_id($_POST["PHPSESSID"]);
		}
		session_start();
		
		$this->load->library('zip_class');
		$this->load->library('my_file');		
		
		$dir = 'public_html/'.$this->input->post('dir_to');
		if(!is_dir($dir) || !$this->input->post('dir_to')) {
			echo "ERROR:目标目录不存在！请先设置目录！";
			exit(0);
		}
		
		if(!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {
			echo "ERROR:错误的上传文件";
			exit(0);
		}
		
		$name = $_FILES["Filedata"]["name"];
		$tmp = $_FILES["Filedata"]["tmp_name"];
			
		$result=$this->zip_class->ExtractAll($tmp,$dir);
		if($result==-1)  {
			echo 'ERROR:文件'.$name.'错误';
			exit(0);
		}

		$files=array();

		foreach($this->zip_class->files_list as $index => $value){
			$ext=$this->file_extend($value);
			if(!in_array($ext,$this->valid_formats)) {
				@unlink($value);
				$this->zip_class->total_files--;
			}
		}

		if(!$this->zip_class->total_files) 
			echo 'ERROR:ZIP文件解压后未发现合法文件';
	    else 
			echo 'SUCCESS:成功上传文件并加压到目录！';
			
        exit(0);
		
	}

	private function file_extend($filename) {
		$extend =explode(".",$filename);
		$va=count($extend)-1;
		return $extend[$va];
	}
	
	private function echo_infor($infor,$result='0') {
		$data=array(
			 'infor'  => $infor,
			 'result' => $result
		);

		echo json_encode($data);
	}
}

/* End of file show_dialog.php */
/* Location: ./application/controllers/pannel/show_dialog.php */