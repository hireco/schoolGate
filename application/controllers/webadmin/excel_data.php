<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Excel_data extends CI_Controller {
	function __construct(){
		parent::__construct();
		
		$this->load->model('excel');  
		$this->load->model('people_model');
		$this->load->model('publication_model');	
		$this->load->model('str_func');				
		
		$this->check->check_admin_logged();
		//if($this->uri->segment(3) && !IS_AJAX) show_404();
	}
	
	public function index() {
	    
		$data=array();
		$data['viewer'] = 'index';
		$data['data_viewer']=$this->export_data('index');
		$data['workplace_view']=$this->load->view('admin/excel_data',$data,TRUE);

		$data['js']=array(site_url('myjavascript/admin').'/?version='.$this->config->item('js_version'));		
		
		$data['jsmin']=$this->minify->js_mini(array(
		'js/admin/myjquery-exceldata.js'
		),FALSE);
		
		$data['cssmin']=$this->minify->css_mini('js/swfupload/swfupload.css');

		$this->load->view('admin/index',$data);
	}

    public function export_data($mode='for_ajax') {
	    
		$data=array('viewer' => 'export');
		$data_viewer = $this->load->view('admin/excel_data',$data,TRUE); 
		
		if($mode=='for_ajax') echo $data_viewer;
		else return $data_viewer; 
	}
	
	public function import_data($mode='for_ajax') {
	    
		$data=array('viewer' => 'import');
		$data_viewer = $this->load->view('admin/excel_data',$data,TRUE);  
		
		if($mode=='for_ajax') echo $data_viewer;
		else return $data_viewer;
	}


	//分直接下载和先保存然后下载两种
	public function export_people($action='savedata',$filetype='xls', $filename='') {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);

		$filename=__FUNCTION__.date('-Y-m-d-H-i-s',time());
		
		//$select=$this->db->list_fields('add_people');
		//echo implode('\',\'',$select); exit;

		$select=array('people_id','user_name','en_id','en_name','cn_name','gender','born_year','avatar','title_id','degree','phone','zip_code','office','email','personal_site','details','html_dir','hide','locked');

		$title=array('编号','用户名', 'URL','英文名','中文名','性别','出生年', '图像地址','职称/头衔',
			'学位','手机号码','邮政编码','办公室','电子邮件','个人站点地址','内容细节','个人站点目录','隐藏','锁定');
		
		$query=$this->db->select($select);
		$query=$this->db->get('add_people');
		$data=$query->result_array();

		foreach($data as $index => $value) {
			
			if($value['avatar']) $data[$index]['avatar']=$this->config->item('site_base').$value['avatar'];			
			
			$data[$index]['title_id']=$this->people_model->cn_titles[$value['title_id']];
			$data[$index]['degree']=$this->people_model->degrees[$value['degree']];
			$data[$index]['gender']=$value['gender']=='f'?'女':'男'; 
			$data[$index]['details']=str_replace('-bbb-',"\n",str_replace('-ddd-',"\n\n",$value['details']));

			$data[$index]['email']=$value['email']?'mailto:'.$value['email']:'';
		} 

		$datafile = $this->excel->export_data($data,$title,$action,$filetype,$filename);

		return $this->echo_infor($datafile,'1');

	}

	//分直接下载和先保存然后下载两种
	public function export_publication($action='savedata',$filetype='xls', $filename='') {
		
		$this->check->check_admin_right(__CLASS__,__FUNCTION__);
		
		$pub_terms=	$this->publication_model->pub_terms;

		$filename=__FUNCTION__.date('-Y-m-d-H-i-s',time());
		
		//$select=$this->db->list_fields('add_publication');
		//echo implode('\',\'',$select); exit;

		$select=array('pub_id','user_id','pub_type','pub_title','authors','pub_details','pub_file','pub_time');

		$title=array('编号','添加者', '类型','题目','作者','发布细节','相关文件', '发布时间');
		
		$query=$this->db->select($select);
		$query=$this->db->get('add_publication');
		$data=$query->result_array();

		foreach($data as $index => $value) {			
			
			$pub_file=json_decode($value['pub_file'],TRUE);
			if(!preg_match("/^http:\/\//",$pub_file[1]) && $pub_file[1]) 
				$pub_file=site_url($pub_file[1]); 
			else 
				$pub_file=$pub_file[1];

			$data[$index]['pub_file']=$pub_file;



			$pub_details=json_decode($value['pub_details'],TRUE);
			
			foreach($pub_details as $index_i => $value_i)
				$pub_details[$index_i]=$index_i."：".$value_i;
			
			$data[$index]['pub_details']=$this->str_func->multi_replace($pub_terms, implode("\n",$pub_details)); 
		} 

		$datafile = $this->excel->export_data($data,$title,$action,$filetype,$filename);

		return $this->echo_infor($datafile,'1');

	}
	
	function import_people() {
	     
		 $this->check->check_admin_right(__CLASS__,__FUNCTION__);

		 $this->load->helper('pinyin');	
		 $cn_titles=array_flip($this->people_model->cn_titles);
		 $degrees=array_flip($this->people_model->degrees);

		 $filename=$this->input->post('filename');

		 $field=array('cn_name','gender','born_year','title_id','degree','phone','zip_code','office','email','personal_site');
		 $result=$this->excel->import_data('add_people',$field,$filename);

		 if(!$result['insert_id'])  return $this->echo_infor('数据导入失败!');
		 
		 $rows=	$result['rows'];
		 $insert_id= $result['insert_id']; 
		 $rows_in=count($insert_id);
		 $insert_data= $result['insert_data'];
		 
		 foreach($insert_data as $index => $value) {  
		    
			$en_name=trim($this->get_pinyin_name($value['cn_name']));
			$en_id=str_replace(' ','',$en_name);
			$email=	explode('@',$value['email']);


			$data=array(
			  'gender' => $value['gender']?($value['gender']=='男'?'m':'f'):'',
			  'en_name' => $en_name,
		      'en_id'  => $en_id,
			  'title_id' => $cn_titles[$value['title_id']],
			  'degree' => $degrees[$value['degree']],
			  'user_name' => $email[0]
			);

			$this->db->where('people_id',$index);
			$this->db->update('add_people',$data);
		 }

		 if($rows==$rows_in) return $this->echo_infor('恭喜! 数据导入成功！','1');
		 else return $this->echo_infor('成功导入'.$rows_in.'条数据,'.($rows-$rows_in).'条数据导入失败');
	}

    function import_publication() {
	     
		 $this->check->check_admin_right(__CLASS__,__FUNCTION__);
		 
		 $pub_terms	= array_flip($this->publication_model->pub_terms);
		 
		 $filename=$this->input->post('filename');

		 $field=array('pub_type','pub_title','authors','pub_details','pub_file','pub_time');
		 $result=$this->excel->import_data('add_publication',$field,$filename);	 
		 
		 if(!$result['insert_id'])  return $this->echo_infor('数据导入失败!');
		 
		 $rows=	$result['rows'];
		 $insert_id= $result['insert_id']; 
		 $rows_in=count($insert_id);
		 $insert_data= $result['insert_data'];
		 
		 foreach($insert_data as $index => $value) {

			$data=array();
		    
			$pub_details=explode("\n",$this->str_func->multi_replace($pub_terms, $value['pub_details']));
			foreach($pub_details as $index_i => $value_i) {
				$tmp=explode("：",$value_i);
				$data[$tmp[0]]=$tmp[1];
			}

			$pub_details=array('pub_details' => json_encode($data));


			$this->db->where('pub_id',$index);
			$this->db->update('add_publication',$pub_details);
		 }

		 if($rows==$rows_in) return $this->echo_infor('恭喜! 数据导入成功！','1');
		 else return $this->echo_infor('成功导入'.$rows_in.'条数据,'.($rows-$rows_in).'条数据导入失败');
	}

	public function clear_file() {
	     
		 $i=0;

	     $data_dir=$this->excel->data_dir;
	     $dh = dir($data_dir);
       
	     while($cur_file = $dh->read()) {
  	       if($cur_file!="." && $cur_file!=".." ) {
	          $i++;
		      @unlink($data_dir.'/'.$cur_file);
		   }
	     }

	     return $this->echo_infor($i,'1');
    }

	function get_pinyin_name($cn_name) {
		
		$en_name=explode('_',GetPinyin($cn_name));
		$str=''; 
		foreach($en_name as $index => $value) {
			if($index > 1) $str.=$value;
		    else $str.=' '.ucfirst($value);
		}
		return $str;
	}

	private function echo_infor($infor,$result='0',$url='',$id=0) {
		$data=array(
		 'infor'  => $infor,
		 'result' => $result, 
		 'url'    => !$url?($result=='0'?'':'reload'):$url,
		 'id'     => $id
		);

		echo json_encode($data);
	}
}

/* End of file index.php */
/* Location: ./application/controllers/admin/index.php */
