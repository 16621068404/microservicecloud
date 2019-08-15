package com.atguigu.springcloud.Dictionary.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.atguigu.springcloud.Dictionary.Service.DictionaryService;
import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;

@RestController
public class DictionaryController extends BaseContrller{

	@Autowired
	private DictionaryService dictionaryService;
	
	/**
	 * 跳转到通用字典界面
	 */
	@RequestMapping(value = "/system_manage/dataitem_manage", method = RequestMethod.GET)
	public ModelAndView meanInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/dataitem_detail_list_view.html");
	}
	
	
	/**
	 * 查询所有的字典分类信息
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemTreeJson", method = RequestMethod.GET)
	public void getDataItemTreeJson(HttpServletRequest request, HttpServletResponse response) {
		
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
				 //查询所有的字典分类信息
				 resultJson = dictionaryService.getDataItemTreeJson(user);
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
	
	
	/**
     * 获取通用字典明细页面信息
     * 网格数据
     * 
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemDetailTreeList", method = RequestMethod.GET)
	  public void getDataItemDetailTreeList(HttpServletRequest request, HttpServletResponse response) {
		    Map resutJson = new HashMap();    
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//字典分类id
			String itemId = request.getParameter("itemId");
			//搜索内容
			String keyword = request.getParameter("keyword");
			//搜索字段条件
			String condition = request.getParameter("condition");
			
			//创建用户对象
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
				 //获取通用字典页面数据表格
				 resutJson = dictionaryService.getPageListJson(user,itemId,keyword,condition);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response,resutJson);// 结果回写
			}
				
    }
	
	
	
	
	
	
	
	
}
