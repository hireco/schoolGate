<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Myplayer extends CI_Model {
	
	var $setting=array(
	  'm' => '1',    //代码模式
	  'v' => '',     //媒体地址
	  'w' => '216',  //显示宽度
	  'h' => '138',  //显示高度
	  'p' => 1,      //自动播放
	  'l' => 1       //自动引导
	);
	
	function __construct(){
		parent::__construct();
		$this->load->library('common');
		$this->load->model('functions');
	}

	private function flv_basic($setting)	{
		$setting['v']=$this->common->myurlcode($setting['v'],'DECODE');
		$setting['p']=$setting['p']?'true':'false';
		$setting['l']=$setting['l']?'true':'false';
		
		return '<object type="application/x-shockwave-flash" data="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$setting['v'].'</source><duration></duration><title></title><link></link></item></channel></vcastr>" width="'.$setting['w'].'" height="'.$setting['h'].'" id="vcastr3"><param name="movie" value="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$setting['v'].'</source><duration></duration><title></title><link></link></item></channel><config><isLoadBegin>'.$setting['l'].'</isLoadBegin><isAutoPlay>'.$setting['p'].'</isAutoPlay></config></vcastr>" /><param name="allowFullScreen" value="false" /></object>';
	}
	
	public function get_script($format,$setting) {
		
		$this->set_array($setting);
		
		$format=$format.'_basic';
		if(!method_exists($this,$format)) show_404('访问非法！');
		$basic=$this->$format($this->setting);
		
		switch ($this->setting['m']) {
			case '1'   :
			return $basic;
			break;
			
			case '2' :
			return 'var playstr=\''.$basic.'\';';
			break;
			
			case '3' :
			return 'document.write(\''.$basic.'\');';
			break;
			
			default:
			return $basic;
			break;
		}
	}
	
	private function set_array($array) {
		foreach($this->setting as $index => $value) 
		  $settings[]=$index;
		foreach($array as $index => $value) 
		  $this->setting[$settings[$index]]=$value;  
	} 
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
