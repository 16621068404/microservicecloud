package com.atguigu.springcloud.Company.ServiceImp;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.Company.Dao.CompanyDao;
import com.atguigu.springcloud.Company.Service.CompanyService;
import com.springcloud.entity.Company;
import com.springcloud.entity.User;
@SuppressWarnings({ "rawtypes", "unchecked" })
@Service
public class CompanyServiceImp implements CompanyService{

	
	@Autowired
	private CompanyDao companyDao;
	
	/**
	 * 描述：登录用户所在公司信息
	 * 时间：2019年8月19日10:29:21
	 * 作者：冯光明
	 */
	public Object findLoginCompanyInfo(User user) {
		//获取当前登录用户所在的客户id(cust_no)
		String cust_no = user.getCust_no();
		//根据客户id，查询客户公司信息
		Company companyInfo = companyDao.findCustInfo(cust_no);
		companyInfo.setCust_cash(stringToDouble(companyInfo.getCust_cash()+""));
		return companyInfo;
	}

	
	/**
	 *  描述：公司信息界面，关于公司编号的生成，本系统不做处理。点击保存，公司信息只做更新操作，保存到中心库中.
	 *  时间：2019年8月19日10:29:21
	 *  作者：冯光明
	 */
	public Map saveCompanyForm(Company company, String keyValue) {
		Map resultMap = new HashMap();
		//更新客户公司信息
		companyDao.updateCompany(company);
		System.out.println("修改成功");
		resultMap.put("type", 1);
		resultMap.put("message", "公司信息修改成功");
		return resultMap;
	}
	/**
     * String转换成double 保留N位小数。
     * @param a
     * @return
     */
    public static double stringToDouble(String a){
    	double b = Double.valueOf(a);
    	DecimalFormat df = new DecimalFormat("#.000");//此为保留1位小数，若想保留2位小数，则填写#.00  ，以此类推
    	String temp = df.format(b);
    	b = Double.parseDouble(temp);
    	return b;
    }


    /**
	 *  描述：保存公司简介信息
	 *  时间： 2019年8月20日14:35:24
	 *  作者：冯光明
	 */
	public Object saveContent(User user, String cust_content) {
		Map resultMap = new HashMap();
		//更新客户公司简介信息
		if(cust_content != null && !cust_content.equals("")) {

		} else {
			cust_content = "请输入公司简介";
		}
		Company company = new Company();
		company.setCust_content(cust_content);
		company.setCust_no(user.getCust_no());
		companyDao.updateCompanyContent(company);
		System.out.println("修改成功");
		resultMap.put("type", 1);
		resultMap.put("message", "公司简介修改成功");
		return resultMap;
	}


	//文件名称保存到数据库
	public void saveUploadFileName(Company company) {
		companyDao.updateCompanyContent(company);
	}

	

}
