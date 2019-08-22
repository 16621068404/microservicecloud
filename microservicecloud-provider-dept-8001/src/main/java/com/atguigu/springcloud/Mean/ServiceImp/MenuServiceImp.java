package com.atguigu.springcloud.Mean.ServiceImp;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.atguigu.springcloud.MainPage.ConfigSql.MainPageConfigSql;
import com.atguigu.springcloud.Mean.ConfigSql.MenuConfigSql;
import com.atguigu.springcloud.Mean.Service.MenuService;
import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.Role.RoleServiceImp.RoleInfoServiceImp;
import com.springcloud.entity.Mean;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.TreeGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;
import com.springcloud.tool.UUIDUtils;

@Service
public class MenuServiceImp implements MenuService{

	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
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

	/**
	 * 获取菜单功能页面信息
	 */
	@SuppressWarnings({ "rawtypes", "unused", "unchecked" })
	public List getModuleDataList(User user, PageUtil pageUtil, String parentid) {
		List resultList = new ArrayList(); 
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，获取菜单页面数据表格
		String rowsSql = MenuConfigSql.findMenuList(pageUtil,parentid);
		// 执行查询功能，并返回查询数据
		List<Mean> menuData = (List<Mean>) JDBC_ZSGC.query(jdbcBean, rowsSql, Mean.class);
		if (menuData != null && menuData.size() > 0) {
			for (Mean mean : menuData) {
				Map resultMap = new HashMap();
				resultMap.put("MenuId", mean.getMenu_id());
				resultMap.put("Menu_Code", mean.getMenu_code());
				resultMap.put("ParentId", mean.getParent_id());
				resultMap.put("Menu_Name", mean.getMenu_name());
				resultMap.put("Menu_Icon", mean.getMenu_icon());
				resultMap.put("Menu_Type", mean.getMenu_type());
				resultMap.put("Sort_Code", mean.getSort_code());
				resultMap.put("UrlAddress", mean.getUrl_address());
				resultMap.put("EnabledMark", mean.getEnabled_mark());
				resultMap.put("Description", mean.getRemark());
				resultList.add(resultMap);
			}
		} else {
			return resultList;
		}
		
		
		
		

		return resultList;
	}

	/**
	 * 保存菜单信息
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map saveMenuForm(User user, Mean mean, String keyValue) {
		Map resultMap = new HashMap();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//封装sql语句
		String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		//判断当前操作是菜单的新增还是修改
		if (keyValue != null && !keyValue.equals("")) {
			 //========================执行修改功能==========================
			 //封装sql语句，修改菜单信息
			String modify_date = sdf.format(new Date());
			mean.setModify_date(modify_date);
			mean.setModify_username(userInfo.getUser_name());
			mean.setMenu_id(keyValue);
			String updateMeanSql = MenuConfigSql.updateMeanInfo(mean);
			int num = JDBC_ZSGC.update(updateMeanSql, jdbcBean);
			if (num > 0) {
				System.out.println("修改成功");
				resultMap.put("type", 1);
				resultMap.put("message", "菜单修改成功");
			} else {
				System.out.println("修改失败");
				resultMap.put("type", 3);
				resultMap.put("message", "菜单修改失败");
			}
			
		} else {
			String create_date = sdf.format(new Date());
			mean.setCreate_date(create_date);
			mean.setCreate_username(userInfo.getUser_name());
			mean.setMenu_id(UUIDUtils.getUUID().toUpperCase());
			//封装sql语句,保存菜单信息
			String saveMenuSql = MenuConfigSql.saveMenuInfo(mean);
			int num = JDBC_ZSGC.add(saveMenuSql, jdbcBean);
			if (num > 0) {
				System.out.println("添加成功");
					resultMap.put("type", 1);
					resultMap.put("message", "菜单新增成功");
			} else {
				System.out.println("添加失败");
				resultMap.put("type", 3);
				resultMap.put("message", "菜单新增失败");
			}
	}
		return resultMap;
	}

	//查询菜单信息
	public Object findMenuForm(User user, String keyValue) {
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//封装sql语句，查询菜单信息
		String menuSql = MenuConfigSql.findMenuInfo(keyValue);
		Mean menuData = (Mean) JDBC_ZSGC.queryObject(jdbcBean, menuSql, Mean.class);
		return menuData;
	}

	 //删除菜单信息
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Object removeMenuInfo(User user, String keyValue) {
		Map resultMap = new HashMap();
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//封装sql语句，删除菜单信息。
		String delMenuSql = MenuConfigSql.delMenuInfo(keyValue);
		int num = JDBC_ZSGC.del(delMenuSql, jdbcBean);
		if (num > 0) {
			System.out.println("删除成功");
			resultMap.put("type", 1);
			resultMap.put("message", "菜单删除成功");
		} else {
			System.out.println("删除失败");
			resultMap.put("type", 3);
			resultMap.put("message", "菜单删除失败");
		}
		return resultMap;
	}
	

}
