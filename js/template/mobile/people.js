$(document).ready(function(){
	
	sort_people();

	$('.info_list .item_list .item_value').each(function(){
	   if(!$(this).text() && !$(this).children('img').length) $(this).text('未填').css('color','grey');
	});
			
});

function add_detail_form() {
	 var num=$('.detail_div').length+1;
	 var index=num-1;
	 var myHtml = '<div class="detail_div">'+$('.for_details').html()+'</div>';

	 $('.details_div').append(myHtml);

	 $('.details_div .index_no:last').text('项目'+num);
}

function open_swfupload() {
	var fls=flashChecker();

	$('#upload_pannel').remove();
	$.post(get_url(json_str.base_url+'ajax/swfupload/user_upload'),function(data){
	    $("body").append(data);
		block_all();
		//阻止其他操作
		$('#upload_pannel').css({'width':'100%','height':'100%','left':'0','top':'0','bottom':'0','right':'0','margin':'0'});
		$("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
		//$("#upload_pannel").resizable(); this does not effect, don't know why
		//可移动设置
	});
}

function tongyinzi(i,obj){
				  
	  if(i==0) return true;
	  
	  var cur_head=$(obj).text().substr(0,1);
	  var pre_head=$(obj).prev().text().substr(0,1);
	  
	  if(cur_head!=pre_head) { 
		 
		 $(obj).nextAll(':contains('+pre_head+')').each(function(){
			  
			  if($(this).text().substr(0,1)!=pre_head) return true;
			  
			  $(obj).before($(this).clone());
			  $(this).remove();

		 }); 
	  }
}

function sort_people() {
    
	$('.person_link').each(function(i){
		tongyinzi(i,this);
	})

	if($('.ucfirst_list').length==0) {
		$('.person_link a').parent().show();		
		return false;
	}
	 
	$('#people_list a').each(function(){	   
		$('#people_list').append('<div class="uclist '+$(this).attr('class')+'"><div class="pclass"><a name="'+$(this).attr('class')+'_list"></a><span class="ucfirst">'+$(this).attr('class')+'</span></div><div class="plist"></div></div>');
	});
	
	$('.ucfirst').each(function(){
	    if($('div.'+$(this).text()).length>1) $('div.'+$(this).text()).not(':first').remove();
	})
	
	$('.person_link a').each(function(){
	    $(this).parent().removeClass('hide').appendTo($('#people_list div.'+$(this).attr('class')+' .plist'));
	});

	$('.ucfirst_list a').click(function(){
		$('#people_list .uclist').removeClass('current');
		$('#people_list div.'+$(this).text()).addClass('current'); 
	});

	$('#people_list .uclist').mouseenter(function(){
		$('#people_list .uclist').removeClass('current');
		$(this).addClass('current');
	});

	$('#people_list .uclist').mouseleave(function(){
		$(this).removeClass('current');
	});
}
