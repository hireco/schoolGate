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
var select_for='';
var myTimer;
var initial_images='';
$(document).ready(function(){

	initPagination(); //初始化分页
	
	//设置提示信息
	bubble_initial($('#hint_for_imgsize'),'宽度=（元素宽度-22）/每行拟显示数-10 <br /> 高度不限，若元素高度存在，则高度必须在元素高度以内'); 
	bubble_initial($('#hint_for_adssize'),'宽度必填，须在区块所放的父级尺寸以内，<br />除图片或动画媒体外，高度不确定可留空或填0');
	
	//右键菜单生成	 
	$('[id$="_table"],[id^="adsimg_no_"]').live("mouseover",function(){
	   $(this).contextMenu('mycontext_menu', { 
		   bindings: {			  
		       'edit':  function(t) {
				   myedit(t);
			   },
			   'delete': function(t) {
				   mydelete(t);
			   },
			   'crop': function(t) {
				   var cur_id=t.id;
				   var imgsrc=$('img#'+cur_id).attr('src').split('?').shift();
		    	   imgsrc=imgsrc.replace(json_str.site_base,'');
		    	   imgsrc=imgsrc.replace(json_str.base_url.replace(json_str.site_base,''),'');
		    	   
		    	   var size=[];
		    	   size[0]=$('#ads_width').val();
		   		   size[1]=$('#ads_height').val();
		   		   
	   			   var data ={
	   		      	 "action"       : 'crop',
	   		         "t_width"      : size[0],
	  	             "t_height"     : size[1],
	   				 "preview"      : imgsrc,
	   				 "path"         : imgsrc.replace(basename(imgsrc),''),
	   				 "crop_for"     : 'crop',
	   				 "refresh"      : cur_id
	   		      };
	   			  show_upload_crop(data);
			   }
		  },
		  onShowMenu: function(e, menu) {
		          if ($(e.target).is('li')) {
		            $('#crop', menu).remove();
		          }
		          if ($(e.target).is('img')) {
		        	  $('#delete, #edit,#copy_id', menu).remove();
			          if(!resources_is_local($(e.target).attr('src')))  return false;		        	  
			      }
		          return menu;
		  },
		  itemStyle: {	    	 
		          border: '1px dashed #cccccc',
		          margin: '2px'
		  }    
	   });	
	});	
	
	//媒体上传部分
	$('#upload_media').live('click',function(){
        $('#upload_pannel').remove();
    	$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    		$("body").append(data);
			block_all();
			//阻止其他操作
			$("#upload_pannel").draggable({ cursor: 'move' });
			//可移动设置
    	});
     });
	
	//图片上传部分
	$("#upload_image").live('click',function(){
		var size=[];
		size[0]=$('#ads_width').val();
		size[1]=$('#ads_height').val();
		
		var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'ads_image',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html(),
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});
	
	$(".close_pannel").live('click',function(){		 
	   	 myTimer=setInterval(detect2show_images, 100);
	});	
	
	function detect2show_images(){
		var ads_image=$('#ads_image').val();
		if(ads_image!=initial_images) {
			initial_images=ads_image;
			$('.form_pic_show').show();	
			$('#show_image_div').html('<img id="adsimg_no_'+Math.round(Math.random()*100)+'" src="'+ads_image+'" />'); 
	   		clearInterval(myTimer);
		}		
   	 }
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//提交表单部分 ----------------------------------//
	$('#advertise_submit').click(function(){
         var data=[],flag=1;
         var spot_image=$('#ads_image').val();
         var oEditor=FCKeditorAPI.GetInstance('editor_content'); 
         
         if($.trim($('#ads_title').val())=='') {
            top_message('请填写区块元素的名称');
            return false;
         } 
            		 
 		 $('.my_form_item:visible :input:visible:not(:radio), .my_form_item:visible :input:visible:radio:checked').each(function(){
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message('表单尚未填写完整'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
             data.push($(this).attr('name')+'='+escape($.trim($(this).val())));
         });
         
         if(!flag) return false;
         
         data=data.join('&');
         
         data=data+'&ads_id='+$('#ads_id').val();
         
         if($('#ads_type').val()=='html') {
        	 $('#ads_html').val(oEditor.GetXHTML( true ));
        	 data=data+'&ads_html='+escape($('#ads_html').val());
         }
         
         $.ajax({
            type: 'post',
            url : get_url(json_str.admin_base+'advertise/submit'),
            data: data,
            success : function(data,textStatus){   	       	     
       	        try{ 
                   data=eval('(' + data + ')'); 
                   if(data.result=='1') {
                	   delete_images_sql();
                	   ajax_success(data,textStatus,'','json');
                	   refresh_ads_list();
                   }
                   else  ajax_success(data,textStatus,data.url,'json');
                } 
   			    catch(err){
   			    	alert(data);
   			    	ajax_success('操作失败，请重试！',textStatus,'','string');
                }
   	       },
   	       error  : function(XMLHttpRequest, textStatus, errorThrown){
   	   	        ajax_failed(textStatus);
   	   	   }         
         }); 
	});
	
	//选择mysql的字段
	$('#mysql_table').live('click',function(){
        var obj=$(this);
        var data='';
        obj.blur();
        $('div.items_object').each(function(){
        	data+='<li class="mysql_items" title="'+$(this).attr('title')+'">'+$(this).text()+'</li>';
        });
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul>'+data+'</ul>','100');         
    });
	
	$('li.mysql_items').live('click',function(){
		var old_value=$('#mysql_table').val();
		var new_value=$(this).attr('title');
		$('#mysql_table').val($(this).attr('title'));
		if(old_value!=$('#mysql_table').val()) $('#mysql_order_by').val('');
		
		$('[name="mysql_mode"][value="text"]').attr('checked',true);
		$('[name="mysql_mode"]').attr('disabled',true);
		$('ul.mode_items').filter('.of_'+new_value).children().each(function(){
			$('[name="mysql_mode"][value="'+$(this).attr('title')+'"]').attr('disabled',false);
		});
	});
	
	$('#mysql_order_by').live('click',function(){
        var obj=$(this);
        var data='';
        obj.blur();
        
        if($('#mysql_table').val()=='') { 
        	top_message('请先选择数据表');
        	return false;
        }
        
        data=$('ul.order_items').filter('.of_'+$('#mysql_table').val()).html();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul class="mysql_order_items">'+data+'</ul>','100');         
    });
	
	$('.mysql_order_items li').live('click',function(){
		$('#mysql_order_by').val($(this).attr('title'));
	});
	
	$('[name="mysql_mode"][value="image"]').live('click',function(){
		$('.image_size').show();
	});
	
	$('[name="mysql_mode"][value="text"]').live('click',function(){
		$('.image_size').hide();
	});
	
	$('#mysql_direction').live('click',function(){
        var obj=$(this);
        var data='<ul class="mysql_direction_items"><li title="v">纵向</li><li title="h">横向</li></ul>';
        obj.blur();
        simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,'<ul>'+data+'</ul>','50');         
    });
	
	$('.mysql_direction_items li').live('click',function(){
		$('#mysql_direction').val($(this).attr('title'));
	});
	
	//新建表单----------------------------------------------//
	
	$('#add_advertise').live('click',function(){		
		if($('#return_to_form:visible').length) {
			top_message('尚有未完成的表单，请继续！');
			$('#return_to_form').click();
			return false;
		}
		clear_form();
		
		var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
		oEditor.SetData('') ;
		
		$('#add_div').slideDown();
		$('#clist_div').slideUp();
		$('#simple_dialog').remove();
	});
	
	$('#ads_type').change(function(){
		var cur_val=$(this).val();
		$('.shift_div').hide();
		$('.shift_div.for_'+cur_val).show();
		$('[name="to_upload"][value="1"]').attr('checked',true);
		
		if(cur_val=='image' && $('#show_image_div').html()) $('.form_pic_show').show();
		else $('.form_pic_show').hide();
		
		(cur_val=='image' || cur_val=='flash')?$('.resources_type').show():$('.resources_type').hide();
	});	
	
	$('.resources_type [name="to_upload"]').change(function(){
		$('.shift_div:visible .div_upload').toggle();
		$('.shift_div:visible .div_url').toggle();
	});
	
	//取消正在编辑的对象
	$('#advertise_cancel').live('click',function(){
		delete_images_cancel();
		clear_form();
		$('#add_div').slideUp();
		$('#clist_div').slideDown();
	});
	
	
	
	//删除对象--------------------------------------------------//
	$("#delete_advertise").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"advertise/delete_advertise/"),
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

function clear_form() {
	
	initial_images='';
	$('.resources_type').hide();
	$('[name="to_upload"][value="1"]').attr('checked',true);
	$('.shift_div .div_upload').show();
	$('.shift_div .div_url').hide();
	
	$('#ads_type').children().first().attr('selected',true);
	$('.shift_div').hide();
	$('.for_html').show();	
	
	$('.form_pic_show').hide(); 
	$('#show_image_div').html('');
	$('#ads_title').val('');
	$('#ads_hint').val('');
	$('#ads_width').val('238');
	$('#ads_height').val('200');
	$('#ads_id').val('0');
	$('#ads_image').val('');
	$('#image_link').val('');
	$('#ads_image_url').val('');
	$('#ads_image_sql').val('');
	$('#ads_image_old').val('');
	
	$('input:text').removeAttr('style');
	$('.form_title').text('添加区块元素');
	$('#ads_html').text('');
	$('#ads_script').val('');
	$('#ads_flash').val('');
	$('#ads_flash_url').val('');
	
	$('[name="mysql_mode"][value="text"]').attr('checked',true);
	$('[name="mysql_mode"]').attr('disabled',true);
	$('.image_size').hide();
	$('#mysql_table').val('');
	$('#mysql_order_by').val('');
	$('#mysql_where').val('');
	$('#mysql_num').val('10');
	$('#mysql_width').val('');
	$('#mysql_height').val('');
	$('#mysql_direction').val('');
}

