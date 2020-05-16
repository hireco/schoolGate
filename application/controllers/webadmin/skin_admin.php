<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Skin_admin extends CI_Controller {
	
	function __construct(){
		parent::__construct();	
		$this->load->helper('array');
		$this->load->library('Common');
		$this->load->model('str_func');
		$this->load->library('my_file');
		$this->load->library('my_minify');
		
		$this->check->check_admin_logged();
		if($this->uri->segment(3) && !IS_AJAX) show_404();
	}

	public function index(){
		$data['mylist']=array('edit','delete');
		$data['mymenu']=$this->load->view('pannel/context_menu',$data,TRUE);
		$data['workplace_view']=$this->load->view('admin/skin_admin', 
		array(
		'clist'  => $this->clist(),
		'action' => 'index'
		),
		TRUE);
		$data['workplace_view'].=$data['mymenu'];

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));
		$data['jsmin']=$this->minify->js_mini(array(
		'js/jquery.contextmenu.r2.js',
		'js/jquery.jsort.js',
		'js/pagination/jquery.pagination.js',
		'js/admin/myjquery-skinadmin.js'
		));
		
		$data['cssmin']=$this->minify->css_mini('js/swfupload/swfupload.css');
		
		$this->load->view('admin/index',$data);
	}
    
	public function clist($action='') {
	    
		$filetype=$this->input->post('filetype');
		$subdir=$this->input->post('subdir');
		
		$template_dir=$this->myconfig->get_template('template_path');
		$template_dir=substr($template_dir,0,strlen($template_dir)-1);
		
		switch($filetype) {
			case "css":
				$dir=$this->myconfig->get_template('skin_dir').'/css';
				break;
				
            case "image":
				$dir=$this->myconfig->get_template('skin_dir').'/images';
				break;
				
			case "template":
			    $dir='application/views/'.$template_dir;
				break;

			case "js":
				$dir=$this->myconfig->get_template('js_dir');
				break;
				
			default:
				$dir=$this->myconfig->get_template('skin_dir').'/css';
				break;	
		}
		
		$dir=$subdir?($dir.'/'.$subdir):$dir;		
		$this->load->helper('file');
		$files=get_dir_file_info($dir);

		$data=$this->load->view('admin/skin_admin',
		array(
			'action'  => 'clist',
		    'files'   => $files,
		    'dir'     => $dir
		),TRUE);

		if($action=='ajax') echo $data;
		else return $data;
	}
    
	public function edit_file($submit=0) {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		$file=$this->input->post('file');
		$path=$this->input->post('path');
		$subdir=$this->input->post('subdir');		
		
		$template_dir=$this->myconfig->get_template('template_path');
		$template_dir=substr($template_dir,0,strlen($template_dir)-1);
		
		$file_types=array(
		  $this->myconfig->get_template('skin_dir').'/css',
		  'application/views/'.$template_dir,
		  $this->myconfig->get_template('js_dir')
		);	
		
		$top_dir=$subdir?str_replace('/'.$subdir, '', $path):$path;
		
		if(!in_array($top_dir, $file_types)) 
		return $this->echo_infor('对不起，操作非法！');

		if(!is_file($path.'/'.$file)) 
		return $this->echo_infor('对不起，对象不存在！');  
		
		if(!in_array($this->my_file->file_extend($file),array('js','css','php','txt','html','htm','xml')))
		return $this->echo_infor('对不起，对象不可编辑！');  
		
		if($submit==0){
			$tmp_data['file']=$file;
			$tmp_data['path']=$path;
			$tmp_data['filename']=$path.'/'.$file;
			$tmp_data['file_content']=file_get_contents($path.'/'.$file);
			$tmp_data['action']='edit_file';
			return $this->echo_infor($this->load->view('admin/skin_admin',$tmp_data,TRUE),'1'); 
		}
		else {
			if(!$this->input->post('file_submit')) 
				return $this->echo_infor('操作非法！');
		    
			$filename=$this->input->post('to_path').'/'.$this->input->post('filename');
			$file_content=$this->str_func->utf8_unescape($this->input->post('file_content'));
			$file_content=$this->str_func->multi_replace($this->str_func->special_chars,$file_content);
			
			$fp=fopen($filename, 'wb');
			$result=fwrite($fp, $file_content);
			fclose($fp);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}

	function add_file($submit=0) {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if($submit==0) {
			$type=$this->input->post('type');
			$tmp_data['path'] = $this->input->post('path');
			$tmp_data['action']=$type!='image'?'edit_file':'upload_file';
			return $this->echo_infor($this->load->view('admin/skin_admin',$tmp_data,TRUE),'1'); 
		}
		else {
			if(!$this->input->post('file_submit')) 
				return $this->echo_infor('操作非法！');
		    
			if(!in_array($this->my_file->file_extend($this->input->post('filename')),array('js','css','php','txt','html','htm','xml')))
			return $this->echo_infor('对不起，您的文件类型不符合要求！'); 	
				
			$filename=$this->input->post('to_path').'/'.$this->input->post('filename');
			$file_content=$this->str_func->utf8_unescape($this->input->post('file_content'));	
		    $file_content=$this->str_func->multi_replace($this->str_func->special_chars,$file_content);

			if(is_file($filename) && !$this->input->post('overwrite')) 
			return $this->echo_infor('对不起，对象已经存在！');  				

			$fp=fopen($filename, 'wb');
			$result=fwrite($fp, $file_content);
			fclose($fp);
			
			if($result)  return $this->echo_infor('恭喜，编辑成功！','1');	
			else return $this->echo_infor('编辑失败，请重来！');
		}
	}
	
	function select_skin($submit=0) {
		if($submit==0) {
			$data['action']='select_skin';
			return $this->load->view('admin/skin_admin',$data);
		}
		else {
			
			$this->check->check_admin_right(__CLASS__,__FUNCTION__);
			
			if(!$this->input->post('skin_submit')) 
				return $this->echo_infor('操作非法！');
		    
		    $skin_id=$this->input->post('skin_id');
		    
			$this->db->where('is_mobile',0);
		    $this->db->update('sys_skin',array('selected' => '0'));
		    
		    $this->db->where(array('skin_id' => $skin_id));
		    $result=$this->db->update('sys_skin',array('selected' => '1'));
		    
			if($result)  return $this->echo_infor('成功设置风格','1');	
			else return $this->echo_infor('操作失败，请重来！');
		}
	}
	
	function delete_file() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if(!$this->input->post('ajax') || !$this->input->post('path') || !$this->input->post('file'))
		return $this->echo_infor('操作非法！');
		
		$file=$this->input->post('file');
		$path=$this->input->post('path');
        $id=$this->input->post('id');
        $subdir=$this->input->post('subdir');
        
        $template_dir=$this->myconfig->get_template('template_path');
		$template_dir=substr($template_dir,0,strlen($template_dir)-1);
		
		$file_types=array(
		  $this->myconfig->get_template('skin_dir').'/css',
		  $this->myconfig->get_template('skin_dir').'/images',
		  'application/views/'.$template_dir,
		  $this->myconfig->get_template('js_dir')
		);	
		
		$top_dir=$subdir?str_replace('/'.$subdir, '', $path):$path;
		
		if(!in_array($top_dir, $file_types)) 
		return $this->echo_infor('对不起，操作非法！');
		
		$result=@unlink($path.'/'.$file);
		if($result)  return $this->echo_infor('成功删除文件！','1','',$id);
		else return $this->echo_infor('删除失败，请重来！');
	}
	
	function check_if_existing() {
		$filename=$this->input->post('filename');
		$path=$this->input->post('path');
		if(is_file($path.'/'.$filename)) echo 'existing';
		else return TRUE;
	}
	
    private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result, 
		 'url'    => !$url?($result=='0'?'':'reload'):$url,
		 'id'     => $id
		 );

		echo json_encode($data);
	 }
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
