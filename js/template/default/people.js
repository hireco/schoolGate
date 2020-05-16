$(document).ready(function(){
	
	sort_people();
	
	$('.right_column .item_list .cont').each(function(){
	    if(!$(this).text() && !$(this).children('img').length) $(this).text('未填').css('color','#EE9572');
	});

	$('#amend_mine').live('click',function(){
		$.ajax({
			 type: 'post',
			 url:  get_url(json_str.base_url+'people/edit'),
			 data: 'people_id='+$('#people_id').val(),
		     success: function(data,textStatus){				 
		    	try{ 
		            data=eval('(' + data + ')');
		            if(data.result=='1') {
		            	$('#view_pannel').slideUp();
		            	$('#list_left').append('<div id="edit_pannel"></div>');
		            	$('#edit_pannel').html(data.infor);
		            }
		            else ajax_success(data,textStatus,'current','json');                
		        } 
				catch(err){
				    ajax_success('操作失败，请重试！',textStatus,'','string');
		        }
			 },
			 error:function(textStatus) {
				 ajax_failed(textStatus);
			 }
	   });
	});
	
	$('#add_details').live('click',add_detail_form);
	
	$('.delete_item').live('click',function(){
		$(this).closest('dl').remove();
		
		$('.index_no').each(function(i){
			var cur_no=i+1;
			$(this).text('项目'+cur_no);
		});
	});
	
	$('#personal_site').live('change',function(){
		if(!url_check($(this).val())) {
			top_message('请输入包含http://的完整网址!');
			$(this).val('');
		}
	});
	
	$('#email').live('change',function(){
		if(!email_check($(this).val())) {
			top_message('请输入正确的电子邮件地址!');
			$(this).val('');
		}
	});
	
	$('#cn_name').live('change',function(){
		if(!chinese_check($(this).val())) {
			top_message('请输入中文姓名!');
			$(this).val('');
		}
	});
	
	$('#html_dir').live('change',function(){
		$.post(get_url(json_str.base_url+'ajax/people_ajax/chk_html_dir'),{html_dir: $('#html_dir').val()},function(data){
			data = eval('(' + data + ')');
			if(data.result=='0') { 
				top_message(data.infor);
				$('#html_dir').val('');
			}
			else $('#personal_site').val(json_str.base_url+'public_html/'+$('#html_dir').val());
		});
		
	});
	
	$('.page_form :input:not(textarea,#en_name)').live('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
		}
	});

	$("#people_submit").live('click', function() {
		var inputs = [],details=[];
		var data, flag = 1;

		$('.page_form :input').not(':radio,checkbox').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			if(!$(this).hasClass('detail_item') && !$(this).hasClass('detail_cont')) inputs.push(this.name + '=' + escape(this.value));
		});
		
		if (!flag)	return false;

		data = inputs.join('&');
         
		data=data+'&gender='+$('[name="gender"]:checked').val()+'&hide_phone='+($('[name="hide_phone"]:checked').length?'1':'0')+'&hide_email='+($('[name="hide_email"]:checked').length?'1':'0')+'&hide_born_year='+($('[name="hide_born_year"]:checked').length?'1':'0');

		
		if($('.dd_span').length) {
			$('.dd_span .detail_item').each(function(i){
				details.push(escape($(this).val()+'-bbb-'+$('.dd_span .detail_cont').eq(i).val()));
			});
			data=data+'&details='+details.join('-ddd-');
		}
		
		block_all('<div class="block_msg">信息提交中，请稍候...</div>');

		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.base_url + 'people/edit/submit'),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
					ajax_success(data, textStatus, data.url, 'json');
				} catch (err) {
					ajax_success(data.infor, textStatus, 'current', 'string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				ajax_failed(textStatus);
			},
			complete: unblock_all()
		});
	});

	$("#people_cancel").live('click', function() {
		$('#edit_pannel').remove();
		$('#view_pannel').slideDown();
	});
	
	$('#swfupload_linker').live('click',open_swfupload);
});

function add_detail_form() {
	 var num=$('.dd_span').length+1;
	 var index=num-1;
	 var position;
	 if(index) $('.dd_span').closest('dl').last().after('<dl><dt> </dt><dd class="dd_span"></dd></dl>');
	 else $('.details_div').html('<dl><dt> </dt><dd class="dd_span"></dd></dl>');
	 $('.dd_span').last().html('<span><label class="index_no">项目'+num+'</label><input type="text" class="enterbox shortarea filled detail_item" /></span>');
	 $('.dd_span span').last().after('\n<span class="span_textarea"><textarea class="enterbox medium_enterarea filled detail_cont"></textarea></span><span class="delete_item" title="删除此条"></span>');
}

function open_swfupload() {
	$('#upload_pannel').remove();
	$.post(get_url(json_str.base_url+'ajax/swfupload/user_upload'),function(data){
	    $("body").append(data);
		block_all(); 
		//阻止其他操作
		$("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
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
		$('#people_list').append('<div class="uclist '+$(this).attr('class')+'"><div class="pclass"><a name="'+$(this).attr('class')+'_list"></a><span class="ucfirst">'+$(this).attr('class')+'</span></div><div class="plist"></div><div class="clear-both"></div></div>');
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