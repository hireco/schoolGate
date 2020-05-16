<?php if($viewer=='form') {?>
<div class="comment_heading">发表评论</div>
<hr class="comment_hr" />
<div id="my_comment_form">
<div class="textarea_div">
<div class="post_state"><?php echo $this->myconfig->item('post_state');?></div>
<input type="hidden" name="object_id" id="object_id"  value="<?php echo $object_id;?>" />
<input type="hidden" name="object_type" id="object_type"  value="<?php echo $object_type;?>" />
<input type="hidden" name="parent_id" id="parent_id"  value="<?php echo $parent_id;?>" />
<div class="textarea_bg"></div>
<textarea class="filled" name="comment_content" id="comment_content"></textarea>
</div>
<div class="button_div">
 <img alt="点击刷新" id="comment_captcha_img" class="captcha_img" src="<?php echo base_url();?>captcha/captcha.php" />
 <span class="captcha_div"><input type="text" class="text filled" id="comment_captcha" name="comment_captcha"  /></span>
 <label class="button" id="comment_submit">点击提交</label>
</div>
</div>
<?php } else if($viewer=='list') {?>
<script type="text/javascript" src="<?php echo base_url();?>js/pagination/jquery.pagination.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url().'js/template/'.SKIN_NAME;?>/comment.js" charset="utf-8"></script>
<div class="comment_heading">评论列表</div>
<hr class="comment_hr" />
<span id="pagination_num" class="hide">8</span>
<input type="hidden" class="for_id"    value="<?php echo $object_id;?>" />
<input type="hidden" class="for_type"  value="<?php echo $object_type;?>" />
<div id="pagination"></div>
<div class="comment_list_body">
<?php 
 if(!count($comments)) echo '暂无相关评论';
 else foreach ($comments as $index => $value) {
  	$poster=!$value['user_id']?'游客':($value['nick_name']?$value['nick_name']:$this->config->item('default_nickname'));
    echo '<div class="comment_entry" id="comment_'.$value['comment_id'].'">';
    echo '<div class="hide comment_parent_id">'.$value['parent_id'].'</div>';
    echo '<div class="entry_title"><span>#'.($index+1).'</span><span>'.$poster.'</span><span class="date">时间： '.date('Y-m-d H:i:s',$value['post_time']).'</span><span>IP：'.$this->str_func->ip_show($value['post_ip']).'</span><span class="reply_comment">回复</span></div>';
    echo '<div class="entry_body">'.$this->str_func->text_filter($value['comment_content']).'</div>'; 
    echo '</div>';
 } 
?>
</div>
<?php }?>