<div class="form_item">
  <div class="infor standard">
    <?php echo $action; ?>
  </div>
  <div class="top_line">
     <div class="move_class_div">选择移动的类型</div>
     <div class="move_class_div">
      <input type="hidden" name="class_to_move" id="class_to_move" value="<?php echo $object;?>"/>
      <input type="radio" name="move_class_type" value="whole"  checked="checked"  /> 整体移动
      <input type="radio" name="move_class_type" value="affiliate" /> 只移动下属
     </div>
  </div>
  <div class="main_infor">
    <ul>
       <?php echo $main_infor; ?>
     </ul>
  </div>   
</div>