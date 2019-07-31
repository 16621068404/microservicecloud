package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class User implements Serializable{
	
	/**
	 * 用户基本信息实体bean
	 */
	private static final long serialVersionUID = 1L;
	
	private String user_logid;     //用户名
	
	private String user_no;        //用户ID
	
	private String user_logpass;   //用户密码
	
	private String server_name;    //用户数据库主机名或者ip地址
	
	private String db_user;        //用户数据库的用户名
	
	private String db_name;        //用户数据库名称
	
	private String db_password;    //用户数据库密码
	
	private String role_no;        //用户角色ID 
	
	private String cust_no;
	
	private String cust_name;
	
	private String cust_logo;
	
	private String branch_no;
	
	private String branch_name;
	
	private int system_type;
	
	private String db_type;
	
	private String login_user_data; //用户登录时间
	
	private String user_name;       //用户姓名
	
	private String pic_url;         //照片地址
	
	private String is_super;
	
	private String skin_type;      //页面风格
	
	private String custom_no;       //货主编号
	
	private String custom_name;     //货主名称
	
	
	
	
	
	
}
