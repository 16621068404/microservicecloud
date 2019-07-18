package com.atguigu.springcloud.SysBug.Service;

import java.util.Map;

import com.springcloud.entity.PageUtil;

public interface SysBugService {

	Map<String, Object> findSysBugList(PageUtil page);

}
