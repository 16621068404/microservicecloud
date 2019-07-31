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
	public Map<String, Object> findMainPageInfo(User user,HttpServletRequest request) throws IOException {
		Map<String, Object> mapJson = new HashMap<>();
		//封装连接数据库信息		
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		List allData = new ArrayList<>();
		//根据系统用户的id,去查询用户的角色;
		String userNo = user.getUser_no();
		String userNoSql = MainPageConfigSql.findUserNoSql(userNo);  // 【客户信息方法】 
		User user01 = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		
		if (user01 != null && user01.getRole_no() != null && !user01.getRole_no().equals("")) {
			//角色ID
			String role_no = user01.getRole_no();
			//根据角色id,到授权表中查询授权的菜单信息；
		    String sql = MainPageConfigSql.findMainPageSql(role_no);
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
		     allData.add(mean);
		     allData.add(centralUser);

			if(mean != null && mean.size() > 0) {
		    	
				
				mapJson.put("data", allData);
		    	mapJson.put("msg", "查询主页面成功!");
		    	mapJson.put("code", 200);
		    }
		} else {
			mapJson.put("data", null);
	    	mapJson.put("msg", "用户角色为空，请给用户分配角色!");
	    	mapJson.put("code", 500);
		}
		return mapJson;
		
	}

}
