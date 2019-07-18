package com.atguigu.springcloud.SysBug.ServiceImp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.SysBug.Dao.SysBugDao;
import com.atguigu.springcloud.SysBug.Service.SysBugService;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysBug;

@Service
public class SysBugServiceImp implements SysBugService{

	@Autowired
	private SysBugDao sysBugDao;
	
	

	public Map<String, Object> findSysBugList(PageUtil page) {
		    
		    List<SysBug> sysBug = sysBugDao.findSysBugList(page);
	        int countNumber = sysBugDao.countSysBugList();
	        Map<String, Object> mapJson = new HashMap<String, Object>();
	        mapJson.put("iTotalDisplayRecords", countNumber);
	        mapJson.put("iTotalRecords", countNumber);
	        mapJson.put("data", sysBug);
	        return mapJson;
		
	}

}
