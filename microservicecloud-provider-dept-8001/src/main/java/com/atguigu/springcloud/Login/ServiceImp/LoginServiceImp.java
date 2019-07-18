package com.atguigu.springcloud.Login.ServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.Login.Dao.LoginDao;
import com.atguigu.springcloud.Login.Service.LoginService;
import com.springcloud.BaseResponse.BaseApiService;
import com.springcloud.BaseResponse.BaseResponse;
import com.springcloud.entity.User;
@Service
public class LoginServiceImp implements LoginService{

	@Autowired
	private LoginDao loginDao;
	
	
	public BaseResponse findLoginUser(User users) {
		
		User user = loginDao.findLoginUserDao(users);
		BaseResponse baseResponse = new BaseResponse();
		BaseApiService baseApiService = new BaseApiService();
		if(user == null) {
			baseResponse = baseApiService.setResultError("该用户不存在或者用户名密码错误！");
			return baseResponse;
		}
		baseResponse = baseApiService.setResultSuccess("用户登录成功！");
		return baseResponse;
	}

	
	
}
