package com.springcloud.tool;


import java.util.ArrayList;
import java.util.List;

import com.springcloud.entity.Authorize;
import com.springcloud.entity.Mean;
import com.springcloud.entity.TreeGrid;
 
/**
 * ☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆
 * @developers  LONGZHIQIANG
 * @createtime  2018/11/2 10:36.
 * @describe    用于封装树型结构树（无限层级）
 * ☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆
 */
public class XTreeKit {
 
    public static List<TreeGrid> formatTree(List<Mean> meanData, List<Authorize> authorizeData) {
        List<TreeGrid> menuList = new ArrayList<TreeGrid>();
        for (Mean mean : meanData) {
            if(mean.getMenu_id().equals("0")){ //遍历所有一级节点,并找出所有一级节点下的所有子节点
                TreeGrid grid = getTreeGrid(mean, meanData,authorizeData);
                menuList.add(grid);
            }
        }
        return menuList;
    }
 
    /**
     * 递归查找子菜单
     * @param authorizeData 
     */
    public static List<TreeGrid> getChild(String id, List<Mean> meanData, List<Authorize> authorizeData) {
        List<TreeGrid> childList = new ArrayList<>();
        for (Mean root : meanData) {
            // 遍历所有节点，将父菜单编码与传过来的编码进行比较、若相同则继续查看该节点下是否还有子节点
            if (!StringUtil.isEmpty(root.getParent_id())) {
                if (root.getParent_id().equals(id)) {
                    TreeGrid grid = getTreeGrid(root, meanData,authorizeData);
                    childList.add(grid);
                }
            }
        }
        return childList;
    }
 
    //构建 TreeGrid（实体对象）
    public static TreeGrid getTreeGrid(Mean mean, List<Mean> meanData, List<Authorize> authorizeData){
        TreeGrid x = new TreeGrid();
        x.setId(mean.getMenu_id());
        x.setText(mean.getMenu_name());
        x.setValue(mean.getMenu_code());
        x.setImg(mean.getMenu_icon());
        x.setParentnodes(mean.getParent_id());
        x.setShowcheck(true);
        
       for (Authorize authorize : authorizeData) {
    	   if (authorize.getItem_id().equals(mean.getMenu_id())) {
    		   x.setCheckstate(1);
    		   break;  //跳出循环
    	   } else {
    		   x.setCheckstate(0);
    	   }
	   }
      
        x.setIsexpand(true);
        x.setChildNodes(getChild(mean.getMenu_id(),meanData,authorizeData));  //递增遍历所有子节点（无限层级）
        if (x.getChildNodes().size() == 0) {
        	 x.setHasChildren(false);
        } else {
             x.setHasChildren(true);
        }
        return x;
    }
}
