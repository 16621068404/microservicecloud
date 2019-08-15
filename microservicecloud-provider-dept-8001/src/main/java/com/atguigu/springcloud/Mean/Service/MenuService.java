package com.atguigu.springcloud.Mean.Service;

import com.springcloud.entity.User;

public interface MenuService {

	//查询所有的菜单信息
	Object getMenuTreeJson(User user);

}
