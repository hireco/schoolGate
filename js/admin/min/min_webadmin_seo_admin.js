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
$(document).ready(function(){
	
	initPagination(); //初始化分页
	
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); 
			}
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	
    
	$('.seo_list').live('click',function(){
		 
		 $(this).parent().addClass('selected');
		 $.ajax({
			 type: 'post',
			 url:  get_url(json_str.admin_base+'seo_admin/clist/ajax'),
		     success: function(data,textStatus){
				 if(data){
		            $("#clist_data").html(data);
		            $('.edit').slideUp();
		            $('.list').slideDown();		            
		            initPagination();
				  }
				 else ajax_success('',textStatus,'','string');
			 }
		 });
	});//按类型来刷新配置列表
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true); 
	});
	
	$('.seo_add').live('click',function(){
		$.get(get_url(json_str.admin_base+'seo_admin/add'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});//显示添加配置表单
	
	$('#uri_string').live('change',function(){
		$.post(get_url(json_str.admin_base+'seo_admin/chk_uri_string'),{uri_string: $('#uri_string').val()},function(data){
			if(data=='0') { 
				top_message('访问地址不符合要求，或者已经存在！');
				$('#uri_string').val('');
			}
		});
	});//验证参数名是否符合要求
	
	$("#seo_submit").live('click',function(){
		var data,flag=1;
		var inputs = [];
	    
		if($.trim($('#uri_string').val())==json_str.base_url) {
			top_message('请输入访问地址');
			return false;
		}
		
	    $('#addseo_edit :input').each(function() {
	     	 if($(this).val()=='' && $(this).hasClass('filled')) { 
	   			 top_message('表单尚未填写完整'); 
	   			 flag=0; return false;
	   		 }
	     	 inputs.push(this.name + '=' + escape(this.value));
	    });
	    
	    if(!flag) return false;
	    
	    data=inputs.join('&');
	    
	    $.ajax({
			 type: 'post',
			 data: data+'&seo_submit='+$('#seo_submit').val(),
			 url:  get_url(json_str.admin_base+'seo_admin/edit/'+$('#seo_id').val()+'/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,data.url,'json');
					  }
				   catch(err){
					 	 ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交编辑参数结果
	
	$("#seo_add_submit").live('click',function(){
	    var data,flag=1;
		var inputs = [];
	    
		if($.trim($('#uri_string').val())==json_str.base_url) {
			top_message('请输入访问地址');
			return false;
		}
		
	    $('#addseo_add :input').each(function() {
	     	 if($(this).val()=='' && $(this).hasClass('filled')) { 
	   			 top_message('表单尚未填写完整'); 
	   			 flag=0; return false;
	   		 }
	     	 inputs.push(this.name + '=' + escape(this.value));
	    });
	    
	    if(!flag) return false;
	    
	    data=inputs.join('&');
		
		$.ajax({
			 type: 'post',
			 data: data+'&seo_add_submit='+$('#seo_add_submit').val(),
			 url:  get_url(json_str.admin_base+'seo_admin/add/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,data.url,'json');
					  }
				   catch(err){
					 	 ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交添加参数结果
	
	$("#seo_cancel,#seo_add_cancel").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$('.delete_this').live('click',function(){
		var cur_id=$(this).closest('ul').attr('id');
		var title=$('#'+cur_id+' li').filter('.seo_title').text();
		var ids_to_delete=cur_id.replace('_table','');
		  
		var data ={
		      	 "title"       : "确认对话框",
		         "action"      : "删除设置项目 ", 
		         "object"      : title,
		         "main_infor"  : "调用该项目的页面的SEO将失效，确认吗？",
		         "dialog_view" : "dialog_infor",
		         "infor_type"  : "warning",
		         "submit"      : "delete_seo"
		        };
		var browser='not_ie6';
		$('#id_be_selected').val(ids_to_delete); //saved for delete action to use    	
		data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
		show_dialog(data,browser);
	});
	//显示删除项目的提示对话框
	
	$("#delete_seo").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_be_selected').val(),
			url : get_url(json_str.admin_base+"seo_admin/delete_seo/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  {
						$('#'+data.id+'_table').remove();
						initPagination();
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
	}); //删除某个附加的参数

});

     function myedit(obj) {
		 var id=obj.id.split('_');
         $.ajax({
         	   type: 'post',			   
         	   url:  get_url(json_str.admin_base+"seo_admin/edit/"+id[0]),
         	   success : function(data,textStatus){
					 try{
					     data = eval('(' + data + ')');	
					     if(data.result=='1'){
						 		$(".edit").html(data.infor);
					            $('.list').slideUp();
					            $('.edit').slideDown();
						 }
						 else  ajax_success(data,textStatus,'','json');
					  }
					 catch(err){
					 	 ajax_success('',textStatus,'','string');
					  }
         	  },
         	  error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
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