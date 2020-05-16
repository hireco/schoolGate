<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');

class Myconfig extends CI_Model
{
    function __construct() {
        parent::__construct();

        define('IS_ADMIN',   $this->admin_or_front());
        define('IS_FRONT',  !$this->admin_or_front());

        if(!IS_AJAX && IS_FRONT) {
            $this->load->model('ads_model');
            $this->output->cache((int)$this->item('cache_time'));
        }
    }

    function item($item) {
        $this->db->select('config_value');
        $this->db->where('config_name', $item);
        $this->db->limit(1);
        $query=$this->db->get('sys_config');
        if($query->num_rows()) {
            $row=$query->row_array();
            return $row['config_value'];
        }
        else return '';
    }

    function text_item($item) {
        $this->db->select('text_value');
        $this->db->where('text_name', $item);
        $query=$this->db->get('sys_text');
        if($query->num_rows()) {
            $rows=$query->result_array();
            return $rows[0]['text_value'];
        }
        else return '';
    }

    function set_item($item,$value) {
        $this->db->where('config_name', $item);
        $this->db->update('sys_config',array('config_value' => $value));
        if($this->db->affected_rows()) return TRUE;
        else return FALSE;
    }

    function cms_model($id,$item) {
        $array=$this->config->item('cms_model');
        return $array[$id][$item];
    }

    function cms_model_id($table) {
        $array=$this->config->item('cms_model');
        foreach ($array as $index => $value) {
            if($value['table']==$table) return $index;
        }
    }

    function field_maxlength($table,$field) {
        $fields = $this->db->field_data($table);
        foreach ($fields as $index){
            if($field==$index->name)
                return $index->length/3;
        }
    }

    function get_template($item='template_path',$template_name='') {
        $this->db->where('is_mobile',IS_MOBILE);
        if(!$template_name) $this->db->where('selected', '1');
        else $this->db->where('template_name',$template_name);

        $query=$this->db->get('sys_skin');
        if($query->num_rows()) {
            $rows=$query->result_array();
            return $rows[0][$item];
        }
        else return '';
    }

    function get_seo($uri_string) {
        $data=array();

        $this->db->where('uri_string',$uri_string);
        $this->db->select('seo_title,seo_keywords,seo_description');
        $query=$this->db->get('add_seo');

        if($query->num_rows()) {
            $data=$query->row_array();
        }

        return $data;
    }

    function set_meta($description='',$keywords='') {

        $description=$description?$description.$this->item('description'):$this->item('description');
        $keywords=$keywords?$keywords.$this->item('keywords'):$this->item('keywords');

        $meta = array(
            array('name' => 'robots', 'content' => 'no-cache'),
            array('name' => 'description', 'content' => $description),
            array('name' => 'keywords', 'content' => $keywords),
            array('name' => 'Content-Language', 'content' => $this->config->item('language'), 'type' => 'equiv'),
            array('name' => 'Content-type', 'content' => 'text/html; charset='.$this->config->item('charset'), 'type' => 'equiv')
        );

        return $meta;
    }

    function set_title($title='') {
        return $title ? $title.'-'.$this->item('site_name'):$this->item('site_name').'-'.$this->item('site_title');
    }

    function admin_or_front() {
        $path=explode('/',str_replace(base_url(),'',current_url()));
        return $path[0]==$this->config->item('admin_dir')?TRUE:FALSE;
    }

}

/* End of file myconfig.php */
/* Location: ./application/models/myconfig.php */