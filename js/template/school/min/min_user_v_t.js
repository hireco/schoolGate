/*!
 * jQuery blockUI plugin
 * Version 2.38 (29-MAR-2011)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2010 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function($) {

if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
	alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
	return;
}

$.fn._fadeIn = $.fn.fadeIn;

var noOp = function() {};

// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
// retarded userAgent strings on Vista)
var mode = document.documentMode || 0;
var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

// global $ methods for blocking/unblocking the entire page
$.blockUI   = function(opts) { install(window, opts); };
$.unblockUI = function(opts) { remove(window, opts); };

// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
$.growlUI = function(title, message, timeout, onClose) {
	var $m = $('<div class="growlUI"></div>');
	if (title) $m.append('<h1>'+title+'</h1>');
	if (message) $m.append('<h2>'+message+'</h2>');
	if (timeout == undefined) timeout = 3000;
	$.blockUI({
		message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
		timeout: timeout, showOverlay: false,
		onUnblock: onClose, 
		css: $.blockUI.defaults.growlCSS
	});
};

// plugin method for blocking element content
$.fn.block = function(opts) {
	return this.unblock({ fadeOut: 0 }).each(function() {
		if ($.css(this,'position') == 'static')
			this.style.position = 'relative';
		if ($.browser.msie)
			this.style.zoom = 1; // force 'hasLayout'
		install(this, opts);
	});
};

// plugin method for unblocking element content
$.fn.unblock = function(opts) {
	return this.each(function() {
		remove(this, opts);
	});
};

$.blockUI.version = 2.38; // 2nd generation blocking at no extra cost!

// override these in your code to change the default behavior and style
$.blockUI.defaults = {
	// message displayed when blocking (use null for no message)
	message:  '<h1>Please wait...</h1>',

	title: null,	  // title string; only used when theme == true
	draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)
	
	theme: false, // set to true to use with jQuery UI themes
	
	// styles for the message when blocking; if you wish to disable
	// these and use an external stylesheet then do this in your code:
	// $.blockUI.defaults.css = {};
	css: {
		padding:	0,
		margin:		0,
		width:		'30%',
		top:		'40%',
		left:		'35%',
		textAlign:	'center',
		color:		'#000',
		border:		'3px solid #aaa',
		backgroundColor:'#fff',
		cursor:		'wait'
	},
	
	// minimal style set used when themes are used
	themedCSS: {
		width:	'30%',
		top:	'40%',
		left:	'35%'
	},

	// styles for the overlay
	overlayCSS:  {
		backgroundColor: '#000',
		opacity:	  	 0.6,
		cursor:		  	 'wait'
	},

	// styles applied when using $.growlUI
	growlCSS: {
		width:  	'350px',
		top:		'10px',
		left:   	'',
		right:  	'10px',
		border: 	'none',
		padding:	'5px',
		opacity:	0.6,
		cursor: 	'default',
		color:		'#fff',
		backgroundColor: '#000',
		'-webkit-border-radius': '10px',
		'-moz-border-radius':	 '10px',
		'border-radius': 		 '10px'
	},
	
	// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
	// (hat tip to Jorge H. N. de Vasconcelos)
	iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

	// force usage of iframe in non-IE browsers (handy for blocking applets)
	forceIframe: false,

	// z-index for the blocking overlay
	baseZ: 1000,

	// set these to true to have the message automatically centered
	centerX: true, // <-- only effects element blocking (page block controlled via css above)
	centerY: true,

	// allow body element to be stetched in ie6; this makes blocking look better
	// on "short" pages.  disable if you wish to prevent changes to the body height
	allowBodyStretch: true,

	// enable if you want key and mouse events to be disabled for content that is blocked
	bindEvents: true,

	// be default blockUI will supress tab navigation from leaving blocking content
	// (if bindEvents is true)
	constrainTabKey: true,

	// fadeIn time in millis; set to 0 to disable fadeIn on block
	fadeIn:  200,

	// fadeOut time in millis; set to 0 to disable fadeOut on unblock
	fadeOut:  400,

	// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
	timeout: 0,

	// disable if you don't want to show the overlay
	showOverlay: true,

	// if true, focus will be placed in the first available input field when
	// page blocking
	focusInput: true,

	// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
	applyPlatformOpacityRules: true,
	
	// callback method invoked when fadeIn has completed and blocking message is visible
	onBlock: null,

	// callback method invoked when unblocking has completed; the callback is
	// passed the element that has been unblocked (which is the window object for page
	// blocks) and the options that were passed to the unblock call:
	//	 onUnblock(element, options)
	onUnblock: null,

	// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
	quirksmodeOffsetHack: 4,

	// class name of the message block
	blockMsgClass: 'blockMsg'
};

// private data and functions follow...

var pageBlock = null;
var pageBlockEls = [];

function install(el, opts) {
	var full = (el == window);
	var msg = opts && opts.message !== undefined ? opts.message : undefined;
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
	var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
	var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
	msg = msg === undefined ? opts.message : msg;

	// remove the current block (if there is one)
	if (full && pageBlock)
		remove(window, {fadeOut:0});

	// if an existing element is being used as the blocking content then we capture
	// its current place in the DOM (and current display style) so we can restore
	// it when we unblock
	if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
		var node = msg.jquery ? msg[0] : msg;
		var data = {};
		$(el).data('blockUI.history', data);
		data.el = node;
		data.parent = node.parentNode;
		data.display = node.style.display;
		data.position = node.style.position;
		if (data.parent)
			data.parent.removeChild(node);
	}

	var z = opts.baseZ;

	// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
	// layer1 is the iframe layer which is used to supress bleed through of underlying content
	// layer2 is the overlay layer which has opacity and a wait cursor (by default)
	// layer3 is the message content that is displayed while blocking

	var lyr1 = ($.browser.msie || opts.forceIframe) 
		? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');
	
	var lyr2 = opts.theme 
	 	? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>')
	 	: $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

	var lyr3, s;
	if (opts.theme && full) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:fixed">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (opts.theme) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:absolute">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (full) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+z+';display:none;position:fixed"></div>';
	}			
	else {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+z+';display:none;position:absolute"></div>';
	}
	lyr3 = $(s);

	// if we have a message, style it
	if (msg) {
		if (opts.theme) {
			lyr3.css(themedCSS);
			lyr3.addClass('ui-widget-content');
		}
		else 
			lyr3.css(css);
	}

	// style the overlay
	if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
		lyr2.css(opts.overlayCSS);
	lyr2.css('position', full ? 'fixed' : 'absolute');

	// make iframe layer transparent in IE
	if ($.browser.msie || opts.forceIframe)
		lyr1.css('opacity',0.0);

	//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
	var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
	$.each(layers, function() {
		this.appendTo($par);
	});
	
	if (opts.theme && opts.draggable && $.fn.draggable) {
		lyr3.draggable({
			handle: '.ui-dialog-titlebar',
			cancel: 'li'
		});
	}

	// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
	var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
	if (ie6 || expr) {
		// give body 100% height
		if (full && opts.allowBodyStretch && $.boxModel)
			$('html,body').css('height','100%');

		// fix ie6 issue when blocked element has a border width
		if ((ie6 || !$.boxModel) && !full) {
			var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
			var fixT = t ? '(0 - '+t+')' : 0;
			var fixL = l ? '(0 - '+l+')' : 0;
		}

		// simulate fixed position
		$.each([lyr1,lyr2,lyr3], function(i,o) {
			var s = o[0].style;
			s.position = 'absolute';
			if (i < 2) {
				full ? s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
					 : s.setExpression('height','this.parentNode.offsetHeight + "px"');
				full ? s.setExpression('width','jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width','this.parentNode.offsetWidth + "px"');
				if (fixL) s.setExpression('left', fixL);
				if (fixT) s.setExpression('top', fixT);
			}
			else if (opts.centerY) {
				if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
				s.marginTop = 0;
			}
			else if (!opts.centerY && full) {
				var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
				var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
				s.setExpression('top',expression);
			}
		});
	}

	// show the message
	if (msg) {
		if (opts.theme)
			lyr3.find('.ui-widget-content').append(msg);
		else
			lyr3.append(msg);
		if (msg.jquery || msg.nodeType)
			$(msg).show();
	}

	if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
		lyr1.show(); // opacity is zero
	if (opts.fadeIn) {
		var cb = opts.onBlock ? opts.onBlock : noOp;
		var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
		var cb2 = msg ? cb : noOp;
		if (opts.showOverlay)
			lyr2._fadeIn(opts.fadeIn, cb1);
		if (msg)
			lyr3._fadeIn(opts.fadeIn, cb2);
	}
	else {
		if (opts.showOverlay)
			lyr2.show();
		if (msg)
			lyr3.show();
		if (opts.onBlock)
			opts.onBlock();
	}

	// bind key and mouse events
	bind(1, el, opts);

	if (full) {
		pageBlock = lyr3[0];
		pageBlockEls = $(':input:enabled:visible',pageBlock);
		if (opts.focusInput)
			setTimeout(focus, 20);
	}
	else
		center(lyr3[0], opts.centerX, opts.centerY);

	if (opts.timeout) {
		// auto-unblock
		var to = setTimeout(function() {
			full ? $.unblockUI(opts) : $(el).unblock(opts);
		}, opts.timeout);
		$(el).data('blockUI.timeout', to);
	}
};

// remove the block
function remove(el, opts) {
	var full = (el == window);
	var $el = $(el);
	var data = $el.data('blockUI.history');
	var to = $el.data('blockUI.timeout');
	if (to) {
		clearTimeout(to);
		$el.removeData('blockUI.timeout');
	}
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	bind(0, el, opts); // unbind events
	
	var els;
	if (full) // crazy selector to handle odd field errors in ie6/7
		els = $('body').children().filter('.blockUI').add('body > .blockUI');
	else
		els = $('.blockUI', el);

	if (full)
		pageBlock = pageBlockEls = null;

	if (opts.fadeOut) {
		els.fadeOut(opts.fadeOut);
		setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
	}
	else
		reset(els, data, opts, el);
};

// move blocking element back into the DOM where it started
function reset(els,data,opts,el) {
	els.each(function(i,o) {
		// remove via DOM calls so we don't lose event handlers
		if (this.parentNode)
			this.parentNode.removeChild(this);
	});

	if (data && data.el) {
		data.el.style.display = data.display;
		data.el.style.position = data.position;
		if (data.parent)
			data.parent.appendChild(data.el);
		$(el).removeData('blockUI.history');
	}

	if (typeof opts.onUnblock == 'function')
		opts.onUnblock(el,opts);
};

// bind/unbind the handler
function bind(b, el, opts) {
	var full = el == window, $el = $(el);

	// don't bother unbinding if there is nothing to unbind
	if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
		return;
	if (!full)
		$el.data('blockUI.isBlocked', b);

	// don't bind events when overlay is not in use or if bindEvents is false
	if (!opts.bindEvents || (b && !opts.showOverlay)) 
		return;

	// bind anchors and inputs for mouse and key events
	var events = 'mousedown mouseup keydown keypress';
	b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

// former impl...
//	   var $e = $('a,:input');
//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
};

// event handler to suppress keyboard/mouse events when blocking
function handler(e) {
	// allow tab navigation (conditionally)
	if (e.keyCode && e.keyCode == 9) {
		if (pageBlock && e.data.constrainTabKey) {
			var els = pageBlockEls;
			var fwd = !e.shiftKey && e.target === els[els.length-1];
			var back = e.shiftKey && e.target === els[0];
			if (fwd || back) {
				setTimeout(function(){focus(back)},10);
				return false;
			}
		}
	}
	var opts = e.data;
	// allow events within the message content
	if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
		return true;

	// allow events for content that is not being blocked
	return $(e.target).parents().children().filter('div.blockUI').length == 0;
};

function focus(back) {
	if (!pageBlockEls)
		return;
	var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
	if (e)
		e.focus();
};

function center(el, x, y) {
	var p = el.parentNode, s = el.style;
	var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
	var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
	if (x) s.left = l > 0 ? (l+'px') : '0';
	if (y) s.top  = t > 0 ? (t+'px') : '0';
};

function sz(el, p) {
	return parseInt($.css(el,p))||0;
};

})(jQuery);/**
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

/**
 * function of jquery by Snellings Cheng
 * commonly used by front part of the web
 * @param data
 */

var mouse_is_inside = false;

$(document).ready(function(){

	chk_if_logged();

	$('.float_pannel .closer').live('click',function(){
		$(this).parent().remove();
		unblock_all();
	});
	
	$(".simple_dialog div.closer").live('click',function(){
		$(this).parent().remove();		
	});
	
	$(".simple_dialog").live({
	   mouseenter: function(){
		 mouse_is_inside = true;
	   },
	   mouseleave: function(){
		 mouse_is_inside = false; 
	   }
	});

    $("body").click(function(){ 
    	if(! mouse_is_inside)  $('.simple_dialog').remove();
    });
	
	$('.navibar .navi_list').last().css('border-bottom','none');

	$('.logout_link').live('click',function(){
		$.post(get_url(json_str.base_url+'logout/ajax'),function(data){
			if(data=='1') 
				top_message('正在退出，稍候......',my_reload,'okay');
			else { 
				set_log_state(false);
				top_message('您没有登录，无需退出！','','warn');
			}
		});		
	});
	
	$('.goback_link').live('click',function(){
		remove_pannel('reg_log_pannel');
		$('#body').unblock();
		history.go(-1);
	});
	
	$('.not_found').closest('body').fadeOut(3000,function(){
		location.replace(json_str.base_url);
	});
	
	//wrap导航中的文本节点，确保对齐. 
	/*
	$('.page_navi').contents().wrap('<span></span>');
	$('.page_navi a').unwrap();
	//后来发现，可以利用vertical-align:baseline解决此问题，故取消此操作
	*/

	$('span.hot,span.isnew').each(function(){
		$(this).height($(this).parent().height());
	});
	
	//对缩略图的处理
	$('.thumb_wrapper img').each(function(){
		var imgsrc=$(this).attr('src');		 
		var imgWidth  = $(this).parent().width();
		var imgHeight = $(this).parent().height();

		var curWidth =  $(this).width();    // 图片当前宽度
        var curHeight = $(this).height();   // 图片当前高度

		var ratio = 0;

		if(resources_is_img(imgsrc)){
		    if(curWidth < imgWidth) {
				ratio = imgWidth / curWidth;
				$(this).width(imgWidth);
				curHeight = curHeight * ratio;
				$(this).height(curHeight);
			}
			if(curHeight < imgHeight) {
				ratio = imgHeight / curHeight;
				$(this).Height(imgHeight);
				curWidth = curWidth * ratio;
				$(this).width(curWidth);
			}
			
			curWidth =  $(this).width();    // 图片当前宽度
            curHeight = $(this).height();   // 图片当前高度			
			
			if($.browser.msie) {
		       if(parseFloat($.browser.version)<9.0) return true; 
			   //注意 return true means continue and return false means break 
	        }
			
			$(this).parent().css('background-image','url('+imgsrc+')');
			$(this).parent().css('background-size', curWidth+'px'+' '+curHeight+'px'); 
			$(this).parent().css({'width':imgWidth+'px','height':imgHeight+'px'}); 
			$(this).remove();
		}
		else {
			$(this).parent().css('background-color','#ffffff');
			$(this).parent().css('background-image','url('+json_str.base_url+'skin/images/no_image.jpg)'); 
			$(this).remove();
		}
		
	});
	 

	//当重新操作时，去掉提示框
	$('input').live('change',function(){	    
	   	$(".message_top").remove();
	});
});


function my_reload() {
	window.location.reload();
}

function my_close() {
	window.close();
}

function block_all(msg){	
	var show_msg=arguments[0]?arguments[0]:null;
	$('#body').block({message: show_msg,overlayCSS: {opacity: 0.2}});
}

function unblock_all(){	
	$('#body').unblock();
}

function float_pannel(obj_id,data,block,top_p,left_p) {
	var left, top;
	var obj_id=arguments[0]?obj_id:'random_'+parseInt(10*Math.random());
	var data= arguments[1]?data:'';
	
	if(arguments[2]=='block') block_all();
	
	$('body').append('<div id="'+obj_id+'" class="float_pannel hide">'+data+'</div>');
	top=arguments[3]?top_p:Math.round(($('body').height()-$('#'+obj_id).height())/2);
	left=arguments[4]?left_p:Math.round(($('body').width()-$('#'+obj_id).width())/2);
	$('#'+obj_id).css({'left':left+'px','top': top+'px'}).show();

	$('#'+obj_id).draggable({ cursor: 'move' });
	
}

function remove_pannel(obj_id) {
	$('#'+obj_id).remove();
	unblock_all();
}

function show_reg_pannel() {
	
	remove_pannel('reg_log_pannel');
	
	if($('.reg_log_form').filter('.reg_form').length) return false;
	
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged) $.get(get_url(json_str.base_url+'register/logout'),function(data){
				float_pannel('reg_log_pannel',data,'block','200'); 
			});
		else  $.get(get_url(json_str.base_url+'register/ajax'),function(data){
				float_pannel('reg_log_pannel',data,'block','200'); 
			});
	});
}

function show_log_pannel(){
	
	remove_pannel('reg_log_pannel');
	
	if($('.reg_log_form').filter('.log_form').length) return false;	
	
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged)  $.get(get_url(json_str.base_url+'login/logout'),function(data){
			float_pannel('reg_log_pannel',data,'block','200'); 
		});	
		else  $.get(get_url(json_str.base_url+'login/ajax'),function(data){
			float_pannel('reg_log_pannel',data,'block','200'); 
		});
	});
}

function set_log_state(data) {
		if(data.logged)  {
			$('#unlogged_state').hide();
			$('#logged_state').html(data.logged_state).show();
		}
		else  {
			$('#logged_state').hide();
			$('#unlogged_state').show();
		}
}

function chk_if_logged() {
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		try{
			data=eval('(' + data + ')');
			set_log_state(data);
			add_editor_link(data.logged);
		}
		catch(e) {
			top_message('系统有错误，请稍后再试');
		}
	});
}


function add_editor_link(logged) {

	if(!logged) return false;

	if($('.infors .source').length) {
		$.post(get_url(json_str.base_url+'ajax/cms_ajax/add_editor_link'),{index_id: $('#entry_id').val()},function(data){
			$('.infors .source').after(data);
		})
	}
}

function top_message(msg,callback,addclass,bgcolor,ftcolor,bdcolor) {
	var scrolltop = $(document).scrollTop();
	var flag=arguments[1]?true:false;
	var bg,ft,wd,ht,bd;
	
	$(".message_top").remove();
	$("body").prepend('<div class="message_top"><div class="icon"></div><div class="hint_text">'+msg+'</div></div>');
	$('.message_top').prepend('<div class="rt_corner"></div>');
	
	bg=arguments[3]?arguments[3]:$(".message_top").css("background-color");
	ft=arguments[4]?arguments[4]:$(".message_top").css("color");
	bd=arguments[5]?arguments[5]:$(".message_top").css("border");
	
	wd=$(".message_top").width();
	ht=$(".message_top").height();
	
	wd=-parseInt(wd/2); 
	ht=-parseInt(ht/2)+scrolltop; 
	//-ht/2 makes its center point's position just at the site set in css file.
	//+scrolltop makes it changing with the scroll which happens before it shows.

	$('.message_top').draggable({ cursor: 'move' });
	
	$('.rt_corner').click(
		function(){$(this).parent().remove();
	});

	arguments[2]?$(".message_top .icon").addClass(addclass):$(".message_top .icon").addClass('error');

	$(".message_top").css({'border-color' : bd, 'background-color' : bg, 'color' : ft, 'margin-left' : wd+'px', 'margin-top' : ht+'px' });

	if(flag)  $(".message_top").fadeOut(1000,callback);
	else $(".message_top").fadeOut(20000);
}

function  simple_dialog(x_pos,y_pos,data,width,height) {
	$('.simple_dialog').remove();
	$('body').append('<div class="simple_dialog"></div>');
	$('.simple_dialog').html('<div class="closer"></div>');
	$('.simple_dialog').append(data);
	$('.simple_dialog').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('.simple_dialog').css({"width":width});
	if(arguments[4]) $('.simple_dialog').css({"height":height});
	$('.simple_dialog').delay(5000).fadeOut(3000);

	$('.simple_dialog').draggable({ cursor: 'move' });
}

function ajax_success(response,textStatus,url,dataType) {	
	var dataType= arguments[0]?(arguments[3]?dataType:'json_string'):'string';	
	//必须放在前面！如果放在下句的后面，因为在下句后，arguments[0]变成了非空。

	var response= arguments[0]?response:'无返回信息'; 
	var textStatus= arguments[1]?textStatus:'success';
	var url= arguments[2]?url:'';

	if(response && textStatus=='success') {//此为ajax成功被执行之意，不是指达到操作目的
	    
		if(dataType=='string')   { 
			if(response=='null') 
			return msg_callback(url);  //指定不显示任何效果
			
			if(textStatus=='0') top_message(response,url?function(){ msg_callback(url); }:'','error');
			else top_message(response,url?function(){ msg_callback(url); }:'','okay');
			return;
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是html和json_string,则为json类型。
		
		if(data.infor=='null') 
			return msg_callback(url);  //指定不显示任何效果

		if(data.result=='0') { 			
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','fail');	
			// 不能直接回调函数本身，因为会导致top_message的效果丢失

			else  top_message('发生错误!',url?function(){ msg_callback(url); }:'','fail');
		}		
	    else if(data.result=='1') { 	    	
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','okay');
			else top_message('操作完成!',url?function(){ msg_callback(url);}:'','okay');
		}
	}
	else  top_message(response,url?function(){ msg_callback(url);}:'','error');
}	
//回调函数本可以直接带参数调用，不需要用function(data){ myfunction(data)}的繁琐方式
//但是，如果主调函数是有效果的，这样做效果将失去，因此这里都乖乖的用这种繁琐形式了！


function ajax_failed(textStatus,url) {
	var url= arguments[0]?url:'';
	if(textStatus=='error') top_message('系统错误，请稍后重试！',url?function(){msg_callback(url); }:'','error');
}

function msg_callback(url){
	var url= arguments[0]?url:'';
	if(url=='current')  return;
	else if(url=='reload')  my_reload();
	else if(url!='')  goto_url(url,1000);
}

function set_style(obj,type) {
	if(type=='error') {
		obj.addClass('error');	      		 
  		obj.nextAll().remove();
  		obj.after('<div class="form_error"> </div>');
	}
	else {
		obj.removeClass('error');
     	obj.nextAll().remove();
		obj.after('<div class="form_ok"> </div>');
	}
}

function remove_style(obj) {
	obj.removeClass('error');
	obj.removeClass('ok');
 	obj.nextAll().remove();
}

function chk_captcha(obj_id) {
	if(!arguments[0]) obj_id='captcha';
	$('#'+obj_id).live('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_captcha'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 set_style(obj,'error');
					 top_message('验证码输入错误');
				 }
				 else set_style(obj,'ok');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
}

function show_comment_form(object,type,parent) {
	if($('.comment_form').length) $.post(get_url(json_str.base_url+'comment/comment_form/'),{object_id:object,object_type: type,parent_id: parent}, function(data){
		$('.comment_form').html(data);
	});
}

function show_comment_list(object,type) {
	if($('.comment_list').length) $.post(get_url(json_str.base_url+'comment/comment_list/'),{object_id:object,object_type: type}, function(data){
		$('.comment_list').html(data);
		$('.comment_parent_id').each(function(){
			var parent_id=$(this).text();
			var cur_div=$(this).parent();
			if(parent_id!='0'){
				cur_div.append('<div class="comment_parent"></div>');
				$('#comment_'+parent_id).children().eq(2).clone().prependTo(cur_div.children().filter('.comment_parent'));
				$('#comment_'+parent_id).children().eq(1).clone().prependTo(cur_div.children().filter('.comment_parent'));
			}
		});
		$('.comment_parent .reply_comment').remove();
	});
}

function addcss2head(cssfile) {
	if($('link').filter('[href$="'+cssfile+'"]').length==0){
	   $('head').append('<link rel="stylesheet"  type="text/css"  href="'+json_str.base_url+cssfile+'" />');
    }
}

function  show_ajax_loading(x_pos,y_pos) {
	$('.wait_loading').remove();
	$('body').append('<div class="wait_loading"></div>');
	$('.wait_loading').css({"left":x_pos,"top":y_pos});
}

function remove_ajax_loading() {
	$('.wait_loading').remove();
}$(document).ready(function(){
	
	$('.topmenu').each(function(){
	   var stdlen=4;   //一级菜单标准字数为4个
	   var strlen=$(this).children().eq(0).text().length;
	   var cur_width=$(this).width();
	   var add=strlen*15-stdlen*15;
	   
	   if(strlen!=stdlen) {
		   $(this).width(cur_width+add);
		   $(this).find('a,ul,li').each(function(){
				var cur_width=$(this).width();
				$(this).width(cur_width+add);
		   });
	   }
	});

    $('.topmenu').mouseover(function(){
		$(this).children().filter('a').addClass('current');
	    $(this).children().filter('ul').show();
	});
	$('.topmenu').mouseout(function(){
	    $(this).children().filter('a').removeClass('current');
		$('.submenu').hide();
	});
	
	$('#form_opener').click(function(){
	   $('#top_navi').hide();
	   $('#form_opened').show();
	});

	if($('.reg_log_form').filter('.reg_form').length) $('#register_button').hide();
	
	$('#register_button').click(function(){
		show_reg_pannel();
	});
	
	$('#login_button').click(function(){
		show_log_pannel();
	});
	
	$('#chkstr').click(function(){
	   var left= Math.round($(this).offset().left);
	   var top = Math.round($(this).offset().top+20);
	   $('#chkimg').remove();
	   $('#body').append('<img id="chkimg" src="'+json_str.base_url+'chkimg/?rnd='+Math.random()+'" />');
	   $('#chkimg').css({'left': left+'px' ,'top' : top + 'px'}).show();
	});
	
	$('#chkstr').blur(function(){
		$('#chkimg').slideUp();
	});
	
	$('#header :input').not('#chkstr').change(function(){
		if($.trim($(this).val())=='') easy_css_msg($(this),'error');
		else easy_css_msg($(this),'ok');
	});
	
	chk_imgstr('chkstr');
	
	$('#login_submit').click(function(event){
		
		setTimeout(slogin_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function slogin_validation() {
		
		var data,flag=1;
		
		$('#header :input').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) { 
				easy_css_msg($(this),'error');
				top_message('请填写完整再提交');  
				flag=0;
				return false;
			}
			
			if($(this).hasClass('error')) {
				top_message('填写有错误，请检查！');
				flag=0;  return false;
			}
		});
		
		if(!flag) return false;
	    
	    data='user_name='+$('#username').val()+'&user_pass='+$('#password').val()+'&captcha='+$('#chkstr').val()+'&log_submit=slogin';
	    data=data+'&ajax=1';
	    
	    $.ajax({
	   	    type: 'post',
	        url:   get_url(json_str.base_url+"login/submit"),
	        data:  data,
	        success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,json_str.base_url,'json');
	                 }
	                 else ajax_success(data,textStatus,'','json');                
	              } 
	 			 catch(err){
	 				 //alert(data);
	 				 ajax_success('操作失败，请重试！',textStatus,'','string');
	              }
	 	   },
	 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
	 		         ajax_failed(textStatus);
	 		      }
	    });
	}
});

function easy_css_msg(obj,type) {
	if(type=='error') 
		obj.addClass('error');	
	else 
		obj.removeClass('error');
}

function chk_imgstr(obj_id) {
	if(!arguments[0]) obj_id='chkstr';
	$('#'+obj_id).live('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'chkimg/input_chk'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 easy_css_msg(obj,'error');
				 }
				 else easy_css_msg(obj,'ok');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
}
﻿Calendar = function (firstDayOfWeek, dateStr, onSelected, onClose) {this.activeDiv = null;this.currentDateEl = null;this.getDateStatus = null;
this.getDateToolTip = null;this.getDateText = null;
this.timeout = null;this.onSelected = onSelected || null;
this.onClose = onClose || null;
this.dragging = false;
this.hidden = false;
this.minYear = 1970;
this.maxYear = 2050;
this.dateFormat = Calendar._TT["DEF_DATE_FORMAT"];
this.ttDateFormat = Calendar._TT["TT_DATE_FORMAT"];
this.isPopup = true;
this.weekNumbers = true;
this.firstDayOfWeek = typeof firstDayOfWeek == "number" ? firstDayOfWeek : Calendar._FD; 
this.showsOtherMonths = false;
this.dateStr = dateStr;
this.ar_days = null;
this.showsTime = false;
this.time24 = true;
this.yearStep = 2;
this.hiliteToday = true;
this.multiple = null;this.table = null;
this.element = null;
this.tbody = null;this.firstdayname = null;this.monthsCombo = null;this.yearsCombo = null;this.hilitedMonth = null;this.activeMonth = null;this.hilitedYear = null;
this.activeYear = null;this.dateClicked = false;
if (typeof Calendar._SDN == "undefined") {if (typeof Calendar._SDN_len == "undefined")Calendar._SDN_len = 3;var ar = new Array();for (var i = 8; i > 0;) {ar[--i] = Calendar._DN[i].substr(0, Calendar._SDN_len);}Calendar._SDN = ar;if (typeof Calendar._SMN_len == "undefined")Calendar._SMN_len = 3;ar = new Array();for (var i = 12; i > 0;) {ar[--i] = Calendar._MN[i].substr(0, Calendar._SMN_len);}Calendar._SMN = ar;}};Calendar._C = null;Calendar.is_ie = ( /msie/i.test(navigator.userAgent) &&   !/opera/i.test(navigator.userAgent) );Calendar.is_ie5 = ( Calendar.is_ie && /msie 5\.0/i.test(navigator.userAgent) );Calendar.is_opera = /opera/i.test(navigator.userAgent);Calendar.is_khtml = /Konqueror|Safari|KHTML/i.test(navigator.userAgent);Calendar.getAbsolutePos = function(el) {var SL = 0, ST = 0;var is_div = /^div$/i.test(el.tagName);if (is_div && el.scrollLeft)SL = el.scrollLeft;if (is_div && el.scrollTop)ST = el.scrollTop;var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };if (el.offsetParent) {var tmp = this.getAbsolutePos(el.offsetParent);r.x += tmp.x;r.y += tmp.y;}return r;};Calendar.isRelated = function (el, evt) {var related = evt.relatedTarget;if (!related) {var type = evt.type;if (type == "mouseover") {related = evt.fromElement;} else if (type == "mouseout") {related = evt.toElement;}}while (related) {if (related == el) {return true;}related = related.parentNode;}return false;};Calendar.removeClass = function(el, className) {if (!(el && el.className)) {return;}var cls = el.className.split(" ");var ar = new Array();for (var i = cls.length; i > 0;) {if (cls[--i] != className) {ar[ar.length] = cls[i];}}el.className = ar.join(" ");};Calendar.addClass = function(el, className) {Calendar.removeClass(el, className);el.className += " " + className;};Calendar.getElement = function(ev) {var f = Calendar.is_ie ? window.event.srcElement : ev.currentTarget;while (f.nodeType != 1 || /^div$/i.test(f.tagName))f = f.parentNode;return f;};Calendar.getTargetElement = function(ev) {var f = Calendar.is_ie ? window.event.srcElement : ev.target;while (f.nodeType != 1)f = f.parentNode;return f;};Calendar.stopEvent = function(ev) {ev || (ev = window.event);if (Calendar.is_ie) {ev.cancelBubble = true;ev.returnValue = false;} else {ev.preventDefault();ev.stopPropagation();}return false;};Calendar.addEvent = function(el, evname, func) {if (el.attachEvent) { el.attachEvent("on" + evname, func);} else if (el.addEventListener) { el.addEventListener(evname, func, true);} else {el["on" + evname] = func;}};Calendar.removeEvent = function(el, evname, func) {if (el.detachEvent) { el.detachEvent("on" + evname, func);} else if (el.removeEventListener) { el.removeEventListener(evname, func, true);} else {el["on" + evname] = null;}};Calendar.createElement = function(type, parent) {var el = null;if (document.createElementNS) {el = document.createElementNS("http://www.w3.org/1999/xhtml", type);} else {el = document.createElement(type);}if (typeof parent != "undefined") {parent.appendChild(el);}return el;};Calendar._add_evs = function(el) {with (Calendar) {addEvent(el, "mouseover", dayMouseOver);addEvent(el, "mousedown", dayMouseDown);addEvent(el, "mouseout", dayMouseOut);if (is_ie) {addEvent(el, "dblclick", dayMouseDblClick);el.setAttribute("unselectable", true);}}};Calendar.findMonth = function(el) {if (typeof el.month != "undefined") {return el;} else if (typeof el.parentNode.month != "undefined") {return el.parentNode;}return null;};Calendar.findYear = function(el) {if (typeof el.year != "undefined") {return el;} else if (typeof el.parentNode.year != "undefined") {return el.parentNode;}return null;};Calendar.showMonthsCombo = function () {var cal = Calendar._C;if (!cal) {return false;}var cal = cal;var cd = cal.activeDiv;var mc = cal.monthsCombo;if (cal.hilitedMonth) {Calendar.removeClass(cal.hilitedMonth, "hilite");}if (cal.activeMonth) {Calendar.removeClass(cal.activeMonth, "active");}var mon = cal.monthsCombo.getElementsByTagName("div")[cal.date.getMonth()];Calendar.addClass(mon, "active");cal.activeMonth = mon;var s = mc.style;s.display = "block";if (cd.navtype < 0)s.left = cd.offsetLeft + "px";else {var mcw = mc.offsetWidth;if (typeof mcw == "undefined")mcw = 50;s.left = (cd.offsetLeft + cd.offsetWidth - mcw) + "px";}s.top = (cd.offsetTop + cd.offsetHeight) + "px";};Calendar.showYearsCombo = function (fwd) {var cal = Calendar._C;if (!cal) {return false;}var cal = cal;var cd = cal.activeDiv;var yc = cal.yearsCombo;if (cal.hilitedYear) {Calendar.removeClass(cal.hilitedYear, "hilite");}if (cal.activeYear) {Calendar.removeClass(cal.activeYear, "active");}cal.activeYear = null;var Y = cal.date.getFullYear() + (fwd ? 1 : -1);var yr = yc.firstChild;var show = false;for (var i = 12; i > 0; --i) {if (Y >= cal.minYear && Y <= cal.maxYear) {yr.innerHTML = Y;yr.year = Y;yr.style.display = "block";show = true;} else {yr.style.display = "none";}yr = yr.nextSibling;Y += fwd ? cal.yearStep : -cal.yearStep;}if (show) {var s = yc.style;s.display = "block";if (cd.navtype < 0)s.left = cd.offsetLeft + "px";else {var ycw = yc.offsetWidth;if (typeof ycw == "undefined")ycw = 50;s.left = (cd.offsetLeft + cd.offsetWidth - ycw) + "px";}s.top = (cd.offsetTop + cd.offsetHeight) + "px";}};Calendar.tableMouseUp = function(ev) {var cal = Calendar._C;if (!cal) {return false;}if (cal.timeout) {clearTimeout(cal.timeout);}var el = cal.activeDiv;if (!el) {return false;}var target = Calendar.getTargetElement(ev);ev || (ev = window.event);Calendar.removeClass(el, "active");if (target == el || target.parentNode == el) {Calendar.cellClick(el, ev);}var mon = Calendar.findMonth(target);var date = null;if (mon) {date = new Date(cal.date);if (mon.month != date.getMonth()) {date.setMonth(mon.month);cal.setDate(date);cal.dateClicked = false;cal.callHandler();}} else {var year = Calendar.findYear(target);if (year) {date = new Date(cal.date);if (year.year != date.getFullYear()) {date.setFullYear(year.year);cal.setDate(date);cal.dateClicked = false;cal.callHandler();}}}with (Calendar) {removeEvent(document, "mouseup", tableMouseUp);removeEvent(document, "mouseover", tableMouseOver);removeEvent(document, "mousemove", tableMouseOver);cal._hideCombos();_C = null;return stopEvent(ev);}};Calendar.tableMouseOver = function (ev) {var cal = Calendar._C;if (!cal) {return;}var el = cal.activeDiv;var target = Calendar.getTargetElement(ev);if (target == el || target.parentNode == el) {Calendar.addClass(el, "hilite active");Calendar.addClass(el.parentNode, "rowhilite");} else {if (typeof el.navtype == "undefined" || (el.navtype != 50 && (el.navtype == 0 || Math.abs(el.navtype) > 2)))Calendar.removeClass(el, "active");Calendar.removeClass(el, "hilite");Calendar.removeClass(el.parentNode, "rowhilite");}ev || (ev = window.event);if (el.navtype == 50 && target != el) {var pos = Calendar.getAbsolutePos(el);var w = el.offsetWidth;var x = ev.clientX;var dx;var decrease = true;if (x > pos.x + w) {dx = x - pos.x - w;decrease = false;} elsedx = pos.x - x;if (dx < 0) dx = 0;var range = el._range;var current = el._current;var count = Math.floor(dx / 10) % range.length;for (var i = range.length; --i >= 0;)if (range[i] == current)
break;
while (count-- > 0)
if (decrease) {
if (--i < 0)
i = range.length - 1;
} else if ( ++i >= range.length )
i = 0;
var newval = range[i];
el.innerHTML = newval;cal.onUpdateTime();
}
var mon = Calendar.findMonth(target);
if (mon) {
if (mon.month != cal.date.getMonth()) {
if (cal.hilitedMonth) {
Calendar.removeClass(cal.hilitedMonth, "hilite");
}
Calendar.addClass(mon, "hilite");
cal.hilitedMonth = mon;
} else if (cal.hilitedMonth) {
Calendar.removeClass(cal.hilitedMonth, "hilite");
}
} else {
if (cal.hilitedMonth) {Calendar.removeClass(cal.hilitedMonth, "hilite");}var year = Calendar.findYear(target);if (year) {if (year.year != cal.date.getFullYear()) {if (cal.hilitedYear) {Calendar.removeClass(cal.hilitedYear, "hilite");}Calendar.addClass(year, "hilite");cal.hilitedYear = year;} else if (cal.hilitedYear) {Calendar.removeClass(cal.hilitedYear, "hilite");}} else if (cal.hilitedYear) {Calendar.removeClass(cal.hilitedYear, "hilite");}}return Calendar.stopEvent(ev);};Calendar.tableMouseDown = function (ev) {if (Calendar.getTargetElement(ev) == Calendar.getElement(ev)) {return Calendar.stopEvent(ev);}};Calendar.calDragIt = function (ev) {var cal = Calendar._C;if (!(cal && cal.dragging)) {return false;}var posX;var posY;if (Calendar.is_ie) {posY = window.event.clientY + document.body.scrollTop;posX = window.event.clientX + document.body.scrollLeft;} else {posX = ev.pageX;posY = ev.pageY;}cal.hideShowCovered();var st = cal.element.style;st.left = (posX - cal.xOffs) + "px";st.top = (posY - cal.yOffs) + "px";return Calendar.stopEvent(ev);};Calendar.calDragEnd = function (ev) {var cal = Calendar._C;if (!cal) {return false;}cal.dragging = false;with (Calendar) {removeEvent(document, "mousemove", calDragIt);removeEvent(document, "mouseup", calDragEnd);tableMouseUp(ev);}cal.hideShowCovered();};Calendar.dayMouseDown = function(ev) {var el = Calendar.getElement(ev);
if (el.disabled) {
return false;
}
var cal = el.calendar;
cal.activeDiv = el;
Calendar._C = cal;
if (el.navtype != 300) with (Calendar) {
if (el.navtype == 50) {
el._current = el.innerHTML;
addEvent(document, "mousemove", tableMouseOver);
} else
addEvent(document, Calendar.is_ie5 ? "mousemove" : "mouseover", tableMouseOver);
addClass(el, "hilite active");
addEvent(document, "mouseup", tableMouseUp);
} else if (cal.isPopup) {
cal._dragStart(ev);
}
if (el.navtype == -1 || el.navtype == 1) {
if (cal.timeout) clearTimeout(cal.timeout);
cal.timeout = setTimeout("Calendar.showMonthsCombo()", 250);
} else if (el.navtype == -2 || el.navtype == 2) {
if (cal.timeout) clearTimeout(cal.timeout);
cal.timeout = setTimeout((el.navtype > 0) ? "Calendar.showYearsCombo(true)" : "Calendar.showYearsCombo(false)", 250);
} else {
cal.timeout = null;
}
return Calendar.stopEvent(ev);
};Calendar.dayMouseDblClick = function(ev) {
Calendar.cellClick(Calendar.getElement(ev), ev || window.event);
if (Calendar.is_ie) {
document.selection.empty();
}
};Calendar.dayMouseOver = function(ev) {
var el = Calendar.getElement(ev);
if (Calendar.isRelated(el, ev) || Calendar._C || el.disabled) {
return false;
}
if (el.ttip) {
if (el.ttip.substr(0, 1) == "_") {
el.ttip = el.caldate.print(el.calendar.ttDateFormat) + el.ttip.substr(1);
}
el.calendar.tooltips.innerHTML = el.ttip;
}
if (el.navtype != 300) {
Calendar.addClass(el, "hilite");
if (el.caldate) {
Calendar.addClass(el.parentNode, "rowhilite");
}
}
return Calendar.stopEvent(ev);
};Calendar.dayMouseOut = function(ev) {
with (Calendar) {
var el = getElement(ev);
if (isRelated(el, ev) || _C || el.disabled)
return false;
removeClass(el, "hilite");
if (el.caldate)
removeClass(el.parentNode, "rowhilite");
if (el.calendar)
el.calendar.tooltips.innerHTML = _TT["SEL_DATE"];
return stopEvent(ev);
}
};
Calendar.cellClick = function(el, ev) {
var cal = el.calendar;
var closing = false;
var newdate = false;
var date = null;
if (typeof el.navtype == "undefined") {
if (cal.currentDateEl) {
Calendar.removeClass(cal.currentDateEl, "selected");
Calendar.addClass(el, "selected");
closing = (cal.currentDateEl == el);
if (!closing) {
cal.currentDateEl = el;
}
}
cal.date.setDateOnly(el.caldate);
date = cal.date;
var other_month = !(cal.dateClicked = !el.otherMonth);
if (!other_month && !cal.currentDateEl)
cal._toggleMultipleDate(new Date(date));
else
newdate = !el.disabled;if (other_month)
cal._init(cal.firstDayOfWeek, date);
} else {
if (el.navtype == 200) {
Calendar.removeClass(el, "hilite");
cal.callCloseHandler();
return;
}
date = new Date(cal.date);
if (el.navtype == 0)
date.setDateOnly(new Date()); 
cal.dateClicked = false;
var year = date.getFullYear();
var mon = date.getMonth();
function setMonth(m) {
var day = date.getDate();
var max = date.getMonthDays(m);
if (day > max) {
date.setDate(max);
}
date.setMonth(m);
};
switch (el.navtype) {
    case 400:
Calendar.removeClass(el, "hilite");
var text = Calendar._TT["ABOUT"];
if (typeof text != "undefined") {
text += cal.showsTime ? Calendar._TT["ABOUT_TIME"] : "";
} else {text = "Help and about box text is not translated into this language.\n" +
"If you know this language and you feel generous please update\n" +
"the corresponding file in \"lang\" subdir to match calendar-en.js\n" +
"and send it back to <mihai_bazon@yahoo.com> to get it into the distribution  ;-)\n\n" +
"Thank you!\n" +
"http://dynarch.com/mishoo/calendar.epl\n";
}
alert(text);
return;
    case -2:
if (year > cal.minYear) {
date.setFullYear(year - 1);
}
break;
    case -1:
if (mon > 0) {
setMonth(mon - 1);
} else if (year-- > cal.minYear) {
date.setFullYear(year);
setMonth(11);
}
break;
    case 1:
if (mon < 11) {
setMonth(mon + 1);
} else if (year < cal.maxYear) {
date.setFullYear(year + 1);
setMonth(0);
}
break;
    case 2:
if (year < cal.maxYear) {
date.setFullYear(year + 1);
}
break;
    case 100:
cal.setFirstDayOfWeek(el.fdow);
return;
    case 50:
var range = el._range;
var current = el.innerHTML;
for (var i = range.length; --i >= 0;)
if (range[i] == current)
break;
if (ev && ev.shiftKey) {
if (--i < 0)
i = range.length - 1;
} else if ( ++i >= range.length )
i = 0;
var newval = range[i];
el.innerHTML = newval;
cal.onUpdateTime();
return;
    case 0:if ((typeof cal.getDateStatus == "function") &&
    cal.getDateStatus(date, date.getFullYear(), date.getMonth(), date.getDate())) {
return false;
}
break;
}
if (!date.equalsTo(cal.date)) {
cal.setDate(date);
newdate = true;
} else if (el.navtype == 0)
newdate = closing = true;
}
if (newdate) {
ev && cal.callHandler();
}
if (closing) {
Calendar.removeClass(el, "hilite");
ev && cal.callCloseHandler();
}
};
Calendar.prototype.create = function (_par) {
var parent = null;
if (! _par) {
parent = document.getElementsByTagName("body")[0];
this.isPopup = true;
} else {
parent = _par;
this.isPopup = false;
}
this.date = this.dateStr ? new Date(this.dateStr) : new Date();var table = Calendar.createElement("table");
this.table = table;
table.cellSpacing = 0;
table.cellPadding = 0;
table.calendar = this;
Calendar.addEvent(table, "mousedown", Calendar.tableMouseDown);var div = Calendar.createElement("div");
this.element = div;
div.className = "calendar";
if (this.isPopup) {
div.style.position = "absolute";
div.style.display = "none";
}
div.appendChild(table);var thead = Calendar.createElement("thead", table);
var cell = null;
var row = null;var cal = this;
var hh = function (text, cs, navtype) {
cell = Calendar.createElement("td", row);
cell.colSpan = cs;
cell.className = "button";
if (navtype != 0 && Math.abs(navtype) <= 2)
cell.className += " nav";
Calendar._add_evs(cell);
cell.calendar = cal;
cell.navtype = navtype;
cell.innerHTML = "<div unselectable='on'>" + text + "</div>";
return cell;
};row = Calendar.createElement("tr", thead);
var title_length = 6;
(this.isPopup) && --title_length;
(this.weekNumbers) && ++title_length;hh("<div>?</div>", 1, 400).ttip = Calendar._TT["INFO"];
this.title = hh("", title_length, 300);
this.title.className = "title";
if (this.isPopup) {
this.title.ttip = Calendar._TT["DRAG_TO_MOVE"];
this.title.style.cursor = "move";
hh("&#x00d7;", 1, 200).ttip = Calendar._TT["CLOSE"];
}row = Calendar.createElement("tr", thead);
row.className = "headrow";this._nav_py = hh("&#x00ab;", 1, -2);
this._nav_py.ttip = Calendar._TT["PREV_YEAR"];this._nav_pm = hh("‹", 1, -1);
this._nav_pm.ttip = Calendar._TT["PREV_MONTH"];this._nav_now = hh(Calendar._TT["TODAY"], this.weekNumbers ? 4 : 3, 0);
this._nav_now.ttip = Calendar._TT["GO_TODAY"];this._nav_nm = hh("›", 1, 1);
this._nav_nm.ttip = Calendar._TT["NEXT_MONTH"];this._nav_ny = hh("&#x00bb;", 1, 2);
this._nav_ny.ttip = Calendar._TT["NEXT_YEAR"];
row = Calendar.createElement("tr", thead);
row.className = "daynames";
if (this.weekNumbers) {
cell = Calendar.createElement("td", row);
cell.className = "name wn";
cell.innerHTML = "<div>"+Calendar._TT["WK"]+"</div>";
}
for (var i = 7; i > 0; --i) {
cell = Calendar.createElement("td", row);
if (!i) {
cell.navtype = 100;
cell.calendar = this;
Calendar._add_evs(cell);
}
}
this.firstdayname = (this.weekNumbers) ? row.firstChild.nextSibling : row.firstChild;
this._displayWeekdays();var tbody = Calendar.createElement("tbody", table);
this.tbody = tbody;for (i = 6; i > 0; --i) {
row = Calendar.createElement("tr", tbody);
if (this.weekNumbers) {
cell = Calendar.createElement("td", row);
}
for (var j = 7; j > 0; --j) {
cell = Calendar.createElement("td", row);
cell.calendar = this;
Calendar._add_evs(cell);
}
}if (this.showsTime) {
row = Calendar.createElement("tr", tbody);
row.className = "time";cell = Calendar.createElement("td", row);
cell.className = "time";
cell.colSpan = 2;
cell.innerHTML = Calendar._TT["TIME"] || "&nbsp;";cell = Calendar.createElement("td", row);
cell.className = "time";
cell.colSpan = this.weekNumbers ? 4 : 3;(function(){
function makeTimePart(className, init, range_start, range_end) {
var part = Calendar.createElement("span", cell);
part.className = className;
part.innerHTML = init;
part.calendar = cal;
part.ttip = Calendar._TT["TIME_PART"];
part.navtype = 50;
part._range = [];
if (typeof range_start != "number")
part._range = range_start;
else {
for (var i = range_start; i <= range_end; ++i) {
var txt;
if (i < 10 && range_end >= 10) txt = '0' + i;
else txt = '' + i;
part._range[part._range.length] = txt;
}
}
Calendar._add_evs(part);
return part;
};
var hrs = cal.date.getHours();
var mins = cal.date.getMinutes();
var t12 = !cal.time24;
var pm = (hrs > 12);
if (t12 && pm) hrs -= 12;
var H = makeTimePart("hour", hrs, t12 ? 1 : 0, t12 ? 12 : 23);
var span = Calendar.createElement("span", cell);
span.innerHTML = ":";
span.className = "colon";
var M = makeTimePart("minute", mins, 0, 59);
var AP = null;
cell = Calendar.createElement("td", row);
cell.className = "time";
cell.colSpan = 2;
if (t12)
AP = makeTimePart("ampm", pm ? "pm" : "am", ["am", "pm"]);
else
cell.innerHTML = "&nbsp;";cal.onSetTime = function() {
var pm, hrs = this.date.getHours(),
mins = this.date.getMinutes();
if (t12) {
pm = (hrs >= 12);
if (pm) hrs -= 12;
if (hrs == 0) hrs = 12;
AP.innerHTML = pm ? "pm" : "am";
}
H.innerHTML = (hrs < 10) ? ("0" + hrs) : hrs;
M.innerHTML = (mins < 10) ? ("0" + mins) : mins;
};cal.onUpdateTime = function() {
var date = this.date;
var h = parseInt(H.innerHTML, 10);
if (t12) {
if (/pm/i.test(AP.innerHTML) && h < 12)
h += 12;
else if (/am/i.test(AP.innerHTML) && h == 12)
h = 0;
}
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
date.setHours(h);
date.setMinutes(parseInt(M.innerHTML, 10));
date.setFullYear(y);
date.setMonth(m);
date.setDate(d);
this.dateClicked = false;
this.callHandler();
};
})();
} else {
this.onSetTime = this.onUpdateTime = function() {};
}var tfoot = Calendar.createElement("tfoot", table);row = Calendar.createElement("tr", tfoot);
row.className = "footrow";cell = hh(Calendar._TT["SEL_DATE"], this.weekNumbers ? 8 : 7, 300);
cell.className = "ttip";
if (this.isPopup) {
cell.ttip = Calendar._TT["DRAG_TO_MOVE"];
cell.style.cursor = "move";
}
this.tooltips = cell;div = Calendar.createElement("div", this.element);
this.monthsCombo = div;
div.className = "combo";
for (i = 0; i < Calendar._MN.length; ++i) {
var mn = Calendar.createElement("div");
mn.className = Calendar.is_ie ? "label-IEfix" : "label";
mn.month = i;
mn.innerHTML = Calendar._SMN[i];
div.appendChild(mn);
}div = Calendar.createElement("div", this.element);
this.yearsCombo = div;
div.className = "combo";
for (i = 12; i > 0; --i) {
var yr = Calendar.createElement("div");
yr.className = Calendar.is_ie ? "label-IEfix" : "label";
div.appendChild(yr);
}this._init(this.firstDayOfWeek, this.date);
parent.appendChild(this.element);
};
Calendar._keyEvent = function(ev) {
var cal = window._dynarch_popupCalendar;
if (!cal || cal.multiple)
return false;
(Calendar.is_ie) && (ev = window.event);
var act = (Calendar.is_ie || ev.type == "keypress"),
K = ev.keyCode;
if (ev.ctrlKey) {
switch (K) {
    case 37: 
act && Calendar.cellClick(cal._nav_pm);
break;
    case 38: 
act && Calendar.cellClick(cal._nav_py);
break;
    case 39: 
act && Calendar.cellClick(cal._nav_nm);
break;
    case 40: 
act && Calendar.cellClick(cal._nav_ny);
break;
    default:
return false;
}
} else switch (K) {
    case 32: 
Calendar.cellClick(cal._nav_now);
break;
    case 27: 
act && cal.callCloseHandler();
break;
    case 37: 
    case 38: 
    case 39: 
    case 40: 
if (act) {
var prev, x, y, ne, el, step;
prev = K == 37 || K == 38;
step = (K == 37 || K == 39) ? 1 : 7;
function setVars() {
el = cal.currentDateEl;
var p = el.pos;
x = p & 15;
y = p >> 4;
ne = cal.ar_days[y][x];
};setVars();
function prevMonth() {
var date = new Date(cal.date);
date.setDate(date.getDate() - step);
cal.setDate(date);
};
function nextMonth() {
var date = new Date(cal.date);
date.setDate(date.getDate() + step);
cal.setDate(date);
};
while (1) {
switch (K) {
    case 37: 
if (--x >= 0)
ne = cal.ar_days[y][x];
else {
x = 6;
K = 38;
continue;
}
break;
    case 38: 
if (--y >= 0)
ne = cal.ar_days[y][x];
else {
prevMonth();
setVars();
}
break;
    case 39: 
if (++x < 7)
ne = cal.ar_days[y][x];
else {
x = 0;
K = 40;
continue;
}
break;
    case 40: 
if (++y < cal.ar_days.length)
ne = cal.ar_days[y][x];
else {
nextMonth();
setVars();
}
break;
}
break;
}
if (ne) {
if (!ne.disabled)
Calendar.cellClick(ne);
else if (prev)
prevMonth();
else
nextMonth();
}
}
break;
    case 13: 
if (act)
Calendar.cellClick(cal.currentDateEl, ev);
break;
    default:
return false;
}
return Calendar.stopEvent(ev);
};
Calendar.prototype._init = function (firstDayOfWeek, date) {
var today = new Date(),
TY = today.getFullYear(),
TM = today.getMonth(),
TD = today.getDate();
this.table.style.visibility = "hidden";
var year = date.getFullYear();
if (year < this.minYear) {
year = this.minYear;
date.setFullYear(year);
} else if (year > this.maxYear) {
year = this.maxYear;
date.setFullYear(year);
}
this.firstDayOfWeek = firstDayOfWeek;
this.date = new Date(date);
var month = date.getMonth();
var mday = date.getDate();
var no_days = date.getMonthDays();
date.setDate(1);
var day1 = (date.getDay() - this.firstDayOfWeek) % 7;
if (day1 < 0)
day1 += 7;
date.setDate(-day1);
date.setDate(date.getDate() + 1);var row = this.tbody.firstChild;
var MN = Calendar._SMN[month];
var ar_days = this.ar_days = new Array();
var weekend = Calendar._TT["WEEKEND"];
var dates = this.multiple ? (this.datesCells = {}) : null;
for (var i = 0; i < 6; ++i, row = row.nextSibling) {
var cell = row.firstChild;
if (this.weekNumbers) {
cell.className = "day wn";
cell.innerHTML = "<div>"+date.getWeekNumber()+"</div>";
cell = cell.nextSibling;
}
row.className = "daysrow";
var hasdays = false, iday, dpos = ar_days[i] = [];
for (var j = 0; j < 7; ++j, cell = cell.nextSibling, date.setDate(iday + 1)) {
iday = date.getDate();
var wday = date.getDay();
cell.className = "day";
cell.pos = i << 4 | j;
dpos[j] = cell;
var current_month = (date.getMonth() == month);
if (!current_month) {
if (this.showsOtherMonths) {
cell.className += " othermonth";
cell.otherMonth = true;
} else {
cell.className = "emptycell";
cell.innerHTML = "&nbsp;";
cell.disabled = true;
continue;
}
} else {
cell.otherMonth = false;
hasdays = true;
}
cell.disabled = false;
cell.innerHTML = this.getDateText ? this.getDateText(date, iday) : iday;
if (dates)
dates[date.print("%Y%m%d")] = cell;
if (this.getDateStatus) {
var status = this.getDateStatus(date, year, month, iday);
if (this.getDateToolTip) {
var toolTip = this.getDateToolTip(date, year, month, iday);
if (toolTip)
cell.title = toolTip;
}
if (status === true) {
cell.className += " disabled";
cell.disabled = true;
} else {
if (/disabled/i.test(status))
cell.disabled = true;
cell.className += " " + status;
}
}
if (!cell.disabled) {
cell.caldate = new Date(date);
cell.ttip = "_";
if (!this.multiple && current_month
    && iday == mday && this.hiliteToday) {
cell.className += " selected";
this.currentDateEl = cell;
}
if (date.getFullYear() == TY &&
    date.getMonth() == TM &&
    iday == TD) {
cell.className += " today";
cell.ttip += Calendar._TT["PART_TODAY"];
}
if (weekend.indexOf(wday.toString()) != -1)
cell.className += cell.otherMonth ? " oweekend" : " weekend";
}
}
if (!(hasdays || this.showsOtherMonths))
row.className = "emptyrow";
}
this.title.innerHTML = Calendar._MN[month] + ", " + year;
this.onSetTime();
this.table.style.visibility = "visible";
this._initMultipleDates();
};Calendar.prototype._initMultipleDates = function() {
if (this.multiple) {
for (var i in this.multiple) {
var cell = this.datesCells[i];
var d = this.multiple[i];
if (!d)
continue;
if (cell)
cell.className += " selected";
}
}
};Calendar.prototype._toggleMultipleDate = function(date) {
if (this.multiple) {
var ds = date.print("%Y%m%d");
var cell = this.datesCells[ds];
if (cell) {
var d = this.multiple[ds];
if (!d) {
Calendar.addClass(cell, "selected");
this.multiple[ds] = date;
} else {
Calendar.removeClass(cell, "selected");
delete this.multiple[ds];
}
}
}
};Calendar.prototype.setDateToolTipHandler = function (unaryFunction) {
this.getDateToolTip = unaryFunction;
};
Calendar.prototype.setDate = function (date) {
if (!date.equalsTo(this.date)) {
this._init(this.firstDayOfWeek, date);
}
};
Calendar.prototype.refresh = function () {
this._init(this.firstDayOfWeek, this.date);
};
Calendar.prototype.setFirstDayOfWeek = function (firstDayOfWeek) {
this._init(firstDayOfWeek, this.date);
this._displayWeekdays();
};
Calendar.prototype.setDateStatusHandler = Calendar.prototype.setDisabledHandler = function (unaryFunction) {
this.getDateStatus = unaryFunction;
};
Calendar.prototype.setRange = function (a, z) {
this.minYear = a;
this.maxYear = z;
};
Calendar.prototype.callHandler = function () {
if (this.onSelected) {
this.onSelected(this, this.date.print(this.dateFormat));
}
};
Calendar.prototype.callCloseHandler = function () {
if (this.onClose) {
this.onClose(this);
}
this.hideShowCovered();
};
Calendar.prototype.destroy = function () {
var el = this.element.parentNode;
el.removeChild(this.element);
Calendar._C = null;
window._dynarch_popupCalendar = null;
};
Calendar.prototype.reparent = function (new_parent) {
var el = this.element;
el.parentNode.removeChild(el);
new_parent.appendChild(el);
};
Calendar._checkCalendar = function(ev) {
var calendar = window._dynarch_popupCalendar;
if (!calendar) {
return false;
}
var el = Calendar.is_ie ? Calendar.getElement(ev) : Calendar.getTargetElement(ev);
for (; el != null && el != calendar.element; el = el.parentNode);
if (el == null) {window._dynarch_popupCalendar.callCloseHandler();
return Calendar.stopEvent(ev);
}
};
Calendar.prototype.show = function () {
var rows = this.table.getElementsByTagName("tr");
for (var i = rows.length; i > 0;) {
var row = rows[--i];
Calendar.removeClass(row, "rowhilite");
var cells = row.getElementsByTagName("td");
for (var j = cells.length; j > 0;) {
var cell = cells[--j];
Calendar.removeClass(cell, "hilite");
Calendar.removeClass(cell, "active");
}
}
this.element.style.display = "block";
this.hidden = false;
if (this.isPopup) {
window._dynarch_popupCalendar = this;
Calendar.addEvent(document, "keydown", Calendar._keyEvent);
Calendar.addEvent(document, "keypress", Calendar._keyEvent);
Calendar.addEvent(document, "mousedown", Calendar._checkCalendar);
}
this.hideShowCovered();
};
Calendar.prototype.hide = function () {
if (this.isPopup) {
Calendar.removeEvent(document, "keydown", Calendar._keyEvent);
Calendar.removeEvent(document, "keypress", Calendar._keyEvent);
Calendar.removeEvent(document, "mousedown", Calendar._checkCalendar);
}
this.element.style.display = "none";
this.hidden = true;
this.hideShowCovered();
};Calendar.prototype.showAt = function (x, y) {
var s = this.element.style;
s.left = x + "px";
s.top = y + "px";
this.show();
};
Calendar.prototype.showAtElement = function (el, opts) {
var self = this;
var p = Calendar.getAbsolutePos(el);
if (!opts || typeof opts != "string") {
this.showAt(p.x, p.y + el.offsetHeight);
return true;
}
function fixPosition(box) {
if (box.x < 0)
box.x = 0;
if (box.y < 0)
box.y = 0;
var cp = document.createElement("div");
var s = cp.style;
s.position = "absolute";
s.right = s.bottom = s.width = s.height = "0px";
document.body.appendChild(cp);
var br = Calendar.getAbsolutePos(cp);
document.body.removeChild(cp);
if (Calendar.is_ie) {
br.y += document.body.scrollTop;
br.x += document.body.scrollLeft;
} else {
br.y += window.scrollY;
br.x += window.scrollX;
}
var tmp = box.x + box.width - br.x;
if (tmp > 0) box.x -= tmp;
tmp = box.y + box.height - br.y;
if (tmp > 0) box.y -= tmp;
};
this.element.style.display = "block";
Calendar.continuation_for_the_fucking_khtml_browser = function() {
var w = self.element.offsetWidth;
var h = self.element.offsetHeight;
self.element.style.display = "none";
var valign = opts.substr(0, 1);
var halign = "l";
if (opts.length > 1) {
halign = opts.substr(1, 1);
}switch (valign) {
    case "T": p.y -= h; break;
    case "B": p.y += el.offsetHeight; break;
    case "C": p.y += (el.offsetHeight - h) / 2; break;
    case "t": p.y += el.offsetHeight - h; break;
    case "b": break; 
}switch (halign) {
    case "L": p.x -= w; break;
    case "R": p.x += el.offsetWidth; break;
    case "C": p.x += (el.offsetWidth - w) / 2; break;
    case "l": p.x += el.offsetWidth - w; break;
    case "r": break; 
}
p.width = w;
p.height = h + 40;
self.monthsCombo.style.display = "none";
fixPosition(p);
self.showAt(p.x, p.y);
};
if (Calendar.is_khtml)
setTimeout("Calendar.continuation_for_the_fucking_khtml_browser()", 10);
else
Calendar.continuation_for_the_fucking_khtml_browser();
};
Calendar.prototype.setDateFormat = function (str) {
this.dateFormat = str;
};
Calendar.prototype.setTtDateFormat = function (str) {
this.ttDateFormat = str;
};
Calendar.prototype.parseDate = function(str, fmt) {
if (!fmt)
fmt = this.dateFormat;
this.setDate(Date.parseDate(str, fmt));
};
Calendar.prototype.hideShowCovered = function () {
if (!Calendar.is_ie && !Calendar.is_opera)
return;
function getVisib(obj){
var value = obj.style.visibility;
if (!value) {
if (document.defaultView && typeof (document.defaultView.getComputedStyle) == "function") { 
if (!Calendar.is_khtml)
value = document.defaultView.
getComputedStyle(obj, "").getPropertyValue("visibility");
else
value = '';
} else if (obj.currentStyle) { 
value = obj.currentStyle.visibility;
} else
value = '';
}
return value;
};var tags = new Array("applet", "iframe", "select");
var el = this.element;var p = Calendar.getAbsolutePos(el);
var EX1 = p.x;
var EX2 = el.offsetWidth + EX1;
var EY1 = p.y;
var EY2 = el.offsetHeight + EY1;for (var k = tags.length; k > 0; ) {
var ar = document.getElementsByTagName(tags[--k]);
var cc = null;for (var i = ar.length; i > 0;) {
cc = ar[--i];p = Calendar.getAbsolutePos(cc);
var CX1 = p.x;
var CX2 = cc.offsetWidth + CX1;
var CY1 = p.y;
var CY2 = cc.offsetHeight + CY1;if (this.hidden || (CX1 > EX2) || (CX2 < EX1) || (CY1 > EY2) || (CY2 < EY1)) {
if (!cc.__msh_save_visibility) {
cc.__msh_save_visibility = getVisib(cc);
}
cc.style.visibility = cc.__msh_save_visibility;
} else {
if (!cc.__msh_save_visibility) {
cc.__msh_save_visibility = getVisib(cc);
}
cc.style.visibility = "hidden";
}
}
}
};
Calendar.prototype._displayWeekdays = function () {
var fdow = this.firstDayOfWeek;
var cell = this.firstdayname;
var weekend = Calendar._TT["WEEKEND"];
for (var i = 0; i < 7; ++i) {
cell.className = "day name";
var realday = (i + fdow) % 7;
if (i) {
cell.ttip = Calendar._TT["DAY_FIRST"].replace("%s", Calendar._DN[realday]);
cell.navtype = 100;
cell.calendar = this;
cell.fdow = realday;
Calendar._add_evs(cell);
}
if (weekend.indexOf(realday.toString()) != -1) {
Calendar.addClass(cell, "weekend");
}
cell.innerHTML = Calendar._SDN[(i + fdow) % 7];
cell = cell.nextSibling;
}
};
Calendar.prototype._hideCombos = function () {
this.monthsCombo.style.display = "none";
this.yearsCombo.style.display = "none";
};
Calendar.prototype._dragStart = function (ev) {
if (this.dragging) {
return;
}
this.dragging = true;
var posX;
var posY;
if (Calendar.is_ie) {
posY = window.event.clientY + document.body.scrollTop;
posX = window.event.clientX + document.body.scrollLeft;
} else {
posY = ev.clientY + window.scrollY;
posX = ev.clientX + window.scrollX;
}
var st = this.element.style;
this.xOffs = posX - parseInt(st.left);
this.yOffs = posY - parseInt(st.top);
with (Calendar) {
addEvent(document, "mousemove", calDragIt);
addEvent(document, "mouseup", calDragEnd);
}
};
Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR   = 60 * Date.MINUTE;
Date.DAY    = 24 * Date.HOUR;
Date.WEEK   =  7 * Date.DAY;Date.parseDate = function(str, fmt) {
var today = new Date();
var y = 0;
var m = -1;
var d = 0;
var a = str.split(/\W+/);
var b = fmt.match(/%./g);
var i = 0, j = 0;
var hr = 0;
var min = 0;
for (i = 0; i < a.length; ++i) {
if (!a[i])
continue;
switch (b[i]) {
    case "%d":
    case "%e":
d = parseInt(a[i], 10);
break;    case "%m":
m = parseInt(a[i], 10) - 1;
break;    case "%Y":
    case "%y":
y = parseInt(a[i], 10);
(y < 100) && (y += (y > 29) ? 1900 : 2000);
break;    case "%b":
    case "%B":
for (j = 0; j < 12; ++j) {
if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { m = j; break; }
}
break;    case "%H":
    case "%I":
    case "%k":
    case "%l":
hr = parseInt(a[i], 10);
break;    case "%P":
    case "%p":
if (/pm/i.test(a[i]) && hr < 12)
hr += 12;
else if (/am/i.test(a[i]) && hr >= 12)
hr -= 12;
break;    case "%M":
min = parseInt(a[i], 10);
break;
}
}
if (isNaN(y)) y = today.getFullYear();
if (isNaN(m)) m = today.getMonth();
if (isNaN(d)) d = today.getDate();
if (isNaN(hr)) hr = today.getHours();
if (isNaN(min)) min = today.getMinutes();
if (y != 0 && m != -1 && d != 0)
return new Date(y, m, d, hr, min, 0);
y = 0; m = -1; d = 0;
for (i = 0; i < a.length; ++i) {
if (a[i].search(/[a-zA-Z]+/) != -1) {
var t = -1;
for (j = 0; j < 12; ++j) {
if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { t = j; break; }
}
if (t != -1) {
if (m != -1) {
d = m+1;
}
m = t;
}
} else if (parseInt(a[i], 10) <= 12 && m == -1) {
m = a[i]-1;
} else if (parseInt(a[i], 10) > 31 && y == 0) {
y = parseInt(a[i], 10);
(y < 100) && (y += (y > 29) ? 1900 : 2000);
} else if (d == 0) {
d = a[i];
}
}
if (y == 0)
y = today.getFullYear();
if (m != -1 && d != 0)
return new Date(y, m, d, hr, min, 0);
return today;
};
Date.prototype.getMonthDays = function(month) {
var year = this.getFullYear();
if (typeof month == "undefined") {
month = this.getMonth();
}
if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) {
return 29;
} else {
return Date._MD[month];
}
};
Date.prototype.getDayOfYear = function() {
var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
var time = now - then;
return Math.floor(time / Date.DAY);
};
Date.prototype.getWeekNumber = function() {
var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
var DoW = d.getDay();
d.setDate(d.getDate() - (DoW + 6) % 7 + 3); 
var ms = d.valueOf(); 
d.setMonth(0);
d.setDate(4); 
return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};
Date.prototype.equalsTo = function(date) {
return ((this.getFullYear() == date.getFullYear()) &&
(this.getMonth() == date.getMonth()) &&
(this.getDate() == date.getDate()) &&
(this.getHours() == date.getHours()) &&
(this.getMinutes() == date.getMinutes()));
};
Date.prototype.setDateOnly = function(date) {
var tmp = new Date(date);
this.setDate(1);
this.setFullYear(tmp.getFullYear());
this.setMonth(tmp.getMonth());
this.setDate(tmp.getDate());
};
Date.prototype.print = function (str) {
var m = this.getMonth();
var d = this.getDate();
var y = this.getFullYear();
var wn = this.getWeekNumber();
var w = this.getDay();
var s = {};
var hr = this.getHours();
var pm = (hr >= 12);
var ir = (pm) ? (hr - 12) : hr;
var dy = this.getDayOfYear();
if (ir == 0)
ir = 12;
var min = this.getMinutes();
var sec = this.getSeconds();
s["%a"] = Calendar._SDN[w];s["%A"] = Calendar._DN[w];s["%b"] = Calendar._SMN[m];s["%B"] = Calendar._MN[m]; s["%C"] = 1 + Math.floor(y / 100);s["%d"] = (d < 10) ? ("0" + d) : d;s["%e"] = d;s["%H"] = (hr < 10) ? ("0" + hr) : hr;s["%I"] = (ir < 10) ? ("0" + ir) : ir;s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;s["%k"] = hr;
s["%l"] = ir;
s["%m"] = (m < 9) ? ("0" + (1+m)) : (1+m);s["%M"] = (min < 10) ? ("0" + min) : min;s["%n"] = "\n";
s["%p"] = pm ? "PM" : "AM";
s["%P"] = pm ? "pm" : "am";
s["%s"] = Math.floor(this.getTime() / 1000);
s["%S"] = (sec < 10) ? ("0" + sec) : sec;s["%t"] = "\t";s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
s["%u"] = w + 1;
s["%w"] = w;
s["%y"] = ('' + y).substr(2, 2);s["%Y"] = y;
s["%%"] = "%";
var re = /%./g;
if (!Calendar.is_ie5 && !Calendar.is_khtml)
return str.replace(re, function (par) { return s[par] || par; });var a = str.match(re);
for (var i = 0; i < a.length; i++) {
var tmp = s[a[i]];
if (tmp) {
re = new RegExp(a[i], 'g');
str = str.replace(re, tmp);
}
}return str;
};Date.prototype.__msh_oldSetFullYear = Date.prototype.setFullYear;
Date.prototype.setFullYear = function(y) {
var d = new Date(this);
d.__msh_oldSetFullYear(y);
if (d.getMonth() != this.getMonth())
this.setDate(28);
this.__msh_oldSetFullYear(y);
};window._dynarch_popupCalendar = null;


Calendar._DN = new Array
("星期日","星期一","星期二","星期三","星期四","星期五","星期六","星期日");
Calendar._SDN = new Array
("日","一","二","三","四","五","六","日");
Calendar._FD = 0;
Calendar._MN = new Array
("一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月");
Calendar._SMN = new Array
("一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月");
Calendar._TT = {};
Calendar._TT["INFO"] = "帮助";
Calendar._TT["ABOUT"] =
"选择日期:\n" +
"- 点击 \xab, \xbb 按钮选择年份\n" +
"- 点击 " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " 按钮选择月份\n" +
"- 长按以上按钮可从菜单中快速选择年份或月份";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"选择时间:\n" +
"- 点击小时或分钟可使改数值加一\n" +
"- 按住Shift键点击小时或分钟可使改数值减一\n" +
"- 点击拖动鼠标可进行快速选择";
Calendar._TT["PREV_YEAR"] = "上一年 (按住出菜单)";
Calendar._TT["PREV_MONTH"] = "上一月 (按住出菜单)";
Calendar._TT["GO_TODAY"] = "转到今日";
Calendar._TT["NEXT_MONTH"] = "下一月 (按住出菜单)";
Calendar._TT["NEXT_YEAR"] = "下一年 (按住出菜单)";
Calendar._TT["SEL_DATE"] = "选择日期";
Calendar._TT["DRAG_TO_MOVE"] = "拖动";
Calendar._TT["PART_TODAY"] = " (今日)";
Calendar._TT["DAY_FIRST"] = "最左边显示%s";
Calendar._TT["WEEKEND"] = "0,6";
Calendar._TT["CLOSE"] = "关闭";
Calendar._TT["TODAY"] = "今日";
Calendar._TT["TIME_PART"] = "(Shift-)点击鼠标或拖动改变值";
Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Calendar._TT["TT_DATE_FORMAT"] = "%A, %b %e日";
Calendar._TT["WK"] = "周";
Calendar._TT["TIME"] = "时间:";


Calendar.setup = function (params) {
	function param_default(pname, def) { if (typeof params[pname] == "undefined") { params[pname] = def; } };

	param_default("inputField",     null);
	param_default("displayArea",    null);
	param_default("button",         null);
	param_default("eventName",      "click");
	param_default("ifFormat",       "%Y/%m/%d");
	param_default("daFormat",       "%Y/%m/%d");
	param_default("singleClick",    true);
	param_default("disableFunc",    null);
	param_default("dateStatusFunc", params["disableFunc"]);	// takes precedence if both are defined
	param_default("dateText",       null);
	param_default("firstDay",       null);
	param_default("align",          "Br");
	param_default("range",          [1900, 2999]);
	param_default("weekNumbers",    true);
	param_default("flat",           null);
	param_default("flatCallback",   null);
	param_default("onSelect",       null);
	param_default("onClose",        null);
	param_default("onUpdate",       null);
	param_default("date",           null);
	param_default("showsTime",      false);
	param_default("timeFormat",     "24");
	param_default("electric",       true);
	param_default("step",           2);
	param_default("position",       null);
	param_default("cache",          false);
	param_default("showOthers",     false);
	param_default("multiple",       null);

	var tmp = ["inputField", "displayArea", "button"];
	for (var i in tmp) {
		if (typeof params[tmp[i]] == "string") {
			params[tmp[i]] = document.getElementById(params[tmp[i]]);
		}
	}
	if (!(params.flat || params.multiple || params.inputField || params.displayArea || params.button)) {
		alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");
		return false;
	}

	function onSelect(cal) {
		var p = cal.params;
		var update = (cal.dateClicked || p.electric);
		if (update && p.inputField) {
			p.inputField.value = cal.date.print(p.ifFormat);
			if (typeof p.inputField.onchange == "function")
				p.inputField.onchange();
		}
		if (update && p.displayArea)
			p.displayArea.innerHTML = cal.date.print(p.daFormat);
		if (update && typeof p.onUpdate == "function")
			p.onUpdate(cal);
		if (update && p.flat) {
			if (typeof p.flatCallback == "function")
				p.flatCallback(cal);
		}
		if (update && p.singleClick && cal.dateClicked)
			cal.callCloseHandler();
	};

	if (params.flat != null) {
		if (typeof params.flat == "string")
			params.flat = document.getElementById(params.flat);
		if (!params.flat) {
			alert("Calendar.setup:\n  Flat specified but can't find parent.");
			return false;
		}
		var cal = new Calendar(params.firstDay, params.date, params.onSelect || onSelect);
		cal.showsOtherMonths = params.showOthers;
		cal.showsTime = params.showsTime;
		cal.time24 = (params.timeFormat == "24");
		cal.params = params;
		cal.weekNumbers = params.weekNumbers;
		cal.setRange(params.range[0], params.range[1]);
		cal.setDateStatusHandler(params.dateStatusFunc);
		cal.getDateText = params.dateText;
		if (params.ifFormat) {
			cal.setDateFormat(params.ifFormat);
		}
		if (params.inputField && typeof params.inputField.value == "string") {
			cal.parseDate(params.inputField.value);
		}
		cal.create(params.flat);
		cal.show();
		return false;
	}

	var triggerEl = params.button || params.displayArea || params.inputField;
	triggerEl["on" + params.eventName] = function() {
		var dateEl = params.inputField || params.displayArea;
		var dateFmt = params.inputField ? params.ifFormat : params.daFormat;
		var mustCreate = false;
		var cal = window.calendar;
		if (dateEl)
			params.date = Date.parseDate(dateEl.value || dateEl.innerHTML, dateFmt);
		if (!(cal && params.cache)) {
			window.calendar = cal = new Calendar(params.firstDay,
							     params.date,
							     params.onSelect || onSelect,
							     params.onClose || function(cal) { cal.hide(); });
			cal.showsTime = params.showsTime;
			cal.time24 = (params.timeFormat == "24");
			cal.weekNumbers = params.weekNumbers;
			mustCreate = true;
		} else {
			if (params.date)
				cal.setDate(params.date);
			cal.hide();
		}
		if (params.multiple) {
			cal.multiple = {};
			for (var i = params.multiple.length; --i >= 0;) {
				var d = params.multiple[i];
				var ds = d.print("%Y%m%d");
				cal.multiple[ds] = d;
			}
		}
		cal.showsOtherMonths = params.showOthers;
		cal.yearStep = params.step;
		cal.setRange(params.range[0], params.range[1]);
		cal.params = params;
		cal.setDateStatusHandler(params.dateStatusFunc);
		cal.getDateText = params.dateText;
		cal.setDateFormat(dateFmt);
		if (mustCreate)
			cal.create();
		cal.refresh();
		if (!params.position)
			cal.showAtElement(params.button || params.displayArea || params.inputField, params.align);
		else
			cal.showAt(params.position[0], params.position[1]);
		return false;
	};

	return cal;
};/**
 * This jQuery plugin displays pagination links inside the selected elements.
 * 
 * This plugin needs at least jQuery 1.4.2
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
 (function($){
	/**
	 * @class Class for calculating pagination values
	 */
	$.PaginationCalculator = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
	}
	
	$.extend($.PaginationCalculator.prototype, {
		/**
		 * Calculate the maximum number of pages
		 * @method
		 * @returns {Number}
		 */
		numPages:function() {
			return Math.ceil(this.maxentries/this.opts.items_per_page);
		},
		/**
		 * Calculate start and end point of pagination links depending on 
		 * current_page and num_display_entries.
		 * @returns {Array}
		 */
		getInterval:function(current_page)  {
			var ne_half = Math.floor(this.opts.num_display_entries/2);
			var np = this.numPages();
			var upper_limit = np - this.opts.num_display_entries;
			var start = current_page > ne_half ? Math.max( Math.min(current_page - ne_half, upper_limit), 0 ) : 0;
			var end = current_page > ne_half?Math.min(current_page+ne_half + (this.opts.num_display_entries % 2), np):Math.min(this.opts.num_display_entries, np);
			return {start:start, end:end};
		}
	});
	
	// Initialize jQuery object container for pagination renderers
	$.PaginationRenderers = {}
	
	/**
	 * @class Default renderer for rendering pagination links
	 */
	$.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
		this.pc = new $.PaginationCalculator(maxentries, opts);
	}
	$.extend($.PaginationRenderers.defaultRenderer.prototype, {
		/**
		 * Helper function for generating a single link (or a span tag if it's the current page)
		 * @param {Number} page_id The page id for the new item
		 * @param {Number} current_page 
		 * @param {Object} appendopts Options for the new item: text and classes
		 * @returns {jQuery} jQuery object containing the link
		 */
		createLink:function(page_id, current_page, appendopts){
			var lnk, np = this.pc.numPages();
			page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
			appendopts = $.extend({text:page_id+1, classes:""}, appendopts||{});
			if(page_id == current_page){
				lnk = $("<span class='current'>" + appendopts.text + "</span>");
			}
			else
			{
				lnk = $("<a>" + appendopts.text + "</a>")
					.attr('href', this.opts.link_to.replace(/__id__/,page_id));
			}
			if(appendopts.classes){ lnk.addClass(appendopts.classes); }
			lnk.data('page_id', page_id);
			return lnk;
		},
		// Generate a range of numeric links 
		appendRange:function(container, current_page, start, end, opts) {
			var i;
			for(i=start; i<end; i++) {
				this.createLink(i, current_page, opts).appendTo(container);
			}
		},
		getLinks:function(current_page, eventHandler) {
			var begin, end,
				interval = this.pc.getInterval(current_page),
				np = this.pc.numPages(),
				fragment = $("<div class='pagination'></div>");
			
			// Generate "Previous"-Link
			if(this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)){
				fragment.append(this.createLink(current_page-1, current_page, {text:this.opts.prev_text, classes:"prev"}));
			}
			// Generate starting points
			if (interval.start > 0 && this.opts.num_edge_entries > 0)
			{
				end = Math.min(this.opts.num_edge_entries, interval.start);
				this.appendRange(fragment, current_page, 0, end, {classes:'sp'});
				if(this.opts.num_edge_entries < interval.start && this.opts.ellipse_text)
				{
					jQuery("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
			}
			// Generate interval links
			this.appendRange(fragment, current_page, interval.start, interval.end);
			// Generate ending points
			if (interval.end < np && this.opts.num_edge_entries > 0)
			{
				if(np-this.opts.num_edge_entries > interval.end && this.opts.ellipse_text)
				{
					jQuery("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
				begin = Math.max(np-this.opts.num_edge_entries, interval.end);
				this.appendRange(fragment, current_page, begin, np, {classes:'ep'});
				
			}
			// Generate "Next"-Link
			if(this.opts.next_text && (current_page < np-1 || this.opts.next_show_always)){
				fragment.append(this.createLink(current_page+1, current_page, {text:this.opts.next_text, classes:"next"}));
			}
			$('a', fragment).click(eventHandler);
			return fragment;
		}
	});
	
	// Extend jQuery
	$.fn.pagination = function(maxentries, opts){
		
		// Initialize options with default values
		opts = jQuery.extend({
			items_per_page:10,
			num_display_entries:11,
			current_page:0,
			num_edge_entries:0,
			link_to:"#",
			prev_text:"Prev",
			next_text:"Next",
			ellipse_text:"...",
			prev_show_always:true,
			next_show_always:true,
			renderer:"defaultRenderer",
			load_first_page:false,
			callback:function(){return false;}
		},opts||{});
		
		var containers = this,
			renderer, links, current_page;
		
		/**
		 * This is the event handling function for the pagination links. 
		 * @param {int} page_id The new page number
		 */
		function paginationClickHandler(evt){
			var links, 
				new_current_page = $(evt.target).data('page_id'),
				continuePropagation = selectPage(new_current_page);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}
		
		/**
		 * This is a utility function for the internal event handlers. 
		 * It sets the new current page on the pagination container objects, 
		 * generates a new HTMl fragment for the pagination links and calls
		 * the callback function.
		 */
		function selectPage(new_current_page) {
			// update the link display of a all containers
			containers.data('current_page', new_current_page);
			links = renderer.getLinks(new_current_page, paginationClickHandler);
			containers.empty();
			links.appendTo(containers);
			// call the callback and propagate the event if it does not return false
			var continuePropagation = opts.callback(new_current_page, containers);
			return continuePropagation;
		}
		
		// -----------------------------------
		// Initialize containers
		// -----------------------------------
		current_page = opts.current_page;
		containers.data('current_page', current_page);
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
		
		if(!$.PaginationRenderers[opts.renderer])
		{
			throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
		}
		renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);
		
		// Attach control events to the DOM elements
		var pc = new $.PaginationCalculator(maxentries, opts);
		var np = pc.numPages();
		containers.bind('setPage', {numPages:np}, function(evt, page_id) { 
				if(page_id >= 0 && page_id < evt.data.numPages) {
					selectPage(page_id); return false;
				}
		});
		containers.bind('prevPage', function(evt){
				var current_page = $(this).data('current_page');
				if (current_page > 0) {
					selectPage(current_page - 1);
				}
				return false;
		});
		containers.bind('nextPage', {numPages:np}, function(evt){
				var current_page = $(this).data('current_page');
				if(current_page < evt.data.numPages - 1) {
					selectPage(current_page + 1);
				}
				return false;
		});
		
		// When all initialisation is done, draw the links
		links = renderer.getLinks(current_page, paginationClickHandler);
		containers.empty();
		links.appendTo(containers);
		// call callback function
		if(opts.load_first_page) {
			opts.callback(current_page, containers);
		}
	} // End of $.fn.pagination block
	
})(jQuery);
var cur_photo;
var total_photos;

$(document).ready(function() {
	
	//左边栏和导航菜单的部分开始
	
	$('#main_area').ajaxStart(function(){
		$('#ajax_loading').addClass('ajax_loading');
    });
    
	$('#main_area').ajaxComplete(function(){
		$('#ajax_loading').removeClass('ajax_loading');
    });
	
	$('#main_area').ajaxError(function(){
		$('#main_area').html('').addClass('loading_failed');
    });
	
	$('#main_area').ajaxSuccess(function(){
		$('#main_area').removeClass('loading_failed');
		$('.profile_div span:contains("未填")').css('color','#EE9572');
    });
	
	$.post(get_url(json_str.base_url+$('.menu_item').filter('.current').attr('id').replace('_','/')),function(data){
		if(data) $('#main_area').html(data);
	});
	
	$('.menu_item').click(function(){
		var cur_action=$(this).attr('id').replace('_','/');
		var cur_menu=$(this).attr('id').replace('user','menu');
		if($(this).hasClass('current')) return false;
		
		$('.menu_item').removeClass('current');
		$(this).addClass('current');
		
		$('.sub_menu_list').html($('#'+cur_menu).html());
		
		$.post(get_url(json_str.base_url+cur_action),function(data){
			if(data) $('#main_area').html(data);
		});
	});
	
	$('.sub_menu_list .sub_menu').live('click',function(){
		$('.sub_menu_list .sub_menu').removeClass('sub_current');
		$(this).addClass('sub_current');
	});
	
	$('#show_avatar').live('click',function(){
		$.post(get_url(json_str.base_url+'user/avatar'),function(data){
			if(data) $('#main_area').html(data);
		});		
	});
	
	$('#upload_avatar').live('click',function(){
		$.post(get_url(json_str.base_url+'user/avatar/swf_avatar'),function(data){
		    if(data) $('#main_area').html(data);
	    });
	});
	
	$('#view_profile').live('click',function(){
		$.post(get_url(json_str.base_url+'user/profile'),function(data){
			if(data) $('#main_area').html(data);
		});		
	});
	
	$('#edit_profile').live('click',function(){
		$.post(get_url(json_str.base_url+'user/profile/edit'),function(data){
			if(data) $('#main_area').html(data);
		});		
	})
	
	$('#amend_pass').live('click',function(){
		$.post(get_url(json_str.base_url+"user/profile/password"),function(data){
			if(data) $('#main_area').html(data); 
	    }); 
	});	
	
	$('.entry_viewer div.closer').live('click',function(){
		$('#show_entry').remove();
	});
	
	$('.menu_item, .sub_menu_list .sub_menu').live('click',function(){
		$('#show_entry').remove();
	});
	
	/*--------用户资料编辑部分开始----------*/
	
	$('#called_name').live('change',function(){
		if($(this).val().length==0) {
			top_message('请输入您的称呼，例如张小姐，李先生');
			set_style($(this),'error');
		}
		else set_style($(this),'ok');
	});
	
	$('#cellphone').live('change',function(){
		if($(this).val().length!=0 && !cellphone_check($(this).val())) {
			top_message('您输入的手机号码不正确');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#email').live('change',function(){
		if(!email_check($(this).val())) {
			top_message('您输入的邮件地址不正确');
			set_style($(this),'error');
		} 
		else set_style($(this),'ok');
	});
	
	$('#qq').live('change',function(){
		if($(this).val().length!=0 && !qq_check($(this).val())) {
			top_message('您输入的QQ号码不正确');
			set_style($(this),'error');
		} 
		else if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#nick_name').live('change',function(){
		if($(this).val().length) set_style($(this),'ok');
		else remove_style($(this));
	});
	
	$('#career').live('click',function(){
        var obj=$('#career');
        var data=$('#career_list').html();
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70');         
    });
	
	$('#province').live('click',function(){
        var obj=$('#province');
        var data=$('#province_list').html();
        obj.blur();        
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'300','150');         
    });
	
	$('#career,#province').live('click',function(event){
		event.stopPropagation();
	});
	
	$('.profile_form :input').live('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
			remove_style($(this));
		}
	});

	$('#amend_submit').live('click',function(event){
			
		setTimeout(profile_validation, 250); 
		event.preventDefault();
		    
	});
	
	$('.career_item').live('click',function(){
		$('#career').val($(this).text());
	});	
	
	$('.province_item').live('click',function(){
		$('#province').val($(this).text());
	});	
	
});

function updateavatar() {
	$('#show_avatar').click();
}

function my_page_callback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):15;
	$('.my_entries').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.my_entries').eq(i).show();
    }
    return false;
}

function my_page() {
	var num_entries = $('.my_entries').length; 
	
	addcss2head('js/pagination/pagination.css'); 
	
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: my_page_callback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):15,
        next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}

function  entry_viewer(obj_id,x_pos,y_pos,data,width,height) {
	$('.entry_viewer').remove();
	$('body').append('<div id="'+obj_id+'" class="entry_viewer"></div>');
	$('#'+obj_id).html('<div class="closer"></div><div class="menu">查看内容</div>');
	$('#'+obj_id).append(data);
	$('#'+obj_id).css({"left":x_pos,"top":y_pos});
	if(arguments[4]) $('#'+obj_id).css({"width":width});
	if(arguments[5]) $('#'+obj_id).css({"height":height});
}

function profile_validation() {
	var data,flag=1;
	var inputs = [];

	$('.profile_form :input').not(':radio,:button').each(function() {
		if($(this).val()=='' && $(this).hasClass('filled')) { 
			set_style($(this),'error');
	   		flag=0;  return false;
		}
			
		if($(this).hasClass('error')) {
			flag=0;  return false;
		}
		
		if(!$(this).hasClass('filled')) {
			if($(this).val().length)  set_style($(this),'ok');
			else remove_style($(this)); 
		}				
		else set_style($(this),'ok');
		
	   	inputs.push(this.name + '=' + escape(this.value));
   });
		   
   if(!flag) return false;
   data=inputs.join('&');
	    
   data=data+'&gender='+$('[name="gender"]:checked').val()+'&amend_submit=profile&ajax=1';
	    
   $.ajax({
		   type: 'post',
	       url:   get_url(json_str.base_url+"user/profile/submit"),
	       data:  data,
	       success : function(data,textStatus){     	     
	     	     try{ 
	                 var data=eval('(' + data + ')');
	                 if(data.result=='1') {
	                	 ajax_success(data,textStatus,'','json');
	                	 $('#view_profile').click();
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
}
