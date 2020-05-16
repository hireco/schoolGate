<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<title>提示信息</title>
	<meta http-equiv="Content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
</head>
<style>
	body {
		padding:20px;
		background-color:darkred;
	}
	.panel-warning {
		background-color: transparent;
		border-color: gold;
		border-radius: 0;
	}
	.panel-warning .panel-body {
		color: gold;
	}
</style>
<body>
<div class="panel panel-warning">
	<div class="panel-body">

		<?php
		if(isset($viewer)) {
			if($viewer=='404_error') {
				$infor=isset($infor)?$infor:'The page you requested was not found.';
				echo '<h3><span class="glyphicon glyphicon-remove"></span> 404 Page Not Found</h3><p>'.$infor.'</p>';
			}
			else if($viewer=='site_closed') {
				$infor=isset($infor)?$infor:'网站维护中，请稍候再来...';
				echo '<h3><span class="glyphicon glyphicon-stop"></span> 抱歉，网站暂时关闭</h3><p>'.$infor.'</p>';
			}
			else if($viewer=='no_authorized') {
				$infor=isset($infor)?$infor:'对不起，您的权限不够访问该内容！';
				echo '<h3><span class="glyphicon glyphicon-unchecked"></span> 对不起，您当前的权限不足以查看或处理该内容！</h3><p>'.$infor.'</p>';
			}
			else if($viewer=='invalid_visiting') {
				$infor=isset($infor)?$infor:'错误的操作或不存在的访问地址！';
				echo '<h3><span class="glyphicon glyphicon-remove"></span> 对不起，您当前的访问出错或者操作不合法</h3><p>'.$infor.'</p>';
			}
			else if($infor) echo '<h1>抱歉，您的访问出现如下问题：</h1><p>'.$infor.'</p>';
			else echo '<h3><span class="glyphicon glyphicon-remove"></span>抱歉，当前的访问出错</h3><p>原因不明，正在排除中，请稍候再来...</p>';
		}
		else  echo '<h3><span class="glyphicon glyphicon-warning-sign"></span> 抱歉，网站有故障</h3><p>正在排除中，请稍候再来...</p>';
		?>
	</div>
</div>
</body>
</html>
