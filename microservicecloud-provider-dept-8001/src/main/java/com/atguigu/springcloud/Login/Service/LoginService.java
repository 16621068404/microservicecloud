package com.atguigu.springcloud.Login.Service;

import com.springcloud.BaseResponse.BaseResponse;
import com.springcloud.entity.User;

public interface LoginService {

	 BaseResponse findLoginUser(User user);
	

}
