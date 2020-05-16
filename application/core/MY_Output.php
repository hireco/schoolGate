<?php 

class MY_Output extends CI_Output {
    
	var $cache_path;
	
    function __construct()
    {
        parent::__construct();
	    
		define('IS_MOBILE',  $this->isMobile());
		
		if(IS_MOBILE) 
			$this->cache_path = 'application/cache/m/';
		else 
			$this->cache_path = 'application/cache/c/';
    }
	
	/**
	 * Write a Cache File
	 *
	 * @access	public
	 * @return	void
	 */
	function _write_cache($output)
	{   
	    $CI =& get_instance();
		
		$cache_path = $this->cache_path;

		if ( ! is_dir($cache_path) OR ! is_really_writable($cache_path))
		{
			log_message('error', "Unable to write cache file: ".$cache_path);
			return;
		}

		$uri =	$CI->config->item('base_url').
				$CI->config->item('index_page').
				$CI->uri->uri_string();

		$cache_path .= md5($uri);

		if ( ! $fp = @fopen($cache_path, FOPEN_WRITE_CREATE_DESTRUCTIVE))
		{
			log_message('error', "Unable to write cache file: ".$cache_path);
			return;
		}

		$expire = time() + ($this->cache_expiration * 60);

		if (flock($fp, LOCK_EX))
		{
			fwrite($fp, $expire.'TS--->'.$output);
			flock($fp, LOCK_UN);
		}
		else
		{
			log_message('error', "Unable to secure a file lock for file at: ".$cache_path);
			return;
		}
		fclose($fp);
		@chmod($cache_path, FILE_WRITE_MODE);

		log_message('debug', "Cache file written: ".$cache_path);
	}

	// --------------------------------------------------------------------

	/**
	 * Update/serve a cached file
	 *
	 * @access	public
	 * @return	void
	 */
	function _display_cache(&$CFG, &$URI)
	{   
	    $cache_path = $this->cache_path;

		// Build the file path.  The file name is an MD5 hash of the full URI
		$uri =	$CFG->item('base_url').
				$CFG->item('index_page').
				$URI->uri_string;

		$filepath = $cache_path.md5($uri);

		if ( ! @file_exists($filepath))
		{
			return FALSE;
		}

		if ( ! $fp = @fopen($filepath, FOPEN_READ))
		{
			return FALSE;
		}

		flock($fp, LOCK_SH);

		$cache = '';
		if (filesize($filepath) > 0)
		{
			$cache = fread($fp, filesize($filepath));
		}

		flock($fp, LOCK_UN);
		fclose($fp);

		// Strip out the embedded timestamp
		if ( ! preg_match("/(\d+TS--->)/", $cache, $match))
		{
			return FALSE;
		}

		// Has the file expired? If so we'll delete it.
		if (time() >= trim(str_replace('TS--->', '', $match['1'])))
		{
			if (is_really_writable($cache_path))
			{
				@unlink($filepath);
				log_message('debug', "Cache file has expired. File deleted");
				return FALSE;
			}
		}

		// Display the cache
		$this->_display(str_replace($match['0'], '', $cache));
		log_message('debug', "Cache file is current. Sending it to browser.");
		return TRUE;
	}
	
	
	/**
	 * Delete cache
	 *
	 * @param	string	$uri	URI string
	 * @return	bool
	 */
	public function delete_cache($uri = '')
	{
		$CI =& get_instance();
		
		$cache_path = $this->cache_path;
		
		if ($cache_path === '')
		{
			$cache_path = APPPATH.'cache/';
		}

		if ( ! is_dir($cache_path))
		{
			log_message('error', 'Unable to find cache path: '.$cache_path);
			return FALSE;
		}

		if (empty($uri))
		{
			$uri = $CI->uri->uri_string();

			if (($cache_query_string = $CI->config->item('cache_query_string')) && ! empty($_SERVER['QUERY_STRING']))
			{
				if (is_array($cache_query_string))
				{
					$uri .= '?'.http_build_query(array_intersect_key($_GET, array_flip($cache_query_string)));
				}
				else
				{
					$uri .= '?'.$_SERVER['QUERY_STRING'];
				}
			}
		}

		$cache_path .= md5($CI->config->item('base_url').$CI->config->item('index_page').ltrim($uri, '/'));

		if ( ! @unlink($cache_path))
		{
			log_message('error', 'Unable to delete cache file for '.$uri);
			return FALSE;
		}

		return TRUE;
	}
	
	/**
	 *判断是否是通过手机访问
	 */
	function isMobile() {
		// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
		if (isset($_SERVER['HTTP_X_WAP_PROFILE'])) {
			return true;
		}
		//如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
		if (isset($_SERVER['HTTP_VIA'])) {
			//找不到为flase,否则为true
			return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
		}
		//判断手机发送的客户端标志,兼容性有待提高
		if (isset($_SERVER['HTTP_USER_AGENT'])) {
			$clientkeywords = array('nokia', 'sony', 'ericsson', 'mot', 'samsung', 'htc', 'sgh', 'lg', 'sharp',
				'sie-', 'philips', 'panasonic', 'alcatel', 'lenovo', 'iphone', 'ipod', 'blackberry', 'meizu',
				'android', 'netfront', 'symbian', 'ucweb', 'windowsce', 'palm', 'operamini', 'operamobi',
				'openwave', 'nexusone', 'cldc', 'midp', 'wap', 'mobile');
			// 从HTTP_USER_AGENT中查找手机浏览器的关键字
			if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
				return true;
			}
		}
		//协议法，因为有可能不准确，放到最后判断
		if (isset($_SERVER['HTTP_ACCEPT'])) {
			// 如果只支持wml并且不支持html那一定是移动设备
			// 如果支持wml和html但是wml在html之前则是移动设备
			if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
				return true;
			}
		}
		return false;
	}

}