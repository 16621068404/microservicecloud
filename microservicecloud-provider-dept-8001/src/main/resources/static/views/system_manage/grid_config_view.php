<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>列表配置</title>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.11.0.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <script src="/statics/scripts/bootstrap/bootstrap-confirmation.js"></script>
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

    <link href="/statics/scripts/plugins/datetime/jquery.datetimepicker.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/datetime/jquery.datetimepicker.full.js"></script>
    <link href="/statics/scripts/plugins/split/split.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/split/split.js"></script>
    <script>
        var current_cust_no="";
        $(document).ready(function () {
            InitialPage();
            GetGrid();
            GetTree();
        });
        //加载树
        var _parentId = "";
        var _parentName="";
        function GetTree() {
            var item = {
                height: $(window).height() - 52,
                url: "/system_manage/grid_column_manage/getMenuTreeJson",
                isAllExpand:false,
                onnodeclick: function (item) {
                    _parentId = item.id;
                    _parentName=item.text;
                    $('#btn_Search').trigger("click");
                    $("#gridButton").jqGrid('setGridParam', {
                        postData: {
                            menu_id:_parentId
                        }
                    }).trigger('reloadGrid');
                }
            };
            //初始化
            $("#itemTree").treeview(item);
        }
            //初始化页面
    function InitialPage() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                 $('#gridTable').setGridWidth($('#main').width() -2);
                 $("#gridTable").setGridHeight($("#main").height() -150);
                 $("#itemTree").setTreeHeight($("#title").height());
                 
                 $('#gridButton').setGridWidth($('#main').width() -2);
                 $("#gridButton").setGridHeight($("#main").height() -150);
            }, 200);
            e.stopPropagation();
        });
        $(window).resize();
    }
    //加载表格
    function GetGrid() {
        var selectedRowIndex = 0;
        var $gridTable = $("#gridTable");
        $gridTable.jqGrid({
            url: "/system_manage/grid_column_manage/GetGridListJson",
            datatype: "json",
            height: $(window).height() - 150,
            autowidth: true,
            colModel: [
                { label: "主键", name: "grid_id", index: "grid_id",key:true, hidden: true,frozen:true },
                { label: "主键", name: "menu_id", index: "menu_id", hidden: true,frozen:true },
                { label: "菜单名称", name: "menu_name", index: "menu_name", width: 120, align: "left",sortable:false,frozen:true },
                { label: "列表名称", name: "grid_name", index: "grid_name", width: 300, align: "left",frozen:true },
                { label: "列表编码", name: "grid_code", index: "grid_code", width: 300, align: "left" },
                
                { label: "显示选择", name: "grid_select", index: "grid_select", width: 60, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示行号", name: "grid_row_no", index: "grid_row_no", width: 60, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示分页", name: "grid_page", index: "grid_page", width: 60, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示过滤", name: "grid_filter", index: "grid_filter", width: 60, align: "center" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "显示汇总", name: "grid_summary", index: "grid_summary", width: 60, align: "center" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "可否编辑", name: "grid_edit", index: "grid_edit", width: 60, align: "center" ,
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "是" : "否";
                        }
                },
                { label: "排序字段", name: "sort_column", index: "sort_column", width: 160, align: "center"},
                { label: "排序方式", name: "sort_type", index: "sort_type", width: 60, align: "center",
                formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 'desc' ? "降序" : "升序";
                        }
                    },
                { label: "每页记录数", name: "grid_rownum", index: "grid_rownum", width: 80, align: "right"
                    
                },
                
                { label: "包含子表", name: "sub_grid", index: "sub_grid", width: 60, align: "center"},
                { label: "宽度", name: "grid_width", index: "grid_width", width: 50, align: "left" },
                { label: "高度", name: "grid_height", index: "grid_height", width: 50, align: "left" },
                { label: "自动宽度", name: "auto_width", index: "auto_width", width: 60, align: "center" },
                { label: "数据地址", name: "data_url", index: "data_url", width: 300, align: "left" },
                { label: "来源表名", name: "table_name", index: "table_name", width: 150, align: "left" },
                { label: "分页栏标识", name: "grid_pager_id", index: "grid_pager_id", width: 150, align: "left" },
                { label: "备注", name: "remark", index: "remark", width: 500, align: "left" }
            ],
            pager: true,
            rowNum: "2000",
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
            sortname:"menu_name",
            sortorder: "asc",
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $("#" + this.id).jqGrid('setSelection',1);
            },
            loadComplete: function() {   
                $('.ui-jqgrid-bdiv').scrollLeft(0);  
            }   
        });
        
        $("#gridTable").jqGrid('filterToolbar',{searchOperators : false,autosearch:false,searchOnEnter:false});
