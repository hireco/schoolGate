<?php
class Minify extends CI_Model
{
	 function __construct() {
		parent::__construct();
		$this->load->library('My_minify');
	}
	
	function js_mini($js_array='',$action=TRUE,$jsfile='',$common='',$jsdir='',$front=FALSE) {
	    if($common) {
	      if(is_array($js_array))
	    	$js_array=array_merge($this->config->item($common),$js_array);
	      else 
            $js_array=$this->config->item($common);
	    }
		
	    if(!$js_array) return FALSE;
	    
        if($action==TRUE) {  
	   	   $prefix=$this->my_minify->file_prefix;
	   	
	       if(!$jsfile) $jsfile=str_replace('/', '_', uri_string()); 
           $jsfile=$jsfile==''?$prefix:$prefix.'_'.$jsfile;  
           return $this->my_minify->js_minify($js_array,$jsfile,$jsdir,$front);
	      }
	    else {
	  	    $str='';
	  	    foreach ($js_array as $index => $value)
	  	    $str.="<script src=\"" . base_url() . $value. "\"></script>\n";
	        return $str;
	    } 
    }
	

	function css_mini($css_array='',$action=TRUE,$cssfile='',$cssdir='',$front=FALSE) {
		if(!is_array($css_array)) 
	   	  return "<link href=\"".base_url().$css_array."\" rel=\"stylesheet\" />\n";
	    elseif(count($css_array)==1) 
	   	  return "<link href=\"".base_url().$css_array[0]."\" rel=\"stylesheet\" />\n";
		else {
		 if($action==TRUE) {		    
		    $prefix=$this->my_minify->file_prefix;
	   
		    if(!$cssfile) $cssfile=str_replace('/', '_', uri_string());
            $cssfile=$cssfile==''?$prefix:$prefix.'_'.$cssfile;  
            return $this->my_minify->css_minify($css_array,$cssfile,$cssdir,$front);
		  }
	    else {
	   	    $str='';
	  	    foreach ($css_array as $index => $value)
	  	    $str.="<link href=\"".base_url().$value."\" rel=\"stylesheet\" />\n";
	        return $str;
	      }
	    } 
	}
}

/* End of file minify.php */
/* Location: ./application/models/minify.php */