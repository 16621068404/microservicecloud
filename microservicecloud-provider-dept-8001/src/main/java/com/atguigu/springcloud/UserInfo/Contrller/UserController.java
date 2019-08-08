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
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysGrid;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.EscapeUtils;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;
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
		
		
		 /**
	       * 获取用户页面信息
	       * 网格数据
		   * 
		   */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/user_manage/GetPageListJson", method = RequestMethod.POST)
		  public void getPageListJson(HttpServletRequest request, HttpServletResponse response) {
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
				//页面展示条数
				Integer pageSize = RequestParamUtil.getIntParameter(request,"rows",30);
				pageUtil.setPageSize(pageSize);
				int tempVal = (pageUtil.getPage() - 1) * pageUtil.getPageSize();
				pageUtil.setTempVal(tempVal); //下一页
				
				
				
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
					 //获取用户页面数据表格
					 pageUtil = userInfoService.getPageListJson(user,pageUtil);
				} catch (JsonParseException e) {
					e.printStackTrace();
				} catch (JsonMappingException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					 writerJsonResult(request,response, pageUtil);// 结果回写
				}
					
	      }
		
		
	     
		/**
		 * 
		 * 用户管理界面弹出from表单
		 *   进行用户的新增
		 */
		@RequestMapping(value = "/system_manage/user_manage/AddUser", method = RequestMethod.GET)
		public ModelAndView addUser(HttpServletRequest request, HttpServletResponse response) {
			return new ModelAndView("redirect:/views/system_manage/user_form_view.html");
		}
		
		
		
		/**
		 * 查询部门信息
		 * /system_manage/department_manage/GetDepartDropdownList
		 * 
		 */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/department_manage/GetDepartDropdownList", method = RequestMethod.GET)
		public void getDepartDropdownList(HttpServletRequest request, HttpServletResponse response) {
			
			    List department = new ArrayList();
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
					 //获取部门信息
					 department = userInfoService.getDepartDropdownList(user);
				} catch (JsonParseException e) {
					e.printStackTrace();
				} catch (JsonMappingException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					 writerJsonResult(request,response, department);// 结果回写
				}
					
	      }
		
		/**
		 *  保存用户
		 * 新增或者修改2个功能共用一个方法
		 */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/user_manage/SaveForm", method = RequestMethod.POST)
		public void saveForm(HttpServletRequest request, HttpServletResponse response) {
			
			    Map resultMap = new HashMap();
				//获取token,token中含有用户的基本信息；
				String token = request.getParameter("token");
				String keyValue = request.getParameter("keyValue");
				
				//接收字符串,并转成对象
				User saveUser = getParamsYmd(request, User.class, "UserEntity");
				
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
					 //保存用户信息
					resultMap = userInfoService.saveUserForm(user,saveUser);
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
		 * 跳转到编辑用户信息界面
		 */
		@RequestMapping(value = "/system_manage/user_manage/EditUser", method = RequestMethod.GET)
		public ModelAndView EditUser(HttpServletRequest request, HttpServletResponse response) {
			String keyValue = request.getParameter("keyValue");
			return new ModelAndView("redirect:/views/system_manage/user_form_view.html?keyValue="+keyValue);
		}
		
		
		/**
		 *  编辑用户，数据回显   
		 * 根据用户id，查询用户信息
		 * 
		 */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/user_manage/GetFormJson", method = RequestMethod.GET)
		public void getFormJson(HttpServletRequest request, HttpServletResponse response) {
			
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
					 //查询用户信息
					 resultJson = userInfoService.findUserForm(user,keyValue);
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
		 * 跳转到修改用户密码信息界面
		 */
		@RequestMapping(value = "/system_manage/user_manage/RevisePassword", method = RequestMethod.GET)
		public ModelAndView revisePassword(HttpServletRequest request, HttpServletResponse response) {
			String keyValue = request.getParameter("keyValue");
			String user_logid = request.getParameter("user_logid");
			String user_name = request.getParameter("user_name");
			//对js中escape编码
			user_name = EscapeUtils.escape(user_name);
			return new ModelAndView("redirect:/views/system_manage/revise_password_view.html?keyValue="+keyValue+"&user_logid="+user_logid+"&user_name="+user_name);
		}
	  
		
		
		
		
		/**
		 *  重置密码
		 *  
		 */
		@SuppressWarnings("rawtypes")
		@RequestMapping(value = "/system_manage/user_manage/SaveRevisePassword", method = RequestMethod.POST)
		public void saveRevisePassword(HttpServletRequest request, HttpServletResponse response) {
			
			    Map resultMap = new HashMap();
				//获取token,token中含有用户的基本信息；
				String token = request.getParameter("token");
				String keyValue = request.getParameter("keyValue");
				String Password = request.getParameter("Password");
				
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
					 //保存用户密码
					resultMap = userInfoService.saveUserPassword(user,keyValue,Password);
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
		
	  
	  
}
