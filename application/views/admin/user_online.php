<?php if($viewer=='index') {?>

<div id="workplace_inner">

  <div class="horizon_navi">

  <ul>

   <li><a href="javascript:void(0);" class="selected"><span id="online_list_link" class="horizon_items">在线列表</span></a></li>

   <li><a href="javascript:void(0)"><span  id="show_query_bar" class="horizon_items show_query_bar">在线查询</span></a>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="horizon_items sort_by_default">默认排序</span></a></li>

   <li class="hide" id="return_to_all"><a href="javascript:void(0)"><span class="horizon_items return_to_all">返回列表</span></a></li>

   </ul>

  </div>

  <div id="clist_data"><?php echo $clist;?></div>    

</div>

<?php } else if($viewer=='clist') {?>

  <div class="ul_tables">

    <ul class="table" style="padding-top:0pt;">      

      <li class="id title">编号</li>	

      <li class="check_li title">选择</li>

      <li class="hide">默认排序</li>

	  <li class="title long-100 sort_item" id="sort_by_username" >用户名</li>

	  <li class="title long-100 sort_item" id="sort_by_nickname" >用户昵称</li>

	  <li class="title long-150 sort_item" id="sort_by_userlevel">当前级别</li>

      <li class="title long-150 sort_item" id="sort_by_modify">最新动作</li>

      <li class="title long-200 sort_item" id="sort_by_client">客户端</li>

      <li class="title long-100 sort_item" id="sort_by_ip">来源IP</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>

    <div class="ul_tables_body">  

    <?php 

      $user_level=$this->config->item('user_level');

      if(is_array($user_list)) foreach($user_list as $index => $value){

	  $id=$index+1;

	  

	  $user_level=$this->config->item('user_level');

	  $user_data = $this->session->_unserialize($value['user_data']);

	  $user_name=isset($user_data['user_name'])?$user_data['user_name']:'guest';

	  $nick_name=isset($user_data['nick_name'])?$user_data['nick_name']:$this->config->item('default_nickname');

	  $user_level=isset($user_data['user_level'])?$user_level[$user_data['user_level']]:'访客';

	  

	  echo '<ul id="'.$value['session_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['session_id'].'" /></li>';	  

      echo '<li class="by_default hide">'.$value['session_id'].'</li>';

      echo '<li class="by_username long-100">'.$user_name.'</li>';

      echo '<li class="by_nickname long-100">'.$nick_name.'</li>';

	  echo '<li class="by_userlevel long-150">'.$user_level.'</li>';

      echo '<li class="by_modify long-150">'.date('Y-m-d H:i:s',$value['last_activity']).'</li>';

      echo '<li class="by_client long-200" title="'.$value['user_agent'].'">'.$value['user_agent'].'</li>';

      echo '<li class="by_ip long-100">'.$value['ip_address'].'</li>';

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

          <input class="inputarea" type="text"  value="" name="search_username"  id="search_username"  />

          <input class="inputarea" type="hidden" id="search_userlevel"   name="search_userlevel"    value=""/>        

        </form>

       </div>

     </div>

     <div class="pop_div">

       <label class="pop_title" id="select_bar_ip">搜索来源</label>

       <div class="hide">

          <input class="inputarea" type="text"  value="" id="search_ip"   name="search_ip" />

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

    



