<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class File_manager extends CI_Controller {
	var $root='';

	function __construct(){
		parent::__construct();
		$this->load->library('My_file');
		$this->load->helper('text');

		$this->check->check_admin_logged();
		$method=array('','image');
		if(!in_array($this->uri->segment(3),$method) && !IS_AJAX) show_404();
		
		$this->root=$this->config->item('upload_dir');
	}

	public function index($mode='dir',$select=''){
		$data['viewer']='index';
		$data['clist']=$this->clist(FALSE,$mode,$select);
		$data['cur_dir']=$this->root;
		$data['workplace_view']=$this->load->view('admin/file_manager',$data,TRUE);

		$data['js']=array(
		    site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'),
            site_url('js/imagesloaded/imagesloaded.pkgd.min.js')
            //this file can not be merged with other js files,otherwise, it will result in error!
        );
		$data['jsmin']=$this->minify->js_mini(array(
            'js/jquery.contextmenu.r2.js',
            'js/pagination/jquery.pagination.js',
            'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
            'js/swipebox-master/js/jquery.swipebox.min.js',
            'js/masonry/masonry.pkgd.min.js',
            'js/admin/myjquery-filemanager.js'
		),TRUE,'file_manager');

		$data['cssmin']=$this->minify->css_mini(array('js/swfupload/swfupload.css','js/swipebox-master/css/swipebox.min.css'),false);

		$this->load->view('admin/index',$data);
	}

	public function image($select='') {
		$this->index('thumb',$select);
	}

	public function image_browser() {

		$data['clist']=$this->clist(false,'thumb','1');
		$data['cur_dir']=$this->root;

		echo $this->load->view('admin/image_browser',$data,true);

	}

	public function clist($ajax=TRUE,$mode='',$select='') {

		$mode = $mode ? $mode: $this->input->post('mode'); //file & dir list or thumb list only for image file
		$select= $select? $select:$this->input->post('select');  //for selecting action or not

		if(!in_array($mode, array('dir','thumb'))) $mode = 'dir';

		$this->load->helper('file');
		$this->load->helper('directory');

		$dir=$this->input->post('dir');
		$dir=$dir?$dir:$this->root;

		if(is_dir($dir)) $sub_dirs=directory_map($dir,1);
		else $sub_dirs=array();

		$data=array(
			'root' => $this->root,
			'dir'  => $dir,
			'sub_dirs' => $sub_dirs,
			'viewer'   => $mode,
			'select' => $select
		);
		if($ajax) echo $this->load->view('admin/file_manager',$data,TRUE);
		else return $this->load->view('admin/file_manager',$data,TRUE);
	}

	public function file_delete() {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		if($this->input->post('ajax')!='1') return $this->echo_infor('非法操作');
		$filename=$this->input->post('filename');
		$filedir=$this->input->post('filedir');
		$result=@unlink($filedir.'/'.$filename);
		if(!$result)  return $this->echo_infor('删除失败');
		else return $this->echo_infor('成功删除文件','1');
	}

	private function echo_infor($infor,$result='0') {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
