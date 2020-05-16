<?php if($viewer=='index') {?>
    <div id="workplace_inner">
        <div class="horizon_navi">
            <ul>
                <li id="dir_mode" data-mode="dir"><a href="javascript:void(0)"><span class="horizon_items">文件列表</span></a></li>
                <li id="thumb_mode" data-mode="thumb"><a href="javascript:void(0);"><span class="horizon_items">图片列表</span></a></li>
                <li id="return_root"><a href="javascript:return_root();"><span class="horizon_items">根目录</span></a></li>
                <li id="return_upper" class="hide"><a href="javascript:return_upper();"><span class="horizon_items">上级目录</span></a></li>
                <li id="upload_link"><a href="javascript:void(0)"><span id="upload_menu" class="horizon_items">上传文件</span></a></li>
            </ul>
            <div class="clear_both"></div>
            <div class="horizon_navi_bar">
                <div class="cur_dir" id="dir_to"><?php echo $cur_dir;?></div>
            </div>
            <?php
            $data= array(
                'mylist' => array('address','delete'),
                'context_menu_id' => 'album_context_menu'
            );

            $this->load->view('pannel/context_menu',$data);
            ?>
        </div>
        <div id="myclist_div"><?php echo $clist;?></div>
        <div class="hide">
            <?php foreach ($this->config->item('upload_type_class') as $index => $value) {
                $types=array();
                foreach ($value as $index_i =>  $value_i) $types[$index_i]='*.'.$value_i;
                echo '<span id="'.$index.'_types_list">'.implode(';', $types).'</span>';
            }
            ?>
            <span id="file_type_selected"></span>
        </div>

        <div id="hide_for_upload_menu" class="hide">
            <div class="upload_file_type">
                <?php
                foreach ($this->config->item('upload_type_class') as $index => $value)
                    echo '<span id="'.$index.'_file_type" class="select">'.lang_value($index.'_file').'</span>';
                ?>
            </div>
        </div>

    </div>
<?php } else {
    if ($viewer == 'dir') { ?>
        <div class="dirlist">
            <?php
            foreach ($sub_dirs as $index => $value) {
                if (is_dir($dir . '/' . $value)) {
                    echo '<div class="page_list_item list_dir">';
                    echo '<span class="dir_path hide">' . $dir . '/' . $value . '</span>';
                    echo '<span class="file_name" title="' . $value . '">' . my_limiter($value, 8) . '</span>';
                    echo '</div>';
                    echo "\n";
                } else if ($this->my_file->is_upload_files($value)) {
                    $backimg = site_url('skin/admin/fileicons/' . strtolower($this->my_file->file_extend($value)) . '.png');
                    echo '<div id="file_' . $index . '" class="page_list_item list_file" style="background-image:url(' . $backimg . ')">';
                    echo '<span class="file_name" title="' . $value . '">' . $value . '</span>';
                    echo '<span class="file_size">' . ceil(filesize($dir . '/' . $value) / 1024) . 'K</span>';
                    echo '</div>';
                    echo "\n";
                }
            }
            ?>
            <div class="clear_both"></div>
        </div>
    <?php } else if ($viewer == 'thumb') { ?>
        <script>
            $(function () {
                if($('.page_list_item').length) {
                    $('.swipebox').swipebox();
                }
            })
        </script>
        <div id="masonry-container" class="js-masonry thumblist"
             data-masonry-options='{ "columnWidth": ".list_thumb", "itemSelector": ".list_thumb" }'>
            <?php
            foreach ($sub_dirs as $index => $value) {
                if (is_dir($dir . '/' . $value)) {
                    echo '<div class="page_list_item list_thumb list_dir">';
                    echo '<span class="dir_path hide">' . $dir . '/' . $value . '</span>';
                    echo '<img src="' . site_url('skin/admin/images/folder.png') . '">';
                    echo '<span class="file_name" title="' . $value . '">' . my_limiter($value, 8) . '</span>';
                    echo '</div>';
                    echo "\n";
                } else if ($this->my_file->is_img($value)) {
                    list($h, $w) = getimagesize($dir . '/' . $value);
                    $backimg = site_url('skin/admin/fileicons/' . strtolower($this->my_file->file_extend($value)) . '.png');
                    echo '<div id="file_' . $index . '" class="page_list_item list_thumb list_file';
                    if (substr($value, 0, 1) == 't')
                        echo ' croped ';
                    else
                        echo ' origin ';
                    echo '">';
                    echo '<a href="' . site_url($dir . '/' . $value) . '" class="swipebox"><img src="' . site_url($dir . '/' . $value) . '"></a>';
                    echo '<span class="file_name" title="' . $value . '">' . $value . '</span>';
                    echo '<span class="file_size">' . $w . 'x' . $h . '/' . ceil(filesize($dir . '/' . $value) / 1024) . 'k</span>';
                    if ($select) echo '<span class="select_it">选择</span>';
                    echo '</div>';
                    echo "\n";
                }
            }
            ?>
            <div class="clear_both"></div>
        </div>

    <?php } ?>
    <div id="pagination"></div>

    <div id="root" class="hide"><?php echo $root; ?></div>
    <div id="cur_dir" class="hide"><?php echo $dir; ?></div>
    <span id="pagination_num" class="hide">30</span>
    <input type="hidden" id="mode" value="<?php echo $viewer; ?>">
    <input type="hidden" id="select" value="<?php echo $select; ?>">

<?php } ?>

