<?php if($viewer=='edit') { ?>

   <form class="my_form" id="html_form"  accept-charset="utf-8" autocomplete = "off">

    <textarea name="html_content" id="html_content" class="hide"><?php echo isset($html_content)?$html_content:'';?></textarea>

     <div class="my_form_item" style="border-bottom:none;">
      
      <label style="margin-left:0px;">所属分类</label>
     
      <span class="mainarea">
	  
	    <select name="group_id" id="group_id">

        <?php 
		    $groups=$this->html_model->cn_groups;
		    foreach($groups as $i => $j) {
			  echo '<option value="'.$i.'"'; 
			  if(isset($group_id)&&($i==$group_id)) echo ' selected="selected" ';
			  echo '>'.$j.'</option>';
			}
		?>

        </select>
      
	  </span> 
	
	</div>
	
	<div class="my_form_item" style="border-bottom:none;">

      <label style="margin-left:0px;">中文名称</label>

      <span class="mainarea">

      <input type="text" class="enterbox title filled" name="cn_title" id="cn_title" value="<?php echo isset($cn_title)?$cn_title:'';?>" /><label>*不超过20个汉字</label> <label id="switch_for_en_title" style="text-decoration:underline;cursor:pointer;">点击此处优化访问地址</label>

      </span>

    </div>

	<div id="for_en_title" class="hide">

    <div class="my_form_item" style="border-bottom:none;">

      <label style="margin-left:0px;">访问地址</label>

      <span class="mainarea">

      <input type="text" class="enterbox title filled" name="en_title" id="en_title" value="<?php echo isset($en_title)?$en_title:'';?>" /><label>*英文单词或者拼音串，不超过40个字母，禁止空格</label>

      </span>            

    </div>

    <input type="hidden" name="html_id" id="html_id" value="<?php echo isset($html_id)?$html_id:'';?>" />

    <div class="my_form_item button_row">

      <label style="margin-left:0px;">信息提示</label>

      <span class="mainarea">该页面的前台访问地址是：<label id="visiting_url" style="text-decoration:underline;color:blue;"><?php echo isset($en_title)?site_url('html/'.$en_title):site_url('html/en_title');?></label></span>

    </div>

	</div>

    <div id="part_page_warning" class="hide my_form_item" style="margin-bottom:10px;">

      <label style="margin-left:0px;">注意事项</label>

      <span class="mainarea">您现在编辑的页面是局部页面，DOCTYPE,html,body标签以及head部分将被自动过滤</span>

    </div>  

    <div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea"><input type="button" class="my_button" id="html_submit"  name="html_submit" value="确认后，提交！" />

      </span>

      <span class="mainarea"><input type="button" class="my_button" id="html_cancel" name="html_cancel" value="取消" />

      </span>

      <input name="full_page" type="hidden" id="full_page"  />

   </div>        	

  </form>

<?php } if($viewer=='pages') { ?>

  <div class="ul_tables">

  <ul class="table" style="padding-top:0pt;">

    <li class="id title">编号</li>

    <li class="check_li title">选择</li>
	
	<li class="hide">默认排序</li>

    <li class="title long-100 sort_item" id="sort_by_class">所属分类</li> 

	<li class="title long-250 sort_item" id="sort_by_cn_title">名称</li>      

    <li class="title long-120 sort_item" id="sort_by_poster">发布者</li>

	<li class="title long-250">最新编辑</li>

	<li class="title long-80 sort_item" id="sort_by_mode">完整页面</li>
	
	<li class="title">状态</li>

  </ul>

  <span class="hide" id="current_order"></span>

  <span class="hide" id="current_order_by">sort_by_default</span>

  <div class="ul_tables_body">

  <?php if(is_array($pages)) foreach($pages as $index => $value){

	  $id=$index+1;

	  $last_modify=$value['last_modify']?date('y-m-d h:i:s',$value['last_modify']):date('y-m-d h:i:s',$value['post_time']);

	  $last_editor=$value['last_editor']?$value['last_editor']:$value['user_id'];

      $full_page=$value['full_page']=='1'?'是':'否';
	  
	  $value['locked']=$value['locked']=='1'?'attr_1':'attr_0';
      $value['hide']=$value['hide']=='1'?'attr_1':'attr_0';

	  echo '<ul id="'.$value['html_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">'; 

      echo '<li class="id">'.$id.'</li>';
	  
	  echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['html_id'].'" /></li>';

      echo '<li class="by_default hide">'.$id.'</li>'; 
	  
	  echo '<li class="by_en_title hide" id="'.$value['html_id'].'_en_title" >'.$value['en_title'].'</li>';

      echo '<li class="by_class long-100">'.$this->html_model->cn_groups[$value['group_id']].'</li>';	  

      echo '<li class="by_cn_title long-250" id="'.$value['html_id'].'_cn_title" >'.$value['cn_title'].'</li>';
	 
	  echo '<li class="by_poster long-120">'.$this->check->get_attr($value['user_id'],'nick_name').'</li>'; 

	  echo '<li class="long-250">'.$last_modify.'（'.$this->check->get_attr($last_editor,'nick_name').'）</li>';
	  
	  echo '<li class="by_address hide">'.site_url('html/'.$value['en_title']).'</li>';

	  echo '<li class="by_mode long-80 page_mode">'.$full_page.'</li>';

	  echo '<li><span id="hide_'.$value['html_id'].'" class="'.$value['hide'].'">隐</span><span id="locked_'.$value['html_id'].'" class="'.$value['locked'].'">锁</span></li>';

      echo '</ul>';

      echo "\n";

     }

   ?>

  </div>

  <input type="hidden" id="id_to_delete" value="0" />

  <div class="clear_both"></div>     

  </div>

  <div id="pagination"></div>
  <span id="pagination_num" class="hide">20</span>

<?php } else if($viewer=='index') {?>

<div id="workplace_inner">

   <div class="horizon_navi line_navi">

      <ul>

        <li><a href="javascript:void(0);"><span id="list_pages"  class="selected horizon_items">页面列表</span></a></li>

        <li><a href="javascript:void(0);"><span id="full_edit"   class="horizon_items">编辑完整页面</span></a></li>

        <li><a href="javascript:void(0);"><span id="part_edit"   class="horizon_items">编辑局部页面</span></a></li>

        <li class="hide is_num" id="sort_by_default"><a href="javascript:void(0)"><span class="sort_by_default">默认排序</span></a></li>

      </ul>

      <div class="clear_both"></div>

   </div>

   <div id="fckeditor_div" class="my_form hide">

   <script type="text/javascript" src="<?php echo base_url();?>fckeditor/fckeditor.js"></script>

   <script>

   var oFCKeditor = new FCKeditor('editor_content');

   oFCKeditor.BasePath = json_str.base_url+"fckeditor/";

   oFCKeditor.ToolbarSet = "Admin";

   oFCKeditor.Width = '100%'; 

   oFCKeditor.Height = '300';

   oFCKeditor.Config['FullPage']=true; 

   oFCKeditor.Create();

   </script>

   </div>

   <div id="data_viewer">

   <?php echo $data_viewer;?>

   </div>    

  <div class="clear_both"></div>

</div>

<?php }?>

