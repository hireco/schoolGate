<?php echo doctype(); ?>

<html>

<head>

<?php $this->load->view('admin/meta');?>

<script>
var mainWidth=window.screen.availWidth<1280?1280:window.screen.availWidth;
var winHeight=window.screen.availHeight;
var check_screen=true;
</script>

<!--[if(IE 8)|(IE 9)]>
<script>
check_screen=false;
$(document).ready(function(){   
  
  var totalWidth=27+$('#left_column').outerWidth()+$('#right_column').outerWidth()+$('#menu_toggle').outerWidth();
  if(totalWidth>mainWidth) {
	 mainWidth=totalWidth;
	 simple_dialog(400,5,'不建议使用IE8/IE9浏览器，<br />他们会导致窗体显示过大','170');
	 $('html').css({"overflow-x":"auto"});
  }
});
</script>
<![endif]-->

<script>
  
  $(document).ready(function(){
	  
	 var left_height=$('#left_column').height();
     var right_height=$('#right_column').height();
     var mainHeight=left_height>right_height?left_height:right_height;
	     mainHeight=mainHeight>winHeight-$('#header').height()?mainHeight:winHeight-$('#header').height(); 
     
	 if(check_screen && window.screen.width < 1280)
	 simple_dialog(400,5,'您好，您的屏幕宽度不够大，<br />请调整为至少是1280个像素','170');
	
	 $('#main').css({"width": mainWidth+"px","height": mainHeight+"px"});
	 $('#footer').css({"width": mainWidth-161+"px"});
	 $('#workplace').css({"width": mainWidth-161+"px"});

     if($('#header').width() < mainWidth) $('#header').css({"width" : mainWidth+"px"}); 
	 
	 $('.navigator li a.sub').each(function(){

          if($(this).attr('href')==location.href) {

              $(this).parent().parent().children().css({"border-bottom":"1px solid #ffffff"});

              $(this).parent().parent().children().last().removeAttr("style");

              $(this).css({"background-color":"#eeeeee"});

              $(this). parent().parent().show();

          }

	 });

	  

	 $('.navigator li a.top').click(function(){

         var obj=this;

	     $(this).next().toggle();	  

	     $('.navigator li a.top').each(function(){

	         if(this!=obj) $(this).next().toggle(false);

	     });

		 $('.navi-children'). each(function(){

			 $(this).children().css({"border-bottom":"1px solid #ffffff"});

			 $(this).children().last().removeAttr("style");

		 });		      

     }); 



	 $('.navi-children li').mouseover(function(){

			 $(this).children().css({"background-color":"#eeeeee"});

	 });

	  		

	 $('.navi-children li').mouseout(function(){

             if($(this).children().attr('href')!=location.href)

		   	 $(this).children().removeAttr("style");

	 });    
	 
	 //if(window.opener) $('#header,#left_column,#menu_toggle').hide();  //Coz ie does not support opener function

	 $('#menu_toggle').click(function(){

         $('.menu_clicker').toggleClass('menu_closer'); 
         $('.menu_clicker').toggleClass('menu_opener');
         $('#menu_div').toggle();
		 $('body').toggleClass('bg_alter');
     });

  });

</script> 

</head>

<body>

<div id="body">

 <div id="header">

   <?php $this->load->view('admin/header');?>

 </div>

 <div id="main">

  <div id="left_column">    

    <div id="menu_div">

      <?php $this->load->view('admin/menu');?>

    </div>
  </div>
  
  <div id="menu_toggle">
	  <div class="menu_clicker menu_closer"></div>
  </div>
  
  <div id="right_column">

    <div id="workplace">

     <?php echo $workplace_view;?>

    </div>

    <div id="footer">

     <?php $this->load->view('admin/footer');?>

    </div>    

  </div>

  <div class="clear_both"></div>

 </div>         

</div>

</body>

</html>