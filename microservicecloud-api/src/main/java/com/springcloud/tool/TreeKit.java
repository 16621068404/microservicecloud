package com.springcloud.tool;


import java.util.ArrayList;
import java.util.List;

import com.springcloud.entity.Authorize;
import com.springcloud.entity.Dictionary;
import com.springcloud.entity.Mean;
import com.springcloud.entity.TreeGrid;
 
/**
 * ☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆
 * @developers  LONGZHIQIANG
 * @createtime  2018/11/2 10:36.
 * @describe    用于封装树型结构树（无限层级）
 * ☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆☆☆★☆☆☆☆
 */
public class TreeKit {
 
    public static List<TreeGrid> formatTree(List<Dictionary> dictionaryData) {
        List<TreeGrid> menuList = new ArrayList<TreeGrid>();
        for (Dictionary dictionary : dictionaryData) {
            if(dictionary.getParent_id().equals("0")){ //遍历所有一级节点,并找出所有一级节点下的所有子节点
                TreeGrid grid = getTreeGrid(dictionary, dictionaryData);
                menuList.add(grid);
            }
        }
        return menuList;
    }
 
    /**
     * 递归查找子菜单
     * @param authorizeData 
     */
    public static List<TreeGrid> getChild(String id, List<Dictionary> dictionaryData) {
        List<TreeGrid> childList = new ArrayList<>();
        for (Dictionary dictionary : dictionaryData) {
            // 遍历所有节点，将父菜单编码与传过来的编码进行比较、若相同则继续查看该节点下是否还有子节点
            if (!StringUtil.isEmpty(dictionary.getParent_id())) {
                if (dictionary.getParent_id().equals(id)) {
                    TreeGrid grid = getTreeGrid(dictionary, dictionaryData);
                    childList.add(grid);
                }
            }
        }
        return childList;
    }
 
    //构建 TreeGrid（实体对象）
    public static TreeGrid getTreeGrid(Dictionary dictionary, List<Dictionary> dictionaryData){
        TreeGrid x = new TreeGrid();
        x.setId(dictionary.getItem_id());
        x.setText(dictionary.getItem_name());
        x.setValue(dictionary.getItem_code());
        x.setParentnodes(dictionary.getParent_id());
        x.setShowcheck(false);
        x.setCheckstate(0);
        x.setChildNodes(getChild(dictionary.getItem_id(), dictionaryData));  //递增遍历所有子节点（无限层级）
        if (x.getChildNodes().size() == 0) {
        	 x.setHasChildren(false);
        } else {
             x.setHasChildren(true);
        }
        return x;
    }
}
