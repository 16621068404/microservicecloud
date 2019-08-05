/*!
 * 版 本 TencheerADMS V6.1.2.0 (http://www.tencheer.com.cn)
 * Copyright 2011-2016 Tencheer, Inc.
 * 公共JS基础扩展库,处理自定表单,扩展属性,Excel导入导出配置
 * 腾之毅
 */
(function ($, tencheer) {
    "use strict";

    function excelImportAddButton(btnObj) {
        tencheer.addToolbarButton({
            "id": btnObj.F_EnCode,
            "toolbar": ".toolbar",
            "icon": "fa fa-sign-in",
            "name": btnObj.F_FullName,
            "event": function () {
                tencheer.dialogOpen({
                    id: "ExcelImportForm",
                    title: '快速导入',
                    url: '/Utility/ExcelImportForm?btnId=' + btnObj.F_EnCode,
                    width: "1100px",
                    height: "700px",
                    btn: null,
                    callBack: function (iframeId) {
                        console.log("cbb");
                    }
                });
            }
        });
    };

    function excelExportAddButton(btnObj, template) {
        tencheer.addToolbarButton({
            "id": btnObj.F_EnCode,
            "toolbar": ".toolbar",
            "icon": "fa fa-sign-out",
            "name": btnObj.F_FullName,
            "event": function () {
                dialogOpen({
                    id: "ExcelIExportDialog",
                    title: template.F_Name,
                    url: '/Utility/ExcelExportForm?gridId=' + template.F_GridId + '&filename=' + template.F_Name,
                    width: "500px",
                    height: "380px",
                    callBack: function (iframeId) {
                        top.frames[iframeId].AcceptClick();
                    }, btn: ['导出Excel', '关闭']
                });
            }
        });
    };

    $.extend(tencheer, {
        addToolbarButton: function (opt) {
            /*id 按钮Id,toolbar 工具条,name 按钮名称,icon 按钮图标,event 按钮事件*/
            if ($('#' + opt.id).length == 0) {
                var btngroup = $('#tencheer-excel-btn-list');
                if (btngroup.length == 0) {
                    $(opt.toolbar).append('<div class="btn-group" id="tencheer-excel-btn-list"><a id="' + opt.id + '" class="btn btn-default" ><i class="' + opt.icon + '"></i>&nbsp;' + opt.name + '</a></div>');

                }
                else {
                    btngroup.append('<a id="' + opt.id + '" class="btn btn-default" ><i class="' + opt.icon + '"></i>&nbsp;' + opt.name + '</a>');
                }
            }
            $('#' + opt.id).unbind();
            $('#' + opt.id).on('click', opt.event);
        },
        excel: {
            init: function () {
                var moduleId = top.$.cookie('currentmoduleId');
                var moduleObj = top.tencheer.data.get(["menu", moduleId]);
                if (moduleObj != "" && window.location.href.indexOf(moduleObj.F_UrlAddress) != -1)
                {
                    //初始化excel导入功能
                    var template = top.tencheer.data.get(["excelImportTemplate", moduleId]);
                    if (!!template)
                    {
                        if (!!template.entitys) {
                            $.each(template.entitys, function (i, item) {
                                excelImportAddButton(item.btn);
                            });
                        }
                        else {
                            template["entitys"] = {};
                            $.each(template.keys, function (i, item) {
                                tencheer.getDataForm({
                                    url: "../../SystemManage/ExcelImportTemplate/GetFormJson",
                                    param: { keyValue: item },
                                    async: true,
                                    type: "get",
                                    success: function (data) {
                                        var btnObj = top.tencheer.data.get(["authorizeButton", moduleId, function (v) { return v.F_ModuleButtonId == data.templateInfo.F_ModuleBtnId }]);
                                        if (!!btnObj) {
                                            excelImportAddButton(btnObj);
                                            if (!template.entitys[btnObj.F_EnCode]) {
                                                template.entitys[btnObj.F_EnCode] = {
                                                    btn:btnObj,
                                                    data:[]
                                                };
                                            }
                                            template.entitys[btnObj.F_EnCode].data.push(data);
                                        }
                                    }
                                });
                            });
                        }
                    }
                    //初始化excel导出功能
                    var exportTemplate = top.tencheer.data.get(["excelExportTemplate", moduleId]);
                    if (!!exportTemplate) {
                        console.log(exportTemplate);
                        $.each(exportTemplate, function (i, item) {
                            var btnObj = top.tencheer.data.get(["authorizeButton", moduleId, function (v) { return v.F_ModuleButtonId == item.F_ModuleBtnId }]);
                            excelExportAddButton(btnObj, item);
                        });
                    }
                }
            }
        }
    });
})(window.jQuery, window.tencheer);