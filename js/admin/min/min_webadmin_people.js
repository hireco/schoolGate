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
$(document).ready(function() {

	initPagination(); // 初始化分页
    
	$('#add_details').live('click',add_detail_form);
	
	$('.delete_item').live('click',function(){
		$(this).closest('.my_form_item').remove();
		
		$('.index_no').each(function(i){
			var cur_no=i+1;
			$(this).text('项目'+cur_no);
		});
	});
	
	$('[id$="_table"]').live("mouseover", function() {
		$(this).contextMenu('mycontext_menu', {
			bindings : {
				'edit' : function(t) {
					myedit(t);
				},
				'delete' : function(t) {
					mydelete(t);
				},
				'locked' : function(t) {
					mylock(t,'1');
				},
				'no_locked' : function(t) {
					mylock(t,'0');
				},
				'hide' : function(t) {
					myhide(t,'1');
				},
				'no_hide' : function(t) {
					myhide(t,'0');
				}
			},
			onShowMenu: function(e, menu) {
		          if ($(e.target).parent().hasClass('locked')) $('#locked', menu).remove();
		          else $('#no_locked', menu).remove();
		          
		          if ($(e.target).parent().hasClass('hidden')) $('#hide', menu).remove();
		          else $('#no_hide', menu).remove();
		          
		          return menu;
		    },
			itemStyle : {
				border : '1px dashed #cccccc',
				margin : '2px'
			}
		});
	}); // 动态绑定Jquery插件的例子
	
	$('.add_people').live('click', function() {
		$.ajax({
			type : 'post',
			url : get_url(json_str.admin_base + 'people/add'),
			success : function(data, textStatus) {
				if (data) {
					$(".edit").html(data);
					$('.list').slideUp();
					$('.edit').slideDown();
				} else
					ajax_success('', textStatus, '', 'string');
			}
		});
	});
    
	$("#upload_avatar").live('click',function(){
	    var size=$("#people_avatar_size").html();
	    size=size.split(':');
	    var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'avatar',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html(),
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});
	
	$('#personal_site').live('change',function(){
		if(!url_check($(this).val())) {
			top_message('请输入包含http://的完整网址!');
			$(this).val('');
		}
	});
	
	$('#email').live('change',function(){
		if(!email_check($(this).val())) {
			top_message('请输入正确的电子邮件地址!');
			$(this).val('');
		}
	});
	
	$('#user_name').live('change',function(){
		if($(this).val()) $.post(get_url(json_str.admin_base+'people/check_username'),{user_name : $('#user_name').val()},function(data){
			 if(data=='0') { 
				 $('#user_name').val('');
				 top_message('该用户不存在！');
			 }
		});
	});

	$('#cn_name').live('change',function(){
		var obj=$(this);
		var str=obj.val();
		
		if(!chinese_check(str)) {
			top_message('请输入中文姓名!');
			$(this).val('');
		}

		if(str) $.post(get_url(json_str.base_url+'ajax/people_ajax/get_pinyin_name'),{cn_name : str},function(data){
			
			str=data.replace(/\s/g,'');
			
			$('#en_name').val(data);
			
			$.post(get_url(json_str.admin_base+"people/check_en_id"),{en_id: str, people_id : $('#people_id').val()},function(data){
		       if(data=='error') {
			      top_message('英文名有重复，请修改！'); 
			      $('#en_name').val('');
			      return false;
		       } 
			   $('#en_id').val(str);
	        }); 
		});


	});
	
	$('#en_name').live('change',function(){
		var obj=$(this);
		var str=obj.val();
		str=str.replace(/\s/g,'');

		if(!seo_url_check(str)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"people/check_en_id"),{en_id: str, people_id : $('#people_id').val()},function(data){
		   if(data=='error') {
			   top_message('英文名有重复，请修改！'); 
			   obj.val('');
			   return false;
		   } 
		   $('#en_id').val(str);
	     }); 
			
	});

	$('#title_id').live('change',function(){
	  	 if($(this).val()=='')  {
			 top_message('请修改具体的头衔类别！');
		     return false;
		 }
	});

	$('#html_dir').live('change',function(){
		
		$.post(get_url(json_str.base_url+'ajax/people_ajax/chk_html_dir'),{html_dir: $('#html_dir').val()},function(data){
			data = eval('(' + data + ')');
			if(data.result=='0') { 
				top_message(data.infor);
				$('#html_dir').val('');
			}
			else $('#personal_site').val(json_str.base_url+'public_html/'+$('#html_dir').val());
		});
		
	});
	
	$("#people_submit").live('click', function() {
		var inputs = [],details=[];
		var data, flag = 1;

		$('#people_form :input').not(':radio,:checkbox').each(function() {
			if ($(this).val() == '' && $(this).hasClass('filled')) {
				top_message('表单尚未填写完整');
				flag = 0;
				return false;
			}
			if(!$(this).hasClass('detail_item') && !$(this).hasClass('detail_cont')) inputs.push(this.name + '=' + escape(this.value));
		});
		
		if (!flag)	return false;

		data = inputs.join('&');
        
		if($('#title_id').val()=='') {
		     top_message('请选择人员的头衔类型');
			 return false;
		} 

		data=data+'&gender='+$('[name="gender"]:checked').val()+'&hide_phone='+($('[name="hide_phone"]:checked').length?'1':'0')+'&hide_email='+($('[name="hide_email"]:checked').length?'1':'0')+'&hide_born_year='+($('[name="hide_born_year"]:checked').length?'1':'0');

		if($('.div_span').length) {
			$('.detail_item').each(function(i){
				details.push(escape($(this).val()+'-bbb-'+$('.detail_cont').eq(i).val()));
			});
			data=data+'&details='+details.join('-ddd-');
		}

		$.ajax({
			type : 'post',
			data : data,
			url : get_url(json_str.admin_base + 'people/submit'),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
					delete_images_sql();
					ajax_success(data, textStatus, data.url, 'json');
				} catch (err) {
					ajax_success('', textStatus, '', 'string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				ajax_failed(textStatus);
			}
		});
	});

	$("#people_cancel").live('click', function() {
		delete_images_cancel();
		$('.edit').slideUp();
		$('.list').slideDown();
	});

	// 删除条目--------------------------------------------------//
	$("#delete_people").live('click', function() {

		$.ajax({
			type : 'post',
			data : 'ajax=1&id=' + $('#id_be_selected').val(),
			url : get_url(json_str.admin_base + "people/delete_people/"),
			success : function(data, textStatus) {
				try {
					data = eval('(' + data + ')');
					if (data.id) {
						$.each(data.id.split(','), function(i, n) {
							$('#' + n + '_table').remove();
						});
						initPagination();
					}
					ajax_success(data, textStatus, '', 'json');
				} catch (err) {
					ajax_success('操作失败，请重试！', textStatus, '', 'string');
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				ajax_failed(textStatus);
			},
			complete : function() {
				$("#user_dialog").remove();
				unblock_all();
			}
		});
	});

});

