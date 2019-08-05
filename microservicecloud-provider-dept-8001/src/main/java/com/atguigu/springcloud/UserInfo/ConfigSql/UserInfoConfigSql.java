package com.atguigu.springcloud.UserInfo.ConfigSql;


public class UserInfoConfigSql {
  
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
	
     
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
		return sql.toString();
	}
	
	
	
	
  
      
     
     
	

}
