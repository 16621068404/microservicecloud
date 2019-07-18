package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class SysBug implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int bug_id;                   //bug编号
	private String module_name;           //bug模块
	private String bug_type;              //bug类型
	private String status;                //bug状态
	private String create_username;       //创建者
	private String modify_username;       //修改者
	
	
}
