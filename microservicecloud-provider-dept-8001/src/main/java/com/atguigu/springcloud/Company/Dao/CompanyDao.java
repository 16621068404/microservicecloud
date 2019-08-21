package com.atguigu.springcloud.Company.Dao;

import org.apache.ibatis.annotations.Mapper;

import com.springcloud.entity.Company;
import com.springcloud.entity.User;

@Mapper
public interface CompanyDao {

	//根据客户id，查询客户公司信息
	public Company findCustInfo(String cust_no);

	//根据客户id,更新客户公司信息
	void updateCompany(Company company);

	//更新客户公司简介信息
	public void updateCompanyContent(Company company);
	
	
	

}
