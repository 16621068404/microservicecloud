package com.atguigu.springcloud.Company.Controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.atguigu.springcloud.Company.Service.CompanyService;
import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.Company;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.UUIDUtils;

@RestController
public class CompanyController extends BaseContrller {

	@Autowired
	private CompanyService companyService;

	@Value("${file.upload.path}")
	private String path = "src/main/resources/static/upload/logo/";
	
	
	/**
	 * 跳转到公司管理信息界面
	 */
	@RequestMapping(value = "/system_manage/company_manage", method = RequestMethod.GET)
	public ModelAndView UserInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/company_info_view.html");
	}

	/**
	 * 
	 * 描述：登录用户所在公司信息 时间：2019年8月19日10:29:21 作者：冯光明
	 * 
	 */
	@RequestMapping(value = "/system_manage/company_manage/GetFormJson", method = RequestMethod.GET)
	public void login(HttpServletRequest request, HttpServletResponse response) {
		// 向浏览器发送一个响应头，设置浏览器的解码方式为UTF-8
		response.setHeader("Content-type", "text/html;charset=UTF-8");
		Object resultJson = new Object();
		// 获取token,token中含有用户的基本信息；
		String token = request.getParameter("token");
		// 创建用户对象
		User user = new User();
		try {
			// 判断token是否失效
			if (token.equals("undefined")) {
				return;
			} else {
				// 读取token
				String tokenInfo = Base64Tool.getFromBase64(token.replaceAll(" ", ""));
				// 将token转化为Users对象
				user = JsonUtils.readJson2Object(tokenInfo, User.class);
			}
			// 查询登录用户所在公司信息
			resultJson = companyService.findLoginCompanyInfo(user);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			writerJsonResult(request, response, resultJson);
		}

	}

	/**
	 * 描述：公司信息界面，关于公司编号的生成，本系统不做处理。 点击保存，公司信息只做更新操作，保存到中心库中 时间：2019年8月19日10:29:21
	 * 作者：冯光明
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/system_manage/company_manage/SaveForm", method = RequestMethod.POST)
	public void saveForm(HttpServletRequest request, HttpServletResponse response) {
		Map resultMap = new HashMap();

		// 获取参数
		String keyValue = request.getParameter("keyValue");
		// ======================================================================================
		// 公司编号
		String cust_no = request.getParameter("cust_no");
		// 公司名称
		String cust_name = request.getParameter("cust_name");
		// 公司性质
		String cust_prop = request.getParameter("cust_prop");
		// 公司的注册地址
		String cust_regadd = request.getParameter("cust_regadd");
		// 公司管理员
		String cust_manager = request.getParameter("cust_manager");
		// 公司网站
		String cust_url = request.getParameter("cust_url");
		// 注册资金
		double cust_cash = stringToDouble(request.getParameter("cust_cash"));
		// 手机
		String cust_mobile = request.getParameter("cust_mobile");
		// 电话
		String cust_tel = request.getParameter("cust_tel");
		// 传真
		String cust_fax = request.getParameter("cust_fax");
		// email
		String cust_email = request.getParameter("cust_email");
		// 微信
		String cust_wechat = request.getParameter("cust_wechat");
		// QQ
		String cust_qq = request.getParameter("cust_qq");

		// 封装参数====================封装参数========================
		Company company = new Company();
		company.setCust_no(cust_no);
		company.setCust_name(cust_name);
		company.setCust_prop(cust_prop);
		company.setCust_regadd(cust_regadd);
		company.setCust_manager(cust_manager);
		company.setCust_url(cust_url);
		company.setCust_cash(cust_cash);
		company.setCust_mobile(cust_mobile);
		company.setCust_tel(cust_tel);
		company.setCust_fax(cust_fax);
		company.setCust_email(cust_email);
		company.setCust_wechat(cust_wechat);
		company.setCust_qq(cust_qq);

		try {
			// 公司信息界面，关于公司编号的生成，本系统不做处理。点击保存，公司信息只做更新操作，保存到中心库中.
			resultMap = companyService.saveCompanyForm(company, keyValue);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("修改成功");
			resultMap.put("type", 3);
			resultMap.put("message", "公司信息修改失败");
		} finally {
			writerJsonResult(request, response, resultMap);// 结果回写
		}

	}

	/**
	 *  描述：公司logo图片的上传
	 *  时间：2019年8月19日10:29:21
	 *  作者：冯光明
	 */
	@SuppressWarnings({ "rawtypes", "unchecked", "deprecation" })
	@RequestMapping(value = "/system_manage/company_manage/UploadFile", method = RequestMethod.POST)
	public void uploadFile(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value = "uploadFile", required = false)  MultipartFile[]  uploadFiles) {
		    Map resultMap=new HashMap();  
		   
		 // 获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			// 创建用户对象
			User user = new User();
		    
		    try {
		    	// 判断token是否失效
				if (token.equals("undefined")) {
					return;
				} else {
					// 读取token
					String tokenInfo = Base64Tool.getFromBase64(token.replaceAll(" ", ""));
					// 将token转化为Users对象
					user = JsonUtils.readJson2Object(tokenInfo, User.class);
				}
		    	for(int i=0;i<uploadFiles.length;i++) {//支持上传多文件，所以使用循环
					    // 获取文件名
					    String fileName  = uploadFiles[i].getOriginalFilename ();//获取文件上传的名称 
					    System.out.println("上传的文件名为:" + fileName);
						// 获取文件的后缀名
				        String suffixName = fileName.substring(fileName.lastIndexOf("."));
				        System.out.println("上传的后缀名为:" + suffixName);
				        //文件上传路径
				        //判断文件夹是否存在，获取文件夹的绝对路径
				        fileName = UUIDUtils.getUUID()+ suffixName;;
				        File dest = new File(new File(path).getAbsolutePath()+ "/" + fileName);
					    if (!dest.getParentFile().exists()) {
				            dest.getParentFile().mkdirs();
				        }
					    FileUtils.copyInputStreamToFile(uploadFiles[i].getInputStream(), dest);
					    System.out.println("上传成功");
					    
					    //文件名称保存到数据库
					    fileName = "/upload/logo/"+ fileName;
					    
					    Company company = new Company();
					    company.setCust_logo(fileName);
					    company.setCust_no(user.getCust_no());
					    companyService.saveUploadFileName(company);
					    
				 } 
				resultMap.put("type", 1);
				resultMap.put("message", "上传成功");
				
			} catch (Exception e) {
				resultMap.put("type", 3);
				resultMap.put("message", "上传失败");
			
			     e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, resultMap);// 结果回写
			}
				
      }

	/**
	 * String转换成double 保留N位小数。
	 * 
	 * @param a
	 * @return
	 */
	public static double stringToDouble(String a) {
		double b = Double.valueOf(a);
		DecimalFormat df = new DecimalFormat("#.000");// 此为保留1位小数，若想保留2位小数，则填写#.00 ，以此类推
		String temp = df.format(b);
		b = Double.valueOf(temp);
		return b;
	}
	
	
	
	
	
	/**
	 *  描述：保存公司简介信息
	 *  时间：2019年8月19日10:29:21
	 *  作者：冯光明
	 */
	@SuppressWarnings({ "rawtypes", "unchecked", "deprecation" })
	@RequestMapping(value = "/system_manage/company_manage/SaveContent", method = RequestMethod.POST)
	public void saveContent(HttpServletRequest request, HttpServletResponse response) {
		    // 向浏览器发送一个响应头，设置浏览器的解码方式为UTF-8
			response.setHeader("Content-type", "text/html;charset=UTF-8");
			
			Object resultJson = new Object();
			// 获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			// 获取公司简介信息
			String cust_content = request.getParameter("cust_content");
			
			// 创建用户对象
			User user = new User();
			try {
					// 判断token是否失效
					if (token.equals("undefined")) {
						return;
					} else {
						// 读取token
						String tokenInfo = Base64Tool.getFromBase64(token.replaceAll(" ", ""));
						// 将token转化为Users对象
						user = JsonUtils.readJson2Object(tokenInfo, User.class);
					}
					// 保存公司简介信息
					resultJson = companyService.saveContent(user,cust_content);
					
			} catch (Exception e) {
			     e.printStackTrace();
			} finally {
				 writerJsonResult(request,response, resultJson);// 结果回写
			}
				
      }
	
	
	
	
	
	
	
	

}
