package com.atguigu.springcloud.Mean.ConfigSql;

import com.springcloud.entity.Mean;
import com.springcloud.entity.PageUtil;

public class MenuConfigSql {
	
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
	
	// 封装sql语句，获取菜单页面数据表格
	public static String findMenuList(PageUtil pageUtil,String parentid) {
		StringBuilder sql = new StringBuilder("select * from sys_menu WHERE delete_mark is null and parent_id = '"+parentid+"'");
        if (pageUtil.getSidx() != null && !pageUtil.getSidx().equals("")) {
        	sql.append(ORDER_BY);
    		sql.append(pageUtil.getSidx());  //获取要排序的字段
    		sql.append(" ");
    		sql.append(pageUtil.getSord());
        }
        
		return sql.toString();
	}

	//封装sql语句,保存菜单信息
	public static String saveMenuInfo(Mean mean) {
		StringBuilder sql = new StringBuilder("insert into sys_menu(menu_id,parent_id,menu_code,menu_name,menu_icon,url_address,menu_type,sort_code,enabled_mark,remark,is_split,create_date,create_username) values ");
		sql.append("(");
		sql.append(mean.getMenu_id() == null || mean.getMenu_id().equals("") ? null+"," : "'"+mean.getMenu_id()+"',");
		sql.append(mean.getParent_id() == null || mean.getParent_id().equals("") ? null+"," : "'"+mean.getParent_id()+"',");
		sql.append(mean.getMenu_code() == null || mean.getMenu_code().equals("") ? null+"," : "'"+mean.getMenu_code()+"',");
		sql.append(mean.getMenu_name() == null || mean.getMenu_name().equals("") ? null+"," : "'"+mean.getMenu_name()+"',");
		sql.append(mean.getMenu_icon() == null || mean.getMenu_icon().equals("") ? null+"," : "'"+mean.getMenu_icon()+"',");
		sql.append(mean.getUrl_address() == null || mean.getUrl_address().equals("") ? null+"," : "'"+mean.getUrl_address()+"',");
		sql.append(mean.getMenu_type() == null || mean.getMenu_type().equals("") ? null+"," : "'"+mean.getMenu_type()+"',");
		sql.append(mean.getSort_code()+",");
		sql.append(mean.getEnabled_mark()+",");
		sql.append(mean.getRemark() == null || mean.getRemark().equals("") ? null+"," : "'"+mean.getRemark()+"',");
		sql.append(mean.getIs_split()+",");
		sql.append(mean.getCreate_date() == null || mean.getCreate_date().equals("") ? null+"," : "'"+mean.getCreate_date()+"',");
		sql.append(mean.getCreate_username() == null || mean.getCreate_username().equals("") ? null : "'"+mean.getCreate_username()+"'");
		sql.append(")");
		return sql.toString();
	}

	//查询菜单信息
	public static String findMenuInfo(String keyValue) {
        StringBuilder sql = new StringBuilder("select * from sys_menu WHERE menu_id = '"+keyValue+"'");
		return sql.toString();
	}

	//封装sql语句，修改菜单信息
	public static String updateMeanInfo(Mean mean) {
		StringBuilder sql = new StringBuilder("UPDATE sys_menu");
		sql.append(SET);
		sql.append("parent_id =").append(PdIsEntiy(mean.getParent_id()));
		sql.append("menu_code =").append(PdIsEntiy(mean.getMenu_code()));
		sql.append("menu_name =").append(PdIsEntiy(mean.getMenu_name()));
		sql.append("menu_icon =").append(PdIsEntiy(mean.getMenu_icon()));
		sql.append("url_address =").append(PdIsEntiy(mean.getUrl_address()));
		sql.append("menu_type =").append(PdIsEntiy(mean.getMenu_type()));
		sql.append("sort_code =").append(mean.getSort_code()+",");
		sql.append("enabled_mark =").append(mean.getEnabled_mark()+",");
		sql.append("is_split =").append(mean.getIs_split()+",");
		sql.append("modify_date =").append(PdIsEntiy(mean.getModify_date()));
		sql.append("modify_username =").append(PdIsEntiy(mean.getModify_username()));
		sql.append("remark =").append(mean.getRemark() == null || mean.getRemark().equals("") ? null : "'"+mean.getRemark()+"'");
		sql.append(WHERE);
		sql.append("menu_id = '"+mean.getMenu_id()+"'");
		return sql.toString();
	}

	
	//判断是否为空，并返回结果
	@SuppressWarnings("unused")
	private static String PdIsEntiy(String str) {
		return str == null || str.equals("") ? null+"," : "'"+str+"',";
	}

	//封装sql语句，删除菜单信息。
	public static String delMenuInfo(String keyValue) {
		StringBuilder sql = new StringBuilder("UPDATE sys_menu");
		sql.append(SET);
		sql.append("enabled_mark = 0,");
		sql.append("delete_mark = 1");
		sql.append(WHERE);
		sql.append("menu_id = '"+keyValue+"'");
		return sql.toString();
	}
	
	
	
	

}
