package com.atguigu.springcloud.MainPage.MainPageServiceImp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.MainPage.ConfigSql.MainPageConfigSql;
import com.atguigu.springcloud.MainPage.Dao.MainPageDao;
import com.atguigu.springcloud.MainPage.Service.MainPageService;
import com.springcloud.entity.Mean;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCbean;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.StringUtil;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
@SuppressWarnings({ "unused", "unchecked" })
@Service
public class MainPageServiceImp implements MainPageService {

	@Autowired
	private MainPageDao mainPageDao;
	
	/**
	 * 查询主页面菜单
	 */
	@SuppressWarnings("rawtypes")
	public Map<String, Object> findMainPageInfo(User user,HttpServletRequest request) throws IOException {
		Map<String, Object> mapJson = new HashMap<>();
		//封装连接数据库信息		
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
	
		//根据系统用户的id,去查询用户的角色;
		String userNo = user.getUser_no();
		String userNoSql = MainPageConfigSql.findUserNoSql(userNo);  // 【客户信息方法】 
		User user01 = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		
		if (user01 != null && user01.getRole_no() != null && !user01.getRole_no().equals("")) {
			//角色ID
			String role_no = user01.getRole_no();
			//是否是超级管理员
			String is_super = user01.getIs_super();
			//根据角色id,到授权表中查询授权的菜单信息；
		    String sql = MainPageConfigSql.findMainPageSql(role_no,is_super);
			//=============菜单信息列表===============
		    List<Mean> mean  = (List<Mean>) JDBC_ZSGC.query(jdbcBean,sql,Mean.class);
			
			/**
			 * ---获取用户个人信息列表
			 * 1.从中心库中获取部分信息
			 * 2.从客户库中获取部分信息
			 * 
			 */
		     //从中心库中获取部分信息
		     User centralUser = mainPageDao.findUserInfoForCentral(userNo);
		     //从客户库中获取部分信息放到session中
		     //上面的【客户信息方法】 ，已经获取到了客户信息
		     centralUser.setUser_name(user01.getUser_name());
		     centralUser.setPic_url(user01.getPic_url());
		     centralUser.setIs_super(user01.getIs_super());
		     centralUser.setRole_no(user01.getRole_no());
		     centralUser.setSkin_type(user01.getSkin_type());
		     centralUser.setCustom_no(user01.getCustom_no());
		     centralUser.setCustom_name(user01.getCustom_name());
		     /**
		      * 封装数据
		      * 1.菜单信息
		      * 2.系统用户信息
		      * 3.中心库中用户信息
		      */
		    

			if(mean != null && mean.size() > 0) {
		    	
				/*
				 *organize----------------------公司
				 *department--------------------部门
				 *role--------------------------角色
				 *user--------------------------用户
				 *authorizeMenu-----------------授权菜单
				 *authorizeButton---------------授权按钮
				 *authorizeColumn---------------授权列表
				 *menu--------------------------菜单
				 *button------------------------按钮
				 *dataItem----------------------数据字典
				 *excelImportTemplate-----------excel导入模板
				 *excelExportTemplate-----------excel导出模板
				 *
				 */
				mapJson.put("authorizeMenu",JsonUtils.obj2Json(mean));   // 授权菜单
				
				//授权按钮
				mapJson.put("authorizeButton","[]"); 
				
				mapJson.put("authorizeColumn","[]"); 
				
				mapJson.put("authorizeGrid","[]"); 
				
				mapJson.put("shortcutMenu","[]"); 
				
				
				
				List branch_data = new ArrayList();
				branch_data.add(centralUser);
				
				mapJson.put("login_user_data",JsonUtils.obj2Json(centralUser)); 
				mapJson.put("branch_data",JsonUtils.obj2Json(branch_data)); 
				mapJson.put("depart_data",JsonUtils.obj2Json(branch_data)); 
				mapJson.put("user_data",JsonUtils.obj2Json(branch_data)); 
				mapJson.put("default_value",JsonUtils.obj2Json(branch_data)); 
				mapJson.put("report_data",JsonUtils.obj2Json(branch_data)); 
				mapJson.put("param_config","[]"); 
				
				
				
		    	mapJson.put("message", "获取功能菜单数据成功!");
		    	mapJson.put("error", 1);
		    }
		} else {
			mapJson.put("data", null);
	    	mapJson.put("msg", "用户角色为空，请给用户分配角色!");
	    	mapJson.put("code", 500);
		}
		return mapJson;
		
	}

}
