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
	
	private String depart_no;        //部门编号
	
	private String depart_name;      //部门名称
	
	private String log_lasttime;
	
	private String status;
	
	private String user_mobile;     //用户手机
	
	private String user_tel;        //用户电话
	
	private String user_address;    //用户住址
	
	private String user_birthday;
	
	private String user_sex;        //性别
	
	private String user_email;      //用户邮箱
	
	private String user_qq;          //用户QQ
	
	private String user_wechat;      //用户微信信息
	
	private String work_start_date;
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;
	
	private String remark;
	
	private int sort_code;      //排序
	
	private String secretkey;   //密钥
	
	private String employee_id;   //员工主键
	
	private String user_type;    //用户类型(供货商|服务商|公司员工|承运商|收货商)
	
	
	
	
	
	
	
	
	
}
