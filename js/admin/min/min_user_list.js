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
});/*
 * jSort - jQury sorting plugin
 * http://do-web.com/jsort/overview
 *
 * Copyright 2011, Miriam Zusin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://do-web.com/jsort/license
 */

(function($){
   $.fn.jSort = function(options){
	   
	var options = $.extend({
		sort_by: 'p',
		item: 'div',
		order: 'asc', //desc
		is_num: false
	},options);

	return this.each(function() {            
		var hndl = this;
		var titles = [];
		var i = 0;
		
		//init titles
		$(this).find(options.item).each(function(){
		
			var txt = $(this).find(options.sort_by).text().toLowerCase();				
			titles.push([txt, i]);
			
			$(this).attr("rel", "sort" + i);			
			i++;
		});
		
		this.sortNum = function(a, b){			
			return eval(a[0] -  b[0]);
		};
		
		this.sortABC = function(a, b){			
			return a[0] > b[0] ? 1 : -1;
		};
		
		if(options.is_num){
			titles.sort(hndl.sortNum);
		}
		else{
			titles.sort(hndl.sortABC);
		}	
		
		if(options.order == "desc"){
			if(options.is_num){
				titles.reverse(hndl.sortNum);
			}
			else{				
				titles.reverse(hndl.sortABC);
			}				
		}
		
		for (var t=0; t < titles.length; t++){
			var el = $(hndl).find(options.item + "[rel='sort" + titles[t][1] + "']");
			$(hndl).append(el);
		}
		
	});    
   };
})(jQuery);/**
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
};$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	//右键菜单生成
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {
			  'view':function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  $.post(get_url(json_str.admin_base+'user_member/other'),{user_id :cur_id[0]},function(data){
					  try{
						  data=eval('(' + data + ')');
						  if(data.result=='0')  ajax_success(data.infor,data.result,'','string');
					  }
					  catch(err){
						  $(".view").html(data);
						  $('.list').slideUp(function(){
							  $('.view').slideDown();
						  });
					  }
				  });
			  },
			  'edit':  function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  edit_user(cur_id[0]);
			  },
			  'delete': function(t) {
				  mydelete(t);
			  },
			  'dieuser': function(t) {
				  setlife(t,'0');
			  },
			  'lifeuser': function(t) {
				  setlife(t,'1');
			  },
			  'right' : function(t) {
				  var cur_id=t.id;
				  cur_id=cur_id.split('_');
				  $.post(get_url(json_str.admin_base+'user_right'),{user_id :cur_id[0],ajax :'yes'},function(data){
					  try{
						  data=eval('(' + data + ')');
						  if(data.result=='1') {
							  $(".edit").html(data.infor);
							  $('.list').slideUp('fast',function(){
								  $('.edit').slideDown();
							  });
						  }
						  else ajax_success(data.infor,data.result,'','string');
					  }
					  catch(err){
						  ajax_success('操作失败，请重试！',textStatus,'','string');
					  }
				  });
			  }
	      },
	      onShowMenu: function(e, menu) {
	          if ($(e.target).parent().find('.is_admin').text()=='0' || $(e.target).parent().find('.is_super_admin').text()=='0.0') {
	            $('#right', menu).remove();
	          }
	          return menu;
	     },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });		
	
	//横向导航
	
	$('#user_list_link').click(function(){
         refresh_user_list();       
	});
	
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	//js对数据排序结束---------------------------------------------//
	
	search_bubble(); //搜索设置
	
	//新建用户-----------------------------------------------//
	$('#new_entry').live('click',function(){		
		$.get(get_url(json_str.admin_base+'user_member/edit_member/form'), function(data){
			$(".edit").html(data);
			$('.list').slideUp('fast',function(){
				$('.edit').slideDown();
			});
		});		
	});
	
	//删除用户--------------------------------------------------//
	$("#delete_user").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"user_member/delete_user/"),
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

//-----右键菜单操作函数----------------------------------------------//
function mydelete(obj) {
	  var title=get_title(obj);
	  var ids_to_delete=get_id_list(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除用户 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除用户的资料，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_user"
	        };
	  var browser='not_ie6';
	  $('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}

function setlife(obj,value) {
	var ids_selected=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_selected+'&value='+value,
			url : get_url(json_str.admin_base+"user_member/set_life/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') {
	                	ids=ids_selected.split(',');
	                	for(var i=0; i<ids.length; i++) {
	                		if(value=='1') $('.user_life_'+ids[i]).html('<span style="color:green;">√</span>');
	                		else $('.user_life_'+ids[i]).html('<span style="color:red;">×</span>');
	                	}
	                }
	                ajax_success(data,textStatus,'','json');
	             }
				 catch(err){
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	            }
			},
		   error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}		
	   });
}

function get_id_list(obj) {
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

function get_title(obj) {
	  var title='选中的用户'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_title').text();
}

function refresh_user_list() {	
	$.get(get_url(json_str.admin_base+'user_member/clist/ajax'),function(data){
		$("#clist_data").html(data);
		$('.edit').slideUp('fast',function(){
			$('.view').slideUp('fast',function(){
				$('.list').slideDown();
				initPagination();
			});
		});
	});
}

function edit_user(user_id) {

	$.post(get_url(json_str.admin_base+'user_member/edit_member/form'),{user_id :user_id},function(data){
		try{
			data=eval('(' + data + ')');
			if(data.result=='0')  ajax_success(data.infor,data.result,'','string');
		}
		catch(err){
			$(".edit").html(data);
			$('.view').slideUp('fast',function(){
				$('.list').slideUp(function(){
					$('.edit').slideDown();
				});
			});
		}
	});
}
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

}$(document).ready(function() {

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