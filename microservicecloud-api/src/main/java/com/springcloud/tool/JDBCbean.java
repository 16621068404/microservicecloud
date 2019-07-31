package com.springcloud.tool;


import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Data;



/**
 * @author 冯光明
 * @description  JDBC工具类;<br>博客地址：https://www.cnblogs.com/mujingyu/p/7878687.html<br>
 * @time 2018年12月10日 下午3:58:23
 */
@Data
public final class JDBCbean implements Serializable{
	
    
	private static final long serialVersionUID = 1L;
	
	private String driver;
    private String url;
    private String user;
    private String password;
    
	@Override
	public String toString() {
		return "JDBCUtils [driver=" + driver + ", url=" + url + ", user=" + user + ", password=" + password + "]";
	}

	public JDBCbean(String driver, String url, String user, String password) {
		super();
		this.driver = driver;
		this.url = url;
		this.user = user;
		this.password = password;
	}

	public JDBCbean() {
		super();
	}
    
   
    
}