<div id="user_dialog">
<?php if($browser=='ie6') {?>
<div class="simple_border_4_ie6">
<?php } else {?>
<div class="lefttop_corner"></div>
<div class="top_border"></div>
<div class="righttop_corner"></div>
<div class="left_border"></div>
<?php }?>
<div class="center">
   <?php echo form_open()?>
   <div class="dialog_title">
     <span id="action_title"><?php echo $title;?></span>
     <div class="close"></div>
   </div>
   <div class="dialog_body">
     <?php echo $action_view;?>
   </div>
   <div class="dialog_footer">
     <?php if($action) {?>
     <input type="button" name="dialog_submit" id="<?php echo $submit?>"  value="确   认" />
     <?php }?>
     <input type="button" name="dialog_cancel" id="dialog_cancel" value="<?php echo $action?'取   消':'知道了'?>" /> 
   </div>
   <?php echo form_close();?>
</div>
<?php if($browser=='not_ie6') {?>
<div class="right_border"></div>
<div class="leftbottom_corner"></div>
<div class="bottom_border"></div>
<div class="rightbottom_corner"></div>
<?php } else {?>
</div>
<?php }?>
</div>