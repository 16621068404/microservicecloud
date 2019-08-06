/*!
 * 版 本 TencheerADMS V6.1.2.0 (http://www.tencheer.cn)
 * Copyright 2011-2016 Tencheer, Inc.
 * 客户端数据
 * tencheer
 */
/*
 *organize----------------------公司
 *department--------------------部门
 *role--------------------------角色
 *user--------------------------用户
 *authorizeMenu-----------------授权菜单
 *authorizeButton---------------授权按钮
 *authorizeColumn---------------授权列表
 *menu--------------------------菜单
 *button------------------------按钮
 *dataItem----------------------数据字典
 *excelImportTemplate-----------excel导入模板
 *excelExportTemplate-----------excel导出模板
*/
var token;


(function ($, tencheer) {
    "use strict";
    //从cookie中读取token
    token = getCookie("token")
    
    var clientData = {};
    tencheer.login_status="normal";
    tencheer.login_user_data=[];
    function get(key, data) {
        try {
            var res = "";
            var len = data.length;

            if (len == undefined) {
                res = data[key];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if(key(data[i]))
                    {
                        res = data[i];
                        break;
                    }
                }
            }
            return res;
        }
        catch (e) {
            console.log(e.message+data);
            return "";
        }
    }
    function excelImportTemplateFormat() {//excel导入模板数据格式化

    }
    tencheer.data = {
        init: function (callback) {
            $.ajax({
                url:  '/mainPage/findMainPageInfo?token='+token+'',
                type: "post",
                dataType: "json",
                async: true,
                success: function (data) {
                    clientData = data;  //后台响应的数据【包括菜单信息，还有用户信息】

                    tencheer.login_user_data=JSON.parse(data["login_user_data"]);
                    callback();
                    window.setTimeout(function () {
                        $('#ajax-loader').fadeOut();
                    }, 50);
                }
            });
        },
        //获取页面grid列表配置
        getGrid:function(grid_id){
            var grid_data=null;
            try {
                $.ajax({
                    url:  "/system_manage/grid_column_manage/GetGridByGridCode?token="+token+"&grid_code="+grid_id,
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        grid_data= data;
                    }
                });
             return grid_data ;//JSON.parse(JSON.parse(clientData["authorizeGrid"])[grid_id]);
            }
            catch (e){
                console.log(e.message);
                 return "";
            }
        },
        getButton:function(menu_id){
            try {
//                console.log("ere434343");
//                var data=eval(clientData["authorizeButton"]);
             //   console.log(menu_id);
             return JSON.parse(JSON.parse(clientData["authorizeButton"])[menu_id]);
            }
            catch (e){
                 return "";
            }
        },
        //获取页面grid列表字段配置
        getColumn:function(grid_id){
            var column_data=null;
             try {
                 $.ajax({
                    url:  "/system_manage/grid_column_manage/GetColumnByGridId?token="+token+"&grid_id="+grid_id,
                    type: "post",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        column_data= data;
                    }
                });
                return column_data;//JSON.parse(JSON.parse(clientData["authorizeColumn"])[grid_id]);
            }
            catch (e){
                console.log(e.message);
                 return "";
            }

        },
        //获取数据字典
        getItem:function(key,item_name,item_value){
            try {
                var data=eval(clientData[key]);
                var result=[];
                $.each(data, function (i) {
                    var row = data[i];
                    if (row[item_name]==item_value)
                    {
                        result=row;
                        return row;
                    }
                });
                return result;
            }
            catch (e){
                console.log(e.message);
                 return "";
            }


        },
        //获取代码对应的显示值
        getName:function(nameArray){
           var data=eval(clientData[nameArray[0]]);
           var name=nameArray[2];
           $.each(data, function (i) {
                var row = data[i];
                if (row[nameArray[1]]==nameArray[2])
                {
                    name= row[nameArray[3]];return false;
                }
            });
            return name;
        },
        get: function (nameArray) {//[key,function (v) { return v.key == value }]
            if(!nameArray)
            {
                return "";
            }
            var len = nameArray.length;
            var res = "";
            var data = clientData;
            for (var i = 0; i < len; i++)
            {
                res = get(nameArray[i], data);
                if (res != "" && res != undefined) {
                    data = res;
                }
                else
                {
                    break;
                }
            }
            if (res == undefined || res == null)
            {
                res = "";
            }
            return res;
        }
    };
})(window.jQuery, window.tencheer);


function getCookie(name) { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]); 
    } else { 
        return null; 
    } 
}


