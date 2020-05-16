$(document).ready(function() {
	 $('.page_navigation a:not(:last)').each(function(){
		if(parseInt($(this).text()) != parseInt($(this).next().text())-1)
			$(this).after(' ... ');
	 });
});