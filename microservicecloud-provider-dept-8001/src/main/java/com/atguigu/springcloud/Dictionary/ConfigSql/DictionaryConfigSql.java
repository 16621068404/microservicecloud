package com.atguigu.springcloud.Dictionary.ConfigSql;

import com.springcloud.entity.Dictionary;
import com.springcloud.entity.DictionaryDetail;

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

	//封装sql语句,保存字典明细信息
	public static String saveDictionaryDetailForm(DictionaryDetail dictionaryDetail) {
		StringBuilder sql = new StringBuilder("insert into base_dataitem_detail(item_detail_id,item_id,parent_id,remark,item_name,item_value,sort_code,delete_mark,enabled_mark,create_date,create_username) values ");
		sql.append("(");
		sql.append(dictionaryDetail.getItem_detail_id() == null || dictionaryDetail.getItem_detail_id().equals("") ? null+"," : "'"+dictionaryDetail.getItem_detail_id()+"',");
		sql.append(dictionaryDetail.getItem_id() == null || dictionaryDetail.getItem_id().equals("") ? null+"," : "'"+dictionaryDetail.getItem_id()+"',");
		sql.append(dictionaryDetail.getParent_id() == null || dictionaryDetail.getParent_id().equals("") ? null+"," : "'"+dictionaryDetail.getParent_id()+"',");
		sql.append(dictionaryDetail.getRemark() == null || dictionaryDetail.getRemark().equals("") ? null+"," : "'"+dictionaryDetail.getRemark()+"',");
		sql.append(dictionaryDetail.getItem_name() == null || dictionaryDetail.getItem_name().equals("") ? null+"," : "'"+dictionaryDetail.getItem_name()+"',");
		sql.append(dictionaryDetail.getItem_value() == null || dictionaryDetail.getItem_value().equals("") ? null+"," : "'"+dictionaryDetail.getItem_value()+"',");
		sql.append(dictionaryDetail.getSort_code()+",");
		sql.append(dictionaryDetail.getDelete_mark()+",");
		sql.append(dictionaryDetail.getEnabled_mark()+",");
		sql.append(dictionaryDetail.getCreate_date() == null || dictionaryDetail.getCreate_date().equals("") ? null+"," : "'"+dictionaryDetail.getCreate_date()+"',");
		sql.append(dictionaryDetail.getCreate_username() == null || dictionaryDetail.getCreate_username().equals("") ? null : "'"+dictionaryDetail.getCreate_username()+"'");
		sql.append(")");
		return sql.toString();
	}

	//封装sql语句，修改字典明细信息
	public static String updateDictionaryDetailInfo(DictionaryDetail dictionaryDetail) {
		StringBuilder sql = new StringBuilder("UPDATE base_dataitem_detail");
		sql.append(SET);
		sql.append("item_value =").append(dictionaryDetail.getItem_value() == null || dictionaryDetail.getItem_value().equals("") ? null+"," : "'"+dictionaryDetail.getItem_value()+"',");
		sql.append("item_name =").append(dictionaryDetail.getItem_name() == null || dictionaryDetail.getItem_name().equals("") ? null+"," : "'"+dictionaryDetail.getItem_name()+"',");
		sql.append("sort_code =").append(dictionaryDetail.getSort_code()+",");
		sql.append("enabled_mark =").append(dictionaryDetail.getEnabled_mark()+",");
		sql.append("modify_date =").append(dictionaryDetail.getModify_date() == null || dictionaryDetail.getModify_date().equals("") ? null+"," : "'"+dictionaryDetail.getModify_date()+"',");
		sql.append("modify_username =").append(dictionaryDetail.getModify_username() == null || dictionaryDetail.getModify_username().equals("") ? null+"," : "'"+dictionaryDetail.getModify_username()+"',");
		sql.append("remark =").append(dictionaryDetail.getRemark() == null || dictionaryDetail.getRemark().equals("") ? null : "'"+dictionaryDetail.getRemark()+"'");
		sql.append(WHERE);
		sql.append("item_detail_id = '"+dictionaryDetail.getItem_detail_id()+"'");
		return sql.toString();
	}

	//封装sql语句，查询字典明细信息
	public static String findDictionaryDetailInfo(String keyValue) {
		StringBuilder sql = new StringBuilder("select * from base_dataitem_detail WHERE item_detail_id = '"+keyValue+"'");
		
		return sql.toString();
	}

	//封装sql语句，删除字典明细信息。
	public static String delDictionaryDetail(String keyValue) {
		StringBuilder sql = new StringBuilder("UPDATE base_dataitem_detail");
		sql.append(SET);
		sql.append("enabled_mark = 0,");
		sql.append("delete_mark = 1");
		sql.append(WHERE);
		sql.append("item_detail_id = '"+keyValue+"'");
		return sql.toString();
	}

	//封装sql语句,保存字典分类信息
	public static String saveDictionaryInfo(Dictionary dictionary) {
		StringBuilder sql = new StringBuilder("insert into base_dataitem(item_id,parent_id,item_code,item_name,is_tree,sort_code,delete_mark,enabled_mark,remark,create_date,create_username) values ");
		sql.append("(");
		sql.append(dictionary.getItem_id() == null || dictionary.getItem_id().equals("") ? null+"," : "'"+dictionary.getItem_id()+"',");
		sql.append(dictionary.getParent_id() == null || dictionary.getParent_id().equals("") ? null+"," : "'"+dictionary.getParent_id()+"',");
		sql.append(dictionary.getItem_code() == null || dictionary.getItem_code().equals("") ? null+"," : "'"+dictionary.getItem_code()+"',");
		sql.append(dictionary.getItem_name() == null || dictionary.getItem_name().equals("") ? null+"," : "'"+dictionary.getItem_name()+"',");
		sql.append(dictionary.getIs_tree()+",");
		sql.append(dictionary.getSort_code()+",");
		sql.append(dictionary.getDelete_mark()+",");
		sql.append(dictionary.getEnabled_mark()+",");
		sql.append(dictionary.getRemark() == null || dictionary.getRemark().equals("") ? null+"," : "'"+dictionary.getRemark()+"',");
		sql.append(dictionary.getCreate_date() == null || dictionary.getCreate_date().equals("") ? null+"," : "'"+dictionary.getCreate_date()+"',");
		sql.append(dictionary.getCreate_username() == null || dictionary.getCreate_username().equals("") ? null : "'"+dictionary.getCreate_username()+"'");
		sql.append(")");
		return sql.toString();
	}

	//封装sql语句，查询字典分类信息
	public static String findDictionaryInfo(String keyValue) {
	StringBuilder sql = new StringBuilder("select * from base_dataitem WHERE item_id = '"+keyValue+"'");
		return sql.toString();
	}

	// 封装sql语句，修改字典分类信息
	public static String updateDictionaryInfo(Dictionary dictionary) {
		StringBuilder sql = new StringBuilder("UPDATE base_dataitem");
		sql.append(SET);
		sql.append("parent_id =").append(dictionary.getParent_id() == null || dictionary.getParent_id().equals("") ? null+"," : "'"+dictionary.getParent_id()+"',");
		sql.append("item_name =").append(dictionary.getItem_name() == null || dictionary.getItem_name().equals("") ? null+"," : "'"+dictionary.getItem_name()+"',");
		sql.append("item_code =").append(dictionary.getItem_code() == null || dictionary.getItem_code().equals("") ? null+"," : "'"+dictionary.getItem_code()+"',");
		sql.append("sort_code =").append(dictionary.getSort_code()+",");
		sql.append("is_tree =").append(dictionary.getIs_tree()+",");
		sql.append("enabled_mark =").append(dictionary.getEnabled_mark()+",");
		sql.append("modify_date =").append(dictionary.getModify_date() == null || dictionary.getModify_date().equals("") ? null+"," : "'"+dictionary.getModify_date()+"',");
		sql.append("modify_username =").append(dictionary.getModify_username() == null || dictionary.getModify_username().equals("") ? null+"," : "'"+dictionary.getModify_username()+"',");
		sql.append("remark =").append(dictionary.getRemark() == null || dictionary.getRemark().equals("") ? null : "'"+dictionary.getRemark()+"'");
		sql.append(WHERE);
		sql.append("item_id = '"+dictionary.getItem_id()+"'");
		return sql.toString();
	}

	//删除字典分类信息
	public static String delDictionary(String keyValue) {
		StringBuilder sql = new StringBuilder("UPDATE base_dataitem");
		sql.append(SET);
		sql.append("enabled_mark = 0,");
		sql.append("delete_mark = 1");
		sql.append(WHERE);
		sql.append("item_id = '"+keyValue+"'");
		return sql.toString();
	}

	
}
