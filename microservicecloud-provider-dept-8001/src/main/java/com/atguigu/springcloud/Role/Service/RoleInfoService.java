package com.atguigu.springcloud.Role.Service;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;

public interface RoleInfoService {

	PageUtil getPageListJson(User user, PageUtil pageUtil);

}
