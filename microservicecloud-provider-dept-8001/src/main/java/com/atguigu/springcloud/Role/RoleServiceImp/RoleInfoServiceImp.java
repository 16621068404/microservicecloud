package com.atguigu.springcloud.Role.RoleServiceImp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.Role.Service.RoleInfoService;
import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;
@SuppressWarnings("unchecked")
@Service
public class RoleInfoServiceImp implements RoleInfoService {

	/**
	 * 获取角色页面数据表格
	 * 
	 */
	public PageUtil getPageListJson(User user, PageUtil pageUtil) {

		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句,查询记录数
		String recordsSql = RoleInfoConfigSql.findCountRole(pageUtil);
		// 执行查询功能，并返回查询数据记录数
		int records = JDBC_ZSGC.queryCount(jdbcBean, recordsSql);
		// 封装sql语句，获取角色页面数据表格数据
		String rowsSql = RoleInfoConfigSql.findPageList(pageUtil);
		// 执行查询功能，并返回查询数据
		List<Role> roleRow = (List<Role>) JDBC_ZSGC.query(jdbcBean, rowsSql, Role.class);

		// 封装返回到前端的数据
		pageUtil.setRows(roleRow);
		pageUtil.setRecords(records);
		int total = (int) Math.ceil((double) records / (double) pageUtil.getPageSize());
		pageUtil.setTotal(total);

		return pageUtil;
	}

}
