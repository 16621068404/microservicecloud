package com.springcloud.entity;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;

import lombok.Data;

@Data
public class RoleMember implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@JSONField(name = "UserId")
	private String UserId;    //用户id
	
	@JSONField(name = "Account")
	private String Account;   //用户账号
	
	@JSONField(name = "User_Name")
	private String User_Name; //用户姓名
	
	@JSONField(name = "DepartmentId")
	private String DepartmentId; //用户所在部门id
	
	@JSONField(name = "DepartmentName")
	private String DepartmentName; //用户所在部门名称
	
	@JSONField(name = "Gender")
	private String Gender;         //性别
	
	private int isdefault;
	
	private int ischeck;           //是否选中

	
	
	
	
}
