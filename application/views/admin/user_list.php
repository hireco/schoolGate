<?php if($viewer=='index') {?>

<div id="workplace_inner">

 <div class="list">

  <div class="horizon_navi">

  <ul>

   <li><a href="javascript:void(0);" class="selected"><span id="user_list_link" class="horizon_items">用户列表</span></a></li>

   <li><a href="javascript:void(0)"><span  id="new_entry" class="horizon_items new_entry">新增用户</span></a></li>

   <li><a href="javascript:void(0)"><span  id="show_query_bar" class="horizon_items show_query_bar">用户查询</span></a></li>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>

   <li class="hide" id="return_to_all"><a href="javascript:void(0)"><span class="horizon_items return_to_all">返回列表</span></a></li>

   </ul>

  </div>

  <div id="clist_data"><?php echo $clist;?></div>

 </div> 

 <div class="edit"></div>
    <div class="view"></div>

</div>

<?php } else if($viewer=='clist') {?>

  <div class="ul_tables">

    <ul class="table" style="padding-top:0pt;">      

      <li class="id title">编号</li>	

      <li class="check_li title">选择</li>

      <li class="hide">默认排序</li>

	  <li class="title long-200 sort_item" id="sort_by_title" >用户名</li>

	  <li class="title long-100 sort_item" id="sort_by_tryuser">来源</li>

      <li class="title long-100 sort_item" id="sort_by_userlevel">当前级别</li>

      <li class="title long-100 sort_item" id="sort_by_login">最新登录</li> 

	  <li class="title long-100 sort_item" id="sort_by_nickname">昵称</li>

	  <li class="title sort_item" id="sort_by_realname">真名</li>

	  <li class="title sort_item is_num"   id="sort_by_times">登录数</li>	  

	  <li class="title long-100 sort_item" id="sort_by_admin">管理权</li>

	  <li class="title long-100 sort_item" id="sort_by_life">激活状态</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>

    <div class="ul_tables_body">  

    <?php 

      $user_level=$this->config->item('user_level');

      if(is_array($user_list)) foreach($user_list as $index => $value){

	  $id=$index+1;

	  $last_time=$value['last_time']?date('Y-m-d',$value['last_time']):date('Y-m-d',$value['register_time']);	  

	  $user_admin=$value['user_admin']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $user_life=$value['user_life']?'<span style="color:green;">√</span>':'<span style="color:red;">×</span>';

	  $nick_name=$value['nick_name']?$value['nick_name']:$this->config->item('default_nickname');

	  echo '<ul id="'.$value['user_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['user_id'].'" /></li>';	  

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="hide is_admin">'.$value['user_admin'].'</li>';

      echo '<li class="hide is_super_admin">'.$value['user_level'].'</li>';

      echo '<li class="by_title long-200 show_title" title="'.$value['user_name'].'">'.$value['user_name'].'</li>';

      echo '<li class="by_tryuser long-100">'.($value['try_user']?'体验用户':'正式用户').'</li>';

	  echo '<li class="by_userlevel long-100">'.$user_level[$value['user_level']].'</li>';

      echo '<li class="by_login long-100">'.$last_time.'</li>';

	  echo '<li class="by_nickname long-100">'.$nick_name.'</li>';

	  echo '<li class="by_realname">'.$value['real_name'].'</li>';

	  echo '<li class="by_times">'.$value['login_times'].'</li>';

	  echo '<li class="by_admin long-100">'.$user_admin.'</li>';

	  echo '<li class="by_life long-100 user_life_'.$value['user_id'].'">'.$user_life.'</li>';

	  echo '</ul>';

	  echo "\n";

     }

   ?>

    </div>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">14</span>

<div id="hide_for_query" class="hide">

  <div class="pop_form_item">     

     <div class="pop_div">

       <label class="pop_title" id="select_bar_username">输用户名</label>

       <div class="hide">

        <form id="query_form">

          <input class="inputarea" type="text"  value="" name="search_title"  id="search_title"  />

          <input class="inputarea" type="hidden" id="search_userlevel"   name="search_userlevel"    value=""/>        

        </form>

       </div>

     </div>

     <div class="pop_div">

       <label class="pop_title" id="select_bar_nickname">搜索昵称</label>

       <div class="hide">   

          <input class="inputarea" type="text"  value="" id="search_nickname" name="search_nickname" />

       </div>

     </div>   

     <div class="pop_div">

       <label class="pop_title" id="select_bar_userlevel">选择级别</label>

       <ul class="hide pop_ul" id="search_userlevel_list">

        <li><span class="no_limit">不限</span></li>

        <?php 

        foreach ($this->config->item('user_level') as $index => $value) 

        echo '<li id="userlevel_'.$index.'"><span>'.$value.'</span></li>';

        ?>

       </ul>

     </div>     

    </div>

  </div>

<?php } ?>

    



