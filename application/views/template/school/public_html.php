<html>
<head>
<meta http-equiv="Content-Language" content="zh-CN" />
<meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="<?php echo site_url('skin/'.SKIN_NAME.'/css/public_html.css');?>" />
<script type="text/javascript" src="<?php echo site_url('js/jquery-1.7.min.js');?>" charset="utf-8"></script>
<title><?php echo $cn_name?>的默认首页</title>
</head>
<body>
 <div class="body">
   <div class="welcome">您好，欢迎来到<?php echo $cn_name;?>的个人首页！</div>
   <div class="hint_body">
      <div class="hint_title">按照以下步骤设置您的个人网页</div>
      <div><span class="tag">1.</span><span class="cont">建立默认首页文件，文件名必须是：index.html</span></div>
      <div><span class="tag">2.</span><span class="cont">将您的图片放入一个文件夹中，文件夹名称不可含有特殊字符</span></div>
      <div><span class="tag">3.</span><span class="cont">同样，将.css、.js等文件也放入一个文件夹中（ </span><a title="<?php echo $this->myconfig->item('user_filetypes');?>" href="javascript:void(0);">查看系统当前接受的文件类型</a><span>）</span></div>
      <div><span class="tag">4.</span><span class="cont">将上述文件夹和index.html文件一起打包为.zip文件（请直接打包，不要放在文件夹中再打包）</span></div>
      <div><span class="tag">5.</span><a href="<?php echo site_url('people/view/'.$people_id);?>" target=_blank>点击此处</a> <span class="cont">，进入后点击"上传静态网页包"进行文件上传</span></div>
   </div>
   <div class="dir_hint">上传前请仔细检查，同名文件将被覆盖，一般情况下，您打包的zip文件应为如下结构：</div>   
   <div class="dir_mode">
        <div>.</div>
        <div>..</div>
        <div class="file">index.html</div>
        <div class="dot">更多...</div>
        <div class="dir">images</div>
        <div class="sub file">logo.gif</div>
        <div class="sub file">banner.jpg</div>
        <div class="sub file">my_photo.jpg</div>
        <div class="sub dot">更多...</div>
        <div class="dir">js</div>
        <div class="sub file">common.js</div>
        <div class="sub file">special.js</div>
        <div class="sub dot">更多...</div>
        <div class="dir">css</div>
        <div class="sub file">base.css</div>
        <div class="sub file">index.css</div>
        <div class="sub dot">更多...</div>
   </div>
   <div class="byebye">
       <div class="saying">好了，这是一个样例首页，欢迎您自行设置您的个人首页！</div>
   </div>
 </div>
</body>
</html>
