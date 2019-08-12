package com.springcloud.entity;

import java.io.Serializable;

import lombok.Data;

/**
 * 系统用户角色授权表
 * @author Dell
 *
 */
@Data
public class Authorize implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String authorize_id;    //授权功能主键
	
	private int category;           //对象分类:1-部门2-角色3-岗位4-职位5-工作组
	
	private String object_id;       //对象主键  角色id
	
	private int item_type;          //项目类型:1-菜单2-按钮3-视图4表单
	
	private String item_id;         //项目主键  【向上箭头】  1-菜单2-按钮3-视图4表单
	
	private int sort_code;          //排序码
	
	private String create_date;
	
	private String create_username;
	
    private String modify_date;
	
	private String modify_username;
	
	private String remark;          //备注
	
	private String parent_id;       //上级项目主建
	
	

}
