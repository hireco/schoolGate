<script type="text/javascript" src="<?php echo base_url();?>js/color_picker/syronex-colorpicker.js" charset="utf-8"></script>
<div id="syronex-color_container" style="clear:both;"></div>
<script>
$(document).ready(function(){
	addcss2head('js/color_picker/syronex-colorpicker.css');
});

function showColorPicker(obj) {
    $('#syronex-color_container').colorPicker(
		{			
		   defaultColor:3, // index of the default color
		   columns:15,     // number of columns 
		   click:function(color){
		   $('#'+obj).val(color);
		}
	});
}

</script>