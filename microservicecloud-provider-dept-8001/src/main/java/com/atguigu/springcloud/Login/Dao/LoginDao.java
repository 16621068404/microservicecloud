package com.atguigu.springcloud.Login.Dao;

import org.apache.ibatis.annotations.Mapper;

import com.springcloud.entity.User;

@Mapper
public interface LoginDao {

	public User findLoginUserDao(User users);
    
	

}
