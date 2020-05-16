<div class="body">
  <div class="page_navi">您的位置：<a href="<?php echo base_url();?>">首页</a><?php echo $this->cms_function->get_current_path($index['class_id'],'video');?> &gt; <?php echo $index['cms_title']?></div>
  <div class="page_div" id="mainbar" >
    <div class="title"><?php echo $index['cms_title']?></div>
    <div class="infors">
      <span class="time">时间：<?php echo date('Y-m-d H:i:s',$index['post_time']);?></span>
      <span class="author">编辑：<?php echo $index['cms_writer'];?></span>
      <span class="source">来源：<?php echo $index['cms_source'];?></span>
    </div>
    <?php if($content['content_id']) {?>
            
      <div class="content">
       <?php echo strip_tags($content['introduction'])?$content['introduction']:'暂无介绍';?>
      </div>
      
	  <div class="file_list">
	  <?php 
	     
	     $file_path=explode(':',$content['file_path']);	
	     $file_title=explode(':',$content['file_title']);	
	     
		 echo '<div class="filenum">相关下载，共计'.count($file_path).'个文件</div>';
		 echo '<div class="file_entry"><span class="filetype">文件名</span><span>大小</span></div>';
		 foreach($file_path as $file_index => $file_value) {
			 
			 $backimg=site_url('skin/admin/fileicons/'.strtolower($this->my_file->file_extend($file_value)).'.png');
			 $filepath=common::myurlcode($file_value); 
			 $filename=common::myurlcode($file_title[$file_index]);
			 
			 echo '<div class="file_entry">'; 
			 echo '<span class="filetype"><a title="'.$file_title[$file_index].'" style="background-image:url('.$backimg.')" href="'.site_url('myfile/download/'.$filepath.'/'.$filename).'">'.$file_title[$file_index].'</a></span>'; 
			 echo '<span>'.round(filesize($file_value)/1024,1).' k</span>';
			 echo'</div>';
		 }
	  ?>
	  </div>

      <input type="hidden" id="entry_id" value="<?php echo $index['index_id'];?>" />
      <input type="hidden" id="class_id" value="<?php echo $index['class_id'];?>"  />
      
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
        <div class="heading">相关下载</div>
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
     <?php }
     } else $this->functions->msg4nullcontent();?>
  </div>
  <div class="page_div" id="sidebar">
	 
     <?php echo $this->cms_function->show_navi($index['class_id']);?>
	 <?php $this->ads_model->show_ads(32);?>
  </div>
 <div class="clear-both"></div>  
</div>
<?php 
   $this->my_load->set_js_file('download');
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/download.js';
   $this->my_load->set_css_file('download');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/download.css';
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/comment.css';
?>
