package com.springcloud.entity;

import lombok.Data;

@Data
public class SysLog {
	
	private String log_id;               //日志主键
	
	private int category_id;             // 分类 Id 1-登陆       2-访问      3-操作      4-异常
	
	private String log_content;          //来源日志内容
	
	private String operate_time;         //操作时间
	
	private String operate_user_id;      //操作用户主编号
	
	private String operate_account;      //操作用户
	
	private String operate_type;         //操作类型
	
	private String module_id;            //系统功能主键
	
	private String module_name;          //系统功能名称
	
	private String ip_address;           //IP地址
	
	private String ip_address_name;      //IP地址所在城市
	
	private String login_cust_no;        //登录公司编号
	
	private String login_cust_name;      //登录公司名称
	
	private String login_branch_no;      //登录站点编号
	
	private String login_branch_name;    //登录站点名称
	
	private String browser_name;         //浏览器名称
	
	private String status;               //执行状态
	
	private String remark;               //备注
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;
	
	private String host_name;
	
	private String system_type;
	

}
