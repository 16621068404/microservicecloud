package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;
/**
 * 主页面的菜单实体bean
 * @author Dell
 *
 */
@Data
public class Mean implements Serializable{
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String menu_id;      //菜单主键
	private String parent_id;    //父级主键
	private String menu_code;    //菜单编码
	private String menu_name;    //菜单名称
	private String menu_icon;    //图标
	private String menu_type;    //导航类型
	private String url_address;  //访问地址
	private int enabled_mark; //有效标记 1代表有效
	private int is_split;     //显示分割线
	private int sort_code;       //显示顺序
	private int delete_mark;     //删除标记
	private String remark;       //菜单描述
	private String create_date;  //创建日期
	private String create_username;//创建用户
	private String modify_date;  //修改日期
	private String modify_username;//修改用户
	private int is_expand;         //是否展开
	
	
	
	
	
	
	
	
	
	
	
	
	public Mean() {
		super();
	}
	
	

}
