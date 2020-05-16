<?php
class Swf_avatar extends CI_Model
{
	public $inputs = array();
    
    public $avatar_config;
    
    function __construct(){
    	parent::__construct();
    	$this->load->library('Common');
    	$this->load->library('My_array');
    	$this->load->library('My_avatar');
    	$this->avatar_config = common::getInstanceOf('my_array');
    }
    
    public function index() {
    	$uid = $this->session->userdata('user_id');
    	$avatar_config = array(
    	    'tmpdir' => 'avatar/tmp',           
    	    'avatardir' => 'avatar/saved',
    	    'swfdir'=> 'avatar/flash',        
    	    'authkey' => '7hn8xiao9cheng8songwanglin',          
    	    'debug' => true,    
    	    'uploadsize' => 1024,   
    	    'uc_api' => current_url(),          
    	    'imgtype' => array(1 => '.gif', 2 => '.jpg', 3 => '.png'),
    	    'no_avatar_url' =>  base_url().$this->my_avatar->no_avatar_url     
    	);
    	
    	if( !isset($_GET['a']) || empty($_GET['a']) || !is_string($_GET['a']) ){
    		$action = 'showuploadAction';
    	}else{
    		$action = $_GET['a']. 'Action';
    	}
    	
    	$this->avatar_config->set($avatar_config);
    	
    	if( empty($this->avatar_config->uc_api) ){
    		$this->avatar_config->uc_api = ( isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http' ).
    		'://'.( isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') ). 
    		substr( $_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], '/') );
    	}	
    	
    	if(method_exists($this, $action)){  
        	$result = $this->$action();    
        	if(is_array($result)){
        		$user_view=json_encode($result);
        	}else{
        		$user_view=$result;
        	}
            echo $user_view;
    	}
    	else{
    		echo lang_value('no_action_found');
    		exit();
    	}
    }
    
