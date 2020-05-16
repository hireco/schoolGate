<div class="visible-xs alert alert-info alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>左右滑动以查看表格
</div>
<div class="table-responsive">
    <table class="table table-striped table-hover">
        <tr>
            <td class="first object_title">主题</td>
            <td class="first post_time">发布时间</td>
            <td class="first view">查看</td>
        </tr>
        <?php foreach ($entry_list as $index => $value) {

            $object_title=$this->functions->get_object_title($value['object_type'],$value['object_id']);
            $object_link=site_url('cms/'.$value['object_type'].'/'.$value['object_id']);

            echo '<tr class="my_entries">';
            echo '<td>'.($object_title?'<a target="_blank" href="'.$object_link.'">'.$object_title.'</a>':'<strike>原主题已被删除！</strike>').'</td>';
            echo '<td>'.date('y-m-d',$value['post_time']).'</td>';
            echo '<td><a id="entry_'.$value['comment_id'].'" class="view_comment"  href="javascript:void(0);" tabindex="0" role="button" data-trigger="focus"  data-container="body" data-toggle="popover" data-placement="left"
      data-content="'.strip_tags($value['comment_content']).'"><span class="glyphicon glyphicon-expand"></span></a></td>';
            echo '</tr>';
        }
        ?>
    </table>
</div>

<span id="pagination_num" class="hide">10</span>
<div id="pagination"></div>

<script type="text/javascript">
$(document).ready(function(){

    $("[data-toggle='popover']").popover();
    my_page(); //分页

});
</script>

