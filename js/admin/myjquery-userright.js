$(document).ready(function() {

	$('#right_submit').live('click',function(){
		var data;
		var inputs = [];
		
		$('#right_form :checkbox').each(function() {
		  	if($(this).attr('checked')) inputs.push(this.name + '=1');
		  	else inputs.push(this.name + '=0');
	    });
		  
	    data=inputs.join('&');
	    
	    data=data+'&user_id='+$('#user_id').val()+'&cms_class='+$('#cms_class').val()+'&right_submit=yes';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.admin_base+"user_right/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 ajax_success(data,textStatus,'','json');
	                 if(data.result=='1') refresh_user_list();
	              } 
	 			 catch(err){
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		         ajax_failed(textStatus);
	 		      }
	    });
	    
	});
	
	$('#right_cancel').live('click',function(){
        refresh_user_list();       
	});
	
	$('#select_all').live('click',function(){		
		var cur_val=parseInt($(this).val());
		$('#select_hint').text(cur_val?'全部取消':'点击全选');
		$('.right_checkbox').attr('checked',cur_val?false:true);
		$('#select_all').val(cur_val?'0':'1');
	});
});