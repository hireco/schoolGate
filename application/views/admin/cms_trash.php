<?php if($viewer=='index') {?>

<div id="workplace_inner">

  <div class="horizon_navi">

  <ul>   
   <li><a href="javascript:void(0);" class="selected"><span class="horizon_items">回收站</span></a></li>
   <li><a href="javascript:void(0)"><span id="show_query_bar" class="horizon_items show_query_bar">目标查询</span></a></li>
   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>
   <li class="hide" id="return_to_all"><a href="javascript:void(0)"><span class="horizon_items return_to_all">返回列表</span></a></li>
   </ul>

  </div>

  <div id="clist_data"><?php echo $clist;?></div>
  
  <div class="clear_both"></div>
  
  <div class="time_filter">
        <a id="day_30">30天内</a>
		<a id="day_90">90天内</a>
		<a id="day_365">365天内</a>
		<a id="day_0">全部</a> 
        <span>提示：较短的时间范围有助于提高速度</span>		
  </div> 

</div>

<?php } else if($viewer=='clist') {?>

  <input type="hidden" name="my_class"	id="my_class" value="<?php echo $my_class;?>" />
  
  <div class="ul_tables">

    <ul class="table" style="padding-top:0pt;">      

      <li class="id title">编号</li>	

      <li class="check_li title">选择</li>

      <li class="hide">默认排序</li>

	  <li class="title long-200 sort_item" id="sort_by_title" >内容主标题</li>
	  
	  <li class="title long-100 sort_item" id="sort_by_poster">发布人</li>
	  
	  <li class="title long-120 sort_item" id="sort_by_post">发布时间</li> 
	  
	  <li class="title long-100 sort_item" id="sort_by_trasher">回收人</li>
	  
	  <li class="title long-120 sort_item" id="sort_by_trash">回收时间</li>	  

	  <li class="title long-100 sort_item" id="sort_by_class">主栏目</li>
	  
	  <li class="title liazi sort_item" id="sort_by_model">类型</li>
	  
	  <li class="hide">访问地址</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>

    <div class="ul_tables_body">  

    <?php if(is_array($cms_list)) foreach($cms_list as $index => $value){

	  $id=$index+1;
	  
	  $poster=$this->check->get_attr($value['user_id'],'nick_name');
	  
	  $post_time=date('y-m-d H:i:s',$value['post_time']);
	  
	  $trasher=$this->check->get_attr($value['trasher'],'nick_name');
      
	  $trash_time=date('y-m-d H:i:s',$value['trash_time']);
	  
	  $class_name=$this->cms_model->get_attr($value['class_id'],'class_name');
	  $vice_column=$value['vice_class_id']?$this->cms_model->get_attr($value['vice_class_id'],'class_name'):'未添加';

	  $title_style='';

	  if($value['title_color'])  $title_style.='color:'.$value['title_color'].';';

	  if($value['title_strong']) $title_style.='font-weight:bold;';

	  if($title_style) $title_style='style="'.$title_style.'"';
	  

	  echo '<ul id="'.$value['index_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['index_id'].'" /></li>';	  

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="by_title long-200 show_title" '.$title_style.' title="'.$value['cms_title'].'">'.my_limiter($value['cms_title'],14).'</li>';

	  echo '<li class="by_poster long-100">'.$poster.'</li>';
	  
	  echo '<li class="by_post long-120">'.$post_time.'</li>';

	  echo '<li class="by_trasher long-100">'.$trasher.'</li>';
	  
	  echo '<li class="by_trash long-120">'.$trash_time.'</li>';

	  echo '<li class="by_class long-100">'.$class_name.'</li>';

	  echo '<li class="by_model liazi" id="'.$this->myconfig->cms_model($value['model_id'],'table').'_'.$value['index_id'].'">'.$this->myconfig->cms_model($value['model_id'],'name').'</li>';

	  echo '<li class="hide  by_address">'.site_url('cms/'.$this->myconfig->cms_model($value['model_id'],'table').'/'.$value['index_id']).'</li>';

	  echo '</ul>';

	  echo "\n";

     }

   ?>

    </div>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">20</span>
  
  
<div id="hide_for_query" class="hide">

  <div class="pop_form_item">     

     <div class="pop_div">

       <label class="pop_title" id="select_bar_title">搜索标题</label>

       <div class="hide">

        <form id="query_form">

          <input class="inputarea" type="text"  value="" name="search_title"  id="search_title"  />

          <input class="inputarea" type="hidden" id="search_class"   name="search_class"    value=""/>

          <input class="inputarea" type="hidden" id="search_model"   name="search_model"    value=""/>

        </form>

       </div>

     </div>
     
	 <div class="pop_div">

       <label class="pop_title" id="select_bar_poster">搜索作者</label>

       <div class="hide">

          <input class="inputarea" type="text"  value="" name="search_poster"  id="search_poster"  />

       </div>

     </div>
	 
     <div class="pop_div">

       <label class="pop_title" id="select_bar_class">选择分类</label>

       <ul class="hide pop_ul" id="search_class_list" style="height:300px; overflow:auto;">

        <li><span class="no_limit">不限</span></li>

        <?php echo $children_list; ?>

       </ul>

     </div>

     <div class="pop_div">

       <label class="pop_title" id="select_bar_model">选择类型</label>

       <ul class="hide pop_ul" id="search_model_list">

       <li><span class="no_limit">不限</span></li>

       <?php 

         $cms_model=$this->config->item('cms_model');

         foreach ($cms_model as $index => $value)

         echo '<li id="models_'.$index.'"><span>'.$value['name'].'</span></li>'; 

       ?>

       </ul>

     </div>     

    </div>
  
 </div>
 
 <div id="hide_for_move" class="hide">
   <?php echo $children_list; ?>
 </div>

<?php }?>

    



