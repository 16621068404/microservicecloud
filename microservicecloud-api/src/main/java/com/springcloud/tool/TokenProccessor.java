package com.springcloud.tool;
import java.io.IOException;
/**  
 * 生成Token的工具类：  
 */  
import java.security.MessageDigest;  
import java.security.NoSuchAlgorithmException;  
import java.util.Random;

import com.springcloud.entity.User;

import sun.misc.BASE64Encoder;  
  
/**  
 * 生成Token的工具类  
 *  
 */  
@SuppressWarnings("restriction")
public class TokenProccessor {  
      
    private TokenProccessor(){
    	 
    };  
     
    private static final TokenProccessor instance = new TokenProccessor();  
       
    public static TokenProccessor getInstance() {  
        return instance;  
    } 

    
    /**  
     * 生成Token  
     * token中包含用户的基本信息
     * @param user 
     * @return  
     */  
    public String makeToken(User user) {  
         
    	try {
    		String users = JsonUtils.obj2Json(user).toString();
    		System.out.println(users);
    		//将用户信息转成json字符串
			return  Base64Tool.getBase64(users);  
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
    	 
    } 
    
    
    
    
}  