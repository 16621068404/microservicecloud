package com.atguigu.springcloud.Mean.Controller;

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
import com.atguigu.springcloud.Mean.Service.MenuService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.DictionaryDetail;
import com.springcloud.entity.Mean;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;

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
	
	 /**
       * 获取菜单功能页面信息
       * 网格数据
	   * 
	   */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/ModuleDataList", method = RequestMethod.GET)
	  public void moduleDataList(HttpServletRequest request, HttpServletResponse response) {
		  
		  List resultList = new ArrayList(); 
		    //用于分页的实体bean
		    PageUtil pageUtil = new PageUtil();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取当前页面
			Integer page = RequestParamUtil.getIntParameter(request,"page",0);
			pageUtil.setPage(page);
			//排序方式
			String sord = request.getParameter("sord");
			if(sord!= null && !sord.equals("") && !sord.equals("undefined")) {
			   pageUtil.setSord(sord);
			} else {
				pageUtil.setSord("asc");
			}
			//要排序的字段
			String sidx = request.getParameter("sidx");
			pageUtil.setSidx(sidx);
			
			//获取父级id
			String parentid = request.getParameter("parentid");
			if (parentid == null || parentid.equals("")) {
				parentid = "0";
			}			
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
				 // 获取菜单功能页面信息
				 resultList = menuService.getModuleDataList(user,pageUtil,parentid);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, resultList);// 结果回写
			}
				
    }
	
	
	

	/**
	 * 跳转到菜单【新增】【编辑】功能界面
	 */
	@RequestMapping(value = "/system_manage/menu_manage/moduleForm", method = RequestMethod.GET)
	public ModelAndView moduleForm(HttpServletRequest request, HttpServletResponse response) {
		//获取父级id
		String parent_id = request.getParameter("parent_id");
		
		String keyValue = request.getParameter("keyValue");
		if (keyValue == null || keyValue.equals("")) {
			return new ModelAndView("redirect:/views/system_manage/menu_form_view.html?parent_id="+parent_id);
		}
		return new ModelAndView("redirect:/views/system_manage/menu_form_view.html?keyValue="+keyValue);
	}
	
	
	/**
	 * 新增界面： 【上级】文本框是一个树结构，获取菜单树。
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/getAllMenuTreeJson", method = RequestMethod.GET)
	public void getAllMenuTreeJson(HttpServletRequest request, HttpServletResponse response) {
		
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
	
	/**
	 * 
	 * 跳转到图标界面
	 * 
	 */
	@RequestMapping(value = "/system_manage/main_frame/icon", method = RequestMethod.GET)
	public ModelAndView icon(HttpServletRequest request, HttpServletResponse response) {
		
			String ControlId = request.getParameter("ControlId");
			return new ModelAndView("redirect:/views/system_manage/icon_view.html?ControlId="+ControlId);
	
	}
	

	
	/**
	 *  新增保存和修改保存共用一个方法
	 *   保存【菜单信息】
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/SaveModuleForm", method = RequestMethod.POST)
	public void saveModuleForm(HttpServletRequest request, HttpServletResponse response) {
		
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取参数
			String keyValue = request.getParameter("keyValue");
			//菜单编号
			String menu_code = request.getParameter("menu_code");
			//菜单名称
			String menu_name = request.getParameter("menu_name");
			//父级id
			String parent_id = request.getParameter("parent_id");
			//图标
			String menu_icon = request.getParameter("menu_icon");
			//导航类型
			String menu_type = request.getParameter("menu_type");
			//排序
			int sort_code = RequestParamUtil.getIntParameter(request, "sort_code", 1);
			//访问地址
			String url_address = request.getParameter("url_address");
			//有效标记
			int enabled_mark = RequestParamUtil.getIntParameter(request, "enabled_mark", 1);
			//是否有分隔线
			int is_split = RequestParamUtil.getIntParameter(request, "is_split", 0);
			//备注
			String remark = request.getParameter("remark");
			//封装参数
			Mean mean = new Mean();
			mean.setMenu_code(menu_code);
			mean.setMenu_name(menu_name);
			mean.setParent_id(parent_id);
			mean.setMenu_icon(menu_icon);
			mean.setMenu_type(menu_type);
			mean.setSort_code(sort_code);
			mean.setUrl_address(url_address);
			mean.setUrl_address(url_address);
			mean.setEnabled_mark(enabled_mark);
			mean.setIs_split(is_split);
			mean.setRemark(remark);
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
				//保存菜单信息
				resultMap = menuService.saveMenuForm(user,mean,keyValue);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, resultMap);// 结果回写
			}
      }
	
	
	/**
	 *  编辑菜单，数据回显   
	 * 根据菜单id，查询菜单信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/EditModule", method = RequestMethod.GET)
	public void editModule(HttpServletRequest request, HttpServletResponse response) {
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			String keyValue = request.getParameter("keyValue");
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
				 //查询菜单信息
				 resultJson = menuService.findMenuForm(user,keyValue);
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
	 *  
	 * 根据菜单id，删除菜单信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/menu_manage/RemoveForm", method = RequestMethod.POST)
	public void removeForm(HttpServletRequest request, HttpServletResponse response) {
		
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			String keyValue = request.getParameter("keyValue");
			
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
				 //删除菜单信息
				 resultJson = menuService.removeMenuInfo(user,keyValue);
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
