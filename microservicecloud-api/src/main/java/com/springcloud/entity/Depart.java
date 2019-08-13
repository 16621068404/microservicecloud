package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class Depart implements Serializable{
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String branch_no;
	
	private String depart_no;        //部门编号ID
	
	private String depart_name;      //部门名称
	
	private String depart_leader;
	
	private String depart_tel;
	
	private String depart_fax;
	
	private String depart_email;
	
	private String depart_content;
	
	private String status;
	
	private String create_date;
	
	private String create_username;
	
	private String modify_date;
	
	private String modify_username;
	
	private String time_stamp;
	
	private String remark;                 //备注
	
	private String depart_code;            //部门编码
	
	private int sort_code;                 //排序
	

}
