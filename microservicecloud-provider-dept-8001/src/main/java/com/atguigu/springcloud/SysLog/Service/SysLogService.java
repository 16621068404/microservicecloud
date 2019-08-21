package com.atguigu.springcloud.SysLog.Service;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;

public interface SysLogService {

	//获取系统日志页面数据表格
	PageUtil getPageListJson(User user, PageUtil pageUtil);

}
