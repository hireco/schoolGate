$(document).ready(function(){
	
	// scroll images
	$('#slides').slides({
		preload: true,
		preloadImage: 'skin/images/preload.gif',
		play: 5000,
		pause: 2500,
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

	//selection
	$('.select_links dt').click(function(){
	   $(this).next().toggle();
	});

	$('.select_links').mouseleave(function(){
	   $('.select_links dd').hide();
	});
});