 <?php 
     $this->load->helper('array');
	 $allist=array(
	   'edit'         => '编辑对象',
	   'delete'       => '删除对象',
	   'checked'      => '通过审核',
	   'no_checked'   => '取消审核',
	   'gotop'        => '设为置顶',
	   'gobottom'     => '取消置顶',
	   'goup'	      => '上移一位',
	   'godown'	      => '下移一位',
	   'recommend'    => '设为推荐',
	   'no_recommend' => '取消推荐',
	   'headline'     => '设为头条',
	   'no_headline'  => '取消头条',
	   'new'          => '新建内容',
	   'view'         => '查看内容',
	   'move_to'      => '移动到...',
	   'copy_id'      => '获取ID',
	   'crop'         => '裁剪原图',
	   'thumb'        => '取缩略图',
	   'address'      => '获取地址',
	   'kickout'      => '临时踢出',
	   'dieuser'      => '禁止用户',
	   'lifeuser'     => '激活用户',
	   'forbidIP'     => '封堵IP源',
	   'reply'        => '回复信息',
	   'hide'         => '隐藏对象',
	   'no_hide'      => '显示对象',
	   'hot'          => '设为热门',
	   'no_hot'       => '取消热门',
	   'isnew'        => '设为最新',
	   'no_isnew'     => '取消最新',
	   'processed'    => '设置处理',
	   'no_processed' => '取消处理',
	   'locked'       => '设置锁定',
	   'no_locked'    => '取消锁定',
	   'admin'        => '我来跟单',
	   'no_admin'     => '取消跟单',
	   'show'         => '前台显示',
	   'right'        => '管理权限',
	   'trash'        => '入回收站',
	   'recycle'      => '恢复利用'
	 );
	 $menu_items=elements($mylist, $allist);
 ?>
 <div class="contextMenu hide" id="<?php echo isset($context_menu_id)?$context_menu_id:'mycontext_menu'; ?>">
      <ul>
	    <?php 
		foreach($menu_items as $index => $value)
        if($value)	{
        	echo '<li id="'.$index.'"><img src="'.base_url().'skin/admin/images/menu_'.$index.'.png" /> '.$value.'</li>';
        	echo "\n";        	
        }
		?>        
      </ul>
  </div>