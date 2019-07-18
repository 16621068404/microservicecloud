package com.atguigu.springcloud.SysBug.Dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysBug;

@Mapper
public interface SysBugDao {

	public List<SysBug> findSysBugList(PageUtil page);

	public int countSysBugList();

}
