package com.atguigu.springcloud.Role.RoleServiceImp;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.MainPage.ConfigSql.MainPageConfigSql;
import com.atguigu.springcloud.Role.ConfigSql.RoleInfoConfigSql;
import com.atguigu.springcloud.Role.Service.RoleInfoService;
import com.atguigu.springcloud.UserInfo.ConfigSql.UserInfoConfigSql;
import com.atguigu.springcloud.UserInfo.ServiceImp.UserInfoServiceImp;
import com.springcloud.entity.Authorize;
import com.springcloud.entity.Billsetup;
import com.springcloud.entity.Billvalue;
import com.springcloud.entity.Mean;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.TreeGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.JDBCUtils;
import com.springcloud.tool.JDBC_ZSGC;
import com.springcloud.tool.JDBCbean;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.UUIDUtils;
import com.springcloud.tool.XTreeKit;
@SuppressWarnings("unchecked")
@Service
public class RoleInfoServiceImp implements RoleInfoService {

	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	public static final String SYSUSER = "sys_role";
	public static final String BILL_PREFIX = "R";
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

	/**
	 * 保存角色信息
	 */
	@SuppressWarnings({ "unused", "rawtypes" })
	public Map saveRoleForm(User user, Role role) {
		Map resultMap = new HashMap();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		
		//判断当前操作是角色的新增还是修改
		if (role.getRole_no() != null && !role.getRole_no().equals("")) {
			 //========================执行修改功能==========================
			 //封装sql语句，修改角色信息
			String modify_date = sdf.format(new Date());
			role.setModify_date(modify_date);
			role.setModify_username(user.getUser_logid());
			String updateRoleSql = RoleInfoConfigSql.updateRoleInfo(role);
			int num = JDBC_ZSGC.update(updateRoleSql, jdbcBean);
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
		// 封装sql语句,保存角色信息
		String create_date = sdf.format(new Date());
		role.setCreate_date(create_date);
		role.setCreate_username(user.getUser_logid());
		role.setBranch_no(user.getBranch_no());
		// 封装sql语句，获取单据编号规则设置表有关角色单据的【sys_role】单据的信息
		String rulesSql = UserInfoConfigSql.findRulesInfo(SYSUSER);
		// 执行查询功能，并返回查询数据
		Billsetup billsetup = (Billsetup) JDBC_ZSGC.queryObject(jdbcBean, rulesSql, Billsetup.class);
		// 封装sql语句,查询当前流水号的长度 系统单据编号最大值 sys_billvalue
		String billValueSql = UserInfoConfigSql.findBillValue(BILL_PREFIX);
		Billvalue billvalue = (Billvalue) JDBC_ZSGC.queryObject(jdbcBean, billValueSql, Billvalue.class);
		// 根据单据编号规则表创建一个生成单据编号的公共方法。 --------------sys_billsetup---【单据编号规则设置表】
		String role_no = UserInfoServiceImp.createBillsetup(billsetup, user, billvalue);
		role.setRole_no(role_no);
		String saveRoleSql = RoleInfoConfigSql.saveRoleForm(role);
		int num = JDBC_ZSGC.add(saveRoleSql, jdbcBean);
		if (num > 0) {
			System.out.println("添加成功");
			//添加成功后去更新 系统单据编号表
			//封装sql语句，更新单据编号表
			String djSql = UserInfoConfigSql.updateDJInfo(BILL_PREFIX,Integer.parseInt(billvalue.getBill_value())+1);
			int nus = JDBC_ZSGC.update(djSql, jdbcBean);
			if (nus > 0) {
				resultMap.put("type", 1);
				resultMap.put("message", "用户添加成功");
			} else {
				resultMap.put("type", 3);
				resultMap.put("message", "用户添加失败");
			}
		} else {
			System.out.println("添加失败");
			resultMap.put("type", 3);
			resultMap.put("message", "角色添加失败");
		}
		
	}
		return resultMap;
	}

