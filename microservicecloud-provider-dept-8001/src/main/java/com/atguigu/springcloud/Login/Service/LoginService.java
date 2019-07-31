package com.atguigu.springcloud.Login.Service;

import java.util.Map;

import com.springcloud.BaseResponse.BaseResponse;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface LoginService {

	 
	 Map<String, Object> findLoginUser(User user);
	

}
