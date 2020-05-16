/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */

(function($) {

 	var menu, shadow, trigger, content, hash, currentTarget;
  var defaults = {
    menuStyle: {
      listStyle: 'none',
      padding: '1px',
      margin: '0px',
      backgroundColor: '#fff',
      border: '1px solid #999',
      width: '100px'
    },
    itemStyle: {
      margin: '0px',
      color: '#000',
      display: 'block',
      cursor: 'default',
      padding: '3px',
      border: '1px solid #fff',
      backgroundColor: 'transparent'
    },
    itemHoverStyle: {
      border: '1px solid #0a246a',
      backgroundColor: '#b6bdd2'
    },
    eventPosX: 'pageX',
    eventPosY: 'pageY',
    shadow : true,
    onContextMenu: null,
    onShowMenu: null
 	};

  $.fn.contextMenu = function(id, options) {
    if (!menu) {                                      // Create singleton menu
      menu = $('<div class="jqContextMenu"></div>')
               .hide()
               .css({position:'absolute', zIndex:'500'})
               .appendTo('body')
               .bind('click', function(e) {
                 e.stopPropagation();
               });
    }
    if (!shadow) {
      shadow = $('<div></div>')
                 .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                 .appendTo('body')
                 .hide();
    }
    hash = hash || [];
    hash.push({
      id : id,
      menuStyle: $.extend({}, defaults.menuStyle, options.menuStyle || {}),
      itemStyle: $.extend({}, defaults.itemStyle, options.itemStyle || {}),
      itemHoverStyle: $.extend({}, defaults.itemHoverStyle, options.itemHoverStyle || {}),
      bindings: options.bindings || {},
      shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
      onContextMenu: options.onContextMenu || defaults.onContextMenu,
      onShowMenu: options.onShowMenu || defaults.onShowMenu,
      eventPosX: options.eventPosX || defaults.eventPosX,
      eventPosY: options.eventPosY || defaults.eventPosY
    });

    var index = hash.length - 1;
    $(this).bind('contextmenu', function(e) {
      // Check if onContextMenu() defined
      var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
      if (bShowContext) display(index, this, e, options);
      return false;
    });
    return this;
  };

  function display(index, trigger, e, options) {
    var cur = hash[index];
    content = $('#'+cur.id).find('ul:first').clone(true);
    content.css(cur.menuStyle).find('li').css(cur.itemStyle).hover(
      function() {
        $(this).css(cur.itemHoverStyle);
      },
      function(){
        $(this).css(cur.itemStyle);
      }
    ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});

    // Send the content to the menu
    menu.html(content);

    // if there's an onShowMenu, run it now -- must run after content has been added
		// if you try to alter the content variable before the menu.html(), IE6 has issues
		// updating the content
    if (!!cur.onShowMenu) menu = cur.onShowMenu(e, menu);

    $.each(cur.bindings, function(id, func) {
      $('#'+id, menu).bind('click', function(e) {
        hide();
        func(trigger, currentTarget);
      });
    });

    menu.css({'left':e[cur.eventPosX],'top':e[cur.eventPosY]}).show();
    if (cur.shadow) shadow.css({width:menu.width(),height:menu.height(),left:e.pageX+2,top:e.pageY+2}).show();
    $(document).one('click', hide);
  }

  function hide() {
    menu.hide();
    shadow.hide();
  }

  // Apply defaults
  $.contextMenu = {
    defaults : function(userDefaults) {
      $.each(userDefaults, function(i, val) {
        if (typeof val == 'object' && defaults[i]) {
          $.extend(defaults[i], val);
        }
        else defaults[i] = val;
      });
    }
  };

})(jQuery);

