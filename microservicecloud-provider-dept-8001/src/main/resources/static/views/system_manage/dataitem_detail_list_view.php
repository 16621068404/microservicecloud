<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>字典管理</title>
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
        html, body {
            height: 100%;
            width: 100%;
        }
    </style>
    <!--2017-07-05-->
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
                $("#gridTable").setGridHeight($(window).height() - 125);
                $("#itemTree").setTreeHeight($(window).height() - 52);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载树
    var _itemId = "";
    var _itemName = "";
    var _isTree = "";
    function GetTree() {
        var item = {
            height: $(window).height() - 52,
            url: "/system_manage/dataitem_manage/GetDataItemTreeJson",
            onnodeclick: function (item) {
                _itemId = item.id;
                _itemName = item.text;
                _isTree = item.isTree;
                $("#titleinfo").html(_itemName + "(" + item.value + ")");
                $("#txt_Keyword").val("");
                $('#btn_Search').trigger("click");
            }
        };
        //初始化
        $("#itemTree").treeview(item);
    }
    //加载表格
    function GetGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $("#gridTable");
        $gridTable.jqGrid({
            datatype: "json",
            height: $(window).height() - 127,
            autowidth: true,
            colModel: [
                { label: '主键', name: 'ItemDetailId', hidden: true },
                { label: '&nbsp;&nbsp;&nbsp;&nbsp;项目名', name: 'ItemName', index: 'ItemName', width: 200, align: 'left', sortable: false },
                { label: '项目值', name: 'ItemValue', index: 'ItemValue', width: 200, align: 'left', sortable: false },
                { label: '排序', name: 'SortCode', index: 'SortCode', width: 80, align: 'center', sortable: false },
                {
                    label: "默认", name: "IsDefault", index: "IsDefault", width: 50, align: "center", sortable: false,
                    formatter: function (cellvalue) {
                        return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                    }
                },
                {
                    label: "有效", name: "EnabledMark", index: "EnabledMark", width: 50, align: "center", sortable: false,
                    formatter: function (cellvalue) {
                        return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                    }
                },
                { label: "备注", name: "Description", index: "Description", width: 200, align: "left", sortable: false }
            ],
            treeGrid: true,
            treeGridModel: "nested",
            ExpandColumn: "ItemValue",
            rowNum: "10000",
            rownumbers: true,
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
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
                url: "/system_manage/dataitem_manage/GetDataItemDetailTreeList",
                postData: {
                    itemId: _itemId,
                    condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                    keyword: $("#txt_Keyword").val()
                },
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
        if (!_itemId) {
            return false;
        }
        var parentId = $("#gridTable").jqGridRowValue("ItemDetailId");
        if (_isTree != 1) {
            parentId = 0;
        }
        tencheer.dialogOpen({
            id: "Form",
            title: '添加字典',
            url: '/system_manage/dataitem_manage/DataItemDetailForm?parentId=' + parentId + "&itemId=" + _itemId,
            width: "500px",
            height: "370px",
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
            }
        });
    };
    //编辑
    function btn_edit() {
        var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");

        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '编辑字典',
                url: '/system_manage/dataitem_manage/DataItemDetailForm?keyValue=' + keyValue,
                width: "500px",
                height: "370px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");
        if (keyValue) {
            $.RemoveForm({
                url: "/system_manage/dataitem_manage/RemoveDetailForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").resetSelection();
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的字典！', 0);
        }
    }
    //详细
    function btn_detail() {
        var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Detail",
                title: '字典信息',
                url: '/system_manage/dataitem_manage/DataItemDetailForm?keyValue=' + keyValue,
                width: "500px",
                height: "480px",
                btn: null
            });
        }
    }
    //字典分类
    function btn_datacategory() {
        dialogOpen({
            id: "DataItemSort",
            title: '字典分类',
            url: '/system_manage/dataitem_manage/DataItemList',
            width: "800px",
            height: "500px",
            btn: null
        });
    }
</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-west">
        <div class="west-Panel">
            <div class="panel-Title">字典分类</div>
            <div id="itemTree"></div>
        </div>
    </div>
    <div class="ui-layout-center">
        <div class="center-Panel">
            <div class="panel-Title">
                字典数据 - <span id="titleinfo">未选择分类</span>
            </div>
            <div class="titlePanel">
                <div class="title-search">
                    <table>
                        <tr>
                            <td>
                                <div id="queryCondition" class="btn-group">
                                    <a class="btn btn-default dropdown-text" data-toggle="dropdown">选择条件</a>
                                    <a class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li><a data-value="ItemName">项目名</a></li>
                                        <li><a data-value="ItemValue">项目值</a></li>
                                        <li><a data-value="SimpleSpelling">拼音</a></li>
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
                        <a id="lr-delete" class="btn btn-default" onclick="btn_delete()"><i class="fa fa-trash-o"></i>&nbsp;删除</a>
                        <a id="lr-detail" class="btn btn-default" onclick="btn_detail()"><i class="fa fa-list-alt"></i>&nbsp;详细</a>
                    </div>
                    <div class="btn-group">
                        <a id="lr-datacategory" class="btn btn-default" onclick="btn_datacategory()"><i class="fa fa-tags"></i>&nbsp;字典分类</a>
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
    })(window.jQuery, window.tencheer)
</script>