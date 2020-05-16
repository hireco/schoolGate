<?php
class Excel extends CI_Model
{
   var $data_dir='./tmp';

   function __construct() {

		parent::__construct();
		$this->load->library('Common');        

		/** Include path **/
        set_include_path(get_include_path() . PATH_SEPARATOR . dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'PHPExcel');
		 
        /** PHPExcel_IOFactory */
        require_once('PHPExcel.php');
		require_once('PHPExcel/IOFactory.php');
		require_once('PHPExcel/Reader/Excel5.php');	
		require_once('PHPExcel/Writer/Excel2007.php');

   }
   
   
   /** 
   * 导出数据为excel表格 
   * @param $data    一个二维数组,结构如同从数据库查出来的数组 
   * @param $title   excel的第一行标题,一个数组,如果为空则没有标题 
   * @param $filename 下载的文件名 
   * @examlpe  exportexcel($arr,array('id','账户','密码','昵称'),'文件名!'); 
   */
   
   function export_data($data=array(),$title=array(),$action='savedata',$filetype='xls',$filename=''){     
	   
	   $this->load->helper('string');

	   if($action=='savedata') {
	       is_dir($this->data_dir)?'':mkdir($this->data_dir);
		   $datafile = $filename ? $this->data_dir.'/'.$filename.'.'.$filetype : $this->data_dir.'/'.random_string('alpha', 15).'.'.$filetype;
	   }
	   else {
		   $datafile = $filename ? $filename.'.'.$filetype : random_string('alpha', 15).'.'.$filetype;

		   header('Content-Type: application/vnd.ms-excel');
		   header('Content-Disposition: attachment;filename="'.$datafile.'"');
		   header('Cache-Control: max-age=0');
		   header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
		   header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
		   header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
		   header('Pragma: public'); // HTTP/1.0
	   }
	   
	   $writertype=$filetype=='xls'?'Excel5':'Excel2007';

	   $objPHPExcel = new PHPExcel();
	   $objPHPExcel->getProperties()->setCreator($this->config->item('app_version'))
							 ->setLastModifiedBy($this->session->userdata('nick_name'))
							 ->setTitle("Office ".$writertype." Document")
							 ->setSubject("Office ".$writertype." Document")
							 ->setDescription('Data exported by '.$this->config->item('app_version'))
							 ->setKeywords($this->config->item('app_version'))
							 ->setCategory($this->config->item('app_version'));
	   if (!empty($title)){         
		   foreach ($title as $i => $j) {             
			  $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($i+65).'1', $j); 
			  $objPHPExcel->getActiveSheet()->getColumnDimension(chr($i+65))->setWidth(1.2*strlen($j)); 
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getFill()->getStartColor()->setARGB('FF8ACC43');
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getFont()->setBold(true);
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getBorders()->getRight()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getBorders()->getBottom()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getBorders()->getRight()->getColor()->setARGB('FF999999');
			  $objPHPExcel->getActiveSheet()->getStyle(chr($i+65).'1')->getBorders()->getBottom()->getColor()->setARGB('FF999999');

		   }              
	   }  

	   if (!empty($data)){
		   foreach($data as $i=>$j){
			  $k=0;

			  $color=$i%2==1?'D2ECC4':'FFFFFF';

			  foreach ($j as $m => $n) { 
				  if(preg_match("/^mailto:/",$n)){
				      $email=str_replace('mailto:','',$n);
					  $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($k+65).($i+2), $email); $objPHPExcel->setActiveSheetIndex(0)->getCell(chr($k+65).($i+2))->getHyperlink()->setUrl($n); 
				  }
				  else { 
					  $objPHPExcel->setActiveSheetIndex(0)->setCellValue(chr($k+65).($i+2), $n);  
				      if(preg_match("/^http:\/\//",$n))
				         $objPHPExcel->setActiveSheetIndex(0)->getCell(chr($k+65).($i+2))->getHyperlink()->setUrl($n); 
				  }

				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
			      $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getFill()->getStartColor()->setARGB('FF'.$color);
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getBorders()->getRight()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getBorders()->getBottom()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getBorders()->getRight()->getColor()->setARGB('FF999999');
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getBorders()->getBottom()->getColor()->setARGB('FF999999');
				  $objPHPExcel->getActiveSheet()->getStyle(chr($k+65).($i+2))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_TOP);

				  $k++;
		      }
	       }           
	   } 

	   $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $writertype);

	   if($action=='savedata') {
		   $this->load->library('Common');
		   $objWriter->save($datafile);
		   return common::myurlcode($datafile);
	   }
	   else 
		   $objWriter->save('php://output');

	}
	
	function import_data($table,$field=array(),$filename='') {
	   
	    $filetype= common::fileext($filename);
		
		$inputFileType = $filetype=='xls'?'Excel5':'Excel2007'; 
		
		$inputFileName = $filename; 
  
        $objReader = PHPExcel_IOFactory::createReader($inputFileType); 
        $objPHPExcel = $objReader->load($inputFileName); 
        
		/* 
        $sheet = $objPHPExcel->getSheet(0);  //包含多个页面的excel的读取，这是读取第一个页面 
        $highestRow = $sheet->getHighestRow(); //取得总行数 
        $highestColumn = $sheet->getHighestColumn(); //取得总列 
        */    
        
		$objWorksheet = $objPHPExcel->getActiveSheet();//只取excel的默认页面 
        $highestRow = $objWorksheet->getHighestRow();//取得总行数 

		$highestColumn = $objWorksheet->getHighestColumn(); //取得总列 
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);//总列数
		
		$highestColumnIndex = $highestColumnIndex > count($field)?count($field):$highestColumnIndex;
		
		$insert_id=array();
		$insert_data=array();        
		
		for ($row = 2;$row <= $highestRow;$row++) { //注意highestRow的行数索引从1开始,去掉行标题，从第二行读起
            
			$data=array();

			for ($col = 0;$col < $highestColumnIndex;$col++) { //highestColumnIndex从0开始
				$data[$field[$col]] = (string) $objWorksheet->getCellByColumnAndRow($col, $row)->getValue(); 
				$data[$field[$col]] = $data[$field[$col]]?$data[$field[$col]]:'';
				
            } 
			
			$this->db->insert($table,$data);
			$result=$this->db->insert_id();
			if($result) {
				$insert_id[]=$result;
				$insert_data[$result]=$data;
			}
        }
		
		return array(
			'rows'    => $highestRow-1, 
			'insert_id'   => $insert_id,
			'insert_data' => $insert_data
		);
	}
}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */