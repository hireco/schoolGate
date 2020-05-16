<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Show_dialog extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->model('functions');
		
		if(!IS_AJAX)  $this->functions->show_msg();
	}

	public function index(){
		$dialog_view=$this->input->post('dialog_view');
		
		$data=array(
		'object'     => $this->input->post('object'),
		'main_infor' => $this->input->post('main_infor'),
		'action'     => $this->input->post('action'),
		'infor_type' => $this->input->post('infor_type')
		);
		
		$action_view=$this->load->view('ajax/'.$dialog_view,$data,TRUE);
		
		$data=array(
		'action_view' => $action_view,
		'action'      => $this->input->post('action'),
		'title'       => $this->input->post('title'),
		'browser'     => $this->input->post('browser'),
		'submit'      => $this->input->post('submit')
		);
		
		echo json_encode(array(
          'result' => '1',
          'infor'  => $this->load->view('ajax/show_dialog',$data,TRUE)
		));
	}
}

/* End of file show_dialog.php */
/* Location: ./application/controllers/pannel/show_dialog.php */