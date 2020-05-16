!function(e){e(["jquery"],function(e){return function(){function t(e,t,n){return g({type:O.error,iconClass:m().iconClasses.error,message:e,optionsOverride:n,title:t})}function n(t,n){return t||(t=m()),v=e("#"+t.containerId),v.length?v:(n&&(v=u(t)),v)}function i(e,t,n){return g({type:O.info,iconClass:m().iconClasses.info,message:e,optionsOverride:n,title:t})}function o(e){w=e}function s(e,t,n){return g({type:O.success,iconClass:m().iconClasses.success,message:e,optionsOverride:n,title:t})}function a(e,t,n){return g({type:O.warning,iconClass:m().iconClasses.warning,message:e,optionsOverride:n,title:t})}function r(e,t){var i=m();v||n(i),l(e,i,t)||d(i)}function c(t){var i=m();return v||n(i),t&&0===e(":focus",t).length?void h(t):void(v.children().length&&v.remove())}function d(t){for(var n=v.children(),i=n.length-1;i>=0;i--)l(e(n[i]),t)}function l(t,n,i){var o=i&&i.force?i.force:!1;return t&&(o||0===e(":focus",t).length)?(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){h(t)}}),!0):!1}function u(t){return v=e("<div/>").attr("id",t.containerId).addClass(t.positionClass).attr("aria-live","polite").attr("role","alert"),v.appendTo(e(t.target)),v}function p(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',newestOnTop:!0,preventDuplicates:!1,progressBar:!1}}function f(e){w&&w(e)}function g(t){function i(e){return null==e&&(e=""),new String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function o(){r(),d(),l(),u(),p(),c()}function s(){y.hover(b,O),!x.onclick&&x.tapToDismiss&&y.click(w),x.closeButton&&k&&k.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&e.cancelBubble!==!0&&(e.cancelBubble=!0),w(!0)}),x.onclick&&y.click(function(e){x.onclick(e),w()})}function a(){y.hide(),y[x.showMethod]({duration:x.showDuration,easing:x.showEasing,complete:x.onShown}),x.timeOut>0&&(H=setTimeout(w,x.timeOut),q.maxHideTime=parseFloat(x.timeOut),q.hideEta=(new Date).getTime()+q.maxHideTime,x.progressBar&&(q.intervalId=setInterval(D,10)))}function r(){t.iconClass&&y.addClass(x.toastClass).addClass(E)}function c(){x.newestOnTop?v.prepend(y):v.append(y)}function d(){t.title&&(I.append(x.escapeHtml?i(t.title):t.title).addClass(x.titleClass),y.append(I))}function l(){t.message&&(M.append(x.escapeHtml?i(t.message):t.message).addClass(x.messageClass),y.append(M))}function u(){x.closeButton&&(k.addClass("toast-close-button").attr("role","button"),y.prepend(k))}function p(){x.progressBar&&(B.addClass("toast-progress"),y.prepend(B))}function g(e,t){if(e.preventDuplicates){if(t.message===C)return!0;C=t.message}return!1}function w(t){var n=t&&x.closeMethod!==!1?x.closeMethod:x.hideMethod,i=t&&x.closeDuration!==!1?x.closeDuration:x.hideDuration,o=t&&x.closeEasing!==!1?x.closeEasing:x.hideEasing;return!e(":focus",y).length||t?(clearTimeout(q.intervalId),y[n]({duration:i,easing:o,complete:function(){h(y),x.onHidden&&"hidden"!==j.state&&x.onHidden(),j.state="hidden",j.endTime=new Date,f(j)}})):void 0}function O(){(x.timeOut>0||x.extendedTimeOut>0)&&(H=setTimeout(w,x.extendedTimeOut),q.maxHideTime=parseFloat(x.extendedTimeOut),q.hideEta=(new Date).getTime()+q.maxHideTime)}function b(){clearTimeout(H),q.hideEta=0,y.stop(!0,!0)[x.showMethod]({duration:x.showDuration,easing:x.showEasing})}function D(){var e=(q.hideEta-(new Date).getTime())/q.maxHideTime*100;B.width(e+"%")}var x=m(),E=t.iconClass||x.iconClass;if("undefined"!=typeof t.optionsOverride&&(x=e.extend(x,t.optionsOverride),E=t.optionsOverride.iconClass||E),!g(x,t)){T++,v=n(x,!0);var H=null,y=e("<div/>"),I=e("<div/>"),M=e("<div/>"),B=e("<div/>"),k=e(x.closeHtml),q={intervalId:null,hideEta:null,maxHideTime:null},j={toastId:T,state:"visible",startTime:new Date,options:x,map:t};return o(),a(),s(),f(j),x.debug&&console&&console.log(j),y}}function m(){return e.extend({},p(),b.options)}function h(e){v||(v=n()),e.is(":visible")||(e.remove(),e=null,0===v.children().length&&(v.remove(),C=void 0))}var v,w,C,T=0,O={error:"error",info:"info",success:"success",warning:"warning"},b={clear:r,remove:c,error:t,getContainer:n,info:i,options:{},subscribe:o,success:s,version:"2.1.2",warning:a};return b}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
/*global $*/
/*jshint unused:false,forin:false*/
'use strict';

var iosOverlay = function(params) {


	var overlayDOM;
	var noop = function() {};
	var defaults = {
		onbeforeshow: noop,
		onshow: noop,
		onbeforehide: noop,
		onhide: noop,
		text: "",
		icon: null,
		spinner: null,
		duration: null,
		id: null,
		parentEl: null
	};

	// helper - merge two objects together, without using $.extend
	var merge = function(obj1, obj2) {
		var obj3 = {};
		for (var attrOne in obj1) {
			obj3[attrOne] = obj1[attrOne];
		}
		for (var attrTwo in obj2) {
			obj3[attrTwo] = obj2[attrTwo];
		}
		return obj3;
	};

	// helper - does it support CSS3 transitions/animation
	var doesTransitions = (function() {
		var b = document.body || document.documentElement;
		var s = b.style;
		var p = 'transition';
		if (typeof s[p] === 'string') {
			return true;
		}

		// Tests for vendor specific prop
		var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
		p = p.charAt(0).toUpperCase() + p.substr(1);
		for (var i = 0; i < v.length; i++) {
			if (typeof s[v[i] + p] === 'string') {
				return true;
			}
		}
		return false;
	}());

	// setup overlay settings
	var settings = merge(defaults, params);

	//
	var handleAnim = function(anim) {
		if (anim.animationName === "ios-overlay-show") {
			settings.onshow();
		}
		if (anim.animationName === "ios-overlay-hide") {
			destroy();
			settings.onhide();
		}
	};

	// IIFE
	var create = (function() {

		// initial DOM creation and event binding
		overlayDOM = document.createElement("div");
		overlayDOM.className = "ui-ios-overlay";
		overlayDOM.innerHTML += '<span class="title">' + settings.text + '</span';
		if (params.icon) {
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		} else if (params.spinner) {
			overlayDOM.appendChild(params.spinner.el);
		}
		if (doesTransitions) {
			overlayDOM.addEventListener("webkitAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("msAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("oAnimationEnd", handleAnim, false);
			overlayDOM.addEventListener("animationend", handleAnim, false);
		}
		if (params.parentEl) {
			document.getElementById(params.parentEl).appendChild(overlayDOM);
		} else {
			document.body.appendChild(overlayDOM);
		}

		settings.onbeforeshow();
		// begin fade in
		if (doesTransitions) {
			overlayDOM.className += " ios-overlay-show";
		} else if (typeof $ === "function") {
			$(overlayDOM).fadeIn({
				duration: 200
			}, function() {
				settings.onshow();
			});
		}

		if (settings.duration) {
			window.setTimeout(function() {
				hide();
			}, settings.duration);
		}

	}());

	var hide = function() {
		// pre-callback
		settings.onbeforehide();
		// fade out
		if (doesTransitions) {
			// CSS animation bound to classes
			overlayDOM.className = overlayDOM.className.replace("show", "hide");
		} else if (typeof $ === "function") {
			// polyfill requires jQuery
			$(overlayDOM).fadeOut({
				duration: 200
			}, function() {
				destroy();
				settings.onhide();
			});
		}
	};

	var destroy = function() {
		if (params.parentEl) {
			document.getElementById(params.parentEl).removeChild(overlayDOM);
		} else {
			document.body.removeChild(overlayDOM);
		}
	};

	var update = function(params) {
		if (params.text) {
			overlayDOM.getElementsByTagName("span")[0].innerHTML = params.text;
		}
		if (params.icon) {
			if (settings.spinner) {
				// Unless we set spinner to null, this will throw on the second update
				settings.spinner.el.parentNode.removeChild(settings.spinner.el);
				settings.spinner = null;
			}
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		}
	};

	return {
		hide: hide,
		destroy: destroy,
		update: update
	};

};

//Added support for requirejs
if (typeof define === 'function' && define.amd) {
	define([], function() {
		return iosOverlay;
	});
}
//fgnass.github.com/spin.js#v1.2.7
!function(e,t,n){function o(e,n){var r=t.createElement(e||"div"),i;for(i in n)r[i]=n[i];return r}function u(e){for(var t=1,n=arguments.length;t<n;t++)e.appendChild(arguments[t]);return e}function f(e,t,n,r){var o=["opacity",t,~~(e*100),n,r].join("-"),u=.01+n/r*100,f=Math.max(1-(1-e)/t*(100-u),e),l=s.substring(0,s.indexOf("Animation")).toLowerCase(),c=l&&"-"+l+"-"||"";return i[o]||(a.insertRule("@"+c+"keyframes "+o+"{"+"0%{opacity:"+f+"}"+u+"%{opacity:"+e+"}"+(u+.01)+"%{opacity:1}"+(u+t)%100+"%{opacity:"+e+"}"+"100%{opacity:"+f+"}"+"}",a.cssRules.length),i[o]=1),o}function l(e,t){var i=e.style,s,o;if(i[t]!==n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(o=0;o<r.length;o++){s=r[o]+t;if(i[s]!==n)return s}}function c(e,t){for(var n in t)e.style[l(e,n)||n]=t[n];return e}function h(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)e[i]===n&&(e[i]=r[i])}return e}function p(e){var t={x:e.offsetLeft,y:e.offsetTop};while(e=e.offsetParent)t.x+=e.offsetLeft,t.y+=e.offsetTop;return t}var r=["webkit","Moz","ms","O"],i={},s,a=function(){var e=o("style",{type:"text/css"});return u(t.getElementsByTagName("head")[0],e),e.sheet||e.styleSheet}(),d={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"},v=function m(e){if(!this.spin)return new m(e);this.opts=h(e||{},m.defaults,d)};v.defaults={},h(v.prototype,{spin:function(e){this.stop();var t=this,n=t.opts,r=t.el=c(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),i=n.radius+n.length+n.width,u,a;e&&(e.insertBefore(r,e.firstChild||null),a=p(e),u=p(r),c(r,{left:(n.left=="auto"?a.x-u.x+(e.offsetWidth>>1):parseInt(n.left,10)+i)+"px",top:(n.top=="auto"?a.y-u.y+(e.offsetHeight>>1):parseInt(n.top,10)+i)+"px"})),r.setAttribute("aria-role","progressbar"),t.lines(r,t.opts);if(!s){var f=0,l=n.fps,h=l/n.speed,d=(1-n.opacity)/(h*n.trail/100),v=h/n.lines;(function m(){f++;for(var e=n.lines;e;e--){var i=Math.max(1-(f+e*v)%h*d,n.opacity);t.opacity(r,n.lines-e,i,n)}t.timeout=t.el&&setTimeout(m,~~(1e3/l))})()}return t},stop:function(){var e=this.el;return e&&(clearTimeout(this.timeout),e.parentNode&&e.parentNode.removeChild(e),this.el=n),this},lines:function(e,t){function i(e,r){return c(o(),{position:"absolute",width:t.length+t.width+"px",height:t.width+"px",background:e,boxShadow:r,transformOrigin:"left",transform:"rotate("+~~(360/t.lines*n+t.rotate)+"deg) translate("+t.radius+"px"+",0)",borderRadius:(t.corners*t.width>>1)+"px"})}var n=0,r;for(;n<t.lines;n++)r=c(o(),{position:"absolute",top:1+~(t.width/2)+"px",transform:t.hwaccel?"translate3d(0,0,0)":"",opacity:t.opacity,animation:s&&f(t.opacity,t.trail,n,t.lines)+" "+1/t.speed+"s linear infinite"}),t.shadow&&u(r,c(i("#000","0 0 4px #000"),{top:"2px"})),u(e,u(r,i(t.color,"0 0 1px rgba(0,0,0,.1)")));return e},opacity:function(e,t,n){t<e.childNodes.length&&(e.childNodes[t].style.opacity=n)}}),function(){function e(e,t){return o("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',t)}var t=c(o("group"),{behavior:"url(#default#VML)"});!l(t,"transform")&&t.adj?(a.addRule(".spin-vml","behavior:url(#default#VML)"),v.prototype.lines=function(t,n){function s(){return c(e("group",{coordsize:i+" "+i,coordorigin:-r+" "+ -r}),{width:i,height:i})}function l(t,i,o){u(a,u(c(s(),{rotation:360/n.lines*t+"deg",left:~~i}),u(c(e("roundrect",{arcsize:n.corners}),{width:r,height:n.width,left:n.radius,top:-n.width>>1,filter:o}),e("fill",{color:n.color,opacity:n.opacity}),e("stroke",{opacity:0}))))}var r=n.length+n.width,i=2*r,o=-(n.width+n.length)*2+"px",a=c(s(),{position:"absolute",top:o,left:o}),f;if(n.shadow)for(f=1;f<=n.lines;f++)l(f,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(f=1;f<=n.lines;f++)l(f);return u(t,a)},v.prototype.opacity=function(e,t,n,r){var i=e.firstChild;r=r.shadow&&r.lines||0,i&&t+r<i.childNodes.length&&(i=i.childNodes[t+r],i=i&&i.firstChild,i=i&&i.firstChild,i&&(i.opacity=n))}):s=l(t,"animation")}(),typeof define=="function"&&define.amd?define(function(){return v}):e.Spinner=v}(window,document);/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

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
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
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

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
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

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
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
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
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
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
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

			if ((msie || opts.forceIframe) && opts.showOverlay)
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
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
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

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 )
					els[1].style.cursor = opts.cursorReset;
				if ( els.length > 2 )
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0)
						reset(els,data,opts,el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ( $el.data('blockUI.isBlocked') )
				return;

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();
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

/**
 * function of jquery by Snellings Cheng
 * commonly used by front part of the web
 * @param data
 */

toastr.options = {
    "closeButton": true,
    "preventDuplicates": true,
    "positionClass": "toast-bottom-full-width",
    "timeOut": "5000"
};

$(document).ready(function(){

	$('.logout_link').on('click',function(){
		$.post(get_url(json_str.base_url+'logout/ajax'),function(data){
			if(data=='1') 
				top_message('正在退出，稍候......',my_reload,'success');
			else { 
				set_log_state(false);
				top_message('您没有登录，无需退出！','','warning');
			}
		});		
	});
	
	$('.goback_link').on('click',function(){
		$('#main_body').unblock();
		history.go(-1);
	});
	
	$('.not_found').closest('body').fadeOut(3000,function(){
		location.replace(json_str.base_url);
	});
	
	//分享到其他网站的代码
	if($('.entry_use').length) $.get(get_url(json_str.base_url+'comment/share_this'),function(data){
		$('.entry_use hr').after(data);
	});

	//当重新操作时，去掉提示框
	$('input').on('change',function(){
		toastr.remove();
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
	$('#main_body').block({message: show_msg,overlayCSS: {opacity: 0.2}});
}

function unblock_all(){
	$('#main_body').unblock();
}

function set_log_state() {
	$.get(get_url(json_str.base_url+'login/chk_if_logined'),function(data){
		data=eval('(' + data + ')');
		
		if(data.logged)  {
			$('.unlogged_state').hide();
			$('.logged_state').show();
		}
		else  {
			$('.logged_state').hide();
			$('.unlogged_state').show();
		}
	});
}

function top_message(msg,callback,type) {
    var flag=arguments[1]?true:false;

    if(flag) {
        toastr.options.onHidden = callback;
        toastr.options.timeOut = 100;
    }

    toastr.remove();

    switch(type) {
        case 'success':
            toastr.success(msg);
            break;
        case 'info':
            toastr.info(msg);
            break;
        case 'warning':
            toastr.warning(msg);
            break;
        default :
            toastr.error(msg);
            break;
    }
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

			//if(textStatus=='0') top_message(response,url?function(){ msg_callback(url); }:'','error');
			//else top_message(response,url?function(){ msg_callback(url); }:'','success');
			//return; //???some thing needed to be redone
		}
		else if(dataType=='json_string')  data = eval('(' + response + ')');
		else data=response;
		//默认dataType共有三种类型:html,json_string,json
		//如果不是html和json_string,则为json类型。
		
		if(data.infor=='null') 
			return msg_callback(url);  //指定不显示任何效果

		if(data.result=='0') { 			
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','error');
			// 不能直接回调函数本身，因为会导致top_message的效果丢失

			else  top_message('发生错误!',url?function(){ msg_callback(url); }:'','error');
		}		
	    else if(data.result=='1') {
			if(data.infor) top_message(data.infor,url?function(){ msg_callback(url); }:'','success');
			else top_message('操作完成!',url?function(){ msg_callback(url);}:'','success');
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
    var glyphicon;

    remove_style(obj);

    obj.closest('.form-group').addClass('has-feedback has-'+ type);

    switch (type) {
        case 'error':
            obj.addClass('error');
            glyphicon = 'glyphicon-remove';
            break;
        case 'warning':
            obj.removeClass('error');
            glyphicon = 'glyphicon-warning-sign';
            break;
        case 'success' :
            obj.removeClass('error');
            glyphicon = 'glyphicon-ok'

    }

    obj.after('<span class="glyphicon '+ glyphicon +' form-control-feedback"></span>');

    return obj;

}

function remove_style(obj) {
    obj.removeClass('error');
    obj.closest('.form-group').removeClass('has-error has-success has-warning');
 	obj.next('.glyphicon').remove();

    return obj;
}

function refresh_captcha(obj,captcha_input) {

	var obj= arguments[0]?obj:'captcha_img';
	var captcha_input = arguments[1]?captcha_input:'captcha';

	$('#'+obj).click(function(){
		var cur_src=$(this).attr('src');
		cur_src=cur_src.split('?');
		$(this).attr('src',cur_src[0]+'?'+Math.random());

		$('#'+captcha_input).val('');
		remove_style($('#'+captcha_input));
	});

}

function chk_captcha(obj_id) {
	if(!arguments[0]) obj_id='captcha';
	$('#'+obj_id).on('change',function(){
		var obj=$(this);
		$.ajax({
			type : 'post',
			data : 'captcha='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_captcha'),
			success : function(data,textStatus){
				 if(data=='0')  {
					 set_style(obj,'error');
                     toastr.error('验证码输入错误');
				 }
				 else set_style(obj,'success');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){
                toastr.error('系统发生意外错误，请稍候重试');
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
}

function success_show(obj,msg) {
	var msg = arguments[1]?msg:'恭喜！操作成功！';
	obj.html('<div class="text-center alert alert-success"><h3><span class="glyphicon glyphicon-ok"></span> '+msg+'</h3><p class="text-right"><button id="js-redo" class="btn btn-success">重新操作</button></p></div>');
	$('#js-redo').one('click',function () {
		window.location.reload();
	})
}

var iosOverly;
function ajax_sending(){
    $.blockUI({
        message: null,
        onBlock: spin_loading()
    });
}

function ajax_complete(status){
    $.unblockUI({
        onUnblock: function() {
            iosOverly.hide();
        }
    });
}

function spin_update(status) {
    var img = arguments[0]=='success'?'check.png':'cross.png';
    var result = arguments[0]=='success'?"Success!":"Failed!";
    iosOverly.update({
        text: result,
        icon: json_str.base_url+"bower/iOS-Overlay-gh-pages/img/"+img
    });
}

function spin_loading() {
    var opts = {
        lines: 13, // The number of lines to draw
        length: 11, // The length of each line
        width: 5, // The line thickness
        radius: 17, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    var target =  $(".lostpass_form").get(0);
    var spinner = new Spinner(opts).spin(target);
    iosOverly= iosOverlay({
        text: "Loading",
        duration: 0,
        spinner: spinner
    });
    return false;
}$(document).ready(function(){
	
	$('.register_index #goto_login').click(function(){
		location.replace(json_str.base_url+'login');
	});
	
	$('.reg_username').on('change',function(){
		var obj=$(this);		
		
		if($.trim(obj.val())=='') {
			set_style(obj,'error');
			top_message('用户名不能为空');
			return false;
		}
		
		if($.trim(obj.val()).length>15 || $.trim(obj.val()).length<3) {
			set_style(obj,'error');
			top_message('用户名的长度必须在3~15个字符之间');
			return false;	
		}			
		
		if(speical_chars($.trim(obj.val()))) {
			set_style(obj,'error');
			top_message('用户名不能含有特殊字符！');
			return false;
		}
		//提示用户名最好为邮箱前缀
		if(email_check($('#email').val())) {
		   var email=$('#email').val().split('@');
		   if(email[0]!=obj.val()) 
		   top_message('您的用户名与您的邮箱前缀不一致，您将不能管理你的人事信息！','','warning');
		}
		
		$.ajax({
			type : 'post',
			data : 'user_name='+obj.val(),
			url :  get_url(json_str.base_url+'register/chk_username'),
			success : function(data,textStatus){
				 if(data=='1')  {
					 set_style(obj,'error');
					 top_message('该用户名已经占用');
				 }
				 else set_style(obj,'success');
			},
		    error : function(XMLHttpRequest, textStatus, errorThrown){ 
		    	top_message('系统发生意外错误，请稍候重试');
		    }
		});
	});
	
	$('.reg_password').on('change',function(){		
		$('.reg_password_cfm').val('');
		remove_style($('.reg_password_cfm'));
		
		if($(this).val().length<6) {
			top_message('密码长度至少是6个字符');
			set_style($(this),'error');
		}
		else 
			set_style($(this),'success');
	});
	
	$('.reg_password_cfm').on('change',function(){
		if($(this).val()!=$('#user_pass').val()) {
			top_message('两次输入的密码不一致');
			set_style($(this),'error');
		}
		else set_style($(this),'success');
	});
	
	$('#email').on('change',function(){
		var obj= $(this);
		
		if(!email_check(obj.val())) {
			top_message('您输入的邮件地址不正确');
			set_style(obj,'error');
			return false;
		} 
		
		$.post(get_url(json_str.base_url+'register/chk_email'),{email: obj.val()},function(data){
		    if(data=='0') {
			   set_style(obj,'error');
			   top_message('该邮件地址暂不能注册，请与管理员联系');
			}  
			else {
			   //提示用户名最好为邮箱前缀
		       var email=obj.val().split('@');
		       if(email[0]!=$('.reg_username').val()) 
		       top_message('您的用户名与您的邮箱前缀不一致，您将不能管理你的人事信息！','','warn');
			   set_style(obj,'success');
			}
		});
	});

	refresh_captcha('register_captcha_img');
	chk_captcha('captcha');

	$('.reg_log_form :input').on('keyup',function(){
	    if($.trim($(this).val()).length!=$(this).val().length) {
		    top_message('不能输入空格！');
			$(this).val(''); 
			remove_style($(this));
		}
	});

    $('#reg_submit').click(function(event){
		if($(this).hasClass('disabled')) return false;
		setTimeout(register_validation, 250); 
	    event.preventDefault();
	    
	});
	
	function register_validation() {
		var data,flag=1;
		var inputs = [];
		$('.reg_log_form :input').not(':radio,:button').each(function() {
			if($(this).val()=='' && $(this).hasClass('filled')) {
				top_message($(this).attr('placeholder'),'','error');
				set_style($(this),'error');
	      		flag=0;  return false;
			}
			
			if($(this).hasClass('error')) {
				flag=0;  return false;
			}
			
			if(!$(this).hasClass('filled')) {
				if($(this).val().length)  set_style($(this),'success');
				else remove_style($(this)); 
			}				
			else set_style($(this),'success');
			
	      	inputs.push(this.name + '=' + escape(this.value));
	    });
		   
		if(!flag) return false;
	    data=inputs.join('&');
	    
	    data=data+'&gender='+$('[name="gender"]:checked').val()+'&reg_submit=register';

		$.ajax({
			type: 'post',
			url:   get_url(json_str.base_url+"register/submit"),
			data:  data,
			beforeSend: function() {
				$('#reg_submit').addClass('disabled');
				ajax_sending();
			},
			complete:function() {
				ajax_complete();
			},
			success : function(data,textStatus){
				try{
					var data=eval('(' + data + ')');
					if(data.result=='1') {
						spin_update('success');
						ajax_success(data,textStatus,json_str.base_url,'json');
					}
					else {
						spin_update('error');
						$('#reg_submit').removeClass('disabled');
						ajax_success(data,textStatus,'','json');
						//$('.reg_log_form :input.filled').val('');
					}
				}
				catch(err){
					spin_update('error');
					$('#reg_submit').removeClass('disabled');
					ajax_success('操作失败，请重试！',textStatus,'','string');
				}
			},
			error   : function(XMLHttpRequest, textStatus, errorThrown){
				spin_update('error');
				$('#reg_submit').removeClass('disabled');
				ajax_failed(textStatus);
			}
		});
	}
});