<?php
class Ads_model extends CI_Model
{
	var $ads_types=array(
	  'html'  => '自编超文本',
	  'image' => '图片模式',
	  'flash' => '动画媒体',	  
	  'script'=> '其他代码',
	  'mysql' => '数据库定制' 
	);
	
	var $mysql_items=array(
	  '1' => array(
	     'article', 
	     '资讯文章',	     
	     array('post_time'  => '发布时间','read_times' => '阅读次数','recommend'  => '推荐时间','top' => '置顶时间','headline'   => '头条显示'),
	     array('text' => '文本模式','image' => '图片模式')
	  ),
	  '2' => array(
	     'photo',
	     '图片新闻',	     
	     array('post_time'  => '发布时间','read_times' => '阅读次数','recommend'  => '推荐时间','top' => '置顶时间','headline'   => '头条显示'),
	     array('text' => '文本模式','image' => '图片模式')
	  ),
	  '3' => array(
	     'video', 
	     '视频新闻',	     
	     array('post_time'  => '发布时间','read_times' => '阅读次数','recommend'  => '推荐时间','top' => '置顶时间','headline'   => '头条显示'),
	     array('text' => '文本模式','image' => '图片模式')
	  ),
	   '4' => array(
	     'download', 
	     '下载内容',	     
	     array('post_time'  => '发布时间','read_times' => '阅读次数','recommend'  => '推荐时间','top' => '置顶时间','headline'   => '头条显示'),
	     array('text' => '文本模式','image' => '图片模式')
	  ),
	   '5' => array(
	     'class', 
	     '内容分类',	     
	     array('recommend'  => '推荐时间','class_priority' => '优先级','class_id'  => '建立时间'),
	     array('text' => '文本模式','image' => '图片模式')
	  )
	);

	function __construct() {
		parent::__construct();
		$this->load->library('Common');
	}
    
	function show_ads($setting_id=0) {
        
		$this->db->where('setting_id',$setting_id);
		$query=$this->db->get('add_ads_setting');
		if(!$query->num_rows()) return FALSE; 
		
		$data=$query->row_array();
		
		$ids=explode(',', $data['setting_value']);
        
		$direction=$data['direction']=='v'?'ads_vertical':'ads_horizonal';
		echo '<div class="'.$direction.'">';	
		
		foreach($ids as $index => $value) 
        $this->ads_viewer((int)$value);		
        
        if($direction=='ads_horizonal') echo '<div class="clear-both"></div>';
        echo '</div>';
	}
	
	function ads_viewer($id=0) {
		
		$ads_data=$this->get_ads($id);
		if(!$ads_data) return FALSE; 
		
		switch($ads_data['ads_type']) {
			case "html":
				$this->ads_html($ads_data);
				break;
				
			case "image":
				$this->ads_image($ads_data);
				break;

			case "flash":
				$this->ads_flash($ads_data);
				break;
				
			case "script":
				$this->ads_script($ads_data);
				break;

			case "mysql":
				$this->ads_mysql($ads_data);
				break;	
		}
	}
	
	function ads_html($data) {
		extract($data);
		echo '<div class="ads_wrapper" style="width:'.$ads_width.'px;'; 
		echo $ads_height?'height:'.$ads_height.'px':'';
		echo '">';
		echo '<div class="ads_title">'.$ads_title.'</div>';
		echo '<div class="ads_html">'.$ads_content.'</div>';
		echo '</div>';
	} 
	
	function ads_image($data) {
		extract($data);
		$ads_content=json_decode($ads_content,TRUE);
		echo '<div class="ads_wrapper" style="width:'.$ads_width.'px;'; 
		echo $ads_height?'height:'.$ads_height.'px':'';
		echo '">';
		echo '<div class="ads_image"><a href="'.$ads_content['image_link'].'"><img alt="'.$ads_title.'" src="'.$ads_content['ads_image'].'" /></a></div>';
		echo '</div>';
	}
	
	function ads_flash($data) {
		extract($data);
		echo '<div class="ads_wrapper" style="width:'.$ads_width.'px;'; 
		echo $ads_height?'height:'.$ads_height.'px':'';
		echo '">';
		echo '<div class="ads_flash">';
		echo '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="'.$ads_width.'" height="'.$ads_height.'">';  
        echo '<param name="movie" value="'.site_url($ads_content).'">';  
        echo '<param name="wmode" value="transparent">';  
        echo '<embed src="'.site_url($ads_content).'" width="'.$ads_width.'" height="'.$ads_height.'" type="application/x-shockwave-flash" />';  
        echo '</object>';
		echo '</div>';
		echo '</div>';
	}
	
	function ads_script($data) {
		extract($data);
		echo '<div class="ads_wrapper" style="width:'.$ads_width.'px;'; 
		echo $ads_height?'height:'.$ads_height.'px':'';
		echo '">';
		echo '<div class="ads_script">'.$ads_content.'</div>';
		echo '</div>';
	} 
	
