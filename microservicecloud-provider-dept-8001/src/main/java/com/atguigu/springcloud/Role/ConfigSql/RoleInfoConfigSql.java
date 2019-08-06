package com.atguigu.springcloud.Role.ConfigSql;

import com.springcloud.entity.PageUtil;

public class RoleInfoConfigSql {
  
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
     public static final String ASC = " asc";
     public static final String DESC = " desc";
     public static final String OFFSET = " offset ";
     
     
     

	//封装sql语句,查询角色的总记录数
	public static String findCountRole(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select count(1) from sys_role");
		sql.append(WHERE);
		sql.append("status = '1'");
		return sql.toString();
	}
	
	//封装sql语句，获取角色页面数据表格数据
	//ifnull(ad.batch,'')
	public static String findPageList(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select role_no,role_name,create_date, (case when status = '1' then '有效' else '无效' end) as status,remark from sys_role");
		sql.append(WHERE);
		sql.append("status = '1'");
		sql.append(ORDER_BY);
		sql.append(pageUtil.getSidx());  //获取要排序的字段
		sql.append(" ");
		sql.append(pageUtil.getSord());
		sql.append(LIMIT);
		sql.append(pageUtil.getPageSize());
		sql.append(OFFSET);
		sql.append(pageUtil.getTempVal());
		return sql.toString();
	}
	
	
	
	
  
      
     
     
	

}
