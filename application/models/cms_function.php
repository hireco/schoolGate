<?php

//functions for front end cms handle

class Cms_function extends CI_Model
{	
	var $photo_model=0;

	function __construct() {
		parent::__construct();
		$this->load->model('functions');  
		$this->photo_model=$this->myconfig->cms_model_id('photo');
	}
    
	function get_cms_attr($index_id=0) {
		$this->db->where('index_id',$index_id);
		$this->db->limit(1);
		$query=$this->db->get('cms_index');

		if($query->num_rows()) {
			return $data=$query->row_array();
		}
		else return false;
	}

	function index_by_en_title($cms_title_en) {
	 	
		$this->db->limit(1);
		$this->db->select('index_id');
		$this->db->where('cms_title_en', $cms_title_en);
		$query=$this->db->get('cms_index');
		
		if($query->num_rows) {
		    $row=$query->row_array();
			return $row['index_id'];
		}
	    else return 0;
	}

	function class_by_en_name($class_name_en) {
	 	
		$this->db->limit(1);
		$this->db->select('class_id');
		$this->db->where('class_name_en', $class_name_en);
		$query=$this->db->get('cms_class');
		
		if($query->num_rows) {
		    $row=$query->row_array();
			return $row['class_id'];
		}
	    else return 0;
	}
	
