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
    function GetColumnGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $('#columnListTable');
        $gridTable.jqGrid({
            url:"/system_manage/grid_column_manage/GetColumnFromTable?table_name=555",
            datatype: "json",
            height: $(window).height() - 50,
            autowidth: true,
            colModel: [
                    { label: "主键", name: "column_id", index: "column_id", hidden: true,key:true},
                    { label: "字段编码", name: "column_code", index: "column_code", width: 150, align: "left", sortable: true}, 
                    { label: "字段名称", name: "column_name", index: "column_name", width: 250, align: "left", sortable: true}, 
                    { label: "字段类型", name: "column_type", index: "column_type", width: 150, align: "left", sortable: true}  
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
            url: "/system_manage/grid_column_manage/GetTableList",
            datatype: "json",
            height:  $(window).height() - 50,
            autowidth: true,
            colModel: [
//                { label: "主键", name: "table_name", index: "table_name",key:true, hidden: true },
                { label: "数据库表名", name: "table_name", index: "table_name", width: 200, align: "left" ,key:true}
            ],
            pager: false,
            rowNum: "1000",
            rownumbers: false,
            shrinkToFit: false,
            gridview: true,
            sortname:"table_name",
            sortorder: "asc",
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
                $("#columnListTable").jqGrid('setGridParam', {url:  "/system_manage/grid_column_manage/GetColumnFromTable?table_name=" + escape(selectedRowIndex)});
                $("#columnListTable").trigger("reloadGrid");
            },
            gridComplete: function () {
                $("#" + this.id).jqGrid('setSelection',1);
            }
        });
        $gridTable.jqGrid('filterToolbar',{searchOperators : false,autosearch:true,searchOnEnter:true});
    }
    
    function AcceptClick() {
        var selectRow=$('#columnListTable').jqGrid('getGridParam','selarrrow');
        if (selectRow.length==0) { tencheer.dialogMsg({ msg: "请先选中行数据再进行此操作！", type: 2 }); return false;}
        var selectRowData =$("#columnListTable").jqGridRow();
        $.SaveForm({
            url: "/system_manage/grid_column_manage/ImportTableColumnForm?grid_id=" + grid_id+"&menu_id="+menu_id,
            param: {selectRowData:JSON.stringify(selectRowData)},
            loading: "正在导入数据...",
            success: function () {
                tencheer.getIframe("column_list").$("#gridcolumnTable").resetSelection();
                tencheer.getIframe("column_list").$("#gridcolumnTable").trigger("reloadGrid");
            }
        })
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
