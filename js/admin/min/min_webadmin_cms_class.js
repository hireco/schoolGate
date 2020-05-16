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
	
	$('.cms_num:not(.got)').live('mouseover',function(){
			var cur_id=$(this).closest('[id$="_table"]').attr('id').replace('_table','');
			$(this).load(get_url(json_str.admin_base+'cms_class/cms_num/'+cur_id));
			$(this).addClass('got');
	});

	$('[id$="_table"]').live("mouseover",function(){
         $(this).contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				var id=t.id.split('_');
				myedit(id[0]); 
			}, 
			'address': function(t) {		       
			   var obj=$('#'+t.id);
			   text_selected('拷贝地址',$('#'+t.id+' .by_address').text(),obj);
		     },
			'copy_id': function(t) {		       
			   var obj=$('#'+t.id);
			   text_selected('拷贝ID', $('#'+t.id+' .by_class').text(),obj);
		     },		 
			'delete': function(t) {
				mydelete(t.id);
			},	        
	        'goup': function(t) {
	            var id=t.id.split('_');
				myupdown(id[0],'up');
			},		    
		    'godown': function(t) {	        	
		        var id=t.id.split('_');
				myupdown(id[0],'down');
			},
		    'move_to': function(t) {
		    	move_to(t);
			}    
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	//动态绑定Jquery插件的例子	

	//分类操作菜单之二
	$('.class_cascade li span.class_item').live("mouseover",function(){
       
	   $('.class_cascade li span.class_item').contextMenu('mycontext_menu', { 
	      bindings: {			  
	        'edit': function(t) {
				var id=t.id.split('_');
				myedit(id[1]);  
			},             
			'delete': function(t) {
				mydelete(t.id);
			},	        
	        'goup': function(t) {
	            var id=t.id.split('_');
				myupdown(id[1],'up');
			},		    
		    'godown': function(t) {	        	
		        var id=t.id.split('_');
				myupdown(id[1],'down');
			}    
	      },
		  onShowMenu: function(e, menu) {
	         //if ($(e.target).attr('id')=='span_0') return false;
			 $('#copy_id, #move_to, #address', menu).remove();
	         return menu;
	      },
	      itemStyle: {	    	 
	          border: '1px dashed #cccccc',
	          margin: '2px'
	      }
	    });	
    });	

	//横向导航
	$("#new_class").live('click',function(){
	   $.get(get_url(json_str.admin_base+"cms_class/add"),function(data){
	        $(".edit").html(data).slideDown();
			$('#clist_data').html('').slideUp();
	   }); 	   	
	});
    
	$("#cascade").live('click',function(){
	    refresh_class_cascade();	   	
	});

    $('.class_cascade span.has_sub').live('click',function(){
		$(this).toggleClass('expanded closed');
		$('#'+$(this).parent().attr('id')+'_sub').toggle();	
	});
	
	$('.class_cascade .cont_list').live('click',function(){
		var obj=$(this);
		var cur_id=	$(this).parent().attr('id');
		cur_id=cur_id.split('_'); 
		
		$.get(get_url(json_str.admin_base+"cms_class/get_cms_list/"+cur_id[1]),function(data){
				
		  var html=data?data:'<div class="null">暂无内容！</div>';	 

		  html= '<div class="select_div">'+html+'</div><div id="special_pagination"></div>';
		  simple_viewer(obj.offset().left+100,obj.offset().top+10,html,'320px','260px');
		  $('.menu_title').text(obj.prev().text()+'内容列表');
		  $('#simple_viewer').addClass('no_dispear_auto');
		  
		  special_pagination();
		});

	});

	//选择文档模型开始----------------------------------------------------------
	$("[name='cms_model']").live('change',function(){
		
		var model_id=[];

		$("[name='cms_model']:checked").each(function(){
			model_id.push($(this).val());
		});

		$("#model_id").val(model_id.join(','));

	});	
	
	//选择文档模型结束----------------------------------------------------------
	
	//选择父类开始--------------------------------------------------------------
	$('#select_parent').live('click',function(){
		var class_name=$('#class_name').val();
		$.ajax({
			type: 'post',
			data: 'class_id=0&select_id='+$('#parent_id').val()+'&hide_id='+$("#class_id").val(),
			url : get_url(json_str.admin_base+'cms_class/show_children'),
			success:function(data,textStatus){
				$("#id_to_select").val($('#parent_id').val());
				$('#name_to_select').val($('#parent_name').val());
				var data ={
				      	 "title"      : "选择分类",
				         "action"     : "选择"+(class_name?class_name:"此类")+"的上级分类",
				         "dialog_view": "dialog_class_select",				         
				         "main_infor" : data, 
		 		         "submit"     : "select_class"
				        };
				var browser='not_ie6';    	
				data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
				show_dialog(data,browser);
			}
		});	 
	});
	
	$(".form_item ul li span").live('click',function(){
		var class_id=$(this).parent().attr("id");
		class_id=class_id.split("_");
		$("#id_to_select").val(class_id[1]);
		$("#name_to_select").val($(this).html());
		$(".form_item ul li span").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$('#select_class').live('click',function(){
		$('#parent_id').val($('#id_to_select').val());
		$('#parent_name').val($('#name_to_select').val());
		
		check_class_name();

		$("#user_dialog").remove(); 
		unblock_all(); 
	});
	
	//选择父类结束-----------------------------------------------------------------
	
	$('#class_name').live('change',check_class_name);
	
	$('#switch_for_en_name').live('click',function(){
	    $('#for_en_name').toggle();
	});

	$('#class_name_en').live('change',function(){
		var obj=$(this);
		var data=obj.val();

		if(!seo_url_check(data)) {
			top_message('请不要输入特殊字符!');
			obj.val('');
			return false;
		}
		
		$.post(get_url(json_str.admin_base+"cms_class/js_check_class_name/class_name_en"),{class_name: data, class_id : $('#class_id').val()},function(data){
		   if(data=='error') {
			   top_message('英文名有重复，请修改！'); 
			   obj.val('');
			   return false;
		   } 
	     }); 			
	});

    $('#index_type').live('change',function(){
	    if($(this).val()=='single') $('#for_single_page').show();
		else $('#for_single_page').hide();
	});

	//打开窗口，选择引用类和单篇对象
    $('.open_win4select').live('click',function(){
	      var obj=$(this);
		  var menu_title, ajaxurl,obj_type;
		  
		  switch(obj.attr('id')) {
             case 'select_refer_class':
			    menu_title='内容分类列表';
			    ajaxurl = json_str.admin_base+"navi_admin/get_cms_classes";
				obj_type='cms_class';
			    break;
			 case 'select_single_page':
				menu_title='附加单页列表';
				ajaxurl = json_str.admin_base+"navi_admin/get_html_list";
				obj_type='html_list';
			    break;
             default: ;
		  }
		 
		  $.get(get_url(ajaxurl),function(data){
				
				var html=data?data:'<div class="null">暂无对象可选！</div>';	 

				html= '<div class="select_div '+obj_type+'">'+html+'</div><div id="special_pagination"></div>';
				simple_viewer(obj.offset().left+100,obj.offset().top+10,html,'320px','260px');
				$('.menu_title').text(menu_title);
				$('#simple_viewer').addClass('no_dispear_auto');

				special_pagination();
		 });	
    });
	
	$('.remove_selected').live('click',function(){
	      $('#'+$(this).attr('id').replace('remove_','')).val('');
		  $(this).hide();
	});

	$('.obj_id').live('click',function(){
		  var cur_val;
		  
		  if($(this).closest('.select_div').hasClass('cms_class')) {

			  cur_val=$('#refer_class').val()?$('#refer_class').val().split(','):[];
			  
			  if($(this).val()==$('#class_id').val()) { 
				  $(this).attr('checked',false); 
				  top_message('不能引用自身!');
				  return false;
			  }

			  if($(this).parent().hasClass('has_sub')) {
				  $(this).attr('checked',false); 
				  top_message('该分类含有子类!');
				  return false; 
			  }
			  
			  //注：选择本属于它的子类作为引用类没有在此处检测并撤销，
			  //在php脚本中会通过array_unique处理,即使不处理也不会造成问题。

			  if(!$(this).is(':checked')) arrayRemoveByValue(cur_val,$(this).val());
			  else cur_val.push($(this).val());
			  $('#refer_class').val(cur_val.join(','));
		  
		  }
		  else {
			  if($(this).is(':checked'))  {
				  $('.obj_id').not(this).attr('checked',false);
				  $('#single_page').val($(this).val());
			  }
			  else 	 $('#single_page').val('');
		  }
		  
		  $('.selected_text').each(function(){
		  	  if($(this).val())	$(this).next().next().show();
		      else 	 $(this).next().next().hide();
		  });  		 
	});	

	$('#user_level').live('click',function(){
        var obj=$('#user_level');
        obj.blur();        
        $.get(get_url(json_str.base_url+'ajax/user_level'),function(data){
            simple_dialog(obj.offset().left+obj.width()+10,obj.offset().top,data,'70'); 
        });         
    });

    $('#user_level_list li').live('click',function(){
         $('#user_level').val($(this).text());
         $('#view_right').val($(this).attr('id')); 
    });

	$("#class_submit").live('click',function(){
		 var add_or_edit,url,class_id,data,flag=1,index_page;
		 var inputs = [];
		 $('#class_form :input').not(':checkbox').each(function() {
        	 if($(this).val()=='' && $(this).hasClass('filled')) { 
        		 $(this).css({'border':'1px solid red'});
        		 top_message($(this).parent().prev().text()+'尚未填写'); 
				 flag=0; return false;
			 }
        	 $(this).removeAttr('style');
        	 inputs.push(this.name + '=' + escape(this.value));
         });

         add_or_edit=$("#add_or_edit").val();
         class_id=$("#class_id").val();
         add_or_edit=add_or_edit=='edit'?'edit':'add';         
         url=add_or_edit=='add'?json_str.admin_base+"cms_class/add/1":json_str.admin_base+"cms_class/edit/"+class_id+"/1";
         
         if(!flag) return false;
         data=inputs.join('&');	 	 

		 if($('#index_type').val()=='single') {
		     if(!$('#single_page').val()) {
			    top_message('单页ID尚未设置');
			    $('#single_page').css({'border':'1px solid red'});
			    return false;
			 }
			 else  index_page= $('#single_page').val();
		 } 
		 else  index_page= $('#index_type').val();

		 data=data+'&class_hide='+($('#class_hide:checked').length?'1':'0')+'&index_page='+index_page;

		 $.ajax({
        	 type: 'post',
             url:   get_url(url),
		     cache: false,
             data:  data,
             success : function(data,textStatus){ 
				 try{ 
	                data=eval('(' + data + ')'); 					 
					ajax_success(data,textStatus,'','json');
					if(data.result=='1') {
						delete_images_sql();
						refresh_class_list();
					}					
                 }
				 catch(err){
	                ajax_success('操作失败，请重试！',textStatus,'','string');
	             }
			 },
			 error   : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
         });
	});
	
	$("#delete_class").live('click',function(){		
		$.ajax({
			type: 'post',
			data: 'ajax=1',
			url : get_url(json_str.admin_base+"cms_class/delete_class/"+ $('#id_to_delete').val()),
			success : function(data,textStatus){
				try{ 
	                data=eval('(' + data + ')');
					if(data.id)  callback_refresh_class();
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
	
	$('#select_move_to_class').live('click',function(){
		var selected_id=$('.form_item span.selected').parent().attr('id');
		selected_id=selected_id.split("_");
		
		if($('span#selected_first').text()==$('span.selected').text()){
			top_message('选择此类别，无需移动');
		}
		else {
			$.ajax({
				type: 'post',
				data: 'class_id='+$('#class_to_move').val()+'&to_id='+selected_id[1]+'&move_type='+$('[name="move_class_type"]:checked').attr('value'),
				url : get_url(json_str.admin_base+"cms_class/move_class"),
				success : function(data,textStatus){					
					try{ 
		                data=eval('(' + data + ')');
		                ajax_success(data,textStatus,'','json');
		                if(data.result=='1')  refresh_class_list(); 
	                 }
					 catch(err){
		                ajax_success('操作失败，请重试！',textStatus,'','string');
		            }
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);},
				complete: function() { $("#user_dialog").remove(); unblock_all(); }
			});	
		}
	});	
	
	$("#class_cancel").live('click',function(){
		delete_images_cancel();
		$('#simple_viewer').remove();
		refresh_class_list();
	});

	$("#upload_banner").live('click',function(){
		var size=$("#class_banner_size").html();
		size=size.split(':');
		var data ={
	     	"action"      : 'upload_for_crop',
			"sendback"	  : 'banner_image',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html()+'/b/',
			"preview"     : $("#preview_image").html()
	        }; 
		show_upload_crop(data);  //data为JSON对象格式，直接传入，并直接作为ajax的data发送，下同。
	});

	$("#upload_icon").live('click',function(){
	    var size=$("#class_icon_size").html();
	    size=size.split(':');
	    var data ={
	      	"action"      : 'upload_for_crop',
			"sendback"	  : 'icon_image',
			"t_width"     : size[0],
	        "t_height"    : size[1],
			"path"        : $("#upload_dir").html()+'/i/',
			"preview"     : $("#preview_image").html()
	        };
		show_upload_crop(data);
	});

});
     
function move_to(obj) {
   	var id=obj.id.split('_');
   	var class_name=obj.title;
   	var select_id=$('#'+obj.id).children().filter('[id^="parent_"]').attr('id');
   	    select_id=select_id.split('_');
 		
   	$.ajax({
 			type: 'post',
 			data: 'class_id=0&select_id='+select_id[1]+'&hide_id='+id[0],
 			url : get_url(json_str.admin_base+'cms_class/show_children'),
 			success:function(data,textStatus){
 				var data ={
 				      	 "title"      : "选择移动目标类",
 				      	 "object"     : id[0],
  				         "action"     : "选择"+class_name+"的目标类",
 				         "dialog_view": "dialog_class_move",				         
 				         "main_infor" : data, 
 		 		         "submit"     : "select_move_to_class"
			        };
			    var browser='not_ie6';    	
			    data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
			    show_dialog(data,browser);
		   }
	});	 
}

function myedit(id) {
		 
         $.ajax({
         	   type: 'post',
         	   url:  get_url(json_str.admin_base+"cms_class/edit/"+id),
         	   success : function(data,textStatus){
					 try{
					     data = eval('(' + data + ')');						 
						 ajax_success(data,textStatus,'','json');
					  }
					 catch(err){
					 	 if(data){
							 $(".edit").html(data).slideDown();
			                 $('#clist_data').html('').slideUp();
						 }
						 else ajax_success('',textStatus,'','string');
					  }
         	  },
         	  error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
        });	
}

function mydelete(obj_id) {
	    
		if($('#'+obj_id).hasClass('has_sub')) {
			top_message('该条目下有子条目，不能删除！');
			return false;
		}
		
		else if($('#parent_'+$('#'+obj_id+' li.by_class').text()).length || parseInt($('#'+obj_id+' li.cms_num').text())) {
		    top_message('该条目下有子条目，不能删除！');
			return false;
		}

		var id=obj_id.split('_');
		var object=id[0]=='span'?$('#'+obj_id).text():$("#"+id[0]+"_class_name").html();
		    id=id[0]=='span'?id[1]:id[0];

	    var data ={
	      	 "title"       : "确认对话框",
	         "action"      : "删除分类", 
	         "object"      : object,
	         "main_infor"  : "此举将删除其所有内容，确认吗？",
	         "dialog_view" : "dialog_infor",
	         "infor_type"  : "warning",
	         "submit"      : "delete_class"
	        };
	    var browser='not_ie6';
	    
		if(!$('#id_to_delete').length)  $('body').append('<input type="hidden" id="id_to_delete">');		
		$('#id_to_delete').val(id); //saved for delete action to use
		
	    data=$.param(data);  //data为对象格式，被系列化为a=1&b=2&c=3...的形式再传入
	    show_dialog(data,browser); 	    
}

function myupdown(obj_id, updown) {
	    
    $.ajax({
       	  type: 'get',
       	  url:  get_url(json_str.admin_base+"cms_class/updown/"+obj_id+"/"+updown),
       	  success : function(data,textStatus){
		            try{ 
                         data=eval('(' + data + ')');
					     if(data.result=='1')  callback_refresh_class();
			             else ajax_success(data.infor,textStatus,'','string'); 
                    }
			        catch(err){
                       ajax_success('操作失败，请重试！',textStatus,'','string');
                    }
			 },
       	 error : function(XMLHttpRequest, textStatus, errorThrown){ ajax_failed(textStatus);}
    });
}
    
function refresh_class_list() {
    $.get(get_url(json_str.admin_base+"cms_class/clist/ajax"),function(data){
		       
		   $('#clist_data').html(data).slideDown();
		   $(".edit").html('').slideUp();
		   
		   initPagination(); //重新分页
	});       
}

function refresh_class_cascade() {
    $.post(get_url(json_str.admin_base+'cms_class/class_cascade'),function(data){
	    $(".edit").html('').slideUp(); 
		$('#clist_data').html(data);
		
		$('.class_item:first').text('根分类'); 
		$('.class_item:first').removeClass('class_item');
		$('.has_sub:first').click();
			
		$('#clist_data').slideDown(); 
   }); 
}
  
function callback_refresh_class() {
   if($('.class_cascade').length) refresh_class_cascade();
   else  refresh_class_list();
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

function check_class_name() {

	var obj=$('#class_name');
	var str=obj.val();
	    
	/*	
	if(!chinese_check(str)) {
		top_message('请输入中文字符!');
		obj.val('');
		return false;
	}
	*/
		
	$.post(get_url(json_str.admin_base+"cms_class/js_check_class_name/class_name"),{parent_id: $('#parent_id').val(), class_id: $('#class_id').val(),class_name : $.trim(str)},function(data){
	       
	   if(data=='error') { 
		   obj.val('');
		   top_message('同名栏目已经存在，请不要放到同一父级栏目下');
		   return false;
	   }

	   $.post(get_url(json_str.base_url+'ajax/cms_ajax/get_pinyin_name'),{cn_name : str},function(data){

	        str=data;

			$.post(get_url(json_str.admin_base+"cms_class/js_check_class_name/class_name_en"),{class_name: str, class_id : $('#class_id').val()},function(data){
		        if(data=='error') {
			       $('#class_name_en').val('');
				   top_message('英文链接有重复，请修改！');			      
			       return false;
		         } 
			     $('#class_name_en').val(str);
	        }); 
	   });

	});
 }
