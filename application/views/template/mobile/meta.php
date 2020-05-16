<?php 
	if(!isset($meta))  $meta=$this->myconfig->set_meta();

	if(!isset($title)) $title=$this->myconfig->set_title(); 
	else $title=$this->myconfig->set_title($title);

	$seo=$this->myconfig->get_seo(uri_string());

	if(isset($seo['seo_title'])) {
	   $title=$this->myconfig->set_title($seo['seo_title']);
	   $meta=$this->myconfig->set_meta($seo['seo_description'],$seo['seo_keywords']);
	}

	echo  meta($meta); 
?>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="apple-touch-icon-precomposed" href="<?php echo base_url(); ?>skin/mobile/images/webIcon-128.png">
<link rel="shortcut icon" href="<?php echo base_url(); ?>skin/mobile/images/favicon.png">

<title><?php echo $title;?></title>
<link href="<?php echo base_url();?>bower/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<?php
if($template_css=$this->myconfig->get_template('main_css'))
    echo "<link href=\"".base_url().$template_css."\" rel=\"stylesheet\" />\n";
//css from viewer file
$this->my_load->output_css();
?>

<script src="<?php echo base_url();?>bower/jquery/dist/jquery.min.js"></script>
<script src="<?php echo base_url();?>bower/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="<?php echo site_url(); ?>bower/slideout/dist/slideout.min.js"></script>
<?php
//ǰ̨���ʺϺϲ���js,����controller
if(isset($js)&&is_array($js)) foreach($js as $index => $value)
	echo "<script src=\"".$value."\" charset=\"utf-8\"></script>\n";
//js from template & viewer file
$this->my_load->output_js('t');
?>

<!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->

<script>
  if(self!=top){top.location.href=self.location.href;}
</script>

  