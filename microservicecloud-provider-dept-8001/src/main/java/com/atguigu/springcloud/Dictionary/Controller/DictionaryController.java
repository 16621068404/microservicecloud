package com.atguigu.springcloud.Dictionary.Controller;

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

import com.atguigu.springcloud.Dictionary.Service.DictionaryService;
import com.atguigu.springcloud.Login.Controller.BaseContrller;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.springcloud.entity.Dictionary;
import com.springcloud.entity.DictionaryDetail;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
import com.springcloud.tool.Base64Tool;
import com.springcloud.tool.JsonUtils;
import com.springcloud.tool.RequestParamUtil;
import com.springcloud.tool.UUIDUtils;

@RestController
public class DictionaryController extends BaseContrller{

	@Autowired
	private DictionaryService dictionaryService;
	
	/**
	 * 跳转到通用字典界面
	 */
	@RequestMapping(value = "/system_manage/dataitem_manage", method = RequestMethod.GET)
	public ModelAndView meanInfo(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/dataitem_detail_list_view.html");
	}
	
	
	
	
	
	/**
	 * 跳转到通用字典管理界面
	 */
	@RequestMapping(value = "/system_manage/dataitem_manage/DataItemList", method = RequestMethod.GET)
	public ModelAndView dataItemList(HttpServletRequest request, HttpServletResponse response) {
		return new ModelAndView("redirect:/views/system_manage/dataitem_list_view.html");
	}
	
	
	/**
	 * 跳转到新增通用字典管理界面---------------------给字典添加分类
	 */
	@RequestMapping(value = "/system_manage/dataitem_manage/DataItemForm", method = RequestMethod.GET)
	public ModelAndView dataItemForm(HttpServletRequest request, HttpServletResponse response) {
		String parentId = request.getParameter("parentId");
		//字典明细id
		String keyValue = request.getParameter("keyValue");
		if (keyValue == null || keyValue.equals("")) {
			//新增
			return new ModelAndView("redirect:/views/system_manage/dataitem_form_view.html?parentId="+parentId);
		}
	        //修改
		return new ModelAndView("redirect:/views/system_manage/dataitem_form_view.html?keyValue="+keyValue);
	}
	
	
	/**
	 * 查询所有的字典分类信息
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemTreeJson", method = RequestMethod.GET)
	public void getDataItemTreeJson(HttpServletRequest request, HttpServletResponse response) {
		
		    Object resultJson = new Object();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			
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
				 //查询所有的字典分类信息
				 resultJson = dictionaryService.getDataItemTreeJson(user);
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
	
	
	/**
     * 获取通用字典明细页面信息
     * 网格数据
     * 
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemDetailTreeList", method = RequestMethod.GET)
	  public void getDataItemDetailTreeList(HttpServletRequest request, HttpServletResponse response) {
		    Map resutJson = new HashMap();    
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//字典分类id
			String itemId = request.getParameter("itemId");
			//搜索内容
			String keyword = request.getParameter("keyword");
			//搜索字段条件
			String condition = request.getParameter("condition");
			
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
				 //获取通用字典页面数据表格
				 resutJson = dictionaryService.getPageListJson(user,itemId,keyword,condition);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response,resutJson);// 结果回写
			}
				
    }
	
	
	/**
	 * 跳转到添加字典界面
	 */
	@RequestMapping(value = "/system_manage/dataitem_manage/DataItemDetailForm", method = RequestMethod.GET)
	public ModelAndView dataItemDetailForm(HttpServletRequest request, HttpServletResponse response) {
		//字典分类id
		String itemId = request.getParameter("itemId");
		//父id
		String parentId = request.getParameter("parentId");
		//字典明细id
		String keyValue = request.getParameter("keyValue");
		if(keyValue == null || keyValue.equals("")) {
			return new ModelAndView("redirect:/views/system_manage/dataitem_detail_form_view.html?itemId="+itemId+"&parentId="+parentId);
		}
		return new ModelAndView("redirect:/views/system_manage/dataitem_detail_form_view.html?itemId="+itemId+"&parentId="+parentId+"&keyValue="+keyValue);
		
		
	}
	
	
	/**
	 *  新增保存和修改保存共用一个方法
	 *   保存字典明细信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/SaveDataItemDetailForm", method = RequestMethod.POST)
	public void saveDataItemDetailForm(HttpServletRequest request, HttpServletResponse response) {
		
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取参数
			String keyValue = request.getParameter("keyValue");
			//父级id
			String parentId = request.getParameter("ParentId");
			//项目id
			String item_id = request.getParameter("ItemId");
			//项目名称
			String item_name = request.getParameter("ItemName");
			//项目值
			String item_value = request.getParameter("ItemValue");
			//排序
			int sort_code = RequestParamUtil.getIntParameter(request, "SortCode", 1);
			//有效标记
			int enabled_mark = RequestParamUtil.getIntParameter(request, "EnabledMark", 1);
			//备注
			String remark = request.getParameter("Description");
			//封装参数
			DictionaryDetail dictionaryDetail = new DictionaryDetail();
			dictionaryDetail.setParent_id(parentId);
			dictionaryDetail.setItem_id(item_id);
			dictionaryDetail.setItem_name(item_name);
			dictionaryDetail.setItem_value(item_value);
			dictionaryDetail.setSort_code(sort_code);
			dictionaryDetail.setEnabled_mark(enabled_mark);
			dictionaryDetail.setRemark(remark);
			
			
			
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
				//保存字典明细信息
				resultMap = dictionaryService.saveDictionaryDetailForm(user,dictionaryDetail,keyValue);
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
	 *  编辑字典明细，数据回显   
	 * 根据字典明细id，查询字典明细信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemDetailFormJson", method = RequestMethod.GET)
	public void findDataItemDetailForm(HttpServletRequest request, HttpServletResponse response) {
		
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
				 //查询字典明细信息
				 resultJson = dictionaryService.findDictionaryDetailForm(user,keyValue);
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
	
	/**
	 *  
	 * 根据字典明细id，删除字典明细信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/RemoveDetailForm", method = RequestMethod.POST)
	public void removeDetailForm(HttpServletRequest request, HttpServletResponse response) {
		
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
				 //删除字典明细信息
				 resultJson = dictionaryService.removeDetailForm(user,keyValue);
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
	
	
	
	/**
     * 获取通用字典分类页面信息
     * 网格数据
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemTreeList", method = RequestMethod.GET)
	  public void getDataItemTreeList(HttpServletRequest request, HttpServletResponse response) {
		    Map resutJson = new HashMap();    
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
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
				 //获取通用字典分类页面数据表格
				 resutJson = dictionaryService.getDictionaryTreeList(user);
			} catch (JsonParseException e) {
				e.printStackTrace();
			} catch (JsonMappingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				 writerJsonResult(request,response,resutJson);// 结果回写
			}
				
    }
	
	
	
	/**
	 *  新增保存和修改保存共用一个方法
	 *   保存字典分类信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/SaveDataItemForm", method = RequestMethod.POST)
	public void saveDataItemForm(HttpServletRequest request, HttpServletResponse response) {
		
		    Map resultMap = new HashMap();
			//获取token,token中含有用户的基本信息；
			String token = request.getParameter("token");
			//获取参数
			String keyValue = request.getParameter("keyValue");
			//父级id
			String parentId = request.getParameter("ParentId");
			if(parentId != null && !parentId.equals("") && parentId.equals("&nbsp;")) {
				parentId = "0";
			}
			
			//项目名称
			String item_name = request.getParameter("ItemName");
			//分类编码
			String item_Code = request.getParameter("ItemCode");
			//排序
			int sort_code = RequestParamUtil.getIntParameter(request, "SortCode", 1);
			//是否是树
			int isTree = RequestParamUtil.getIntParameter(request, "IsTree", 0);
			//有效标记
			int enabled_mark = RequestParamUtil.getIntParameter(request, "EnabledMark", 1);
			//备注
			String remark = request.getParameter("Description");
			//封装参数
			Dictionary dictionary = new Dictionary();
			dictionary.setParent_id(parentId);
			dictionary.setItem_id(UUIDUtils.getUUID());
			dictionary.setItem_name(item_name);
			dictionary.setItem_code(item_Code);
			dictionary.setSort_code(sort_code);
			dictionary.setIs_tree(isTree);
			dictionary.setEnabled_mark(enabled_mark);
			dictionary.setRemark(remark);
			
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
				//保存字典分类信息
				resultMap = dictionaryService.saveDictionaryForm(user,dictionary,keyValue);
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
	 *  编辑字典分类，数据回显   
	 * 根据字典分类id，查询字典分类信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/GetDataItemFormJson", method = RequestMethod.GET)
	public void getDataItemFormJson(HttpServletRequest request, HttpServletResponse response) {
		
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
				 //查询字典分类信息
				 resultJson = dictionaryService.getDataItemFormJson(user,keyValue);
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
	
	
	
	/**
	 *  
	 * 根据字典分类id，删除字典分类信息
	 * 
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/system_manage/dataitem_manage/RemoveDataItemForm", method = RequestMethod.POST)
	public void removeDataItemForm(HttpServletRequest request, HttpServletResponse response) {
		
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
				 //删除字典分类信息
				 resultJson = dictionaryService.removeDictionaryForm(user,keyValue);
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
