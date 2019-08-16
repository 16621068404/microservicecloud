package com.atguigu.springcloud.Dictionary.Service;

import java.util.Map;

import com.springcloud.entity.Dictionary;
import com.springcloud.entity.DictionaryDetail;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface DictionaryService {

	//查询所有的字典分类信息
	Object getDataItemTreeJson(User user);

	
	//获取通用字典页面数据表格
	Map getPageListJson(User user,String itemId, String keyword, String condition);

    //保存字典明细信息
	Map saveDictionaryDetailForm(User user, DictionaryDetail dictionaryDetail, String keyValue);

	//查询字典明细信息
	Object findDictionaryDetailForm(User user, String keyValue);

	//删除字典明细信息
	Object removeDetailForm(User user, String keyValue);

	//获取通用字典分类页面数据表格
	Map getDictionaryTreeList(User user);

	//保存字典分类信息
	Map saveDictionaryForm(User user, Dictionary dictionary, String keyValue);

	//查询字典分类信息
	Object getDataItemFormJson(User user, String keyValue);

	//删除字典分类信息
	Object removeDictionaryForm(User user, String keyValue);

}
