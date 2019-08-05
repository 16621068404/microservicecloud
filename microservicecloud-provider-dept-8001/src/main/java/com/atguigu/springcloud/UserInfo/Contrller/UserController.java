package com.atguigu.springcloud.UserInfo.Contrller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.atguigu.springcloud.UserInfo.Service.UserInfoService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.SysGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
@SuppressWarnings("unused")
@RestController
public class UserController extends BaseContrller{

	
	@Autowired
	private UserInfoService userInfoService;
	
	/**
	 * 跳转到用户信息界面
	 */
	@RequestMapping(value = "/system_manage/user_manage", method = RequestMethod.GET)
	public ModelAndView UserInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/user_list_view.html");
	}

	/**
      * 获取页面grid列表配置
	  * 
	  */
     
	  @RequestMapping(value = "/system_manage/grid_column_manage/GetGridByGridCode", method = RequestMethod.POST)
	  public void getGridByGridCode(HttpServletRequest request, HttpServletResponse response) {
		
		   Object sysGrid = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//页面grid列表配置
			String grid_code = request.getParameter("grid_code");
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
				//获取页面grid列表配置
				 sysGrid = userInfoService.getGridByGridCode(user,grid_code);
				
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, sysGrid);// 结果回写
			}
				
      }
	  
		 /**
	       * 获取页面grid列表字段配置
		   * 
		   */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/grid_column_manage/GetColumnByGridId", method = RequestMethod.POST)
		  public void getColumnByGridId(HttpServletRequest request, HttpServletResponse response) {
			
			    List sysColumn = new ArrayList();
				//获取token,token中含有用户的基本信息；
				String token = request.getParameter("token");
				//获取页面grid列表字段配置
				String grid_id = request.getParameter("grid_id");
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
					 //获取页面grid列表配置
					 sysColumn = userInfoService.getColumnByGridId(user,grid_id);
				} catch (JsonParseException e) {
					e.printStackTrace();
				} catch (JsonMappingException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					 writerJsonResult(request,response, sysColumn);// 结果回写
				}
					
	      }
		
		
		
		
	  
		
		
		
	  
	  
	  
}
