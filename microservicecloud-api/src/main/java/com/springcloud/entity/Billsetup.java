package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

/**
 * 单据编号规则设置表对应实体bean
 * @author Dell
 *
 */
@Data
public class Billsetup implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String bill_para;       //单据参数
	
	private String bill_prefix;     //单据前缀
	
	private String is_companyno;    //公司编码6位
	
	private String is_branch;       //是否分站编号6位
	
	private String is_year;         //是否包含年份
	
	private String year_type;       //年份位数
	
	private String is_month;        //是否包含月份
	
	private String is_day;          //是否包含日期
	
	private String bill_length;     //流水号长度
	
	private String remark;          //说明
	
	
}
