package com.atguigu.springcloud.Role.Controller;

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
import com.atguigu.springcloud.Role.Service.RoleInfoService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.Authorize;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;

@RestController
public class RoleController extends BaseContrller{

	@Autowired
	private RoleInfoService roleInfoService;
	
	/**
	 * 跳转到角色信息界面
	 */
	@RequestMapping(value = "/system_manage/role_manage", method = RequestMethod.GET)
	public ModelAndView UserInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/role_list_view.html");
	}
	
	
	
	
	/**
     * 获取角色页面信息
     * 网格数据
     * system_manage/role_manage/GetPageListJson
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/role_manage/GetPageListJson", method = RequestMethod.POST)
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
				 pageUtil = roleInfoService.getPageListJson(user,pageUtil);
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
	 * 跳转到角色【新增/修改】界面
	 * 
	 */
	@RequestMapping(value = "/system_manage/role_manage/Form", method = RequestMethod.GET)
	public ModelAndView formInfo(HttpServletRequest request, HttpServletResponse response) {
		//获取参数
		String keyValue = request.getParameter("keyValue");
		return new ModelAndView("redirect:/views/system_manage/role_form_view.html?keyValue="+keyValue);
	}
	
	
	/**
	 *  新增保存和修改保存共用一个方法
	 * 保存角色用户信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/role_manage/SaveForm", method = RequestMethod.POST)
	public void saveForm(HttpServletRequest request, HttpServletResponse response) {
		
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取参数
			String keyValue = request.getParameter("keyValue");
			//角色编号
			String role_no = request.getParameter("role_no");
			//角色名称
			String role_name = request.getParameter("role_name");
			//数据状态
			String status = request.getParameter("status");
			//角色描述
			String remark = request.getParameter("remark");
			//封装参数
			Role role = new Role(); 
			role.setRole_no(role_no);
			role.setRole_name(role_name);
			role.setStatus(status);
			role.setRemark(remark);
			
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
				//保存角色信息
				resultMap = roleInfoService.saveRoleForm(user,role);
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
	 *  编辑角色，数据回显   
	 * 根据角色id，查询角色信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/role_manage/GetFormJson", method = RequestMethod.GET)
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
				 //查询角色信息
				 resultJson = roleInfoService.findRoleForm(user,keyValue);
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
	   * 跳转到角色授权
	   */
	@RequestMapping(value = "system_manage/role_manage/AllotRight", method = RequestMethod.GET)
	public ModelAndView allotRight(HttpServletRequest request, HttpServletResponse response) {
		//获取参数
		String ObjectId = request.getParameter("ObjectId");
		String Category = request.getParameter("Category");
		return new ModelAndView("redirect:/views/system_manage/allot_right_view.html?ObjectId="+ObjectId+"&Category="+Category);
	}
	
	
	/**
	 * 
	 * 查询所有的菜单信息
	 * 
	 */
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/authorize_manage/ModuleTreeJson", method = RequestMethod.GET)
	public void moduleTreeJson(HttpServletRequest request, HttpServletResponse response) {
		
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//项目类型------1-菜单2-按钮3-视图4表单'--sys_authorize 系统用户角色授权表';
			int item_type = RequestParamUtil.getIntParameter(request, "itemType", 1);
			//角色id---------------object_id--sys_authorize 系统用户角色授权表';
			String object_id = request.getParameter("objectId");
			//对象分类   1-部门2-角色3-岗位4-职位5-工作组'--------------sys_authorize 系统用户角色授权表';
			int category = RequestParamUtil.getIntParameter(request, "category", 2);
			//封装参数  授权表
			Authorize authorize = new Authorize();
			authorize.setCategory(category);
			authorize.setItem_type(item_type);
			authorize.setObject_id(object_id);
			
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
				 resultJson = roleInfoService.moduleTreeJson(user,authorize);
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
	   * 角色授权保存
	   * 
	   */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/system_manage/authorize_manage/SaveAuthorize", method = RequestMethod.POST)
	public void saveAuthorize(HttpServletRequest request, HttpServletResponse response) {
		
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//角色id
			String ObjectId = request.getParameter("ObjectId");
			//对象分类   1-部门2-角色3-岗位4-职位5-工作组'--------------sys_authorize 系统用户角色授权表';
			int Category = RequestParamUtil.getIntParameter(request, "Category", 2);
			//分配的菜单id
			String moduleIds = request.getParameter("moduleIds");
			int item_type = RequestParamUtil.getIntParameter(request, "item_type", 1);
			
			//封装接收的参数
			Authorize authorize = new Authorize();
			authorize.setObject_id(ObjectId);  //角色id
			authorize.setCategory(Category);   //对象分类:1-部门2-角色3-岗位4-职位5-工作组
			authorize.setItem_id(moduleIds);   //菜单的id
			authorize.setItem_type(item_type); //项目类型:1-菜单2-按钮3-视图4表单
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
				 //保存角色授权信息
				resultMap = roleInfoService.saveAuthorize(user,authorize);
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
	 * 跳转到角色成员界面（为成员分配角色，或者说给角色找成员）
	 * 
	 */
	@RequestMapping(value = "/system_manage/role_manage/allotMember", method = RequestMethod.GET)
	public ModelAndView allotMember(HttpServletRequest request, HttpServletResponse response) {
		//获取参数
		String roleId = request.getParameter("roleId");
		return new ModelAndView("redirect:/views/system_manage/allot_member_view.html?roleId="+roleId);
	}
	
	
	/**
	 * 
	 * 查询所有用户,并把已经分配对应角色的用户标记起来
	 * @param request
	 * @param response
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/role_manage/getRoleMember", method = RequestMethod.GET)
	public void getRoleMember(HttpServletRequest request, HttpServletResponse response) {
		
		    List resultJson = new ArrayList();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//角色ID 
			String roleId = request.getParameter("roleId");
			
			
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
				 //查询所有的成员(用户成员)
				 resultJson = roleInfoService.getRoleMember(user,roleId);
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
	 * 给角色添加成员，保存成员-角色信息；
	 * @param request
	 * @param response
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/role_manage/SaveMember", method = RequestMethod.POST)
	public void saveMember(HttpServletRequest request, HttpServletResponse response) {
		
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//角色ID 
			String role_no = request.getParameter("role_no");
			//角色所赋予的用户ids
			String user_ids = request.getParameter("user_ids");
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
				 //给角色添加成员，保存成员-角色信息；,保存用户有关角色的信息  (每一个成员，只能有一个角色)
				 resultJson = roleInfoService.saveMember(user,role_no,user_ids);
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