	function ads_mysql($data) {
		extract($data);
		echo '<div class="ads_wrapper" style="width:'.$ads_width.'px;'; 
		echo $ads_height?'height:'.$ads_height.'px':'';
		echo '">';
		echo '<div class="ads_title">'.$ads_title.'</div>';
		echo '<div class="ads_mysql">'; 
		$this->mysql_ads_viewer($ads_content);
		echo '</div>';
		echo '</div>';
	}
	
	function ads_image_list($id) {
    	
    	$ads_data=$this->get_ads($id);
		if(!$ads_data) return FALSE;		
		if($ads_data['ads_type']!='mysql') return FALSE;
		
		$this->ads_mysql($ads_data);
    }
    
	function mysql_ads_viewer($ads_content) {
		$ads_content=json_decode($ads_content,TRUE);
		
		$direction=$ads_content['direction']?$ads_content['direction']:'v';
		$mode=$ads_content['mode'];		
		
		$table=$this->mysql_table($ads_content['table']);
		
		
		if($ads_content['where']!='') {
			$where=explode(',',$ads_content['where']);
			foreach($where as $index => $value) {
				$item=explode('=',$value);
				if($this->db->field_exists($item[0],$table['table'])) $this->db->where($item[0],$item[1]);
			}
		} 

		$this->db->order_by($ads_content['order_by'].' desc');
		$this->db->limit((int)$ads_content['num']);
				
		$this->db->where($table['where']);
		
		if($table['image'] && $mode=='image') $select=$table['image'].','.$table['title'].','.$table['id'];
		else $select=$table['title'].','.$table['id'];
		$this->db->select($select);
		
		$query=$this->db->get($table['table']);
		
		$data=$query->result_array();
		if($mode=='text' || !$table['image']) {
		  echo '<div class="text_list">';
		  foreach($data as $index => $value) {
			if($direction=='h') echo '<span class="inline-block text_box right_span">'; 
			else echo '<span class="block text_box">';
			echo '<a title="'.$value[$table['title']].'" href="'.site_url($table['view'].'/'.$value[$table['id']]).'">'.$value[$table['title']].'</a>';
			echo '</span>';
		  }
		  echo '</div>';
		}
		else if($mode=='image' && $table['image']) {
			$width=$ads_content['width']?$ads_content['width']:'';
		    $height=$ads_content['height']?$ads_content['height']:'';
		    
		    foreach($data as $index => $value) {
			  
		      $image=$this->get_thumbs_files($value[$table['image']],0);
		      	
		      if($direction=='h') echo '<span class="inline-block image_box"'; 
			  else echo '<span class="block image_box"';
			
			  echo 'style="';
			  echo $width?'width:'.$width.'px;':'';
		      echo $height?'height:'.$height.'px;':'';
		      echo '">';
			
			  echo '<span class="icon_span"';
			  echo 'style="';
			  echo $width?'width:'.($width-6).'px;':'';
		      echo $height?'height:'.($height-26).'px;':'';
		      echo '">';
		    
			  echo '<a class="thumb_wrapper" '; 
			  echo 'style="';
			  echo $width?'width:'.($width-6).'px;':'';
		      echo $height?'height:'.($height-26).'px;':'';
			  echo '" href="'.site_url($table['view'].'/'.$value[$table['id']]).'">'; 
		    
		      echo'<img '; 
			  echo 'style="';
		      echo $height?'height:'.($height-26).'px;':'';
		    
			   echo'" src="'.$image.'" /></a></span>';
			  echo '<span class="title_span"><a title="'.$value[$table['title']].'" href="'.site_url($table['view'].'/'.$value[$table['id']]).'">'.$value[$table['title']].'</a></span>';
			
			  echo '</span>';
		    }
		}
	}
	
	function mysql_table($table) {

		switch($table) {
			case "article":
			case "photo":
			case "video":
			case "download":
				$title='cms_title';
				$image='icon_image';
				$id="index_id";
				$view='cms/'.$table;				
				$where=array('model_id' => $this->myconfig->cms_model_id($table));
				$table='cms_index';
				break;
			case "class":
				$title='class_name';
				$image='icon_image';
				$id="class_id";
				$view='cms/list';				
				$where=array();
				$table='cms_class';
				break;
		}
		
		return array('title' => $title, 'image'=>$image, 'id' => $id,'view' => $view, 'table' => $table,'where' => $where);
	}
	
	function get_ads($id=0) {
		
		$this->db->where('ads_id',$id);
		$query=$this->db->get('add_ads');
		
		if($query->num_rows()) {
			$data=$query->row_array();
			return $data;
		}
		return FALSE;
	}
	
	function get_thumbs_files($photos,$single='') {
		
		$thumbs=array();
		
		if(strpos($photos, '::')===FALSE) {
		$photos=explode(':', $photos);			
			foreach ($photos as $index => $value) {
				if(strpos(basename($value), $this->config->item('thumb_prefix'))===FALSE)
				   $thumbs[$index]=str_replace(basename($value), $this->config->item('thumb_prefix').basename($value), $value);
				else  $thumbs[$index]=$value;  
			}
		}
		else {
		   $photos=explode('::', $photos);
		   $thumbs=explode(':', $photos[0]);
		}
		
		if($single==='') return  implode(':', $thumbs);
		else return $thumbs[abs((int)$single)];
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */