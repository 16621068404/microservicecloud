package com.atguigu.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

import com.atguigu.myrule.MySelfRule;

/**
 * 部门服务的消费者启动类
 * 
 * @author Dell
 *
 */
@SpringBootApplication
@EnableEurekaClient
//在启动该微服务的时候就能去加载我们的自定义Ribbon配置类，从而使配置生效，
//开启自定义负载均衡算法，要注意，自定义负载均衡算法类，不能在主启动类所在包和子包下面。
@RibbonClient(name="MICROSERVICECLOUD-DEPT",configuration=MySelfRule.class)	//开启自定义的负载均衡算法，对指定服务有效
public class DeptConsumer80_App {
	public static void main(String[] args) {
		SpringApplication.run(DeptConsumer80_App.class, args);
	}
}
