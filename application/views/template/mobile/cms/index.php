<div class="row my_box_nav">
<?php
$class_list=$this->myquery->cms_class_list(15,0);

foreach ($class_list as $index => $value) {
$class_id=$value['class_id'];
$class_attrs=$this->cms_function->get_attrs($class_id);
$class_name=$class_attrs['class_name'];
$class_name_en=$class_attrs['class_name_en'];
?>
    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-8">
        <div class="box_linker" style="background-color: red">
            <a href="<?php echo site_url('cms/'.$class_name_en);?>">
                <h1><span class="glyphicon glyphicon-list"></span></h1>
                <h5><?php echo $class_name;?></h5>
            </a>
        </div>
    </div>
<?php } ?>
</div>
<script>
    $(window).load (function(){
            $('body').addClass('darkred');
        }
    );
</script>
