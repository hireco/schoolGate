<div class="list_div">
   <table class="my_table">
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
       echo '<td>'.date('Y-m-d H:s',$value['post_time']).'</td>';
       echo '<td>'.$processed.'</td>';
       echo '<td><a id="entry_'.$value['guest_id'].'" class="view_guestbook" href="javascript:void(0);">点击</a></td>';
       echo '</tr>';
      }
     ?>
   </table>
   <span id="pagination_num" class="hide">10</span>
   <div id="pagination"></div>
</div>
<script type="text/javascript">
$(document).ready(function(){

	my_page(); //分页

	$('.view_guestbook').live('click',function(){

		var obj=$(this);
        var cur_id=$(this).attr('id').replace('entry_','');
        
        $.post(get_url(json_str.base_url+'user/guestbook/view'),{entry_id : cur_id},function(data){
			data=eval('(' + data + ')');
            if(data.result=='1') entry_viewer('show_entry',obj.offset().left-500,obj.offset().top+obj.height()+5,data.infor,'350');
            else top_message(data.infor);
		});
	});
});
</script>

