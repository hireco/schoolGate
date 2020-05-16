var select_for='';
var myTimer;
var initial_images='';
$(document).ready(function(){

	initPagination(); //初始化分页
	
	//设置提示信息
	bubble_initial($('#hint_for_imgsize'),'宽度=（元素宽度-22）/每行拟显示数-10 <br /> 高度不限，若元素高度存在，则高度必须在元素高度以内'); 
	bubble_initial($('#hint_for_adssize'),'宽度必填，须在区块所放的父级尺寸以内，<br />除图片或动画媒体外，高度不确定可留空或填0');
	
	//右键菜单生成	 
	$('[id$="_table"],[id^="adsimg_no_"]').live("mouseover",function(){
	   $(this).contextMenu('mycontext_menu', { 
		   bindings: {			  
		       'edit':  function(t) {
				   myedit(t);
			   },
			   'delete': function(t) {
				   mydelete(t);
			   },
			   'crop': function(t) {
				   var cur_id=t.id;
				   var imgsrc=$('img#'+cur_id).attr('src').split('?').shift();
		    	   imgsrc=imgsrc.replace(json_str.site_base,'');
		    	   imgsrc=imgsrc.replace(json_str.base_url.replace(json_str.site_base,''),'');
		    	   
		    	   var size=[];
		    	   size[0]=$('#ads_width').val();
		   		   size[1]=$('#ads_height').val();
		   		   
	   			   var data ={
	   		      	 "action"       : 'crop',
	   		         "t_width"      : size[0],
	  	             "t_height"     : size[1],
	   				 "preview"      : imgsrc,
	   				 "path"         : imgsrc.replace(basename(imgsrc),''),
	   				 "crop_for"     : 'crop',
	   				 "refresh"      : cur_id
	   		      };
	   			  show_upload_crop(data);
			   }
		  },
		  onShowMenu: function(e, menu) {
		          if ($(e.target).is('li')) {
		            $('#crop', menu).remove();
		          }
		          if ($(e.target).is('img')) {
		        	  $('#delete, #edit,#copy_id', menu).remove();
			          if(!resources_is_local($(e.target).attr('src')))  return false;		        	  
			      }
		          return menu;
		  },
		  itemStyle: {	    	 
		          border: '1px dashed #cccccc',
		          margin: '2px'
		  }    
	   });	
	});	
	
	//媒体上传部分
	$('#upload_media').live('click',function(){
        $('#upload_pannel').remove();
    	$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    		$("body").append(data);
			block_all();
			//阻止其他操作
			$("#upload_pannel").draggable({ cursor: 'move' });
			//可移动设置
    	});
     });
	
	//图片上传部分
	$("#upload_image").live('click',function(){
		var size=[];
		size[0]=$('#ads_width').val();
		size[1]=$('#ads_height').val();
		
		var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'ads_image',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html(),
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});
	
	$(".close_pannel").live('click',function(){		 
	   	 myTimer=setInterval(detect2show_images, 100);
	});	
	
	function detect2show_images(){
		var ads_image=$('#ads_image').val();
		if(ads_image!=initial_images) {
			initial_images=ads_image;
			$('.form_pic_show').show();	
			$('#show_image_div').html('<img id="adsimg_no_'+Math.round(Math.random()*100)+'" src="'+ads_image+'" />'); 
	   		clearInterval(myTimer);
		}		
   	 }
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//提交表单部分 ----------------------------------//
	$('#advertise_submit').click(function(){
         var data=[],flag=1;
         var spot_image=$('#ads_image').val();
         var oEditor=FCKeditorAPI.GetInstance('editor_content'); 
         
         if($.trim($('#ads_title').val())=='') {
            top_message('请填写区块元素的名称');
            return false;
         } 
            		 
 		 $('.my_form_item:visible :input:visible:not(:radio), .my_form_item:visible :input:visible:radio:checked').each(function(){
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message('表单尚未填写完整'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
             data.push($(this).attr('name')+'='+escape($.trim($(this).val())));
         });
         
         if(!flag) return false;
         
         data=data.join('&');
         
         data=data+'&ads_id='+$('#ads_id').val();
         
         if($('#ads_type').val()=='html') {
        	 $('#ads_html').val(oEditor.GetXHTML( true ));
        	 data=data+'&ads_html='+escape($('#ads_html').val());
         }
         
         $.ajax({
            type: 'post',
            url : get_url(json_str.admin_base+'advertise/submit'),
            data: data,
            success : function(data,textStatus){   	       	     
       	        try{ 
                   data=eval('(' + data + ')'); 
                   if(data.result=='1') {
                	   delete_images_sql();
                	   ajax_success(data,textStatus,'','json');
                	   refresh_ads_list();
                   }
                   else  ajax_success(data,textStatus,data.url,'json');
                } 
   			    catch(err){
   			    	alert(data);
   			    	ajax_success('操作失败，请重试！',textStatus,'','string');
                }
   	       },
   	       error  : function(XMLHttpRequest, textStatus, errorThrown){
   	   	        ajax_failed(textStatus);
   	   	   }         
         }); 
	});
	
	//选择mysql的字段
	$('#mysql_table').live('click',function(){
        var obj=$(this);
        var data='';
        obj.blur();
        $('div.items_object').each(function(){
        	data+='<li class="mysql_items" title="'+$(this).attr('title')+'">'+$(this).text()+'</li>';
        });
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul>'+data+'</ul>','100');         
    });
	
	$('li.mysql_items').live('click',function(){
		var old_value=$('#mysql_table').val();
		var new_value=$(this).attr('title');
		$('#mysql_table').val($(this).attr('title'));
		if(old_value!=$('#mysql_table').val()) $('#mysql_order_by').val('');
		
		$('[name="mysql_mode"][value="text"]').attr('checked',true);
		$('[name="mysql_mode"]').attr('disabled',true);
		$('ul.mode_items').filter('.of_'+new_value).children().each(function(){
			$('[name="mysql_mode"][value="'+$(this).attr('title')+'"]').attr('disabled',false);
		});
	});
	
	$('#mysql_order_by').live('click',function(){
        var obj=$(this);
        var data='';
        obj.blur();
        
        if($('#mysql_table').val()=='') { 
        	top_message('请先选择数据表');
        	return false;
        }
        
        data=$('ul.order_items').filter('.of_'+$('#mysql_table').val()).html();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul class="mysql_order_items">'+data+'</ul>','100');         
    });
	
	$('.mysql_order_items li').live('click',function(){
		$('#mysql_order_by').val($(this).attr('title'));
	});
	
	$('[name="mysql_mode"][value="image"]').live('click',function(){
		$('.image_size').show();
	});
	
	$('[name="mysql_mode"][value="text"]').live('click',function(){
		$('.image_size').hide();
	});
	
	$('#mysql_direction').live('click',function(){
        var obj=$(this);
        var data='<ul class="mysql_direction_items"><li title="v">纵向</li><li title="h">横向</li></ul>';
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul>'+data+'</ul>','50');         
    });
	
	$('.mysql_direction_items li').live('click',function(){
		$('#mysql_direction').val($(this).attr('title'));
	});
	
	//新建表单----------------------------------------------//
	
	$('#add_advertise').live('click',function(){		
		if($('#return_to_form:visible').length) {
			top_message('尚有未完成的表单，请继续！');
			$('#return_to_form').click();
			return false;
		}
		clear_form();
		
		var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
		oEditor.SetData('') ;
		
		$('#add_div').slideDown();
		$('#clist_div').slideUp();
		$('#simple_dialog').remove();
	});
	
	$('#ads_type').change(function(){
		var cur_val=$(this).val();
		$('.shift_div').hide();
		$('.shift_div.for_'+cur_val).show();
		$('[name="to_upload"][value="1"]').attr('checked',true);
		
		if(cur_val=='image' && $('#show_image_div').html()) $('.form_pic_show').show();
		else $('.form_pic_show').hide();
		
		(cur_val=='image' || cur_val=='flash')?$('.resources_type').show():$('.resources_type').hide();
	});	
	
	$('.resources_type [name="to_upload"]').change(function(){
		$('.shift_div:visible .div_upload').toggle();
		$('.shift_div:visible .div_url').toggle();
	});
	
	//取消正在编辑的对象
	$('#advertise_cancel').live('click',function(){
		delete_images_cancel();
		clear_form();
		$('#add_div').slideUp();
		$('#clist_div').slideDown();
	});
	
	
	
	//删除对象--------------------------------------------------//
	$("#delete_advertise").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"advertise/delete_advertise/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
					   $.each(data.id.split(','), function(i, n){
						   $('#'+n+'_table').remove(); 
					   });
					   sort_pagination($('#'+$('#current_order_by').text()),false);
					}
				    ajax_success(data,textStatus,'','json'); 
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
		   complete: function() { $("#user_dialog").remove(); unblock_all(); }			
	   });	
	});
	
 });

