<div class="visible-xs alert alert-info alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>左右滑动以查看表格
</div>
<div class="table-responsive">
    <table class="table table-striped table-hover">
        <tr>
            <td class="first type">所属分类</td>
            <td class="first object_title">内容标题</td>
            <td class="first post_time">发布时间</td>
        </tr>
        <?php foreach ($entry_list as $index => $value) {

            $table=$this->myconfig->cms_model($value['model_id'],'table');
            $cur_class=$this->cms_function->get_attr($value['class_id'],'class_name');
            $cur_class_en= $this->cms_function->get_attr($value['class_id'],'class_name_en');

            echo '<tr class="my_entries">';
            echo '<td><a target="_blank" title="'.$cur_class.'" class="entry_class" href="'.site_url('cms/'.$cur_class_en).'">['.$this->str_func->cn_substr($cur_class,4).']</a></td>';
            echo '<td><a target="_blank" title="'.$value['cms_title'].'" class="entry_self" href="'.site_url($table.'/'.$value['cms_title_en']).'">'.$value['cms_title'].'</a></td>';
            echo '<td>'.date('y-m-d',$value['post_time']).'</td>';
            echo '</tr>';
        }
        ?>
    </table>
</div>

<span id="pagination_num" class="hide">20</span>
<div id="pagination"></div>

<script type="text/javascript">
$(document).ready(function(){
	my_page(); //分页	
});
</script>

