package com.springcloud.entity;

import lombok.Data;

@Data
public class DictionaryDetail {
	
	private String item_detail_id;    //明细主键
	
	private String item_id;           //分类主键
	
	private String parent_id;
	
	private String item_code;         //编码
	
	private String item_name;         //名称
	
	private String item_value;        //值
	
	private String quick_query;       //快速查询
	
	private String simple_spelling;   //简拼
	
	private int is_default;           //是否默认
	
	private int sort_code;            //排序码
	
	private int delete_mark;          //删除标记
	
	private int enabled_mark;         //有效标记
	
	private String remark;            //备注
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;
	
	
	
	
	
	
	
	
	
	
	
	
	

}
