package com.atguigu.springcloud.Role.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.springcloud.entity.Authorize;
import com.springcloud.entity.PageUtil;
import com.springcloud.entity.Role;
import com.springcloud.entity.User;
@SuppressWarnings("rawtypes")
public interface RoleInfoService {

	PageUtil getPageListJson(User user, PageUtil pageUtil);
	
	//保存角色信息
	Map saveRoleForm(User user, Role role);

	//查询角色信息
	Object findRoleForm(User user, String keyValue);

	//查询所有的菜单信息
	Object moduleTreeJson(User user, Authorize authorize) throws IOException;

	//保存角色授权信息
	Map saveAuthorize(User user, Authorize authorize);
    
	//查询所有的成员(用户成员)
	List getRoleMember(User user, String roleId);

	//给角色添加成员，保存成员-角色信息；,保存用户有关角色的信息  (每一个成员，只能有一个角色)
	Object saveMember(User user, String role_no, String user_ids);

}
