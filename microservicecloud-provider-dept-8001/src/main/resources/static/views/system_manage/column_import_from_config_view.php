<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>系统功能</title>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <!--bootstrap组件end-->
    <script src="/statics/scripts/plugins/layout/jquery.layout.js"></script>
    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>
    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css?v=007" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css?v=20161212" rel="stylesheet"/>

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

    <style>
        html, body {
            height: 100%;
            width: 100%;
        }
    </style>
</head>
<body>

<script>
    var grid_id = tencheer.request('grid_id');
    var table_name = tencheer.request('table_name');
    var menu_id=tencheer.request('menu_id');
    $(function () {
        InitialPage();
        GetGrid();
        GetColumnGrid();
    });
    //初始化页面
    function InitialPage() {
        //layout布局
        $('#layout').layout({
            applyDemoStyles: true,
            onresize: function () {
                $(window).resize()
            }
        });
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#columnListTable').setGridWidth(($('.gridPanel').width()));
            }, 200);
            e.stopPropagation();
        });
    }
    function AcceptClick() {
        var selectRow=$('#columnListTable').jqGrid('getGridParam','selarrrow');
        if (selectRow.length==0) { tencheer.dialogMsg({ msg: "请先选中行数据再进行此操作！", type: 2 }); return false;}
        var selectRowData =$("#columnListTable").jqGridRow();
        $.SaveForm({
            url: "/system_manage/grid_column_manage/ImportColumnConfigForm?grid_id=" + grid_id+"&menu_id="+menu_id,
            param: {selectRowData:JSON.stringify(selectRowData)},
            loading: "正在导入数据...",
            success: function () {
                tencheer.getIframe("column_list").$("#gridcolumnTable").resetSelection();
                tencheer.getIframe("column_list").$("#gridcolumnTable").trigger("reloadGrid");
            }
        })
    }
    function GetColumnGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $('#columnListTable');
        $gridTable.jqGrid({
            url:"/system_manage/grid_column_manage/Grid_ColumnList?grid_id=000",
            datatype: "json",
            height: $(window).height() - 50,
            autowidth: true,
            colModel: [
                    { label: "主键", name: "column_id", index: "column_id", hidden: true,key:true},
                    { label: "主键", name: "menu_id", index: "menu_id", hidden:true},
                    { label: "主键", name: "grid_id", index: "grid_id", hidden:true},
                    { label: "编号", name: "column_code", index: "column_code", width: 150, align: "left", sortable: true,editable:true,edittype:"text" },
                    { label: "名称", name: "column_name", index: "column_name", width: 120, align: "left", sortable: true,editable:true,edittype:"text" }, 
                    { label: "字段类型", name: "column_type", index: "column_type", width: 80, align: "left", sortable: true,editable:true },
                    { label: "对齐方向", name: "column_align", index: "column_align", width: 60, align: "left", sortable: true ,
                        formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == "center" ? "居中" :( cellvalue == "left" ? "靠左" : (cellvalue == "right" ?"靠右" : cellvalue));
                        }
                    },
                    { label: "显示宽度", name: "column_width", index: "column_width", width: 80, align: "left", sortable: true,editable:true,edittype:"text"},
                    { label: "排序", name: "sort_code", index: "sort_code", width: 50, align: "left", sortable: true,editable:true,edittype:"text" },
                    { label: "是否显示", name: "is_show", index: "is_show", width: 60, align: "center", sortable: true
                        ,editable:true,
                        edittype:"select",editoptions: { value: "1:是;0:否 "},
                        formatter: function (cellvalue, options, rowObject) {
                            return cellvalue == 1 ? "是" : "否";
                        }
                    },
                    { label: "是否主键", name: "primary_key", index: "primary_key", width: 60, align: "center", sortable: true},
                    { label: "是否编辑", name: "column_edit", index: "column_edit", width: 60, align: "left", sortable: true,editable:true,
                        edittype:"select",editoptions: { value: "1:是;0:否 "}
                     ,formatter: function (cellvalue, options, rowObject) {
                            return cellvalue == 1 ? "是" : "否";
                        }
                    },
                    { label: "是否格式化", name: "column_formatter", index: "column_formatter", width: 80, align: "center", sortable: true},
                    { label: "显示样式", name: "column_style", index: "column_style", width: 400, align: "center", sortable: true,editable:true,edittype:"text" }
                    
                ],
            pager: false,
            rowNum: "1000",
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
            multiselect:true,
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $("#" + this.id).setSelection(selectedRowIndex, false);
            }
        });
    }
    //加载表格
    function GetGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $("#gridListTable");
        $gridTable.jqGrid({
            url: "/system_manage/grid_column_manage/GetGridListJson",
            datatype: "json",
            height:  $(window).height() - 50,
            autowidth: true,
            colModel: [
                { label: "主键", name: "grid_id", index: "grid_id",key:true, hidden: true },
                { label: "列表名称", name: "grid_name", index: "grid_name", width: 180, align: "left" },
                { label: "列表编码", name: "grid_code", index: "grid_code", width: 120, align: "left" },
                { label: "显示选择", name: "grid_select", index: "grid_select", width: 60, align: "left",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示行号", name: "grid_row_no", index: "grid_row_no", width: 60, align: "left",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示分页", name: "grid_page", index: "grid_page", width: 60, align: "left",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示过滤", name: "grid_filter", index: "grid_filter", width: 60, align: "left" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示汇总", name: "grid_summary", index: "grid_summary", width: 60, align: "left" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "可否编辑", name: "grid_edit", index: "grid_edit", width: 60, align: "left" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "宽度", name: "grid_width", index: "grid_width", width: 50, align: "left" },
                { label: "高度", name: "grid_height", index: "grid_height", width: 50, align: "left" },
                { label: "自动宽度", name: "auto_width", index: "auto_width", width: 60, align: "center" },
                { label: "数据地址", name: "data_url", index: "data_url", width: 300, align: "left" },
                { label: "来源表名", name: "table_name", index: "table_name", width: 150, align: "left" }
            ],
            pager: false,
            rowNum: "1000",
            rownumbers: false,
            shrinkToFit: false,
            gridview: true,
            sortname:"menu_name",
            sortorder: "asc",
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
                $("#columnListTable").jqGrid('setGridParam', {url:  "/system_manage/grid_column_manage/Grid_ColumnList?grid_id=" + escape(selectedRowIndex)});
                $("#columnListTable").trigger("reloadGrid");
            },
            gridComplete: function () {
                $("#" + this.id).jqGrid('setSelection',1);
            }
        });
         $gridTable.jqGrid('filterToolbar',{searchOperators : false,autosearch:true,searchOnEnter:true});
    }

</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-west">
        <div class="west-Panel">
<!--            <div class="panel-Title">列表目录</div>-->
            <div class="gridPanel">
                <table id="gridListTable"></table>
            </div>
        </div>
    </div>
    <div class="ui-layout-center">
        <div class="center-Panel">
            <!--<div class="panel-Title">字段信息</div>-->
            <div class="gridPanel">
                <table id="columnListTable"></table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
