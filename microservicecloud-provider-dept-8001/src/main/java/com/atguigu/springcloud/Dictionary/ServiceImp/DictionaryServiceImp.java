package com.atguigu.springcloud.Dictionary.ServiceImp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.atguigu.springcloud.Dictionary.ConfigSql.DictionaryConfigSql;
import com.atguigu.springcloud.Dictionary.Service.DictionaryService;
import com.springcloud.entity.Dictionary;
import com.springcloud.entity.DictionaryDetail;
import com.springcloud.entity.TreeGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;
import com.springcloud.tool.TreeKit;
@SuppressWarnings({ "rawtypes", "unchecked" })
@Service
public class DictionaryServiceImp implements DictionaryService{

	
	/**
	 * 查询所有的字典分类信息
	 */
	public Object getDataItemTreeJson(User user) {
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		/*
		根据用户id,查询用户信息；封装sql语句
		String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		//是否是超级管理员
		String is_super = userInfo.getIs_super();
		
		*/
		
		
		//封装sql语句，查询所有的字典分类信息
		String dictionarySql = DictionaryConfigSql.findAllDictionarySqlInfo();
		// 执行查询功能，并返回查询数据
		List<Dictionary> dictionaryData = (List<Dictionary>) JDBC_ZSGC.query(jdbcBean, dictionarySql, Dictionary.class);
		//对数据进行递归处理,封装树结构数据
		List<TreeGrid> grid = fengZhuangTreeGrid(dictionaryData);
		return grid;
	}
	
	    /**
	     * 对数据进行递归处理,封装树结构数据
	     * @param dictionaryData
	     * @return
	     */
		public static List<TreeGrid> fengZhuangTreeGrid(List<Dictionary> dictionaryData) {
	        List<TreeGrid> grid = TreeKit.formatTree(dictionaryData);
			return grid;
		}

		
		/**
		 * 获取通用字典页面明细数据表格
		 * 
		 */
		public Map getPageListJson(User user,String itemId,String keyword, String condition) {
			Map resutJson = new HashMap();  
			// 封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			// 封装sql语句，获取通用字典页面数据表格
			String rowsSql = DictionaryConfigSql.findPageList(itemId,keyword,condition);
			// 执行查询功能，并返回查询数据
			List<DictionaryDetail> dictionaryRow = (List<DictionaryDetail>) JDBC_ZSGC.query(jdbcBean, rowsSql, DictionaryDetail.class);
			resutJson.put("rows", dictionaryRow);
			return resutJson;
		}

}
