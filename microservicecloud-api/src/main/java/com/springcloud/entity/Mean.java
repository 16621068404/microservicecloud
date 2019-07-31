package com.springcloud.entity;

import lombok.Data;
/**
 * 主页面的菜单实体bean
 * @author Dell
 *
 */
@Data
public class Mean {
	
	
	private String menu_id;      //菜单主键
	private String parent_id;    //父级主键
	private String menu_code;    //菜单编码
	private String menu_name;    //菜单名称
	private String menu_icon;    //图标
	private String menu_type;    //导航类型
	private String url_address;  //访问地址
	private String enabled_mark; //有效标记 1代表有效
	private String is_split;     //显示分割线
	
	public Mean() {
		super();
	}
	
	

}
