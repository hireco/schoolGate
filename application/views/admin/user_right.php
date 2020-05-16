<form class="my_form" id="right_form" accept-charset="utf-8"  autocomplete = "off">

      <div class="form_title">设置管理员的权限</div>

      <div class="my_form_item">

          <label class="labeltag">设置用户对象</label>

           <span class="mainarea">

            <?php echo $user_name;?>

            <input  type="hidden" name="user_id"  id="user_id"  value="<?php echo $user_id?>" /> 

           </span>

           <span class="mainarea">

           <input type="checkbox" name="select_all" id="select_all" value="0" /> <label id="select_hint">*点击全选</label> 

           </span>

      </div>

      <?php foreach($rights as $index => $value) {?> 

      <div class="my_form_item">

          <label class="labeltag"><?php echo $value['title']?></label>

          <span class="mainarea">

            <?php 

              foreach($value['functions'] as $index_i => $value_i) {

              	echo '<input class="right_checkbox" type="checkbox" '; 

              	if(isset($user_right[$index][$index_i]) && $user_right[$index][$index_i]=='1') echo 'checked="checked"';

              	echo 'id="'.$index.'_'.$index_i.'"  name="'.$index.'_'.$index_i.'" /><label>'.$value_i.'</label>';

              }

            ?>             

          </span>

      </div>              

      <?php }?>
	  
	  <div class="my_form_item">

          <label class="labeltag">管理栏目</label>

          <span class="mainarea">

           <input type="text" class="enterbox mediumarea" name="cms_class" id="cms_class" value="<?php echo $cms_class;?>">            
		   <label>留空则不限制，否则请填写栏目的ID，以逗号间隔</label>
          </span>

      </div>

      <div class="my_form_item button_row">

        <label class="labeltag"></label>

        <span class="mainarea">

          <input type="button" class="my_button" id="right_submit" name="right_submit" value="确认后，提交！" />

        </span>

        <span class="mainarea">

          <input type="button" class="my_button" id="right_cancel" name="right_cancel" value="取消" />

        </span>

     </div>    

</form>