function sort_pagination(obj,reverse) {
	var cur_id=obj.attr('id');
	var current_order;
	var is_num=false;
	
	$('#current_order_by').text(cur_id); 
	//记录当前排序目标，以备它用，例如局部删除后刷新列表
	
	cur_id=cur_id.replace('sort_','');
	if(obj.hasClass('is_num')) is_num=true;
	
	if(cur_id=='by_default') {
		$('#sort_by_default').hide();
		current_order='asc'; $('#current_order').text(''); 
	}
	else {
		$('#sort_by_default').show();
		current_order=$('#current_order').text();
		if(reverse==true) current_order=current_order?(current_order=='desc'?'asc':'desc'):'asc';
		$('#current_order').text(current_order); //记录当前排序顺序，以便进行反序排列
	}
	
	$(".ul_tables_body").jSort({
        sort_by: 'li.'+cur_id,
        item: 'ul',
        order: current_order,
        is_num: is_num
    });
	
	$('.ul_tables_body').children().each(function(i){
		$(this).removeClass('even');
		$(this).removeClass('odd');
		$(this).addClass((i+1)%2==1?'odd':'even');
		$(this).children().filter('li.id').text(i+1);
	});
	
	initPagination();
}

function clear_form() {
	
	initial_images='';
	$('.resources_type').hide();
	$('[name="to_upload"][value="1"]').attr('checked',true);
	$('.shift_div .div_upload').show();
	$('.shift_div .div_url').hide();
	
	$('#ads_type').children().first().attr('selected',true);
	$('.shift_div').hide();
	$('.for_html').show();	
	
	$('.form_pic_show').hide(); 
	$('#show_image_div').html('');
	$('#ads_title').val('');
	$('#ads_hint').val('');
	$('#ads_width').val('238');
	$('#ads_height').val('200');
	$('#ads_id').val('0');
	$('#ads_image').val('');
	$('#image_link').val('');
	$('#ads_image_url').val('');
	$('#ads_image_sql').val('');
	$('#ads_image_old').val('');
	
	$('input:text').removeAttr('style');
	$('.form_title').text('添加区块元素');
	$('#ads_html').text('');
	$('#ads_script').val('');
	$('#ads_flash').val('');
	$('#ads_flash_url').val('');
	
	$('[name="mysql_mode"][value="text"]').attr('checked',true);
	$('[name="mysql_mode"]').attr('disabled',true);
	$('.image_size').hide();
	$('#mysql_table').val('');
	$('#mysql_order_by').val('');
	$('#mysql_where').val('');
	$('#mysql_num').val('10');
	$('#mysql_width').val('');
	$('#mysql_height').val('');
	$('#mysql_direction').val('');
}

