package com.springcloud.entity;

import lombok.Data;

@Data
public class Company {
	
	private int cust_id;
	
	private String cust_logo;
	
	private String cust_no;          //公司编号
	
	private String cust_name;        //公司名称
	
	private String cust_prop;        //公司属性
	
	private String cust_regadd;      //注册地址
	
	private String cust_platform;    //公司所属平台(注册的时候写入)
	
	private String cust_manager;
	
	private String cust_tel;         //电话
	
	private String cust_mobile;
	
	private String cust_fax;         //传真
	
	private String cust_url;         //网址
	
	private String cust_email;
	
	private String cust_qq;          //其他联系信息
	
	private String cust_wechat;
	
	private String cust_regdate;     //注册时间
	
	private String cust_officeadd;
	
	private double cust_cash;        //注册资金
	
	private String cust_content;
	
	private String status;
	
	private String server_name;
	
	private String db_name;
	
	private String db_user;
	
	private String db_password;
	
	private String db_driver;
	
	private String updated_at;
	
	private String updated_user;
	
	private int user_count;           //用户数
	
	private String past_time;
	
	private String register_time;
	
	private int system_type;      
	
	private int version_type;
	
	private int group_type;
	
	private String branch_no;
	
	private String db_type;         //数据库类型
	
	private String db_port;         //端口
	
	
	
	
	

}
