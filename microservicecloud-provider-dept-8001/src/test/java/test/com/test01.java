package test.com;

import java.io.File;
import java.io.IOException;

public class test01 {
	public static void main(String[] args) {
		
		 //当前项目下路径
	    File file = new File("");
	    String filePath;
		try {
			filePath = file.getCanonicalPath();
			System.out.println(filePath);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	   
	}
	

}
