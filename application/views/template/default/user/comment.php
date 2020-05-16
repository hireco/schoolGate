<div class="list_div">
   <table class="my_table">
     <tr>
       <td class="first object_title">评论主题</td>
       <td class="first post_time">发布时间</td>
       <td class="first view">查看</td>
     </tr>
     <?php foreach ($entry_list as $index => $value) {
       
       $object_title=$this->functions->get_object_title($value['object_type'],$value['object_id']);
       $object_link=site_url('cms/'.$value['object_type'].'/'.$value['object_id']);
       
       echo '<tr class="my_entries">';
       echo '<td>'.($object_title?'<a target="_blank" href="'.$object_link.'">'.$object_title.'</a>':'<strike>原主题已被删除！</strike>').'</td>';
       echo '<td>'.date('Y-m-d H:s',$value['post_time']).'</td>';
       echo '<td><a id="entry_'.$value['comment_id'].'" class="view_comment" href="javascript:void(0);">点击</a></td>';
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

	$('.view_comment').live('click',function(){

		var obj=$(this);
        var cur_id=$(this).attr('id').replace('entry_','');
        
        $.post(get_url(json_str.base_url+'user/comment/view'),{entry_id : cur_id},function(data){
			data=eval('(' + data + ')');
            if(data.result=='1') entry_viewer('show_entry',obj.offset().left-500,obj.offset().top+obj.height()+5,data.infor,'350');
            else top_message(data.infor);
		});
	});
});
</script>

