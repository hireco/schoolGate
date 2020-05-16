$(document).ready(function() {
	
	//大图重设大小	
	$('.content img').each(function(i){		
		if($(this).width()>600) $(this).width(600);
		if($(this).width()>200) $(this).wrap('<center></center>');		
	});
});