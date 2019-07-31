package com.atguigu.springcloud.MainPage.Dao;

import org.apache.ibatis.annotations.Mapper;

import com.springcloud.entity.User;

@Mapper
public interface MainPageDao {

	User findUserInfoForCentral(String userNo);

}
