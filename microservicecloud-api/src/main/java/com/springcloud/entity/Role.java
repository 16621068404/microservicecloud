package com.springcloud.entity;

import lombok.Data;

@Data
public class Role {
	
	private String branch_no;
	
	private String role_no;          //角色编号
	
	private String role_name;        //角色名称
	
	private String remark;           //备注
	
	private String status;           //状态
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;
	
	private int sort_code;          //排序
	
	private String time_stamp;
	
	private String role_type;       //角色类型(收货商|服务商|承运商|收货商|公司)
}
