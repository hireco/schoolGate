<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

    /**
     *
     * 汉字转换拼音函数
     *
     * @param $str string 需要转换的字符串
     * @param $ishead bool 是否只显示第一个字母
     * @param $ucfirst bool 是否第一个字母大写,默认为以下划线分割字之间:eg wo_men_da_jia，如果第三个参数是TRUE则为驼峰式
     * @return String 把汉字转化为拼音的字符串
     */
    function GetPinyin($str,$ishead = FALSE,$ucfirst = FALSE,$interval='_')
    {
        $pinyins = array();
        $restr = '';
        $str = trim(@iconv('UTF-8','GB2312',$str));
        $slen = strlen($str);
        if($slen<2)
        {
            return $str;
        }
        if(count($pinyins)==0)
        {
            $fp = fopen('data/pinyin.dat','r');
            while(!feof($fp))
            {
                $line = trim(fgets($fp));
                $pinyins[$line[0].$line[1]] = substr($line,3,strlen($line)-3);
            }
            fclose($fp);
        }
        for($i=0;$i<$slen;$i++)
        {
            if(ord($str[$i])>0x80)
            {
                $c = $str[$i].$str[$i+1];
                $i++;
                if(isset($pinyins[$c]))
                {
                    if( ! $ishead AND $ucfirst)
                    {
                        $restr .=$interval.ucfirst($pinyins[$c]);
                    }
                    elseif( ! $ishead AND ! $ucfirst)
                    {
                        $restr .= $interval.$pinyins[$c];
                    }
                    else
                    {
                        $restr .= $interval.$pinyins[$c][0];
                    }
                }
                else continue;
            }
            else if( preg_match("/[a-z0-9]/",$str[$i]) )
            {
                $restr .= $interval.$str[$i];
            }
            else continue;
        }

        if($restr[0] == $interval)
        {
            return substr($restr,1);
        }
        else
        {
            return $restr;
        }
    }

/* End of file pinyin_helper.php */
/* Location ./application/helpers/pinyin_helper.php */
