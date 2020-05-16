<?php
Class My_load {

	var $css_inc=array();     //引入的css文件
	var $css_ins=array();     //嵌入的css代码

	var $js_inc_t=array();    //头部引入js文件
	var $js_inc_b=array();    //底部引入js文件
	var $js_ins_t=array();    //头部插入js代码
	var $js_ins_b=array();    //底部插入js代码

	var $js_file='';  //合并后的js文件名，按位置加后缀_t或者_b
	var $css_file=''; //合并后的css文件名

	var $file_suffix='_v';
    var $CI;
	
	public function __construct(){
		$this->CI =& get_instance();
		$this->CI->load->model('myconfig');
		$this->CI->load->model('minify');
		
		define('SKIN_NAME', $this->CI->myconfig->get_template('skin_name'));
	}

	function view($template_file,$data='',$flag=FALSE) {
		$template_path=$this->CI->myconfig->get_template('template_path');
		if(!$flag)	$this->CI->load->view($template_path.$template_file,$data);
		else return $this->CI->load->view($template_path.$template_file,$data,TRUE);
	}

	function set_js_file($str) {
		$this->js_file=$str.$this->file_suffix;
	}

	function set_css_file($str) {
		$this->css_file=$str.$this->file_suffix;
	}

	function output_js($t_or_b='t') {
		$js_inc='js_inc_'.$t_or_b;
		$js_ins='js_ins_'.$t_or_b;
		if($this->$js_inc) { 
		   if($this->js_file) {
		   	  echo $this->CI->minify->js_mini($this->$js_inc,TRUE,$this->js_file.'_'.$t_or_b,FALSE,'',TRUE);
		   }
		   else foreach ($this->$js_inc as $index => $value) 
			  echo "<script src=\"".base_url().$value."\" ></script>\n";
		}
				
		foreach ($this->$js_ins as $index => $value) echo $value;
	}
	
	function output_css() {		
		if($this->css_inc) { 
		   if($this->css_file) {
		   	  echo $this->CI->minify->css_mini($this->css_inc,TRUE,$this->css_file,'',TRUE);
		   }
		   else foreach ($this->css_inc as $index => $value) 
			  echo "<link href=\"".base_url().$value."\" rel=\"stylesheet\" />\n";
		}
				
		foreach ($this->css_ins as $index => $value) echo $value;
	}

}
/* End of file My_load.php */
/* Location: ./application/libraries/My_load.php */