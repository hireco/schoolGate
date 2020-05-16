$(document).ready(function(){
   	//切换标签页面
    $('.horizon_items').click(function(){
          var cur_id=$(this).attr('id').split('_');
     
          $('.horizon_items').removeClass('selected');
          $(this).addClass('selected');
	      
		  $.get(get_url(json_str.admin_base+'excel_data/'+cur_id[0]+'_data'),function(data){
		        try{ 
				   data=eval('(' + data + ')');
				   top_message(data.infor);
				}catch(err){
				    $('#data_viewer').html(data);
				}
		  });
			  
		 
	});

	//文件类型
	$('.filetype').live('click',function(){
	      $('.filetype').removeAttr('checked');
		  $(this).attr('checked','checked');
	});
	
	//导出数据操作
	$('.export_data').live('click',function(){
	      
		  var cur_id=$(this).attr('id');
		  var filetype=$('.filetype').filter(':checked').val();
		  $(this).next().text('');
		  $(this).attr('disabled',true);

		  $.post(get_url(json_str.admin_base+'excel_data/export_'+cur_id+'/savedata/'+filetype),function(data){
			  try{ 
				   data=eval('(' + data + ')');
			       if(data.result=='1')  {
				      
					  ajax_success('数据成功导出','success','current','string');
					  
					  $('#'+cur_id).removeAttr('disabled');
				      $('#clear_file').removeAttr('disabled');
				   	   
				      $('#'+cur_id).next().text('点击下载数据');
				      $('#'+cur_id).next().click(function(){
						download_file(escape(data.infor));  
				      });
			        }		
			        else top_message(data.infor);
				}catch(err){
					 $('head').append(data);
				}	  
		  });	
	 });
    
	 //文件链接显示
	 function download_file(filepath) {
	   
		 $("#fileDownFrame").attr("src",get_url(json_str.base_url+'myfile/download/'+filepath));

	 }

	 //清除文件
	 $('#clear_file').live('click',function(){
	      $.post(get_url(json_str.admin_base+'excel_data/clear_file'),function(data){
		     var num;
			 try{ 
				   data=eval('(' + data + ')');
				   if(data.result=='1')	{
				       num=parseInt(data.infor);
			           if(num > 0) {
			             $('.download_file').text('');
		                 $('#clear_result').text(data.infor+'个数据文件被删除！'); 
				         $('#clear_file').attr('disabled',true);
			          } 
			          else {
				         $('#clear_file').attr('disabled',true);
				         $('#clear_result').text('暂无数据文件！'); 
			          }
				   } else top_message(data.infor);
			 }catch(err){
				   $('head').append(data);
			 }	
		  });
	 })
	
	//导入对象选择
	$('.import_type').live('click',function(){
	      $('.import_type').removeAttr('checked');
		  $(this).attr('checked','checked');
	});

	 //上传文件

	 $('.upload_file').live('click',upload_file);

	 $('#upload_close').live('click',function(){
	 	if($('#uploaded_file_url').val()) {
			$('.step_tag').text('第二步');
			$('.import_data').after('<label>数据文件上传成功！</label>');
			$('.upload_file').slideUp();
			$('.import_data').show();
            $('.import_data').bind('click',import_data); 			
		}
	 });

});

function upload_file(){
        
	$('#upload_pannel').remove();  
	$('#uploaded_file_url').val(''); //清除数据文件
	//$('.import_type').attr('disabled',true);

    $.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    	$("body").append(data);
		block_all();
		//阻止其他操作
		//$("#upload_pannel").draggable({ cursor: 'move' });
		//可移动设置
    });
}

function import_data(){	      
	
	var filename=$('#uploaded_file_url').val();
	var table=$('.import_type:checked').val(); 
	
	$('.import_data').unbind('click');
		
	if(filename)  $.post(get_url(json_str.admin_base+'excel_data/import_'+table),{filename : filename},function(data){
		  
		  try{ 
			   data=eval('(' + data + ')');
			   if(data.result=='1')	{
			        $('.my_form_item').remove();
					$('#data_viewer').html('<div style="font-size:14px; font-weight:bold; padding:20px;">恭喜！数据导入成功！点击继续导入！</div>');
			   }
			   else 
					   top_message(data.infor);
		 }catch(err){
				   $('head').append(data);
		 }
			 
    });
}
	  