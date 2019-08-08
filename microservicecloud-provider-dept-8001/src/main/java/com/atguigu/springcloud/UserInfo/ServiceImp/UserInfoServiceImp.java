package com.atguigu.springcloud.UserInfo.ServiceImp;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.atguigu.springcloud.UserInfo.Service.UserInfoService;
import com.springcloud.entity.Billsetup;
import com.springcloud.entity.Billvalue;
import com.springcloud.entity.Depart;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysColumn;
import com.springcloud.entity.SysGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.DateUtils;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;

@Service
@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
public class UserInfoServiceImp implements UserInfoService {

	public static final String SYSUSER = "sys_user";
	public static final String BILL_PREFIX = "U";
	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

	/**
	 * 获取页面grid列表配置
	 * 
	 */
	public Object getGridByGridCode(User user, String grid_code) {

		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，根据grid_code关键字,查询表格样式的配置信息
		String gridSql = UserInfoConfigSql.findGridByGridCode(grid_code);
		// 执行查询功能，并返回查询数据
		SysGrid sysGrid = (SysGrid) JDBC_ZSGC.queryObject(jdbcBean, gridSql, SysGrid.class);
		return sysGrid;
	}

	/**
	 * 获取页面grid列表字段配置
	 * 
	 */
	public List getColumnByGridId(User user, String grid_id) {
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，根据grid_id关键字,查询表格的字段配置信息
		String gridColumnSql = UserInfoConfigSql.findColumnByGridId(grid_id);
		// 执行查询功能，并返回查询数据
		List<SysColumn> sysColumn = (List<SysColumn>) JDBC_ZSGC.query(jdbcBean, gridColumnSql, SysColumn.class);
		return sysColumn;
	}

	/**
	 * 获取用户页面数据表格
	 * 
	 */
	public PageUtil getPageListJson(User user, PageUtil pageUtil) {
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句,查询记录数
		String recordsSql = UserInfoConfigSql.findCountUser(pageUtil);
		// 执行查询功能，并返回查询数据记录数
		int records = JDBC_ZSGC.queryCount(jdbcBean, recordsSql);
		// 封装sql语句，获取用户页面数据表格数据
		String rowsSql = UserInfoConfigSql.findPageList(pageUtil);
		// 执行查询功能，并返回查询数据
		List<User> userRow = (List<User>) JDBC_ZSGC.query(jdbcBean, rowsSql, User.class);

		// 封装返回到前端的数据
		pageUtil.setRows(userRow);
		pageUtil.setRecords(records);
		int total = (int) Math.ceil((double) records / (double) pageUtil.getPageSize());
		pageUtil.setTotal(total);

		return pageUtil;
	}

	/**
	 * 查询部门信息
	 * 
	 * @param user
	 * @return
	 */
	public List getDepartDropdownList(User user) {
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句,查询部门信息
		String departSql = UserInfoConfigSql.findDepartInfo();
		// 执行查询功能，并返回查询数据
		List<Depart> departRow = (List<Depart>) JDBC_ZSGC.query(jdbcBean, departSql, Depart.class);
		return departRow;
	}

	/**
	 * 对新增的用户，进行保存 保存用户信息
	 */
	public Map saveUserForm(User user, User saveUser) {
		Map resultMap = new HashMap();
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		//判断是新增还是修改
		if (saveUser.getUser_no() != null && !saveUser.getUser_no().equals("")) {
		    //========================执行修改功能==========================
			//封装sql语句，修改用户信息
			String updateUserSql = UserInfoConfigSql.updateUserInfo(saveUser);
			int num = JDBC_ZSGC.update(updateUserSql, jdbcBean);
			if (num > 0) {
				System.out.println("修改成功");
				resultMap.put("type", 1);
				resultMap.put("message", "用户修改成功");
			} else {
				System.out.println("修改失败");
				resultMap.put("type", 3);
				resultMap.put("message", "用户修改失败");
			}
		} else {
	    //=============================执行新增功能==========================
		// 封装sql语句，获取单据编号规则设置表有关用户单据的【sys_user】单据的信息
		String rulesSql = UserInfoConfigSql.findRulesInfo(SYSUSER);
		// 执行查询功能，并返回查询数据
		Billsetup billsetup = (Billsetup) JDBC_ZSGC.queryObject(jdbcBean, rulesSql, Billsetup.class);
		// 封装sql语句,查询当前流水号的长度 系统单据编号最大值 sys_billvalue
		String billValueSql = UserInfoConfigSql.findBillValue();
		Billvalue billvalue = (Billvalue) JDBC_ZSGC.queryObject(jdbcBean, billValueSql, Billvalue.class);
		// 根据单据编号规则表创建一个生成单据编号的公共方法。 --------------sys_billsetup---【单据编号规则设置表】
		String user_no = createBillsetup(billsetup, user, billvalue);
		// 封装要保存的数据
		saveUser.setUser_no(user_no);
		saveUser.setBranch_no(user.getBranch_no());
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
		String create_date = sdf.format(new Date());
		saveUser.setCreate_date(create_date);
		saveUser.setCreate_username(user.getUser_logid());
		// 封装sql语句,进行用户数据的插入
		String insertSql = UserInfoConfigSql.insertUserInfo(saveUser);
		int num = JDBC_ZSGC.add(insertSql, jdbcBean);
		if (num > 0) {
			System.out.println("添加成功");
			//添加成功后去更新 系统单据编号表
			//封装sql语句，更新单据编号表
			String djSql = UserInfoConfigSql.updateDJInfo(BILL_PREFIX,Integer.parseInt(billvalue.getBill_value())+1);
			int nus = JDBC_ZSGC.update(djSql, jdbcBean);
			if (nus > 0) {
				System.out.println("修改成功");
				
				resultMap.put("type", 1);
				resultMap.put("message", "用户添加成功");
			} else {
				System.out.println("修改失败");
				
				resultMap.put("type", 3);
				resultMap.put("message", "用户添加失败");
			}
		} else {
			System.out.println("添加失败");
			resultMap.put("type", 3);
			resultMap.put("message", "用户添加失败");
		}
		
	}
		return resultMap;
	}

