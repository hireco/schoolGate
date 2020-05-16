try	{
		$(document).ready(function() {
			if(!$("#upload_crop_pannel")) window.close();
		});
}
catch (e){
		window.opener = top; //will lead to closing without any prompt.
        window.close();
}
//上面的代码作用是阻止直接访问此ajax程序的一个方法，因为此ajax脚本本身没有装载Jquery文件.
//所以如果直接访问该ajax了，系统就会出错，捕获这个错误将导致窗口直接关闭。

var imageWidth, imageHeight, t_width, t_height;
var aspectRatio;
var body_h, body_w,pannel_h,pannel_w; 
var photos = [];
var thumbnails = [];
var photo;
var thumbnail;
var action;
var refresh;

$(document).ready(function() {
	
	action=$('#action').val();
	refresh=$('#refresh').val();
	imageWidth=$("#imageWidth").val();
	imageHeight=$("#imageHeight").val();
	
	t_width=$("#t_width").val();
	t_height=$("#t_height").val();
	aspectRatio=t_width+':'+t_height; 
	
	reset_body_size();

	$('img#photo').imgAreaSelect({
		 aspectRatio : aspectRatio, 
		 handles: true,
		 disable: $("#action").val()=='upload'?true:false,	//仅仅上传图片
		 parent:  '#imgselect_div',
         fadeSpeed: 200,
		 onSelectChange: preview,
		 onSelectEnd : show_hint
	 }); //若disable: true,则imgAreaSelect取消行为

    
	
	$('#save_thumbnail').click(function() {		
		var url=$('#thumb_action').val();
		var cur_id=$(this).attr('id');
		save_area(cur_id,url);		
    });
    
	$('#save_cropimg').click(function(){
		var url=$('#crop_action').val();
		var cur_id=$(this).attr('id');
		save_area(cur_id,url);
	});
	
	$(".close_pannel").live('click',function(){
		var imgsrc;
		if($("#upload_crop_pannel").length) {
			if(action=='crop') {
				  if(refresh) {
					  imgsrc=$('#'+refresh).attr('src').split('?').shift();	
					  $('#'+refresh).attr('src',imgsrc+'?'+Math.random());
				  }
				  close_pannel(); 
			}
			else { 
				  if(!photos[0] && !thumbnails[0]) { 		         
				         ajax_success('您没有选择任何图片','','','string');
						 close_pannel();
				  }
				  else 	save_files(); 
			} 
		}
   });

});	

function save_area(obj,url) {
	
	$('img#photo').imgAreaSelect({ disable:true }); 
	$('div[class^=imgareaselect-]').hide(); 

	$('#'+obj).fadeOut(100);
	
	$('#preview img').addClass('transparent');
	$('#preview img').removeAttr("style");
	
	$.ajax({
			type : "post",
			data : "t=ajax&crop_new="+$("#crop_new").val()
			        +"&img=" + $("#image_name").val()+ "&w=" + $("#w").val() + "&h=" + $("#h").val()
			        + "&x1="+ $("#x1").val()+ "&y1=" + $("#y1").val(),
			url  : url,
			
			success : function(data,textStatus) {
				try{
					var data = eval('(' + data + ')');
				    if(data.image.simage && data.result=='1') {
						$("#thumbnail").attr("src",data.image.simage);
						$('#simage_name').val(data.image.simage_name);
					}
				    $("#thumbnail_infor").fadeIn(100).html(data.infor).fadeOut(2000);
				    $('#preview img').removeClass('transparent');
					
				    thumbnails.push($("#simage_name").val()); //将缩略图信息入栈
				}
				catch(err){
				    $("#thumbnail_infor").fadeIn(100).html('操作失败，请重试').fadeOut(2000);
				}
			},
			error  : function(XMLHttpRequest, textStatus, errorThrown) {
			    $("#thumbnail_infor").fadeIn(100).html('系统错误，请重试！').fadeOut(2000);
			}
        });		
}

