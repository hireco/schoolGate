<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <a href="<?php echo site_url('cms');?>">新闻信息</a><?php echo $this->cms_function->get_current_path($index['class_id'],'photo');?> &gt; <?php echo $index['cms_title']?></div>
  <div class="page_div" id="cms_black" >
    <div class="title"><?php echo $index['cms_title']?></div>
    <div class="infors">
      <span class="time">时间：<?php echo date('Y-m-d H:i:s',$index['post_time']);?></span>
      <span class="author">编辑：<?php echo $index['cms_writer'];?></span>
      <span class="source">来源：<?php echo $index['cms_source'];?></span>
    </div>
    <div class="content"><?php echo $content['introduction']?strip_tags($content['introduction']):'暂无内容'; ?></div>
    <span class="line"></span>    
    <?php
       if($content['photo_list']) {
         
    	 $photo_list=explode(':',$content['photo_list']);
         $photo_title=explode(':',$content['photo_title']);
         echo '<div class="hide">';
         foreach ($photo_list as $index_i => $value_i) echo '<span class="imglist"><span class="imgsrc">'.$value_i.'</span><span class="imgtext">'.$photo_title[$index_i].'</span></span>';  
         echo '</div>';
    ?>     
         <div class="album">
          <div class="left"><span id="fullsize_icon" title="点击看全图"></span></div>
          <div class="right"></div>
          <div class="image_loader"></div>
          <div class="image"></div>
          <span class="photo_title"></span>
         </div>
    <?php 
       } else echo $this->functions->msg4nullcontent();
    ?>
    
    <input type="hidden" id="entry_id" value="<?php echo $index['index_id'];?>" />
    <input type="hidden" id="class_id" value="<?php echo $index['class_id'];?>"  />
    <input type="hidden" id="page_id"  value="<?php echo $page_id;?>" />
    
    <?php 
      if($this->myconfig->item('photo_page_mode')=='server'&& $content['pages']>1) {
          echo '<div class="page_navigation" id="server_page">';
          for($i=1;$i<=$content['pages'];$i++) {
         	echo '<a href="'.site_url('photo/view/'.$index['index_id'].'/'.$i).'"';
         	if($i==$page_id) echo 'class="current"';
         	echo '>'.$i.'</a>';
          }
          echo '</div>';
      }
      else echo '<div class="page_navigation" id="client_page"></div>';
    ?>
    <div class="entry_use">
        <hr />
        <?php  $this->my_load->view('cms/share_this');?>
        <span id="show_comment_form">评论</span>
        <span>打印</span>
        <span>收藏</span>
        <span>推荐</span>
        <span>举报</span>
     </div>
    <div class="relate_list">
       <div class="heading">相关图片</div>
       <span class="line"></span>
       <ul class="list_body list_body_ajax"></ul>
    </div>
    <div class="entry_parameters">
      <span>点击数：<?php echo $index['read_times']?>次</span>
      <span>TAG：<?php echo str_replace(',',' ',$index['cms_keywords'])?></span>
    </div>    
  </div>
   <?php if($index['comments']=='1' && $this->myconfig->item('open_comment')) {?>
   <div class="page_div" id="cms_white">
      <div class="comment_form"></div>
      <div class="comment_list"></div>    
   </div>
   <?php }?>
</div>
<?php 
   $this->my_load->set_js_file('photo');
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/photo.js';
   $this->my_load->set_css_file('photo');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/photo.css';
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/comment.css';
?>
