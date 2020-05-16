<?php 
if(is_file('locked')) {
  @header("http/1.1 404 not found"); 
  @header("status: 404 not found"); 
  
  $heading = '您无权操作';
  $message = file_get_contents('locked');
  
  include('error.php');
  
  exit();  
}
else if(!isset($_REQUEST['step'])) {
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>SchoolGate Installation</title>
	<!-- Latest compiled and minified CSS & JS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<script src="//code.jquery.com/jquery.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    
    <style type="text/css">
    	.ajaxLoader {
    		display: inline-block;
    		width:46px;
    		height: 16px;
    		background-position: center;
    		background-image: url(../skin/images/img_loader.gif);
    		background-repeat: no-repeat;
    	}
		.queryLog {
			max-height:300px;
			overflow:hidden;
		}
    </style>
</head>
<body>
    <div class="container-fluid">
	    <div class="page-header">
	      <h1>SchoolGate <small>系统安装</small></h1>
	    </div>
    </div>

    <div class="container" id="mainBody">
    	
        <div class="panel panel-default firstStep">
		<div class="panel-heading">
			<h3 class="panel-title">第一步：连接数据库</h3>
		</div>
		<div class="panel-body">

		    <div class="form-group">
				<label for="hostname">数据库服务器</label>
				<input type="text" class="form-control" id="hostname" placeholder="输入服务器地址">
			</div>

			<div class="form-group">
				<label for="database">数据库名称</label>
				<input type="text" class="form-control" id="database" placeholder="输入数据库名称">
			</div>

			<div class="form-group">
				<label for="username">数据库用户</label>
				<input type="text" class="form-control" id="username" placeholder="输入数据库用户名">
			</div>

			<div class="form-group">
				<label for="password">数据库密码</label>
				<input type="password" class="form-control" id="password" placeholder="输入数据库密码">
			</div>

		    
            <div class="form-group">
				<button type="button" class="btn btn-primary firstStep">提 交</button>
			</div>

		</div>

		</div>

		<div class="panel panel-default collapse secondStep">
		    <div class="panel-heading">
		    	<h3 class="panel-title">第二步：建立数据表</h3>
		    </div>
			<div class="panel-body">

				<div class="form-group">
				   <input  type="checkbox" id="testData" value="1"> 安装测试数据
			    </div>

			    <div class="form-group">
				   <button type="button" class="btn btn-primary secondStep">点击开始</button>
			    </div>

			    <div class="queryLog collapse"></div>

			</div>
		</div>

		<div class="panel panel-default collapse thirdStep">
		    <div class="panel-heading">
		    	<h3 class="panel-title">第三步：建立管理员账号</h3>
		    </div>
			<div class="panel-body">

			    <div class="form-group">
					<label for="account">管理员账号</label>
					<input type="text" class="form-control" id="account" placeholder="输入管理员账号">
				</div>

				<div class="form-group">
					<label for="passcode">管理员密码</label>
					<input type="password" class="form-control" id="passcode" placeholder="输入管理员密码">
				</div>

				<div class="form-group">
					<label for="passcode2">确认管理员密码</label>
					<input type="password" class="form-control" id="passcode2" placeholder="确认管理员密码">
				</div>

				<div class="form-group">
				   <button type="button" class="btn btn-primary thirdStep">提 交</button>
			    </div>

			</div>
		</div>

		<div class="panel panel-default collapse success">
		    <div class="panel-heading">
		    	<h3 class="panel-title">恭喜！系统安装成功！</h3>
		    </div>
			<div class="panel-body">

			    <div class="alert alert-warning" role="alert">
			        <strong><span class="glyphicon glyphicon-warning-sign"></span> 警告!</strong> 为了安全起见，请先删除安装目录！
			    </div>
                
				<div class="text-left">
					 <a href="../webadmin/"><span class="glyphicon glyphicon-dashboard"></span> 登录后台管理系统</a>
				</div>

				<div class="text-left">
					 <a href="../"><span class="glyphicon glyphicon-home"></span> 进入前台</a>
				</div>

			</div>
		</div>

    </div>
	
	<div class="container-fluid">
	    <div class="text-center">
	        Powered by schoolGate 2015-2017
	    </div>
    </div>

    <script>

    	$(function(){

    		var data = [], checked = true;

            $('button.firstStep').click(firstStep);
            $('button.secondStep').click(secondStep);
            $('button.thirdStep').click(thirdStep);

            function thirdStep() {
                var curButton = $('button.thirdStep');

                formData('.thirdStep');

            	if(!checked) {
            		showMsg('warning','表单尚未填写完整！');
            		return false;
            	}
				
				if($('#passcode').val()!=$('#passcode2').val()) {
					showMsg('danger','用户密码两次输入不一致！');
            		return false;
				}

                showLoader(curButton);
            	disableBtn(curButton,thirdStep);

            	$.ajax({
            		url: '?step=3',
            		data: data.join('&'),
            		success:function(data) {
                        if(data=='success') {
                        	showMsg('success','恭喜！系统安装成功',function(){
                        		$('.panel.thirdStep').hide();
                        	    $('.panel.success').show();
                        	});
                        }
                        else showMsg('danger','管理员用户添加失败！');
            		},
            		error: function() {
                        showMsg('danger','服务器连接错误！');
            		},
            		complete:function() {
            			ableBtn(curButton,thirdStep);
						$('.ajaxLoader').remove();
            		}
            	})

            }

            function secondStep(){
            	var curButton = $('button.secondStep');

            	showLoader(curButton);
            	disableBtn(curButton,secondStep);
				
				formData('.secondStep');

            	sqlQuery(curButton,0);
            }

            function sqlQuery(curButton,sql) {
            	$.ajax({
            		url: '?step=2',
            		data: data.join('&')+'&sql='+sql,
            		success:function(data) {
                    
	                    var tmp = data.match(/CREATE TABLE IF NOT EXISTS `((.+))` \(/, '$1'); 
	                    
	                    if(tmp) 
	                    	$('.queryLog').show().prepend('<p>数据表'+ tmp[0].split('`')[1]+'创建成功...</p>');    
	                           
	                    if(data!='finished') {
							setTimeout(function(){sqlQuery(curButton, parseInt(sql)+1);},100);
						}
                        	
                        else {
							$('.ajaxLoader').remove();
							showMsg('success','恭喜！数据表写入成功',function(){
								$('.panel.secondStep').hide();
                        	    $('.panel.thirdStep').show();
                        	});
						}  	
            		},
            		error: function() {
                        showMsg('danger','服务器连接错误！');
                        ableBtn(curButton,secondStep);
            		}
            	})
            }

            function firstStep(){

            	var curButton = $('button.firstStep');

            	formData('.firstStep');

            	if(!checked) {
            		showMsg('warning','表单尚未填写完整！');
            		return false;
            	}

            	showLoader(curButton);
            	disableBtn(curButton,firstStep);

            	$.ajax({
            		url: '?step=1',
            		data: data.join('&'),
            		success:function(data) {
                        if(data=='success') {
                        	showMsg('success','恭喜！数据库连接成功',function(){
                        		$('.panel.firstStep').hide();
                        	    $('.panel.secondStep').show();
                        	});
                        }
                        else showMsg('danger','数据库连接错误！');
            		},
            		error: function() {
                        showMsg('danger','服务器连接错误！');
            		},
            		complete:function() {
            			ableBtn(curButton,firstStep);
						$('.ajaxLoader').remove();
            		}
            	})
            }

            function formData(obj) {
                $(obj + ' input:not(:checkbox),' + obj +' :checkbox:checked').each(function(){
            		 
            		 if(!$(this).val()) {
            		 	checked = false; 
            		 	return false;
            		 }

            		 checked = true;
                     
                     data.push($(this).attr('id')+'='+$(this).val());

            	});

            	//console.log(data);
            	//console.log(checked);
            }

            function showMsg(type,msg,func) {
            	$('.myalert').remove();
            	$('#mainBody').append('<div class="myalert alert alert-'+type+'" role="alert">'+msg+'</div>');
            	$('.myalert').fadeOut(3000,function(){
            		if(func)  func();
            	});
            }

            function showLoader(obj) {
            	$('.ajaxLoader').remove();
                obj.after('<span class="ajaxLoader"></span>');
            }

            function disableBtn(obj,func) {
                obj.addClass('disabled');
                obj.unbind('click',func);
            }

            function ableBtn(obj,func) {
                obj.removeClass('disabled');
                obj.bind('click',func);
            }

    	})
    </script>
	
</body>
</html>
<?php } 
else if($_REQUEST['step']=='1') {

	 $con = @mysqli_connect($_REQUEST['hostname'],$_REQUEST['username'],$_REQUEST['password'],$_REQUEST['database']); 

     if($con)   
     	  echo 'success';
     else 
     	  echo 'error';
} 
else if($_REQUEST['step']=='2') {

     $dataFile = isset($_REQUEST['testData'])?'database_with_testData.sql':'database.sql';
	 
     $sqls = file_get_contents($dataFile);

     $sqls = explode(';', $sqls);
     $num  = count($sqls);

     if($_REQUEST['sql']==$num) {
     	echo 'finished';
     	exit();
     }

     $con = mysql_pconnect($_REQUEST['hostname'],$_REQUEST['username'],$_REQUEST['password']); 

     mysql_select_db($_REQUEST['database']);

     mysql_query($sqls[$_REQUEST['sql']].';',$con);
     echo $sqls[$_REQUEST['sql']];
}
else if($_REQUEST['step']=='3') {
	
	$http = ((int)$_SERVER['SERVER_PORT'] == 443 ? 'https' : 'http') . '://';
	
	//配置站点的域名
	$config = file_get_contents('config.php');
	$config = str_replace('http://defaultSite.com/', $http.$_SERVER['HTTP_HOST'],$config);
	file_put_contents('../application/config/config.php',$config);
	
	//配置数据库
	$con = mysql_pconnect($_REQUEST['hostname'],$_REQUEST['username'],$_REQUEST['password']); 
	
	if($con) {
		$database = file_get_contents('database.php');
	    
		$database = str_replace('dataDefaultHostName',$_REQUEST['hostname'],$database);
	    $database = str_replace('dataDefaultAccount',$_REQUEST['username'],$database);
	    $database = str_replace('dataDefaultPassword',$_REQUEST['password'],$database);
	    $database = str_replace('dataDefaultName',$_REQUEST['database'],$database);
	    
		file_put_contents('../application/config/database.php',$database);
		
		
		mysql_select_db($_REQUEST['database']);
        $query = 'update user_member set user_name = "'.$_REQUEST['account'].'", user_pass = "'.md5($_REQUEST['passcode']).'" where user_id = 1;';
		
		$result = mysql_query($query,$con);
	}
	
	file_put_contents('locked','The system has been installed!');
	
	if($result) echo 'success';
	else echo 'error';
}
?>