function add_detail_form() {
	 var num=$('.div_span').length+1;
	 var index=num-1;
	 var position;
	 if(index) $('.div_span').closest('.my_form_item').last().after('<div class="my_form_item"><label class="labeltag"> </label><span class="mainarea div_span"></span></div>');
	 else $('.details_div').html('<div class="my_form_item"><label class="labeltag"> </label><span class="mainarea div_span"></span></div>');
	 $('.div_span').last().html('<span><label class="index_no">项目'+num+'</label><input type="text" class="enterbox shortarea filled detail_item" /></span>');
	 $('.div_span span').last().after('\n<span class="span_textarea"><textarea class="enterbox medium_enterarea filled detail_cont"></textarea></span><span class="delete_item" title="删除此条"></span>');
}

function myedit(obj) {
	var id = obj.id.split('_');
	$.ajax({
		type : 'post',
		url : get_url(json_str.admin_base + "people/edit/" + id[0]),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if(data.result=='1'){
					$(".edit").html(data.infor);
					$('.list').slideUp();
					$('.edit').slideDown();
					
					var cur_val=$('#pub_type').val();
					$('.shift_div').hide();
					$('.shift_div.for_'+cur_val).show();
					
					cur_val=$('#pub_condition').val();
					if(cur_val=='published') $('.published').show();
					else $('.published').hide();
				} 
				else ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function mydelete(obj) {
	var title = get_title(obj);
	var ids_to_delete = get_id_list(obj);

	var data = {
		"title" : "确认对话框",
		"action" : "删除人员信息",
		"object" : title,
		"main_infor" : "此举将删除此对象，确认吗？",
		"dialog_view" : "dialog_infor",
		"infor_type" : "warning",
		"submit" : "delete_people"
	};
	var browser = 'not_ie6';
	$('#id_be_selected').val(ids_to_delete); // saved for delete action to
												// use
	data = $.param(data); // data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	show_dialog(data, browser);
}

function mylock(obj,value) {
	var ids_selected = get_id_list(obj);
	
	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value='+value,
		url : get_url(json_str.admin_base + "people/locked"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '1') {
							$('.locked_' + ids[i]).html('<span style="color:green;">√</span>');
							$('.locked_' + ids[i]).parent().addClass('locked');
						}
						else {
							$('.locked_' + ids[i]).html('<span style="color:red;">×</span>');
							$('.locked_' + ids[i]).parent().removeClass('locked');
						}
					}
				}
				ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('操作失败，请重试！', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function myhide(obj,value) {
	var ids_selected = get_id_list(obj);
	
	$.ajax({
		type : 'post',
		data : 'ajax=1&id=' + ids_selected + '&value='+value,
		url : get_url(json_str.admin_base + "people/hide"),
		success : function(data, textStatus) {
			try {
				data = eval('(' + data + ')');
				if (data.result == '1') {
					ids = ids_selected.split(',');
					for ( var i = 0; i < ids.length; i++) {
						if (value == '1') {
							$('.hide_' + ids[i]).html('<span style="color:red;">×</span>');
							$('.hide_' + ids[i]).parent().addClass('hidden');
						}
						else {
							$('.hide_' + ids[i]).html('<span style="color:green;">√</span>');
							$('.hide_' + ids[i]).parent().removeClass('hidden');
						}
					}
				}
				ajax_success(data, textStatus, '', 'json');
			} catch (err) {
				ajax_success('操作失败，请重试！', textStatus, '', 'string');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			ajax_failed(textStatus);
		}
	});
}

function get_id_list(obj) {
	var ids_select;
	if ($('.table_li_check:checked').length) {
		ids_select = [];
		$('.table_li_check:checked').each(function(i) {
			var cur_id = $(this).attr('id');
			cur_id = cur_id.replace('select_', '');
			ids_select[i] = cur_id;
		});
		return ids_select = ids_select.join(',');
	} else {
		ids_select = obj.id.split('_');
		return ids_select = ids_select[0];
	}
}

function get_title(obj) {
	var title = '选中的人员';
	var ids_select;

	if ($('.table_li_check:checked').length)
		return title;
	else
		return title = $('#' + obj.id).children().filter('.by_title').text();
}

