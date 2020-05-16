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
$(document).ready(function(){
	initPagination(); //初始化分页
	
	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'view': function(t) {
			   var cur_id=t.id;
			   cur_id=cur_id.split('_');
			   $.get(get_url(json_str.admin_base+"navi_admin/clist/"+cur_id[0]),function(data){
			       $('#clist_data').html(data);				   
			       initial_navi(); 
		       });
			},
			'delete': function(t) {
			   delete_navi(t);
			}
		   },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	

	//导航操作菜单
	$('.navi_admin:not(.navi_is_default)').live("mouseover",function(){
       
	   $('.navi_admin li span:not(.mainarea)').contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				myedit(t); },             
			'delete': function(t) {
				mydelete(t);},	        
	        'goup': function(t) {
	            myupdown(t,'up');},		    
		    'godown': function(t) {	        	
		        myupdown(t,'down');}    
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	
    
	//导航收放效果
	$('.navi_admin .with_sub span').live('click',function(){
		if($(this).next().hasClass('submenu')) {
			$(this).toggleClass('expanded closed');
		    $(this).next().toggle();  
		}
	});

	//添加导航条
	$('#new_navi').live('click',function(){		
		$.get(get_url(json_str.admin_base+"navi_admin/new_navi"),function(data){
			   $('.edit').html(data).slideDown();
			   $('#clist_data').html('').slideUp();	
		});
	});

	//清除导航条的菜单项
	$('#delete_navi_items').live('click',function(){
		
		var id=$('#navi_type').val(); 		
	    var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除导航的所有菜单", 
	         "object"      :  id,
	         "main_infor"  : "此举将删除该菜单项，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "clear_navi_items"
	        };
	    
		var browser='not_ie6';
	    $('#id_to_delete').val(id); //saved for delete action to use    	
	    data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	    show_dialog(data,browser); 

	});

	//添加导航菜单项
	$('#add_navi').live('click',function(){		
		$.get(get_url(json_str.admin_base+"navi_admin/add/0/"+$('#navi_type').val()),function(data){ 		   
		   
		   show_edit_panel(data);
		   
		   $.get(get_url(json_str.admin_base+"navi_admin/max_priority_num"),function(data){
		   		data=parseInt(data)+1;
				$('#navi_priority').val(data);
		   });

		});
	});

	//单个编辑时，检查导航名称
	$('#navi_title').live('change',function(){
		
		var obj=$(this);
		var str=obj.val();

	    $.post(get_url(json_str.admin_base+"navi_admin/js_check_title/navi_title"),{navi_id: $('#navi_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名菜单已经存在，若要坚持使用，请不要采用默认拼音作为其英文ID！','','warn'); 
			   return false;
		   }

		   $.post(get_url(json_str.base_url+'ajax/cms_ajax/get_pinyin_name'),{cn_name : str},function(data){

			  str=data;

			  $.post(get_url(json_str.admin_base+"navi_admin/js_check_title/navi_title_en"),{title: str, navi_id : $('#navi_id').val()},function(data){
		        if(data=='error') {
			       top_message('英文链接有重复，请修改！');			      
			       return false;
		         } 
			     $('#navi_title_en').val(str);
	          }); 
		   });
	    }); 	
	});
    
	//单个编辑时，检查ID
	$('#navi_title_en').live('change',function(){
		var obj=$(this);
	    $.post(get_url(json_str.admin_base+"navi_admin/js_check_title/navi_title_en"),{navi_id: $('#navi_id').val(),title : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名菜单已经存在！'); 
			   if(obj.attr('id')=='navi_title_en') obj.val('');
		   }
	    }); 	
	});

	//添加新导航条时，检查ID
	$('#navi_type').live('change',function(){
		var obj=$(this);
		if(obj.val().indexOf('_') >=0 ) { 
			top_message('不能含有下划线！');
			obj.val(''); 
			return false;
		}
	    $.post(get_url(json_str.admin_base+"navi_admin/js_check_type"),{navi_type : $.trim(obj.val())},function(data){
		   if(data=='error') {
			   top_message('同名导航已存在！'); 
			   obj.val('');
		   }
	    }); 	
	});

	//编辑提交新导航条
	$("#new_navi_submit").live('click',function(){
		 
		 if(!$('#navi_type').val() || !$('#navi_name').val()) {
			 top_message('请填写表单后再提交！');
			 return false
		 }
		 $.ajax({
        	 type: 'post',
             url:   get_url(json_str.admin_base+"navi_admin/new_navi/1"),
		     cache: false,
             data:  'navi_type='+$('#navi_type').val()+'&navi_name='+$('#navi_name').val()+'&new_navi_submit='+$('#new_navi_submit').val(),
             success : function(data,textStatus){ 
				 try{ 
					data=eval('(' + data + ')'); 					 
					ajax_success(data,textStatus,data.url,'json');					
                 }
				 catch(err){
	                ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
			 },
			 error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
         });
	});


	//多重编辑导航开始
	//------------------------------------------------------------------------------------------------------------
	//生成表单
	$('#edit_navi').live('click',function(){
	   
	   $(this).hide();

	   $('#multiple_navi_submit,#multiple_navi_cancel').show();

	   $('.navi_admin span').removeClass('has_sub expanded closed');
	   $('.navi_admin span').next().show();

	   $('.navi_admin a').each(function(i){	
		  var j=i+1; 
		  var navi_title_en=$('#navi_type').val()+'-'+$(this).closest('li').attr('id').replace('navi_','');
		  var html='<div class="my_form_item navi_items">';
		  html+='<span class="mainarea">名称：<input type="text" class="enterbox shortarea filled navi_title" value="'+$(this).text()+'" /></span>';
		  html+='<span class="mainarea">英文ID：<input type="text" class="enterbox shortarea filled navi_title_en" value="'+navi_title_en+'" /></span>';
		  html+='<span class="mainarea">地址：<input type="text" class="enterbox filled navi_url" value="'+$(this).attr('href')+'" /></span>';
		  html+='<span class="mainarea">优先级：<input type="text" class="enterbox numarea filled navi_priority" value="'+j+'" /></span>';
		  html+='<span class="mainarea">新开窗口：<input type="checkbox" class="navi_target" value="'+$(this).next().text()+'" /></span>'; 		 
		  html+='<span class="mainarea"><span class="delete_item" title="删除此条"></span></span>';			  
		  html+='</div>';
		  
		  $(this).parent().after(html);
		  $(this).parent().remove();

	   });

	   //设置新开窗口选择值
	   $('.navi_target').each(function(){
	      $(this).attr('checked',$(this).val()=='s'?false:true);
	   });
	
	});

	//检查重复
	$('.navi_title_en').live('change',function(){
		var obj=$(this);
		var index=obj.closest('.allmenu').attr('index');

		$('.navi_title_en').each(function(){
		   var cur_index= $(this).closest('.allmenu').attr('index');		   
		   if($(this).val()==obj.val() && index!=cur_index) {
		      top_message('导航英文ID有重复！');
			  obj.val('');
			  return false;
		   } 
		}) 
	});

	//检查重复
	$('.navi_title').live('change',function(){
		var obj=$(this);
		var index=obj.closest('.allmenu').attr('index');

		$('.navi_title').each(function(){
		   var cur_index= $(this).closest('.allmenu').attr('index');
		   if($(this).val()==obj.val() && index!=cur_index) {
		      top_message('导航名称有重复！');
			  obj.val('');
			  return false;
		   } 
		}) 
	});

	//删除条目
	$('.delete_item').live('click',function(){
		if($(this).closest('li').find('.submenu li').length) top_message('该条目下有子条目，不能删除！');
		else $(this).closest('li').remove();

		$('.navi_admin li').each(function(i){			
		    $(this).attr('index',i+1);
		});
	});

	//取消操作
	$('#multiple_navi_cancel,#single_navi_cancel').live('click',refresh_navi_items);
	
	//取消添加导航条
	$('#new_navi_cancel').live('click',refresh_navi_list);


	//点击checkbox时，设置新开窗口值
	$('.navi_target').live('click',function(){
	    $(this).val($(this).val()=='s'?'b':'s');
	});
	
	//多重编辑的提交
	$('#multiple_navi_submit').live('click',function(){
	     setTimeout(multiple_navi_submit, 250); 
	     event.preventDefault();
	});

	//多重编辑导航结束
	//------------------------------------------------------------------------------------------------------------

	//单个编辑时，辅助选择URL开始
	//------------------------------------------------------------------------------------------------------------
	$('#obj_type').live('change',function(){
		
		var cur_val=parseInt($(this).val());
		var ajaxurl='';
		var obj=$(this);
		
		

		switch(cur_val) {
             case 0:
			    $('#navi_url').attr('disabled',false);
			    break;
			 case 1:
				ajaxurl = json_str.admin_base+"navi_admin/get_cms_classes";
			    break;
			 case 2:
				ajaxurl = json_str.admin_base+"navi_admin/get_cms_list";
			    break;
			 case 3:
				ajaxurl = json_str.admin_base+"navi_admin/get_people_titles" 
			    break;
			 case 4:
				ajaxurl = json_str.admin_base+"navi_admin/get_people_list";
			    break;
             case 5:
				ajaxurl = json_str.admin_base+"navi_admin/get_html_groups";
			    break;
			 case 6:
				ajaxurl = json_str.admin_base+"navi_admin/get_html_list";
			    break;
             default: ;
		}

		if(ajaxurl) 
		
			$.get(get_url(ajaxurl),function(data){
				
				var html=data?data:'<div class="null">暂无对象可选！</div>';	 

				html= '<div class="select_div">'+html+'</div><div id="special_pagination"></div>';
				html+='<input id="ajaxurl" type="hidden" value="'+ajaxurl+'" />';
				simple_viewer(obj.offset().left+100,obj.offset().top+10,html,'320px','260px');
				$('.menu_title').text(obj.children().filter(':selected').text()+'列表');
				$('#simple_viewer').addClass('no_dispear_auto');

				special_pagination();
			});

		else  $('#simple_viewer').remove();

	});

	$('.select_div p.has_sub label').live('click',function(){
	    
		var cur_class=$(this).attr('class');
		var cur_id=$(this).prev().val();
		var ajaxurl='';
		var obj=$(this);

		switch(cur_class) {
			 case 'cms_class_linker':
				ajaxurl = json_str.admin_base+"navi_admin/get_cms_list/"+cur_id;
			    break;
			 case 'people_title_linker':
				ajaxurl = json_str.admin_base+"navi_admin/get_people_list/"+cur_id;
			    break;
			 case 'html_class_linker':
				ajaxurl = json_str.admin_base+"navi_admin/get_html_list/"+cur_id;
			    break;
			 default: ;
		}

		if(ajaxurl)

		$.get(get_url(ajaxurl),function(data){
			
			var html=data?data:'<div class="null">暂无对象可选！</div>';	 

		    $('.select_div').html(html);
			$('.select_div').after('<div class="uppper_level">返回上级</div>');

			special_pagination();
	    });
	});

	$('.uppper_level').live('click',function(){
	      
		  $(this).remove();

		  var ajaxurl=$('#ajaxurl').val();
		  
		  if(ajaxurl) 

		  $.get(get_url(ajaxurl),function(data){
			
			var html=data?data:'<div class="null">暂无对象可选！</div>';	 

			$('.select_div').html(html);

			special_pagination();
	      });
	
	});

	$('.obj_id').live('click',function(){
	      
		  $('#navi_url').attr('disabled',true);
		  
		  $('.obj_id').attr('checked',false);
		  $(this).attr('checked','checked');
		  
		  $('#navi_url').val($(this).prev().val());
	});
	
	//单个编辑时，辅助选择URL结束
	//------------------------------------------------------------------------------------------------------------

    //上级菜单选择
	$('#select_parent').live('click',function(){
		var obj=$(this);
		$.get(get_url(json_str.admin_base+"navi_admin/navi_cascade/"+$('#navi_id').val()),function(data){
				
				var html=data?data:'<div class="null">暂无对象可选！</div>';	 

				html= '<div id="cascade_div" class="select_div">'+html+'</div>';
				simple_viewer(obj.offset().left+100,obj.offset().top+10,html);
				$('.menu_title').text('菜单列表');
				$('.select_div .allmenu span').each(function(){
					var cur_id=$(this).attr('id').replace('span_','');
					var cur_title=$(this).children().filter('a').text();
					$(this).after('<p><input type="checkbox" class="select_navi_id" value="'+cur_id+'" /><label>'+cur_title+'</label></p>');
				});

				$('.select_div .allmenu span').remove();
				
				$('#simple_viewer').addClass('no_dispear_auto');
		});
	});

	$('#cancel_parent').live('click',function(){
		$('#parent_id').val('');
		$(this).attr('disabled',true);
	});

	$('.select_navi_id').live('click',function(){
	     $('.select_navi_id').attr('checked',false);
		 $(this).attr('checked','checked');
		 $('#parent_id').val($(this).val());
		 $('#cancel_parent').attr('disabled',false);
	});



	//编辑提交
	$("#single_navi_submit").live('click',function(){
		 var add_or_edit,url,navi_id,data,flag=1;
		 var inputs = [];
		 $('#navi_form :input:visible').not(':radio').each(function() {
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message('表单尚未填写完整'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
        	 if(this.name) inputs.push(this.name + '=' + escape(this.value));
         });
         
         add_or_edit=$("#add_or_edit").val();
         navi_id=$("#navi_id").val();
         add_or_edit=add_or_edit=='edit'?'edit':'add';         
         url=add_or_edit=='add'?json_str.admin_base+"navi_admin/add/1/"+$('#navi_type').val():json_str.admin_base+"navi_admin/edit/"+navi_id+"/1";

         if(!flag) return false;

		 inputs.push('navi_target='+$('[name="navi_target"]:checked').val());

         data=inputs.join('&');

		 data=data+'&navi_submit=1'

		 $.ajax({
        	 type: 'post',
             url:   get_url(url),
		     cache: false,
             data:  data,
             success : function(data,textStatus){ 
				 try{ 
					data=eval('(' + data + ')'); 					 
					ajax_success(data,textStatus,data.url,'json');					
                 }
				 catch(err){
	                ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
			 },
			 error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
         });
	});

	//删除单个菜单
	$("#delete_navi_item").live('click',function(){		
		$.ajax({
			type: 'post',
			data: 'ajax=1&id='+$('#id_to_delete').val(),
			url : get_url(json_str.admin_base+"navi_admin/delete_navi_item/"),
			success : function(data,textStatus){
				try{ 
					data=eval('(' + data + ')');
					if(data.id)  refresh_navi_items();
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

	$.get(get_url(json_str.admin_base+"navi_admin/clear_navi_items/"+$('#navi_type').val()),function(data){
		    
		});

	 //删除导航的菜单项
	$('#clear_navi_items').live('click',function(){		
		
		$.ajax({
			type: 'post',
			data: 'ajax=1',
			url : get_url(json_str.admin_base+"navi_admin/clear_navi_items/"+$('#id_to_delete').val()),
			success : function(data,textStatus){
				try{ 
					data=eval('(' + data + ')');
					if(data.result=='1')  refresh_navi_list();
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

	//删除整个导航
	$('#delete_navi').live('click',function(){		
		$.ajax({
			type: 'post',
			data: 'ajax=2&navi_type='+$('#id_to_delete').val(),
			url : get_url(json_str.admin_base+"navi_admin/clear_navi"),
			success : function(data,textStatus){
				try{ 
					data=eval('(' + data + ')');
					if(data.result=='1')  refresh_navi_list();
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

//多重提交检验
function multiple_navi_submit() {
    
	var data,flag=1;
 	var inputs = [];
	var parent_id;

	$('.navi_admin :input').not(':button,:checkbox').each(function() {
 			if($(this).val()=='' && $(this).hasClass('filled')) { 
 				top_message('表单尚未填写完整');
 		   		flag=0;  return false;
 			}
 	   });	
 	   	   		   
 	if(!flag) return false;

	$('.navi_admin .navi_items').each(function(i){
	   var j=i+1;
 	   inputs.push('navi_title_'+j+'=' + escape($('.navi_title').eq(i).val()));
 	   inputs.push('navi_title_en_'+j+'=' + escape($('.navi_title_en').eq(i).val()));
	   inputs.push('navi_url_'+j+'=' + escape($('.navi_url').eq(i).val()));
 	   inputs.push('navi_priority_'+j+'=' + $('.navi_priority').eq(i).val()); 
	   inputs.push('navi_target_'+j+'=' + $('.navi_target').eq(i).val());
	   
	   if($(this).closest('ul').hasClass('submenu'))  
		   parent_id=$(this).closest('ul').parent().attr('index');
	   else 
		   parent_id=0;

	   inputs.push('parent_id_'+j+'='+parent_id);
 	}); 

	data=inputs.join('&');

	data=data+'&navis='+$('.navi_admin .navi_items').length+'&navi_submit=1&navi_type='+$('#navi_type').val();

	$.ajax({
 			   type: 'post',
 		       url:   get_url(json_str.admin_base+"navi_admin/multiple_edit"),
 		       data:  data,
 		       success : function(data,textStatus){     	     
 		     	     try{ 
 		                 var data=eval('(' + data + ')');
 		                 ajax_success(data,textStatus,'','json'); 
						 if(data.result=='1')  refresh_navi_items();
 		              } 
 		 			 catch(err){
 		 				 ajax_success('系统错误，稍后重试！',textStatus,'','string');
 		              }
 		 	   },
 		 	   error   : function(XMLHttpRequest, textStatus, errorThrown){ 
 		 		         ajax_failed(textStatus);
 		 		      }
 	  });

}

function refresh_navi_list() {
      $.get(get_url(json_str.admin_base+"navi_admin/tlist/ajax"),function(data){
			$('.edit').html('').slideUp();
			$('#clist_data').html(data).slideDown();  
			initPagination();
	  });  
}

function refresh_navi_items() {
	    $.get(get_url(json_str.admin_base+"navi_admin/clist/"+$('#navi_type').val()),function(data){
			   $('.edit').html('').slideUp();
			   $('#clist_data').html(data).slideDown();				   
			   initial_navi(); 
		});       
}

function  initial_navi() {
      $('.submenu_list .submenu').each(function(){
	     var cur_id=$(this).attr('id');
	     cur_id=cur_id.replace('_list','');
	    $(this).appendTo($('#'+cur_id));
	  });

	  $('.submenu_list').remove();

	  $('.navi_admin a').attr('target','_blank');

	  $('.navi_admin .allmenu span').each(function(i){			
		$(this).parent().attr('index',i+1);
		if($(this).next().hasClass('submenu')) { 
			$(this).addClass('has_sub closed');
			$(this).next().hide(); 
		}
	  });

	  if($('.navi_admin').hasClass('navi_is_default')) $('#delete_navi_items').hide();
}

function special_pagecallback(page_index, jq){
	var items_per_page=8;
	$('.select_div p').hide();
	for(var i=page_index*items_per_page;i<page_index*items_per_page+items_per_page;i++)
    {
		$('.select_div p').eq(i).show();
    }
    return false;
}

function special_pagination() {
	var num_entries = $('.select_div p').length; 

	addcss2head('js/pagination/pagination.css');
	$("#special_pagination").pagination(num_entries, {
		load_first_page:true,
        callback: special_pagecallback,
        items_per_page: 8,
		num_display_entries: 5,
        next_text: '下一页',
        prev_text: '上一页',
        link_to:   'javascript:void(0)'
    });
}

function myedit(obj) {
		 var id=obj.id.split('_');
         $.ajax({
         	   type: 'post',
         	   url:  get_url(json_str.admin_base+"navi_admin/edit/"+id[1]),
         	   success : function(data,textStatus){
					 try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,'','json');
					  }
					 catch(err){
					 	 if(data) show_edit_panel(data);
						 else ajax_success('',textStatus,'','string');
					  }
         	  },
         	  error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
        });	
 }


 //删除单个菜单项
 function mydelete(obj) {
	    
		
		if($('#'+obj.id).next().is('.submenu')) {
			top_message('该条目下有子条目，不能删除！');
			return false;
		}

		var title=get_title(obj);
	    var ids_to_delete=get_id_list(obj);
		
		var id=obj.id.split('_'); 		
	    var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除菜单", 
	         "object"      : title,
	         "main_infor"  : "此举将删除该菜单项，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_navi_item"
	        };
	    var browser='not_ie6';
	    $('#id_to_delete').val(ids_to_delete); //saved for delete action to use    	
	    data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	    show_dialog(data,browser); 
 }

 //删除整个导航条
 function delete_navi(obj) {
     	var id=obj.id.split('_'); 		
	    var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除导航", 
	         "object"      :  id[0],
	         "main_infor"  : "此举将删除该菜单项，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_navi"
	        };
	    var browser='not_ie6';
	    $('#id_to_delete').val(id[0]); //saved for delete action to use    	
	    data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	    show_dialog(data,browser);  
 }

 function myupdown(obj, updown) {
	    
		var id=get_id_list(obj);

        $.ajax({
        	  type: 'post',
			  data: 'id='+id,
         	  url:  get_url(json_str.admin_base+"navi_admin/updown/"+updown),
         	  success : function(data,textStatus){
			            try{ 
	                         data=eval('(' + data + ')');
						     if(data.result=='1')  refresh_navi_items();
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
	  ids_select=obj.id.split('_'); 
	  return ids_select=ids_select[1];
}

function get_title(obj) {
	  return $('#'+obj.id).children().filter('a').text();
}

function show_edit_panel(data) {
	  $('#clist_data').html('').slideUp();
	  $('.edit').html(data).slideDown(); 
}