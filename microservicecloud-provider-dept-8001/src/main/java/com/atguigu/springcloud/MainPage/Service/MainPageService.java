package com.atguigu.springcloud.MainPage.Service;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.springcloud.entity.User;

public interface MainPageService {

	 //查询主页面信息
	Map<String, Object> findMainPageInfo(User user, HttpServletRequest request) throws IOException;
	
	

}
