$(document).ready(function(){
	
	var my_class= $('#my_class').val();
	var my_class_array=$('#my_class').val().split(',');	
	$('#class_id option, #vice_class_id option').each(function(){
	     if(my_class && $.inArray($(this).attr('value'),my_class_array) < 0) $(this).remove(); 
		 
	});

	$('.pannel_toggle').live('click',function(){
    	var cur_id=$(this).attr('id')+'_div';
    	$('.pannel_toggle').removeClass('pannel_selected');
    	$(this).addClass('pannel_selected');
    	$('#simple_dialog').remove();
        $('[id$="_link_div"]').each(function(){
            if($(this).attr('id')==cur_id) $(this).show();
            else $(this).hide();
        });
    });
	
	$("select option").filter('.has_sub').css('color', '#CCC');
	
	$('#class_id, #vice_class_id').change(function(){
	  
	  var obj=this;

	  if($(this).children().filter(':selected').hasClass('has_sub')){
	    obj.selectedIndex = obj.s||0;
		top_message('请选择子栏目发布内容');
		return false;
	  }
	  
	  if($('#check_model').val()=='1') {
		$.post(get_url(json_str.admin_base+'cms_class/model_check/'+$(this).val()+'/'+$('#model_id').val()),function(data){
			if(data=='0') {
				top_message('所选栏目不含该类文档模型！','','warn'); 
				//obj.selectedIndex = obj.s||0;	 //是否强制按类型发布内容
			}
		});
	  }

	  //根据类设置默认查看权限
	  if($(this).is('#class_id')) {
	     $.post(get_url(json_str.admin_base+'cms_class/class_view_right'),{class_id:$('#class_id').val()},function(data){
			 var view_right=data.split(':');	 
			 $('#user_level').val(view_right[1]);
             $('#view_right').val(view_right[0]);
		 });
	  }

	});
	
	$("#upload_icon").live('click',function(){
	    var size=$("#cms_icon_size").html();
	    size=size.split(':');
	    var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'icon_image',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html(),
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});

    addcss2head('js/calendar/calendar-green.css');	
	Calendar.setup({
			inputField     :    "post_time",
			ifFormat       :    "%Y-%m-%d %H:%M:%S",
			showsTime      :    true,
			timeFormat     :    "24"
	}); 
    
    $('#select_relate_list').live('click',function(){
		window_open(get_url(json_str.admin_base+'cms_list'));
    });
    
    $('#cms_source,#cms_writer').live('click',function(){
        var obj=$(this);
        var obj_name=$(this).attr('id'); 
        obj_name=obj_name.split('_'); 
        obj_name=obj_name[1];
        
        $.get(get_url(json_str.base_url+'ajax/writer_source/slist/'+obj_name),function(data){
            simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70'); 
        });         
    });
    
    $('#cms_source,#cms_writer').live('keydown',function(){
    	$('#simple_dialog').remove();
    });

    $('#source_list li span').live('click',function(){
        $('#cms_source').val($(this).text());
        $('#simple_dialog').remove();
    });
    
    $('#writer_list li span').live('click',function(){
        $('#cms_writer').val($(this).text()); 
        $('#simple_dialog').remove();
    });

    $('#user_level').live('click',function(){
        var obj=$('#user_level');
        obj.blur();        
        $.get(get_url(json_str.base_url+'ajax/user_level'),function(data){
            simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70'); 
        });         
    });

    $('#user_level_list li').live('click',function(){
         $('#user_level').val($(this).text());
         $('#view_right').val($(this).attr('id')); 
    });
    
    $('#title_color').live('click',function(){
        var obj=$('#title_color');
        $.get(get_url(json_str.base_url+'ajax/simple_viewer/color_picker'),function(data){
			simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data); 
            showColorPicker('title_color');
        });         
    });

    $('.increase').live('click',function(){
         $('#read_times').val(parseInt($('#read_times').val())+1);
     });

    $('.decrease').live('click',function(){
    	if(parseInt($('#read_times').val())>0)
        $('#read_times').val(parseInt($('#read_times').val())-1);
    	else $('#read_times').val('0');
    });

    
    $("#cms_submit").live('click',function(){
		 cms_submit();
	});
    
    $("#cms_cancel").live('click',function(){
		delete_images_cancel();
		history.go(-1);	
	});
 
	$('#cms_title').live('change',function(){
		var obj=$(this);
		var str=obj.val();
		
		/*
		if(!chinese_check(str)) {
			top_message('请输入中文字符!');
			obj.val('');
			return false;
		}
		*/
		
		$.post(get_url(json_str.base_url+"ajax/cms_ajax/check_cms_title/cms_title"),{cms_id: $('#index_id').val(),cms_title : $.trim(str)},function(data){
	       
		   if(data=='error') { 
			   obj.val('');
			   top_message('同标题内容已经存在，请不要重复发布！');
			   return false;
		   }

		   $.post(get_url(json_str.base_url+'ajax/cms_ajax/get_pinyin_name/1'),{cn_name : str},function(data){

			  str=data;

			  $.post(get_url(json_str.base_url+"ajax/cms_ajax/check_cms_title/cms_title_en"),{cms_title: str, cms_id : $('#index_id').val()},function(data){
		        if(data=='error') {
			       top_message('英文链接有重复，请修改！');			      
			       return false;
		         } 
			     $('#cms_title_en').val(str);
	          }); 
		   });

	    });

	});


	$('#switch_for_en_title').live('click',function(){
	    $('#for_en_title').toggle();
	});
    
	$('#cms_title_en').live('change',function(){
		var obj=$(this);
		var data=obj.val();

		if(!seo_url_check(data)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.base_url+"ajax/cms_ajax/check_cms_title/cms_title_en"),{cms_title: data, cms_id : $('#index_id').val()},function(data){
		   if(data=='error') {
			   top_message('SEO访问ID有重复，请修改！'); 
			   obj.val('');
			   return false;
		   } 
	     }); 			
	});
	
	$('#cms_keywords').live('change',function(){
		$(this).val($(this).val().replace(/\s|，|\||、/g,',').split(',').filter(function(item){
			return item.length >= 2 && item.length <= 8;
		}).join(','));
	});
	
	$('.my_form .button_row').mouseover(function(){
	   var oEditor=FCKeditorAPI.GetInstance('editor_content');
	   var oStr=oEditor.GetXHTML(true);
	   if(!$('#nohint4page:checked').length && oStr.indexOf('table')<0 && oStr.indexOf('page-break-after')<0 && actual_txtlength(oStr,'len')>3000) {
		   if(!$('#nohint4page').length) $('#cms_cancel').after('<input type="checkbox" style="margin-left:10px;" id="nohint4page" /> <label>不再提醒分页</label>');
		   top_message('您的文章较长，建议加入分页符！','','warn');
	   }
	});

 });

