<ol class="breadcrumb nav_path">
    <li><a href="<?php echo base_url();?>">首页</a></li>
    <li><?php echo $cn_group;?></li>
</ol>

<div class="panel panel-default">
  <div class="panel-heading">
      <?php echo $cn_group;?>
  </div>
  <div class="panel-body">
      <?php
      $entry_list=$this->myquery->html_list(0,$group_id);
      $entry_list=array_slice($entry_list,($page_id-1)*$per_page_num,$per_page_num);

      foreach ($entry_list as $index => $value) {
          ?>
          <a href="<?php echo site_url('html/'.$value['en_title']);?>">
              <h4 class="item_title"><?php echo $value['cn_title'];?></h4>
          </a>
      <?php } ?>
  </div>
</div>

<?php
echo '<ul class="pagination">';
if($pages > 1)  for($i=1;$i<=$pages;$i++) {
   if($i==1 || $i==$pages || abs($i-$page_id)<4) { 
	  echo '<li'; 
	  if($i==$page_id) echo ' class="active" ';
	  echo '><a href="'.site_url('html/list/'.$group.'/'.$i).'">'.$i.'</a></li>';
   }
}
echo '</ul>';
?>
