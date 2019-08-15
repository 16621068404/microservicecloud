package com.atguigu.springcloud.Dictionary.Service;

import java.util.Map;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface DictionaryService {

	//查询所有的字典分类信息
	Object getDataItemTreeJson(User user);

	
	//获取通用字典页面数据表格
	Map getPageListJson(User user,String itemId, String keyword, String condition);

}
