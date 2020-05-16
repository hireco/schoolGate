<?php

//functions for back end cms handle

class Cms_model extends CI_Model
{   
    function __construct() {
		parent::__construct();
		$this->load->model('str_func');
		$this->load->helper('string');
		$this->load->library('my_image');
	}

	//class children list by li format
	function children_list($class_id=0,$select_id='',$hide_id=''){

		$class_name=$this->get_attr($class_id,'class_name');

		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority','asc');
		$query=$this->db->get('cms_class');

		if($query->num_rows()) {
			$cur_string ='<li id="class_'.$class_id.'"><span';
			
			if($select_id===$class_id) $cur_string.=' class="selected has_sub" id="selected_first"';
			else $cur_string.=' class="has_sub"';
			
			$cur_string.='>'.$class_name.'</span>';
			$cur_string.='<ul id="class_'.$class_id.'_sub">';

			foreach($query->result_array() as $row) {
				if($row['class_id']!=$hide_id)
				$cur_string.=$this->children_list($row['class_id'],$select_id,$hide_id);
			}

			$cur_string.='</ul>';
			$cur_string.='</li>';
		}
		else {
			$cur_string ='<li id="class_'.$class_id.'"><span';
			
			if($select_id===$class_id) $cur_string.=' class="selected has_no_sub" id="selected_first" ';
			else $cur_string.=' class="has_no_sub"';
			
			$cur_string.='>'.$class_name.'</span>';
			$cur_string.='</li>';
		}
		return $cur_string;
	}

	//class children list for selection
	function class_select_option($class_id=0,$select_id='',$hide_id=''){
			
		$class_name=$this->get_attr($class_id,'class_name');

		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority','asc');
		$query=$this->db->get('cms_class');

		$class_level=$this->get_attr($class_id,'class_level');

		if($class_id) $option_prefix=repeater('&nbsp;', $class_level*4);
		else $option_prefix='';

		if($query->num_rows()) {
			$cur_string ='<option value="'.$class_id.'" ';
			if($select_id==$class_id) $cur_string.=' selected="selected"';
			$cur_string.=' class="has_sub">'.$option_prefix.$class_name.'</option>';
			foreach($query->result_array() as $row) {
				if($row['class_id']!=$hide_id)
				$cur_string.=$this->class_select_option($row['class_id'],$select_id,$hide_id);
			}
		}
		else {
			$cur_string ='<option value="'.$class_id.'" ';
			if($select_id==$class_id) $cur_string.=' selected="selected"';
			$cur_string.=' class="has_no_sub">'.$option_prefix.$class_name.'</option>';
		}
		return $cur_string;
	}

	
	function class_check_cascade($class_id=0) {
	   
		$class_name=$this->get_attr($class_id,'class_name');
		$class_level=$this->get_attr($class_id,'class_level');

		$this->db->where('parent_id',$class_id);
		$this->db->order_by('class_priority','asc');
		$query=$this->db->get('cms_class');

		if($class_id) $option_prefix=repeater('&nbsp;', $class_level*4);
		else $option_prefix='';
	   	
		$data='';
		
		if($class_id) {
		   $style=$query->num_rows()?'class="has_sub"':'';
		   $data.='<p '.$style.'>';
		   $data.='<input type="hidden" class="obj_url" value="'.site_url('cms/list/'.$class_id).'">';
		   $data.='<input type="checkbox" class="obj_id" value="'.$class_id.'" />';
		   $data.=$option_prefix.'<label  class="cms_class_linker">'.$class_name.'</label>';
		   $data.='</p>';

		}

		if($query->num_rows()) {
			foreach($query->result_array() as $row) {
				$data.=$this->class_check_cascade($row['class_id']);
			}
		}
						   		
		return $data;	
	}


