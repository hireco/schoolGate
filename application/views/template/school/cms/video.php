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
            
      <div class="video_html">
      <?php 
        if($content['video_url']) { 
          if(ereg("\.(rmvb|rm|avi|wmv|mpg|wma)$",$content['video_url'])) echo '<object align=middle class=OBJECT classid=CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95 height=400 id=MediaPlayer width=600>
            <param name="ShowStatusBar" value="-1"> 
            <param name="Filename" value="'.$content['video_url'].'"> 
            <embed type="application/x-oleobject" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" filename="'.$content['video_url'].'" src="'.$content['video_url'].'" width="600" height="400"></embed> 
           </object> ';
          
          else if(ereg("\.(mp3)$",$content['video_url'])) echo '<object classid=clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA height=40 id=RAOCX name=rmplay width=280> 
            <param name="SRC" value="'.$content['video_url'].'"> 
            <param name="CONSOLE" value="Clip1"> 
            <param name="CONTROLS" value="imagewindow"> 
            <param name="AUTOSTART" value="true"> 
            <embed src="'.$content['video_url'].'" autostart="true" controls="ImageWindow" console="Clip1" pluginspage="http://www.real.com" width="280" height="40"> 
            </embed> 
           </object>';
          
          else if(ereg("\.(flv)$",$content['video_url'])) echo '<object type="application/x-shockwave-flash" data="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$content['video_url'].'</source><duration></duration><title></title><link></link></item></channel></vcastr>" width="600" height="400" id="vcastr3">
             <param name="movie" value="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$content['video_url'].'</source><duration></duration><title></title><link></link></item></channel><config><isLoadBegin>true</isLoadBegin><isAutoPlay>true</isAutoPlay></config></vcastr>" />
             <param name="allowFullScreen" value="false" />
           </object>';
          
          else  if(ereg("\.(swf)$",$content['video_url'])) echo '<embed src="'.$content['video_url'].'" allowFullScreen="true" quality="high" width="600" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
        }
        
        else if($content['video_html']) echo $content['video_html'];
      ?>
      </div>
      <div class="content">
      <?php echo $content['introduction'];?>
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
        <div class="heading">相关视频</div>
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
   $this->my_load->set_js_file('video');
   $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/video.js';
   $this->my_load->set_css_file('video');
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/video.css';
   $this->my_load->css_inc[]='skin/'.SKIN_NAME.'/css/comment.css';
?>
