package com.atguigu.springcloud.UserInfo.Service;


import java.util.List;

import com.springcloud.entity.User;

public interface UserInfoService {

	 /**
      * 获取页面grid列表配置
	 * @param grid_id 
	  * 
	  */
	Object getGridByGridCode(User user, String grid_code);

	List getColumnByGridId(User user, String grid_id);

}
