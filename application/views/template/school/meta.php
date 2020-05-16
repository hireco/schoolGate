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
<title><?php echo $title;?></title>
<link href="<?php echo base_url();?>skin/images/favicon.ico" rel="icon" type="image/x-icon" />
<link href="<?php echo base_url();?>skin/common.css"  rel="stylesheet" />
<?php 
  if($template_css=$this->myconfig->get_template('main_css')) 
     echo "<link href=\"".base_url().$template_css."\"  rel=\"stylesheet\" />\n";
  //css from viewer file
  $this->my_load->output_css();
?>

<script src="<?php echo base_url();?>js/jquery-1.7.min.js"></script>
<script src="<?php echo base_url();?>js/jquery-ui-1.8.14.custom.min.js"></script>
<?php 
//前台不适合合并的js,来自controller
 if(isset($js)&&is_array($js)) foreach($js as $index => $value) 
    echo "<script src=\"".$value."\"></script>\n";
 //js from template & viewer file
 $this->my_load->output_js('t');    

//warn for ie6

$base_url=base_url();
echo <<<EOF
<!--[if lte IE 6]>
 <script type="text/javascript" src="{$base_url}js/jqueryIealert/iealert.js" charset="utf-8"></script>
 <link rel="stylesheet" type="text/css" href="{$base_url}js/jqueryIealert/iealert.css" />
 <script type="text/javascript">
  $(document).ready(function() {
	if(!checkCookie('ilikeie6')) { 
	   $("body").iealert();
	   $('#ilikeie6').live('click',function(){
		  if($(this).attr('checked')) setCookie('ilikeie6','1',7);
		  else setCookie('ilikeie6','0',0);
       });
	 }		
  });
 </script>
<![endif]-->
EOF;
?>

<script>  
 if(self!=top){top.location.href=self.location.href;}
</script> 
