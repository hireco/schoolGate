<ol class="breadcrumb nav_path">
	<li><a href="<?php echo base_url();?>">首页</a></li>
	<?php echo $this->cms_function->get_current_path($index['class_id']);?>
</ol>

<div class="page-header cms_title">
	<h4><?php echo $index['cms_title']?></h4>
</div>

<div class="cms_content">
	<?php echo strip_tags($content['introduction'])?$content['introduction']:'暂无介绍';?>
</div>

<?php

$file_path=explode(':',$content['file_path']);
$file_title=explode(':',$content['file_title']);

echo '<div class="filenum">相关下载，共计'.count($file_path).'个文件</div>';
foreach($file_path as $file_index => $file_value) {

	$backimg=site_url('skin/admin/fileicons/'.strtolower($this->my_file->file_extend($file_value)).'.png');
	$filepath=common::myurlcode($file_value);
	$filename=common::myurlcode($file_title[$file_index]);

	echo '<div class="file_entry"><img src="'.$backimg.'"> <a title="'.$file_title[$file_index].'" href="'.site_url('myfile/download/'.$filepath.'/'.$filename).'">'.$file_title[$file_index].'</a></div>';
}
?>

 <hr>

<ul class="list-unstyled cms-info-list">
    <li>时间：<?php echo date('Y-m-d H:i:s',$index['post_time'])?></li>
    <li>点击：<?php echo $index['read_times']?>次</li>
	<li>标签：<?php  $tags=explode(',',str_replace('，',',',$index['cms_keywords'])); foreach($tags as $index => $value) {
	     echo '<span class="label label-default">'.$value.'</span> ';
	}?>
	</li>
</ul>
