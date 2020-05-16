<ol class="breadcrumb nav_path">
    <li><a href="<?php echo base_url();?>">首页</a></li>
    <li><a href="<?php echo site_url('people');?>">师资队伍</a></li>
    <?php if($title_id)  {
        $group_id =$this->people_model->group_of_title[$title_id];
        $people_group_cn = $this->people_model->groups[$group_id][0];
        echo '<li><a href="'.site_url('people/group/'.$group_id).'">'.$people_group_cn.'</a></li>';
        echo '<li>'.$people_title_cn.'</li>';
    } ?>
    <span class="glyphicon glyphicon-user right_bar"></span>
</ol>

<ul class="nav nav-tabs people_group">
    <?
    if(!$title_id) {
        echo '<li class="dropdown active">';
        echo '<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" >所有分类 <span class="caret"></span></a>';
        echo '<ul class="dropdown-menu">';
        foreach ($this->people_model->groups as $index => $value) {
            echo '<li><a href="'.site_url('people/group/' . $index).'">' . $this->people_model->groups[$index][0] . '</a></li>';
        }
        echo '</ul>';
        echo '</li>';
    }
    else foreach($this->people_model->groups[$group_id][1] as $index => $value) {
            echo '<li';
            if($title_id == $value) echo ' class="active" ';
            echo '><a href="'.site_url('people/list/'.$this->people_model->titles[$value]).'">'.$this->people_model->cn_titles[$value].'</a></li>';
        }
    ?>
</ul>

<div class="people_list">
    <?php
    if(count($people)) {
        echo '<ul class="ucfirst_list nav nav-pills collapse">';
        for($i=65;$i<91;$i++)
            echo '<li><a href="#'.chr($i).'_list">'.chr($i).'</a></li>';
        echo '</ul>';
        echo ' <div id="people_list">';
        foreach ($people as $index => $value) {
            echo '<span class="person_link hide"><a class="'.substr(ucfirst($value['en_id']),0,1).'" href="'.site_url('people/'.$value['en_id']).'">'.$value['cn_name'].'</a></span>';
        }
        echo '</div>';
    }
    else {
        echo '<div class="bg-info text-info"><span class="glyphicon glyphicon-unchecked"></span> 该分类暂无人员</div>';
    }
    ?>
</div>

<?php
$this->my_load->set_js_file('people');
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/people.js';
$this->my_load->set_css_file('people_list');
?>
