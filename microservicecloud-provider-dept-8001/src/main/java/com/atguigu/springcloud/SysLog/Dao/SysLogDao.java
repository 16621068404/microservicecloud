package com.atguigu.springcloud.SysLog.Dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysLog;

@Mapper
public interface SysLogDao {

	// 执行查询功能，并返回查询数据记录数【系统日志】
	int queryCount(PageUtil pageUtil);

	// 执行查询功能，并返回查询数据信息【系统日志】
	List<SysLog> querySysLogData(PageUtil pageUtil);

}
