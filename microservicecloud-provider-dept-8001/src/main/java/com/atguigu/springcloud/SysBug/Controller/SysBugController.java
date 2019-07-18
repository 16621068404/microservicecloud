package com.atguigu.springcloud.SysBug.Controller;

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
import com.springcloud.entity.PageUtil;
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

        int limitCount = RequestParamUtil.getIntParameter(request, "length", 10);
        int startPage = ((RequestParamUtil.getIntParameter(request, "start", 0)) / limitCount) + 1;
        PageUtil page = new PageUtil();
        Map<String, Object> mapJson = new HashMap<>();
            page.setPageSize(limitCount);
            page.setCurrentPage(startPage);
            int tempVal = (page.getCurrentPage() - 1) * page.getPageSize();
            page.setTempVal(tempVal);//下一页
            mapJson= sysBugService.findSysBugList(page);
            writerJsonResult(request,response, mapJson);// 结果回写
    }
	
	
	
	
	

}