function save_files() {
	var old_images;  
    var saved_images=$('#'+$('#sendback').val()).val(); 
	if($('#reserve').val()=='1') old_images='';   //如果允许反复打开板面上传，则保留之
	else old_images= $('#'+$('#sendback').val()+'_old').val();	
	
	$.ajax({
	    type : "post",
		data : "old_images="+old_images+"&thumbnails="+thumbnails.join(":")+"&photos="+photos.join(":"),
		url  : $('#clear_action').val(),
		cache: false,
		success : function(data,textStatus) {
			try{
				 data = eval('(' + data + ')');					 
				 if(data.result=='1') { 
					 var thumbnails_photos = data.image.thumbnails+'::'+data.image.photos;
					 
					 var thumbnails_path= data.image.thumbnails.split(':');
					 var photos_path =data.image.photos.split(':');
					 var thumbnails_photos_path; 
					 
					 thumbnails_path=$('#path').val()+thumbnails_path.join(':'+$('#path').val());
					 photos_path=$('#path').val()+photos_path.join(':'+$('#path').val());
					 thumbnails_photos_path=thumbnails_path+'::'+photos_path;
					 
					 if($('#reserve').val()=='1') {
						 if($('#action').val()=='upload_for_crop' || $('#action').val()=='crop') {  
							 if(saved_images) $('#'+$('#sendback').val()).val(saved_images+':'+thumbnails_path); 
							 else $('#'+$('#sendback').val()).val(thumbnails_path); 
						 }
						 else if($('#action').val()=='upload' && $('#auto_thumb').val()!='1') {
							 if(saved_images)  $('#'+$('#sendback').val()).val(saved_images+':'+photos_path);
							 else $('#'+$('#sendback').val()).val(photos_path);
						 }
						 else {
							 if(saved_images) {
								 thumbnails_photos_path=thumbnails_photos_path.split('::');
								 saved_images=saved_images.split('::');
								 $('#'+$('#sendback').val()).val(saved_images[0]+':'+thumbnails_photos_path[0]+'::'+saved_images[1]+':'+thumbnails_photos_path[1]);
							 }
							 else {
								 $('#'+$('#sendback').val()).val(thumbnails_photos_path);
							 }
						 }
					 }
					 else {
						 if($('#action').val()=='upload_for_crop' || $('#action').val()=='crop') {  
							 $('#'+$('#sendback').val()).val(thumbnails_path); 
							 $('#'+$('#sendback').val()+'_old').val(data.image.thumbnails); 
						 }
						 else if($('#action').val()=='upload' && $('#auto_thumb').val()!='1') {
							 $('#'+$('#sendback').val()).val(photos_path);
							 $('#'+$('#sendback').val()+'_old').val(data.image.photos); 
						 }
						 else {
							 $('#'+$('#sendback').val()).val(thumbnails_photos_path);
							 $('#'+$('#sendback').val()+'_old').val(thumbnails_photos);
						 }
						 
						 $('#'+$('#sendback').val()+'_show').attr("src",$('#'+$('#sendback').val()).val());
					 }
					 					 
					 ajax_success(data,'','','json');					   					 
				 }	 				 
				 else  ajax_success(data.infor,'','','string');
			 }
			 catch(err){
				 ajax_success('系统意外错误！','','','string');
			 }
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			 ajax_failed(textStatus);
		},
		complete : function() {
		     close_pannel();
		}
	 });
}

function show_hint() {
	if($("#image_name").val()) { 
		$("#thumbnail_infor").hide();
		if($('#crop_for').val()=='crop') $("#save_cropimg").html("保存所选区域").fadeIn(100);
		else $("#save_thumbnail").html("保存所选区域").fadeIn(100);
	}
	else 
		$("#thumbnail_infor").fadeIn(100).html('这是例图，请选择图片来操作').fadeOut(2000);
}

function preview(img, selection) {
    if (!selection.width || !selection.height)  return;
    
	var x1_axis = selection.x1;
	var x2_axis = selection.x2;
	var y1_axis = selection.y1;
	var y2_axis = selection.y2;
	var thumb_width = selection.width;
	var thumb_height = selection.height;
	var scaleX = t_width  / selection.width;
    var scaleY = t_height / selection.height;

	$('#x1').val(x1_axis);
	$('#y1').val(y1_axis);
	$('#x2').val(x2_axis);
	$('#y2').val(y2_axis);
	$('#w').val(thumb_width);
	$('#h').val(thumb_height); 	

	$('#preview img').css({
        width: Math.round(scaleX  * imageWidth),
        height: Math.round(scaleY * imageHeight),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });

	$("#preview_column").css("visibility","visible");
}

function  reset_body_size() {
    pannel_h=$("#upload_crop_pannel").offset().top+$("#upload_crop_pannel").height()+60;
	pannel_w=$("#upload_crop_pannel").offset().left+$("#upload_crop_pannel").width()+60;
	body_h=$('body').height();
	body_w=$('body').width();
	pannel_h >= body_h ? $('body').css("height",pannel_h+"px"):$('body').css("height","100%");
	pannel_w >= body_w ? $('body').css("width",pannel_w+"px"):$('body').css("width","100%"); 
}

function close_pannel() {
    $('#upload_crop_pannel').remove();
	$('div[class^=imgareaselect-]').hide();
	$('body').removeAttr("style");
	unblock_all();
}
