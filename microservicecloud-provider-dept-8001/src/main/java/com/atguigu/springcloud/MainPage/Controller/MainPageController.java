package com.atguigu.springcloud.MainPage.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.atguigu.springcloud.MainPage.Service.MainPageService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;

@RequestMapping("/mainPage")
@RestController
public class MainPageController extends BaseContrller {

	@Autowired
	private MainPageService mainPageService;
	
	/**
	 * 功能描述：查询主页面信息
	 * 作者：冯光明
	 * 时间：2019年7月29日16:14:39
	 */
	@RequestMapping(value = "/findMainPageInfo", method = RequestMethod.GET)
    public void findSysBugList(HttpServletRequest request, HttpServletResponse response) {
		
		
		
		
		Map<String, Object> mapJson = new HashMap<>();
		//获取token,token中含有用户的基本信息；
		String token = request.getParameter("token");
		User user = new User();
		try {
			 //判断token是否失效
			 if(token.equals("undefined")) {
				 
				 mapJson.put("msg", "用户登录失效,请重新登录！");
				 mapJson.put("data", null);
			     mapJson.put("code", 500);
			     return;
			     
			 } else {
				//读取token
				String tokenInfo =  Base64Tool.getFromBase64(token);
			    //将token转化为Users对象
				user = JsonUtils.readJson2Object(tokenInfo, User.class);
				
			 }
			 
			//查询主页面信息
			mapJson = mainPageService.findMainPageInfo(user,request);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			 writerJsonResult(request,response, mapJson);// 结果回写
		}
			
	
		
       
           
    }
	
	
	
}
