<?php
$meta = array(
    array('name' => 'robots', 'content' => 'no-cache'),
    array('name' => 'Content-Language', 'content' => $this->config->item('language'), 'type' => 'equiv'),
    array('name' => 'Content-type', 'content' => 'text/html; charset='.$this->config->item('charset'), 'type' => 'equiv')
);
echo  meta($meta);
?>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title><?php echo $this->config->item('admin_title'); ?></title>
<link rel="stylesheet" type="text/css" media="all" href="<?php echo base_url();?>skin/admin/glyphicons/Glyphicons.min.css" />
<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>skin/admin/css/main.css" />
<?php
if(isset($cssmin)) echo $cssmin;
//css includes
foreach($this->config->item('admin_big_js') as $index => $value)
echo "<script type=\"text/javascript\" src=\"".base_url().$value."\" charset=\"utf-8\"></script>\n";
//big js list
if(isset($js)&&is_array($js)) foreach($js as $index => $value)
echo "<script type=\"text/javascript\" src=\"".$value."\" charset=\"utf-8\"></script>\n";
//js which can not be joined
echo $this->minify->js_mini('',TRUE,'common_admin','common_admin_js');
//js commonly used by adminnistrator
if(isset($jsmin)) echo $jsmin;
//js includes
?>
