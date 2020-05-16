<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *my string limiter for utf-8 multi-language string
 */
if ( ! function_exists('my_limiter'))
{
	function my_limiter($string,$number,$add='...')
	{   
		if(mb_strlen($string,'utf8')<=$number) 
		     return $string;
		else 
		     return mb_substr($string, 0, $number, 'utf-8').$add;
	}
}

