package com.atguigu.springcloud.SysBug.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.atguigu.springcloud.SysBug.Service.SysBugService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysBug;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;
import com.springcloud.tool.StringUtil;
@RequestMapping("/sysBugController")
@RestController
public class SysBugController extends BaseContrller{
	
	@Autowired
	private SysBugService sysBugService;
	/**
     * 查找系统bug列表信息
     * @param request 获取session参数
     * @param response 输送回页面参数
     * 
     * */
	@RequestMapping(value = "/findSysBugList", method = RequestMethod.GET)
    public void findSysBugList(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> mapJson = new HashMap<>();
		//接收参数
		String searchConditions = request.getParameter("searchConditions");
		String token = request.getParameter("token");
		SysBug sysBug = new SysBug();
		
		try {
			
			 if(token.isEmpty()) {
				 mapJson.put("msg", "用户登录失效,请重新登录！");
			 } else {
				String tokenInfo =  Base64Tool.getFromBase64(token);
				System.out.println(tokenInfo);
			 }
			
			 if(searchConditions != null && searchConditions.length() > 0) {
			      sysBug = JsonUtils.readJson2Object(searchConditions,SysBug.class);
			 }
			 
			 int limitCount = RequestParamUtil.getIntParameter(request, "length", 10);
		        int startPage = ((RequestParamUtil.getIntParameter(request, "start", 0)) / limitCount) + 1;
		        PageUtil page = new PageUtil();
		      
		            page.setPageSize(limitCount);
		            page.setCurrentPage(startPage);
		            int tempVal = (page.getCurrentPage() - 1) * page.getPageSize();
		            page.setTempVal(tempVal);//下一页
		            sysBug.setPageUtil(page);
		            mapJson= sysBugService.findSysBugList(sysBug);
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
