package com.springcloud.tool;


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



/**
 * @author 冯光明
 * @description  JDBC工具类;<br>博客地址：https://www.cnblogs.com/mujingyu/p/7878687.html<br>
 * @time 2018年12月10日 下午3:58:23
 */
public class JDBC_ZSGC {
	  /**
       *  
       *  驱动注册
       *  
       */
    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }
    
    /**
     * 获取 Connetion
     * @param jdbcBean 
     * @return
     * @throws SQLException
     */
    public static Connection getConnection(JDBCbean jdbcBean) throws SQLException{
        return DriverManager.getConnection(jdbcBean.getUrl(), jdbcBean.getUser(), jdbcBean.getPassword());
    }
    
    /**
     * 释放资源
     * @param conn
     * @param st
     * @param rs
     */
    public static void colseResource(Connection conn,Statement st,ResultSet rs) {
        closeResultSet(rs);
        closeStatement(st);
        closeConnection(conn);
    }
    
    /**
     * 释放连接 Connection
     * @param conn
     */
    public static void closeConnection(Connection conn) {
        if(conn !=null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        //等待垃圾回收
        conn = null;
    }
    
    /**
     * 释放语句执行者 Statement
     * @param st
     */
    public static void closeStatement(Statement st) {
        if(st !=null) {
            try {
                st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        //等待垃圾回收
        st = null;
    }
    
    /**
     * 释放结果集 ResultSet
     * @param rs
     */
    public static void closeResultSet(ResultSet rs) {
        if(rs !=null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        //等待垃圾回收
        rs = null;
    }
    
    /**
     * 添加
     * @author 冯光明
     * @description  
     * @time 2018年12月10日 下午3:18:18
     */
    public static Integer add(String sql,JDBCbean jdbcBean) {
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
            conn = JDBC_ZSGC.getConnection(jdbcBean);
            
            // 创建语句执行者
            st= conn.prepareStatement(sql);
            
            // 执行sql
            int i = st.executeUpdate();
            /*if(i > 0){
            	System.out.println("添加成功");
            }else{
            	System.out.println("添加失败");
            }*/
            return i;
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return 0;
    }
    
    

    /**
     * 修改
     * @author 冯光明
     * @description  
     * @time 2018年12月10日 下午3:18:18
     */
    public static Integer update(String sql,JDBCbean jdbcBean) {
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
            conn = JDBC_ZSGC.getConnection(jdbcBean);
            // 创建语句执行者
            st= conn.prepareStatement(sql);
            // 执行sql
            int i = st.executeUpdate();
           
            return i;
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return 0;
    }
    
    
    
    
    
    
    
    public static int[] addBatch(String sql,JDBCbean jdbcBean){
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
            conn = JDBC_ZSGC.getConnection(jdbcBean);
            
            // 创建语句执行者
            st = conn.prepareStatement(sql);
            
            // 把SQL语句加入到批命令中
            st.addBatch();
            
            // 执行sql
            
            return st.executeBatch();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return null;
    }
    
    /**
     * 查询多个
     * @author 冯光明
     * @param jdbcBean 
     * @description  
     * @time 2018年12月10日 下午5:03:11
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public static List<?> query(JDBCbean jdbcBean, String sql, Class<?> classType){
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
        	conn = JDBC_ZSGC.getConnection(jdbcBean);
            
            // 创建语句执行者
            st = conn.prepareStatement(sql);
            
            // 执行sql
            rs = st.executeQuery();
            List list = new ArrayList();

            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            while (rs.next()) {
                Map<String, Object> rowData = new HashMap<String, Object>();
                for (int i = 1; i <= columnCount; i++) {
                    rowData.put(md.getColumnName(i), rs.getObject(i));
                }
            	String json = JsonUtils.mapWithDate2Json(rowData, DateUtils.DATE_TIME_FORMAT);
                list.add(JsonUtils.readJson2ObjectFormat(json, classType, DateUtils.DATE_TIME_FORMAT));
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return null;
    }
    
    
    
    
    
    /**
     * 查询一个
     * @author 冯光明
     * @param jdbcBean 
     * @description  
     * @time 2018年12月10日 下午5:03:11
     */
	public static Object queryObject(JDBCbean jdbcBean, String sql, Class<?> classType){
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
        	conn = JDBC_ZSGC.getConnection(jdbcBean);
            
            // 创建语句执行者
            st = conn.prepareStatement(sql);
            
            // 执行sql
            rs = st.executeQuery();
            Object object = new Object();
            

            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            while (rs.next()) {
                Map<String, Object> rowData = new HashMap<String, Object>();
                for (int i = 1; i <= columnCount; i++) {
                    rowData.put(md.getColumnName(i), rs.getObject(i));
                }
            	String json = JsonUtils.mapWithDate2Json(rowData, DateUtils.DATE_TIME_FORMAT);
            	object = JsonUtils.readJson2ObjectFormat(json, classType, DateUtils.DATE_TIME_FORMAT);
            }
            return object;
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return null;
    }
	
	
	

    /**
     * 查询count(*)
     * @author 冯光明
     * @param jdbcBean 
     * @description  
     * @time 2018年12月10日 下午5:03:11
     */
	public static int queryCount(JDBCbean jdbcBean, String sql){
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        int count = 0;
        try {
            // 获取连接
        	conn = JDBC_ZSGC.getConnection(jdbcBean);
            // 创建语句执行者
            st = conn.prepareStatement(sql);
            // 执行sql
            rs = st.executeQuery();
            while (rs.next()) {
            	count = rs.getInt("count");
            }
            return count;
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return count;
		
    }
    
    
    /**
     * 删除
     * @author 冯光明
     * @description  
     * @time 2018年12月10日 下午5:25:42
     */
    public static Integer del(String sql,JDBCbean jdbcBean){
    	Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        try {
            // 获取连接
            conn = JDBC_ZSGC.getConnection(jdbcBean);
            
            // 创建语句执行者
            st = conn.prepareStatement(sql);
            
            // 执行sql
            int i = st.executeUpdate();
            return i;
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            JDBC_ZSGC.colseResource(conn, st, rs);
        }
		return 0;
    }
    
//    @SuppressWarnings("unchecked")
//	public static void main(String[] args) {
//    	// 添加
//    	String sql1 = "insert into zbom values (100001,'小明')";
//    	int add = add(sql1);
//    	System.out.println("添加了" + add + "条数据");
//    	
//    	// 批量添加
//    	String sql2 = "insert into zbom values (100002,'小明'),(100003,'小明')";
//    	int[] addBatch = addBatch(sql2);
//    	System.out.println("批量添加了"+addBatch[0]+"条");
//    	
//    	// 查询
//    	String querySql = "select * from zbom";
//    	List<BomConditions> list = (List<BomConditions>) query(querySql, BomConditions.class);
//    	System.out.println("查询到" + list.size() + "条数据");
//    	
//    	// 删除
//    	String delSql = "delete from zbom where bomid = '100001'";
//    	int del = del(delSql);
//    	System.out.println("删除了" + del + "条数据");
//	}
}