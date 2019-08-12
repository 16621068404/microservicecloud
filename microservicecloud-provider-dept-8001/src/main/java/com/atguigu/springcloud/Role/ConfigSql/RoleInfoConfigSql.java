package com.atguigu.springcloud.Role.ConfigSql;

import java.util.List;

import com.springcloud.entity.Authorize;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.tool.StringUtil;

public class RoleInfoConfigSql {
  
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
     public static final String ASC = " asc";
     public static final String DESC = " desc";
     public static final String OFFSET = " offset ";
     public static final String SET = " set ";
     
     

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

	// 封装sql语句,保存角色信息
	public static String saveRoleForm(Role role) {
		
		StringBuilder sql = new StringBuilder("insert into sys_role(branch_no,role_no,role_name,remark,status,create_date,create_username) values ");
		sql.append("(");
		sql.append(role.getBranch_no() == null || role.getBranch_no().equals("") ? null+"," : "'"+role.getBranch_no()+"',");
		sql.append(role.getRole_no() == null || role.getRole_no().equals("") ? null+"," : "'"+role.getRole_no()+"',");
		sql.append(role.getRole_name() == null || role.getRole_name().equals("") ? null+"," : "'"+role.getRole_name()+"',");
		sql.append(role.getRemark() == null || role.getRemark().equals("") ? null+"," : "'"+role.getRemark()+"',");
		sql.append(role.getStatus() == null || role.getStatus().equals("") ? null+"," : "'"+role.getStatus()+"',");
		sql.append(role.getCreate_date() == null || role.getCreate_date().equals("") ? null+"," : "'"+role.getCreate_date()+"',");
		sql.append(role.getCreate_username() == null || role.getCreate_username().equals("") ? null : "'"+role.getCreate_username()+"'");
		sql.append(")");
		return sql.toString();
	}
	// 封装sql语句，查询角色信息
	public static String findRoleInfo(String keyValue) {
		StringBuilder sql = new StringBuilder("SELECT * from sys_role");
		sql.append(WHERE);
		sql.append("role_no='"+keyValue+"'");
		return sql.toString();
	}

	//封装sql语句，修改角色信息
	public static String updateRoleInfo(Role role) {
		StringBuilder sql = new StringBuilder("UPDATE sys_role");
		sql.append(SET);
		sql.append("status =").append(role.getStatus() == null || role.getStatus().equals("") ? null+"," : "'"+role.getStatus()+"',");
		sql.append("role_name =").append(role.getRole_name() == null || role.getRole_name().equals("") ? null+"," : "'"+role.getRole_name()+"',");
		sql.append("modify_date =").append(role.getModify_date() == null || role.getModify_date().equals("") ? null+"," : "'"+role.getModify_date()+"',");
		sql.append("modify_username =").append(role.getModify_username() == null || role.getModify_username().equals("") ? null+"," : "'"+role.getModify_username()+"',");
		sql.append("remark =").append(role.getRemark() == null || role.getRemark().equals("") ? null : "'"+role.getRemark()+"'");
		sql.append(WHERE);
		sql.append("role_no = '"+role.getRole_no()+"'");
		return sql.toString();
	}

	
	//封装sql语句，查询所有的菜单信息
	public static String findMeanInfo(String is_super) {
		StringBuilder sql = new StringBuilder("SELECT * from sys_menu where enabled_mark = '1'");
		//如果是超级管理员，可以看到【内部管控 id:】
		if (is_super.equals("1")) {
			//超级管理员
		} else {
		  sql.append(AND);
		  sql.append("menu_id !='2FCBF5E7-5A66-4169-965C-A7BF1F113D31'");
		}
		return sql.toString();
	}

	//查询对应角色已经授权的菜单，来判断该菜单能否被选中
	//封装sql语句
	public static String findAuthorizeInfo(Authorize authorize) {

		StringBuilder sql = new StringBuilder("SELECT * from sys_authorize");
		sql.append(WHERE);
		sql.append("item_type='"+authorize.getItem_type()+"'");
		sql.append(AND);
		sql.append("object_id='"+authorize.getObject_id()+"'");
		sql.append(AND);
		sql.append("category='"+authorize.getCategory()+"'");
		sql.append("and item_id IS NOT NULL");  //不为空
		return sql.toString();
	}

	//封装sql语句，执行要删除的授权菜单
	public static String delteAuthorize(List<Authorize> delMean, Authorize authorize2) {
		StringBuilder str = new StringBuilder();
		for (Authorize authorize : delMean) {
			str.append(authorize.getItem_id()).append(",");
		}
		/*
		 * DELETE FROM table_name WHERE some_column=some_value;
		 * column_name IN (value1,value2,...);
		 */
		StringBuilder sql = new StringBuilder("DELETE FROM sys_authorize");
		sql.append(WHERE);
		sql.append("item_id IN (" + StringUtil.conversionDataForIn(str.toString()));
		sql.append(")");
		sql.append(AND);
		sql.append("item_type='"+authorize2.getItem_type()+"'");
		sql.append(AND);
		sql.append("object_id='"+authorize2.getObject_id()+"'");
		sql.append(AND);
		sql.append("category='"+authorize2.getCategory()+"'");
		return sql.toString();
	}
	
	//封装sql语句，执行要新增的授权菜单[批量新增]
	public static String addAuthorize(List<Authorize> addMean) {
//    	批量添加
//    	String sql2 = "insert into zbom values (100002,'小明'),(100003,'小明')";
//    	int[] addBatch = addBatch(sql2);
//    	System.out.println("批量添加了"+addBatch[0]+"条");
		
		StringBuilder sql = new StringBuilder("insert into sys_authorize (authorize_id,category,object_id,item_type,item_id,sort_code,create_date,create_username,modify_date,modify_username,remark,parent_id) values ");
		for (Authorize authorize : addMean) {
		  sql.append("(");
		  sql.append(authorize.getAuthorize_id() == null || authorize.getAuthorize_id().equals("") ? null+"," : "'"+authorize.getAuthorize_id()+"',");
		  sql.append(authorize.getCategory()+",");
		  sql.append(authorize.getObject_id() == null || authorize.getObject_id().equals("") ? null+"," : "'"+authorize.getObject_id()+"',");
		  sql.append(authorize.getItem_type()+",");
		  sql.append(authorize.getItem_id() == null || authorize.getItem_id().equals("") ? null+"," : "'"+authorize.getItem_id()+"',");
		  sql.append(authorize.getSort_code()+",");
		  sql.append(authorize.getCreate_date() == null || authorize.getCreate_date().equals("") ? null+"," : "'"+authorize.getCreate_date()+"',");
		  sql.append(authorize.getCreate_username() == null || authorize.getCreate_username().equals("") ? null+"," : "'"+authorize.getCreate_username()+"',");
		  sql.append(authorize.getModify_date() == null || authorize.getModify_date().equals("") ? null+"," : "'"+authorize.getModify_date()+"',");
		  sql.append(authorize.getModify_username() == null || authorize.getModify_username().equals("") ? null+"," : "'"+authorize.getModify_username()+"',");
		  sql.append(authorize.getRemark() == null || authorize.getRemark().equals("") ? null+"," : "'"+authorize.getRemark()+"',");
		  sql.append(authorize.getParent_id() == null || authorize.getParent_id().equals("") ? null : "'"+authorize.getParent_id()+"'");
		  sql.append("),");
		}	
		return sql.toString().substring(0, sql.toString().length()-1);
	}
	
	
	
	
  
      
     
     
	

}
