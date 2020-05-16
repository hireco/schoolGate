<ol class="breadcrumb nav_path">
    <li><a href="<?php echo base_url();?>">首页</a></li>
    <li><a href="<?php echo site_url('people');?>">师资队伍</a></li>
    <li><a href="<?php echo site_url('people/list/'.$this->people_model->titles[$people['title_id']]);?>"><?php echo $this->people_model->cn_titles[$people['title_id']]?></a></li>
    <span class="glyphicon glyphicon-user right_bar"></span>
</ol>

<div id="view_panel">
    <div class="panel panel-warning">
        <div class="panel-heading">
            <h3 class="panel-title"><?php echo $people['cn_name']?></h3>
        </div>
        <div class="panel-body">
            <div class="row avatar-wrapper">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">
                    <img class="avatar img-thumbnail img-responsive" src="<?php echo $people['avatar']?$people['avatar']:site_url('skin/mobile/images/de_avatar.jpg');?>" />
                </div>
            </div>
            <div class="info_list text-warning">
                <?php
                $email_str=$people['email']?common::myurlcode($people['email']):'';
                $phone_str=$people['phone']?common::myurlcode($people['phone']):'';
                ?>
                <div class="item_list"><span class="item_title">姓名：</span><span class="item_value"><?php echo $people['cn_name'].'('.$people['en_name'].')'; ?></span></div>
                <div class="item_list"><span class="item_title">性别：</span><span class="item_value"><?php echo $people['gender']?($people['gender']=='m'?'男':'女'):''; ?></span></div>

                <?php if($people['hide_born_year']=='0') {?>
                    <div class="item_list"><span class="item_title">年龄：</span><span class="item_value"><?php $cur_year=(int)date('Y',time()); echo $people['born_year']?$cur_year-$people['born_year']:'';?></span></div>
                <?php } ?>

                <div class="item_list"><span class="item_title">类别：</span><span class="item_value"><?php echo $this->people_model->cn_titles[$people['title_id']]?></span></div>
                <div class="item_list"><span class="item_title">学位：</span><span class="item_value"><?php echo $this->people_model->degrees[$people['degree']];?></span></div>

                <?php if($people['hide_phone']=='0') {?>
                    <div class="item_list item_img"><span class="item_title">电话：</span><span class="item_value"><?php echo $phone_str?'<img src="'.site_url('image/string_image/'.$phone_str).'" />':''; ?></span></div>
                <?php } if($people['hide_email']=='0') {?>
                    <div class="item_list item_img"><span class="item_title">邮件：</span><span class="item_value"><?php echo $email_str?'<img src="'.site_url('image/string_image/'.$email_str).'" />':''; ?></span></div>
                <?php } ?>

                <div class="item_list"><span class="item_title">邮编：</span><span class="item_value"><?php echo $people['zip_code'];?></span></div>
                <div class="item_list"><span class="item_title">地址：</span><span title="<?php echo $people['office'];?>" class="item_value"><?php echo my_limiter($people['office'],30);?></span></div>
                <div class="item_list"><span class="item_title">站点：</span><span class="item_value"><?php echo $people['personal_site']?'<a title="'.$people['personal_site'].'" class="item_value" href="'.$people['personal_site'].'" target="_blank">'.my_limiter($people['personal_site'] , 30).'</a>':'';?></span></div>
            </div>

        </div>
    </div>

    <div class="details_list">
        <?php
        $details=$people['details'];
        if(isset($details) && $details) {
            $details=explode('-ddd-',$details);
            foreach($details as $index => $value) {
                $detail=explode('-bbb-',$value);
                ?>
                <div class="panel panel-warning">
                    <div class="panel-heading"><?php echo $detail[0]?></div>
                    <div class="panel-body"><?php echo nl2br(strip_tags($detail[1]));?></div>
                </div>
            <?php }
        }
        ?>
    </div>

    <input type="hidden" id="people_id" value="<?php echo $people['people_id'];?>" />
    <script>
	  $(document).ready(function(){
		   $.post(get_url(json_str.base_url+'ajax/people_ajax/add_editor_link'),{people_id: $('#people_id').val()},function(data){
			   
			   $('#people_id').after(data);
			   
			   $('#amend_mine').one('click',function(){

					if($(this).hasClass('disabled')) return false;

					$.ajax({
						type: 'post',
						url:  get_url(json_str.base_url+'people/edit'),
						data: 'people_id='+$('#people_id').val(),
						beforeSend: function() {
							$('#amend_mine').addClass('disabled');
							ajax_sending();
						},
						complete:function() {
							ajax_complete();
						},
						success: function(data,textStatus){
							try{
								data=eval('(' + data + ')');
								if(data.result=='1') {
									$('#view_panel').slideUp('fast',function(){
										$('#amend_mine').removeClass('disabled');
										$('#view_panel').after('<div id="edit_panel"></div>');
										$('#edit_panel').html(data.infor);
									});
								}
								else {
									spin_update('error');
									$('#amend_mine').removeClass('disabled');
									ajax_success(data,textStatus,'current','json');
								}
							}
							catch(err){
								spin_update('error');
								$('#amend_mine').removeClass('disabled');
								ajax_success('操作失败，请重试！',textStatus,'','string');
							}
						},
						error:function(textStatus) {
							spin_update('error');
							$('#amend_mine').removeClass('disabled');
							ajax_failed(textStatus);
						}
					});
				});
		
				$('#swfupload_linker').one('click',open_swfupload);
			
		   });
		});
	
	</script>
</div>

<?php
$this->my_load->set_js_file('people');
$this->my_load->js_inc_t[]='js/jquery-ui-v1.11.4.js';
$this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/people.js';
$this->my_load->set_css_file('people_view');
$this->my_load->css_inc[]='js/swfupload/swfupload.css';
?>

<script>
    $(function(){
        $('.item_img').each(function(){
            if($(this).find('img').length) $(this).css('background-image','url('+$(this).find('img').attr('src')+')');
            else $(this).removeClass('item_img');
        });
    })
</script>