function myedit(obj) {
	var ids_select;
	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
	oEditor.SetData('正在导入......');
	
	clear_form();
	
	ids_select=obj.id.split('_'); 
	ids_select=ids_select[0];		
	
	$('#ads_title').val($('#'+obj.id).children().filter('.by_title').text());
	$('#ads_hint').val($('#'+obj.id).children().filter('.ads_hint').attr('title'));
	$('#ads_width').val($('#'+obj.id).children().filter('.by_width').text());
	$('#ads_height').val($('#'+obj.id).children().filter('.by_height').text());
	
	$('#ads_id').val(ids_select);
	$('#ads_type').children().filter(':contains("'+$('#'+obj.id).children().filter('.by_type').text()+'")').attr('selected',true);
	$('#ads_html').text('正在导入......');	
	
	$('.form_title').text('编辑区块元素');
	
	$('.shift_div').hide();
	$('.shift_div.for_'+$('#ads_type').val()).show();
	
	$('#clist_div').slideUp('fast',function(){
		$('#add_div').slideDown('fast',function(){
			$.post(get_url(json_str.admin_base+'advertise/ads_content/'+$('#ads_id').val()),function(data){
				$('.resources_type').hide();
				if($('#ads_type').val()=='image') {
					data=eval('(' + data + ')');
					initial_images=data.ads_image;					
					
					if(initial_images) {
						if(resources_is_local(initial_images)) $('#ads_image').val(initial_images);
						else {
							$('[name="to_upload"][value="0"]').attr('checked',true);
							$('.shift_div:visible .div_upload').toggle();
							$('.shift_div:visible .div_url').toggle();
							$('#ads_image_url').val(initial_images);
						}
						
						$('#image_link').val(data.image_link);
						$('#ads_image_sql').val(initial_images);
						$('#show_image_div').html('<img id="adsimg_no_'+Math.round(Math.random()*100)+'" src="'+initial_images+'?t='+Math.round(Math.random()*100)+'" />');
						$('.form_pic_show').show();
					}
					
					$('.resources_type').show();
				}
				else if($('#ads_type').val()=='flash') {
					if(resources_is_local(data)) $('#ads_flash').val(data);
					else {
						$('[name="to_upload"][value="0"]').attr('checked',true);
						$('.shift_div:visible .div_upload').toggle();
						$('.shift_div:visible .div_url').toggle();
						$('#ads_flash_url').val(data);
					}
					$('.resources_type').show();
				}
				else if($('#ads_type').val()=='script') $('#ads_script').val(data);
				else if($('#ads_type').val()=='html') oEditor.SetData(data);
				else if($('#ads_type').val()=='mysql') {
					data=eval('(' + data + ')');
					$('#mysql_table').val(data.table);
					$('#mysql_order_by').val(data.order_by);
					$('#mysql_num').val(data.num);
					$('#mysql_where').val(data.where);
					$('#mysql_direction').val(data.direction);
					
					$('[name="mysql_mode"][value="'+data.mode+'"]').attr('checked',true);
					$('ul.mode_items').filter('.of_'+data.table).children().each(function(){
						$('[name="mysql_mode"][value="'+$(this).attr('title')+'"]').attr('disabled',false);
					});
					
					if(data.mode=='image') {
						$('#mysql_width').val(data.width);
						$('#mysql_height').val(data.height);
						$('.image_size').show();
					}	
				}
			});
		});
	});
}