//        $("#gridTable").jqGrid('setFrozenColumns');
        $("#gridTable").trigger('reloadGrid');
        //查询条件设置
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
         //查询事件
        $("#btn_Search").click(function () {
            var colSearch="";
            $(".ui-search-input input").each(function(i){
                if ($(this).val()!=""){
                       colSearch+=" and "+$(this).attr("name") +" like '☻"+$(this).val()+"☻'";
                }
             });
            $gridTable.jqGrid('setGridParam', {
                url: "/system_manage/grid_column_manage/GetGridListJson?cust_no="+current_cust_no,
                postData: {
                    condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                    keyword: $("#txt_Keyword").val(),
                    columnsearch:colSearch,
                    menu_id:_parentId
                }
            }).trigger('reloadGrid');
        });
        //查询回车事件
        $('#txt_Keyword,.ui-search-input input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
    }
    //新增
    function btn_add() {
        dialogOpen({
            id: "Form",
            title: '添加表格配置',
            url: 'system_manage/grid_column_manage/gridForm?menu_id='+_parentId+'&menu_name='+escape(_parentName),
            width: "800px",
            height: "500px",
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
            }
        });
    };
    //编辑
    function btn_edit() {
         var keyValue = $("#gridTable").jqGridRowValue("grid_id");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '编辑功能',
                url: '/system_manage/grid_column_manage/gridForm?keyValue=' + keyValue,
                width: "800px",
                height: "510px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete() {
        var keyValue = $("#gridTable").jqGridRowValue("grid_id");
        if (keyValue) {
            $.RemoveForm({
                url: "/system_manage/grid_column_manage/RemoveGridForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").resetSelection();
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的员工！', 0);
        }
    }
    function btn_column_config(){
        var grid_id = $("#gridTable").jqGridRowValue("grid_id");
        var grid_name = $("#gridTable").jqGridRowValue("grid_name");
        var table_name = $("#gridTable").jqGridRowValue("table_name");

        var menu_id = $("#gridTable").jqGridRowValue("menu_id");
        if (grid_id) {
                tencheer.FullDialog({
                    id: "column_list",
                    title: '字段配置-'+grid_name,
                    url: '/system_manage/grid_column_manage/column?grid_id=' + grid_id+"&table_name="+table_name+"&menu_id="+menu_id,
                    width: $(window).width() +"px",
                    height: "900px",
                    callBack: function (iframeId) {
                        top.frames[iframeId].AcceptClick();
                    }
                });
            }
    }
    //Excel导出
    function btn_export(){
        tencheer.dialogOpen({
                    id: "GridForm",
                    title: '导出列表信息',
                    url: '/system_manage/excel_export_manage/ColumnFilter?gridId=gridTable&filename=列表配置信息&exportData=all',
                    width: "780px",
                    height: "510px",
                    btn: ['导出', '关闭'],
                    callBack: function (iframeId) {
                        top.frames[iframeId].AcceptClick();
                    }
                });
    }
       //列表配置初始化
    function init_config(){
         tencheer.confirmAjax({
                msg: "注：您确定要【初始化】列表配置吗？",
                url: "/system_manage/grid_column_manage/init_grid_column",
                success: function (data) {
                    tencheer.dialogMsg({ msg:data.message, type: data.type});
                    $('#gridTable').trigger("reloadGrid");
                }
            })
    }
    
    //功能按钮配置
        //加载表格
    function GetButtonGrid() {
        $("#gridButton").jqGrid({
            url: "/system_manage/button_manage/GetListJson",
            datatype: "json",
            treeGrid: true,
            treeGridModel: "nested",
            ExpandColumn: "Code",
            height: $(window).height() - 142,
            autowidth: true,
            colModel: [
                { label: '主键', name: 'button_id', index: 'button_id', hidden: true },
                { label: '名称', name: 'button_name', index: 'button_name', hidden: true },
                {
                    label: "按钮", name: "button_name", index: "button_name", width: 150,
                    formatter: function (cellvalue, options, rowObject) {
                        return "<i class='" + rowObject.button_icon + "'></i>&nbsp;" + cellvalue;
                    }
                },
                { label: "编码", name: "button_code", index: "button_code", width: 150 },
                {
                    label: '有效', name: 'status', index: 'status', width: 45, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue == '1') return "<img src='/statics/Images/checkokmark.gif'/>";
                        if (cellvalue == '0') return "<img src='/statics/Images/checknomark.gif'/>";
                    }
                },
                { label: '描述', name: 'remark', index: 'remark', width: 700 }
            ],
            pager: "false",
            rowNum: 1000,
            rownumbers: true,
            shrinkToFit: false
        });
    }
    //新增
    function btn_add_button() {
        dialogOpen({
            id: "Form",
            title: '添加按钮',
            url: 'system_manage/button_manage/form?menu_id='+_parentId+'&menu_name='+escape(_parentName),
            width: "500px",
            height: "400px",
            callBack: function (iframeId) {
                top.frames[iframeId].AcceptClick();
            }
        });
    };
    //编辑
    function btn_edit_button() {
         var keyValue = $("#gridButton").jqGridRowValue("button_id");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '编辑按钮',
                url: '/system_manage/button_manage/form?keyValue=' + keyValue+'&menu_id='+_parentId+'&menu_name='+escape(_parentName),
                width: "500px",
                height: "400px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            });
        }
    }
    //删除
    function btn_delete_button() {
        var keyValue = $("#gridButton").jqGridRowValue("button_id");
        if (keyValue) {
            $.RemoveForm({
                url: "/system_manage/button_manage/RemoveForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridButton").resetSelection();
                    $("#gridButton").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的行！', 0);
        }
    }

    function btn_clear_redis(){
        var system_type="7";
        tencheer.confirmAjax({
                msg: "注：您确定要进行清空Redis缓存吗？",
                url: '/system_manage/grid_column_manage/ClearRedisCache',
                param: { "system_type":system_type},
                success: function (data) {
                    tencheer.dialogMsg({ msg:data.message, type: data.type});
                }
            })
    }
    </script>
  <style>
  html, body {
    height: 100%;
    overflow: hidden;
  }
  body {
    padding: 5px;
    padding-bottom: 2px;
    background-color: #F6F6F6;
    box-sizing: border-box;
  }
  .nav-tabs{padding-top: 0px;}
  </style>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
    <div id="title" class="split split-horizontal content">
        <div id="itemTree"></div>
    </div>
    <div id="main" class="split split-horizontal content">
        <ul class="nav nav-tabs" style="background-color: #f5f5f5">
            <li class="active"><a href="#ColumnInfo" data-toggle="tab">字段配置</a></li>
<!--            <li ><a href="#ButtonInfo" data-toggle="tab">按钮配置</a></li>-->
        </ul>
        <div class="tab-content" style="padding-top: 2px;">
            <div id="ColumnInfo" class="tab-pane active" >
                <div class="titlePanel">
                    <div class="title-search">
                        <div class="btn-group">
                            <a id="lr-columnConfig" class="btn btn-danger" onclick="btn_column_config()"><i class="fa fa-table"></i>&nbsp;配置字段</a>
                        </div>
                        <table>
                            <tr style="display: none">
                                <td>
                                    <div id="queryCondition" class="btn-group">
                                        <a class="btn btn-default dropdown-text" data-toggle="dropdown">选择条件</a>
                                        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                                        <ul class="dropdown-menu">
                                            <li><a data-value="menu_name">菜单名称</a></li>
                                            <li><a data-value="grid_name">列表名称</a></li>
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
                            <a id="lr-add" class="btn btn-default" onclick="btn_add()" ><i class="fa fa-plus"></i>&nbsp;新增</a>
                            <a id="lr-edit" class="btn btn-default" onclick="btn_edit()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
                            <a id="lr-delete" class="btn btn-default" onclick="btn_delete()"><i class="fa fa-trash-o"></i>&nbsp;删除</a>
                           <!--  <a id="lr-export" class="btn btn-default" onclick="btn_export()"><i class="fa fa-share-square-o"></i>&nbsp;导出</a> -->
                        </div>
                    </div>
                </div>
                <div class="gridPanel">
                    <table id="gridTable"></table>
                    <div id="gridPager"></div>
                </div>
            </div>
            <div id="ButtonInfo" class="tab-pane" >
                 <div class="titlePanel">
                    <div class="title-search">
                       
                    </div>
                    <div class="toolbar">
                        <div class="btn-group">
                            <a id="lr-add_button" class="btn btn-default" onclick="btn_add_button()"><i class="fa fa-plus"></i>&nbsp;新增</a>
                            <a id="lr-edit_button" class="btn btn-default" onclick="btn_edit_button()"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</a>
                            <a id="lr-delete_button" class="btn btn-default" onclick="btn_delete_button()"><i class="fa fa-trash-o"></i>&nbsp;删除</a>
                        </div>
                    </div>
                </div>
                <div class="gridPanel">
                    <table id="gridButton"></table>
                </div>
            </div>
        </div>
</body>

<script>
    Split(['#title', '#main'], {
      sizes: [15, 85],
      minSize: 200,
      gutterSize: 3,
      cursor: 'col-resize',
      onDrag:function(){
        $(window).resize();
      }
    })

</script>
</html>
<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, tencheer)
</script>
