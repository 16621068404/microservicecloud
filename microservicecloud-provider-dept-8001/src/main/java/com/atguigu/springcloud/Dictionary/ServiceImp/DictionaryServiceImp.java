package com.atguigu.springcloud.Dictionary.ServiceImp;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.atguigu.springcloud.Dictionary.ConfigSql.DictionaryConfigSql;
import com.atguigu.springcloud.Dictionary.Service.DictionaryService;
import com.atguigu.springcloud.MainPage.ConfigSql.MainPageConfigSql;
import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.atguigu.springcloud.UserInfo.ServiceImp.UserInfoServiceImp;
import com.springcloud.entity.Billsetup;
import com.springcloud.entity.Billvalue;
import com.springcloud.entity.Dictionary;
import com.springcloud.entity.DictionaryDetail;
import com.springcloud.entity.TreeGrid;
import com.springcloud.entity.TreeGrid2;
import com.springcloud.entity.User;
import com.springcloud.tool.DTreeKit;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;
import com.springcloud.tool.TreeKit;
import com.springcloud.tool.UUIDUtils;
@SuppressWarnings({ "rawtypes", "unchecked" })
@Service
public class DictionaryServiceImp implements DictionaryService{
	
	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	public static int rgt = 1000000;
	
	public static int lft = 1;
	
	
	
	
	
	
	/**
	 * 查询所有的字典分类信息
	 */
	public Object getDataItemTreeJson(User user) {
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		/*
		根据字典明细id,查询字典明细信息；封装sql语句
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

		/**
		 * 
		 * 保存字典明细信息
		 * 
		 */
		public Map saveDictionaryDetailForm(User user, DictionaryDetail dictionaryDetail, String keyValue) {
			Map resultMap = new HashMap();
			SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
			// 封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			
			//封装sql语句
			String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
			User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
			
			//判断当前操作是字典明细的新增还是修改
			if (keyValue != null && !keyValue.equals("")) {
				 //========================执行修改功能==========================
				 //封装sql语句，修改字典明细信息
				String modify_date = sdf.format(new Date());
				dictionaryDetail.setModify_date(modify_date);
				dictionaryDetail.setModify_username(userInfo.getUser_name());
				dictionaryDetail.setItem_detail_id(keyValue);
				String updateDictionaryDetailSql = DictionaryConfigSql.updateDictionaryDetailInfo(dictionaryDetail);
				int num = JDBC_ZSGC.update(updateDictionaryDetailSql, jdbcBean);
				if (num > 0) {
					System.out.println("修改成功");
					resultMap.put("type", 1);
					resultMap.put("message", "字典明细修改成功");
				} else {
					System.out.println("修改失败");
					resultMap.put("type", 3);
					resultMap.put("message", "字典明细修改失败");
				}
				
			} else {
				String create_date = sdf.format(new Date());
				dictionaryDetail.setCreate_date(create_date);
				dictionaryDetail.setCreate_username(userInfo.getUser_name());
				dictionaryDetail.setItem_detail_id(UUIDUtils.getUUID());
				//封装sql语句,保存字典明细信息
				String saveDictionaryDetailSql = DictionaryConfigSql.saveDictionaryDetailForm(dictionaryDetail);
				int num = JDBC_ZSGC.add(saveDictionaryDetailSql, jdbcBean);
				if (num > 0) {
					System.out.println("添加成功");
						resultMap.put("type", 1);
						resultMap.put("message", "字典明细添加成功");
				} else {
					System.out.println("添加失败");
					resultMap.put("type", 3);
					resultMap.put("message", "字典明细添加失败");
				}
			
		}
			return resultMap;
		}

		 //查询字典明细信息
		public Object findDictionaryDetailForm(User user, String keyValue) {
		    Map resultMap = new HashMap();
			//封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			//封装sql语句，查询字典明细信息
			String dictionaryDetailSql = DictionaryConfigSql.findDictionaryDetailInfo(keyValue);
			DictionaryDetail dictionaryDetail = (DictionaryDetail) JDBC_ZSGC.queryObject(jdbcBean, dictionaryDetailSql, DictionaryDetail.class);
			resultMap.put("ItemDetailId", dictionaryDetail.getItem_detail_id());
			resultMap.put("ItemId", dictionaryDetail.getItem_id());
			resultMap.put("ParentId", dictionaryDetail.getParent_id());
			resultMap.put("ItemCode", dictionaryDetail.getItem_code());
			resultMap.put("ItemName", dictionaryDetail.getItem_name());
			resultMap.put("SortCode", dictionaryDetail.getSort_code());
			resultMap.put("ItemValue", dictionaryDetail.getItem_value());
			resultMap.put("QuickQuery", dictionaryDetail.getQuick_query());
			resultMap.put("SimpleSpelling", dictionaryDetail.getSimple_spelling());
			resultMap.put("IsDefault", dictionaryDetail.getIs_default());
			resultMap.put("DeleteMark", dictionaryDetail.getDelete_mark());
			resultMap.put("EnabledMark", dictionaryDetail.getEnabled_mark());
			resultMap.put("Description", dictionaryDetail.getRemark());
			return resultMap;
		}

		//删除字典明细信息
		public Object removeDetailForm(User user, String keyValue) {
			Map resultMap = new HashMap();
			//封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			//封装sql语句，删除字典明细信息。
			String delDictionaryDetailSql = DictionaryConfigSql.delDictionaryDetail(keyValue);
			int num = JDBC_ZSGC.del(delDictionaryDetailSql, jdbcBean);
			if (num > 0) {
				System.out.println("删除成功");
				resultMap.put("type", 1);
				resultMap.put("message", "字典明细删除成功");
			} else {
				System.out.println("删除失败");
				resultMap.put("type", 3);
				resultMap.put("message", "字典明细删除失败");
			}
			return resultMap;
		}

		//获取通用字典分类页面数据表格
		public Map getDictionaryTreeList(User user) {
			Map resultMap = new HashMap();
			//封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			//封装sql语句，查询字典分类信息。
			String dictionarySql = DictionaryConfigSql.findAllDictionarySqlInfo();
			// 执行查询功能，并返回查询数据
			List<Dictionary> dictionaryData = (List<Dictionary>) JDBC_ZSGC.query(jdbcBean, dictionarySql, Dictionary.class);
			//对数据进行递归处理,封装树结构数据
			List<TreeGrid2> grid = fengZhuangDictionaryTreeGrid(dictionaryData);
			//封装前台页面需要的数据格式
			List dictionaryList = new ArrayList();
			int level = 1;
			for (TreeGrid2 treeGrid : grid) {
				fengzhuangResult(treeGrid,dictionaryList,level);
			}
			 resultMap.put("rows", dictionaryList);
			 rgt = 1000000;
		     lft = 1;
			 return resultMap;
		}

		//封装数据方法;
		private void fengzhuangResult(TreeGrid2 treeGrid,List dictionaryList,int level) {
			Map treeMap = new HashMap();
			treeMap.put("rgt", rgt--);
			treeMap.put("lft", lft++);
			treeMap.put("expanded", true);
			treeMap.put("level", level);
			treeMap.put("ItemId", treeGrid.getId());
			treeMap.put("ItemName", treeGrid.getText());
			treeMap.put("ItemCode", treeGrid.getValue());
			treeMap.put("SortCode", treeGrid.getSortCode());
			treeMap.put("IsTree", treeGrid.getIsTree());
			treeMap.put("DeleteMark", treeGrid.getDeleteMark());
			treeMap.put("EnabledMark", treeGrid.getEnabledMark());
			treeMap.put("Description", treeGrid.getRemark());
			if (treeGrid.getChildNodes() != null && treeGrid.getChildNodes().size() > 0) {
				treeMap.put("isLeaf", false);
				dictionaryList.add(treeMap);
				//获取子节点的方法,并封装数据
				getChildNodes(treeGrid.getChildNodes(), dictionaryList,level);
			} else {
				treeMap.put("isLeaf", true);
				dictionaryList.add(treeMap);
			}
		}
		
		//获取子节点的方法;
		private void getChildNodes(List<TreeGrid2> childNodes,List dictionaryList,int level) {
			level++;   //层级加一
			for (TreeGrid2 treeGrid : childNodes) {
				fengzhuangResult(treeGrid,dictionaryList,level);
             }
		}
		

		 /**
	     * 对数据进行递归处理,封装树结构数据
	     * @param dictionaryData
	     * @return
	     */
		public static List<TreeGrid2> fengZhuangDictionaryTreeGrid(List<Dictionary> dictionaryData) {
	        List<TreeGrid2> grid = DTreeKit.formatTree(dictionaryData);
			return grid;
		}

		//保存字典分类信息
		public Map saveDictionaryForm(User user, Dictionary dictionary, String keyValue) {
			Map resultMap = new HashMap();
			SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
			// 封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			
			//封装sql语句
			String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
			User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
			
			//判断当前操作是字典明细的新增还是修改
			if (keyValue != null && !keyValue.equals("")) {
				 //========================执行修改功能==========================
				 //封装sql语句，修改字典分类信息
				String modify_date = sdf.format(new Date());
				dictionary.setModify_date(modify_date);
				dictionary.setModify_username(userInfo.getUser_name());
				dictionary.setItem_id(keyValue);
				String updateDictionarySql = DictionaryConfigSql.updateDictionaryInfo(dictionary);
				int num = JDBC_ZSGC.update(updateDictionarySql, jdbcBean);
				if (num > 0) {
					System.out.println("修改成功");
					resultMap.put("type", 1);
					resultMap.put("message", "字典分类修改成功");
				} else {
					System.out.println("修改失败");
					resultMap.put("type", 3);
					resultMap.put("message", "字典分类修改失败");
				}
				
			} else {
				String create_date = sdf.format(new Date());
				dictionary.setCreate_date(create_date);
				dictionary.setCreate_username(userInfo.getUser_name());
				//封装sql语句,保存字典分类信息
				String saveDictionarySql = DictionaryConfigSql.saveDictionaryInfo(dictionary);
				int num = JDBC_ZSGC.add(saveDictionarySql, jdbcBean);
				if (num > 0) {
					System.out.println("添加成功");
						resultMap.put("type", 1);
						resultMap.put("message", "字典分类添加成功");
				} else {
					System.out.println("添加失败");
					resultMap.put("type", 3);
					resultMap.put("message", "字典分类添加失败");
				}
			
		}
			return resultMap;
		}

		//查询字典分类信息
		public Object getDataItemFormJson(User user, String keyValue) {
			  Map resultMap = new HashMap();
				//封装连接数据库信息
				JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
				//封装sql语句，查询字典分类信息
				String dictionarySql = DictionaryConfigSql.findDictionaryInfo(keyValue);
				Dictionary dictionary = (Dictionary) JDBC_ZSGC.queryObject(jdbcBean, dictionarySql, Dictionary.class);
				resultMap.put("ItemId", dictionary.getItem_id());
				resultMap.put("ParentId", dictionary.getParent_id());
				resultMap.put("ItemCode", dictionary.getItem_code());
				resultMap.put("ItemName", dictionary.getItem_name());
				resultMap.put("SortCode", dictionary.getSort_code());
				resultMap.put("IsTree", dictionary.getIs_tree());
				resultMap.put("IsNav", dictionary.getIs_nav());
				resultMap.put("DeleteMark", dictionary.getDelete_mark());
				resultMap.put("EnabledMark", dictionary.getEnabled_mark());
				resultMap.put("Description", dictionary.getRemark());
				return resultMap;
		}

		//删除字典分类信息
		public Object removeDictionaryForm(User user, String keyValue) {
			Map resultMap = new HashMap();
			//封装连接数据库信息
			JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
			//封装sql语句，删除字典明细信息。
			String delDictionarySql = DictionaryConfigSql.delDictionary(keyValue);
			int num = JDBC_ZSGC.del(delDictionarySql, jdbcBean);
			if (num > 0) {
				System.out.println("删除成功");
				resultMap.put("type", 1);
				resultMap.put("message", "字典分类删除成功");
			} else {
				System.out.println("删除失败");
				resultMap.put("type", 3);
				resultMap.put("message", "字典分类删除失败");
			}
			return resultMap;
		}


		
		
		

}
