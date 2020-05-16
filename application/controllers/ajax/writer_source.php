<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Writer_source extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
		
	}

	public function slist($from='source'){
		$select_item=$this->input->post('select_item');
		$string=$this->myconfig->item($from);
		if($string) {
			$string=explode(',',$string);
			$output='<ul id="'.$from.'_list">';
			foreach($string as $index => $value) {
				$output.='<li style="font-size:12px; margin-bottom:4px;"><span';
				if($select_item==$value) $output.=' class="selected" ';
				$output.='>'.$value.'</span></li>';
			}
			echo $output.'</ul>';
		}
		
		else echo '<ul><li>当前没有设置选项，请设置</li></ul>';
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */