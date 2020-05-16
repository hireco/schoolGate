<div class="row my_box_nav"></div>
<?php
$this->my_load->set_css_file('index');
$this->my_load->set_js_file('index');
$this->my_load->js_ins_t[] = <<<EOF
<script>
    $(function(){
		
		$('body').addClass('darkred');
		
		var boxs = localStorage.getItem('boxs');
		
		if(boxs) {
			$('.my_box_nav').html(boxs);
			set_log_state();
		}
		else $.get(get_url('ajax/header_ajax/boxMenu'),function(data){
			localStorage.setItem('boxs',data);
			$('.my_box_nav').html(data);
			set_log_state();
		});
    });
</script>
EOF;
?>