function article_check() {
	 var oEditor=FCKeditorAPI.GetInstance('editor_content');	 
	 if(actual_txtlength(oEditor.GetXHTML( true ),'len')==0) { 
		 top_message('主体内容不能为空！');
		 return false;
	 }
	 else { 
		 $('#article_body').val(oEditor.GetXHTML( true ));
		 return true;
	 }
	 //Ckeditor是在最后一刻才updata,将其值付给textarea,
	 //而在此之前获取textarea的值都是空的！
}

function photo_check() {
	var oEditor=FCKeditorAPI.GetInstance('editor_content');
	
	if($('#album_image').val()=='') {
		top_message('请上传相册图片');
		return false;
	}	
	if(actual_txtlength(oEditor.GetXHTML( true ),'len')==0) { 
		 top_message('相册介绍内容不能为空！');
		 return false;
	}
	else { 
		 $('#introduction').val(oEditor.GetXHTML( true ));
	}
	return true;
}

function video_check() {
	var oEditor=FCKeditorAPI.GetInstance('editor_content');
	$('#introduction').val(oEditor.GetXHTML( true ));
	
	if(!$('#video_html').val() && !$('#video_url').val()) {
		 top_message('视频内容或者地址不能为空！');
		 return false;
	}
	return true;
}

function download_check() {
	var oEditor=FCKeditorAPI.GetInstance('editor_content');
	var file_path=[];
	var file_title=[];

	$('#introduction').val(oEditor.GetXHTML( true ));
	
	$('.file_path').each(function(i){
	    file_path[i]=$(this).val();
		file_title[i]=$(this).next().val(); 
	});

	$('#all_file_path').val(file_path.join(':'));
	$('#all_file_title').val(file_title.join(':'));

	if($('.file_index').length==0) {
		 top_message('尚未上传文件！');
		 return false;
	}
	return true;
}

function cms_submit() {
	var model_table=$('#model_table').val();
	var add_or_edit=$('#add_or_edit').val();
	var data,flag=1;
	var inputs = [];	 
	 
	 
	if($.trim($('#cms_title').val())=='') {
		 top_message('请输入标题！');
		 return false;
	} 
		 
	if($('#class_id').val()=='0') { 
		 top_message('请选择所属主栏目！');
		 return false;
	}
	
	if(!eval(model_table+'_check()')) return false;
	
	$('#cms_form :input').not(':radio,:checkbox').each(function() {
  	 if($(this).val()=='' && $(this).hasClass('filled')) { 
			 top_message('表单尚未填写完整'); 
			 flag=0; return false;
	 }
  	 inputs.push(this.name + '=' + escape(beforeEscape(this.value)));
   });
	 
   if(!flag) return false;
   
   $(':radio:checked').each(function() {
     	 inputs.push(this.name + '=' + escape(beforeEscape(this.value)));
   });
   
   $(':checkbox:checked').each(function() {
    	 inputs.push(this.name + '=' + escape(beforeEscape(this.value)));
   });
   
   data=inputs.join('&'); 
   
   $.ajax({
  	   type: 'post',
       url:   get_url(json_str.admin_base+"cms_"+add_or_edit+"/submit_"+model_table),
       data:  data,
       success : function(data,textStatus){ 
    	     var url_go=json_str.admin_base+'cms_list/'+model_table;    	     
    	     try{ 
                data=eval('(' + data + ')');
                if(data.result=='1') {
                	delete_images_sql();
                	if(data.id && url_go=='preview') {
                		$('form .form_title').nextAll().remove();
                		$('form .form_title').after('<div class="submit_ok"><div class="ok_title">恭喜！内容成功提交</div><div class="ok_url"><a target="_blank" href="'+json_str.base_url+model_table+'/view/'+data.id+'">点击此处访问: '+json_str.base_url+model_table+'/view/'+data.id+'</a></div></div>');
                		return true;
                	}
                    else if(url_go=='list') url_go=json_str.admin_base+'cms_list/'+model_table;
                	ajax_success(data,textStatus,url_go,'json');
                }
                else ajax_success(data,textStatus,data.url,'json');                
             } 
			 catch(err){
				 ajax_success('操作失败，请重试！',textStatus,'','string');
             }
	   },
	   error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
   });
}