function myedit(obj) {
	var ids_select;
	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
	oEditor.SetData('正在导入......');
	
	clear_form();
	
	ids_select=obj.id.split('_'); 
	ids_select=ids_select[0];		
	
	$('#ads_title').val($('#'+obj.id).children().filter('.by_title').text());
	$('#ads_hint').val($('#'+obj.id).children().filter('.ads_hint').attr('title'));
	$('#ads_width').val($('#'+obj.id).children().filter('.by_width').text());
	$('#ads_height').val($('#'+obj.id).children().filter('.by_height').text());
	
	$('#ads_id').val(ids_select);
	$('#ads_type').children().filter(':contains("'+$('#'+obj.id).children().filter('.by_type').text()+'")').attr('selected',true);
	$('#ads_html').text('正在导入......');	
	
	$('.form_title').text('编辑区块元素');
	
	$('.shift_div').hide();
	$('.shift_div.for_'+$('#ads_type').val()).show();
	
	$('#clist_div').slideUp('fast',function(){
		$('#add_div').slideDown('fast',function(){
			$.post(get_url(json_str.admin_base+'advertise/ads_content/'+$('#ads_id').val()),function(data){
				$('.resources_type').hide();
				if($('#ads_type').val()=='image') {
					data=eval('(' + data + ')');
					initial_images=data.ads_image;					
					
					if(initial_images) {
						if(resources_is_local(initial_images)) $('#ads_image').val(initial_images);
						else {
							$('[name="to_upload"][value="0"]').attr('checked',true);
							$('.shift_div:visible .div_upload').toggle();
							$('.shift_div:visible .div_url').toggle();
							$('#ads_image_url').val(initial_images);
						}
						
						$('#image_link').val(data.image_link);
						$('#ads_image_sql').val(initial_images);
						$('#show_image_div').html('<img id="adsimg_no_'+Math.round(Math.random()*100)+'" src="'+initial_images+'?t='+Math.round(Math.random()*100)+'" />');
						$('.form_pic_show').show();
					}
					
					$('.resources_type').show();
				}
				else if($('#ads_type').val()=='flash') {
					if(resources_is_local(data)) $('#ads_flash').val(data);
					else {
						$('[name="to_upload"][value="0"]').attr('checked',true);
						$('.shift_div:visible .div_upload').toggle();
						$('.shift_div:visible .div_url').toggle();
						$('#ads_flash_url').val(data);
					}
					$('.resources_type').show();
				}
				else if($('#ads_type').val()=='script') $('#ads_script').val(data);
				else if($('#ads_type').val()=='html') oEditor.SetData(data);
				else if($('#ads_type').val()=='mysql') {
					data=eval('(' + data + ')');
					$('#mysql_table').val(data.table);
					$('#mysql_order_by').val(data.order_by);
					$('#mysql_num').val(data.num);
					$('#mysql_where').val(data.where);
					$('#mysql_direction').val(data.direction);
					
					$('[name="mysql_mode"][value="'+data.mode+'"]').attr('checked',true);
					$('ul.mode_items').filter('.of_'+data.table).children().each(function(){
						$('[name="mysql_mode"][value="'+$(this).attr('title')+'"]').attr('disabled',false);
					});
					
					if(data.mode=='image') {
						$('#mysql_width').val(data.width);
						$('#mysql_height').val(data.height);
						$('.image_size').show();
					}	
				}
			});
		});
	});
}

function mydelete(obj) {
	var title=get_title(obj);
	var ids_to_delete=get_ids_list(obj);
	  
	var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除区块项目 ", 
	         "object"      : title,
	         "main_infor"  : "将删除所选区块，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_advertise"
	        };
	var browser='not_ie6';
	$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
	data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data,browser);
}

function get_title(obj) {
	  var title='选中的区块元素'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_name').text();
}

function get_ids_list(obj) {
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

function refresh_ads_list() {
	$.ajax({
		 type: 'post',
		 url:  get_url(json_str.admin_base+'advertise/clist/ajax'),
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
				$('#add_div').slideUp();
				$('#clist_div').slideDown();	
	            initPagination();
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

function bubble_initial(obj,html) {

	 addcss2head('js/bubblepopup/jquery.bubblepopup.v2.3.1.css');   
	 obj.CreateBubblePopup({			
	     selectable: false,
		 position : 'top',
		 align	  : 'center',	
		 innerHtml:  html,
		 innerHtmlStyle: {'text-align':'left','font-size':'12px;'},	
		 themeName: 	'all-black',
		 themePath: 	json_str.base_url+'js/bubblepopup/jquerybubblepopup-theme' 
	 });
}