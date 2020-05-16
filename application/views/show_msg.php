<html>
<head>
<meta http-equiv="Content-Language" content="zh-CN" />
<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
<title><?php echo isset($title)?$title:'页面访问出错';?></title>
<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>skin/common.css" />
<script type="text/javascript">
  setTimeout("history.go(-1)", 8000);
</script>
</head>
<body>
<div id="show_msg">
 <?php 
  if(isset($viewer)) {
	if($viewer=='404_error') {
	    $infor=isset($infor)?$infor:'The page you requested was not found.';
		echo '<h1>404 Page Not Found</h1><p>'.$infor.'</p>';
	}
	else if($viewer=='site_closed') {
		$infor=isset($infor)?$infor:'网站维护中，请稍候再来...';
		echo '<h1>抱歉，网站暂时关闭</h1><p>'.$infor.'</p>';
	}
	else if($viewer=='no_authorized') {
		$infor=isset($infor)?$infor:'对不起，您的权限不够访问该内容！';
		echo '<h1>对不起，您当前的权限不足以查看或处理该内容！</h1><p>'.$infor.'</p>';
	}
	else if($viewer=='invalid_visiting') {
		$infor=isset($infor)?$infor:'错误的操作或不存在的访问地址！';
		echo '<h1>对不起，您当前的访问出错或者操作不合法</h1><p>'.$infor.'</p>';
	}
	else if($infor) echo '<h1>抱歉，您的访问出现如下问题：</h1><p>'.$infor.'</p>';
	else echo '<h1>抱歉，当前的访问出错</h1><p>原因不明，正在排除中，请稍候再来...</p>';
  }
  else  echo '<h1>抱歉，网站有故障</h1><p>正在排除中，请稍候再来...</p>';
 ?>
</div>
</body>
</html>
