<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

  <ul>

   <li><a href="javascript:void(0);" class="selected"><span class="horizon_items block_list">封堵IP列表</span></a></li>   

   <li><a href="javascript:void(0)"><span  class="horizon_items block_add">新建封堵IP</span></a></li>

   <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span  class="horizon_items  sort_by_default">默认排序</span></a></li>

  </ul>

  </div>

  <div id="clist_data"><?php echo $clist;?></div>

  </div>

  <div class="edit"></div>

</div>

<?php } else if($action=='clist') {?>

  <div class="ul_tables">

    <ul class="table" style="padding-top:0pt;">

      <li class="id title">编号</li>	

      <li class="hide">默认排序</li>

      <li class="title long-200 sort_item" id="sort_by_ip">IP值</li>      

	  <li class="title long-250">封堵原因</li>

	  <li class="title long-150 sort_item" id="sort_by_time">封堵时间</li>

    </ul>

    <span class="hide" id="current_order"></span>

    <span class="hide" id="current_order_by">sort_by_default</span>  

    <div class="ul_tables_body">

    <?php if(is_array($ips)) foreach($ips as $index => $value){

	  $id=$index+1;

	  echo '<ul id="'.$value['ip_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="by_default hide">'.$id.'</li>';

      echo '<li class="by_ip long-200">'.$value['ip_address'].'</li>';

      echo '<li class="long-250">'.$value['block_reason'].'</li>';

      echo '<li class="by_time long-150">'.date('Y-m-d H:i:s',$value['block_time']).'</li>';

	  echo '</ul>';

      echo "\n";

     }

   ?>

   </div>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>

  <span id="pagination_num" class="hide">16</span>

 <?php } else if($action=='add'){?>

    <form class="my_form" id="blockip_add"  accept-charset="utf-8">

    <div class="form_title">填写表单添加新的封堵IP源</div>

	<div class="my_form_item">

      <label class="labeltag top">IP值：</label>

      <span class="mainarea">

      <input type="text" class="enterbox mediumarea filled" name="ip_address" id="ip_address" value="" /><label>*填写标准的IP地址</label>

      </span>     

    </div>	

    <div class="my_form_item">

      <label class="labeltag">封堵原因：</label>

      <span class="mainarea" id="item_value">

        <input type="text" class="enterbox  mediumarea filled" name="block_reason" id="block_reason" value="" /><label>*限20字符以内</label>

      </span> 

    </div>

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <input type="button" class="my_button" id="blockip_add_submit" name="blockip_add_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea">

      <input type="button" class="my_button" id="blockip_add_cancel" name="blockip_add_cancel" value="取消" />

      </span>

    </div>

	</form>

  <?php }?>



