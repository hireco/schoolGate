<script type="text/javascript">
$(document).ready(function(){
  $('li.info').mousemove(function(){
  $(this).find('ul').slideDown(0);//you can give it a speed
  });
  $('li.info').mouseleave(function(){
  $(this).find('ul').slideUp(0);
  }); 
});
</script>

<div class="header_box">
	<div class="header_top">
		<a href="http://example.com/" class="header_logo"><?php echo $this->myconfig->item('site_name');?></a>
		<div class="header_login"><a href="http://www.scut.edu.cn"  target="_blank"/>学校主页</a> | <a href="/EngLish/">办公门户</a> </div>
		<div class="header_ss">
			<form action="/Search/" method="get">
			    <input type="hidden" id="type" name="type" value="QueryList" />
                <input id="keyword" name="keyword" class="input" value="请输入搜索关键字" onfocus="if (value =='请输入搜索关键字'){value =''}" onblur="if (value ==''){value='请输入搜索关键字'}"/>
                <input type="submit"  class="btn" value="搜索"/>
            </form>
		</div>
	</div>
</div>

<div class="menu_box clearfix">
	<div class="wrapper">
	<div class="navlist">   
	<ul id="nav"> 
	<li class="info"><a href="/" class="hover">学院首页</a></li>
    <li class="info"><a href="/category/about/">学院概况</a></li>
    
    <li class="info"><a href="/category/xkdt/">学科建设</a></li>
    
    <li class="info" ><a href="/szll/">师资力量</a></li>
    
    <li class="info"><a href="/category/kxyjkytz/">科学研究</a></li>
    
    <li class="info"><a href="/category/193/">人才培养</a>
    <ul>
    <li><a href="/category/63/">本科生教育</a></li>
    <li><a href="/category/76/">研究生教育</a></li>
    </ul>
    </li>   
    <li class="info"><a href="http://job.hust.edu.cn"  target="_blank"/>就业信息</a></li>
    <li class="info"><a href="/xg/">学生园地</a>
    <ul>
    <li><a href="/xg/">学工园地</a></li>
    <li><a href="/yg/">研工园地</a></li>
    </ul>
    </li>
    <li class="info"><a href="/dj/">党务人事</a></li>
    <li class="info"><a href="/category/xyfcxzfc/">学院风采</a></li>
    <li class="info"><a href="/category/aqjydxal/">安全教育</a></li>
    <li class="info end"><a href="/category/202/">服务指南</a></li>
	
</ul>
</div>
  </div>
</div>
