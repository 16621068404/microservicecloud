package com.atguigu.springcloud.Login.ServiceImp;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.Login.Dao.LoginDao;
import com.atguigu.springcloud.Login.Service.LoginService;
import com.springcloud.BaseResponse.BaseApiService;
import com.springcloud.BaseResponse.BaseResponse;
import com.springcloud.entity.User;
import com.springcloud.tool.MD5Utils;
import com.springcloud.tool.TokenProccessor;
@SuppressWarnings("rawtypes")
@Service
public class LoginServiceImp implements LoginService{

	@Autowired
	private LoginDao loginDao;
	
	
	public  Map<String, Object> findLoginUser(User users) {
		
		Map<String, Object> mapJson = new HashMap<>();
		
		//将密码进行md5加密后，去访问数据库
		String pwd = MD5Utils.string2MD5(users.getUser_logpass());
		users.setUser_logpass(pwd);
		User user = loginDao.findLoginUserDao(users);
		BaseResponse baseResponse = new BaseResponse();
		BaseApiService baseApiService = new BaseApiService();
		if(user == null) {
			mapJson.put("code", 500);
			mapJson.put("msg", "该用户不存在或者用户名密码错误！");
			mapJson.put("date", null);
			return mapJson;
		}
	  /*
	   * 生成token
	   */ 
       String token = TokenProccessor.getInstance().makeToken(user); 
       mapJson.put("code", 200);
	   mapJson.put("msg", "用户登录成功！");
	   mapJson.put("date", token);
	   return mapJson;
	}

	
	
}
