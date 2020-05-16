$(document).ready(function(){
	
	// scroll images
	$('#slides').slides({
		preload: true,
		preloadImage: 'skin/images/preload.gif',
		play: 20000,
		pause: 20000,
		hoverPause: true,
		animationStart: function(current){
			$('.caption').animate({
				bottom:-35
			},100);
			if (window.console && console.log) {
				// example return of current slide number
				console.log('animationStart on slide: ', current);
			};
		},
		animationComplete: function(current){
			$('.caption').animate({
				bottom:0
			},200);
			if (window.console && console.log) {
				// example return of current slide number
				console.log('animationComplete on slide: ', current);
			};
		},
		slidesLoaded: function() {
			$('.caption').animate({
				bottom:0
			},200);
		}
	});
	
	$('#center_column .header_title').each(function(i){
	    
		var obj;
		if(i<3) obj=$('#center_column  .news_header:eq(0)'); 
		else obj=$('#center_column  .news_header:eq(1)');

		var list_id=i<3?'0':'1';
		
		$(this).appendTo(obj); 
		$('#center_column .news_righttop:eq('+i+')').appendTo(obj);
		$('#center_column .entry_list:eq('+i+')').appendTo($('#center_column .news_list:eq('+list_id+')'));
	}); 
	
	$('#center_column .news_header').append(' <div class="clear-both"></div>');
	
	$('#center_column .header_title').show();
	$('#center_column .header_title:eq(0),#center_column .header_title:eq(3)').addClass('current'); 
	$('#center_column .news_righttop:eq(0),#center_column .news_righttop:eq(3)').show();
	$('#center_column .entry_list:eq(0),#center_column .entry_list:eq(3)').show();

	$('#center_column .header_title').live('mouseover',function(){
	    var cur_panel=$(this).closest('.column_panel').attr('id');
		var cur_id=$(this).attr('id').split('_');
		$('#'+cur_panel+' .header_title'). removeClass('current');
		$('#'+cur_panel+' .entry_list, #'+cur_panel+' .news_righttop').hide();
		$(this).addClass('current'); 		
		$('#'+cur_panel+' #list_'+cur_id[1]+', #'+cur_panel+' #more_'+cur_id[1]).show();
	});

	//selection
	$('.select_links dt').click(function(){
	   $(this).next().toggle();
	});

	$('.select_links').mouseleave(function(){
	   $('.select_links dd').hide();
	});
});
