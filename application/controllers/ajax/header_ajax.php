<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Header_ajax extends CI_Controller {

	function __construct(){
		parent::__construct();
		$this->load->model('myquery');
    	$this->load->model('cms_function');
    	$this->load->model('functions');
		$this->load->model('str_func');

		if(!IS_AJAX)  $this->functions->show_msg();
	}

    function leftMenu() {
    	echo $this->my_load->view('header','',TRUE);
    }

	function boxMenu() {

		if($this->myconfig->item('navigation') && $this->navi_model->has_navi('mb-main'))
	       $top_navi_list = $this->myquery->navi_list('mb-main',12);
        else
	       $top_navi_list = $this->myquery->navi_list('default');

		$color=array(
			 array('gold','glyphicon-bell')
			,array('chocolate', 'glyphicon-user')
			,array('green' ,'glyphicon-scale')
			,array('blue','glyphicon-list')
			,array('red','glyphicon-flag')
			,array('darkviolet','glyphicon-education')
			,array('orange','glyphicon-fire')
			,array('seagreen','glyphicon-search')
			,array('deeppink','glyphicon-list-alt')
			,array('mediumorchid','glyphicon-tasks')
			,array('olivedrab','glyphicon-modal-window')
			,array('salmon','glyphicon-tree-conifer')
		);

		array_push($top_navi_list,
		   array('navi_url' => site_url('guestbook'),'navi_title' =>'我要留言' )
		  ,array('navi_url' => site_url('user'),'navi_title' =>'用户中心','logged' => true )
		  ,array('navi_url' => site_url('logout'),'navi_title' =>'注销登录','logged' => true )
		  ,array('navi_url' => site_url('login'),'navi_title' =>'用户登录','logged' => false)
		  ,array('navi_url' => site_url('register'),'navi_title' =>'我要注册','logged' => false )
		);

		array_push($color,
		     array('darkgoldenrod','glyphicon-pencil')
			,array('plum','glyphicon-dashboard')
			,array('mediumturquoise','glyphicon-log-out')
			,array('plum','glyphicon-log-in')
			,array('mediumturquoise','glyphicon-registration-mark')
		);

		foreach($top_navi_list as $index => $value) {
			echo '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-8 ';
			if(isset($value['logged'])) {
				if($value['logged']) echo 'logged_state collapse';
				else echo 'unlogged_state';
			}
			echo '">';
		    echo '<div class="box_linker" style="background-color:'.$color[$index][0].'">';
		    echo '<a href="'.$value['navi_url'].'">';
			echo '<h1><span class="glyphicon '.$color[$index][1].'"></span></h1>';
			echo '<h5>'.$value['navi_title'].'</h5>';
		    echo '</a>';
			echo '</div>';
            echo '</div>';
		}
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
