package com.springcloud.entity;

import java.io.Serializable;
import java.util.List;
import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

/**
 * tree树形表格基础对象
 *
 */
@Data
public class TreeGrid implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	 
	public String id;			        // 树形菜单节点 （元素本身编码用于上下级关连关系）
 
	public String text;			        // 树形菜单要显示的值 
	
	public String value;                // 树形菜单编号
	
	public String img;                  // 树形菜图案
	
	public String parentnodes;          // 父节点id
	
	public Boolean showcheck = false;	//是否显示（选填 xTree插件中所需属性） true为显示，false与不填都为不显示
	
	public int checkstate;              //是否选中   （选填 xTree插件中所需属性）   1为选中，0与不填都为选不中
	
	public Boolean isexpand = true;     //是否展开    （选填 xTree插件中所需属性）true为展开,默认为不展开
	
	public Boolean hasChildren = false;  //是否有孩子
	
//	@JSONField(name = "ChildNodes")
	public List<TreeGrid> childNodes;		    //孩子节点   （必填 xTree插件中所需属性 没子节点该值为空集合）
	
	
	
	

	
	
	
	
	

}
