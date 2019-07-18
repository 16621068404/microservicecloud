package com.atguigu.springcloud.cfgbeans;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RoundRobinRule;
/**
 * 
 * boot -->spring的配置文件applicationContext.xml  ==
 * (等同于) @Configuration配置 ConfigBean = applicationContext.xml
 * @author Dell
 *
 */
@Configuration  
public class ConfigBean { 

	
	/**
	 * Spring Cloud Ribbon是基于Netflix Ribbon实现的一套客户端 负载均衡的工具。
	 * @return
	 */
    @LoadBalanced   //开启负载均衡  默认的轮询
	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	@Bean
	public IRule myRule() {
		return new RoundRobinRule();  //定义轮询,默认的轮询
	//return new RandomRule();   //定义随机算法替代默认的轮询
		/* 在集群都健康的情况下，默认是轮询算法，
		        但当其中有服务挂点时，多次访问该挂点服务失败后，
		        就不在访问该挂掉服务，剩余服务正常轮询。 */
	// return new RetryRule();	  
	}
}

// @Bean
// public UserServcie getUserServcie() {
//    return new UserServcieImpl();
// }
// applicationContext.xml == ConfigBean(@Configuration)
// <bean id="userServcie" class="com.atguigu.tmall.UserServiceImpl">



