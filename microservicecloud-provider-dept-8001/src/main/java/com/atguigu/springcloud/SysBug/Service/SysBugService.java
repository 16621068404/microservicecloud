package com.atguigu.springcloud.SysBug.Service;

import java.util.Map;

import com.springcloud.entity.PageUtil;
import com.springcloud.entity.SysBug;

public interface SysBugService {

	Map<String, Object> findSysBugList(SysBug sysBug);

}
