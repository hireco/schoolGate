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
var myTimer;
var initial_image='';

$(document).ready(function(){
	
	myinitPagination(); //初始化分页
	
	$('.by_filename').live('mouseover',function(){
		$('.by_filename').removeAttr('style');
		$(this).css({'text-decoration':'underline','color':'blue'});
	});
	
	$('.by_filename').live('mouseout',function(){
		$('.by_filename').removeAttr('style');
	});
	
	//右键菜单生成
	$('.file .by_filename').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
		   'edit':  function(t) {
			   myedit(t);   
		   },
		   'delete': function(t) {
			   mydelete(t);
		   }
	      },
	      onShowMenu: function(e, menu) {
	        if ($('#file_type').val()=='image') 
		      $('#edit', menu).remove();		      
		    return menu;
		  },					  	      
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });
	
	$('.list_files').live('click',function(){
		$('#file_type').val($(this).attr('id').replace('_list',''));
		$('#sub_dir').val('');
		refresh_files_list();
	});
	
	$('.by_filename').live('click',function(){
		if($(this).parent().hasClass('file')) return false;
		$('#sub_dir').val($(this).html());
		refresh_files_list();
	});
	
	//数据排序
	$('[id^="sort_by"]').live('click',function(){
		sort_pagination($(this),true);
	});
	
	//删除内容--------------------------------------------------//
	$("#delete_file").live('click',function(){
		
		$.ajax({
			type: 'post',
			data: 'ajax=1&'+$('#file_be_selected').val(),
			url : get_url(json_str.admin_base+"skin_admin/delete_file/"),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.result)  {
					   $('span#'+data.id).parent().remove();
					   myinitPagination();
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
	
	$('.skin_select').click(function(){
		$.get(get_url(json_str.admin_base+'skin_admin/select_skin'),function(data){
			$(".edit").html(data);
            $('.list').slideUp();
            $('.edit').slideDown();
		});
	});
	
	$("#skin_cancel,#file_cancel,#upload_return").live('click',function(){
		$('.edit').slideUp();
		$('.list').slideDown();
	}); //取消当前的添加或者编辑动作
	
	$("#skin_submit").live('click',function(){
	    var data;
	    
	    if(!$('#skin_id').val()) {
	    	top_message('请选择您的风格');
	    	return false;
	    }
	    
		data='skin_submit=yes&skin_id='+$('#skin_id').val();
		
		$.ajax({
			 type: 'post',
			 data: data,
			 url:  get_url(json_str.admin_base+'skin_admin/select_skin/1'),
		     success: function(data,textStatus){
				   try{
					     data = eval('(' + data + ')');
						 ajax_success(data,textStatus,'','json');
					  }
				   catch(err){
					    ajax_success('',textStatus,'','string');
					}
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		 });  
	});//提交风格选择
	
	//提交添加文档
	$('#file_submit').live('click',function(){
         var data=[],url,flag=1,value;
         
         if($('#existing').val()=='1' && !$('#overwrite').attr('checked')) {
        	 top_message('同名文件存在，请选择覆盖或者修改文件名！');
        	 return false;
         }
         
         $('#file_edit :input').not(':checkbox').each(function(){
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message('表单尚未填写完整'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
			 value = $(this).attr('name')=='file_content'?beforeEscape($.trim($(this).val())):$.trim($(this).val());
			 data.push($(this).attr('name')+'='+escape(value));
         });
         
         if(!flag) return false;
         
         $('#file_edit :checkbox:checked').each(function() {
         	 data.push(this.name + '=yes');
         });
         
         data=data.join('&');
         
         data=data+'&subdir='+$('#sub_dir').val();
        
         if($('#filename_old').val()) url=get_url(json_str.admin_base+'skin_admin/edit_file/1');
         else url=get_url(json_str.admin_base+'skin_admin/add_file/1');
         
         $.ajax({
            type: 'post',
            url : url,
            data: data,
            success : function(data,textStatus){   	       	     
       	        try{ 
                   data=eval('(' + data + ')'); 
                   if(data.result=='1') {
                	   ajax_success(data,textStatus,'current','json');
                	   refresh_files_list();                	                   	   
                   }
                   else  ajax_success(data,textStatus,'current','json');
                } 
   			    catch(err){
   			    	
   			    	ajax_success('操作失败，请重试！',textStatus,'','string');
                }
   	       },
   	       error  : function(XMLHttpRequest, textStatus, errorThrown){
   	   	        ajax_failed(textStatus);
   	   	   }         
         }); 
	});
	
	$('.horizon_items').click(function(){
		 $('.horizon_items').parent().removeClass('selected');
         $(this).parent().addClass('selected'); 
	});
	
	$('.file_add').live('click',function(){
		
		var path=$('#file_path').val();
		var type=$('#file_type').val();
		
		$.ajax({
			type :  'post',
			url  :  get_url(json_str.admin_base+'skin_admin/add_file/0'),
			data :  'path='+path+'&type='+type,
			success: function(data,textStatus){
				data = eval('(' + data + ')');
				if(data.result=='1') $('.list').slideUp('fast',function(){
					$('.edit').slideDown('fast',function(){
						$(this).html(data.infor);
					});
				});
				else ajax_success(data.infor,textStatus,'','string');
         	 },
         	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
		});		
	});	
	
	$('#upload_linker').live('click',function(){
		$('#just_uploaded').parent().hide();
		
		$.post(get_url(json_str.base_url+'ajax/swfupload/admin_upload'),function(data){
    		$("body").append(data);
			block_all();
			$("#upload_pannel").draggable({ cursor: 'move' });
    	});
	});
	
	$('#FileName').live('keyup',function(){
		if($(this).val()) $('#upload_linker').attr('disabled',false);
		else $('#upload_linker').attr('disabled',true);
	});
	
	$('#upload_close').live('click',function(){
	   	 myTimer=setInterval(detect2show_images, 100);
	});
	    
	function detect2show_images() {
	  var image=$('#targetFileName').val();        
	  if(image!=initial_image) {
	   	 initial_image=image; 
	   	 $('#just_uploaded').parent().show(function(){
	   		$('#just_uploaded').html('<img class="img_just_uploaded"  src="'+json_str.base_url+initial_image+'"  />');
	    }); 
	        clearInterval(myTimer);
	   }
   }
	
   $('#filename').live('change',function(){
	  var filename=$(this).val();
	  var path=$('#to_path').val();
	  $.post(get_url(json_str.admin_base+'skin_admin/check_if_existing'),{filename :filename, path :path},function(data){
  		  if(data) {
  			  top_message('同名文件已经存在，请选择是否覆盖');
  			  $('#existing').val('1');
  			  $('#overwrite').parent().show();
  		  }else {
			  $('#existing').val('0');
			  $('#overwrite').parent().hide();
  		  }
  	  });
	  
   });
   
   $('#FileName').live('change',function(){
		  var filename=$(this).val();
		  var cur_file,ext;
		  $('.file_dir.file .by_filename').each(function(){
			 cur_file=$(this).text();
			 ext=cur_file.split('.').pop();
			 cur_file=cur_file.replace('.'+ext,'');
			 if(cur_file==filename) {
				 top_message('注意：后缀为'+ext+'的同名文件存在，上传相同格式将覆盖之！');
				 return false;
			 }
		  });
   });
   
});

function mypageselectCallback(page_index, jq){
	var items_per_page=$('#pagination_num').text()?parseInt($('#pagination_num').text()):8;
	$('.skin_list .file_dir').filter('[id^="skin_no"]').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.skin_list .file_dir').filter('[id^="skin_no"]').not('.page_exception_items').eq(i).show();
    }
    return false;
}

function myinitPagination() {
	var num_entries = $('.skin_list .file_dir').filter('[id^="skin_no"]').not('.page_exception_items').length; 
	addcss2head('js/pagination/pagination.css');
	$("#pagination").pagination(num_entries, {
		load_first_page:true,
        callback: mypageselectCallback,
        items_per_page: $('#pagination_num').text()?parseInt($('#pagination_num').text()):8,
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
	
	$(".skin_list_body").jSort({
        sort_by: 'span.'+cur_id,
        item: 'div',
        order: current_order,
        is_num: is_num
    });
	
	myinitPagination();
}

function refresh_files_list() {
	
	$.ajax({
		 type: 'post',
		 data: 'filetype='+$('#file_type').val()+'&subdir='+$('#sub_dir').val(),
		 url:  get_url(json_str.admin_base+'skin_admin/clist/ajax'),
	     success: function(data,textStatus){
			 if(data){
				$("#clist_data").html(data);
				$('.edit').slideUp();
        		$('.list').slideDown();
	            myinitPagination();
			  }
			 else ajax_success('',textStatus,'','string');
		 },
		 error:function(textStatus) {
			 ajax_failed(textStatus);
		 }
	 });
}

function get_file_selected(obj) {
	  var path=$('#file_path').val();
	  var file=$('#'+obj.id).html(); 
	  var subdir=$('#sub_dir').val();
	  return {"path" : path,"file" : file ,"id" : obj.id, "subdir" : subdir};
}

function get_title(obj) {
	  return $('#'+obj.id).text();
}

//右键菜单函数

function myedit(obj) {
	
	var path=$('#file_path').val();
	var file=$('#'+obj.id+'').html();
	var subdir=$('#sub_dir').val();
	
	$.ajax({
		type :  'post',
		url  :  get_url(json_str.admin_base+'skin_admin/edit_file/0'),
		data :  'path='+path+'&file='+file+'&subdir='+subdir,
		success: function(data,textStatus){
			data = eval('(' + data + ')');
			if(data.result=='1') 
			    $('.list').slideUp('fast',function(){
					$('.edit').slideDown('fast',function(){
						$(this).html(data.infor);
					});
			   });
			else ajax_success(data.infor,textStatus,'','string');
     	 },
     	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
	});
}

function mydelete(obj) {
	  var title=get_title(obj);
	  var file_selected=get_file_selected(obj);
	  
	  var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除文件 ", 
	         "object"      : title,
	         "main_infor"  : "此举将删除该文件，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_file"
	        };
	  var browser='not_ie6';
	  $('#file_be_selected').val($.param(file_selected)); //saved for delete action to use    	
	  data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	  show_dialog(data,browser);
}