$(function() {
  $('div.contextMenu').hide();
});/**
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
/*
	jQuery Bubble Popup v.2.3.1
	http://maxvergelli.wordpress.com/jquery-bubble-popup/
	
	Copyright (c) 2010 Max Vergelli
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(6(a){a.1j.3C=6(){4 c=X;a(W).1g(6(d,e){4 b=a(e).1K("1U");5(b!=X&&7 b=="1a"&&!a.19(b)&&!a.18(b)&&b.3!=X&&7 b.3=="1a"&&!a.19(b.3)&&!a.18(b.3)&&7 b.3.1v!="1w"){c=b.3.1v?U:Q}12 Q});12 c};a.1j.45=6(){4 b=X;a(W).1g(6(e,f){4 d=a(f).1K("1U");5(d!=X&&7 d=="1a"&&!a.19(d)&&!a.18(d)&&d.3!=X&&7 d.3=="1a"&&!a.19(d.3)&&!a.18(d.3)&&7 d.3.1V!="1w"&&d.3.1V!=X){b=c(d.3.1V)}12 Q});6 c(d){12 2z 2Q(d*2R)}12 b};a.1j.4d=6(){4 b=X;a(W).1g(6(e,f){4 d=a(f).1K("1U");5(d!=X&&7 d=="1a"&&!a.19(d)&&!a.18(d)&&d.3!=X&&7 d.3=="1a"&&!a.19(d.3)&&!a.18(d.3)&&7 d.3.1W!="1w"&&d.3.1W!=X){b=c(d.3.1W)}12 Q});6 c(d){12 2z 2Q(d*2R)}12 b};a.1j.3G=6(){4 b=X;a(W).1g(6(e,f){4 d=a(f).1K("1U");5(d!=X&&7 d=="1a"&&!a.19(d)&&!a.18(d)&&d.3!=X&&7 d.3=="1a"&&!a.19(d.3)&&!a.18(d.3)&&7 d.3.1L!="1w"&&d.3.1L!=X){b=c(d.3.1L)}12 Q});6 c(d){12 2z 2Q(d*2R)}12 b};a.1j.3H=6(){4 b=X;a(W).1g(6(d,e){4 c=a(e).1K("1U");5(c!=X&&7 c=="1a"&&!a.19(c)&&!a.18(c)&&c.3!=X&&7 c.3=="1a"&&!a.19(c.3)&&!a.18(c.3)&&7 c.3.T!="1w"){b=a("#"+c.3.T).Z>0?a("#"+c.3.T).2p():X}12 Q});12 b};a.1j.3D=6(){4 b=X;a(W).1g(6(d,e){4 c=a(e).1K("1U");5(c!=X&&7 c=="1a"&&!a.19(c)&&!a.18(c)&&c.3!=X&&7 c.3=="1a"&&!a.19(c.3)&&!a.18(c.3)&&7 c.3.T!="1w"){b=c.3.T}12 Q});12 b};a.1j.4h=6(){4 b=0;a(W).1g(6(d,e){4 c=a(e).1K("1U");5(c!=X&&7 c=="1a"&&!a.19(c)&&!a.18(c)&&c.3!=X&&7 c.3=="1a"&&!a.19(c.3)&&!a.18(c.3)&&7 c.3.T!="1w"){a(e).2h("33");a(e).2h("2S");a(e).2h("30");a(e).2h("2G");a(e).2h("2L");a(e).2h("2x");a(e).2h("2s");a(e).2h("28");a(e).1K("1U",{});5(a("#"+c.3.T).Z>0){a("#"+c.3.T).2H()}b++}});12 b};a.1j.3x=6(){4 c=Q;a(W).1g(6(d,e){4 b=a(e).1K("1U");5(b!=X&&7 b=="1a"&&!a.19(b)&&!a.18(b)&&b.3!=X&&7 b.3=="1a"&&!a.19(b.3)&&!a.18(b.3)&&7 b.3.T!="1w"){c=U}12 Q});12 c};a.1j.48=6(){4 b={};a(W).1g(6(c,d){b=a(d).1K("1U");5(b!=X&&7 b=="1a"&&!a.19(b)&&!a.18(b)&&b.3!=X&&7 b.3=="1a"&&!a.19(b.3)&&!a.18(b.3)){44 b.3}1d{b=X}12 Q});5(a.18(b)){b=X}12 b};a.1j.4e=6(b,c){a(W).1g(6(d,e){5(7 c!="1I"){c=U}a(e).1e("2S",[b,c])})};a.1j.4c=6(b){a(W).1g(6(c,d){a(d).1e("30",[b])})};a.1j.47=6(b,c){a(W).1g(6(d,e){a(e).1e("2s",[b,c,U]);12 Q})};a.1j.46=6(b,c){a(W).1g(6(d,e){a(e).1e("2s",[b,c,U])})};a.1j.3X=6(){a(W).1g(6(b,c){a(c).1e("28",[U]);12 Q})};a.1j.3U=6(){a(W).1g(6(b,c){a(c).1e("28",[U])})};a.1j.3P=6(){a(W).1g(6(b,c){a(c).1e("2L");12 Q})};a.1j.3O=6(){a(W).1g(6(b,c){a(c).1e("2L")})};a.1j.3N=6(){a(W).1g(6(b,c){a(c).1e("2x");12 Q})};a.1j.3M=6(){a(W).1g(6(b,c){a(c).1e("2x")})};a.1j.3J=6(e){4 r={2J:W,2X:[],2Y:"1U",3w:["S","13","1b"],3n:["R","13","1c"],3j:\'<3i 1y="{1N} {3g}"{36} T="{37}"> 									<38{3b}> 									<3c> 									<2y> 										<14 1y="{1N}-S-R"{2m-2Z}>{2m-2O}</14> 										<14 1y="{1N}-S-13"{2m-3u}>{2m-20}</14> 										<14 1y="{1N}-S-1c"{2m-2U}>{2m-2P}</14> 									</2y> 									<2y> 										<14 1y="{1N}-13-R"{20-2Z}>{20-2O}</14> 										<14 1y="{1N}-1H"{31}>{2T}</14> 										<14 1y="{1N}-13-1c"{20-2U}>{20-2P}</14> 									</2y> 									<2y> 										<14 1y="{1N}-1b-R"{2l-2Z}>{2l-2O}</14> 										<14 1y="{1N}-1b-13"{2l-3u}>{2l-20}</14> 										<14 1y="{1N}-1b-1c"{2l-2U}>{2l-2P}</14> 									</2y> 									</3c> 									</38> 									</3i>\',3:{T:X,1L:X,1W:X,1V:X,1v:Q,1J:Q,1r:Q,1A:Q,1Y:Q,1B:Q,25:{}},15:"S",3v:["R","S","1c","1b"],11:"27",35:["R","27","1c","S","13","1b"],2K:["R","27","1c"],32:["S","13","1b"],1n:"3Y",1p:X,1o:X,1x:{},1u:{},1H:X,1O:{},V:{11:"27",1F:Q},1i:U,2q:U,22:Q,2k:U,23:"2E",3t:["2E","2V"],26:"2V",3o:["2E","2V"],1M:3h,1P:3h,29:0,2a:0,Y:"3e",21:"3F",2b:"3e-4f/",1h:{2A:"4a",1E:"43"},1T:6(){},1S:6(){},1m:[]};h(e);6 g(v){4 w={3:{},1p:r.1p,1o:r.1o,1x:r.1x,1u:r.1u,15:r.15,11:r.11,1n:r.1n,1M:r.1M,1P:r.1P,29:r.29,2a:r.2a,23:r.23,26:r.26,V:r.V,1H:r.1H,1O:r.1O,Y:r.Y,21:r.21,2b:r.2b,1h:r.1h,1i:r.1i,2k:r.2k,2q:r.2q,22:r.22,1T:r.1T,1S:r.1S,1m:r.1m};4 t=a.3E(Q,w,(7 v=="1a"&&!a.19(v)&&!a.18(v)&&v!=X?v:{}));t.3.T=r.3.T;t.3.1L=r.3.1L;t.3.1W=r.3.1W;t.3.1V=r.3.1V;t.3.1v=r.3.1v;t.3.1J=r.3.1J;t.3.1r=r.3.1r;t.3.1A=r.3.1A;t.3.1Y=r.3.1Y;t.3.1B=r.3.1B;t.3.25=r.3.25;t.1p=(7 t.1p=="1Q"||7 t.1p=="2c")&&10(t.1p)>0?10(t.1p):r.1p;t.1o=(7 t.1o=="1Q"||7 t.1o=="2c")&&10(t.1o)>0?10(t.1o):r.1o;t.1x=t.1x!=X&&7 t.1x=="1a"&&!a.19(t.1x)&&!a.18(t.1x)?t.1x:r.1x;t.1u=t.1u!=X&&7 t.1u=="1a"&&!a.19(t.1u)&&!a.18(t.1u)?t.1u:r.1u;t.15=7 t.15=="1Q"&&o(t.15.1X(),r.3v)?t.15.1X():r.15;t.11=7 t.11=="1Q"&&o(t.11.1X(),r.35)?t.11.1X():r.11;t.1n=(7 t.1n=="1Q"||7 t.1n=="2c")&&10(t.1n)>=0?10(t.1n):r.1n;t.1M=7 t.1M=="2c"&&10(t.1M)>0?10(t.1M):r.1M;t.1P=7 t.1P=="2c"&&10(t.1P)>0?10(t.1P):r.1P;t.29=7 t.29=="2c"&&t.29>=0?t.29:r.29;t.2a=7 t.2a=="2c"&&t.2a>=0?t.2a:r.2a;t.23=7 t.23=="1Q"&&o(t.23.1X(),r.3t)?t.23.1X():r.23;t.26=7 t.26=="1Q"&&o(t.26.1X(),r.3o)?t.26.1X():r.26;t.V=t.V!=X&&7 t.V=="1a"&&!a.19(t.V)&&!a.18(t.V)?t.V:r.V;t.V.11=7 t.V.11!="1w"?t.V.11:r.V.11;t.V.1F=7 t.V.1F!="1w"?t.V.1F:r.V.1F;t.1H=7 t.1H=="1Q"&&t.1H.Z>0?t.1H:r.1H;t.1O=t.1O!=X&&7 t.1O=="1a"&&!a.19(t.1O)&&!a.18(t.1O)?t.1O:r.1O;t.Y=j(7 t.Y=="1Q"&&t.Y.Z>0?t.Y:r.Y);t.21=7 t.21=="1Q"&&t.21.Z>0?a.3d(t.21):r.21;t.2b=7 t.2b=="1Q"&&t.2b.Z>0?a.3d(t.2b):r.2b;t.1h=t.1h!=X&&7 t.1h=="1a"&&!a.19(t.1h)&&!a.18(t.1h)&&(7 10(t.1h.2A)=="2c"&&7 10(t.1h.1E)=="2c")?t.1h:r.1h;t.1i=7 t.1i=="1I"&&t.1i==U?U:Q;t.2k=7 t.2k=="1I"&&t.2k==U?U:Q;t.2q=7 t.2q=="1I"&&t.2q==U?U:Q;t.22=7 t.22=="1I"&&t.22==U?U:Q;t.1T=7 t.1T=="6"?t.1T:r.1T;t.1S=7 t.1S=="6"?t.1S:r.1S;t.1m=a.19(t.1m)?t.1m:r.1m;5(t.15=="R"||t.15=="1c"){t.11=o(t.11,r.32)?t.11:"13"}1d{t.11=o(t.11,r.2K)?t.11:"27"}1R(4 u 2r t.V){2g(u){17"11":t.V.11=7 t.V.11=="1Q"&&o(t.V.11.1X(),r.35)?t.V.11.1X():r.V.11;5(t.15=="R"||t.15=="1c"){t.V.11=o(t.V.11,r.32)?t.V.11:"13"}1d{t.V.11=o(t.V.11,r.2K)?t.V.11:"27"}16;17"1F":t.V.1F=t.V.1F==U?U:Q;16}}12 t}6 l(t){5(t==0){12 0}5(t>0){12-(1s.1t(t))}1d{12 1s.1t(t)}}6 o(v,w){4 t=Q;1R(4 u 2r w){5(w[u]==v){t=U;16}}12 t}6 k(t){5(2W.3q){1R(4 v=t.Z-1;v>=0;v--){4 u=2W.3q("1G");u.2o=t[v];5(a.4g(t[v],r.2X)>-1){r.2X.3s(t[v])}}}}6 b(t){5(t.1m&&t.1m.Z>0){1R(4 u=0;u<t.1m.Z;u++){4 v=(t.1m[u].3m(0)!="#"?"#"+t.1m[u]:t.1m[u]);a(v).1k({34:"1F"})}}}6 s(u){5(u.1m&&u.1m.Z>0){1R(4 v=0;v<u.1m.Z;v++){4 x=(u.1m[v].3m(0)!="#"?"#"+u.1m[v]:u.1m[v]);a(x).1k({34:"3f"});4 w=a(x).Z;1R(4 t=0;t<w.Z;t++){a(w[t]).1k({34:"3f"})}}}}6 m(u){4 w=u.2b;4 t=u.21;4 v=(w.2I(w.Z-1)=="/"||w.2I(w.Z-1)=="\\\\")?w.2I(0,w.Z-1)+"/"+t+"/":w+"/"+t+"/";12 v+(u.1i==U?(a.1l.1D?"2e/":""):"2e/")}6 j(t){4 u=t.2I(0,1)=="."?t.2I(1,t.Z):t;12 u}6 q(u){5(a("#"+u.3.T).Z>0){4 t="1b-13";2g(u.15){17"R":t="13-1c";16;17"S":t="1b-13";16;17"1c":t="13-R";16;17"1b":t="S-13";16}5(o(u.V.11,r.2K)){a("#"+u.3.T).1f("14."+u.Y+"-"+t).1k("3a-11",u.V.11)}1d{a("#"+u.3.T).1f("14."+u.Y+"-"+t).1k("39-11",u.V.11)}}}6 p(v){4 H=r.3j;4 F=m(v);4 x="";4 G="";4 u="";5(!v.V.1F){2g(v.15){17"R":G="1c";u="{20-2P}";16;17"S":G="1b";u="{2l-20}";16;17"1c":G="R";u="{20-2O}";16;17"1b":G="S";u="{2m-20}";16}x=\'<1G 2o="\'+F+"V-"+G+"."+(v.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+v.Y+\'-V" />\'}4 t=r.3w;4 z=r.3n;4 K,E,A,J;4 B="";4 y="";4 D=2z 3p();1R(E 2r t){A="";J="";1R(K 2r z){A=t[E]+"-"+z[K];A=A.42();J="{"+A+"40}";A="{"+A+"}";5(A==u){H=H.1z(A,x);B=""}1d{H=H.1z(A,"");B=""}5(t[E]+"-"+z[K]!="13-13"){y=F+t[E]+"-"+z[K]+"."+(v.1i==U?(a.1l.1D?"1C":"2n"):"1C");D.3s(y);H=H.1z(J,\' 2M="\'+B+"3L-3K:3I("+y+\');"\')}}}5(D.Z>0){k(D)}4 w="";5(v.1u!=X&&7 v.1u=="1a"&&!a.19(v.1u)&&!a.18(v.1u)){1R(4 C 2r v.1u){w+=C+":"+v.1u[C]+";"}}w+=(v.1p!=X||v.1o!=X)?(v.1p!=X?"1p:"+v.1p+"1Z;":"")+(v.1o!=X?"1o:"+v.1o+"1Z;":""):"";H=w.Z>0?H.1z("{3b}",\' 2M="\'+w+\'"\'):H.1z("{3b}","");4 I="";5(v.1x!=X&&7 v.1x=="1a"&&!a.19(v.1x)&&!a.18(v.1x)){1R(4 C 2r v.1x){I+=C+":"+v.1x[C]+";"}}H=I.Z>0?H.1z("{36}",\' 2M="\'+I+\'"\'):H.1z("{36}","");H=H.1z("{3g}",v.Y+"-"+v.21);H=v.3.T!=X?H.1z("{37}",v.3.T):H.1z("{37}","");3y(H.3z("{1N}")>-1){H=H.1z("{1N}",v.Y)}H=v.1H!=X?H.1z("{2T}",v.1H):H.1z("{2T}","");J="";1R(4 C 2r v.1O){J+=C+":"+v.1O[C]+";"}H=J.Z>0?H.1z("{31}",\' 2M="\'+J+\'"\'):H.1z("{31}","");12 H}6 f(){12 1s.3A(2z 2Q().3B()/2R)}6 c(E,N,x){4 O=x.15;4 K=x.11;4 z=x.1n;4 F=x.1h;4 I=2z 3p();4 u=N.2F();4 t=10(u.S);4 y=10(u.R);4 P=10(N.2v(Q));4 L=10(N.2u(Q));4 v=10(E.2v(Q));4 M=10(E.2u(Q));F.1E=1s.1t(10(F.1E));F.2A=1s.1t(10(F.2A));4 w=l(F.1E);4 J=l(F.1E);4 A=l(F.2A);4 H=m(x);2g(K){17"R":I.S=O=="S"?t-M-z+l(w):t+L+z+w;I.R=y+A;16;17"27":4 D=1s.1t(v-P)/2;I.S=O=="S"?t-M-z+l(w):t+L+z+w;I.R=v>=P?y-D:y+D;16;17"1c":4 D=1s.1t(v-P);I.S=O=="S"?t-M-z+l(w):t+L+z+w;I.R=v>=P?y-D+l(A):y+D+l(A);16;17"S":I.S=t+A;I.R=O=="R"?y-v-z+l(J):y+P+z+J;16;17"13":4 D=1s.1t(M-L)/2;I.S=M>=L?t-D:t+D;I.R=O=="R"?y-v-z+l(J):y+P+z+J;16;17"1b":4 D=1s.1t(M-L);I.S=M>=L?t-D+l(A):t+D+l(A);I.R=O=="R"?y-v-z+l(J):y+P+z+J;16}I.15=O;5(a("#"+x.3.T).Z>0&&a("#"+x.3.T).1f("1G."+x.Y+"-V").Z>0){a("#"+x.3.T).1f("1G."+x.Y+"-V").2H();4 G="1b";4 C="1b-13";2g(O){17"R":G="1c";C="13-1c";16;17"S":G="1b";C="1b-13";16;17"1c":G="R";C="13-R";16;17"1b":G="S";C="S-13";16}a("#"+x.3.T).1f("14."+x.Y+"-"+C).2D();a("#"+x.3.T).1f("14."+x.Y+"-"+C).2p(\'<1G 2o="\'+H+"V-"+G+"."+(x.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+x.Y+\'-V" />\');q(x)}5(x.2q==U){5(I.S<a(1q).2i()||I.S+M>a(1q).2i()+a(1q).1o()){5(a("#"+x.3.T).Z>0&&a("#"+x.3.T).1f("1G."+x.Y+"-V").Z>0){a("#"+x.3.T).1f("1G."+x.Y+"-V").2H()}4 B="";5(I.S<a(1q).2i()){I.15="1b";I.S=t+L+z+w;5(a("#"+x.3.T).Z>0&&!x.V.1F){a("#"+x.3.T).1f("14."+x.Y+"-S-13").2D();a("#"+x.3.T).1f("14."+x.Y+"-S-13").2p(\'<1G 2o="\'+H+"V-S."+(x.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+x.Y+\'-V" />\');B="S-13"}}1d{5(I.S+M>a(1q).2i()+a(1q).1o()){I.15="S";I.S=t-M-z+l(w);5(a("#"+x.3.T).Z>0&&!x.V.1F){a("#"+x.3.T).1f("14."+x.Y+"-1b-13").2D();a("#"+x.3.T).1f("14."+x.Y+"-1b-13").2p(\'<1G 2o="\'+H+"V-1b."+(x.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+x.Y+\'-V" />\');B="1b-13"}}}5(I.R<0){I.R=0;5(B.Z>0){a("#"+x.3.T).1f("14."+x.Y+"-"+B).1k("3a-11","27")}}1d{5(I.R+v>a(1q).1p()){I.R=a(1q).1p()-v;5(B.Z>0){a("#"+x.3.T).1f("14."+x.Y+"-"+B).1k("3a-11","27")}}}}1d{5(I.R<0||I.R+v>a(1q).1p()){5(a("#"+x.3.T).Z>0&&a("#"+x.3.T).1f("1G."+x.Y+"-V").Z>0){a("#"+x.3.T).1f("1G."+x.Y+"-V").2H()}4 B="";5(I.R<0){I.15="1c";I.R=y+P+z+J;5(a("#"+x.3.T).Z>0&&!x.V.1F){a("#"+x.3.T).1f("14."+x.Y+"-13-R").2D();a("#"+x.3.T).1f("14."+x.Y+"-13-R").2p(\'<1G 2o="\'+H+"V-R."+(x.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+x.Y+\'-V" />\');B="13-R"}}1d{5(I.R+v>a(1q).1p()){I.15="R";I.R=y-v-z+l(J);5(a("#"+x.3.T).Z>0&&!x.V.1F){a("#"+x.3.T).1f("14."+x.Y+"-13-1c").2D();a("#"+x.3.T).1f("14."+x.Y+"-13-1c").2p(\'<1G 2o="\'+H+"V-1c."+(x.1i==U?(a.1l.1D?"1C":"2n"):"1C")+\'" 2w="" 1y="\'+x.Y+\'-V" />\');B="13-1c"}}}5(I.S<a(1q).2i()){I.S=a(1q).2i();5(B.Z>0){a("#"+x.3.T).1f("14."+x.Y+"-"+B).1k("39-11","13")}}1d{5(I.S+M>a(1q).2i()+a(1q).1o()){I.S=(a(1q).2i()+a(1q).1o())-M;5(B.Z>0){a("#"+x.3.T).1f("14."+x.Y+"-"+B).1k("39-11","13")}}}}}}12 I}6 d(u,t){a(u).1K(r.2Y,t)}6 n(t){12 a(t).1K(r.2Y)}6 i(t){4 u=t!=X&&7 t=="1a"&&!a.19(t)&&!a.18(t)?U:Q;12 u}6 h(t){a(1q).3Q(6(){a(r.2J).1g(6(u,v){a(v).1e("2G")})});a(2W).3R(6(u){a(r.2J).1g(6(v,w){a(w).1e("33",[u.3S,u.3T])})});a(r.2J).1g(6(v,w){4 u=g(t);u.3.1L=f();u.3.T=u.Y+"-"+u.3.1L+"-"+v;d(w,u);a(w).2f("33",6(y,C,B){4 N=n(W);5(i(N)&&i(N.3)&&7 C!="1w"&&7 B!="1w"){5(N.2k){4 E=a(W);4 z=E.2F();4 L=10(z.S);4 H=10(z.R);4 F=10(E.2v(Q));4 K=10(E.2u(Q));4 J=Q;5(H<=C&&C<=F+H&&L<=B&&B<=K+L){J=U}1d{J=Q}5(J&&!N.3.1Y){N.3.1Y=U;d(W,N);5(N.23=="2E"){a(W).1e("2s")}1d{5(N.22&&a("#"+N.3.T).Z>0){4 x=a("#"+N.3.T);4 A=x.2F();4 D=10(A.S);4 I=10(A.R);4 G=10(x.2v(Q));4 M=10(x.2u(Q));5(I<=C&&C<=G+I&&D<=B&&B<=M+D){}1d{a(W).1e("28")}}1d{a(W).1e("28")}}}1d{5(!J&&N.3.1Y){N.3.1Y=Q;d(W,N);5(N.26=="2E"){a(W).1e("2s")}1d{5(N.22&&a("#"+N.3.T).Z>0){4 x=a("#"+N.3.T);4 A=x.2F();4 D=10(A.S);4 I=10(A.R);4 G=10(x.2v(Q));4 M=10(x.2u(Q));5(I<=C&&C<=G+I&&D<=B&&B<=M+D){}1d{a(W).1e("28")}}1d{a(W).1e("28")}}}1d{5(!J&&!N.3.1Y){5(N.22&&a("#"+N.3.T).Z>0&&!N.3.1r){4 x=a("#"+N.3.T);4 A=x.2F();4 D=10(A.S);4 I=10(A.R);4 G=10(x.2v(Q));4 M=10(x.2u(Q));5(I<=C&&C<=G+I&&D<=B&&B<=M+D){}1d{a(W).1e("28")}}}}}}}});a(w).2f("2S",6(A,x,z){4 y=n(W);5(i(y)&&i(y.3)&&7 x!="1w"){y.3.1W=f();5(7 z=="1I"&&z==U){y.1H=x}d(W,y);5(a("#"+y.3.T).Z>0){a("#"+y.3.T).1f("14."+y.Y+"-1H").2p(x);5(y.3.1A){a(W).1e("2G",[Q])}1d{a(W).1e("2G",[U])}}}});a(w).2f("30",6(A,z){4 x=n(W);5(i(x)&&i(x.3)){4 y=x;x=g(z);x.3.T=y.3.T;x.3.1L=y.3.1L;x.3.1W=f();x.3.1V=y.3.1V;x.3.1v=y.3.1v;x.3.1J=y.3.1J;x.3.25={};d(W,x)}});a(w).2f("2G",6(A,y){4 z=n(W);5(i(z)&&i(z.3)&&a("#"+z.3.T).Z>0&&z.3.1v==U){4 x=a("#"+z.3.T);4 C=c(x,a(W),z);4 B=2;5(7 y=="1I"&&y==U){x.1k({S:C.S,R:C.R})}1d{2g(z.15){17"R":x.1k({S:C.S,R:(C.15!=z.15?C.R-(1s.1t(z.1h.1E)*B):C.R+(1s.1t(z.1h.1E)*B))});16;17"S":x.1k({S:(C.15!=z.15?C.S-(1s.1t(z.1h.1E)*B):C.S+(1s.1t(z.1h.1E)*B)),R:C.R});16;17"1c":x.1k({S:C.S,R:(C.15!=z.15?C.R+(1s.1t(z.1h.1E)*B):C.R-(1s.1t(z.1h.1E)*B))});16;17"1b":x.1k({S:(C.15!=z.15?C.S+(1s.1t(z.1h.1E)*B):C.S-(1s.1t(z.1h.1E)*B)),R:C.R});16}}}});a(w).2f("2L",6(){4 x=n(W);5(i(x)&&i(x.3)){x.3.1J=U;d(W,x)}});a(w).2f("2x",6(){4 x=n(W);5(i(x)&&i(x.3)){x.3.1J=Q;d(W,x)}});a(w).2f("2s",6(x,A,D,G){4 H=n(W);5((7 G=="1I"&&G==U&&(i(H)&&i(H.3)))||(7 G=="1w"&&(i(H)&&i(H.3)&&!H.3.1J&&!H.3.1v))){5(7 G=="1I"&&G==U){a(W).1e("2x")}H.3.1v=U;H.3.1J=Q;H.3.1r=Q;H.3.1A=Q;5(i(H.3.25)){H=H.3.25}1d{H.3.25={}}5(i(A)){4 C=H;4 F=f();H=g(A);H.3.T=C.3.T;H.3.1L=C.3.1L;H.3.1W=F;H.3.1V=F;H.3.1v=U;H.3.1J=Q;H.3.1r=Q;H.3.1A=Q;H.3.1Y=C.3.1Y;H.3.1B=C.3.1B;H.3.25={};5(7 D=="1I"&&D==Q){C.3.1W=F;C.3.1V=F;H.3.25=C}}d(W,H);b(H);5(a("#"+H.3.T).Z>0){a("#"+H.3.T).2H()}4 y={};4 B=p(H);y=a(B);y.3V("3W");y=a("#"+H.3.T);y.1k({24:0,S:"3r",R:"3r",15:"3Z",2C:"41"});5(H.1i==U){5(a.1l.1D&&10(a.1l.2t)<9){a("#"+H.3.T+" 38").2B(H.Y+"-2e")}}q(H);4 E=c(y,a(W),H);y.1k({S:E.S,R:E.R});5(E.15==H.15){H.3.1B=Q}1d{H.3.1B=U}d(W,H);4 z=3l(6(){H.3.1r=U;d(w,H);y.3k();2g(H.15){17"R":y.2d({24:1,R:(H.3.1B?"-=":"+=")+H.1n+"1Z"},H.1M,"2j",6(){H.3.1r=Q;H.3.1A=U;d(w,H);5(H.1i==U){5(a.1l.1D&&10(a.1l.2t)>8){y.2B(H.Y+"-2e")}}H.1T()});16;17"S":y.2d({24:1,S:(H.3.1B?"-=":"+=")+H.1n+"1Z"},H.1M,"2j",6(){H.3.1r=Q;H.3.1A=U;d(w,H);5(H.1i==U){5(a.1l.1D&&10(a.1l.2t)>8){y.2B(H.Y+"-2e")}}H.1T()});16;17"1c":y.2d({24:1,R:(H.3.1B?"+=":"-=")+H.1n+"1Z"},H.1M,"2j",6(){H.3.1r=Q;H.3.1A=U;d(w,H);5(H.1i==U){5(a.1l.1D&&10(a.1l.2t)>8){y.2B(H.Y+"-2e")}}H.1T()});16;17"1b":y.2d({24:1,S:(H.3.1B?"+=":"-=")+H.1n+"1Z"},H.1M,"2j",6(){H.3.1r=Q;H.3.1A=U;d(w,H);5(H.1i==U){5(a.1l.1D&&10(a.1l.2t)>8){y.2B(H.Y+"-2e")}}H.1T()});16}},H.29)}});a(w).2f("28",6(B,x){4 A=n(W);5((7 x=="1I"&&x==U&&(i(A)&&i(A.3)&&a("#"+A.3.T).Z>0))||(7 x=="1w"&&(i(A)&&i(A.3)&&a("#"+A.3.T).Z>0&&!A.3.1J&&A.3.1v))){5(7 x=="1I"&&x==U){a(W).1e("2x")}A.3.1r=Q;A.3.1A=Q;d(W,A);4 y=a("#"+A.3.T);4 z=7 x=="1w"?A.2a:0;4 C=3l(6(){A.3.1r=U;d(w,A);y.3k();5(A.1i==U){5(a.1l.1D&&10(a.1l.2t)>8){y.49(A.Y+"-2e")}}2g(A.15){17"R":y.2d({24:0,R:(A.3.1B?"+=":"-=")+A.1n+"1Z"},A.1P,"2j",6(){A.3.1v=Q;A.3.1r=Q;A.3.1A=U;d(w,A);y.1k("2C","2N");A.1S()});16;17"S":y.2d({24:0,S:(A.3.1B?"+=":"-=")+A.1n+"1Z"},A.1P,"2j",6(){A.3.1v=Q;A.3.1r=Q;A.3.1A=U;d(w,A);y.1k("2C","2N");A.1S()});16;17"1c":y.2d({24:0,R:(A.3.1B?"-=":"+=")+A.1n+"1Z"},A.1P,"2j",6(){A.3.1v=Q;A.3.1r=Q;A.3.1A=U;d(w,A);y.1k("2C","2N");A.1S()});16;17"1b":y.2d({24:0,S:(A.3.1B?"-=":"+=")+A.1n+"1Z"},A.1P,"2j",6(){A.3.1v=Q;A.3.1r=Q;A.3.1A=U;d(w,A);y.1k("2C","2N");A.1S()});16}},z);A.3.1V=f();A.3.1J=Q;d(W,A);s(A)}})})}12 W}})(4b);',62,266,'|||privateVars|var|if|function|typeof|||||||||||||||||||||||||||||||||||||||||||||false|left|top|id|true|tail|this|null|baseClass|length|parseInt|align|return|middle|td|position|break|case|isEmptyObject|isArray|object|bottom|right|else|trigger|find|each|themeMargins|dropShadow|fn|css|browser|hideElementId|distance|height|width|window|is_animating|Math|abs|tableStyle|is_open|undefined|divStyle|class|replace|is_animation_complete|is_position_changed|gif|msie|difference|hidden|img|innerHtml|boolean|is_freezed|data|creation_datetime|openingSpeed|BASE_CLASS|innerHtmlStyle|closingSpeed|string|for|afterHidden|afterShown|private_jquerybubblepopup_options|last_display_datetime|last_modified_datetime|toLowerCase|is_mouse_over|px|MIDDLE|themeName|selectable|mouseOver|opacity|last_options|mouseOut|center|hidebubblepopup|openingDelay|closingDelay|themePath|number|animate|ie|bind|switch|unbind|scrollTop|swing|manageMouseEvents|BOTTOM|TOP|png|src|html|alwaysVisible|in|showbubblepopup|version|outerHeight|outerWidth|alt|unfreezebubblepopup|tr|new|total|addClass|display|empty|show|offset|positionbubblepopup|remove|substring|me|alignHorizontalValues|freezebubblepopup|style|none|LEFT|RIGHT|Date|1000|setbubblepopupinnerhtml|INNERHTML|RIGHT_STYLE|hide|document|cache|options_key|LEFT_STYLE|setbubblepopupoptions|INNERHTML_STYLE|alignVerticalValues|managebubblepopup|visibility|alignValues|DIV_STYLE|DIV_ID|table|vertical|text|TABLE_STYLE|tbody|trim|jquerybubblepopup|visible|TEMPLATE_CLASS|250|div|model_markup|stop|setTimeout|charAt|model_td|mouseOutValues|Array|createElement|0px|push|mouseOverValues|MIDDLE_STYLE|positionValues|model_tr|HasBubblePopup|while|indexOf|round|getTime|IsBubblePopupOpen|GetBubblePopupID|extend|azure|GetBubblePopupCreationDateTime|GetBubblePopupMarkup|url|CreateBubblePopup|image|background|UnfreezeAllBubblePopups|UnfreezeBubblePopup|FreezeAllBubblePopups|FreezeBubblePopup|resize|mousemove|pageX|pageY|HideAllBubblePopups|appendTo|body|HideBubblePopup|20px|absolute|_STYLE|block|toUpperCase|10px|delete|GetBubblePopupLastDisplayDateTime|ShowAllBubblePopups|ShowBubblePopup|GetBubblePopupOptions|removeClass|13px|jQuery|SetBubblePopupOptions|GetBubblePopupLastModifiedDateTime|SetBubblePopupInnerHtml|theme|inArray|RemoveBubblePopup'.split('|'),0,{}))
/*! Swipebox v1.4.1 | Constantin Saguin csag.co | MIT License | github.com/brutaldesign/swipebox */
!function(a,b,c,d){c.swipebox=function(e,f){var g,h,i={useCSS:!0,useSVG:!0,initialIndexOnArray:0,removeBarsOnMobile:!0,hideCloseButtonOnMobile:!1,hideBarsDelay:3e3,videoMaxWidth:1140,vimeoColor:"cccccc",beforeOpen:null,afterOpen:null,afterClose:null,loopAtEnd:!1,autoplayVideos:!1,queryStringData:{},toggleClassOnLoad:""},j=this,k=[],l=e.selector,m=c(l),n=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i),o=null!==n||b.createTouch!==d||"ontouchstart"in a||"onmsgesturechange"in a||navigator.msMaxTouchPoints,p=!!b.createElementNS&&!!b.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,q=a.innerWidth?a.innerWidth:c(a).width(),r=a.innerHeight?a.innerHeight:c(a).height(),s=0,t='<div id="swipebox-overlay">					<div id="swipebox-container">						<div id="swipebox-slider"></div>						<div id="swipebox-top-bar">							<div id="swipebox-title"></div>						</div>						<div id="swipebox-bottom-bar">							<div id="swipebox-arrows">								<a id="swipebox-prev"></a>								<a id="swipebox-next"></a>							</div>						</div>						<a id="swipebox-close"></a>					</div>			</div>';j.settings={},c.swipebox.close=function(){g.closeSlide()},c.swipebox.extend=function(){return g},j.init=function(){j.settings=c.extend({},i,f),c.isArray(e)?(k=e,g.target=c(a),g.init(j.settings.initialIndexOnArray)):c(b).on("click",l,function(a){if("slide current"===a.target.parentNode.className)return!1;c.isArray(e)||(g.destroy(),h=c(l),g.actions()),k=[];var b,d,f;f||(d="data-rel",f=c(this).attr(d)),f||(d="rel",f=c(this).attr(d)),h=f&&""!==f&&"nofollow"!==f?m.filter("["+d+'="'+f+'"]'):c(l),h.each(function(){var a=null,b=null;c(this).attr("title")&&(a=c(this).attr("title")),c(this).attr("href")&&(b=c(this).attr("href")),k.push({href:b,title:a})}),b=h.index(c(this)),a.preventDefault(),a.stopPropagation(),g.target=c(a.target),g.init(b)})},g={init:function(a){j.settings.beforeOpen&&j.settings.beforeOpen(),this.target.trigger("swipebox-start"),c.swipebox.isOpen=!0,this.build(),this.openSlide(a),this.openMedia(a),this.preloadMedia(a+1),this.preloadMedia(a-1),j.settings.afterOpen&&j.settings.afterOpen()},build:function(){var a,b=this;c("body").append(t),p&&j.settings.useSVG===!0&&(a=c("#swipebox-close").css("background-image"),a=a.replace("png","svg"),c("#swipebox-prev, #swipebox-next, #swipebox-close").css({"background-image":a})),n&&j.settings.removeBarsOnMobile&&c("#swipebox-bottom-bar, #swipebox-top-bar").remove(),c.each(k,function(){c("#swipebox-slider").append('<div class="slide"></div>')}),b.setDim(),b.actions(),o&&b.gesture(),b.keyboard(),b.animBars(),b.resize()},setDim:function(){var b,d,e={};"onorientationchange"in a?a.addEventListener("orientationchange",function(){0===a.orientation?(b=q,d=r):(90===a.orientation||-90===a.orientation)&&(b=r,d=q)},!1):(b=a.innerWidth?a.innerWidth:c(a).width(),d=a.innerHeight?a.innerHeight:c(a).height()),e={width:b,height:d},c("#swipebox-overlay").css(e)},resize:function(){var b=this;c(a).resize(function(){b.setDim()}).resize()},supportTransition:function(){var a,c="transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");for(a=0;a<c.length;a++)if(b.createElement("div").style[c[a]]!==d)return c[a];return!1},doCssTrans:function(){return j.settings.useCSS&&this.supportTransition()?!0:void 0},gesture:function(){var a,b,d,e,f,g,h=this,i=!1,j=!1,l=10,m=50,n={},o={},p=c("#swipebox-top-bar, #swipebox-bottom-bar"),r=c("#swipebox-slider");p.addClass("visible-bars"),h.setTimeout(),c("body").bind("touchstart",function(h){return c(this).addClass("touching"),a=c("#swipebox-slider .slide").index(c("#swipebox-slider .slide.current")),o=h.originalEvent.targetTouches[0],n.pageX=h.originalEvent.targetTouches[0].pageX,n.pageY=h.originalEvent.targetTouches[0].pageY,c("#swipebox-slider").css({"-webkit-transform":"translate3d("+s+"%, 0, 0)",transform:"translate3d("+s+"%, 0, 0)"}),c(".touching").bind("touchmove",function(h){if(h.preventDefault(),h.stopPropagation(),o=h.originalEvent.targetTouches[0],!j&&(f=d,d=o.pageY-n.pageY,Math.abs(d)>=m||i)){var p=.75-Math.abs(d)/r.height();r.css({top:d+"px"}),r.css({opacity:p}),i=!0}e=b,b=o.pageX-n.pageX,g=100*b/q,!j&&!i&&Math.abs(b)>=l&&(c("#swipebox-slider").css({"-webkit-transition":"",transition:""}),j=!0),j&&(b>0?0===a?c("#swipebox-overlay").addClass("leftSpringTouch"):(c("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),c("#swipebox-slider").css({"-webkit-transform":"translate3d("+(s+g)+"%, 0, 0)",transform:"translate3d("+(s+g)+"%, 0, 0)"})):0>b&&(k.length===a+1?c("#swipebox-overlay").addClass("rightSpringTouch"):(c("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),c("#swipebox-slider").css({"-webkit-transform":"translate3d("+(s+g)+"%, 0, 0)",transform:"translate3d("+(s+g)+"%, 0, 0)"}))))}),!1}).bind("touchend",function(a){if(a.preventDefault(),a.stopPropagation(),c("#swipebox-slider").css({"-webkit-transition":"-webkit-transform 0.4s ease",transition:"transform 0.4s ease"}),d=o.pageY-n.pageY,b=o.pageX-n.pageX,g=100*b/q,i)if(i=!1,Math.abs(d)>=2*m&&Math.abs(d)>Math.abs(f)){var k=d>0?r.height():-r.height();r.animate({top:k+"px",opacity:0},300,function(){h.closeSlide()})}else r.animate({top:0,opacity:1},300);else j?(j=!1,b>=l&&b>=e?h.getPrev():-l>=b&&e>=b&&h.getNext()):p.hasClass("visible-bars")?(h.clearTimeout(),h.hideBars()):(h.showBars(),h.setTimeout());c("#swipebox-slider").css({"-webkit-transform":"translate3d("+s+"%, 0, 0)",transform:"translate3d("+s+"%, 0, 0)"}),c("#swipebox-overlay").removeClass("leftSpringTouch").removeClass("rightSpringTouch"),c(".touching").off("touchmove").removeClass("touching")})},setTimeout:function(){if(j.settings.hideBarsDelay>0){var b=this;b.clearTimeout(),b.timeout=a.setTimeout(function(){b.hideBars()},j.settings.hideBarsDelay)}},clearTimeout:function(){a.clearTimeout(this.timeout),this.timeout=null},showBars:function(){var a=c("#swipebox-top-bar, #swipebox-bottom-bar");this.doCssTrans()?a.addClass("visible-bars"):(c("#swipebox-top-bar").animate({top:0},500),c("#swipebox-bottom-bar").animate({bottom:0},500),setTimeout(function(){a.addClass("visible-bars")},1e3))},hideBars:function(){var a=c("#swipebox-top-bar, #swipebox-bottom-bar");this.doCssTrans()?a.removeClass("visible-bars"):(c("#swipebox-top-bar").animate({top:"-50px"},500),c("#swipebox-bottom-bar").animate({bottom:"-50px"},500),setTimeout(function(){a.removeClass("visible-bars")},1e3))},animBars:function(){var a=this,b=c("#swipebox-top-bar, #swipebox-bottom-bar");b.addClass("visible-bars"),a.setTimeout(),c("#swipebox-slider").click(function(){b.hasClass("visible-bars")||(a.showBars(),a.setTimeout())}),c("#swipebox-bottom-bar").hover(function(){a.showBars(),b.addClass("visible-bars"),a.clearTimeout()},function(){j.settings.hideBarsDelay>0&&(b.removeClass("visible-bars"),a.setTimeout())})},keyboard:function(){var b=this;c(a).bind("keyup",function(a){a.preventDefault(),a.stopPropagation(),37===a.keyCode?b.getPrev():39===a.keyCode?b.getNext():27===a.keyCode&&b.closeSlide()})},actions:function(){var a=this,b="touchend click";k.length<2?(c("#swipebox-bottom-bar").hide(),d===k[1]&&c("#swipebox-top-bar").hide()):(c("#swipebox-prev").bind(b,function(b){b.preventDefault(),b.stopPropagation(),a.getPrev(),a.setTimeout()}),c("#swipebox-next").bind(b,function(b){b.preventDefault(),b.stopPropagation(),a.getNext(),a.setTimeout()})),c("#swipebox-close").bind(b,function(){a.closeSlide()})},setSlide:function(a,b){b=b||!1;var d=c("#swipebox-slider");s=100*-a,this.doCssTrans()?d.css({"-webkit-transform":"translate3d("+100*-a+"%, 0, 0)",transform:"translate3d("+100*-a+"%, 0, 0)"}):d.animate({left:100*-a+"%"}),c("#swipebox-slider .slide").removeClass("current"),c("#swipebox-slider .slide").eq(a).addClass("current"),this.setTitle(a),b&&d.fadeIn(),c("#swipebox-prev, #swipebox-next").removeClass("disabled"),0===a?c("#swipebox-prev").addClass("disabled"):a===k.length-1&&j.settings.loopAtEnd!==!0&&c("#swipebox-next").addClass("disabled")},openSlide:function(b){c("html").addClass("swipebox-html"),o?(c("html").addClass("swipebox-touch"),j.settings.hideCloseButtonOnMobile&&c("html").addClass("swipebox-no-close-button")):c("html").addClass("swipebox-no-touch"),c(a).trigger("resize"),this.setSlide(b,!0)},preloadMedia:function(a){var b=this,c=null;k[a]!==d&&(c=k[a].href),b.isVideo(c)?b.openMedia(a):setTimeout(function(){b.openMedia(a)},1e3)},openMedia:function(a){var b,e,f=this;return k[a]!==d&&(b=k[a].href),0>a||a>=k.length?!1:(e=c("#swipebox-slider .slide").eq(a),void(f.isVideo(b)?e.html(f.getVideo(b)):(e.addClass("slide-loading"),f.loadMedia(b,function(){e.removeClass("slide-loading"),e.html(this)}))))},setTitle:function(a){var b=null;c("#swipebox-title").empty(),k[a]!==d&&(b=k[a].title),b?(c("#swipebox-top-bar").show(),c("#swipebox-title").append(b)):c("#swipebox-top-bar").hide()},isVideo:function(a){if(a){if(a.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/)||a.match(/vimeo\.com\/([0-9]*)/)||a.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/))return!0;if(a.toLowerCase().indexOf("swipeboxvideo=1")>=0)return!0}},parseUri:function(a,d){var e=b.createElement("a"),f={};return e.href=decodeURIComponent(a),f=JSON.parse('{"'+e.search.toLowerCase().replace("?","").replace(/&/g,'","').replace(/=/g,'":"')+'"}'),c.isPlainObject(d)&&(f=c.extend(f,d,j.settings.queryStringData)),c.map(f,function(a,b){return a&&a>""?encodeURIComponent(b)+"="+encodeURIComponent(a):void 0}).join("&")},getVideo:function(a){var b="",c=a.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/),d=a.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/),e=a.match(/(?:www\.)?vimeo\.com\/([0-9]*)/),f="";return c||d?(d&&(c=d),f=g.parseUri(a,{autoplay:j.settings.autoplayVideos?"1":"0",v:""}),b='<iframe width="560" height="315" src="//'+c[1]+"/embed/"+c[2]+"?"+f+'" frameborder="0" allowfullscreen></iframe>'):e?(f=g.parseUri(a,{autoplay:j.settings.autoplayVideos?"1":"0",byline:"0",portrait:"0",color:j.settings.vimeoColor}),b='<iframe width="560" height="315"  src="//player.vimeo.com/video/'+e[1]+"?"+f+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'):b='<iframe width="560" height="315" src="'+a+'" frameborder="0" allowfullscreen></iframe>','<div class="swipebox-video-container" style="max-width:'+j.settings.videoMaxWidth+'px"><div class="swipebox-video">'+b+"</div></div>"},loadMedia:function(a,b){if(0===a.trim().indexOf("#"))b.call(c("<div>",{"class":"swipebox-inline-container"}).append(c(a).clone().toggleClass(j.settings.toggleClassOnLoad)));else if(!this.isVideo(a)){var d=c("<img>").on("load",function(){b.call(d)});d.attr("src",a)}},getNext:function(){var a,b=this,d=c("#swipebox-slider .slide").index(c("#swipebox-slider .slide.current"));d+1<k.length?(a=c("#swipebox-slider .slide").eq(d).contents().find("iframe").attr("src"),c("#swipebox-slider .slide").eq(d).contents().find("iframe").attr("src",a),d++,b.setSlide(d),b.preloadMedia(d+1)):j.settings.loopAtEnd===!0?(a=c("#swipebox-slider .slide").eq(d).contents().find("iframe").attr("src"),c("#swipebox-slider .slide").eq(d).contents().find("iframe").attr("src",a),d=0,b.preloadMedia(d),b.setSlide(d),b.preloadMedia(d+1)):(c("#swipebox-overlay").addClass("rightSpring"),setTimeout(function(){c("#swipebox-overlay").removeClass("rightSpring")},500))},getPrev:function(){var a,b=c("#swipebox-slider .slide").index(c("#swipebox-slider .slide.current"));b>0?(a=c("#swipebox-slider .slide").eq(b).contents().find("iframe").attr("src"),c("#swipebox-slider .slide").eq(b).contents().find("iframe").attr("src",a),b--,this.setSlide(b),this.preloadMedia(b-1)):(c("#swipebox-overlay").addClass("leftSpring"),setTimeout(function(){c("#swipebox-overlay").removeClass("leftSpring")},500))},closeSlide:function(){c("html").removeClass("swipebox-html"),c("html").removeClass("swipebox-touch"),c(a).trigger("resize"),this.destroy()},destroy:function(){c(a).unbind("keyup"),c("body").unbind("touchstart"),c("body").unbind("touchmove"),c("body").unbind("touchend"),c("#swipebox-slider").unbind(),c("#swipebox-overlay").remove(),c.isArray(e)||e.removeData("_swipebox"),this.target&&this.target.trigger("swipebox-destroy"),c.swipebox.isOpen=!1,j.settings.afterClose&&j.settings.afterClose()}},j.init()},c.fn.swipebox=function(a){if(!c.data(this,"_swipebox")){var b=new c.swipebox(this,a);this.data("_swipebox",b)}return this.data("_swipebox")}}(window,document,jQuery);/*!
 * Masonry PACKAGED v3.3.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(window),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){}function d(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function e(c){function e(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||f("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=c("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var g=document.body||document.documentElement;g.appendChild(e);var h=j(e);l=200===b(h.width),g.removeChild(e)}}}function h(a){if(e(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var c=j(a);if("none"===c.display)return d();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var h=f.isBorderBox=!(!k||!c[k]||"border-box"!==c[k]),m=0,n=g.length;n>m;m++){var o=g[m],p=c[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=h&&l,y=b(c.width);y!==!1&&(f.width=y+(x?0:r+v));var z=b(c.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return h}var f="undefined"==typeof console?c:function(a){console.error(a)},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property")):a.getSize=e(a.getStyleProperty)}(window),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(a){function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a,b){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(c,d){return b(a,c,d)}):"object"==typeof exports?module.exports=b(a,require("doc-ready"),require("desandro-matches-selector")):a.fizzyUIUtils=b(a,a.docReady,a.matchesSelector)}(window,function(a,b,c){var d={};d.extend=function(a,b){for(var c in b)a[c]=b[c];return a},d.modulo=function(a,b){return(a%b+b)%b};var e=Object.prototype.toString;d.isArray=function(a){return"[object Array]"==e.call(a)},d.makeArray=function(a){var b=[];if(d.isArray(a))b=a;else if(a&&"number"==typeof a.length)for(var c=0,e=a.length;e>c;c++)b.push(a[c]);else b.push(a);return b},d.indexOf=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},d.removeFrom=function(a,b){var c=d.indexOf(a,b);-1!=c&&a.splice(c,1)},d.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1==a.nodeType&&"string"==typeof a.nodeName},d.setText=function(){function a(a,c){b=b||(void 0!==document.documentElement.textContent?"textContent":"innerText"),a[b]=c}var b;return a}(),d.getParent=function(a,b){for(;a!=document.body;)if(a=a.parentNode,c(a,b))return a},d.getQueryElement=function(a){return"string"==typeof a?document.querySelector(a):a},d.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},d.filterFindElements=function(a,b){a=d.makeArray(a);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f];if(d.isElement(h))if(b){c(h,b)&&e.push(h);for(var i=h.querySelectorAll(b),j=0,k=i.length;k>j;j++)e.push(i[j])}else e.push(h)}return e},d.debounceMethod=function(a,b,c){var d=a.prototype[b],e=b+"Timeout";a.prototype[b]=function(){var a=this[e];a&&clearTimeout(a);var b=arguments,f=this;this[e]=setTimeout(function(){d.apply(f,b),delete f[e]},c||100)}},d.toDashed=function(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()};var f=a.console;return d.htmlInit=function(c,e){b(function(){for(var b=d.toDashed(e),g=document.querySelectorAll(".js-"+b),h="data-"+b+"-options",i=0,j=g.length;j>i;i++){var k,l=g[i],m=l.getAttribute(h);try{k=m&&JSON.parse(m)}catch(n){f&&f.error("Error parsing "+h+" on "+l.nodeName.toLowerCase()+(l.id?"#"+l.id:"")+": "+n);continue}var o=new c(l,k),p=a.jQuery;p&&p.data(l,e,o)}})},d}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(c,d,e,f){return b(a,c,d,e,f)}):"object"==typeof exports?module.exports=b(a,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(a.Outlayer={},a.Outlayer.Item=b(a,a.EventEmitter,a.getSize,a.getStyleProperty,a.fizzyUIUtils))}(window,function(a,b,c,d,e){function f(a){for(var b in a)return!1;return b=null,!0}function g(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}var h=a.getComputedStyle,i=h?function(a){return h(a,null)}:function(a){return a.currentStyle},j=d("transition"),k=d("transform"),l=j&&k,m=!!d("perspective"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[j],o=["transform","transition","transitionDuration","transitionProperty"],p=function(){for(var a={},b=0,c=o.length;c>b;b++){var e=o[b],f=d(e);f&&f!==e&&(a[e]=f)}return a}();e.extend(g.prototype,b.prototype),g.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.getSize=function(){this.size=c(this.element)},g.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=p[c]||c;b[d]=a[c]}},g.prototype.getPosition=function(){var a=i(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=parseInt(a[c?"left":"right"],10),f=parseInt(a[d?"top":"bottom"],10);e=isNaN(e)?0:e,f=isNaN(f)?0:f;var g=this.layout.size;e-=c?g.paddingLeft:g.paddingRight,f-=d?g.paddingTop:g.paddingBottom,this.position.x=e,this.position.y=f},g.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={},d=b.isOriginLeft?"paddingLeft":"paddingRight",e=b.isOriginLeft?"left":"right",f=b.isOriginLeft?"right":"left",g=this.position.x+a[d];g=b.percentPosition&&!b.isHorizontal?g/a.width*100+"%":g+"px",c[e]=g,c[f]="";var h=b.isOriginTop?"paddingTop":"paddingBottom",i=b.isOriginTop?"top":"bottom",j=b.isOriginTop?"bottom":"top",k=this.position.y+a[h];k=b.percentPosition&&b.isHorizontal?k/a.height*100+"%":k+"px",c[i]=k,c[j]="",this.css(c),this.emitEvent("layout",[this])};var q=m?function(a,b){return"translate3d("+a+"px, "+b+"px, 0)"}:function(a,b){return"translate("+a+"px, "+b+"px)"};g.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={},k=this.layout.options;h=k.isOriginLeft?h:-h,i=k.isOriginTop?i:-i,j.transform=q(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},g.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},g.prototype.moveTo=l?g.prototype._transitionTo:g.prototype.goTo,g.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},g.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},g.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var r=k&&e.toDashed(k)+",opacity";g.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:r,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(n,this,!1))},g.prototype.transition=g.prototype[j?"_transition":"_nonTransition"],g.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},g.prototype.onotransitionend=function(a){this.ontransitionend(a)};var s={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};g.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,c=s[a.propertyName]||a.propertyName;if(delete b.ingProperties[c],f(b.ingProperties)&&this.disableTransition(),c in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[c]),c in b.onEnd){var d=b.onEnd[c];d.call(this),delete b.onEnd[c]}this.emitEvent("transitionEnd",[this])}},g.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(n,this,!1),this.isTransitioning=!1},g.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var t={transitionProperty:"",transitionDuration:""};return g.prototype.removeTransitionStyles=function(){this.css(t)},g.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.prototype.remove=function(){if(!j||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.once("transitionEnd",function(){a.removeElem()}),this.hide()},g.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("visibleStyle");b[c]=this.onRevealTransitionEnd,this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.prototype.getHideRevealTransitionEndProperty=function(a){var b=this.layout.options[a];if(b.opacity)return"opacity";for(var c in b)return c},g.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("hiddenStyle");b[c]=this.onHideTransitionEnd,this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(c,d,e,f,g){return b(a,c,d,e,f,g)}):"object"==typeof exports?module.exports=b(a,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):a.Outlayer=b(a,a.eventie,a.EventEmitter,a.getSize,a.fizzyUIUtils,a.Outlayer.Item)}(window,function(a,b,c,d,e,f){function g(a,b){var c=e.getQueryElement(a);if(!c)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(c||a)));this.element=c,i&&(this.$element=i(this.element)),this.options=e.extend({},this.constructor.defaults),this.option(b);var d=++k;this.element.outlayerGUID=d,l[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var h=a.console,i=a.jQuery,j=function(){},k=0,l={};return g.namespace="outlayer",g.Item=f,g.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e.extend(g.prototype,c.prototype),g.prototype.option=function(a){e.extend(this.options,a)},g.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},g.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},g.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},g.prototype._filterFindItemElements=function(a){return e.filterFindElements(a,this.options.itemSelector)},g.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},g.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},g.prototype._init=g.prototype.layout,g.prototype._resetLayout=function(){this.getSize()},g.prototype.getSize=function(){this.size=d(this.element)},g.prototype._getMeasurement=function(a,b){var c,f=this.options[a];f?("string"==typeof f?c=this.element.querySelector(f):e.isElement(f)&&(c=f),this[a]=c?d(c)[b]:f):this[a]=0},g.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},g.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},g.prototype._layoutItems=function(a,b){if(this._emitCompleteOnItems("layout",a),a&&a.length){for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d],g=this._getItemLayoutPosition(f);g.item=f,g.isInstant=b||f.isLayoutInstant,c.push(g)}this._processLayoutQueue(c)}},g.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},g.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},g.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},g.prototype._postLayout=function(){this.resizeContainer()},g.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},g.prototype._getContainerSize=j,g.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},g.prototype._emitCompleteOnItems=function(a,b){function c(){e.emitEvent(a+"Complete",[b])}function d(){g++,g===f&&c()}var e=this,f=b.length;if(!b||!f)return void c();for(var g=0,h=0,i=b.length;i>h;h++){var j=b[h];j.once(a,d)}},g.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},g.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},g.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},g.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e.removeFrom(this.stamps,d),this.unignore(d)}},g.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=e.makeArray(a)):void 0},g.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},g.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},g.prototype._manageStamp=j,g.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,e=d(a),f={left:b.left-c.left-e.marginLeft,top:b.top-c.top-e.marginTop,right:c.right-b.right-e.marginRight,bottom:c.bottom-b.bottom-e.marginBottom};return f},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.bindResize=function(){this.isResizeBound||(b.bind(a,"resize",this),this.isResizeBound=!0)},g.prototype.unbindResize=function(){this.isResizeBound&&b.unbind(a,"resize",this),this.isResizeBound=!1},g.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},g.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},g.prototype.needsResizeLayout=function(){var a=d(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},g.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},g.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},g.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},g.prototype.reveal=function(a){this._emitCompleteOnItems("reveal",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.reveal()}},g.prototype.hide=function(a){this._emitCompleteOnItems("hide",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.hide()}},g.prototype.revealItemElements=function(a){var b=this.getItems(a);this.reveal(b)},g.prototype.hideItemElements=function(a){var b=this.getItems(a);this.hide(b)},g.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},g.prototype.getItems=function(a){a=e.makeArray(a);for(var b=[],c=0,d=a.length;d>c;c++){var f=a[c],g=this.getItem(f);g&&b.push(g)}return b},g.prototype.remove=function(a){var b=this.getItems(a);if(this._emitCompleteOnItems("remove",b),b&&b.length)for(var c=0,d=b.length;d>c;c++){var f=b[c];f.remove(),e.removeFrom(this.items,f)}},g.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},g.data=function(a){a=e.getQueryElement(a);var b=a&&a.outlayerGUID;return b&&l[b]},g.create=function(a,b){function c(){g.apply(this,arguments)}return Object.create?c.prototype=Object.create(g.prototype):e.extend(c.prototype,g.prototype),c.prototype.constructor=c,c.defaults=e.extend({},g.defaults),e.extend(c.defaults,b),c.prototype.settings={},c.namespace=a,c.data=g.data,c.Item=function(){f.apply(this,arguments)},c.Item.prototype=new f,e.htmlInit(c,a),i&&i.bridget&&i.bridget(a,c),c},g.Item=f,g}),function(a,b){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):a.Masonry=b(a.Outlayer,a.getSize,a.fizzyUIUtils)}(window,function(a,b,c){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}var d=this.columnWidth+=this.gutter,e=this.containerWidth+this.gutter,f=e/d,g=d-e%d,h=g&&1>g?"round":"floor";f=Math[h](f),this.cols=Math.max(f,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c.indexOf(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d});$(document).ready(function(){

	file_pagenation();

	$('#'+$('#mode').val()+'_mode a').addClass('selected');

	$('#dir_mode .horizon_items, #thumb_mode .horizon_items').click(function(){
		$('.horizon_items').parent().removeClass('selected');
		$(this).parent().addClass('selected');
	});

	$('#dir_mode, #thumb_mode').click(function(){
		$('#mode').val($(this).data('mode'));
	});

	$('.dirlist .file_name').live('mouseover',function(){
		$('.file_name').removeAttr('style');
		$(this).css({'text-decoration':'underline','color':'blue'});
	});

	$('.file_name').live('mouseout',function(){
		$('.file_name').removeAttr('style');
	});

	$('.dirlist .list_file').live('click',function(){
		var cur_dir=$('#cur_dir').text();
		window_open(get_url(json_str.base_url+cur_dir+'/'+$(this).find('.file_name').text()),'1024','768',true);
	});

	$('.list_dir').live('click',function(){
		list_dir($(this).children().filter('.dir_path').text());
	});

	$('#dir_mode,#thumb_mode').live('click',function(){
		var mode = $(this).data('mode');
		list_dir($('.cur_dir').text(),mode);
	});

	$('#upload_close').live('click',function(){
		list_dir($('.cur_dir').text());
	});

	$('.list_file').live("mouseover",function(){
		$(this).contextMenu('album_context_menu', {
			bindings: {
				'address': function(t) {
					var address=json_str.base_url+$('#cur_dir').text()+'/'+$('#'+t.id).children().filter('.file_name').attr('title');
					try  {
						window.clipboardData.setData('text',address);
						top_message('成功复制文件地址','','okay');
					}
					catch(error) {
						simple_dialog('40%','30%','<p>浏览器的原因，请用鼠标和Ctrl+C拷贝：</p>'+address);
					}
				},
				'delete': function(t) {
					mydelete(t.id);
				}
			},
			onShowMenu: function(e, menu) {
				$('.jqContextMenu:last').css('z-index',1001);
				//blockUI's zIndex is set as 1000, if not this seeting ,sometimes conflict will happen
				//It has inline css style, so a global css file does not affect it.
				return menu;
			},
			itemStyle: {
				border: '1px dashed #cccccc',
				margin: '2px',
			}
		});
	});

	//删除文件--------------------------------------------------//
	$("#delete_file").live('click',function(){

		$.ajax({
			type: 'post',
			data: 'ajax=1&filename='+$('.to_be_deleted').children().filter('.file_name').attr('title')+'&filedir='+$('#cur_dir').text(),
			url : get_url(json_str.admin_base+"file_manager/file_delete"),
			success : function(data,textStatus){
				try{
					data=eval('(' + data + ')');
					if(data.result=='1')  {
						$('.to_be_deleted').remove();
						file_pagenation();
					}
					ajax_success(data,textStatus,'','json');
					$('.to_be_deleted').removeClass('to_be_deleted');
					if($('#mode').val()=='thumb')  $('#masonry-container').masonry();
				}
				catch(err){
					$('.to_be_deleted').removeClass('to_be_deleted');
					ajax_success('操作失败，请重试！',textStatus,'','string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
			complete: function() { $("#user_dialog").remove(); unblock_all(); }
		});
	});

	$('#dialog_cancel, #user_dialog .close').live('click',function(){
		$('.to_be_deleted').removeClass('to_be_deleted');
	});

	create_bubble_from($('#hide_for_upload_menu'),$('#upload_menu')); //show upload submenu

	$('.upload_file_type .select').live('click',function(){
		$('.select').removeClass('selected');
		$(this).addClass('selected');
		$('#file_type_selected').text($(this).attr('id').replace('_file_type',''));

		$('#upload_pannel').remove();
		$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
			$("body").append(data);
			block_all(function(){
				$('#image_browser_panel').block({message: null,overlayCSS: {opacity: 0.1}});
			});
			//阻止其他操作
			$("#upload_pannel").draggable({ cursor: 'move',handle:'#upload_head' });
			//可移动设置
		});
	});
});

function mydelete(obj) {
	$('#'+obj).addClass('to_be_deleted');
	var data ={
		"title"       : "确认对话框",
		"action"      : "删除文件",
		"object"      : "删除所选文件",
		"main_infor"  : "此举将彻底删除所选文件，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type"  : "warning",
		"submit"      : "delete_file"
	};
	var browser='not_ie6';
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
}

function return_root(){
	list_dir($('#root').text());
}

function return_upper(){
	var upper_dir=$('#cur_dir').text();
	upper_dir=upper_dir.split('/');
	upper_dir.reverse().shift();
	upper_dir=upper_dir.reverse().join('/');
	if(upper_dir) list_dir(upper_dir);
}

function list_dir(dir,mode,select) {
	var mode = arguments[1]?mode:$('#mode').val();
	var select = arguments[2]?select:$('#select').val();
	$.ajax({
		type: 'post',
		data: 'dir='+dir+'&mode='+ mode+'&select='+select,
		url:  get_url(json_str.admin_base+'file_manager/clist'),
		success : function(data,textStatus){
			$('#myclist_div').html(data);
			file_pagenation();
			$('.cur_dir').text($('#cur_dir').text());
			if($('#cur_dir').text()!=$('#root').text())
				$('#return_upper').show();
			else
				$('#return_upper').hide();
			if($('.list_thumb.list_file').length) selectAction();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}

function selectAction() {
	var acceptor = $($('#images_acceptor').val());
	var imgPreview = acceptor.data('preview');
	var imgNum = acceptor.data('num');
	var imgUrls=[];

	$('.list_thumb .select_it').click(function(){

		if($('.list_thumb .selected').length == imgNum &&  !$(this).hasClass('selected')) {
			top_message('只能选择' + imgNum + '张图片！', '', 'warn');
			return false;
		}
		else $(this).toggleClass('selected');

		if($('.list_thumb .selected').length == imgNum) {
			$('#image_browser_panel').append('<div class="sending_dialog"><a href="javascript:void(0);" class="okay"></a><a href="javascript:void(0);" class="cancel"></a></div>');
			$('.sending_dialog .cancel').one('click',function(){
				$('.sending_dialog').remove();
			})
			$('.sending_dialog .okay').one('click',function(){
				$('.list_thumb .selected').each(function(){
					imgUrls.push($(this).siblings('a').attr('href'));
				})

				acceptor.val(imgUrls.join('|'));

				for(var i in imgUrls)
				   $(imgPreview+' img').eq(i).attr('src',imgUrls[i]);

				top_message('成功选择图片',function(){
					$('#image_browser_panel').remove();
					unblock_all();
				},'okay');
			})
		}
		else $('.sending_dialog').remove();
	});
}


function pageCallback(page_index, jq){
	var $container = $('#masonry-container');
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.page_list_item').hide();

	for(var i=0;i<page_index*items_per_page+items_per_page;i++)
	{
		var $show_item=$('.page_list_item').not('.hide').eq(i);
		$show_item.show();
		$show_item.imagesLoaded(function () {
			$container.masonry();
		});
	}

	return false;
}

function file_pagenation() {
	var num_entries = $('.page_list_item').not('.hide').length;

	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
		callback: pageCallback,
		items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
		next_text: '下一页',
		prev_text: '上一页',
		link_to:   'javascript:void(0)'
	});
}