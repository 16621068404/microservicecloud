<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>角色管理</title>
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
    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>
    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>

    <style>
        body {
            margin: 10px;
            margin-bottom: 0px;
        }
    </style>
</head>
<body>

<script>
    var columnJson = [];
    $(function () {
        InitialControl();
        InitialPage();
        
    });

    function InitialControl(){
        gridTable=$("#gridTable");
        columnJson=tencheer.CreateGridTable(gridTable,"sys_role_list");
        gridTable.setGridHeight($(window).height() - 125);
        //查询条件设置  
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
        //查询事件
        $("#btn_Search").click(function () {
            $gridTable.jqGrid('setGridParam', {
                postData: {
                    condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                    keyword: $("#txt_Keyword").val()
                }
            }).trigger('reloadGrid');
        });
        //查询回车事件
        $('#txt_Keyword').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
    }
    //初始化页面
    function InitialPage() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
//                $('#gridTable').setGridWidth($('.gridPanel').width() -2);
                $("#gridTable").setGridHeight($(window).height() - 125);
            }, 200);
            e.stopPropagation();
        });
    }
    function formatData(cellValue,colName){
        return cellValue;
    }

    //新增
    function btn_add() {
        tencheer.dialogOpen({
            id: "Form",
            title: '添加角色',
            url: '/system_manage/role_manage/Form',
            width: "500px",
            height: "320px",
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
            }
        });
    };
    //编辑
    function btn_edit() {
        var keyValue = $("#gridTable").jqGridRowValue("role_no");
        if (checkedRow(keyValue)) {
            tencheer.dialogOpen({
                id: "Form",
                title: '修改角色',
                url: '/system_manage/role_manage/Form?keyValue=' + keyValue,
                width: "500px",
                height: "360px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridTable").jqGridRowValue("role_no");
        if (keyValue) {
            $.tencheer.RemoveForm({
                url: "/system_manage/role_manage/RemoveForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的角色！', 0);
        }
    }
    //角色成员
    function btn_member() {
        var keyValue = $("#gridTable").jqGridRowValue("role_no");
        var RoleName = $("#gridTable").jqGridRowValue("role_name");
        if (checkedRow(keyValue)) {
            tencheer.dialogOpen({
                id: "AllotMember",
                title: '角色成员 - ' + RoleName,
                url: '/system_manage/role_manage/allotMember?roleId=' + keyValue,
                width: "800px",
                height: "520px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //角色授权
    function btn_authorize() {
        var RoleId = $("#gridTable").jqGridRowValue("role_no");
        var RoleName = $("#gridTable").jqGridRowValue("role_name");
        if (checkedRow(RoleId)) {
            dialogOpen({
                id: "AllotRight",
                title: '角色授权 - ' + RoleName,
                url: '/system_manage/role_manage/AllotRight?ObjectId=' + RoleId + '&Category=2',
                width: "700px",
                height: "690px",
                btn: null
            });
        }
    }

</script>
<div class="titlePanel">
    <div class="title-search">

    </div>
    <div class="toolbar">
        <div class="btn-group">
            <a id="lr-replace" class="btn btn-default" onclick="reload();"><i class="fa fa-refresh"></i>&nbsp;刷新</a>
            <a id="lr-add" class="btn btn-default" onclick="btn_add()"><i class="fa fa-plus"></i>&nbsp;新增</a>
            <a id="lr-edit" class="btn btn-default" onclick="btn_edit()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
        </div>
        <div class="btn-group">
            <a id="lr-authorize" class="btn btn-default" onclick="btn_authorize()"><i class="fa fa-gavel"></i>&nbsp;角色授权</a>
            <a id="lr-member" class="btn btn-default" onclick="btn_member()"><i class="fa fa fa-group"></i>&nbsp;角色成员</a>
        </div>

    </div>
</div>
<div class="gridPanel">
    <table id="gridTable"></table>
    <div id="gridPager"></div>
</div>
</body>
</html>