	/**
	 * 查询角色信息
	 */
	public Object findRoleForm(User user, String keyValue) {
		// 封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		// 封装sql语句，查询角色信息
		String rolesSql = RoleInfoConfigSql.findRoleInfo(keyValue);
		// 执行查询功能，并返回查询数据
		Role roleInfo = (Role) JDBC_ZSGC.queryObject(jdbcBean, rolesSql, Role.class);
		return roleInfo;
	}

	/**
	 * 查询所有的菜单信息
	 * @throws IOException 
	 */
	public Object moduleTreeJson(User user, Authorize authorize) throws IOException {
		
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//根据用户id,查询用户信息；
		//封装sql语句
		String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		//是否是超级管理员
		String is_super = userInfo.getIs_super();
		//封装sql语句，查询所有的菜单信息
		String meanSql = RoleInfoConfigSql.findMeanInfo(is_super);
		// 执行查询功能，并返回查询数据
		List<Mean> meanData = (List<Mean>) JDBC_ZSGC.query(jdbcBean, meanSql, Mean.class);
		//查询对应角色已经授权的菜单，来判断该菜单能否被选中
		//封装sql语句
		String authorizeSql = RoleInfoConfigSql.findAuthorizeInfo(authorize); 
		// 执行查询功能，并返回查询数据
		List<Authorize> authorizeData = (List<Authorize>) JDBC_ZSGC.query(jdbcBean, authorizeSql, Authorize.class);
		//对数据进行递归处理,封装树结构数据
		List<TreeGrid> grid = fengZhuangTreeGrid(meanData,authorizeData);
		return grid;
	}

	//对数据进行递归处理,封装树结构数据
	private List<TreeGrid> fengZhuangTreeGrid(List<Mean> meanData, List<Authorize> authorizeData) {
        List<TreeGrid> grid = XTreeKit.formatTree(meanData,authorizeData);
		return grid;
	}

