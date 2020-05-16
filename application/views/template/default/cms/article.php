<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a> &gt; <a href="<?php echo site_url('cms');?>">新闻信息</a><?php echo $this->cms_function->get_current_path($index['class_id'],'article');?> &gt; <?php echo $index['cms_title']?></div>
  <div class="page_div" id="cms_left" >
    <div class="title"><?php echo $index['cms_title']?></div>
    <div class="infors">
      <span class="time">时间：<?php echo date('Y-m-d H:i:s',$index['post_time']);?></span>
      <span class="author">编辑：<?php echo $index['cms_writer'];?></span>
      <span class="source">来源：<?php echo $index['cms_source'];?></span>
    </div>
    <div class="content">
     <?php echo $content['article_body']?$content['article_body']:$this->functions->msg4nullcontent(); ?>
    </div>
    
    <input type="hidden" id="entry_id" value="<?php echo $index['index_id'];?>" />
    <input type="hidden" id="class_id" value="<?php echo $index['class_id'];?>"  />
    <input type="hidden" id="page_id"  value="<?php echo $page_id;?>" />
    
    <?php 
      if($this->myconfig->item('article_page_mode')=='server' && $content['pages']>1) {
          echo '<div class="page_navigation" id="server_page">';
          for($i=1;$i<=$content['pages'];$i++) {
         	echo '<a href="'.site_url('cms/article/view/'.$index['index_id'].'/'.$i).'"';
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
       <div class="heading">相关资讯</div>
       <hr />
       <ul class="list_body list_body_ajax"></ul>
    </div>
    <div class="entry_parameters">
      <span>点击数：<?php echo $index['read_times']?>次</span>
      <span>TAG：<?php echo str_replace(',',' ',$index['cms_keywords'])?></span>
    </div>
    <?php if($index['comments']=='1' && $this->myconfig->item('open_comment')) {?> 
      <div class="comment_form"></div>
      <div class="comment_list"></div>
    <?php }?>
  </div>
  <div class="page_div" id="cms_right">
    
    <?php echo $this->cms_function->show_navi($index['class_id']);?>
    <?php $this->ads_model->show_ads(31);?>
  </div> 
 <div class="clear-both"></div>
</div>
<?php
  $this->my_load->set_js_file('article');
  $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/article.js'; 
  $this->my_load->set_css_file('article');
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/article.css';
  $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/comment.css';
?>