    private function showuploadAction() {
    	if(!$this->check->user_is_logged())  {
			exit();
		}
		
    	$uid = $this->session->userdata('user_id');			
        if( $uid === null || $uid == 0 ){
            redirect(base_url()); 
            exit;
        }
        $returnhtml = common::getgpc('returnhtml', 'G');
        if( $returnhtml === null  ){
            $returnhtml =  1;
        }
        
        $uc_input = urlencode(common::authcode(
          'uid='.$uid.'&ip_address='.$this->session->userdata('ip_address').'&session_id='.$this->session->userdata('session_id').'&agent='.md5($_SERVER['HTTP_USER_AGENT'])."&time=".time(),
          'ENCODE', 
          $this->avatar_config->authkey
         )
        );
        
        if(is_dir(realpath($this->avatar_config->swfdir)))
          $uc_avatarflash=base_url().$this->avatar_config->swfdir;
        
        $uc_avatarflash = $uc_avatarflash.'/camera.swf?nt=1&inajax=1&input='.$uc_input.'&agent='.md5($_SERVER['HTTP_USER_AGENT']).'&ucapi='.urlencode($this->avatar_config->uc_api).'&uploadSize='.$this->avatar_config->uploadsize;
        
        if( $returnhtml == 1 ) {
        	        	
        	$data['uc_avatarflash'] = $uc_avatarflash;	            
            return $this->load->view('pannel/swf_avatar', $data, TRUE);
        } 
    }

    
    private function uploadavatarAction() {	    
       	common::no_refresh();
       	$this->init_input(common::getgpc('agent', 'G'));
        $uid = abs((int)$this->input('uid'));
        $ip_address=$this->input('ip_address');
        $session_id=$this->input('session_id');
       	
		if(!$this->check->uid_is_logged($session_id,$ip_address,$uid)) return -1;
        if( empty($uid) || 0 == $uid ) {
            return -1;
        }
        if(empty($_FILES['Filedata'])) {
            return -3;
        }
        
        $imgext = strtolower('.'. common::fileext($_FILES['Filedata']['name']));
        if(!in_array($imgext, $this->avatar_config->imgtype)) {
            unlink($_FILES['Filedata']['tmp_name']);
            return -2;
        }
        
        if( $_FILES['Filedata']['size'] > ($this->avatar_config->uploadsize * 1024) ){
            unlink($_FILES['Filedata']['tmp_name']);
            return lang_value('image_too_large'). $this->avatar_config->uploadsize .'KB';
        }
        
        list($width, $height, $type, $attr) = getimagesize($_FILES['Filedata']['tmp_name']);
        
        $filetype = $this->avatar_config->imgtype[$type];
        
        $tmpavatar = realpath($this->avatar_config->tmpdir).'/upload'.$uid.$filetype;
        
        file_exists($tmpavatar) && unlink($tmpavatar);
        if(is_uploaded_file($_FILES['Filedata']['tmp_name']) && move_uploaded_file($_FILES['Filedata']['tmp_name'], $tmpavatar)) {
            list($width, $height, $type, $attr) = getimagesize($tmpavatar);
            if($width < 10 || $height < 10 || $type == 4) {
                unlink($tmpavatar);
                return -2;
            }
        } else {
            unlink($_FILES['Filedata']['tmp_name']);
            return -4;
        }

        $avatarurl = base_url().$this->avatar_config->tmpdir. '/upload'.$uid.$filetype;  
        return $avatarurl;
    }
    
    
    private function rectavatarAction() {    	
        common::no_refresh();
        $this->init_input(common::getgpc('agent', 'G'));
        $uid = abs((int)$this->input('uid'));
        $ip_address=$this->input('ip_address');
        $session_id=$this->input('session_id');
       	
		if(!$this->check->uid_is_logged($session_id,$ip_address,$uid)) {
			return '<root><message type="error" value="-1" /></root>';
		}
	    
		if( empty($uid) || 0 == $uid ) {
            return '<root><message type="error" value="-1" /></root>';
        }

        $avatarpath = $this->my_avatar->get_avatar_path($uid) ;
        $avatarrealdir  = realpath( $this->avatar_config->avatardir. DIRECTORY_SEPARATOR . $avatarpath );
        if(!is_dir( $avatarrealdir )) {
            $this->my_avatar->make_avatar_path( $uid, realpath($this->avatar_config->avatardir) );
        }
        $avatartype = common::getgpc('avatartype', 'G') == 'real' ? 'real' : 'virtual';
        
        $avatarsize = array( 1 => 'big', 2 => 'middle', 3 => 'small');
        
        $success = 1;
        
        foreach( $avatarsize as $key => $size ){
            $avatarrealpath = realpath( $this->avatar_config->avatardir) . DIRECTORY_SEPARATOR. $this->my_avatar->get_avatar_filepath($uid, $size, $avatartype);
            $avatarcontent = $this->_flashdata_decode(common::getgpc('avatar'.$key, 'P'));
            if(!$avatarcontent){
                $success = 0;
                return '<root><message type="error" value="-2" /></root>';
                break;
            }
            $writebyte = file_put_contents( $avatarrealpath, $avatarcontent, LOCK_EX );
            if( $writebyte <= 0 ){
                $success = 0;
                return '<root><message type="error" value="-2" /></root>';
                break;
            }
            $avatarinfo = getimagesize($avatarrealpath);
            if(!$avatarinfo || $avatarinfo[2] == 4 ){
                $this->my_avatar->clear_avatar_file( $uid, $avatartype );
                $success = 0;
                break;
            }
        }

        
        foreach ( $this->avatar_config->imgtype as $key => $imgtype ){
            $tmpavatar = realpath($this->avatar_config->tmpdir.'/upload'. $uid. $imgtype);
            file_exists($tmpavatar) && unlink($tmpavatar);
        }
        
        if($success) {
            return '<?xml version="1.0" ?><root><face success="1"/></root>';
        } else {
            return '<?xml version="1.0" ?><root><face success="0"/></root>';
        }
    }

    protected  function _flashdata_decode($s) {
        $r = '';
        $l = strlen($s);
        for($i=0; $i<$l; $i=$i+2) {
            $k1 = ord($s[$i]) - 48;
            $k1 -= $k1 > 9 ? 7 : 0;
            $k2 = ord($s[$i+1]) - 48;
            $k2 -= $k2 > 9 ? 7 : 0;
            $r .= chr($k1 << 4 | $k2);
        }
        return $r;
    }
	
	//above functions are to upload and operating the avatar 
    
    private function init_input($getagent = '') {
        $inputs = common::getgpc('input', 'G');
        
        if($inputs) {
            $inputs = common::authcode($inputs, 'DECODE', $this->avatar_config->authkey);
            parse_str($inputs, $this->inputs);
            $this->inputs = common::addslashes($this->inputs, 1, TRUE);
            $agent = $getagent ? $getagent : $this->inputs['agent'];

            if(($getagent && $getagent != $this->inputs['agent']) || (!$getagent && md5($_SERVER['HTTP_USER_AGENT']) != $agent)) {
                exit('Access denied for agent changed');
            } elseif(time() - $this->input('time') > 3600) {
                exit('Authorization has expired');
            }
        }
        if(empty($this->inputs)) {
            exit('Invalid inputs');
        }
    }
    
	private function input($k) {
		return isset($this->inputs[$k]) ? (is_array($this->inputs[$k]) ? $this->inputs[$k] : trim($this->inputs[$k])) : NULL;
	}
	//above functions are to parse the $_ variables to the $inputs array and get $uid.
}

/* End of file avatar.php */
/* Location: ./application/models/avatar.php */