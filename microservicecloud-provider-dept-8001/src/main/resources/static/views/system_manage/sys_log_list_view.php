<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>系统日志</title>
    <!--框架必需start-->
    <!--<script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>-->
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

    <script src="/statics/scripts/utils/base/tencheer.base.js"></script>
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

    <style>
        body {
            margin: 5px;
            margin-bottom: 0px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
    
<script>
    var columnJson=[];
    var grid_active=$("#gridTable");
    var system_type="1";
    $(document).ready(function () {
        InitControl();
        initialPage();
        $('#date_begin').datetimepicker({lang:'ch',step:5,format:"Y-m-d H:i:s"});
        $('#date_end').datetimepicker({lang:'ch',step:5,format:"Y-m-d H:i:s"});
        $.datetimepicker.setLocale('ch');//设置中文
    });
    function InitControl(){
        var gridTable=$("#gridTable");
        columnJson=tencheer.CreateGridTable(gridTable,'sys_log_list');
        gridTable.setGridParam({  
            gridComplete: function () {
                $(this).SetTbBgcolor();
            }
         });
        $('#gridTable').setGridWidth(($('.gridPanel').width() -2));
        $("#gridTable").setGridHeight($(window).height() - 160);
        
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
        //查询事件
        $("#btn_Search").click(function () {
            var colSearch="";
            $(".ui-search-input input").each(function(i){
                var columnCode=$(this).attr("name");
                var columnType=tencheer.getColumnType(columnJson,columnCode);
                if ($(this).val()!=""){
                   if (columnType=="日期型") 
                       colSearch+=" and to_char("+$(this).attr("name") +", 'YYYY-MM-DD HH24:MI:SS') like '☻"+$(this).val()+"☻'";
                   if (columnType=="数值型")
                       colSearch+=" and to_char("+$(this).attr("name") +",'999D99S') like '☻"+$(this).val()+"☻'";
                   if (columnType=="字符型")
                       colSearch+=" and "+$(this).attr("name") +" like '☻"+$(this).val()+"☻'";
                }
             });
            gridTable.jqGrid('setGridParam', {
                postData: {
                    condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                    keyword: $("#txt_Keyword").val(),
                    begindate:$("#date_begin").val(),
                    enddate:$("#date_end").val(),
                    columnsearch:colSearch,
                }
            }).trigger('reloadGrid');
        });
        
        //查询回车事件
        $('#txt_Keyword,.ui-search-input input').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
        //清除条件
        $("#btn_Clear").click(function () {
            $("#txt_Keyword").val("");
            $("#date_begin").val("");
            $("#date_end").val("");
            $(".ui-search-input input").each(function(i)
            {
                $(this).val("");
            });
        });
        

    }
    //重设(表格)宽高
    function initialPage() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridTable').setGridWidth(($('.gridPanel').width() -2));
                $("#gridTable").setGridHeight($(window).height() - 160);
            }, 200);
            e.stopPropagation();
        });
    }
    function formatData(cellValue,colName,options, rowObject){
        if (colName=="check_status")
        {
            return cellValue=="1" ? "已审核" : "未审核";
        }

        return cellValue;
    }
</script>

<div class="titlePanel">
    <div class="title-search">
        <table style="width:100%">
            <tr>
                <td>
                    <label for="txt__date" style="padding-left: 10px;text-align: right">查询时间:  </label>
                </td>
                <td>
                    <input type="text" style="width: 160px;margin-left: 5px" class="form-control input-sm" id="date_begin"  placeholder="开始时间">
                </td>
                <td>
                    <label for="txt_date" style="padding: 0px 5px;text-align: right">至</label>
                </td>
                <td>
                    <input type="text" style="width: 160px;padding-left: 5px;margin-left: 5px" class="form-control input-sm" id="date_end"  placeholder="截止时间">
                </td>

                <td style="padding-left: 5px;">
                    <a id="btn_Search" class="btn btn-primary"><i class="fa fa-search"></i>&nbsp;查询</a>
                </td>
                <td style="padding-left:5px;">
                    <a id="btn_Clear" class="btn btn-primary"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;清除</a>
                </td>
            </tr>
        </table>
    </div>
    <div class="toolbar">
        <!--<div class="btn-group">-->
        <!--<a id="btn_save" class="btn btn-success"  style="font-size: 11px"><i class="fa fa-plus" style="color: #fff"></i>&nbsp;审核</a>-->
        <!--</div>-->
    </div>
</div>
<div class="gridPanel">
        <div id="myTabContent" class="tab-content">
             <div class="tab-pane fade in active" id="gridList">
                    <table id="gridTable"></table>
                    <div id="gridPager"></div>
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
