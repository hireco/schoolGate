<?php
/**
 * 
 * Array using as class
 * @author owner
 *
 */
class My_array extends ArrayObject{

    public function __construct(){
    	
    }

    public function set( $newConfig = array() ){
        foreach ($newConfig as $key => $value){
            $this->$key = $value;
        }
    }
    
    public function __get($name){
        $this->$name = null;
        return null;
    }
}

/* End of file Array.php */
/* Location: ./application/libraries/Array.php */