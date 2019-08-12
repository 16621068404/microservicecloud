package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

/**
 * 系统单据编号最大值的实体bean
 * @author Dell
 *
 */
@Data
public class Billvalue implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String bill_prefix;     //前缀
	
	private String bill_branch;     //分站
	
	private String bill_year;       //年
	
	private String bill_month;      //月
	
	private String bill_day;        //日
	
	private String bill_value;      //最大值
	
	private String create_date;
	
	private String create_username;
	
    private String modify_date;
	
	private String modify_username;
	
	

}
