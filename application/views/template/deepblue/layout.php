<?php echo doctype(); ?>
<html>
<head>
<?php 
  
  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/common-front.js';
  
  $header=$this->my_load->view(isset($header)?$header:'header','',TRUE);
  $body=$this->my_load->view(isset($body)?$body:'body','',TRUE);
  $footer=$this->my_load->view(isset($footer)?$footer:'footer','',TRUE);
  $this->my_load->view('meta');
?>

</head>
<body>

<div id="body">

<?php echo $header;?>
<?php echo $body;?>
<?php echo $footer;?>

</div>

<noscript>
<div id="noscript_hint">您的浏览器禁用了脚本支持，请设置后访问！</div>
<div class="blocking"></div>
</noscript>

<?php $this->my_load->output_js('b');?>

</body>
</html>