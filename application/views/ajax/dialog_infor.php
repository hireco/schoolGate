<div class="form_item">
  <div class="infor <?php echo $infor_type; ?>">
    <?php 
     echo $action; 
     if($object) 
     echo '[<span class="emphasis">'.$object.'</span>]';
    ?>
  </div>
  <div class="main_infor">
     <?php echo $main_infor; ?>
  </div>  
</div>
