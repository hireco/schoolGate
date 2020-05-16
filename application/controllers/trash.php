<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Trash extends CI_Controller {
	function __construct(){
		parent::__construct();
		
		$this->check->check_admin_logged();
		
		$this->load->model('functions'); 
		$this->load->model('cms_function'); 
	}

	function view($index_id=0,$page_id=1) {
        
		$this->db->where('index_id',$index_id);
		$this->db->limit(1);
		$query=$this->db->get('cms_trash');
		
		if($query->num_rows()) {
			$cms = $query->row_array();
			$table=$this->myconfig->cms_model($cms['model_id'],'table');
			$method='cms_'.$table;
			$this->$method($index_id,$page_id);
		}
		else $this->functions->show_msg('文章不存在！');
	}
	
	function cms_article($index_id=0,$page_id=1) {

		$this->db->where('index_id', $index_id);
		$query=$this->db->get('cms_trash');
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

		$this->db->where('index_id', $index_id);
		$query=$this->db->get('cms_trash');
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
		
		$this->db->where('index_id', $index_id);
	    $query=$this->db->get('cms_trash');
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
		
		$this->db->where('index_id', $index_id);
	    $query=$this->db->get('cms_trash');
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
	
	private function index_data($query,$type) {
	    
		$data['index']=$query->row_array();
			
		$cur_model=	'cms_'.$this->myconfig->cms_model($data['index']['model_id'],'table');
		if($cur_model != $type)  $this->functions->show_msg('内容不存在！');

		if($data['index']['jump_url']) {
			redirect($data['index']['jump_url']);
		}

		$data['meta']=$this->cms_function->cms_seo_setting($data['index']['cms_description'],$data['index']['cms_keywords']);
		$data['title']=$data['index']['cms_title'];

		return $data;
	
	}
	
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