	// 根据单据编号规则表创建一个生成单据编号的公共方法。 --------------sys_billsetup---【单据编号规则设置表】
	private String createBillsetup(Billsetup billsetup, User user, Billvalue billvalue) {
		// 要返回的用户编码
		StringBuilder user_no = new StringBuilder();

		// 获取用户单据编号的前缀
		String bill_prefix = billsetup.getBill_prefix();
		// 判断是否添加公司的编号;
		if (billsetup.getIs_companyno().equals("1")) {
			// 需要在用户单据编号的前缀添加公司的编码
			// 获取公司编码
			String cust_no = user.getCust_no();
			user_no.append(cust_no).append(bill_prefix);
		} else {
			user_no.append(bill_prefix);
		}

		// 获取 年 月 日;
		Map<String, Integer> dateMap = DateUtils.getTimeByCalendar();
		// 判断是否添加年份；
		if (billsetup.getIs_year().equals("1")) {
			// 判断添加多少位,例如2019： 2位19 4位2019
			String year = "";
			if (billsetup.getYear_type().equals("2")) {
				/*
				 * String year = "2019"; System.out.println("2位:"+year.substring(2,4));
				 * System.out.println("4位:"+year.substring(0,4));
				 */
				// 截取2位
				year = dateMap.get("year").toString().substring(2, 4);
			} else {
				// 截取4位
				year = dateMap.get("year").toString().substring(0, 4);
			}
			user_no.append(year);
		}
		// 判断是否添加月份；
		if (billsetup.getIs_month().equals("1")) {
			user_no.append(dateMap.get("month").toString().length() == 1 ? "0"+ dateMap.get("month") : dateMap.get("month").toString());
		}
		// 判断是否添加日；
		if (billsetup.getIs_day().equals("1")) {
			user_no.append(dateMap.get("day").toString().length() == 1 ? "0"+ dateMap.get("day") : dateMap.get("day").toString());
		}
		// 获取系统单据编号最大值
		int maxValue = Integer.parseInt(billvalue.getBill_value());
		maxValue++;
		// 判断流水号长度长度
		int len = Integer.parseInt(billsetup.getBill_length());
		len = len - (maxValue+"").toString().length();
		// 根据流水号长度和获取系统单据编号最大值的长度得出补0的个数
		for (int i = 0; i < len; i++) {
			user_no.append("0");
		}
		user_no.append(maxValue + "");
		return user_no.toString();
	}

	/**
	 * 查询用户信息
	 * @param user
	 * @return
	 */
	public Object findUserForm(User user,String keyValue) {
		
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，查询用户信息
		String usersSql = UserInfoConfigSql.findUserInfo(keyValue);
		// 执行查询功能，并返回查询数据
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean, usersSql, User.class);
		userInfo.setUser_logpass(null);
		return userInfo;
	}

	/**
	 * 重置用户密码
	 * 保存用户密码
	 * 
	 */
	public Map saveUserPassword(User user, String keyValue, String password) {
		Map resultMap = new HashMap();
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句， 重置用户密码
		String saveUserPwdSql = UserInfoConfigSql.saveUserPassword(keyValue,password);
		int nus = JDBC_ZSGC.update(saveUserPwdSql, jdbcBean);
		if (nus > 0) {
			System.out.println("修改成功");
			resultMap.put("type", 1);
			resultMap.put("message", "用户重置密码成功");
		} else {
			System.out.println("修改失败");
			resultMap.put("type", 3);
			resultMap.put("message", "用户重置密码失败");
		}
		return resultMap;
	}

	

}
