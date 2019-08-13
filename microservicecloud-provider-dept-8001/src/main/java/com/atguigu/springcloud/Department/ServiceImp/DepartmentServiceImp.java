package com.atguigu.springcloud.Department.ServiceImp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.Department.ConfigSql.DepartmentConfigSql;
import com.atguigu.springcloud.Department.Service.DepartmentService;
import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.Role.RoleServiceImp.RoleInfoServiceImp;
import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.atguigu.springcloud.UserInfo.ServiceImp.UserInfoServiceImp;
import com.springcloud.entity.Billsetup;
import com.springcloud.entity.Billvalue;
import com.springcloud.entity.Depart;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;

@SuppressWarnings("unchecked")
@Service
public class DepartmentServiceImp implements DepartmentService{
	
	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	public static final String SYSUSER = "sys_department";
	public static final String BILL_PREFIX = "D";


	//获取部门页面信息数据表格
	
	public PageUtil getPageListJson(User user, PageUtil pageUtil) {
        // 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句,查询记录数
		String recordsSql = DepartmentConfigSql.findCountRole(pageUtil);
		// 执行查询功能，并返回查询数据记录数
		int records = JDBC_ZSGC.queryCount(jdbcBean, recordsSql);
		// 封装sql语句，获取部门页面数据表格数据
		String rowsSql = DepartmentConfigSql.findPageList(pageUtil);
		// 执行查询功能，并返回查询数据
		List<Depart> roleRow = (List<Depart>) JDBC_ZSGC.query(jdbcBean, rowsSql, Depart.class);
		// 封装返回到前端的数据
		pageUtil.setRows(roleRow);
		pageUtil.setRecords(records);
		int total = (int) Math.ceil((double) records / (double) pageUtil.getPageSize());
		pageUtil.setTotal(total);

		return pageUtil;
	}

	/**
	 * 保存部门基本信息
	 */
	@SuppressWarnings("rawtypes")
	public Map saveDepartmentForm(User user, Depart depart,String keyValue) {
		Map resultMap = new HashMap();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		//查询当前登录用户的信息
		user = RoleInfoServiceImp.findDLuUserInfo(user,jdbcBean);
		
		//判断当前操作是部门的新增还是修改
		if (depart.getDepart_no() != null && !depart.getDepart_no().equals("")) {
			 //========================执行修改功能==========================
			 //封装sql语句，修改部门信息
			String modify_date = sdf.format(new Date());
			depart.setModify_date(modify_date);
			depart.setModify_username(user.getUser_name());
			String updateDepartSql = DepartmentConfigSql.updateDepartInfo(depart);
			int num = JDBC_ZSGC.update(updateDepartSql, jdbcBean);
			if (num > 0) {
				System.out.println("修改成功");
				resultMap.put("type", 1);
				resultMap.put("message", "角色修改成功");
			} else {
				System.out.println("修改失败");
				resultMap.put("type", 3);
				resultMap.put("message", "角色修改失败");
			}
			
		} else {
		// 封装sql语句,保存部门基本信息
		String create_date = sdf.format(new Date());
		depart.setCreate_date(create_date);
		depart.setCreate_username(user.getUser_name());
		depart.setBranch_no(user.getBranch_no());
		
		// 封装sql语句，获取单据编号规则设置表有关部门单据的【sys_department】单据的信息
		String rulesSql = UserInfoConfigSql.findRulesInfo(SYSUSER);
		// 执行查询功能，并返回查询数据
		Billsetup billsetup = (Billsetup) JDBC_ZSGC.queryObject(jdbcBean, rulesSql, Billsetup.class);
		// 封装sql语句,查询当前流水号的长度 系统单据编号最大值 sys_billvalue
		String billValueSql = UserInfoConfigSql.findBillValue(BILL_PREFIX);
		Billvalue billvalue = (Billvalue) JDBC_ZSGC.queryObject(jdbcBean, billValueSql, Billvalue.class);
		// 根据单据编号规则表创建一个生成单据编号的公共方法。 --------------sys_billsetup---【单据编号规则设置表】
		String depart_no = UserInfoServiceImp.createBillsetup(billsetup, user, billvalue);
		depart.setDepart_no(depart_no);
		//保存部门基本信息
		String saveDepartmentSql = DepartmentConfigSql.saveDepartmentForm(depart);
		int num = JDBC_ZSGC.add(saveDepartmentSql, jdbcBean);
		if (num > 0) {
			System.out.println("添加成功");
			//添加成功后去更新 系统单据编号表
			//封装sql语句，更新单据编号表
			String djSql = UserInfoConfigSql.updateDJInfo(BILL_PREFIX,Integer.parseInt(billvalue.getBill_value())+1);
			int nus = JDBC_ZSGC.update(djSql, jdbcBean);
			if (nus > 0) {
				resultMap.put("type", 1);
				resultMap.put("message", "部门添加成功");
			} else {
				resultMap.put("type", 3);
				resultMap.put("message", "部门添加失败");
			}
		} else {
			System.out.println("添加失败");
			resultMap.put("type", 3);
			resultMap.put("message", "部门添加失败");
		}
		
	}
		return resultMap;
	}

    /**
     * 查询部门信息
     * 
     */
	public Object findDepartmentForm(User user, String keyValue) {
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，查询部门信息
		String departmentSql = DepartmentConfigSql.findDepartInfo(keyValue);
		// 执行查询功能，并返回查询数据
		Depart departInfo = (Depart) JDBC_ZSGC.queryObject(jdbcBean, departmentSql, Depart.class);
		return departInfo;
	}

}
