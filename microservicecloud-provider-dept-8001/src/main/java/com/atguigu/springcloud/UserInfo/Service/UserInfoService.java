package com.atguigu.springcloud.UserInfo.Service;


import java.util.List;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface UserInfoService {

	/**
     * 获取页面grid列表配置
	 * @param grid_id 
	 * 
	 */
	Object getGridByGridCode(User user, String grid_code);
	/**
	 * 获取页面grid列表字段配置
	 * @param user
	 * @param grid_id
	 * @return
	 */
	List getColumnByGridId(User user, String grid_id);
	/**
	 * 获取用户页面数据表格
	 * @param user
	 * @param pageUtil
	 * @return
	 */
	PageUtil getPageListJson(User user, PageUtil pageUtil);

}
