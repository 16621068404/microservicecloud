package com.atguigu.springcloud.UserInfo.ConfigSql;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
import com.springcloud.tool.MD5Utils;

public class UserInfoConfigSql {
  
	 public static final String WHERE = " where ";
     public static final String AND = " and ";
     public static final String LIMIT = " limit ";
     public static final String FROM = " from ";
     public static final String ORDER_BY = " order by ";
     public static final String ASC = " asc";
     public static final String DESC = " desc";
     public static final String OFFSET = " offset ";
     public static final String SET = " set ";
     
     
     
     
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

	//封装sql语句,查询部门信息
	public static String findDepartInfo() {
		StringBuilder sql = new StringBuilder("select depart_no,depart_name from sys_department");
		return sql.toString();
	}

	//封装sql语句，获取单据编号规则设置表有关用户单据的【sys_user】单据的信息
	public static String findRulesInfo(String sysuser) {
		StringBuilder sql = new StringBuilder("SELECT * from sys_billsetup");
		sql.append(WHERE);
		sql.append("bill_para = '"+sysuser+"'");
		return sql.toString();
	}

	//封装sql语句,查询当前流水号的长度   系统单据编号最大值  sys_billvalue  Billvalue  
	public static String findBillValue(String BILL_PREFIX) {
		StringBuilder sql = new StringBuilder("SELECT * from sys_billvalue where bill_prefix = '"+BILL_PREFIX+"' ");
		return sql.toString();
	}

	//封装sql语句,进行用户数据的插入
	public static String insertUserInfo(User saveUser) {
		
		//将密码进行md5加密
		String pwd = MD5Utils.string2MD5("123");
		//封装密码
		saveUser.setUser_logpass(pwd);
		
		StringBuilder sql = new StringBuilder("insert into sys_user(branch_no,depart_no,user_no,user_name,user_logid,user_logpass,log_lasttime,status,pic_url,is_super,user_mobile,user_tel,user_address,user_birthday,user_sex,user_email,user_qq,user_wechat,work_start_date,create_date,create_username,modify_date,modify_username,remark,skin_type,role_no,sort_code,custom_no,custom_name,secretkey,employee_id,user_type) values ");
		sql.append("(");
		sql.append(saveUser.getBranch_no() == null || saveUser.getBranch_no().equals("") ? null+"," : "'"+saveUser.getBranch_no()+"',");
		sql.append(saveUser.getDepart_no() == null || saveUser.getDepart_no().equals("") ? null+"," : "'"+saveUser.getDepart_no()+"',");
		sql.append(saveUser.getUser_no() == null || saveUser.getUser_no().equals("") ? null+"," : "'"+saveUser.getUser_no()+"',");
		sql.append(saveUser.getUser_name() == null || saveUser.getUser_name().equals("") ? null+"," : "'"+saveUser.getUser_name()+"',");
		sql.append(saveUser.getUser_logid() == null || saveUser.getUser_logid().equals("") ? null+"," : "'"+saveUser.getUser_logid()+"',");
		sql.append(saveUser.getUser_logpass() == null || saveUser.getUser_logpass().equals("") ? null+"," : "'"+saveUser.getUser_logpass()+"',");
		sql.append(saveUser.getLog_lasttime() == null || saveUser.getLog_lasttime().equals("") ? null+"," : "'"+saveUser.getLog_lasttime()+"',");
		sql.append(saveUser.getStatus() == null || saveUser.getStatus().equals("") ? null+"," : "'"+saveUser.getStatus()+"',");
		sql.append(saveUser.getPic_url() == null || saveUser.getPic_url().equals("") ? null+"," : "'"+saveUser.getPic_url()+"',");
		sql.append("'0',");
		sql.append(saveUser.getUser_mobile() == null || saveUser.getUser_mobile().equals("") ? null+"," : "'"+saveUser.getUser_mobile()+"',");
		sql.append(saveUser.getUser_tel() == null || saveUser.getUser_tel().equals("") ? null+"," : "'"+saveUser.getUser_tel()+"',");
		sql.append(saveUser.getUser_address() == null || saveUser.getUser_address().equals("") ? null+"," : "'"+saveUser.getUser_address()+"',");
		sql.append(saveUser.getUser_birthday() == null || saveUser.getUser_birthday().equals("") ? null+"," : "'"+saveUser.getUser_birthday()+"',");
		sql.append(saveUser.getUser_sex() == null || saveUser.getUser_sex().equals("") ? null+"," : "'"+saveUser.getUser_sex()+"',");
		sql.append(saveUser.getUser_email() == null || saveUser.getUser_email().equals("") ? null+"," : "'"+saveUser.getUser_email()+"',");
		sql.append(saveUser.getUser_qq() == null || saveUser.getUser_qq().equals("") ? null+"," : "'"+saveUser.getUser_qq()+"',");
		sql.append(saveUser.getUser_wechat() == null || saveUser.getUser_wechat().equals("") ? null+"," : "'"+saveUser.getUser_wechat()+"',");
		sql.append(saveUser.getWork_start_date() == null  || saveUser.getWork_start_date().equals("") ? null+"," : "'"+saveUser.getWork_start_date()+"',");
		sql.append(saveUser.getCreate_date() == null || saveUser.getCreate_date().equals("") ? null+"," : "'"+saveUser.getCreate_date()+"',");
		sql.append(saveUser.getCreate_username() == null || saveUser.getCreate_username().equals("") ? null+"," : "'"+saveUser.getCreate_username()+"',");
		sql.append(saveUser.getModify_date() == null || saveUser.getModify_date().equals("") ? null+"," : "'"+saveUser.getModify_date()+"',");
		sql.append(saveUser.getModify_username() == null || saveUser.getModify_username().equals("") ? null+"," : "'"+saveUser.getModify_username()+"',");
		sql.append(saveUser.getRemark() == null || saveUser.getRemark().equals("") ? null+"," : "'"+saveUser.getRemark()+"',");
		sql.append(saveUser.getSkin_type() == null || saveUser.getSkin_type().equals("") ? null+"," : "'"+saveUser.getSkin_type()+"',");
		sql.append(saveUser.getRole_no() == null || saveUser.getRole_no().equals("") ? null+"," : "'"+saveUser.getRole_no()+"',");
		sql.append(saveUser.getSort_code()+",");
		sql.append(saveUser.getCustom_no() == null || saveUser.getCustom_no().equals("") ? null+"," : "'"+saveUser.getCustom_no()+"',");
		sql.append(saveUser.getCustom_name() == null || saveUser.getCustom_name().equals("") ? null+"," : "'"+saveUser.getCustom_name()+"',");
		sql.append(saveUser.getSecretkey() == null || saveUser.getSecretkey().equals("") ? null+"," : "'"+saveUser.getSecretkey()+"',");
		sql.append(saveUser.getEmployee_id() == null || saveUser.getEmployee_id().equals("") ? null+"," : "'"+saveUser.getEmployee_id()+"',");
		sql.append(saveUser.getUser_type() == null || saveUser.getUser_type().equals("") ? null : "'"+saveUser.getUser_type()+"'");
		sql.append(")");
		return sql.toString();
	}
	
	//封装sql语句，更新单据编号表
	public static String updateDJInfo(String billPrefix, int maxValue) {
		StringBuilder sql = new StringBuilder("UPDATE sys_billvalue");
		sql.append(SET);
		sql.append("bill_value = '"+maxValue+"'");
		sql.append(WHERE);
		sql.append("bill_prefix = '"+billPrefix+"'");
		return sql.toString();
	}

	//封装sql语句，查询用户信息
	public static String findUserInfo(String keyValue) {
		
		StringBuilder sql = new StringBuilder("SELECT * from sys_user");
		sql.append(WHERE);
		sql.append("user_no='"+keyValue+"'");
		return sql.toString();
	}

	//封装sql语句，修改用户信息
	public static String updateUserInfo(User saveUser) {
		StringBuilder sql = new StringBuilder("UPDATE sys_user");
		sql.append(SET);
		sql.append("status =").append(saveUser.getStatus() == null || saveUser.getStatus().equals("") ? null+"," : "'"+saveUser.getStatus()+"',");
		sql.append("user_name =").append(saveUser.getUser_name() == null || saveUser.getUser_name().equals("") ? null+"," : "'"+saveUser.getUser_name()+"',");
		sql.append("user_sex =").append(saveUser.getUser_sex() == null || saveUser.getUser_sex().equals("") ? null+"," : "'"+saveUser.getUser_sex()+"',");
		sql.append("user_birthday =").append(saveUser.getUser_birthday() == null || saveUser.getUser_birthday().equals("") ? null+"," : "'"+saveUser.getUser_birthday()+"',");
		sql.append("work_start_date =").append(saveUser.getWork_start_date() == null  || saveUser.getWork_start_date().equals("") ? null+"," : "'"+saveUser.getWork_start_date()+"',");
		sql.append("user_tel =").append(saveUser.getUser_tel() == null || saveUser.getUser_tel().equals("") ? null+"," : "'"+saveUser.getUser_tel()+"',");
		sql.append("user_mobile =").append(saveUser.getUser_mobile() == null || saveUser.getUser_mobile().equals("") ? null+"," : "'"+saveUser.getUser_mobile()+"',");
		sql.append("user_wechat =").append(saveUser.getUser_wechat() == null || saveUser.getUser_wechat().equals("") ? null+"," : "'"+saveUser.getUser_wechat()+"',");
		sql.append("user_qq =").append(saveUser.getUser_qq() == null || saveUser.getUser_qq().equals("") ? null+"," : "'"+saveUser.getUser_qq()+"',");
		sql.append("user_logid =").append(saveUser.getUser_logid() == null || saveUser.getUser_logid().equals("") ? null+"," : "'"+saveUser.getUser_logid()+"',");
		sql.append("user_email =").append(saveUser.getUser_email() == null || saveUser.getUser_email().equals("") ? null+"," : "'"+saveUser.getUser_email()+"',");
		sql.append("depart_no =").append(saveUser.getDepart_no() == null || saveUser.getDepart_no().equals("") ? null+"," : "'"+saveUser.getDepart_no()+"',");
		sql.append("user_address =").append(saveUser.getUser_address() == null || saveUser.getUser_address().equals("") ? null+"," : "'"+saveUser.getUser_address()+"',");
		sql.append("modify_date =").append(saveUser.getModify_date() == null || saveUser.getModify_date().equals("") ? null+"," : "'"+saveUser.getModify_date()+"',");
		sql.append("modify_username =").append(saveUser.getModify_username() == null || saveUser.getModify_username().equals("") ? null+"," : "'"+saveUser.getModify_username()+"',");
		sql.append("remark =").append(saveUser.getRemark() == null || saveUser.getRemark().equals("") ? null : "'"+saveUser.getRemark()+"'");
		sql.append(WHERE);
		sql.append("user_no = '"+saveUser.getUser_no()+"'");
		return sql.toString();
	}

	//封装sql语句， 重置用户密码
	public static String saveUserPassword(String keyValue, String password) {
	 	
		StringBuilder sql = new StringBuilder("UPDATE sys_user");
		 sql.append(SET);
		 sql.append("user_logpass='"+password+"'");
		 sql.append(WHERE);
		 sql.append("user_no = '"+keyValue+"'");
	   return sql.toString();
	}
	
	
	
	
	
	
  
      
     
     
	

}
