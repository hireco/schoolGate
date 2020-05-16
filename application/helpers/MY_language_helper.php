<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package		CodeIgniter
 * @author		Cheng
 * @copyright	Copyright (c) 2008 - 2011, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter Language Helpers
 *
 * @package		CodeIgniter
 * @subpackage	Helpers
 * @category	Helpers
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/helpers/language_helper.html
 */

// ------------------------------------------------------------------------

/**
 * Lang
 *
 * Fetches a language variable and optionally outputs the variable
 *
 * @access	public
 * @param	string	the language line
 * @return	string
 */
if ( ! function_exists('lang_value'))
{
	function lang_value($line)
	{
		$CI =& get_instance();
		$line = $CI->lang->line($line);

		return $line;
	}
}

// ------------------------------------------------------------------------
/* End of file language_helper.php */
/* Location: ./system/helpers/language_helper.php */