<div class="visible-xs alert alert-info alert-dismissable">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>左右滑动以查看表格
</div>
<div class="table-responsive">
    <table class="table table-striped table-hover">
        <tr>
            <td class="first type">分类</td>
            <td class="first type">子类</td>
            <td class="first object_title">留言主题</td>
            <td class="first post_time">发布时间</td>
            <td class="first state">状态</td>
            <td class="first view">查看</td>
        </tr>
        <?php foreach ($entry_list as $index => $value) {

            $processed=$value['processed']=='1'?'已处理':'未处理';

            echo '<tr class="my_entries">';
            echo '<td>'.$value['top_type'].'</td>';
            echo '<td>'.$value['sub_type'].'</td>';
            echo '<td>'.$value['guest_topic'].'</td>';
            echo '<td>'.date('y-m-d',$value['post_time']).'</td>';
            echo '<td>'.$processed.'</td>';
            echo '<td><a id="entry_'.$value['guest_id'].'" class="view_guestbook" href="javascript:void(0);"tabindex="0" role="button" data-trigger="focus"  data-container="body" data-toggle="popover" data-placement="left"
      data-content="'.strip_tags($value['guest_content']).'"><span class="glyphicon glyphicon-expand"></span></a></td>';
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

