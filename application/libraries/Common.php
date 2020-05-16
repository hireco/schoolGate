<?php
/**
 * 
 * Common usage class for my application
 * @author owner
 *
 */
class Common{
    
    protected static $_objectInstance = array();
    public static $authkey='P2kexs9dfe';
        
    public function __construct(){
	}
    
    public static function authcode($string, $operation = 'DECODE', $key, $expiry = 0) {
    	
        $ckey_length = 4;	
        if(empty($key)){
            exit('PARAM $key IS EMPTY! ENCODE/DECODE IS NOT WORK!');
        }else{
            $key = md5($key);
        }


        $keya = md5(substr($key, 0, 16));
        $keyb = md5(substr($key, 16, 16));
        $keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length): substr(md5(microtime()), -$ckey_length)) : '';

        $cryptkey = $keya.md5($keya.$keyc);
        $key_length = strlen($cryptkey);

        $string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d', $expiry ? $expiry + time() : 0).substr(md5($string.$keyb), 0, 16).$string;
        $string_length = strlen($string);

        $result = '';
        $box = range(0, 255);

        $rndkey = array();
        for($i = 0; $i <= 255; $i++) {
            $rndkey[$i] = ord($cryptkey[$i % $key_length]);
        }

        for($j = $i = 0; $i < 256; $i++) {
            $j = ($j + $box[$i] + $rndkey[$i]) % 256;
            $tmp = $box[$i];
            $box[$i] = $box[$j];
            $box[$j] = $tmp;
        }

        for($a = $j = $i = 0; $i < $string_length; $i++) {
            $a = ($a + 1) % 256;
            $j = ($j + $box[$a]) % 256;
            $tmp = $box[$a];
            $box[$a] = $box[$j];
            $box[$j] = $tmp;
            $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
        }

        if($operation == 'DECODE') {
            if((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10, 16) == substr(md5(substr($result, 26).$keyb), 0, 16)) {
                return substr($result, 26);
            } else {
                return '';
            }
        } else {
            return $keyc.str_replace('=', '', base64_encode($result));
        }

    }
    
    public static function myurlcode($string,$action='ENCODE') {
    	if($action=='ENCODE'){
    	    return str_replace('=', '', base64_encode(self::authcode($string,'ENCODE',self::$authkey)));
    	}
    	//why '=' can be delete?
    	
    	else if($action=='DECODE'){ 
    		$string=base64_decode($string);
    		return self::authcode($string,'DECODE',self::$authkey);
    	}    
    }
    
    public static function getgpc($k, $var='R') {
        switch($var) {
            case 'G': $var = &$_GET; break;
            case 'P': $var = &$_POST; break;
            case 'C': $var = &$_COOKIE; break;
            case 'R': $var = &$_REQUEST; break;
        }
        return isset($var[$k]) ? $var[$k] : NULL;
    }
    
    
    public static function addslashes($string, $force = 0, $strip = FALSE) {

        if(!ini_get('magic_quotes_gpc') || $force) {
            if(is_array($string)) {
                $temp = array();
                foreach($string as $key => $val) {
                    $key = addslashes($strip ? stripslashes($key) : $key);
                    $temp[$key] = self::addslashes($val, $force, $strip);
                }
                $string = $temp;
                unset($temp);
            } else {
                $string = addslashes($strip ? stripslashes($string) : $string);
            }
        }
        return $string;
    }
    
    
    public static function fileext($filename) {
        return trim(substr(strrchr($filename, '.'), 1, 10));
    }
    
    public static function move_array_pointer(&$array,$key) {
        if(!is_array($array)) return FALSE;
    	
        reset($array);
    	
    	if($key==0)  return TRUE;
	    if($key>0) {
	    	for($i=0;$i<$key;$i++) next($array);
	    }
	    else {
	    	for($i=0;$i<$key;$i++) prev($array);
	    }
	    
	    return TRUE;
    }
    
    public static function strip_array($array,$from,$len) {
    	
    	if(!is_array($array)) return FALSE;
    	if($len<1 ||$from<0)  return FALSE;
    	
    	return array_slice($array, $from,$len);
    	
    }
    
    public static function getInstanceOf( $classname , $index = null ){
        if( null === $index ){
            $index = $classname;
        }
        if( isset( self::$_objectInstance[$index] ) ){
            $instance = self::$_objectInstance[$index];
            if( !($instance instanceof $classname) ){
                throw new Exception( "Key {$index} has been tied to other thing." );
            }
        }else{
            $instance = new $classname();
            self::$_objectInstance[$index] = $instance;
        }
        return $instance;
    }

	/**
	* 利用递归调用，深层去掉多维数组的
	* 元素的两端的空格。
	*/

    public static function deep_trim(&$pParam){
		if(is_array($pParam)){
			foreach ($pParam as $key=>$value){
			  $pParam[$key] = self::deep_trim($value);	
			  //由于申请为static类型，故本身不存在实例，不能用this对象。
			  //如果不设置为static,则任何外部调用不能用静态调用，只能用this对象调用。
			}
			return $pParam;
		 }
		 else{
			return trim($pParam);
		 }
	}

	
	/**
	* 对一维数组，去掉数组中的空元素，不同形式的空值，NULL,'',0,'0'要区别对待。
	* 返回整理后的数组。
	*/

	public static function delete_null(&$pParam,$null='') {
		 if(is_array($pParam)){
			foreach ($pParam as $key=>$val){ 			  
			  if(is_array($val)) continue;
			  if(trim($val)===$null)  unset($pParam[$key]);
			}
			return  $pParam;
		 }
		 else return FALSE;
	}

	
	/**
	* 检验一个数组是否有空的元素，如果有，
	* 则返回TRUE,否则返回FALSE
	*/

	public static function has_null_element(&$pParam) {
	     if(is_array($pParam)){
			foreach ($pParam as $key=>$val){ 			  
			  if(!trim($val))  return TRUE;
			}
			return FALSE;
		 }
		 else return FALSE;
	}

	/**
	*  将特定的字符添加到一个字符串型的数组的每个元素前面或者后面。
	*  $front: TRUE表示加在前面，FALSE表示加在后面
	*  数组的元素若为空，则由$flag来定到底是添加还是不添加。
	*/

    public static function add_string_to($str,&$array,$front=TRUE,$flag=TRUE) {
	     if(is_array($array)) {
		 	foreach($array as $index => $value) {
				if($flag==TRUE && !$value)  
					$array[$index]=$value;
				else {
					if($front==TRUE) $array[$index]=$str.$value;
					else $array[$index]	=$value.$str;
				}
			}
			return 	$array;
		 }
		 else return FALSE;
	}
	
	/**
	* 临时函数，将含有各种字符的串变成适宜于ajax传送的字符。
	* 暂时还没有用，可能没有用。
	*/

	public static function codedata4ajax($string,$action='ENCODE') {
    	if($action=='ENCODE'){
    	    return str_replace('=', '', base64_encode(self::authcode($string,'ENCODE',self::$authkey)));
    	}
    	//why '=' can be delete?
    	
    	else if($action=='DECODE'){ 
    		$string=base64_decode($string);
    		return self::authcode($string,'DECODE',self::$authkey);
    	}    
    } // this function has the completely function with the function of myurlcode, to be update later.

    /**
	 * 获取多维数组中的最大值，或者最小值
	 *
	 */

	public static function array_max_min($arySrc,$get='big'){
		if (is_array($arySrc)){
			$getv=array();
			foreach($arySrc as $k=>$v){
				if (is_array($v))  $getv[$k]=self::array_max_min($v,$get);
				else $getv[$k]=$v;
			}
			
			foreach ($getv as $index => $value) 
			 if($value==='') unset($getv[$index]);
			  
			sort($getv);
			if(count($getv)) {
			  if($get=='big') return $getv[count($getv)-1];
			  else return $getv[0];
			}
			else return '';		
		}
		
		else return $arySrc;
	}
    

	public static function no_refresh(){
    	header("Expires: 0");
        header("Cache-Control: private, post-check=0, pre-check=0, max-age=0", FALSE);
        header("Pragma: no-cache");
        header("Content-type: application/xml; charset=utf-8");
    }
}
/* End of file Common.php */
/* Location: ./application/libraries/Common.php */