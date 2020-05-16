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
	
	//名称检验
	$('#en_title').live('keyup',function(){
		$('#visiting_url').text(json_str.base_url+'html/view/'+$(this).val());
	});

	$('#cn_title').live('change',function(){
		var obj=$(this);
	    
		if(speical_chars(obj.val())) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"html_page/js_check_title/"+obj.attr('id')),{html_id: $('#html_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名页面已经存在！'); 
			   return false;
		   } 
		   else  $.post(get_url(json_str.base_url+'ajax/cms_ajax/get_pinyin_name'),{cn_name : obj.val()},function(data){
			      $('#en_title').val(data);	
				  $('#visiting_url').text(json_str.base_url+'html/view/'+data);
		      });
	     }); 	
	});

	$('#switch_for_en_title').live('click',function(){
	     $('#for_en_title').toggle();
	});

	$('#en_title').live('change',function(){
		var obj=$(this);
		var data=obj.val();
	    
		if(!seo_url_check(data)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"html_page/js_check_title/"+obj.attr('id')),{html_id: $('#html_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名页面已经存在！'); 
			   obj.val('');
			   return false;
		   } 
	     }); 	

		$('#visiting_url').text(json_str.base_url+'html/view/'+obj.val());	
	});
	
	//数据排序开始-------------------------------------//
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//切换标签
    $('.horizon_items').live('click',function(){
     var cur_id=$(this).attr('id').split('_');
     
     $('.horizon_items').removeClass('selected');
     $(this).addClass('selected');
     
     $.ajax({
        type: 'post',
        url:   get_url(json_str.admin_base+'html_page/'+cur_id[1]),
        success: function(data,textStatus) {
        	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
            $('#data_viewer').html(data); 
            if(cur_id[1]=='edit' && cur_id[0]=='full')  { 
            	oEditor.Config['FullPage']=true; 
            	oEditor.SwitchEditMode();
            	
            	if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
            	//必须切换到所见即所得的模式
            	
            	oEditor.SetHTML('<html dir="ltr"><head><title></title></head><body><p>&nbsp;</p></body></html>'); 
            	$('#fckeditor_div').show();
            	
            	$('#full_page').val('1');
            	$('#part_page_warning').hide();
            }
            else if(cur_id[1]=='edit' && cur_id[0]=='part')  { 
            	oEditor.Config['FullPage']=false;
            	oEditor.SwitchEditMode();
            	
            	if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
            	//必须切换到所见即所得的模式
            	$('#fckeditor_div').show();
            	
            	$('#full_page').val('0');
            	$('#part_page_warning').show();
            }
            else { 
            	$('#fckeditor_div').hide();
            	initPagination(); //重新分页
            }
        },
        error: function(textStatus) {
        	ajax_failed(textStatus);
        }
      });       
    });

	//生成右键菜单
    $('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); 
			}, 
			'address': function(t) {		       
			   var obj=$('#'+t.id);
			   text_selected('拷贝地址',$('#'+t.id+' .by_address').text(),obj);
		   },
		   'copy_id': function(t) {
			   var obj=$('#'+t.id);
			   var ids=get_id_list(t);
			   
			   try{ $(window.opener.document).find('.copy_id_to_filled').val(ids); }
			   catch(err) { 
				   if($.browser.msie)  window.clipboardData.setData('text',ids); 
				   else  text_selected('拷贝ID',ids,obj);
			   }
		   },
		   'locked':function(t) {
			   set_item_attr(t,'locked','1','item_onoff');
		   },
		   'no_locked':function(t) {
			   set_item_attr(t,'locked','0','item_onoff');
		   }, 
		   'hide':function(t) {
			   set_item_attr(t,'hide','1','item_onoff');
		   },
		   'no_hide':function(t) {
			   set_item_attr(t,'hide','0','item_onoff');
		   },    
			'delete': function(t) {
				mydelete(t);},
		    'view': function(t) {
		    	myview(t);},
		    'show': function(t) {
		    	myshow(t);}
	      },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });

    $('#html_submit').live('click',function(){
        var data;
    	var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
    	var innerhtml=oEditor.GetXHTML(true);
    	if(actual_txtlength(innerhtml,'len')==0) {
            top_message('请输入主体内容');
            return false;
        }
    	else $('#html_content').val(innerhtml);
    	 
    	if($.trim($('#cn_title').val())=='') {
    		top_message('请输入中文名称！');
    		return false;
    	} 

    	if($.trim($('#en_title').val())=='') { 
    		top_message('请输入访问英文ID！');
    		return false;
    	}
        
    	data='group_id='+$('#group_id').val()+'&full_page='+$('#full_page').val()+'&html_id='+$('#html_id').val()+'&cn_title='+escape(beforeEscape($('#cn_title').val()))+'&en_title='+escape(beforeEscape($('#en_title').val()))+'&html_content='+escape(beforeEscape($('#html_content').val()));
        
    	$.ajax({
       	    type: 'post',
            url:   get_url(json_str.admin_base+"html_page/edit"),
            data:  data,
            success : function(data,textStatus){ 
				 try{ 
	                data=eval('(' + data + ')');
					ajax_success(data,textStatus,data.url,'json');
                 }
				 catch(err){
	                 //alert(data);
					 ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
			 },
			 error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
        });	
    });	

    $("#delete_page").live('click',function(){		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_to_delete').val(),
			url : get_url(json_str.admin_base+"html_page/delete_html/"),
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
    
    $("#html_cancel").live('click',refresh_pages_list);
});
  
  function myview(obj) {
	  var id=obj.id.split('_');
	  window.open(get_url(json_str.admin_base+"html_page/preview/"+id[0]),'newwin','toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=no, status=no');
  }  
  
  function myshow(obj) {
	  var id=$('#'+obj.id+' .by_en_title').text();
	  window_open(get_url(json_str.base_url+"html/"+id),'1024','768',true);
  }
  
  function set_item_attr(obj,attr,value,action) {
	  
	  var ids_selected=get_id_list(obj);
	  
	  $.ajax({
			type: 'post',
			data: 'ajax=1&id='+ids_selected+'&attr='+attr+'&value='+value,
			url : get_url(json_str.admin_base+"html_page/"+action),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
	                if(data.result=='1') {
	                	ids=ids_selected.split(',');
	                	for(var i=0; i<ids.length; i++) {
	                		$('#'+attr+'_'+ids[i]).removeAttr('class');
	                		$('#'+attr+'_'+ids[i]).addClass('attr_'+value);
	                	}
	                	//refresh_pages_list();
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

  function myedit(obj) {
	  var oEditor = FCKeditorAPI.GetInstance('editor_content') ;
	  var id=obj.id.split('_');
	  var page_mode =$.trim($('#'+obj.id).children().filter('.page_mode').text())=='是'?true:false;
	  
	  $('.horizon_items').removeClass('selected');
	  page_mode?$('#full_edit').addClass('selected'):$('#part_edit').addClass('selected');
	  
	  $.ajax({
      	   type: 'post',
      	   data: 'html_id='+id[0],
      	   url:  get_url(json_str.admin_base+"html_page/edit"),
      	   success : function(data,textStatus){
      		    $('#data_viewer').html(data);
		 		
		 		if(page_mode) oEditor.Config['FullPage']=true;
		 		else oEditor.Config['FullPage']=false;
		 		
		 		oEditor.SwitchEditMode();
		 		
		 		if(oEditor.EditMode != FCK_EDITMODE_WYSIWYG)  oEditor.SwitchEditMode();
		 		//必须切换到所见即所得的模式
		 		
		 		oEditor.SetHTML($('#html_content').val());					 		
		 		$('#fckeditor_div').show();
		 		
		 		$('#full_page').val(page_mode?'1':'0');
		 		if(!page_mode) $('#part_page_warning').show();
      	  },
      	  error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
     });	
  }

  function mydelete(obj) {
	  
	  var title=get_title(obj);
	  var ids_to_delete=get_id_list(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除静态页面 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除其所有内容，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_page"
	        };
	  var browser='not_ie6';
	  $('#id_to_delete').val(ids_to_delete); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
  }
  
  function refresh_pages_list() {
	    $.get(get_url(json_str.admin_base+'html_page/pages'),function(data){
	    	$('#data_viewer').html(data);
	    	$('#fckeditor_div').hide();
			
	    	initPagination(); //重新分页
	    	sort_pagination($('#'+$('#current_order_by').text()),false);
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
	  var title='选中的内容'; 
	  var ids_select;
	  
	  if($('.table_li_check:checked').length) 
		 return title;
	  else 		  
		 return title=$('#'+obj.id).children().filter('.by_cn_title').text();
}