	//保存角色授权信息
	@SuppressWarnings("null")
	public Map saveAuthorize(User user, Authorize authorize) {
		Map resultMap = new HashMap();
		//封装连接数据库信息
		JDBCbean jdbcBean = JDBCUtils.encapsulationJDBC(user);
		//根据用户id,查询用户信息；
		//封装sql语句
		String userNoSql = MainPageConfigSql.findUserNoSql(user.getUser_no());      //【客户信息方法】 
		User userInfo = (User) JDBC_ZSGC.queryObject(jdbcBean,userNoSql,User.class);
		
		//查询对应角色已经授权的菜单，来判断该菜单能否被选中
		//封装sql语句
		String authorizeSql = RoleInfoConfigSql.findAuthorizeInfo(authorize); 
		// 执行查询功能，并返回查询数据
		List<Authorize> authorizeData = (List<Authorize>) JDBC_ZSGC.query(jdbcBean, authorizeSql, Authorize.class);
		//获取菜单id (已经授权)

		//获取菜单id (页面传来的)
        String [] moduleIds = authorize.getItem_id().split(",");
		
        //  meanIds  和      moduleIds筛选出，新增的菜单和要删除的菜单
		if (authorizeData == null && authorizeData.size() == 0) {
			//在此之前没有做过授权操作，把页面传来的所有授权菜单，保存到数据授权表中
			 //获取要新增的菜单	
			  List<Authorize>  addMean = new ArrayList<Authorize>();
			  for (int i = 0; i < moduleIds.length; i++) {
					  Authorize mean = new Authorize();
					  mean.setItem_id(moduleIds[i]);
					  addMean.add(mean);
				}
			  //封装sql语句，执行要新增的授权菜单
			  if (addMean != null && addMean.size() > 0) {
				  for (int i = 0; i < addMean.size(); i++) {
					  addMean.get(i).setAuthorize_id(UUIDUtils.getUUID().toUpperCase());
					  addMean.get(i).setCategory(authorize.getCategory());
					  addMean.get(i).setObject_id(authorize.getObject_id());
					  addMean.get(i).setItem_type(authorize.getItem_type());
					  addMean.get(i).setSort_code(0);
					  SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
					  addMean.get(i).setCreate_date(sdf.format(new Date()));
					  addMean.get(i).setCreate_username(userInfo.getUser_name());
				  }
				  //封装sql语句，执行要新增的授权菜单[批量新增]
				  String addSql = RoleInfoConfigSql.addAuthorize(addMean);
				  int[] nus = JDBC_ZSGC.addBatch(addSql, jdbcBean);
				  if (nus.length > 0) {
						System.out.println("角色授权成功");
						resultMap.put("type", 1);
						resultMap.put("message", "角色授权成功");
					
					} else {
						System.out.println("角色授权失败");
						resultMap.put("type", 3);
						resultMap.put("message", "角色授权失败");
						return resultMap;
					}
			  }
			
			
			
		} else {
		  //获取要新增的菜单	
		  List<Authorize>  addMean = new ArrayList<Authorize>();
		  for (int i = 0; i < moduleIds.length; i++) {
			  Boolean flag = true;   // 默认是新增的菜单
			  for (int j = 0; j < authorizeData.size(); j++) {
				if (moduleIds[i].equals(authorizeData.get(j).getItem_id())) {
					flag = false;
                }
			  }
			  if (flag) {
				  Authorize mean = new Authorize();
				  mean.setItem_id(moduleIds[i]);
				  addMean.add(mean);
			  }
			}
		  //封装sql语句，执行要新增的授权菜单
		  if (addMean != null && addMean.size() > 0) {
			  for (int i = 0; i < addMean.size(); i++) {
				  addMean.get(i).setAuthorize_id(UUIDUtils.getUUID().toUpperCase());
				  addMean.get(i).setCategory(authorize.getCategory());
				  addMean.get(i).setObject_id(authorize.getObject_id());
				  addMean.get(i).setItem_type(authorize.getItem_type());
				  addMean.get(i).setSort_code(0);
				  SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
				  addMean.get(i).setCreate_date(sdf.format(new Date()));
				  addMean.get(i).setCreate_username(userInfo.getUser_name());
			  }
			  //封装sql语句，执行要新增的授权菜单[批量新增]
			  String addSql = RoleInfoConfigSql.addAuthorize(addMean);
			  int[] nus = JDBC_ZSGC.addBatch(addSql, jdbcBean);
			  if (nus[0] > 0) {
					System.out.println("角色授权成功");
					System.out.println("批量添加了"+nus[0]+"条记录");
					resultMap.put("type", 1);
					resultMap.put("message", "角色授权成功");
				
				} else {
					System.out.println("角色授权失败");
					resultMap.put("type", 3);
					resultMap.put("message", "角色授权失败");
					return resultMap;
				}
		  }
		  
		  
		  
		  //获取要删除的菜单;
		  List<Authorize>  delMean = new ArrayList<Authorize>();
		  for (int i = 0; i < authorizeData.size(); i++) {
			  Boolean flag = true;    //默认是删除的菜单
			  for (int j = 0; j < moduleIds.length; j++) {
				if (authorizeData.get(i).getItem_id().equals(moduleIds[j])) {
					flag = false;
					break;
                }
			  }
			  if (flag) {
				  Authorize mean = new Authorize();
				  mean.setItem_id(authorizeData.get(i).getItem_id());
				  delMean.add(mean);
			  }
			}
		  //封装sql语句，执行要删除的授权菜单
		  if (delMean != null && delMean.size() > 0) {
			  String delSql = RoleInfoConfigSql.delteAuthorize(delMean,authorize);
			  int nus = JDBC_ZSGC.del(delSql, jdbcBean);
			  if (nus > 0) {
					System.out.println("角色授权成功");
					System.out.println("批量删除了"+nus+"条记录");
					resultMap.put("type", 1);
					resultMap.put("message", "角色授权成功");
				} else {
					System.out.println("角色授权失败");
					resultMap.put("type", 3);
					resultMap.put("message", "角色授权失败");
					return resultMap;
				}
		  }
		  
		}
		
		resultMap.put("type", 1);
		resultMap.put("message", "角色授权成功");
		return resultMap;
	}

}
