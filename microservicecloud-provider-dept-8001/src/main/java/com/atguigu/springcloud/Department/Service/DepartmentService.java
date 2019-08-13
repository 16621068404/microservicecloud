package com.atguigu.springcloud.Department.Service;

import java.util.Map;

import com.springcloud.entity.Depart;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;

public interface DepartmentService {

	//获取部门页面信息数据表格
	PageUtil getPageListJson(User user, PageUtil pageUtil);
	//保存部门基本信息
	Map saveDepartmentForm(User user, Depart depart, String keyValue);
	//查询部门信息
	Object findDepartmentForm(User user, String keyValue);

}
