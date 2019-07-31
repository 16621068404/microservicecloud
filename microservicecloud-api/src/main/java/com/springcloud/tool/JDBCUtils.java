package com.springcloud.tool;

import com.springcloud.entity.User;

public class JDBCUtils {
	
	//封装连接数据库信息
	public static JDBCbean encapsulationJDBC(User user) {
		
		//获取数据库连接信息;
		JDBCbean jdbcBean = new JDBCbean();
		jdbcBean.setDriver("org.postgresql.Driver");
		jdbcBean.setUrl("jdbc:postgresql://123.206.211.89:5432/"+user.getDb_name()+"?characterEncoding\\=utf-8");
		jdbcBean.setUser(user.getDb_user());
		jdbcBean.setPassword(user.getDb_password());
		return jdbcBean;
			
//		jdbcBean.setUrl("jdbc:postgresql://123.206.211.89:5432/daocha_w000001?characterEncoding\\=utf-8");
//		jdbcBean.setUser("postgres");
//		jdbcBean.setPassword("ycgyl@2016");
//		return jdbcBean;
		
		
	}
	

}
