package com.atguigu.springcloud.Mean.ServiceImp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.MainPage.ConfigSql.MainPageConfigSql;
import com.atguigu.springcloud.Mean.Service.MenuService;
import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.Role.RoleServiceImp.RoleInfoServiceImp;
import com.springcloud.entity.Authorize;
import com.springcloud.entity.Mean;
import com.springcloud.entity.TreeGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;

@Service
public class MenuServiceImp implements MenuService{

	/**
	 * 查询所有的菜单信息
	 */
	@SuppressWarnings("unchecked")
	public Object getMenuTreeJson(User user) {
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//根据用户id,查询用户信息；
		//封装sql语句
		String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		//是否是超级管理员
		String is_super = userInfo.getIs_super();
		//封装sql语句，查询所有的菜单信息
		String menuSql = RoleInfoConfigSql.findAllMeanInfo(is_super);
		// 执行查询功能，并返回查询数据
		List<Mean> menuData = (List<Mean>) JDBC_ZSGC.query(jdbcBean, menuSql, Mean.class);
		//对数据进行递归处理,封装树结构数据
		List<TreeGrid> grid = RoleInfoServiceImp.fengZhuangTreeGrid(menuData,null);
		return grid;
	}
	

}
