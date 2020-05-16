$(document).ready(function() {

	$('#fullinfor_clicker').live('click', function() {
		$('.user_more_infor').toggle();
	});
	
	$('[name="user_admin"]').live('click',function(){
		$('[name="user_level"]').attr('disabled','');
		$('[name="user_level"]').attr('checked','');
		if($(this).val()=='0') 
			$('[name="user_level"]').eq(3).attr('checked','checked');
		else 			
			$('[name="user_level"]').eq(1).attr('checked','checked');
	});
	
	$('[name="user_level"]').live('click',function(){
		$('[name="user_admin"]').attr('disabled','');
		$('[name="user_admin"]').attr('checked','');
		if($(this).val() < '2' ) 
			$('[name="user_admin"]').eq(1).attr('checked','checked');
		else 
			$('[name="user_admin"]').eq(0).attr('checked','checked');
	});
	
	$('#user_pass').live('click',function(){
		if($(this).val()=='') $(this).val(rnd_str(8,false,true,true));		
	});
	
	$('#user_pass').live('blur',function(){
		top_message('您的密码为  '+$(this).val()+' 点击提交后将生效！','','warn');
	});
	
	$('#career').live('click',function(){
        var obj=$('#career');
        $.get(get_url(json_str.base_url+'ajax/simple_viewer/show_careers'),function(data){
            simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70'); 
        });         
    });
	
	$('.career_item').live('click',function(){
		$('#career').val($(this).text());
	});
	
	$('#province').live('click',function(){
        var obj=$('#province');
        $.get(get_url(json_str.base_url+'ajax/simple_viewer/show_provinces'),function(data){
            simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'300','140'); 
        });         
    });
	
	$('.province_item').live('click',function(){
		$('#province').val($(this).text());
	});
	
	$('.my_form :input').live('click',function(){
		if($(this)!=$('#province') && $(this)!=$('#career')) 
			$("#simple_dialog").remove();
	});
	
	$('#user_submit').live('click',function(){
		var data,flag=1;
		var inputs = [];
		
		$('.my_form :input').not(':radio,:button,:checkbox').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) {
				 $(this).css({'border':'1px solid red'});
	  		     top_message('表单尚未填写完整');
			     flag=0; return false;
			}

			$(this).removeAttr('style');
		  	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if($('#user_admin_1').attr('checked') && $.trim($('#real_name').val())=='') {
			$('.user_more_infor').show();
			$('#real_name').css({'border':'1px solid red'});
			top_message('添加管理员必须填写其真实姓名！');
		    return false;
		}
		
		if(!flag) return false;
		
		$(':radio:checked,:checkbox:checked').each(function() {
	     	 inputs.push(this.name + '=' + escape(this.value));
	    });
		
	    data=inputs.join('&');
	    
	    data=data+'&user_submit=admin'; 
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.admin_base+"user_member/edit_member/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,'reload','json');
	                 }
	                 else ajax_success(data,textStatus,'','json');                
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
	
	$('#user_cancel').live('click',function(){
        refresh_user_list();       
	});
});

// str_0 长度
// str_1 是否大写字母
// str_2 是否小写字母
// str_3 是否数字
function rnd_str(str_0, str_1, str_2, str_3) {
	var Seed_array = new Array();
	var seedary;
	var i;

	Seed_array[0] = "";
	Seed_array[1] = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
	Seed_array[2] = "a b c d e f g h i j k l m n o p q r s t u v w x y z";
	Seed_array[3] = "0 1 2 3 4 5 6 7 8 9";

	if (!str_1 && !str_2 && !str_3) {
		str_1 = true;
		str_2 = true;
		str_3 = true;
	}

	if (str_1) {
		Seed_array[0] += Seed_array[1];
	}
	if (str_2) {
		Seed_array[0] += " " + Seed_array[2];
	}
	if (str_3) {
		Seed_array[0] += " " + Seed_array[3];
	}

	Seed_array[0] = Seed_array[0].split(" ");
	seedary = ""
	for (i = 0; i < str_0; i++) {
		seedary += Seed_array[0][Math.round(Math.random()
				* (Seed_array[0].length - 1))]
	}
	return (seedary);

}