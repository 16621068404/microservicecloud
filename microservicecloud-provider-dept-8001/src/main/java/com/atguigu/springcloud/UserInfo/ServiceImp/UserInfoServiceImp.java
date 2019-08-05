package com.atguigu.springcloud.UserInfo.ServiceImp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.atguigu.springcloud.UserInfo.Service.UserInfoService;
import com.springcloud.entity.SysColumn;
import com.springcloud.entity.SysGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;

@Service
@SuppressWarnings({ "unchecked", "rawtypes","unused" })
public class UserInfoServiceImp implements UserInfoService {

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

}
