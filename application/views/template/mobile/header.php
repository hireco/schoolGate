<?php
if($this->myconfig->item('navigation') && $this->navi_model->has_navi('mb-main'))
	$this->navi_model->show_navi_group('mb-main',12);
else
	$this->navi_model->show_navi_group('default');
?>
