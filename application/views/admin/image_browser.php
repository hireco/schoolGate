<script>
    $(function () {
        var styles = [
            'js/swfupload/swfupload.css',
            'js/swipebox-master/css/swipebox.min.css'
        ];
        for (var i = 0; i < 2; i++)
            addcss2head(styles[i])

        $('.close_panel').click(function () {
            $('#image_browser_panel').remove();
            unblock_all();
        })
    })
</script>

<?php
$scripts = array(
    'js/jquery.contextmenu.r2.js',
    'js/pagination/jquery.pagination.js',
    'js/bubblepopup/jquery.bubblepopup.v2.3.1.min.js',
    'js/swipebox-master/js/jquery.swipebox.min.js',
    'js/masonry/masonry.pkgd.min.js',
    'js/imagesloaded/imagesloaded.pkgd.min.js',
    'js/admin/myjquery-filemanager.js',
);

foreach ($scripts as $script)
    echo '<script src="' . site_url($script) . '"></script>';
?>

<div class="panel_header">

    <div class="close_panel"></div>
    <div class="horizon_navi">
        <ul>
            <li id="dir_mode" data-mode="dir">
                <a href="javascript:void(0)"><span class="horizon_items">文件列表</span></a>
            </li>
            <li id="thumb_mode" data-mode="thumb">
                <a href="javascript:void(0);"><span class="horizon_items">图片列表</span></a>
            </li>
            <li id="return_root">
                <a href="javascript:return_root();"><span class="horizon_items">根目录</span></a>
            </li>
            <li id="return_upper" class="hide">
                <a href="javascript:return_upper();"><span class="horizon_items">上级目录</span></a>
            </li>
            <li id="upload_link">
                <a href="javascript:void(0)"><span id="upload_menu" class="horizon_items">上传文件</span></a>
            </li>
        </ul>
        <div class="clear_both"></div>
        <?php
        $data= array(
            'mylist' => array('address','delete'),
            'context_menu_id' => 'album_context_menu'
        );
        $this->load->view('pannel/context_menu',$data);
        ?>
    </div>
</div>

<div class="panel_body">

    <div class="pathInfoBox"><div class="cur_dir" id="dir_to"><?php echo $cur_dir; ?></div></div>
    <div id="myclist_div"><?php echo $clist; ?></div>
    <div class="clear_both"></div>

</div>

<div class="hide">
    <?php foreach ($this->config->item('upload_type_class') as $index => $value) {
        $types = array();
        foreach ($value as $index_i => $value_i) $types[$index_i] = '*.' . $value_i;
        echo '<span id="' . $index . '_types_list">' . implode(';', $types) . '</span>';
    }
    ?>
    <span id="file_type_selected"></span>
</div>

<div id="hide_for_upload_menu" class="hide">
    <div class="upload_file_type">
        <?php
        foreach ($this->config->item('upload_type_class') as $index => $value)
            echo '<span id="' . $index . '_file_type" class="select">' . lang_value($index . '_file') . '</span>';
        ?>
    </div>
</div>



