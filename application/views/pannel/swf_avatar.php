<div class="swf_object embed-responsive embed-responsive-4by3">
<object class="embed-responsive-item" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="450" height="253" id="mycamera" align="middle">
	  <param name="allowScriptAccess" value="always" />
	  <param name="scale" value="exactfit" />
	  <param name="wmode" value="transparent" />
	  <param name="quality" value="high" />
	  <param name="bgcolor" value="#ffffff" />
	  <param name="movie" value="<?php echo $uc_avatarflash;?>" />
	  <param name="menu" value="false" />
	  <embed class="embed-responsive-item" src="<?php echo $uc_avatarflash;?>" quality="high" bgcolor="#ffffff" width="450" height="253" name="mycamera" align="middle" allowScriptAccess="always" allowFullScreen="false" scale="exactfit"  wmode="transparent" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />
</object>
</div>

<script>
	$(function(){
		var fls=flashChecker();

		if(!fls.f || parseInt(fls.v) < 15)  {
			$('.swf_object').parent().html('您的浏览器需要安装Flash Player后才可使用，请从<a href="http://www.adobe.com/go/getflashplayer">这里</a>下载安装.');
			top_message('浏览器不支持flash图片上传，请安装后再试！');
		}
	})
</script>



