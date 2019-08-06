package com.atguigu.springcloud.UserInfo.ConfigSql;

import com.springcloud.entity.PageUtil;

public class UserInfoConfigSql {
  
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
     public static final String ASC = " asc";
     public static final String DESC = " desc";
     public static final String OFFSET = " offset ";
     
     
     //封装sql语句，根据grid_code关键字,查询表格的配置信息,是否分页等..
	 public static String findGridByGridCode(String grid_code) {
		StringBuilder sql = new StringBuilder("select * from sys_grid");
		sql.append(WHERE);
		sql.append("grid_code = '"+grid_code+"'");
		return sql.toString();
	}

	//封装sql语句，根据grid_id关键字,查询表格的字段信息
	public static String findColumnByGridId(String grid_id) {
		StringBuilder sql = new StringBuilder("select * from sys_column");
		sql.append(WHERE);
		sql.append("grid_id = '"+grid_id+"'");
		sql.append(ORDER_BY);
		sql.append("sort_code");
		
		
		return sql.toString();
	}

	//封装sql语句,查询用户的总记录数
	public static String findCountUser(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select count(1) from sys_user");
		sql.append(WHERE);
		sql.append("is_super != '1'");
		return sql.toString();
	}
	
	//封装sql语句，获取用户页面数据表格数据
	//ifnull(ad.batch,'')
	public static String findPageList(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select use.branch_no,use.depart_no,use.user_no,use.user_name ,use.user_logid ,use.user_logpass ,use.log_lasttime ,use.status ,use.pic_url ,use.is_super ,use.user_mobile ,use.user_tel ,use.user_address,use.user_birthday ,use.user_sex ,use.user_email ,use.user_qq ,use.user_wechat ,use.work_start_date ,use.create_date ,use.create_username ,use.modify_date,use.modify_username ,use.remark,use.skin_type ,use.role_no ,use.sort_code ,use.custom_no ,use.custom_name ,use.secretkey ,use.employee_id ,use.user_type,COALESCE(dep.depart_name,'') as depart_name from sys_user use");
		sql.append(" LEFT JOIN sys_department dep ON use.depart_no = dep.depart_no ");
		sql.append(WHERE);
		sql.append("use.is_super != '1'");
		sql.append(ORDER_BY);
		sql.append("use."+pageUtil.getSidx());  //获取要排序的字段
		sql.append(" ");
		sql.append(pageUtil.getSord());
		sql.append(LIMIT);
		sql.append(pageUtil.getPageSize());
		sql.append(OFFSET);
		sql.append(pageUtil.getTempVal());
		return sql.toString();
	}
	
	
	
	
  
      
     
     
	

}
