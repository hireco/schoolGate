<?php if($viewer=='comment') {?>
  <div class="entry_content">
    <?php echo strip_tags($comment_content); ?> 
  </div>
<?php } else if($viewer=='guestbook') {?>
  <div class="entry_content">
    <?php echo strip_tags($guest_content);?>
  </div>
  <div class="reply_heading">留言的回复：</div>
  <div class="reply_list">
    <?php 
      if($replies) { 
      	foreach($replies as $index => $value) {
          echo '<div class="reply">'.$value['guest_content'].'</div>'; 
          echo '<div class="small_gray">'.date('Y-m-d H:i:s',$value['post_time']).'</div>';
          echo '<div class="small_gray">By '.$this->check->get_user_nickname($value['user_id'],'user').'<div>';
          echo '<hr />';
      	}
      }
      else echo '暂无回复'; 
    ?>
  </div>
<?php } ?>