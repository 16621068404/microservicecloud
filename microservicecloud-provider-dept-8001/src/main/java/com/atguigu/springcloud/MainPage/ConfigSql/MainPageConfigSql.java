package com.atguigu.springcloud.MainPage.ConfigSql;

import com.springcloud.tool.StringUtil;

public class MainPageConfigSql {
	  public static final String WHERE = " where ";
      public static final String AND = " and ";
      public static final String LIMIT = " limit ";
      public static final String FROM = " from ";
      public static final String ORDER_BY = " order by ";
   
       
      
      
	
	//查询主页面的sql语句
	public static String findMainPageSql (String role_no) {
		
		//一个用户可能含有多个角色
		role_no = StringUtil.conversionDataForIn(role_no);
		StringBuilder sql = new StringBuilder("SELECT menu_id, parent_id, menu_code, menu_name, menu_icon, menu_type,url_address,enabled_mark,is_split");
		sql.append(FROM);
		sql.append("sys_menu menu");
		sql.append(WHERE);
		sql.append("menu.menu_id IN (");
		sql.append("SELECT sysau.item_id FROM sys_authorize sysau WHERE sysau.object_id IN ("+role_no+"))");
		sql.append(AND);
		sql.append("menu.enabled_mark = 1");
		sql.append(ORDER_BY);
		sql.append("menu.sort_code");
		return sql.toString();
		
	}
	
	//根据用户的id，查询用户的角色信息;
	public static String findUserNoSql (String userNo) {
		 StringBuilder sql = new StringBuilder("SELECT role_no,branch_no,user_name,pic_url,is_super,role_no,skin_type,custom_no,custom_name from sys_user");
		 sql.append(WHERE);
		 sql.append("user_no = '"+userNo+"'");
		 return sql.toString();
	}
	
	
	
}
