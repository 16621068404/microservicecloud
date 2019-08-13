package com.atguigu.springcloud.Department.Controller;

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

import com.atguigu.springcloud.Department.Service.DepartmentService;
import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.Depart;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;

@RestController
public class DepartmentController extends BaseContrller{
	
	
	@Autowired
	private DepartmentService departmentService;
	
	/**
	 * 跳转到部门信息界面
	 */
	@RequestMapping(value = "/system_manage/department_manage", method = RequestMethod.GET)
	public ModelAndView UserInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/department_list_view.html");
	}

	
	
	 /**
     * 获取部门页面信息
     * 网格数据
	   * 
	   */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/Department_manage/GetPageListJson", method = RequestMethod.POST)
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
				 //获取部门页面信息数据表格
				 pageUtil = departmentService.getPageListJson(user,pageUtil);
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
	 * 跳转到部门【新增/修改】界面
	 * 
	 */
	@RequestMapping(value = "/system_manage/department_manage/Form", method = RequestMethod.GET)
	public ModelAndView formInfo(HttpServletRequest request, HttpServletResponse response) {
		//获取参数
		String keyValue = request.getParameter("keyValue");
		if (keyValue == null || keyValue.equals("") || keyValue.equals("undefined")) {
		   return new ModelAndView("redirect:/views/system_manage/department_form_view.html");
		}
		   return new ModelAndView("redirect:/views/system_manage/department_form_view.html?keyValue="+keyValue);
	}
	
	
	/**
	 *  新增保存和修改保存共用一个方法
	 *  保存部门信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/department_manage/SaveForm", method = RequestMethod.POST)
	public void saveForm(HttpServletRequest request, HttpServletResponse response) {
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取参数
			String keyValue = request.getParameter("keyValue");
			//部门编号
			String depart_no = request.getParameter("depart_no");
			//数据状态
			String status = request.getParameter("status");
			//部门名称
			String depart_name = request.getParameter("depart_name");
			//部门负责人
			String depart_leader = request.getParameter("depart_leader");
			//部门电话
			String depart_tel = request.getParameter("depart_tel");
			//部门传真
			String depart_fax = request.getParameter("depart_fax");
			//部门email
			String depart_email = request.getParameter("depart_email");
			//部门内容
			String depart_content = request.getParameter("depart_content");
			//部门描述
			String remark = request.getParameter("remark");
			//封装参数====================封装参数========================
			Depart depart = new Depart(); 
			depart.setDepart_no(depart_no); 
			depart.setStatus(status);
			depart.setDepart_name(depart_name);
			depart.setDepart_leader(depart_leader);
			depart.setDepart_tel(depart_tel);
			depart.setDepart_fax(depart_fax);
			depart.setDepart_email(depart_email);
			depart.setDepart_content(depart_content);
			depart.setRemark(remark);
			
			//创建当前用户对象
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
				//保存部门基本信息
				resultMap = departmentService.saveDepartmentForm(user,depart,keyValue);
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
	 *  编辑部门，数据回显   
	 * 根据部门id，查询部门信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/department_manage/GetFormJson", method = RequestMethod.GET)
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
				 //查询部门信息
				 resultJson = departmentService.findDepartmentForm(user,keyValue);
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
