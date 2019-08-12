package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

@Data
public class Depart implements Serializable{
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String depart_no;        //部门编号
	
	private String depart_name;      //部门名称

}
