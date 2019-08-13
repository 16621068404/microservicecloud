package com.atguigu.springcloud.Department.ConfigSql;

import com.springcloud.entity.Depart;
import com.springcloud.entity.PageUtil;

public class DepartmentConfigSql {

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
	
	// 封装sql语句,查询记录数
	public static String findCountRole(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select count(1) from sys_department");
		sql.append(WHERE);
		sql.append("status = '1'");
		return sql.toString();
	}
    
	// 封装sql语句，获取部门页面数据表格数据
	public static String findPageList(PageUtil pageUtil) {
		StringBuilder sql = new StringBuilder("select branch_no,depart_no,depart_name,depart_leader,depart_tel,depart_fax,depart_email,depart_content, (case when status = '1' then '有效' else '无效' end) as status,remark from sys_department");
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

	//保存部门基本信息
	public static String saveDepartmentForm(Depart depart) {
		StringBuilder sql = new StringBuilder("insert into sys_department(branch_no,depart_no,status,depart_name,depart_leader,depart_tel,depart_fax,depart_email,depart_content,remark,create_date,create_username) values ");
		sql.append("(");
		sql.append(depart.getBranch_no() == null || depart.getBranch_no().equals("") ? null+"," : "'"+depart.getBranch_no()+"',");
		sql.append(depart.getDepart_no() == null || depart.getDepart_no().equals("") ? null+"," : "'"+depart.getDepart_no()+"',");
		sql.append(depart.getStatus() == null || depart.getStatus().equals("") ? null+"," : "'"+depart.getStatus()+"',");
		sql.append(depart.getDepart_name() == null || depart.getDepart_name().equals("") ? null+"," : "'"+depart.getDepart_name()+"',");
		sql.append(depart.getDepart_leader() == null || depart.getDepart_leader().equals("") ? null+"," : "'"+depart.getDepart_leader()+"',");
		sql.append(depart.getDepart_tel() == null || depart.getDepart_tel().equals("") ? null+"," : "'"+depart.getDepart_tel()+"',");
		sql.append(depart.getDepart_fax() == null || depart.getDepart_fax().equals("") ? null+"," : "'"+depart.getDepart_fax()+"',");
		sql.append(depart.getDepart_email() == null || depart.getDepart_email().equals("") ? null+"," : "'"+depart.getDepart_email()+"',");
		sql.append(depart.getDepart_content() == null || depart.getDepart_content().equals("") ? null+"," : "'"+depart.getDepart_content()+"',");
		sql.append(depart.getRemark() == null || depart.getRemark().equals("") ? null+"," : "'"+depart.getRemark()+"',");
		sql.append(depart.getCreate_date() == null || depart.getCreate_date().equals("") ? null+"," : "'"+depart.getCreate_date()+"',");
		sql.append(depart.getCreate_username() == null || depart.getCreate_username().equals("") ? null : "'"+depart.getCreate_username()+"'");
		sql.append(")");
		return sql.toString();
	}

	// 封装sql语句，查询部门信息
	public static String findDepartInfo(String keyValue) {
		StringBuilder sql = new StringBuilder("select * from sys_department WHERE depart_no = '"+keyValue+"'");
		return sql.toString();
	}

	//封装sql语句，修改部门信息
	public static String updateDepartInfo(Depart depart) {
		StringBuilder sql = new StringBuilder("UPDATE sys_department");
		sql.append(SET);
		sql.append("status =").append(depart.getStatus() == null || depart.getStatus().equals("") ? null+"," : "'"+depart.getStatus()+"',");
		sql.append("depart_name =").append(depart.getDepart_name() == null || depart.getDepart_name().equals("") ? null+"," : "'"+depart.getDepart_name()+"',");
		sql.append("depart_leader =").append(depart.getDepart_leader() == null || depart.getDepart_leader().equals("") ? null+"," : "'"+depart.getDepart_leader()+"',");
		sql.append("depart_tel =").append(depart.getDepart_tel() == null || depart.getDepart_tel().equals("") ? null+"," : "'"+depart.getDepart_tel()+"',");
		sql.append("depart_fax =").append(depart.getDepart_fax() == null || depart.getDepart_fax().equals("") ? null+"," : "'"+depart.getDepart_fax()+"',");
		sql.append("depart_email =").append(depart.getDepart_email() == null || depart.getDepart_email().equals("") ? null+"," : "'"+depart.getDepart_email()+"',");
		sql.append("depart_content =").append(depart.getDepart_content() == null || depart.getDepart_content().equals("") ? null+"," : "'"+depart.getDepart_content()+"',");
		sql.append("modify_date =").append(depart.getModify_date() == null || depart.getModify_date().equals("") ? null+"," : "'"+depart.getModify_date()+"',");
		sql.append("modify_username =").append(depart.getModify_username() == null || depart.getModify_username().equals("") ? null+"," : "'"+depart.getModify_username()+"',");
		sql.append("remark =").append(depart.getRemark() == null || depart.getRemark().equals("") ? null : "'"+depart.getRemark()+"'");
		sql.append(WHERE);
		sql.append("depart_no = '"+depart.getDepart_no()+"'");
		return sql.toString();
	}

}
