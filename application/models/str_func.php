<?php
class Str_func extends CI_Model
{
	var $special_chars=array(
		'spe_char_at'     => '@',
		'spe_char_star'   => '*',
		'spe_char_splash' => '/', 
		'spe_char_plus'   => '+'
	); //escape对这些字符不转换，导致出错

	function __construct() {
		parent::__construct();
	}

	//兼容php低版本中文截取函数
	function msubstr($str, $start, $len) {
		$tmpstr = "";
		$strlen = $start + $len;
		for($i = 0; $i < $strlen; $i++) {
			if(ord(substr($str, $i, 1)) > 0xa0) {
				$tmpstr .= substr($str, $i, 2);
				$i++;
			} else
			$tmpstr .= substr($str, $i, 1);
		}
		return $tmpstr;
	}

	//中文截取函数
	function cn_substr($str, $len, $start=0) {
		if ( ! function_exists('mb_substr')){
			return  $this->msubstr($str, $start, $len);
		}
		else return mb_substr($str, $start,$len);
	}

	//提取html中的文本内容
	function html2text($str,$r=0) {
		if($r!=0) $str=stripslashes($str);

		$str = preg_replace("/<sty(.*)\\/style>|<scr(.*)\\/script>|<!--(.*)-->/isU","",$str);
		$alltext = "";
		$start = 1;
		for($i=0;$i<strlen($str);$i++)
		{
			if($start==0 && $str[$i]==">")
			{
				$start = 1;
			}
			else if($start==1)
			{
				if($str[$i]=="<")
				{
					$start = 0;
					$alltext .= " ";
				}
				else if(ord($str[$i])>31)
				{
					$alltext .= $str[$i];
				}
			}
		}
		$alltext = str_replace("　"," ",$alltext);
		$alltext = preg_replace("/&([^;&]*)(;|&)/","",$alltext);
		$alltext = preg_replace("/[ ]+/s"," ",$alltext);

		if($r==0) return $alltext;
		else return addslashes($str);
	}

	//php equivalent for js escape function
	function utf8_unescape($str) {
		$str = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($str));
		return html_entity_decode($str,null,'UTF-8');
	}

	function text_filter($text,$br=TRUE) {
		$text=str_replace('>', '&gt;', $text);
		$text=str_replace('<', '&lt;', $text);
		if($br) $text=nl2br($text);
		return $text;
	}

	function ip_show($ip) {
		if(!$this->myconfig->item('ip_hide')) return $ip;
		else {
			$ip=explode('.',$ip);
			for($i=3,$j=1;$i>=0,$j<=$this->myconfig->item('ip_hidden_num');$i--,$j++) $ip[$i]='*';
				
			return implode('.',$ip);
		}
	}

	function arrayRecursive(&$array, $function, $apply_to_keys_also = false){
		static $recursive_counter = 0;
		if (++$recursive_counter > 1000) {
			die('possible deep recursion attack');
		}
		foreach ($array as $key => $value) {
			if (is_array($value)) {
				$this->arrayRecursive($array[$key], $function, $apply_to_keys_also);
			} else {
				$array[$key] = $function($value);
			}


			if ($apply_to_keys_also && is_string($key)) {
				$new_key = $function($key);
				if ($new_key != $key) {
					$array[$new_key] = $array[$key];
					unset($array[$key]);
				}
			}
		}
		$recursive_counter--;
	}
	
	function myjson_encode($array) {
		//$this->arrayRecursive($array, 'urlencode', true);
		//$json = json_encode($array);
		//return urldecode($json);
		//上述方法中，如果$array的元素含有回车符或者双引号，会导致json_decode失效
		
		$json=json_encode($array);
		$json=$this->unicode_convert($json);
		return $json;
	}
	

	function unicode_convert($t) {
     preg_match_all('/\\\\u[0-9a-f]{4}/', $t, $t_all);
 
     foreach ($t_all[0] as $ch) {
         $_ch = intval(str_replace('\u', '0x', $ch), 16);
         $uni_ch = mb_convert_encoding('&#' . $_ch . ';', 'UTF-8', 'HTML-ENTITIES');
         $t = str_replace($ch, $uni_ch, $t);
     }
 
     return $t;
    }

	function multi_replace($array,$string) {
	    
		foreach($array as $index => $value)
		  $string=str_replace($index, $value,$string);
		
		return $string;
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */