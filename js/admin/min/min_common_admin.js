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
 * commonly used by admin part of the web
 * @param data
 */
$(document).ready(function(){
	
	var mouse_is_inside= false;

	$.ajaxSetup ({
	   cache    : false, //close AJAX cache
	   dataType : 'html'
    });
	
	$('.float_pannel .closer').live('click',function(){
		$(this).parent().remove();
		unblock_all();
	});
	
	$(".dialog_title div.close").live('click',function(){
		$("#user_dialog").remove();
		unblock_all();
		
	});
	
	$("#dialog_cancel").live('click',function(){
		$("#user_dialog").remove();
		unblock_all();
	});
	
	$("#simple_viewer").live({
		mouseenter: function(){
		   mouse_is_inside = true;
		},
		mouseleave: function(){
		   mouse_is_inside = false; 
		}
	});
	
    $("body").click(function(){ 
 	  if(! mouse_is_inside && !$('#simple_viewer').hasClass('no_dispear_auto'))  $('#simple_viewer').remove();
    });
 
	
	$("#simple_dialog div.closer").live('click',function(){
		$("#simple_dialog").remove();
	});
	
	$("#simple_viewer div.closer").live('click',function(){
		$("#simple_viewer").remove();
		
	});
	
	$('[id$="_table"]').live('mouseover', function(){
		$(this).children().addClass("current");		
	});
	
	$('[id$="_table"]').live('mouseout', function(){
		$(this).children().removeClass("current");		
	});
	
	$('.text_selected').live('click',function(){
		$(this).select();  
        js=$(this).createTextRange();  
        js.execCommand("Copy"); 
	});

	//--------------checkbox选择开始---------------------------//
	$('[class="check_li title"]').live('click',function(){
		var flag='cancel';		 
		$('.table_li_check:visible').each(function(){
		   if(!$(this).attr('checked')){
               $('.table_li_check').attr('checked',false);
				$('.table_li_check:visible').attr('checked',true);
				flag='select';
				return;
			}
		});
			 
	    if(flag=='cancel') $('.table_li_check').attr('checked',false);
	});	
		
	$('.table_li_check:visible').live('click',function(){
		$('.table_li_check:hidden').attr('checked',false);
	});
	 
	$('[id$="_table"]').live('click', function(e){
		var cur_id=$(this).attr('id');
		var flag;
		var event_id=e.target.id;		
		cur_id=cur_id.replace('_table','');
		
		if(event_id.replace('select_','')==cur_id)  {
			$('.table_li_check:hidden').attr('checked',false);
			return true;
		}
		else {
			flag=$('input:checkbox').filter('#select_'+cur_id).attr('checked')?false:true;
			$('input:checkbox').filter('#select_'+cur_id).attr('checked',flag);
			$('.table_li_check:hidden').attr('checked',false);
		}		
	});
	
	//----------------选择结束------------------------//
	
	$('#workplace').ajaxStart(function(){
        $("#ajax_loader_box").html(' <img class="loader" src="'+json_str.base_url+'skin/admin/images/trans_loader.gif" />');
    });

	$("#workplace").ajaxComplete(function(){
		$(".loader").hide();
    });

	//当重新操作时，去掉提示框
	$('input').live('change',function(){	    
	   	$(".message_top").remove();
	});

	$('.local_select').live('click',function(){
		show_image_browser($(this).data('for'));
	});

});

function actual_txtlength (innerhtml,sendback) {
    var string=innerhtml.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
    string=$.trim(string.replace(/&nbsp;/g,''));
    if(sendback=='len') return string.length;
    else return string;
}

function myblocking(result,infor,goto_url,bind_func) {
	var flag=arguments[0]?true:false;
	var callback_on_unblock=arguments[3]?true:false;
	if(flag=="") {
		$.blockUI({ 
			onBlock: function() { $("body").unbind('keydown');},
			message: '<h1><img src="'+base_url+'skin/images/busy.gif" />正在处理，请稍后...</h1>', 
            css: { padding: '15px' },
            fadeIn: 100
        });	
	}
	else {
		$.unblockUI({fadeOut:100});
		if(result=='success') {
			$.blockUI({ 
				onBlock: function() { $("body").unbind('keydown');},
				message: infor, 
                css: { backgroundColor: '#008B00', color: '#fff' },
                fadeIn :100
            });
			$.unblockUI({fadeOut:1000});
		} 
		else {
			$.blockUI({ 
				onBlock: function() { $("body").unbind('keydown');},
				message: infor, 
                css: { backgroundColor: '#CD5555', color: '#fff' },
                fadeIn :100
            });
			if(callback_on_unblock) {
				$.unblockUI({
					onUnblock: function(){ $("body").bind('keydown',bind_func); },
					fadeOut:3000
				});
			}
			else {
				$.unblockUI({fadeOut:3000});
			}
		}
		if(goto_url)  location.replace(goto_url);
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

function my_reload() {
	window.location.reload();
}

function my_close() {
	window.close();
}

function block_all(action){

	if(arguments[0]) action();

	if($('#body .blockUI').length)  return false;

	$('#body').block({
		message: null,
		overlayCSS: {opacity: 0.1}
	});
}

function unblock_all(){
	if($('.blockUI').length>1)
		$('.blockUI:last').parent().unblock();
	else
		$('#body').unblock();
}

function ajax_success(response,textStatus,url,dataType) {	
	var dataType= arguments[0]?(arguments[3]?dataType:'json_string'):'string';	
	//必须放在前面！如果放在下句的后面，因为在下句后，arguments[0]变成了非空。

	var response= arguments[0]?response:'无显示信息'; 
	var textStatus= arguments[1]?textStatus:'success';
	var url= arguments[2]?url:'';

	if(textStatus=='0') {
		return top_message(response,url?function(){ msg_callback(url); }:'','error'); //forget why
	}

	else if(response && textStatus=='success') {//此为ajax成功被执行之意，不是指达到操作目的
	    
		if(dataType=='string')   { 
			if(response=='null') 
			return msg_callback(url);  //指定不显示任何效果

			else top_message(response,url?function(){ msg_callback(url); }:'','okay');

			return;
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是string和json_string,则为json类型。
		
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
	if(textStatus=='error') top_message('发生系统错误，请稍后重试！',url?function(){msg_callback(url); }:'','error');
}

function msg_callback(url){
	var url= arguments[0]?url:'';
	if(url=='current')  return;
	else if(url=='reload')  my_reload();
	else if(url!='')  goto_url(url,1000);
}

function  simple_dialog(x_pos,y_pos,data,width,height) {
	$('#simple_dialog').remove();
	$('body').append('<div id="simple_dialog"></div>');
	$('#simple_dialog').html('<div class="closer"></div>');
	$('#simple_dialog').append(data);
	$('#simple_dialog').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('#simple_dialog').css({"width":width}); 
	if(arguments[4]) $('#simple_dialog').css({"height":height});
	$('#simple_dialog').delay(5000).fadeOut(3000);
}

function  simple_viewer(x_pos,y_pos,data,width,height) {
	$('#simple_viewer').remove();
	$('body').append('<div id="simple_viewer"></div>');
	$('#simple_viewer').html('<div class="viewer_menu"></div>');
	$('.viewer_menu').html('<div class="menu_title"></div><div class="closer"></div>');
	$('#simple_viewer').append(data);
	$('#simple_viewer').css({"left":x_pos,"top":y_pos});
	if(arguments[3]) $('#simple_viewer').css({"width":width});
	if(arguments[4]) $('#simple_viewer').css({"height":height});
	
	//$('#simple_viewer').draggable({ cursor: 'move' });

	$('.viewer_menu').css({cursor: 'move'});
	$('#simple_viewer').draggable({ cursor: 'move',handle:'.viewer_menu' });
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

function admin_log_pannel(){
	var left;
	
	remove_pannel('admin_log_pannel');
	
	$.post(get_url(json_str.admin_base+'login/ajax'),{ajax:1},function(data){
		float_pannel('admin_log_pannel',data,'block','200'); 
	});
}

function  show_dialog(data,browser){
	
	$("#user_dialog").remove();	
	
	if($.browser.msie) {
		if(parseFloat($.browser.version)<7.0) browser='ie6';
	}
	
	$.ajax({
       	 type: 'post',
       	 data: data+'&browser='+browser,
       	 url:  get_url(json_str.base_url+'ajax/show_dialog'),
         success : function(data,textStatus){
        	 var json_data=data;
        	 var data = eval('(' + data + ')');
        	 if(data.result='1') { 
        		 $("body").append(data.infor);
				 
				 var main_height=$(".dialog_body .main_infor").height();
				 var main_width = $(".dialog_body .main_infor").width();

				 main_height=main_height>400?400:main_height;
				 main_width=main_width>800?800:main_width; 
				 $(".dialog_body .main_infor").css({"overflow":"auto","height":main_height+"px","width": main_width+"px"});

        		 set_dialog_height($(".dialog_body").height()+120);
				 block_all(); 
				 //$("#user_dialog").draggable({ cursor: 'move' });

				 $('.dialog_title').css({cursor: 'move'});
	             $('#user_dialog').draggable({ cursor: 'move',handle:'.dialog_title,.dialog_footer' });
        	 }
        	 else ajax_success(json_data,textStatus);
         },
			 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
    });
}

function set_dialog_height(my_height) {
	var total_height=my_height;
	var margin_top=my_height/2;
	var inner_height=my_height-20;
	$("#user_dialog").css({"height" : total_height+"px","margin-top" : "-"+margin_top+"px"});
	$(".left_border").css({"height" : inner_height+"px"});
	$(".right_border").css({"height" : inner_height+"px"});
	$(".center").css({"height" : inner_height+"px"});
}

function show_image_browser(images_acceptor) {

	$('#image_browser_panel,#opener_id').remove();

	$.ajax({
		type: 'post',
		url:  get_url(json_str.admin_base+'file_manager/image_browser'),
		success : function(data,textStatus){

			$("body").append('<div id="image_browser_panel"><input type="hidden" id="images_acceptor" value="'+images_acceptor+'">'+data+'</div>');
			block_all();
			//阻止其他操作
			$("#image_browser_panel").draggable({ cursor: 'move',handle:'.horizon_navi' });
			//可移动设置
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}


function show_upload_crop(data) {

	 $('#upload_crop_pannel').remove();
	 
	 $('div[class^=imgareaselect-]').hide(); 
	 //if parent of imgAareaSelect is not within the $('#upload_crop_pannel'), this is a must!

	 data.ajax=1; 
	 //增加一个json元素，作为POST数据进行校验，防止简单的直接访问ajax数据
	 //这是一个较松的阻挡访客直接输入ajax地址访问的方法，当然会有php级的更严格的阻止方法。
	 //但是，对于注册用户或者一般管理员，由于他们已经被身份认定了，严格的方法反而不适用，这个方法可以阻止一个生手查看js代码。

	 $.ajax({
       	 type: 'post',
       	 data: data,
       	 url:  get_url(json_str.base_url+'ajax/image/upload_crop'),
         success : function(data,textStatus){
			try{ 
	             data=eval('(' + data + ')');
				 ajax_success(data,textStatus,'','json'); 
               }catch(err){
				 if(data)  {					 
					 $("body").append(data);
					 block_all();
					 //阻止其他操作
					 $("#upload_crop_pannel").draggable({ cursor: 'move' });
					 //可移动设置
				 }
                 else ajax_success('',textStatus,'','string');
	           }
         },
			error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
     });
}

function delete_images_sql() {
	 $('[id$="_sql"]').each(function(){		
	 	if($(this).val()) {		 	   
	 	   $.post(get_url(json_str.base_url+'ajax/image/delete_images'),{files: $(this).val(),retains : $(this).prev().val()},function(rs){
			   if(rs=='0') ajax_success('有错误产生，请报告！',textStatus,'','string');
		   });		   
	    } 	
    });
}

function delete_images_cancel() {
	 $('[id$="_sql"]').each(function(){
	 	if($(this).prev().val()) {
		   $.post(get_url(json_str.base_url+'ajax/image/delete_images'),{files: $(this).prev().val(),retains: $(this).val()},function(rs){
			   if(rs=='0') ajax_success('有错误产生，请报告！',textStatus,'','string');
		   });		   
	    } 	
   });
}

function addcss2head(cssfile) {
	if($('link').filter('[href$="'+cssfile+'"]').length==0){
	   $('head').append('<link rel="stylesheet"  type="text/css"  href="'+json_str.base_url+cssfile+'" />');
    }
}


function text_selected(title,text,obj) {
    var data=title + '：<input class="text_selected" style="margin:5px; width:200px; height:22px; border:1px solid #cccccc;" type="text" value="'+text+'"/>';
	simple_viewer(obj.offset().left+100,obj.offset().top+10,data);
}

//一般列表分页功能函数
//page_execption_items 是特殊情况下需要过滤的数据，例如搜索时不符合要求的。
function pageselectCallback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.ul_tables ul').filter('[id$="_table"]').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.ul_tables ul').filter('[id$="_table"]').not('.page_exception_items').eq(i).show();
    }
    return false;
}

function initPagination() {
	var num_entries = $('.ul_tables ul').filter('[id$="_table"]').not('.page_exception_items').length; 
	
	
	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: pageselectCallback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
        num_display_entries: 8,
		next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}

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

function bubble_initial(obj,html) {
	
	addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');
	obj.CreateBubblePopup({			
		selectable: true,
		position : 'bottom',
		align	 : 'center',	
		innerHtml:  arguments[1]?html:'It is coming...',
		innerHtmlStyle: {'background-color':'#E0EEE0','text-align':'left','font-size':'12px;'},	
		themeName: 	'azure',
		themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
    });
}

function create_bubble_from(from_obj,to_obj) {
	bubble_initial(to_obj,from_obj.html());
	from_obj.remove();
} 

function do_query(){
	
	var objs=$('.ul_tables_body ul');
	var total_str='';
	var search_obj='';
	var cur_id=[];

	$('.ul_tables_body ul').addClass('page_exception_items');
	$('.ul_tables_body ul').hide();
	
	$('#my_search .inputarea').each(function(){
		 search_obj=$(this).val();
		 cur_id=$(this).attr('id').split('_');
		 if(search_obj) objs=objs.find('.by_'+cur_id[1]+':contains("'+search_obj+'")').parent();
		 total_str+=search_obj;
	});

	objs.removeClass('page_exception_items');
	objs.show();
	
	initPagination();

	if($.trim(total_str)) $('#return_to_all').show();
	else $('#return_to_all').hide();
}

function search_bubble() {
    
	if(!$('#show_query_bar').length) return; 

	bubble_initial($('#show_query_bar'),'<div id="my_search">'+$('#hide_for_query').html()+'</div>'); //初始化
	
	$('#hide_for_query').remove();

	$('[id^="select_bar"]').live('click',function(){
    	$('[id^="select_bar"]').not('#'+$(this).attr('id')).next().hide();
    	$(this).next().toggle();
    }); //冒泡内标签事件处理 
	
	$('#my_search ul.pop_ul li span').live('click',function(){
		var cur_id=$(this).closest('[class="hide pop_ul"]').attr('id');	
		var query_str=$(this).hasClass('no_limit')?'':$(this).text();
		
		$('#'+cur_id+' span').removeClass('selected');
		$(this).addClass('selected');
		
		cur_id=cur_id.replace('_list','');

		$('#my_search #'+cur_id).val(query_str); 
		//前面不加#my_search,会导致值被填入后来由于ajax更新带来的同名对象中
		
		do_query();
	});

	$('#my_search .inputarea').live('keyup',do_query); //启动搜索

	$('#return_to_all').live('click',function(){
		$('.ul_tables_body ul').removeClass('page_exception_items');
		initPagination();
		$(this).hide();
	}); //取消搜索结果，返回全部列表
}