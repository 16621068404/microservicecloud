package com.atguigu.springcloud.Mean.Controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.atguigu.springcloud.Mean.Service.MenuService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;

@RestController
public class MenuController extends BaseContrller{
	
	
	@Autowired
	private MenuService menuService;
	
	
	/**
	 * 跳转到菜单功能界面
	 */
	@RequestMapping(value = "/system_manage/menu_manage", method = RequestMethod.GET)
	public ModelAndView meanInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/menu_list_view.html");
	}
	
	
	/**
	 * 查询所有的菜单信息
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/getMenuTreeJson", method = RequestMethod.GET)
	public void getMenuTreeJson(HttpServletRequest request, HttpServletResponse response) {
		
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			
			User user = new User();
			try {
				 //判断token是否失效
				 if(token.equals("undefined")) {
				     return;
				 } else {
					//读取token
					String tokenInfo =  Base64Tool.getFromBase64(token.replaceAll(" ",""));
				    //将token转化为Users对象
					user = JsonUtils.readJson2Object(tokenInfo, User.class);
				 }
				 //查询所有的菜单信息
				 resultJson = menuService.getMenuTreeJson(user);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, resultJson);// 结果回写
			}
				
      }
	
	
	
	
	

	
	
}
