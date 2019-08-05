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
            padding-bottom: 0px;
        }
    </style>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
<script>
    $(function () {
        InitialPage();
        GetTree();
        GetGrid();
    });
    //初始化页面
    function InitialPage() {
        $("#cust_no").ComboBox({
           url: "/database_manage/database_manage/GetDatabaseDropdownList",
           id: "cust_no",
           text: "cust_name",
           description: "==请选择用户库==",
           height: "400px",
           allowSearch: true
       });
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
                $('#gridTable').setGridWidth(($('.gridPanel').width()));
                $("#gridTable").setGridHeight($(window).height() - 132);
                $("#itemTree").setTreeHeight($(window).height() - 52);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载树
    var _parentId = "";
    function GetTree() {
        var item = {
            height: $(window).height() - 52,
            url: "/system_manage/menu_manage/getMenuTreeJson",
            isAllExpand:false,
            onnodeclick: function (item) {
                _parentId = item.id;
                $('#btn_Search').trigger("click");
            }
        };
        //初始化
        $("#itemTree").treeview(item);
    }
 
    //加载表格
    function GetGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $('#gridTable');
        $gridTable.jqGrid({
            url: "/system_manage/menu_manage/ModuleDataList",
            datatype: "json",
            height: $(window).height() - 132,
            autowidth: true,
            colModel: [
                { label: "主键", name: "MenuId", index: "MenuId", hidden: true },
                { label: "主键", name: "ParentId", index: "ParentId", hidden: true },
                { label: "编号", name: "Menu_Code", index: "Menu_Code", width: 200, align: "left" },
                { label: "名称", name: "Menu_Name", index: "Menu_Name", width: 100, align: "left" },
                { label: "地址", name: "UrlAddress", index: "UrlAddress", width: 300, align: "left" },
                { label: "图标", name: "Menu_Icon", index: "Menu_Icon", width: 200, align: "left" },
                { label: "排序", name: "Sort_Code", index: "Sort_Code", width: 40, align: "left" },
                {
                    label: "导航目标", name: "Menu_Type", index: "Menu_Type", width: 60, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue=="ipage" ? "页面":"菜单";
                    }
                },
                {
                    label: "有效", name: "EnabledMark", index: "EnabledMark", width: 50, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                    }
                },
                { label: "描述", name: "Description", index: "remark", width: 500, align: "left" }
            ],
            pager: false,
            rowNum: "1000",
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
//            altRows:true,
//            altClass:'someClass',
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
             //双击事件
            ondblClickRow: function (RowIndx) {
                var rowData = $(this).jqGrid('getRowData', RowIndx);
                if (rowData.ParentId=="0"){
                    _parentId = rowData.MenuId;
                    $('#btn_Search').trigger("click");
                }
                else
                {
                    btn_edit();
                }
            },
            gridComplete: function () {
                $("#" + this.id).setSelection(selectedRowIndex, false);
            }
        });
        //查询条件
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
        //查询事件
        $("#btn_Search").click(function () {
            $gridTable.jqGrid('setGridParam', {
                url: "/system_manage/menu_manage/ModuleDataList",
                postData: {
                    parentid: _parentId,
                    condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                    keyword: $("#txt_Keyword").val()
                }
            }).trigger('reloadGrid');
        });
        //查询回车
        $('#txt_Keyword').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
    }
    //新增
    function btn_add() {
        dialogOpen({
            id: "Form",
            title: '添加功能',
            url: '/system_manage/menu_manage/moduleForm?parent_id=' + _parentId,
            width: "700px",
            height: "400px",
            btn: null
        });
    };
    //编辑
    function btn_edit() {
        var keyValue = $("#gridTable").jqGridRowValue("MenuId");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '编辑功能',
                url: '/system_manage/menu_manage/moduleForm?keyValue=' + keyValue,
                width: "700px",
                height: "400px",
                btn: null
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridTable").jqGridRowValue("MenuId");
        if (keyValue) {
            $.RemoveForm({
                url: "/system_manage/menu_manage/RemoveForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的数据项！', 0);
        }    
    }
    function btn_columnconfig(){
        top.tablist.newTab({ id: '字段配置', title:"字段配置", closed: true, icon: "fa fa-edit", url:"/system_manage/grid_column_manage/grid" });
    }
</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-west">
        <div class="west-Panel">
            <div class="panel-Title">功能目录</div>
            <div id="itemTree"></div>
        </div>
    </div>
    <div class="ui-layout-center">
        <div class="center-Panel">
            <div class="panel-Title">功能信息</div>
            <div class="titlePanel">
                <div class="title-search">
                    <table>
                        <tr>
                            <td>
                                <div id="queryCondition" class="btn-group">
                                    <a class="btn btn-default dropdown-text" data-toggle="dropdown">选择条件</a>
                                    <a class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li><a data-value="EnCode">编号</a></li>
                                        <li><a data-value="FullName">名称</a></li>
                                        <li><a data-value="UrlAddress">地址</a></li>
                                    </ul>
                                </div>
                            </td>
                            <td style="padding-left: 2px;">
                                <input id="txt_Keyword" type="text" class="form-control" placeholder="请输入要查询关键字" style="width: 200px;" />
                            </td>
                            <td style="padding-left: 5px;">
                                <a id="btn_Search" class="btn btn-primary"><i class="fa fa-search"></i>&nbsp;查询</a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="toolbar">
                    <div class="btn-group">
                        <a id="lr-replace" class="btn btn-default" onclick="reload();"><i class="fa fa-refresh"></i>&nbsp;刷新</a>
                        <a id="lr-add" class="btn btn-default" onclick="btn_add()"><i class="fa fa-plus"></i>&nbsp;新增</a>
                        <a id="lr-edit" class="btn btn-default" onclick="btn_edit()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
                        <!--<a id="lr-column" class="btn btn-default" onclick="btn_columnconfig();"><i class="fa fa-refresh"></i>&nbsp;字段配置</a>-->
                        <a id="lr-delete" class="btn btn-default" onclick="btn_delete()"><i class="fa fa-trash-o"></i>&nbsp;删除</a>
                    </div>
<!--                    <script>$('.toolbar').authorizeButton()</script>-->
                </div>
            </div>
            <div class="gridPanel">
                <table id="gridTable"></table>
            </div>
        </div>
    </div>
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
