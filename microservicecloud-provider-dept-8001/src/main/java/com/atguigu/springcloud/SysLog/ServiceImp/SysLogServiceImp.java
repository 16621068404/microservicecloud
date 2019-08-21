package com.atguigu.springcloud.SysLog.ServiceImp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atguigu.springcloud.SysLog.Dao.SysLogDao;
import com.atguigu.springcloud.SysLog.Service.SysLogService;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysLog;
import com.springcloud.entity.User;


@Service
public class SysLogServiceImp implements SysLogService{

     @Autowired
     private SysLogDao sysLogDao;
	
	 /**
       * 获取系统日志页面信息
       * 网格数据
	   * 
	   */
	public PageUtil getPageListJson(User user, PageUtil pageUtil) {
		// 执行查询功能，并返回查询数据记录数【系统日志】
		int records = sysLogDao.queryCount(pageUtil);
		// 执行查询功能，并返回查询数据信息【系统日志】
		List<SysLog> sysLogRow = sysLogDao.querySysLogData(pageUtil);
		// 封装返回到前端的数据
		pageUtil.setRows(sysLogRow);
		pageUtil.setRecords(records);
		int total = (int) Math.ceil((double) records / (double) pageUtil.getPageSize());
		pageUtil.setTotal(total);

		return pageUtil;
	}

}
