package com.atguigu.springcloud.Dictionary.ConfigSql;

public class DictionaryConfigSql {
	
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
     public static final String ASC = " asc";
     public static final String DESC = " desc";
     public static final String OFFSET = " offset ";
     public static final String SET = " set ";
     public static final String LEFT_JOIN = " LEFT JOIN ";
     public static final String ON = " on ";
     public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	//封装sql语句，查询所有的字典分类信息
	public static String findAllDictionarySqlInfo() {
		StringBuilder sql = new StringBuilder("select * from base_dataitem  where delete_mark = 0 and enabled_mark = 1");
		sql.append(ORDER_BY);
		sql.append("sort_code");
		return sql.toString();
	}

	// 封装sql语句，获取通用字典页面数据表格
	public static String findPageList(String itemId, String keyword, String condition) {
		StringBuilder sql = new StringBuilder("select * from base_dataitem_detail where delete_mark = 0 and enabled_mark = 1");
		if(itemId != null && !itemId.equals("")) {
			sql.append(AND);
			sql.append("item_id = '"+itemId+"'");
		}
		if(condition != null && !condition.equals("")) {
			if (keyword != null && !keyword.equals("")) {
				sql.append(AND);
				sql.append(condition + " like '%"+keyword+"%'");
			}
		}
		
		
		return sql.toString();
	}

}