function mydelete(obj) {
	var title=get_title(obj);
	var ids_to_delete=get_ids_list(obj);
	  
	var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除区块项目 ", 
	         "object"      : title,
	         "main_infor"  : "将删除所选区块，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_advertise"
	        };
	var browser='not_ie6';
	$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
}

function get_title(obj) {
	  var title='选中的区块元素'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_name').text();
}

function get_ids_list(obj) {
	  var ids_select;
	  if($('.table_li_check:checked').length) {
		  ids_select=[];
		  $('.table_li_check:checked').each(function(i){
			 var cur_id=$(this).attr('id');
			 cur_id=cur_id.replace('select_','');
			 ids_select[i]=cur_id;
		  });
		  return ids_select=ids_select.join(',');
	  } 
	  else {
		  ids_select=obj.id.split('_'); 
		  return ids_select=ids_select[0];
	  }
}

function refresh_ads_list() {
	$.ajax({
		 type: 'post',
		 url:  get_url(json_str.admin_base+'advertise/clist/ajax'),
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
				$('#add_div').slideUp();
				$('#clist_div').slideDown();	
	            initPagination();
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

function bubble_initial(obj,html) {

	 addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');   
	 obj.CreateBubblePopup({			
	     selectable: false,
		 position : 'top',
		 align	  : 'center',	
		 innerHtml:  html,
		 innerHtmlStyle: {'text-align':'left','font-size':'12px;'},	
		 themeName: 	'all-black',
		 themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
	 });
}