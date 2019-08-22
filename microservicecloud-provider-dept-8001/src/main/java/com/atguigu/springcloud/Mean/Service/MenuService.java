package com.atguigu.springcloud.Mean.Service;

import java.util.List;
import java.util.Map;

import com.springcloud.entity.Mean;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;

public interface MenuService {

	//查询所有的菜单信息
	Object getMenuTreeJson(User user);

	//获取菜单功能页面信息
	List getModuleDataList(User user, PageUtil pageUtil, String parentid);

	//保存菜单信息
	Map saveMenuForm(User user, Mean mean, String keyValue);

	//查询菜单信息
	Object findMenuForm(User user, String keyValue);

	//删除菜单信息
	Object removeMenuInfo(User user, String keyValue);

	
	

}
