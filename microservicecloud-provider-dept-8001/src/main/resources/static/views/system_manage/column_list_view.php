<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <script src="/statics/scripts/bootstrap/bootstrap-suggest.js"></script>
    <!--bootstrap组件end-->
    <script src="/statics/scripts/plugins/layout/jquery.layout.js"></script>
    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>

    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>
    <script src="/statics/scripts/plugins/tree/tree.js"></script>
    <script src="/statics/scripts/plugins/validator/validator.js"></script>
    <script src="/statics/scripts/plugins/wizard/wizard.js"></script>
    <script src="/statics/scripts/plugins/datetime/pikaday.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
    <script src="/statics/scripts/tencheer/bind_dropdown.js"></script>


    <style>
        body {
            margin: 10px;
            margin-bottom: 0px;
            /*overflow: hidden;*/
        }
    </style>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
    
<script>
    var grid_id = tencheer.request('grid_id');
    var table_name = tencheer.request('table_name');
    
    var menu_id=tencheer.request('menu_id');
    $(function () {
        InitialPage();
        GetGrid();
        $(window).resize();
    });
    //初始化页面
    function InitialPage() {
        $("#lr-add").css("display","");
        $("#initcolumn_formconfig").css("display","");
        $("#initcolumn_formdb").css("display","");
        bind_dropdown("update_name","批量修改",'update_name');
        bind_dropdown("update_value","批量修改",'update_value');
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridcolumnTable').setGridWidth($('.gridPanel').width());
                $("#gridcolumnTable").setGridHeight($(window).height()-100);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载表格
    function GetGrid() {
        var selectedRowIndex = 0;
            var $gridTable = $("#gridcolumnTable");
            $gridTable.jqGrid({
                url:"/system_manage/grid_column_manage/Grid_ColumnList?grid_id=" + escape(grid_id),
                cellurl:"/system_manage/grid_column_manage/Edit_Column",
                cellsubmit:"remote",
                cellEdit:true,
                mtype:"POST",
                datatype: "json",
                height: '600px',
                autowidth: true,
                colModel: [
                    { label: "主键", name: "column_id", index: "column_id", hidden: true,key:true},
                    { label: "主键", name: "menu_id", index: "menu_id", hidden:true},
                    { label: "主键", name: "grid_id", index: "grid_id", hidden:true},
                    { label: "编号", name: "column_code", index: "column_code", width: 150, align: "left", sortable: true,editable:true,edittype:"text" },
                    { label: "名称", name: "column_name", index: "column_name", width: 120, align: "left", sortable: true,editable:true,edittype:"text" }, 
                    { label: "字段类型", name: "column_type", index: "column_type", width: 80, align: "left", sortable: true,editable:true,
                        edittype:"select",editoptions: { value: "字符型:字符型;数值型:数值型;日期型:日期型 "} },
                    { label: "对齐方向", name: "column_align", index: "column_align", width: 60, align: "left", sortable: true ,editable:true,
                        edittype:"select",editoptions: { style:"width:50px; height:28px",value: "left:靠左;center:居中;right:靠右 "},
                        formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == "center" ? "居中" :( cellvalue == "left" ? "靠左" : (cellvalue == "right" ?"靠右" : cellvalue));
                        }
                    },
                    { label: "显示宽度", name: "column_width", index: "column_width", width: 80, align: "left", sortable: true,editable:true,edittype:"text"},
                    { label: "排序码", name: "sort_code", index: "sort_code", width: 50, align: "left", sortable: true,editable:true,edittype:"text" },
                    { label: "是否显示", name: "is_show", index: "is_show", width: 60, align: "center", sortable: true
                        ,editable:true,
                        edittype:"select",editoptions: { style:"width:50px; height:28px",value: "1:是;0:否 "},
                        formatter: function (cellvalue, options, rowObject) {
                            return cellvalue == 1 ? "是" : "否";
                        }
                    },
                    { label: "是否主键", name: "primary_key", index: "primary_key", width: 60, align: "center", sortable: true,editable:true, edittype:"select",editoptions: {style:"width:50px; height:28px",value: "是:是;否:否 "}
                    },
                    { label: "是否必输", name: "must_input", index: "must_input", width: 60, align: "center", sortable: true,editable:true, edittype:"select",editoptions: {style:"width:50px; height:28px",value: "是:是;否:否 "}},
                    { label: "是否编辑", name: "column_edit", index: "column_edit", width: 60, align: "center", sortable: true,editable:true,
                        edittype:"select",editoptions: { style:"width:50px; height:28px",value: "1:是;0:否 "}
                     ,formatter: function (cellvalue, options, rowObject) {
                            return cellvalue == 1 ? "是" : "否";
                        }
                    },
                    {
                        label: "所占列数", name: "proportion", index: "proportion", width: 60, align: "center", sortable: true, editable: true,
                        edittype: "select", editoptions: { style: "width:50px; height:28px", value: "1:一列;2:二列;3:三列;4:四列;5:五列 " },
                        formatter: function (cellvalue, options, rowObject) {
                            if (cellvalue == "1") return "一列";
                            if (cellvalue == "2") return "二列";
                            if (cellvalue == "3") return "三列";
                            if (cellvalue == "4") return "四列";
                            if (cellvalue == "5") return "五列";
                        }
                    }, 
                    { label: "是否格式化", name: "column_formatter", index: "column_formatter", width: 80, align: "center", sortable: true,editable:true,edittype:"select",editoptions: { style:"width:70px; height:28px",value: "否:否;是:是"}},
                    { label: "显示样式", name: "column_style", index: "column_style", width: 400, align: "center", sortable: true,editable:true,edittype:"text" },
                    { label: "是否冻结", name: "column_frozen", index: "column_frozen", width: 60, align: "center", sortable: true,editable:true, edittype:"select",editoptions: {style:"width:50px; height:28px",value: "是:是;否:否 "}},
                    { label: "下拉框名称", name: "dropdown_name", index: "dropdown_name", width: 160, align: "left", sortable: true ,editable:true,
                        edittype:"select",editoptions: { style:"width:150px; height:28px",value: "无:无;通用字典:通用字典;货主信息:货主信息;仓库信息:仓库信息;库位信息:库位信息;人员信息:人员信息;报价信息:报价信息;货物信息:货物信息;钢种信息:钢种信息;合同号:合同号;货主人员信息:货主人员信息 "}
                    },
                    { label: "下拉框参数", name: "dropdown_parameter", index: "dropdown_parameter", width: 200, align: "left", sortable: true,editable:true,edittype:"text" },  
                    { label: "下拉框过滤", name: "dropdown_filter_parameter", index: "dropdown_filter_parameter", width: 200, align: "left", sortable: true,editable:true,edittype:"text" }, 
                    { label: "下拉框关联赋值字段", name: "dropdown_other_column", index: "dropdown_parameter", width: 400, align: "left", sortable: true,editable:true,edittype:"text" },  
                    { label: "默认排序", name: "column_sort", index: "column_sort", width: 60, align: "left", sortable: true ,editable:true,
                        edittype:"select",editoptions: { style:"width:50px; height:28px",value: "无:无;升序:升序;降序:降序 "}
                    },
                    { label: "默认值", name: "default_value", index: "default_value", width: 200, align: "left", editable:true,edittype:"text"},
                    { label: "备注", name: "remark", index: "remark", width: 500, align: "left", editable:true,edittype:"text"}
                ],
                rowNum: 1000,
                rownumbers: true,
                shrinkToFit:false,
                sortname:"sort_code",
                sortorder: "asc",
                multiselect:true,
                beforeSaveCell:function(rowid, cellname, value, iRow, iCol) {
                    
                },
                beforeSubmitCell:function(rowid, cellname, value, iRow, iCol) {
                    return {keyvalue:rowid,cellname:cellname,cellvalue:value}
                }
            });
    }
    function btn_init_column(){
        var rowData = $("#selectedTable").jqGrid('getRowData'); 
        if (rowData.length>0){
            tencheer.dialogMsg({ msg: "已存在字段配置不能进行初始化！", type: 2 });
            return false;
        }
        $.SaveForm({
                url: "/system_manage/grid_column_manage/InitColumnConfig?grid_id="+grid_id+"&menu_id="+menu_id+"&table_name="+table_name ,
                param:  null,
                loading: "正在初始化数据...",
                close:false,
                success: function () {
                    $("#gridTable").resetSelection();
                    $("#gridTable").trigger("reloadGrid");
                }
            })
    }
    function btn_import_from_table(){
        if (checkedRow(grid_id)) {
            dialogOpen({
                id: "ColumnImportForm",
                title: '数据库表字段导入',
                url: 'system_manage/grid_column_manage/ImportColumnFromTable?grid_id='+grid_id,
                width: "1000px",
                height: "800px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    function btn_import_from_config(){
        if (checkedRow(grid_id)) {
            dialogOpen({
                id: "ColumnImportForm",
                title: '已配置字段导入',
                url: 'system_manage/grid_column_manage/ImportColumnFromConfig?grid_id='+grid_id,
                width: "1200px",
                height: "800px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                    
                }
            });
        }
    }
    //新增
    function btn_add() {
        if (checkedRow(grid_id)) {
            dialogOpen({
                id: "ColumnForm",
                title: '添加字段',
                url: 'system_manage/grid_column_manage/ColumnForm?grid_id='+grid_id,
                width: "500px",
                height: "600px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                    
                }
            });
        }
    };
    //编辑
    function btn_edit() {
        var keyValue = $("#gridcolumnTable").jqGridRowValue("column_id");
        var grid_id = $("#gridcolumnTable").jqGridRowValue("grid_id");
        var menu_id = $("#gridcolumnTable").jqGridRowValue("menu_id");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "ColumnForm",
                title: '编辑功能',
                url: 'system_manage/grid_column_manage/ColumnForm?keyValue=' + keyValue+"&menu_id="+ menu_id+"&grid_id="+grid_id,
                width: "500px",
                height: "600px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridcolumnTable").jqGridRowValue("column_id");
        if (keyValue) {
            $.RemoveForm({
                url: "/system_manage/grid_column_manage/RemoveColumnForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridcolumnTable").resetSelection();
                    $("#gridcolumnTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的字段！', 0);
        }
    }
    //Excel导出
    function btn_export(){
        
        tencheer.dialogOpen({
                    id: "ColumnForm",
                    title: '导出字段信息',
                    url: '/system_manage/excel_export_manage/ColumnFilter?gridId=gridcolumnTable&filename=字段配置信息&exportData=all&frameId=column_list',
                    width: "780px",
                    height: "510px",
                    btn: ['导出', '关闭'],
                    callBack: function (iframeId) {
                        top.frames[iframeId].AcceptClick();
                    }
                });
    }
     //字段排序
    function btn_sort(){
        var rowData=$("#gridcolumnTable").jqGrid("getRowData");
        tencheer.dialogOpen({
            id: "ColumnForm",
            title: '配置列排序',
            url: '/system_manage/grid_column_manage/column_sort_config?grid_id='+grid_id,
            width: "900px",
            height: "800px",
            btn: ['保存', '关闭'],
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
                $("#gridcolumnTable").resetSelection();
                 $("#gridcolumnTable").trigger("reloadGrid");
            }
        });
    }
    function batch_update(){
        var update_name=$("#update_name").val();
        var update_value=$("#update_value").val();
        if (update_name){
            var keyValue = $("#gridcolumnTable").jqGridRowValue("column_id");
            if (keyValue) {
                tencheer.saveForm({
                    url: "/system_manage/grid_column_manage/BatchUpdate",
                    param: { keyValue: keyValue,update_name:update_name,update_value:update_value },
                    loading: "正在批量修改配置...",
                    close:false,
                    success: function (data) {
                        $("#gridcolumnTable").resetSelection();
                        $("#gridcolumnTable").trigger("reloadGrid");
                    }
                });

            } else {
                dialogMsg('请选择需要修改的行', 0);
            }
        }
    }

</script>
<div class="titlePanel">
    <div class="title-search">
        <table>
            <tr>
                 <td id="initcolumn_formdb" style="width:125px;display:none" colspan="2" >
                    <a id="btn_initcolumn" class="btn btn-default" style="width:120px;height:31px;color: blue" onclick="btn_import_from_table()"><i class="fa fa-arrows-alt"></i>&nbsp;数据表字段导入</a>
                </td>
                 <td id="initcolumn_formconfig" style="width:125px;display:none" colspan="2">
                    <a id="btn_initcolumn" class="btn btn-default" style="width:120px;height:31px;color: blue" onclick="btn_import_from_config()"><i class="fa fa-arrows-alt"></i>&nbsp;已配置字段导入</a>
                </td>

                <td style="width:120px" colspan="2">
                    <input type="text" class="form-control input-sm" id="update_name"    placeholder="修改项">
                </td>
                <td style="width:120px" colspan="2">
                    <input type="text" class="form-control input-sm" id="update_value"   placeholder="修改值">
                </td>
                <td style="width:120px" >
                    <div class="btn-group">
                        <a id="lr-batupdate" class="btn btn-default" style="color: blue" onclick="batch_update()"><i class="fa fa-pencil-square-o"></i>&nbsp;批量修改</a>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="toolbar">
        
        <div class="btn-group">
            <a id="lr-add" class="btn btn-default" onclick="btn_add()" ><i class="fa fa-plus"></i>&nbsp;新增</a>
            <a id="lr-edit" class="btn btn-default" onclick="btn_edit()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
            <a id="lr-delete" class="btn btn-default" onclick="btn_delete()"><i class="fa fa-trash-o"></i>&nbsp;删除</a>
            <a id="lr-sort" class="btn btn-default" onclick="btn_sort()"><i class="fa fa-share-square-o"></i>&nbsp;排序</a>
        </div>
    </div>
</div>
<div class="gridPanel">
    <table id="gridcolumnTable"></table>
    <div id="gridPager"></div>
</div>
</body>
</html>
<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, tencheer)
</script>
