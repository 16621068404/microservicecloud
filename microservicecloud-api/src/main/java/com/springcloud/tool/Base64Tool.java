package com.springcloud.tool;

import java.util.Base64;

public class Base64Tool {
	 
	  //加密
	  public static String getBase64(String str){
		    byte[] bytes = str.getBytes();
	        //Base64 加密
	        String encoded = Base64.getEncoder().encodeToString(bytes);
	        System.out.println("Base 64 加密后：" + encoded);
	        return encoded;
	  }
	  //解密
	  public static String getFromBase64(String str){
		    byte[] decoded = Base64.getDecoder().decode(str);
	        String decodeStr = new String(decoded);
	        return decodeStr;
	  }
	 
	}