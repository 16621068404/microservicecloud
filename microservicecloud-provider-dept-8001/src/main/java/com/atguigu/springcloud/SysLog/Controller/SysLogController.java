package com.atguigu.springcloud.SysLog.Controller;

import java.io.IOException;
import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.atguigu.springcloud.SysLog.Service.SysLogService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;

@RestController
public class SysLogController extends BaseContrller{
	
	@Autowired
	private SysLogService sysLogService;
	
	
	/**
	 * 跳转到系统日志界面
	 */
	@RequestMapping(value = "/system_manage/log_manage", method = RequestMethod.GET)
	public ModelAndView UserInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/sys_log_list_view.html");
	}
	
	
	 /**
     * 获取系统日志页面信息
     * 网格数据
	   * 
	   */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/log_manage/GetPageListJson", method = RequestMethod.POST)
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
			
			
			//参数，多条件搜索字段信息     columnsearch
			String columnsearch = request.getParameter("columnsearch");
			if (columnsearch != null && !columnsearch.equals("")) {
            	 columnsearch = request.getParameter("columnsearch").replaceAll("☻","%");
				 pageUtil.setColumnsearch(columnsearch);
			}
			//开始时间
			String begindate = request.getParameter("begindate");
			if(begindate != null && !begindate.equals("")) {
				pageUtil.setBegindate(begindate);
			}
			//结束时间
			String enddate = request.getParameter("enddate");
			if(enddate != null && !enddate.equals("")) {
				pageUtil.setEnddate(enddate);
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
				 //获取系统日志页面数据表格
				 pageUtil = sysLogService.getPageListJson(user,pageUtil);
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
	
	
	
	
	
	
	
	
	

}
