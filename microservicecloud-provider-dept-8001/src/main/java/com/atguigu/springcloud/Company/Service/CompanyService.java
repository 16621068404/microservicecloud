package com.atguigu.springcloud.Company.Service;

import java.util.Map;

import com.springcloud.entity.Company;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface CompanyService {

	//查询登录用户所在公司信息
	Object findLoginCompanyInfo(User user);

	//公司信息界面，关于公司编号的生成，本系统不做处理。点击保存，公司信息只做更新操作，保存到中心库中.
	Map saveCompanyForm(Company company, String keyValue);
	
	// 保存公司简介信息
	Object saveContent(User user, String cust_content);

	//文件名称保存到数据库
	void saveUploadFileName(Company company);

}
