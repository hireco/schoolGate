<!DOCTYPE html>
<html lang="zh-CN">
<head>

    <?php
    $this->my_load->css_inc[]='bower/toastr/toastr.min.css';
    $this->my_load->css_inc[]='bower/iOS-Overlay-gh-pages/css/iosOverlay.css';

    $this->my_load->js_inc_t[]='bower/toastr/toastr.min.js';
    $this->my_load->js_inc_t[]='bower/iOS-Overlay-gh-pages/js/iosOverlay.js';
    $this->my_load->js_inc_t[]='bower/iOS-Overlay-gh-pages/js/spin.min.js';
    $this->my_load->js_inc_t[]='bower/blockui-master/jquery.blockUI.js';
    $this->my_load->js_inc_t[]='js/jsfunction.js';
    $this->my_load->js_inc_t[]='js/template/'.SKIN_NAME.'/common-front.js';

    //$header=$this->my_load->view(isset($header)?$header:'header','',TRUE);
    $body=$this->my_load->view(isset($body)?$body:'body','',TRUE);
    $footer=$this->my_load->view(isset($footer)?$footer:'footer','',TRUE);
    $this->my_load->view('meta');
    ?>
    <script>
        $(function(){
            
			var myStorageVersion = '20200320';
			
			if(myStorageVersion != localStorage.getItem('myStorageVersion')) {
				localStorage.clear();
				localStorage.setItem('myStorageVersion',myStorageVersion);
			}
			
			var navs = localStorage.getItem('navs');
			if(navs) {
				$('#main_nav').html(navs);
				mySlideMenu();
			}
			else $.get(get_url('ajax/header_ajax/leftMenu'),function(data){
				localStorage.setItem('navs',data);
				$('#main_nav').html(data);
				mySlideMenu();
			});
        });
		
		function mySlideMenu() {
			var slideout = new Slideout({
                'panel': document.getElementById('main_body'),
                'menu': document.getElementById('main_nav'),
                'padding': 180,
                'tolerance': 70
            });

            // Toggle button
            $('.toggle-button').click(function() {
                slideout.toggle();
            });
		}
    </script>

</head>
<body>


<nav id="main_nav"></nav>

<div id="main_body">
    <div class="container-fluid">
        <div class="body_header">
            <span class="toggle-button">☰</span>
            <a href="<?php echo base_url(); ?>" class="back-home"><span class="glyphicon glyphicon-home"></span></a>
        </div>
        <?php echo $body;?>
        <?php echo $footer;?>
    </div>
</div>

<?php $this->my_load->output_js('b');?>

</body>
</html>