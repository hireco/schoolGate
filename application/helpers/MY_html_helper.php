<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *rewrite the function of doctype()
 * adding a \n after .....dtd">
 */
if ( ! function_exists('doctype'))
{
	function doctype($type = 'xhtml1-strict')
	{
		global $_doctypes;

		if ( ! is_array($_doctypes))
		{
			if ( ! require_once(APPPATH.'config/doctypes.php'))
			{
				return FALSE;
			}
		}

		if (isset($_doctypes[$type]))
		{
			return $_doctypes[$type]."\n";
		}
		else
		{
			return FALSE;
		}
	}
}

