<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>部门管理</title>
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
    <style>
        body {
            margin: 10px;
            margin-bottom: 0px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
    
<script>
    var columnJson = [];
    $(function () {
        InitialControl();
        InitialPage();
        
    });
    function InitialControl(){
        gridTable=$("#gridTable");
        columnJson=tencheer.CreateGridTable(gridTable,"sys_depart_list");
        gridTable.setGridWidth(($('.gridPanel').width()));
        gridTable.setGridHeight($(window).height() - 160);
        //查询条件设置
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
         //查询事件
        $("#btn_Search").click(function () {
           search();
        });
        //查询回车事件
        $('#txt_Keyword,.ui-search-input input').bind('keypress', function (event) {
                if (event.keyCode == "13") {
                    $('#btn_Search').trigger("click");
                }
        });
    }
    function search(){
         var colSearch = "";
                $(".ui-search-input input").each(function (i) {
                    var columnCode = $(this).attr("name");
                    var columnType = tencheer.getColumnType(columnJson, columnCode);
                    if ($(this).val() != "") {
                        if (columnType == "日期型")
                            colSearch += " and to_char(" + $(this).attr("name") + ", 'YYYY-MM-DD HH24:MI:SS') like '☻" + $(this).val() + "☻'";
                        if (columnType == "数值型")
                            colSearch+=" and COALESCE("+$(this).attr("name") +",0) = "+$(this).val();
                        if (columnType == "字符型")
                            colSearch += " and " + $(this).attr("name") + " like '☻" + $(this).val() + "☻'";
                    }
                });
                gridTable.jqGrid('setGridParam', {
                    datatype: "json",
                    postData: {
                        condition: "category_name",
                        keyword: $("#txt_Keyword").val(),
                        ParameterJson: colSearch,
                        parent_id: parent_id
                    }
                }).trigger('reloadGrid');
    }
    //初始化页面
    function InitialPage() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridTable').setGridWidth(($('.gridPanel').width()));
                $("#gridTable").setGridHeight($(window).height() - 160);
            }, 200);
            e.stopPropagation();
        });
    }

    function formatData(cellValue, colName, options, rowObject, column_type) {
            return cellValue;
    }
    //新增
    function btn_add() {
        dialogOpen({
            id: "Form",
            title: '添加部门',
            url: '/system_manage/department_manage/Form',
            width: "700px",
            height: "400px",
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
            }
        });
    };
    //编辑
    function btn_edit() {
        var keyValue = $("#gridTable").jqGridRowValue("depart_no");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '编辑部门',
                url: '/system_manage/department_manage/Form?keyValue=' + keyValue,
                width: "700px",
                height: "400px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridTable").jqGridRowValue("F_DepartmentId");
        if (keyValue) {
            var sort = $("#gridTable").jqGridRowValue("F_Sort");
            if (sort == 'Organize') {
                return false;
            }
            $.RemoveForm({
                url: "/system_manage/department_manage/RemoveForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").resetSelection();
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的部门！', 0);
        }
    }
</script>
<div class="titlePanel">
    <div class="title-search">

    </div>
    <div class="toolbar">
        <div class="btn-group">
            <a id="lr-replace" class="btn btn-default" onclick="tencheer.reload();"><i class="fa fa-refresh"></i>&nbsp;刷新</a>
            <a id="lr-add" class="btn btn-default" onclick="btn_add()"><i class="fa fa-plus"></i>&nbsp;新增</a>
            <a id="lr-edit" class="btn btn-default" onclick="btn_edit()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
        </div>
    </div>
</div>
<div class="gridPanel">
    <table id="gridTable"></table>
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
