<?php if($viewer=='linker') {?>
<div class="form-group">
	<button class="btn btn-danger btn-block" id="amend_mine" href="javascript:void(0);">个人信息设置</button>
</div>
<div class="form-group">
	<button class="btn btn-warning btn-block" id="swfupload_linker" href="javascript:void(0);">上传静态网页包</button>
</div>
<div class="hide">
	<span id="swfupload_filesize" >10 MB</span>
	<span id="swfupload_filenum" >1</span>
	<span id="swfupload_button"><span class="selected">文件包</span></span>
	<span id="swfupload_filetype">WinZip文件包</span>
	<span id="swfupload_filetype_list">*.zip</span>
	<span id="dir_to"><?php echo $html_dir;?></span>
	<span id="upload_url">ajax/people_ajax/upload_zip</span>
</div>

<?php } else if($viewer=='form') {?> 

<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/swfupload.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url();?>js/swfupload/my/avatar_upload.js"></script>
<script type="text/javascript">
    var swfu;
    function intial_swfupload() {
        var settings = {
            flash_url : json_str.base_url+"js/swfupload/swfupload.swf",
            flash9_url : json_str.base_url+"js/swfupload/swfupload_fp9.swf",
            upload_url: json_str.base_url+"people_avatar/upload",
            post_params: {"PHPSESSID" : "<?php echo session_id(); ?>", "file_type" : "image"},

            // File Upload Settings
            file_size_limit : "200 KB",
            file_types : "*.jpg;*.png",
            file_types_description : "JPG Images; PNG Image",
            file_upload_limit : 0,

            custom_settings : {
                upload_target : "divFileProgressContainer",
                thumbnail_height: 300,
                thumbnail_width: 200,
                thumbnail_quality: 100,
                base_dir : json_str.base_url+"js/swfupload/",
                thumbnail_path: json_str.base_url+"people_avatar/thumbnail"
            },
            debug: false,

            // Button Settings
            button_image_url : json_str.base_url+"js/swfupload/SmallSpyGlassWithTransperancy_17x18.png",
            button_placeholder_id : "spanButtonPlaceholder",
            button_width: 180,
            button_height: 18,
            button_text : '<span class="button">点击选择图片 <span class="buttonSmall">(最大200KB)</span></span>',
            button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 13pt; } .buttonSmall { font-size: 12pt; }',
            button_text_top_padding: 0,
            button_text_left_padding: 18,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_cursor: SWFUpload.CURSOR.HAND,

            // The event handler functions are defined in imgupload.js
            swfupload_preload_handler : preLoad,
            swfupload_load_failed_handler : loadFailed,
            //file_dialog_start_handler : start_dialog,
            file_queue_error_handler : fileQueueError,
            file_dialog_complete_handler : fileDialogComplete,
            upload_progress_handler : uploadProgress,
            upload_error_handler : uploadError,
            upload_success_handler : uploadSuccess,
            upload_complete_handler :  function(){
                //default callback is uploadComplete
                $('#thumbnails img').addClass('img-thumbnail img-responsive');
                uploadComplete();
            },
        };
        swfu = new SWFUpload(settings);
    }

    $(document).ready(function(){
        var fls=flashChecker();

        if(!fls.f || parseInt(fls.v) < 15)  {
            $('#spanButtonPlaceholder').html('您的浏览器不支持flash,点击<a href="http://www.adobe.com/go/getflashplayer">此处</a>下载');
            top_message('浏览器不支持flash，请安装后再试！');
            return false;
        }

        else intial_swfupload();

    });
</script>

<div class="page_form">

    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">姓名</span>
            <input type="text" class="form-control  filled" name="cn_name" id="cn_name" disabled="disabled" value="<?php echo $cn_name;?>"  placeholder="请输入真实姓名" />
        </div>
    </div>
    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">英文名</span>
                <input type="text" class="form-control  filled" name="en_name" id="en_name" value="<?php echo $en_name;?>" placeholder="请输入英文名" />
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-danger <?php if($gender=='m')  echo 'active';?>">
                    <input  type="radio" name="gender"  value="m" <?php echo $gender=='m'?'checked="checked"':''; ?>  /> 男性
                </label>
                <label class="btn btn-danger <?php if($gender=='f')  echo 'active';?>">
                    <input  type="radio" name="gender"  value="f" <?php echo $gender=='f'?'checked="checked"':''; ?>  /> 女性
                </label>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">出生年</span>
                <select class="form-control" name="born_year" id="born_year">
                    <?php $cur=(int)date('Y',time()); for($i=15; $i<80;$i++) {
                        echo '<option value="'.($cur-$i).'"';
                        if($born_year==$cur-$i) echo ' selected="selected" ';
                        echo '>'.($cur-$i).'年</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-danger <?php if($hide_born_year=='1')  echo 'active';?>">
                    <input  type="radio" name="hide_born_year"  value="1" <?php echo $hide_born_year=='1'?'checked="checked"':''; ?>  /> 保密
                </label>
                <label class="btn btn-danger <?php if($hide_born_year=='0')  echo 'active';?>">
                    <input  type="radio" name="hide_born_year"  value="0" <?php echo $hide_born_year=='0'?'checked="checked"':''; ?>  /> 公开
                </label>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">电话</span>
                <input type="text" class="form-control filled" name="phone" id="phone" value="<?php echo $phone;?>" placeholder="请输入电话/手机号"/>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-danger <?php if($hide_phone=='1')  echo 'active';?>">
                    <input type="radio" name="hide_phone"  value="1" <?php echo $hide_phone=='1'?'checked="checked"':''; ?>  /> 保密
                </label>
                <label class="btn btn-danger <?php if($hide_phone=='0')  echo 'active';?>">
                    <input type="radio" name="hide_phone"  value="0" <?php echo $hide_phone=='0'?'checked="checked"':''; ?>  /> 公开
                </label>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">邮件</span>
                <input type="text" class="form-control filled" name="email" id="email" value="<?php echo $email;?>" placeholder="请输入个人邮箱" />
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="btn-group" data-toggle="buttons">
                <label class="btn btn-danger <?php if($hide_email=='1')  echo 'active';?>">
                    <input type="radio" value="1" name="hide_email" <?php echo $hide_email=='1'?'checked="checked"':''; ?> /> 保密
                </label>
                <label class="btn btn-danger <?php if($hide_email=='0')  echo 'active';?>">
                    <input type="radio" value="0" name="hide_email" <?php echo $hide_email=='0'?'checked="checked"':''; ?> />  公开
                </label>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">职位</span>
                <select class="form-control" name="title_id" id="title_id">
                    <?php foreach($this->people_model->cn_titles as $index => $value) {
                        echo '<option value="'.$index.'"';
                        if($title_id==$index) echo ' selected="selected" ';
                        echo '>'.$value.'</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="input-group">
                <span class="input-group-addon">学历</span>
                <select class="form-control" name="degree" id="degree">
                    <?php foreach($this->people_model->degrees as $index => $value) {
                        echo '<option value="'.$index.'"';
                        if($degree==$index) echo ' selected="selected" ';
                        echo '>'.$value.'</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">邮编</span>
            <input type="text" class="form-control  filled" name="zip_code" id="zip_code" value="<?php echo $zip_code;?>" placeholder="请输入邮政编码"/>
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">地址</span>
            <input type="text" class="form-control filled" name="office" id="office" value="<?php echo $office;?>" placeholder="请输入联系地址"/>
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">个人目录</span>
            <input type="text" class="form-control " name="html_dir" id="html_dir" <?php if($html_dir) echo 'disabled="disabled"';?> value="<?php echo $html_dir;?>" placeholder="请选择在本站的个人目录，不可更改"/>
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">个人站点</span>
            <input type="text" class="form-control" name="personal_site" id="personal_site" value="<?php echo $personal_site;?>"  placeholder="请输入个人站点地址"/>
        </div>
    </div>

    <div class="hide">
        <input type="hidden" name="avatar" id="avatar" value="<?php echo $avatar;?>" />
        <input type="hidden" name="people_id" id="people_id" value="<?php echo $people_id;?>" />
    </div>

    <div class="form-group">
        <div class="uploader_div" id="swfuploader_div">
            <form>
                <div class="swfupload_div">
                    <span id="spanButtonPlaceholder"></span>
                </div>
            </form>
            <div id="divFileProgressContainer" style="display:none;"></div>
        </div>
    </div>

    <div class="form-group row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">
            <div class="text-center" id="thumbnails">
                <img class="img-thumbnail img-responsive" src="<?php echo $avatar?$avatar:site_url('skin/images/no_image.jpg');?>" />
            </div>
        </div>
    </div>

    <div class="form-group">
        <button class="btn btn-default btn-block span_button" id="add_details">点击增加个性项目</button>
    </div>

    <div class="details_div">
        <?php
        if($details) {
            $details=explode('-ddd-',$details);
            $num=count($details);
            foreach($details as $index => $value) {
                $detail=explode('-bbb-',$value);
                ?>
                <div class="form-group detail_div">
                    <p><label class="index_no">项目<?php echo $index+1;?></label><span class="delete_item glyphicon glyphicon-remove" title="删除此条"></span></p>
                    <p><input type="text" class="form-control  filled detail_item" value="<?php echo $detail[0];?>" /></p>
                    <p><textarea rows="3" class="form-control filled detail_cont"><?php echo $detail[1];?></textarea></p>
                </div>
            <?php }
        }
        ?>
    </div>
	
    <div class="form-group">
        <button type="button"  class="btn btn-danger btn-block" name="people_submit"  id="people_submit">点击提交</button>
    </div>
    <div class="form-group">
        <button class="btn btn-default btn-block" id="people_cancel">取消</button>
    </div>
</div>

<div class="hidden for_details">
    <p><label class="index_no"></label><span class="delete_item glyphicon glyphicon-remove" title="删除此条"></span></p>
    <p><input type="text" class="form-control  filled detail_item" value="" placeholder="请输入项目名称" /></p>
    <p><textarea  rows="3" class="form-control medium_enterarea filled detail_cont" placeholder="请输入详细内容,请注意换行哦。"></textarea></p>
</div>

<script>
    $(function(){

        $('#add_details').on('click',add_detail_form);
        $('.details_div').on('click','.delete_item',function(){
            $(this).closest('.detail_div').remove();

            $('.index_no').each(function(i){
                var cur_no=i+1;
                $(this).text('项目'+cur_no);
            });
        });
        $("#people_cancel").on('click', function() {
            $('#edit_panel').remove();
            $('#view_panel').slideDown();
        });

        $('#personal_site').on('change',function(){
            if(!url_check($(this).val())) {
                top_message('请输入包含http://的完整网址!');
                $(this).val('');
            }
        });

        $('#email').on('change',function(){
            if(!email_check($(this).val())) {
                top_message('请输入正确的电子邮件地址!');
                $(this).val('');
            }
        });

        $('#cn_name').on('change',function(){
            if(!chinese_check($(this).val())) {
                top_message('请输入中文姓名!');
                $(this).val('');
            }
        });

        $('#html_dir').on('change',function(){
            $.post(get_url(json_str.base_url+'ajax/people_ajax/chk_html_dir'),{html_dir: $('#html_dir').val()},function(data){
                data = eval('(' + data + ')');
                if(data.result=='0') {
                    top_message(data.infor);
                    $('#html_dir').val('');
                }
                else $('#personal_site').val(json_str.base_url+'public_html/'+$('#html_dir').val());
            });

        });

        $('.page_form :input:not(textarea,#en_name)').on('keyup',function(){
            if($.trim($(this).val()).length!=$(this).val().length) {
                top_message('不能输入空格！');
                $(this).val('');
            }
        });

        $("#people_submit").on('click', function() {

            if($(this).hasClass('disabled')) return false;

            var inputs = [],details=[];
            var data, flag = 1;

            $('.page_form :input').not(':radio').each(function() {
                if ($(this).val() == '' && $(this).hasClass('filled')) {
                    top_message($(this).attr('placeholder'));
                    set_style($(this),'error');
                    flag = 0;
                    return false;
                }
                else remove_style($(this));

                if(!$(this).hasClass('detail_item') && !$(this).hasClass('detail_cont')) inputs.push(this.name + '=' + escape(this.value));
            });

            if (!flag)	return false;

            data = inputs.join('&');

            data=data+'&gender='+$('[name="gender"]:checked').val()+'&hide_phone='+$('[name="hide_phone"]:checked').val()+'&hide_email='+$('[name="hide_email"]:checked').val()+'&hide_born_year='+$('[name="hide_born_year"]:checked').val();

            if($('.detail_div').length) {
                $('.detail_div .detail_item').each(function(i){
                    details.push(escape($(this).val()+'-bbb-'+$('.detail_div .detail_cont').eq(i).val()));
                });
                data=data+'&details='+details.join('-ddd-');
            }

            $.ajax({
                type : 'post',
                data : data,
                url : get_url(json_str.base_url + 'people/edit/submit'),
                beforeSend: function() {
                    $('#people_submit').addClass('disabled');
                    ajax_sending();
                },
                complete:function() {
                    ajax_complete();
                },
                success : function(data, textStatus) {
                    try {
                        data = eval('(' + data + ')');
                        if(data.result =='1') spin_update('success');
                        else {
                            spin_update('error');
                            $('#people_submit').removeClass('disabled');
                        }
                        ajax_success(data, textStatus, data.url, 'json');
                    } catch (err) {
                        spin_update('error');
                        $('#people_submit').removeClass('disabled');
                        ajax_success(data.infor, textStatus, 'current', 'string');
                    }
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    spin_update('error');
                    $('#people_submit').removeClass('disabled');
                    ajax_failed(textStatus);
                }
            });
        });
    })
</script>

<?php } ?>

