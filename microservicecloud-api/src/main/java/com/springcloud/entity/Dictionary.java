package com.springcloud.entity;

import lombok.Data;

@Data
public class Dictionary {
	
	private String item_id;    //分类主键
	
	private String parent_id;  //父级主键
	
	private String item_code;  //分类编码
	
	private String item_name;  //分类名称
	
	private int is_tree;       //树型结构
	
	private int is_nav;        //导航标记
	
	private int sort_code;     //排序码
	
	private int delete_mark;   //删除标记
	
	private int enabled_mark;  //有效标记
	
	private String remark;     //备注
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;

}
