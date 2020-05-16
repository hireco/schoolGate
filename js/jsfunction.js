/**
 * compute the length of  the postion of a string
 */
function p_len(str) {
	var i, sum;
	sum = 0;
	for (i = 0; i < str.length; i++) {
		if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255))
			sum = sum + 1;
		else
			sum = sum + 2;
	}
	return sum;
}

/**
 * length of a string,that's  total number of the characters
 */
function len(str) {
	return str.length;
}

/**
 * email address validation function
 */
function email_check(str) {
	var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailReg.test(str);
}

function qq_check(str) {
	var qqReg=/^[1-9]\d{4,13}$/;
	return qqReg.test(str);
}

function telephone_check(str) {
	var telReg=/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
	return telReg.test(str);
}

function cellphone_check(str) {
	var mobileReg=/^((\(\d{3}\))|(\d{3}\-))?13[0-9]{1}[0-9]{8}$|147[0-9]{8}$|15[01236789]{1}[0-9]{8}$|18[0256789]{1}[0-9]{8}$/;
	return mobileReg.test(str);
}

function url_check(str) {
	var urlReg=/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    return urlReg.test(str);
}

function num_check(str) {
	var numReg=/^\d+$/;
	return numReg.test(str);
}

function chinese_check(str) {
	var chnReg=/^[\u4E00-\u9FA5]+$/; 
	return chnReg.test(str);
}

function date_check(str) {
	var datestr=/^\d{4}-\d{2}-\d{2}$/;
	return datestr.test(str);
}

function get_url(url_str) {
	var url = url_str.replace(json_str.url_suffix, "");
	return url = url + json_str.url_suffix;
}

function speical_chars(str) {
	var iChars = " !@#$%^&*()+=-[]\\\';,./{}|\":<>?";
	for ( var i = 0; i < str.length; i++) {
		if (iChars.indexOf(str.charAt(i)) != -1) 
			return true;
	}
	return false;
}

function seo_url_check(str) {
	var seo_url_Reg = /^[a-zA-Z0-9_-]*$/;
	return seo_url_Reg.test(str);
}

function arrayRemoveByValue(arr, val) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}

function basename(str)  {
	 var ext=str.split('.').pop();  
	 var base = new String(str).substring(str.lastIndexOf('/') + 1);       
	 if(base.lastIndexOf(".") != -1)
		 base = base.substring(0, base.lastIndexOf(".")); 
	 return base+'.'+ext;  
}  

function extension(str) {
	 return str.split('.').pop(); 
}

/**
 * transfer to url after delay/1000 seconds
 */
function goto_url(url, delay) {
	setTimeout("window.location.href='" + url + "'", delay);
}

function go_back(delay) {
	if(arguments[0]) setTimeout("history.go(-1)", delay);
	else setTimeout("history.go(-1)", 1);
}

function delay_refresh(delay) {
	setTimeout("window.location.reload()", delay);
}

function refresh() {
	window.location.reload();
}

function window_open(url,width_num,height_num,full) {
	var width=arguments[1]?width_num:'1200';
	var height=arguments[2]?height_num:'600';
	var setting;
	if(!arguments[3]) setting='height='+height+', width='+width+', top=50, left=50, toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no';
	else setting='height='+height+', width='+width+', top=50, left=50,toolbar=yes, menubar=yes, scrollbars=yes,resizable=yes,location=yes, status=yes';
	window.open(url, 'newwindow', setting); 
}

function resources_is_local(str) {
	if(str.indexOf('http://')>=0 && str.indexOf(json_str.base_url)<0) return false;
	else return true;
}

function resources_is_img(str) {
	var ext=str.split('.').pop().toLocaleLowerCase();
	var arr=['jpeg','jpg','png','gif'];
	if(ext && jQuery.inArray(ext, arr)>=0) return true; 
	else return false;
}


//cookies
function getCookie(c_name){

	var arr,reg=new RegExp("(^| )"+c_name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
}

function setCookie(c_name,value,expiredays,path){

	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+((path==null) ? ";path=/" : ";path="+path);
}


function checkCookie(c_name){

	var this_name=getCookie(c_name);
	
	if (this_name!=null && this_name!="")
	  return true;
	else 
	  return false;
}

function delCookie(c_name,path) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(c_name);
	if(cval!=null)
	document.cookie= c_name + "="+cval+";expires="+exp.toGMTString()+((path==null) ? ";path=/" : ";path="+path);
}

String.prototype.replaceAll = function (str1,str2){
    
	var str    = this;     
    var result   = str.replace(eval("/"+str1+"/gi"),str2);
    return result;

}

function beforeEscape(data) {
    
	var special_chars_index=['@', '\\*', '\\/','\\+'];
	var special_chars_value=['spe_char_at','spe_char_star','spe_char_splash','spe_char_plus'];

	for (var i=0; i<special_chars_index.length; i++ ) {
	   data= data.replaceAll(special_chars_index[i],special_chars_value[i]);  
	}

	return data;
}

function flashChecker() {
	var hasFlash=0;　　　　//是否安装了flash
	var flashVersion=0;　　//flash版本

	if(document.all)
	{
		var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if(swf) {
			hasFlash=1;
			VSwf=swf.GetVariable("$version");
			flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);
		}
	}else{
		if (navigator.plugins && navigator.plugins.length > 0)
		{
			var swf=navigator.plugins["Shockwave Flash"];
			if (swf)
			{
				hasFlash=1;
				var words = swf.description.split(" ");
				for (var i = 0; i < words.length; ++i)
				{
					if (isNaN(parseInt(words[i]))) continue;
					flashVersion = parseInt(words[i]);
				}
			}
		}
	}
	return {f:hasFlash,v:flashVersion};
}

