<ol class="breadcrumb nav_path">
    <li><a href="<?php echo base_url();?>">首页</a></li>
    <?php echo $this->cms_function->get_current_path($index['class_id']);?>
</ol>

<div class="page-header cms_title">
    <h4><?php echo $index['cms_title']?></h4>
</div>

<div class="cms_content">
            
      <div class="video_html embed-responsive embed-responsive-4by3">
      <?php 
        if($content['video_url']) { 
          if(ereg("\.(rmvb|rm|avi|wmv|mpg|wma)$",$content['video_url'])) echo '<object  class="embed-responsive-item" align=middle class=OBJECT classid=CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95 height=400 id=MediaPlayer width=600>
            <param name="ShowStatusBar" value="-1"> 
            <param name="Filename" value="'.$content['video_url'].'"> 
            <embed type="application/x-oleobject" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" filename="'.$content['video_url'].'" src="'.$content['video_url'].'" width="600" height="400"></embed> 
           </object> ';
          
          else if(ereg("\.(mp3)$",$content['video_url'])) echo '<object  class="embed-responsive-item" classid=clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA height=40 id=RAOCX name=rmplay width=280>
            <param name="SRC" value="'.$content['video_url'].'"> 
            <param name="CONSOLE" value="Clip1"> 
            <param name="CONTROLS" value="imagewindow"> 
            <param name="AUTOSTART" value="true"> 
            <embed  class="embed-responsive-item" src="'.$content['video_url'].'" autostart="true" controls="ImageWindow" console="Clip1" pluginspage="http://www.real.com" width="280" height="40">
            </embed> 
           </object>';
          
          else if(ereg("\.(flv)$",$content['video_url'])) echo '<object  class="embed-responsive-item" type="application/x-shockwave-flash" data="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$content['video_url'].'</source><duration></duration><title></title><link></link></item></channel></vcastr>" width="600" height="400" id="vcastr3">
             <param name="movie" value="'.base_url().'vcastr/vcastr3.swf?xml=<vcastr><channel><item><source>'.$content['video_url'].'</source><duration></duration><title></title><link></link></item></channel><config><isLoadBegin>true</isLoadBegin><isAutoPlay>true</isAutoPlay></config></vcastr>" />
             <param name="allowFullScreen" value="false" />
           </object>';
          
          else  if(ereg("\.(swf)$",$content['video_url'])) echo '<embed src="'.$content['video_url'].'" allowFullScreen="true" quality="high" width="600" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
        }
        
        else if($content['video_html']) echo $content['video_html'];
      ?>
      </div>

      <p>
      <?php echo $content['introduction'];?>
      </p>

</div>

<hr>
<ul class="list-unstyled cms-info-list">
    <li>时间：<?php echo date('Y-m-d H:i:s',$index['post_time'])?></li>
    <li>点击：<?php echo $index['read_times']?>次</li>
	<li>标签：<?php  $tags=explode(',',str_replace('，',',',$index['cms_keywords'])); foreach($tags as $index => $value) {
	     echo '<span class="label label-danger">'.$value.'</span> ';
	}?>
	</li>
</ul>
<?php
$this->my_load->css_ins[]=<<<EOF
<style>
    body{
        background-color: #6d0000;
        color:#e2b8bb;;
    }
    .page-header{
        border-bottom-color:#e2b8bb;
    }
    hr {
        border:0;
        background-color:#e2b8bb;
        height:1px;
    }
</style>
EOF;
?>
      
      