package com.springcloud.entity;

import java.io.Serializable;
import java.sql.Date;

import lombok.Data;

/**
 * 网格配置信息实体bean
 * @author Dell
 *
 */
@Data
public class SysGrid implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String grid_id;         //表格ID
	 
	private String menu_id;         //菜单ID
	
	private String grid_name;       //表格名称
	
	private String grid_select;     //表格选择栏
	
	private String grid_row_no;     //grid_row_no
	
	private String grid_page;       //表格分页属性
	
	private String grid_filter;     //表格筛选栏
	
	private String grid_summary;    //表格汇总栏
	
	private String grid_edit;       //表格编辑属性
	
	private int sort_code;          //排序
	
	private String remark;          //备注
	
	private Date create_date;       //创建日期
	
	private String create_username;  //创建用户
	
	private Date modify_date;       //修改时间
	
	private String modify_username;  //修改用户
	
	private String data_url;         //数据源地址
	
	private String grid_width;       //表格宽
	
	private String grid_height;      //表格高度
	
	private String auto_width;       //是否自动宽
	
	private String grid_code;        //列表编码
	
	private String table_name;       //来源表名
	
	private String sub_grid;         //包含子列表
	
	private String grid_pager_id;    //分页栏标识号
	
	private String sort_column;      //排序字段
	
	private String sort_type;        //排序方式
	
	private int grid_rownum;         //每页行数
	
	
	
	
	
	
	
	
	
	
	
	

}
