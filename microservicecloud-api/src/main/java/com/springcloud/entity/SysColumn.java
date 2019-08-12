package com.springcloud.entity;

import java.io.Serializable;
import java.sql.Date;

import lombok.Data;

/**
 * 表格字段配置信息
 * @author Dell
 *
 */
@Data
public class SysColumn implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String column_id;    //列主键
	
	private String menu_id;      //菜单主键
	
	private String grid_id;      //表格主键
	
	private String column_code;  //列编码
	
	private String column_name;  //列名称
	
	private int sort_code;       //顺序号
	
	private String remark;       //备注
	
	private int is_show;         //是否显示
	
	private String column_width; //字段宽度
	
	private String column_formatter; //显示格式
	
	private String column_label;   //字段标题
	
	private String column_align;    //显示居左中右
	
	private Date create_date;       //创建时间
	
	private String create_username; //创建人
	
	private Date modify_date;       //修改时间
	
	private String modify_username;  //修改用户
	
	private String column_type;      //字段类型
	
	private String primary_key; 
	
	private String column_style;     //列样式
	
	private String column_edit;      //是否编辑
	
	private String must_input;       //是否必输
	
	private String default_value;    //默认值
	
	private String column_frozen;    //是否冻结
	
	private String dropdown_parameter; //下拉框传入参数
	
	private String dropdown_name;      //下拉框名称
	
	private String column_sort;       //默认排序
	
	private String proportion;         //所占比例
	
	private int digit_number;       //小数位数
	
	private String onchange;           //改变事件
	
	private String dropdown_other_column; //下拉框关联赋值字段
	
	private String dropdown_filter_parameter; //下拉框过滤条件
	
	
}
