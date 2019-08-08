package com.atguigu.springcloud.Login.Controller;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.tool.DateUtils;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.StringUtil;

public class BaseContrller {

	  /**
     * 将结果集写入返回对象
     *
     * @param response 输送回页面参数
     * @param objResult
     */
    public static void writerJsonResult(HttpServletRequest request, HttpServletResponse response, Object objResult) {
        try {
            response.setHeader("Content-type", "text/html;charset=UTF-8");
            String sessionid = getSessionId(request);
            if (StringUtil.isEmpty(sessionid)) {
                sessionid = getSessionId(response);
            }
            response.setHeader("set-cookie", "JSESSIONID=" + sessionid);
            response.getWriter().print(JsonUtils.objWithDate2Json(objResult, DateUtils.DATE_TIME_FORMAT));
        } catch (IOException e) {
            // TODO 异常处理
            e.printStackTrace();
        }
    }
    
    /**
     * 将json转化为指定的参数对象
     *
     * @param request
     * @param classType
     * @return
     */
    public static <T> T getParamsYmd(HttpServletRequest request, Class<T> classType, String param) {
        T conditons = null;
        String json = request.getParameter(param);
        json = StringUtil.isNullOrBlank(json) ? JsonUtils.DEFAULT_JSON : json;
        try {
            conditons = (T)JsonUtils.readJson2ObjectFormat(json, classType, DateUtils.DATE_FORMAT);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return conditons;
    }
	

    /**
     * 读取sessiion
     *
     * @param request
     * @param objName
     * @param obj
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    public static String getSessionId(HttpServletRequest request) throws JsonParseException, JsonMappingException, IOException {
        String sessionid = "";
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (int i = 0; i < cookies.length; i++) {
                if ("JSESSIONID".equals(cookies[i].getName())) {
                    sessionid = cookies[i].getValue();
                }
            }
        }
        return sessionid;
    }
    
    /**
     * 读取sessiion
     *
     * @param request
     * @param objName
     * @param obj
     * @return
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */
    public static String getSessionId(HttpServletResponse response) throws JsonParseException, JsonMappingException, IOException {

        String[] sessionid = null;
        if (response.getHeader("set-cookie") != null) {
            sessionid = response.getHeader("set-cookie").split("=");
        } else {
            return null;
        }
        return sessionid[1];
    }

}
