<?php if($action=='index') { ?>

<div id="workplace_inner">

 <div class="list">

 <div class="horizon_navi">

   <ul>

   <li><a class="selected" href="javascript:void(0);"><span class="horizon_items">出版物列表</span></a></li>

   <li><a href="javascript:void(0);"><span class="horizon_items add_pub">添加出版物</span></a></li>

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

      <li class="check_li title">选择</li>

      <li class="title">类型</li>	

      <li class="title long-250">标题</li>	  

      <li class="title long-150">作者</li>

      <li class="title long-250">刊物/会议/出版社</li>

      <li class="title">年份</li>

    </ul>  

    <?php if(is_array($publications)) foreach($publications as $index => $value){

	  

      $id=$index+1;

	  extract(json_decode($value['pub_details'],TRUE));	  

	  $source=$value['pub_type']=='paper'?$journal:($value['pub_type']=='book'?$publisher:$meeting);

	  $type=$this->publication_model->pub_types[$value['pub_type']];

	  

	  echo '<ul id="'.$value['pub_id'].'_table" class="table ';

	  echo $id%2==1?'odd':'even'; 

      echo ' hide">';

      echo '<li class="id">'.$id.'</li>';

      echo '<li class="check_li"><input class="table_li_check" type="checkbox" id="select_'.$value['pub_id'].'" /></li>';	

      echo '<li>'.$type.'</li>';

      echo '<li class="long-250 by_title">'.my_limiter($value['pub_title'],30).'</li>'; 

	  echo '<li class="long-150">'.my_limiter($value['authors'],20).'</li>';

	  echo '<li class="long-250">'.my_limiter($source,30).'</li>';

      echo '<li>'.$value['pub_time'].'</li>';

	  echo '</ul>';

      echo "\n";

     }

   ?>

    <input type="hidden" id="id_be_selected" value="0" />

    <div class="clear_both"></div>         

  </div>

  <div id="pagination"></div>
  
  <span id="pagination_num" class="hide">20</span>

 <?php } else if($action=='edit') { 

 	if(isset($pub_id)) {

 		$pub_file=json_decode($pub_file,TRUE);

 		extract(json_decode($pub_details,TRUE));

 	}?>

    <form class="my_form" id="pub_form"  accept-charset="utf-8">

	<input type="hidden" name="pub_id" id="pub_id" value="<?php echo isset($pub_id)?$pub_id:0;?>" />

    <div class="form_title">填写表单<?php echo isset($pub_id)?'修改':'添加';?>论文著作</div>

    <div class="my_form_item">

      <label class="labeltag">发表年份：</label>

      <span class="mainarea">

       <select id="pub_time" name="pub_time">

         <?php 

         $cur_year=date('Y',time()); 

         $year_back=$this->publication_model->year_back;

         for($i=$cur_year; $i>$cur_year-$year_back; $i--) {

           echo '<option value="'.$i.'"'; 

           if(isset($pub_time) && $pub_time==$i) echo ' selected="selected" ';

           else if($cur_year==$i) echo ' selected="selected" ';

           echo '>'.$i.'</option>';

         }

         ?>

       </select>

      </span>

      <label class="labeltag">发表类型：</label>

      <span class="mainarea">

      <select id="pub_type" name="pub_type">

        <?php 

        foreach($this->publication_model->pub_types as $index => $value) {

           echo '<option value="'.$index.'"'; 

           if(isset($pub_type) && $pub_type==$index) echo ' selected="selected" ';

           echo '>'.$value.'</option>';

        }

        ?>

      </select>

      </span>     

    </div>

    <div class="my_form_item for_paper shift_div">

      <label class="labeltag">论文状态：</label>

      <span class="mainarea">

      <select id="pub_condition" name="pub_condition">

        <?php 

        foreach($this->publication_model->conditions as $index => $value) {

           echo '<option value="'.$index.'"'; 

           if(isset($pub_condition) && $pub_condition==$index) echo ' selected="selected" ';

           echo '>'.$value.'</option>';

        }

        ?>

      </select>

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">发表标题：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled"  name="pub_title"  id="pub_title"  value="<?php echo isset($pub_title)?$pub_title:'';?>" />

      </span>     

    </div>

    <div class="my_form_item">

      <label class="labeltag">作者：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled"  name="authors"  id="authors"  value="<?php echo isset($authors)?$authors:'';?>" />

      </span>     

    </div>

    

    <div class="my_form_item for_paper shift_div">

      <label class="labeltag">期刊名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox keywords filled"  name="journal"  id="journal"  value="<?php echo isset($journal)?$journal:'';?>" /> <label>*例如 Appl. Phys. Lett.</label>

      </span>

   </div>

   <div class="my_form_item published hide">   

      <label class="labeltag">卷册期数：</label>

      <span class="mainarea">

      <input type="text" class="enterbox shortarea filled"  name="volumn"  id="volumn"  value="<?php echo isset($volumn)?$volumn:'';?>" /> <label>*例如 72, 3270</label>

      </span>

   </div>

   <div class="my_form_item published hide">

      <label class="labeltag">页码范围：</label>

      <span class="mainarea">

      <input type="text" class="enterbox shortarea filled"  name="page"  id="page"  value="<?php echo isset($page)?$page:'';?>" /> <label>*例如 205-311</label>

      </span>

   </div>

   <div class="my_form_item published hide">

      <label class="labeltag">引用次数：</label>

      <span class="mainarea">

      <input type="text" class="enterbox numarea"  name="cited"  id="cited"  value="<?php echo isset($cited)?$cited:'';?>" /> <label>填写数字</label>

      </span>

   </div>

    

   <div class="my_form_item for_book shift_div hide">

      <label class="labeltag">出版商名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="publisher"  id="publisher"  value="<?php echo isset($publisher)?$publisher:'';?>" />

      </span>

   </div>   

   <div class="my_form_item for_book shift_div hide">  

      <label class="labeltag">出版商所在地：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="publish_area"  id="publish_area"  value="<?php echo isset($publish_area)?$publish_area:'';?>" />

      </span>     

    </div>

    

    <div class="my_form_item for_talk shift_div hide">

      <label class="labeltag">会议名称：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="meeting"  id="meeting"  value="<?php echo isset($meeting)?$meeting:'';?>" />

      </span>

    </div>   

    <div class="my_form_item for_talk shift_div hide">

      <label class="labeltag">会议所在地：</label>

      <span class="mainarea">

      <input type="text" class="enterbox filled"  name="meeting_city"  id="meeting_city"  value="<?php echo isset($meeting_city)?$meeting_city:'';?>" />

      </span>     

    </div>

    

    <div class="my_form_item">

     <label class="labeltag">文档附件：</label>

     <span class="mainarea resources_type">

       <input type="radio" value="1" name="to_upload" <?php if((isset($pub_file)&& $pub_file[0]=='1')||!isset($pub_file)) echo 'checked="checked"'; ?> /><label>新上传</label>

       <input type="radio" value="0" name="to_upload" <?php if(isset($pub_file)&& $pub_file[0]=='0') echo 'checked="checked"'; ?> /><label>URL地址</label>

     </span>

    </div>

    

    <div class="my_form_item div_upload <?php if(isset($pub_file)&& $pub_file[0]=='0') echo 'hide'; ?>">

     <label class="labeltag">上传文件：</label>

     <span class="mainarea">

      <input type="text" class="enterbox" disabled="disabled" name="file_uploaded" id="file_uploaded" value="<?php if(isset($pub_file)&& $pub_file[0]=='1') echo $pub_file[1]; ?>" />	

      <input type="button" class="my_button" id="upload_file" value="点击上传" />

     </span>

    </div>

    

    <div class="my_form_item div_url <?php if((isset($pub_file)&& $pub_file[0]=='1')||!isset($pub_file)) echo 'hide'; ?>">

     <label class="labeltag">输入地址：</label>

     <span class="mainarea">

      <input type="text" id="file_url"  name="file_url" class="enterbox keywords" value="<?php if(isset($pub_file)&& $pub_file[0]=='0') echo $pub_file[1]; ?>" /> <label>*输入文件的完整地址</label>

     </span>

    </div>

    

    <div class="hide">

       <span id="file_types_list">*.ps;*.pdf;*.eps;*.zip;*.doc;*.tar;*.gz;*.rar</span>

       <span id="file_type_selected">file</span>

       <span class="upload_file_type"><span class="selected">文档文件</span></span>

       <span id="return_input">file_uploaded</span>

    </div>

    

	<div class="my_form_item button_row">

      <label class="labeltag"></label>

      <span class="mainarea">

      <label for="link_submit"><input type="button" class="my_button" id="pub_submit" name="pub_submit" value="确认后，提交！" /></label>

      </span>

      <span class="mainarea">

      <label for="link_cancel"><input type="button" class="my_button" id="pub_cancel" name="pub_cancel" value="取消" /></label>

      </span>

    </div>

	</form>

  <?php } ?>