	function get_attrs($class_id=0) {
		$this->db->where('class_id',$class_id);
		$this->db->limit(1);
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0];
		}
		else return false;
	}


	function get_attr($class_id=0,$attr='class_id') {
		$this->db->where('class_id',$class_id);
		$this->db->limit(1);
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0][$attr];
		}
		else return ($class_id==0 && $attr=='class_name')?'根分类':'';
	}

	function get_current_path($class_id) {
		if($class_id==0) return '';

		$cur_attrs=$this->get_attrs($class_id);
		$cur_name=$cur_attrs['class_name'];
		$cur_name_en=$cur_attrs['class_name_en'];
		$cur_parent=$cur_attrs['parent_id'];

		$this_path=site_url('cms/'.$cur_name_en);

		$data = array(
			'this_path'=> $this_path,
			'cur_name' => $cur_name
		);
		$cur_path = $this->my_load->view('pannel/class_path',$data,true);

		if($cur_parent==0) return $cur_path;
			
		else {
			$this->db->where('class_id',$cur_parent);
			$this->db->select('class_id');
			$query=$this->db->get('cms_class');
			if($query->num_rows()) {
				$rows=$query->result_array();
				$new_id=$rows[0]['class_id'];
				return $this->get_current_path($new_id).$cur_path;
			}
			else return $cur_path;
		}
	}
	

	function ultimate_parent($class_id,$class_level=1) {
	
		 $this->db->where('class_id',$class_id);
		 $query=$this->db->get('cms_class');

		 if($query->num_rows()) {
		     $row=$query->row_array();
			 if($row['class_level']==$class_level) return $class_id;
			 else return $this->ultimate_parent($row['parent_id'],$class_level);
		 }
		 else return 0;
	}

	function show_navi($class_id) {

		$class_attrs=$this->get_attrs($class_id);
		if(!$class_attrs || ($class_attrs['class_hide']=='1' && !$this->check->admin_is_logged())) return FALSE;
		
		$class_level=$class_attrs['class_level']>2?$class_attrs['class_level']-2:1;
		$ultimate_parent=$this->ultimate_parent($class_id,$class_level);

		$navi=$this->mysql->row('cms_class',array('class_id' => $ultimate_parent));
		if(!$navi) return false;

		if(!$this->check->admin_is_logged()) $this->db->where('class_hide','0');
		$this->db->order_by('class_priority asc, recommend desc');
		$navi_list=$this->mysql->rows('cms_class',array('parent_id' => $navi['class_id']));
		
		$data['top_title']=$navi['class_name'];

		$data['navi_list']=$navi_list;
		$data['current_id']=$class_id; 		

		return  $this->my_load->view('pannel/class_navi',$data,TRUE);
	}

	function get_article_pages($content, $page=1){
		$page = $page ? intval($page) : 1;
		$article = array(
        'info' => array(),  
        'pages' => 1  
		);
		if(!empty($content)){
			$pattern  = "/<div style=\"page-break-after: alway(.+)\"><span style=\"(display|DISPLAY):\s*none\">(.+)<\/span><\/div>/"; 
            $contents = preg_split($pattern, $content, -1, PREG_SPLIT_NO_EMPTY); 
			$article['pages'] = count($contents);
			if($page > $article['pages']) $page = $article['pages'];
			$article['info'] = $contents[$page - 1];
		}
		return $article;
	}

	function cms_seo_setting($description,$keywords) {

		$description=$description?$description.$this->myconfig->item('description'):$this->myconfig->item('description');
		$keywords=$keywords?$keywords.$this->myconfig->item('keywords'):$this->myconfig->item('keywords');

		$meta = array(
		array('name' => 'robots', 'content' => 'no-cache'),
		array('name' => 'description', 'content' => $description),
		array('name' => 'keywords', 'content' => $keywords),
		array('name' => 'Content-Language', 'content' => $this->config->item('language'), 'type' => 'equiv'),
		array('name' => 'Content-type', 'content' => 'text/html; charset='.$this->config->item('charset'), 'type' => 'equiv')
		);

		return $meta;
	}

	function text_filter(&$text) {
		$text=str_replace('>', '&gt;', $text);
		$text=str_replace('<', '&lt;', $text);
		$text=nl2br($text);
		return $text;
	}

	function chk_view_right($id) {
		
		$cur_user_level=$this->session->userdata('user_level');

		$this->db->where('index_id', $id);
		$this->db->select('view_right');
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
			$rows=$query->result_array();
			$view_right=$rows[0]['view_right'];

			if($view_right < $cur_user_level ) {
				if($cur_user_level >= 4.0)  redirect('login');
			    else  $this->functions->show_msg('对不起，您无权查看该栏目！');
			}
			else return TRUE;
		}
		else return FALSE;
	}
	
	function video_class4navi() {
		$model_id=$this->myconfig->cms_model_id('video');
		
		$this->db->limit(5);
        $this->db->like('model_id',$model_id);
        $this->db->where('parent_id',0);
        $this->db->order_by('recommend desc');
        $this->db->select('class_name,class_id');
        $query=$this->db->get('cms_class');
        
        return $rows=$query->result_array();
        
	}

	function get_navi_title($navi_id=0) {
		$this->db->where('navi_id',$navi_id);
		$this->db->limit(1);
		$query=$this->db->get('add_navigation');

		if($query->num_rows()) {
			$data=$query->result_array();
			return $data[0]['navi_title'];
		}
		else return '';
	}
	
	function has_sub_class($class_id) {
		
		if(!$this->check->admin_is_logged()) $this->db->where('class_hide','0');
		$this->db->where('parent_id',$class_id);
		$query=$this->db->get('cms_class');
		if($query->num_rows()) return TRUE;
		else return FALSE;
	}

	function sub_class_list($class_id) {
		
		$children='';
		$temp=array();

		if(!$this->check->admin_is_logged()) $this->db->where('class_hide','0');
		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority asc');
		$query=$this->db->get('cms_class');
		if($query->num_rows()) {
		    $rows=$query->result_array();
			foreach($rows as $index => $value) {
				$temp[]=$value['class_id'];
				$children=$this->sub_class_list($value['class_id']);
				if($children) $temp[]=$children;
			}
			
			$children = implode(',',$temp);
			return $children;
		}

		else return '';
	}
    
	function first_child($class_id) {
	    
		if(!$this->check->admin_is_logged()) $this->db->where('class_hide','0');
		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority asc');
		$query=$this->db->get('cms_class');
		
		if($query->num_rows()) {
			$row=$query->row_array();
			return $row['class_id'];
		}
		else return '';
	}

	function cms_list_of_id($class_id,$num=0,$order_by='top desc, post_time desc') {
     	
		$sub_classes=array();

		if(!(int)$class_id) show_404();

		$data['class_id']=$class_id; 

		$cms_class=$this->get_attrs($class_id);
		$data['class_name']= $cms_class['class_name'];
		$data['class_name_en']=$cms_class['class_name_en'];

		if($this->has_sub_class($class_id))  $sub_classes=explode(',',$this->sub_class_list($class_id));
		array_push($sub_classes,$class_id);		

		$this->db->where_in('class_id',$sub_classes);
		if($num) $this->db->limit($num);		
		$this->db->order_by($order_by);		
		$query=$this->db->get('cms_index');
		
		return $query->result_array();
		
	}
	
	function cms_list($class_id,$page_id=1,$template='cms_list') {
     	
		$cur_user_level=$this->session->userdata('user_level');

		if(!(int)$class_id) show_404();

		$cms_class=$this->get_attrs($class_id);

		if($cms_class['view_right'] < $cur_user_level)	 {
			if($cur_user_level >= 4.0)  redirect('login');
			else  $this->functions->show_msg('对不起，您无权查看该栏目！');
		}

		if(!$cms_class || ($cms_class['class_hide']=='1' && !$this->check->admin_is_logged())) $this->functions->show_msg('栏目不存在！');
		
		if(!in_array($cms_class['index_page'],array('children','first'))) { 
			return $this->html_page($cms_class['index_page'],$class_id);
		}

		if($cms_class['list_mode']=='t') $template='cms_list_by_thumb';
		
		$sub_classes=array();
		
		if($this->has_sub_class($class_id)) {
		   if($cms_class['index_page']=='children')	  $sub_classes=explode(',',$this->sub_class_list($class_id));
		   else return $this->cms_list($this->first_child($class_id));
		}
		   
		array_push($sub_classes,$class_id);

		if($cms_class['refer_class']) {
			$sub_classes=array_unique(array_merge($sub_classes,explode(',',$cms_class['refer_class']))); 
			//加入引用类
		}

		$data['class_id']=$class_id; 
		$data['class_name']= $cms_class['class_name'];
		$data['class_name_en']=$cms_class['class_name_en'];
		$data['class_level']=$cms_class['class_level'];

		$data['page_id']=$page_id<1?1:(int)$page_id;
		$data['per_page_num']=$this->myconfig->item('cms_per_page_num');

		$data['sub_classes']=$sub_classes;

		$data['rows']=$this->myquery->total_cms('',0,$sub_classes);
        
		if($data['rows']) {
			$data['pages']=(int)($data['rows']/$data['per_page_num']);
			$data['pages']=($data['rows']%$data['per_page_num'])?($data['pages']+1):$data['pages'];
			//获取记录总数
			if($data['pages'] < $data['page_id']) $this->functions->show_msg('页面不存在！');
		}
		else {
			$data['pages']=0;
			$data['page_id']=0;
		}

		$data['title']=$this->get_attr($class_id,'class_name');
		
		$data['body']='cms/'.$template;
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}

	function cms_view($index_id=0,$page_id=1) {

		$cms=$this->get_cms_attr($index_id);
		
		if($cms) {
			$table=$this->myconfig->cms_model($cms['model_id'],'table');
			$method='cms_'.$table;
			$this->$method($index_id,$page_id);
		}
		else $this->functions->show_msg('文章不存在！');
	}
	
	function cms_article($index_id=0,$page_id=1) {
		
		$this->chk_view_right($index_id);

		if(!$this->check->admin_is_logged()) $this->db->where('hide','0'); 
		$this->db->where('index_id', $index_id);
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
			
			$data=$this->index_data($query,__FUNCTION__);

			$this->db->where('index_id',$index_id);
			$query=$this->db->get('cms_article');
			if($query->num_rows()) {
				
				$data['content']=$query->row_array();
				$data['content']['pages']=1;
				$data['page_id']=$page_id<1?1:(int)$page_id;

				if($this->myconfig->item('article_page_mode')=='server') {
					$article=$this->get_article_pages($data['content']['article_body'],$data['page_id']);
					$data['content']['article_body']=$article['info'];
					$data['content']['pages']=$article['pages'];
				}

				if($data['content']['pages'] < $data['page_id']) $this->functions->show_msg('页面不存在！');
			}
			else $data['content']['article_body']='';
		}
			
		else $this->functions->show_msg('文章不存在！');
		
		$data['body']='cms/article';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}
	
	function cms_photo($index_id=0,$page_id=1) {

		$this->chk_view_right($index_id);
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('index_id', $index_id);
		$query=$this->db->get('cms_index');
		if($query->num_rows()) {
			
			$data=$this->index_data($query,__FUNCTION__);
			
			$this->db->where('index_id',$index_id);
			$query=$this->db->get('cms_photo');
			if($query->num_rows()) {
				
				$data['content']=$query->row_array();
				$data['content']['pages']=1;
				$data['page_id']=$page_id<1?1:(int)$page_id;
				
				if($this->myconfig->item('photo_page_mode')=='server') {
					$photos=explode(':',$data['content']['photo_list']);
					$titles=explode(':',$data['content']['photo_title']);
					$data['content']['pages']=count($photos);
						
					if($data['content']['pages'] < $data['page_id']) $this->functions->show_msg('页面不存在！');
					else {
						$data['content']['photo_list']=$photos[$data['page_id']-1];
						$data['content']['photo_title']=$titles[$data['page_id']-1];
					}
				}
			}
			else $data['content']['photo_list']='';
		}
	  
		else $this->functions->show_msg('相册不存在！');

		
		$data['body']='cms/photo';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));

		$this->load->view('index',$data);
	}
	
	function cms_video($index_id=0,$page_id=0) {
		
		$this->chk_view_right($index_id);
		
	    if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('index_id', $index_id);
	    $query=$this->db->get('cms_index');
	    if($query->num_rows()) {	    	
	    	
	    	$data=$this->index_data($query,__FUNCTION__);
			
	    	$this->db->where('index_id',$index_id);
	    	$query=$this->db->get('cms_video');
	    	if($query->num_rows()) {
	    		
	    		$data['content']=$query->row_array();
	    	}
	    	else $data['content']['content_id']='';
	    }
	    
	    else $this->functions->show_msg('视频不存在！');
		
	    $data['body']='cms/video';
		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
		
		$this->load->view('index',$data);
	}

	function cms_download($index_id=0,$page_id=0) {
		
		$this->chk_view_right($index_id);
		
	    if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('index_id', $index_id);
	    $query=$this->db->get('cms_index');
	    if($query->num_rows()) {	    	
	    	
	    	$data=$this->index_data($query,__FUNCTION__);
			
	    	$this->db->where('index_id',$index_id);
	    	$query=$this->db->get('cms_download');
	    	if($query->num_rows()) {
	    		
	    		$data['content']=$query->row_array();
	    	}
	    	else $data['content']['content_id']='';
	    }
	    
	    else $this->functions->show_msg('下载内容不存在！');
		
		switch($data['content']['show_mode']){
		case 'g' :
			$data['body']='cms/download';
		    $data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
			$this->load->view('index',$data);
		    
			break;

		case 'd' :
			$this->load->helper('download'); 
		    $filename=explode(':',$data['content']['file_title']);
			$filepath=explode(':',$data['content']['file_path']); 
			$filepath=$filepath[0]; 
			$fileext=Common::fileext($filepath);
			$filename=$filename[0].'.'.$fileext;

		    force_download($filename, file_get_contents($filepath));

		    break;

		default:
			
		    break;
		}
	}

	private function html_page($html_id,$class_id) {
		
		if(!$this->check->admin_is_logged()) $this->db->where('hide','0');
		$this->db->where('html_id',$html_id);
	    $query=$this->db->get('add_html');
	    if($query->num_rows()) { 
	    	$row=$query->row_array();
	    	if($row['full_page']=='1') echo $row['html_content'];
	    	else {
	    	    $data=$row;
		        $data['class_id']=$class_id;

				$data['title']=$row['cn_title'];
	    		
	    		$data['body']='html/html_page';
	    		$data['js']=array(site_url('myjavascript/index').'/?version='.$this->config->item('js_version'));
	    		$this->load->view('index',$data);
	    	}
	    }
	    else $this->functions->show_msg('该页面不存在！');
	}

	private function index_data($query,$type) {
	    
		$data['index']=$query->row_array();
			
		$cur_model=	'cms_'.$this->myconfig->cms_model($data['index']['model_id'],'table');
		if($cur_model != $type)  $this->functions->show_msg('内容不存在！');

		if($data['index']['jump_url']) {
			redirect($data['index']['jump_url']);
		}

		$data['meta']=$this->cms_seo_setting($data['index']['cms_description'],$data['index']['cms_keywords']);
		$data['title']=$data['index']['cms_title'];

		//do not need share data for the current share tool used.
		
//		$data['share'] = array(
//		  'url' => site_url('cms/view/'.$data['index']['index_id']),
//		  'title' => $data['index']['cms_title'],
//		  'summary' => $data['index']['cms_description'],
//		  'pic' => site_url($data['index']['icon_image']?$data['index']['icon_image']:'skin/mobile/images/webIcon-128.png')
//		);
			
		$this->db->where('index_id',$data['index']['index_id']);
		$this->db->update('cms_index',array('read_times' => 1+$data['index']['read_times']));

		return $data;
	
	}

	function title_style($title_color,$title_strong) {
	    
		$style=$title_color?'color: '.$title_color.';':'';
		$style.=$title_strong?'font-weight: bold;':'';	
		$style=$style?'style="'.$style.'"':'';

		return $style;
	}
	
	function get_my_classes() {

	    $user_id=$this->session->userdata('user_id');
		$my_class=$this->check->get_attr($user_id,'cms_class');
		$my_class=$this->all_sub_classes($my_class);

		return $my_class;
	}

	function all_sub_classes($cms_class_list,$selves_included=TRUE) {
	    
		if(!$cms_class_list)	return array();

		$all_class=	$selves_included?$cms_class_list:'';		
			
		$cms_class_list=explode(',',$cms_class_list);
		foreach($cms_class_list as $index => $value) {
			if($this->has_sub_class($value)) {
		 	  $sub_class_list=$this->sub_class_list($value);
			  if($sub_class_list) $all_class.=','.$sub_class_list;
			}
		}
	    
		$all_class=array_unique(explode(',',$all_class));
		if(!$selves_included) unset($all_class[0]);
	    
		return $all_class; 
	}

	function check_if_my_classes($class_id){
		
		if(!$this->check->admin_is_logged()) return FALSE;
		
		if($this->check->check_if_super_admin()) return TRUE;
		else {								   			
			 $my_class=$this->get_my_classes();			 
			 if(in_array($class_id,$my_class) || !$my_class) return TRUE;
			 else return FALSE;
		}
	}

}
/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */
