package com.atguigu.springcloud.Login.Controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.atguigu.springcloud.Login.Service.LoginService;
import com.springcloud.BaseResponse.BaseResponse;
import com.springcloud.entity.User;
import com.springcloud.tool.JsonUtils;
@RequestMapping("/loginController")
@RestController
@SuppressWarnings("rawtypes")
public class LoginController extends BaseContrller{
	
	@Autowired
	private LoginService loginService;

	
	/**
	 * 描述：用户登录验证
	 * 时间：2019年7月15日16:15:45
	 * 作者：冯光明
	 * String json = null;
	 * json = JsonUtils.obj2Json(baseResponse);
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public void login(HttpServletRequest request, HttpServletResponse response, User user) {
	    //向浏览器发送一个响应头，设置浏览器的解码方式为UTF-8
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        Map<String, Object> mapJson = new HashMap<>();
		
		try {
			mapJson = loginService.findLoginUser(user);
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			writerJsonResult(request, response, mapJson);	
		}
		
	  
	}


	

	
	

}