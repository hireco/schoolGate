<DIV id=flipper_div align=center></DIV>
<? $this->my_load->js_ins_t[]='<script type="text/javascript" src="'.base_url().'js/flash/sinaflash.js"></script>'; ?>
<script type="text/javascript">
var fp_data = new Array();

<?php 
   foreach ($thumbs as $index => $value) 
     echo 'fp_data.push(["'.$value.'","'.$links[$index].'"]);';
     $num=$num%2==0?($num/2):($num+1)/2  
?>
var fp_pics="",fp_links="";
var fp_lens = fp_data.length;
for(var i=0; i<fp_lens; i++){
	fp_pics += fp_data[i][0];
	fp_links += escape(fp_data[i][1]);
	if(i%2==0 && i!=fp_lens-1){
		fp_pics += "§";
		fp_links += "§";
	}else if(i%2==1 && i!=fp_lens-1){
		fp_pics += "§_§";
		fp_links += "§_§";
	}
}

var oswf = new sinaFlash("<?php echo base_url();?>js/flash/flipper_v2.swf", "flipper", <?php echo $width;?>, <?php echo $height;?>, "<?php echo $num;?>", "#FFFFFF", false, "High");
oswf.addParam("allowScriptAccess", "always");
oswf.addParam("menu", "false");
oswf.addParam("wmode", "opaque");
oswf.addParam("scale", "noscale");
oswf.addVariable("pic_width", "<?php echo $img_width;?>");
oswf.addVariable("pic_height", "<?php echo $img_height;?>");
oswf.addVariable("colnum", "<?php echo $num;?>");
oswf.addVariable("hspace", "<?php echo $hspace;?>");
oswf.addVariable("vspace", "<?php echo $vspace;?>");
oswf.addVariable("flip_time", "200");
oswf.addVariable("pause_time", "2000");
oswf.addVariable("pics", fp_pics);
oswf.addVariable("urls", fp_links);
oswf.addVariable("rand", "0");
oswf.write("flipper_div");
</script>