	function change_level($class_id, $to_level) {
		$this->db->where('parent_id',$class_id);
		$query=$this->db->get('cms_class');
		if($query->num_rows()) {
			$this->db->where('class_id',$class_id);
			$this->db->update('cms_class',array('class_level' => $to_level));
			foreach($query->result() as $row)
			$this->change_level($row->class_id, $to_level+1);
		}
		else {
			$this->db->where('class_id',$class_id);
			$this->db->update('cms_class',array('class_level' => $to_level));
		}
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

	function has_sub_class($class_id) {
		$this->db->where('parent_id',$class_id);
		$query=$this->db->get('cms_class');
		if($query->num_rows()) return TRUE;
		else return FALSE;
	}

	function sub_class_list($class_id) {
		
		$children='';
		$temp=array();

		$this->db->where('parent_id',$class_id);
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
    
    function cms_cascade_list($class_id) {
	    
		if($class_id) {
		   $class_ids=$this->cms_model->all_sub_classes($class_id,TRUE);
		   $cms_list=$this->myquery->cms_of_classes($class_ids);
		} 
		else 
		   $cms_list=$this->myquery->cms_list(0);
		   
		return $cms_list;   
	} 
	
	function delete_class_content($class_id) {
		$this->db->where('class_id',$class_id);
		$query=$this->db->get('cms_index');
		if($query->num_rows()){
			foreach($query->result() as $row) {
				foreach ($this->config->item('cms_model') as $index => $value){
					$this->db->delete('cms_'.$value['table'],array('index_id' => $row->index_id));
				}
			}
		}
		$this->db->delete('cms_index',array('class_id' => $class_id));
	}

	function move_class_content($class_id,$to_id) {
		$this->db->where('class_id',$class_id);
		$result1=$this->db->update('cms_index',array('class_id' => $to_id));

		$this->db->where('vice_class_id',$class_id);
		$result2=$this->db->update('cms_index',array('vice_class_id' => $to_id));
		return $result1 && $result2;
	}

	function move_class($class_id,$to_id,$move_type) {
		if(($to_id!=0 && !$this->class_exist($to_id))||!$this->class_exist($class_id))
		return  FALSE;

		$to_level=$to_id==0?1:1+$this->get_attr($to_id,'class_level');
			
		if($move_type=='whole') {
			$this->db->where('class_id',$class_id);
			$this->db->update('cms_class',array('parent_id' => $to_id));
			$this->change_level($class_id,$to_level);

			$result=$this->db->affected_rows();
		}
		else {
			$this->db->where('parent_id',$class_id);
			$query=$this->db->get('cms_class');
			if($query->num_rows()) {
				foreach($query->result() as $row) {
					$this->db->where('class_id',$row->class_id);
					$this->db->update('cms_class',array('parent_id' => $to_id));
					$this->change_level($row->class_id,$to_level);
				}
			}
			$result=$this->move_class_content($class_id,$to_id);
		}
		return $result;
	}

	function class_exist($class_id) {
		$this->db->where('class_id',$class_id);
		$query=$this->db->get('cms_class');
		if($query->num_rows()) return TRUE;
		else return FALSE;
	}
	//类别函数结束，下面是内容函数

	//获取文章的摘要
	function get_abstract($body,$abstract,$len){
		if($abstract==''){
			$description = $this->str_func->cn_substr($this->str_func->html2text($body),$len);
			$description = trim(preg_replace('/#p#|#e#/','',$description));
			$description = addslashes($description);
			return $description;
		}
		else return $abstract;
	}

	//获取文章关键字
	function get_keywords($title,$body,$keywords,$len) {
		if($keywords=='') {
			$subject = $title;
			$message = $body;
			$this->load->library('split_word');
			$this->split_word->SetSource($subject);
			$this->split_word->StartAnalysis();
			$titleindexs = preg_replace("/#p#|#e#/",'',$this->split_word->GetFinallyIndex());
			$this->split_word->SetSource($this->str_func->html2text($message));
			$this->split_word->StartAnalysis();
			$allindexs = preg_replace("/#p#|#e#/",'',$this->split_word->GetFinallyIndex());

			if(is_array($allindexs) && is_array($titleindexs))
			{
				foreach($titleindexs as $k => $v)
				{
					if(mb_strlen($keywords.$k,'utf8')>=$len)
					{
						break;
					}
					else
					{	if(mb_strlen($k,'utf8') <2 ) continue;
					    if(mb_strlen($k,'utf8') <= 4 && preg_match("/^[A-Za-z0-9]+$/",$k)) continue;
						if(mb_strlen($k,'utf8') > 6 && !preg_match("/^[A-Za-z0-9]+$/",$k)) continue;
						$keywords .= $k.',';
					}
				}
				foreach($allindexs as $k => $v)
				{
					if(mb_strlen($keywords.$k,'utf8')>=$len)
					{
						break;
					}
					else if(!in_array($k,$titleindexs))
					{
						if(mb_strlen($k,'utf8') <2 ) continue;
					    if(mb_strlen($k,'utf8') <= 4 && preg_match("/^[A-Za-z0-9]+$/",$k)) continue;
						if(mb_strlen($k,'utf8') > 6 && !preg_match("/^[A-Za-z0-9]+$/",$k)) continue;
						$keywords .= $k.',';
					}
				}
			}
			return rtrim($keywords,',');
		}
		else return str_replace('，',',',$keywords);
	}

	//获取远程图片
	function get_remote_images($get_remote='1', $body,$add_watermark='1') {

		if($get_remote!='1') return $body;

		$basehost = "http://".$_SERVER["HTTP_HOST"];
		$base_url=preg_replace("{/$}","",base_url());

		$uploaddir = $this->config->item('httpdown_dir').'/image/';

		$basedir = str_replace($basehost, '', base_url());

		$this->load->library('httpdown');

		$img_array = array();
		preg_match_all("/src=[\"|'|\s]{0,}(http:\/\/([^>]*)\.(gif|jpg|png))/isU",$body,$img_array);
		$img_array = array_unique($img_array[1]);
		$imgPath = $uploaddir.date("ym", time());
		$imgUrl = $basedir.$imgPath;

		if(!is_dir($imgPath)){
			$this->load->library('my_file');
			$this->my_file->mk_mydir($imgPath, '0755');
		}

		$img_filename = date('dHis',time()).mt_rand(100, 999);

		foreach($img_array as $key=>$value)
		{
			if(preg_match("#".$basehost."#i", $value))
			{
				continue;
			}
			if($base_url != $basehost && preg_match("#".$base_url."#i", $value))
			{
				continue;
			}
			if(!preg_match("#^http:\/\/#i", $value))
			{
				continue;
			}
			$this->httpdown->OpenUrl($value);
			$itype = $this->httpdown->GetHead("content-type");
			$itype = substr($value, -4, 4);
			if(!preg_match("#\.(jpg|gif|png)#i", $itype))
			{
				if($itype=='image/gif')
				{
					$itype = ".gif";
				}
				else if($itype=='image/png')
				{
					$itype = ".png";
				}
				else
				{
					$itype = '.jpg';
				}
			}
			
			$value = trim($value);
			$rndFileName = $imgPath.'/'.$img_filename.'_'.$key.$itype;
			$fileurl = $imgUrl.'/'.$img_filename.'_'.$key.$itype;
			$rs = $this->httpdown->SaveToBin($rndFileName);
			if($rs)
			{
				$body = str_replace($value, $fileurl, $body);
				if($add_watermark=='1') $this->my_image->WaterImg($rndFileName, 'down');
			}
		}
		$this->httpdown->Close();
		return $body;
	}

	//删除站外链接
	function delete_outer_links($del_link='1', $body) {

		if($del_link!='1') return $body;
			
		$allow_urls = array($_SERVER['HTTP_HOST']);

		// 读取允许的超链接设置
		if(file_exists("data/allowurl.txt"))
		{
			$allow_urls = array_merge($allow_urls, file("data/allowurl.txt"));
		}

		$host_rule = join('|', $allow_urls);
		$host_rule = preg_replace("#[\n\r]#", '', $host_rule);
		$host_rule = str_replace('.', "\\.", $host_rule);
		$host_rule = str_replace('/', "\\/", $host_rule);
		$arr = '';
		preg_match_all("#<a([^>]*)>(.*)<\/a>#iU", $body, $arr);
		if( is_array($arr[0]) )
		{
			$rparr = array();
			$tgarr = array();
			foreach($arr[0] as $i=>$v)
			{
				if( $host_rule != '' && preg_match('#'.$host_rule.'#i', $arr[1][$i]) )
				{
					continue;
				} else {
					$rparr[] = $v;
					$tgarr[] = $arr[2][$i];
				}
			}
			if( !empty($rparr) )
			{
				$body = str_replace($rparr, $tgarr, $body);
			}
		}
		$arr = $rparr = $tgarr = '';
		return $body;
	}

	//删除fck生成的链接的属性
	function del_fcklink_attr($body) {
		return preg_replace('/_fcksavedurl=".+"/','',$body);
	}

	//自动获取缩略图
	function get_body_thumb($body,$icon_first='1',$isremote=1){
        
		$basehost = "http://".$_SERVER["HTTP_HOST"];
		$thumb_size=explode(':',$this->myconfig->item('cms_icon_size'));
        $thumb_width=$thumb_size[0]; 
        $thumb_height=$thumb_size[1];
        $litpic = '';
		
        preg_match_all("/(src)=[\"|'| ]{0,}([^>]*\.(gif|jpg|bmp|png))/isU",$body,$img_array);
		$img_array = array_unique($img_array[2]);

		if(count($img_array)>0) {
			$picname = preg_replace("/[\"|'| ]{1,}/", '', $img_array[0]);
			//取得第一张图片的src地址
			if($isremote==1 && preg_match("#^http:\/\/#i", $picname)){

				$picname = $this->my_image->get_content_url($picname, $this->config->item('httpdown_dir').'/image/');
				$img_info = GetImageSize($picname);

				if(is_array($img_info) && ($img_info[0] > $thumb_width || $img_info[1] > $thumb_height)){
                     $this->my_image->ImageResize($picname,$thumb_width,$thumb_height);
                     $litpic=str_replace($basehost, '', base_url().$picname);
				}
				else $litpic='';

			}
			else if($icon_first=='1' && !preg_match("#^http:\/\/#i", $picname)) {
				$litpic =str_replace(basename($picname), $this->config->item('thumb_prefix').basename($picname), $picname);
				
				$oldpic_path=str_replace(base_url(), '', $basehost.$picname);
				$litpic_path=str_replace(base_url(), '', $basehost.$litpic);
					
				$this->my_image->ImageResize($oldpic_path,$thumb_width,$thumb_height,$litpic_path);
				if(!is_file($litpic_path)) $litpic = '';
			}
			else $litpic = $picname;
		}
		return $litpic;
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
	
	function get_photos_files($thumbs,$single='') {
		
		$photos=array();
		
		if(strpos($thumbs, '::')===FALSE) {
		   $thumbs=explode(':', $thumbs);			
		   foreach ($thumbs as $index => $value) {
		   	    $photos[$index]=str_replace($this->config->item('thumb_prefix'), '', $value);
		   }
		}
		else {
		   $thumbs=explode('::', $thumbs);
		   $photos=explode(':', $thumbs[1]);
		}
		
		if($single==='') return  implode(':', $photos);
		else return $photos[abs((int)$single)];
	}
	

	function show_msg($infor='该内容不存在！',$viewer='404_error',$title='内容没找到') {
		$data=array(
		 'title'=> $title,
		 'viewer' => $viewer,
		 'infor'  => $infor
		);
		echo $this->load->view('show_msg',$data,TRUE);
		exit();
	}

	function get_my_classes() {

	    $user_id=$this->session->userdata('user_id');
		$my_class=$this->check->get_attr($user_id,'cms_class');
		$my_class=$this->all_sub_classes($my_class);

		return $my_class;
	}

/**
* @param $class_id,待检测的栏目id
* @return  TRUE表示用户具有操作权，否则表示无权。
*/
	function check_if_my_classes($class_id){
		
		if(!$this->check->admin_is_logged()) return FALSE;

		if($this->check->check_if_super_admin()) return TRUE;
		else{			 
             $my_class=$this->get_my_classes();	
			 if(in_array($class_id,$my_class) || !$my_class) return TRUE;
			 else return FALSE;
		}
	}

/**
* @param $index_id,待检测的内容id
* @return  TRUE表示没有锁定，否则表示该内容对该用户是锁定的。
*/
	function locked2you($index_id) {

	    $data=$this->mysql->row('cms_index',array('index_id' => $index_id));
		if(!$data)  return FALSE;

		if($data['locked']=='1' && !$this->check->check_if_super_admin()) {
		   //if($data['user_id']!=$this->session->userdata('user_id'))
		        return FALSE;
		}

		return TRUE;

	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */