<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>导出Excel数据</title>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="/statics/scripts/bootstrap/bootstrap.extension.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <!--bootstrap组件end-->
    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>
    <script src="/statics/scripts/plugins/layout/jquery.layout.js"></script>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>
    <style>
        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
        .sortable { list-style-type: none;}
        .sortable li { cursor: move ; }
        .sortable li span { position: absolute; margin-left: -1.3em; }
  </style>
<script>
    var frameId=tencheer.request("frameId");
    var gridId = tencheer.request('gridId');
    var grid_id = tencheer.request('grid_id');
    var filename = tencheer.request('filename');
    var exportData=tencheer.request('exportData');
    var columnModel=tencheer.request("columnModel");
    var export_group=tencheer.request("export_group");
    var title=tencheer.request("title");
    var form_type="frame";//frame：主窗　dialog：弹窗
    $(function () {
        console.log(export_group);
//        console.log(JSON.stringify(export_param));
       loadSystemDefault();
       $( ".sortable" ).sortable();
       //保存导出方案
       $("#btn_SaveExport").click(function () {
           var ExportFieldArray=new Array();
           var ExportName=$("#txt_Keyword").val();
            if (ExportName!="" && ExportName!="系统默认"){
                $('.sys_spec_text ').find('li.active').each(function () {
                    var fieldObj=new Object();
                    fieldObj.value = $(this).attr('data-value');
                    fieldObj.title=$(this).attr('title');
                    ExportFieldArray.push(fieldObj);
                });
                var postData={};
                postData["FieldList"]= JSON.stringify(ExportFieldArray);
                postData["ExportName"]=ExportName;
                postData["TableName"]=escape(filename);
                tencheer.saveForm({
                    url: "/system_manage/excel_export_manage/SaveForm",
                    param: postData,
                    loading: "正在保存导出方案...",
                    close :false,
                    success: function (data) {
                        loadExportStyle();
                            return false;
                    }
                });
            }
            else
            {
                tencheer.dialogMsg({ msg: "请填写有效的导出方案名称！", type: 2 });
                $("#txt_Keyword").focus();
            }
        });
        //删除导出方案
       $("#btn_RemoveExport").click(function () {
           var ExportName=$("#txt_Keyword").val();
            if (ExportName!="" && ExportName!="系统默认"){
                var postData={};
                postData["ExportName"]=ExportName;
                postData["TableName"]=escape(filename);
                tencheer.saveForm({
                    url: "/system_manage/excel_export_manage/RemoveForm",
                    param: postData,
                    loading: "正在删除导出方案...",
                    close :false,
                    success: function (data) {
                        loadExportStyle();
                            return false;
                    }
                });
            }
        });
        loadExportStyle();
    });
    function loadSystemDefault(){
        var columnModel=[];
        var frameId=tencheer.tabiframeId();
        columnModel = tencheer.getIframe(frameId).$("#" + gridId).jqGrid('getGridParam', 'colModel');

        if (undefined==columnModel) 
        {
            columnModel=top.Form.$("#" + gridId).jqGrid('getGridParam', 'colModel');
            form_type="dialog";
        }
        if (undefined!=columnModel){
            $.each(columnModel, function (i) {
                var label = columnModel[i].label;
                var name = columnModel[i].name;
                var hidden = columnModel[i].hidden;
                if (!!label && hidden == false) {
                    $(".sys_spec_text").append("<li data-value='" + name + "' title='" + label + "'><a>" + label + "</a><i></i></li>");
                }
            });
            $(".sys_spec_text li").addClass("active");
            $(".sys_spec_text li").click(function () {
                if (!!$(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active").siblings("li");
                }
            });
        }
    }
    //确定导出
    function AcceptClick() {
     if (frameId.length==0) frameId=tencheer.tabiframeId();
        var exportFields=[];
        var fieldLabels=[];
        $('.sys_spec_text ').find('li.active').each(function () {
            var value = $(this).attr('data-value');
            var title=$(this).attr('title');
            exportFields.push(value);
            fieldLabels.push(title);
        });
        if (exportFields.length==0) return;
         var columnJson=[];
         var rowJson=[];
        if (form_type=="frame"){
             columnJson =tencheer.getIframe(frameId).$("#" + gridId).jqGrid('getGridParam', 'colModel');
             rowJson = tencheer.getIframe(frameId).$("#" + gridId).jqGrid('getRowData');
            if (exportData=="selected"){
                //导出选中
                rowJson = tencheer.getIframe(frameId).$("#" + gridId).jqGridRow();
            }
        }
        else
        {
             columnJson =top.Form.$("#" + gridId).jqGrid('getGridParam', 'colModel');
             rowJson = top.Form.$("#" + gridId).jqGrid('getRowData');
                if (exportData=="selected"){
                    //导出选中
                    rowJson = top.Form.$("#" + gridId).jqGridRow();
                }
        }
        console.log(JSON.stringify(rowJson));

        $('#executeexcel').remove();
        var export_url="/system_manage/excel_export_manage/ExecuteExportExcel";
        if (export_group.length>0){
            export_url="/system_manage/excel_export_manage/export_excel_sheet";
        }
        var $form = $("<form id='executeexcel' method='post' action='" + top.contentPath +export_url+ "' style='display:none;'>");
        var $input = $("<input type='hidden' name='columnJson' value='" + JSON.stringify(columnJson) + "'><input type='hidden' name='rowJson' value='" + JSON.stringify(rowJson) + "'><input type='hidden' name='exportField' value='" + String(exportFields)+ "'><input type='hidden' name='fieldLabel' value='" + String(fieldLabels) + "'><input type='hidden' name='grid_id' value='" + grid_id+ "'><input type='hidden' name='filename' value='" + escape(filename) + "'>");
        var $title=$("<input type='hidden' name='title' value='" + escape(filename) + "'>");
        var $export_group=$("<input type='hidden' name='group_column' value='" + escape(export_group) + "'>");
        $("body").append($form);
        $form.append($title);
        $form.append($export_group);
        $form.append($input).submit();
    }
    function ActiveAll(){
       if ($("#cbActiveAll").is(":checked")) {
           $(".sys_spec_text li").addClass("active");
       }
       else
       {
           $(".sys_spec_text li").removeClass("active");
       }
    }
    var dataJson={};
    //加载用户保存的导出方案
    function loadExportStyle(){
        $(".export_style").empty();
        $(".export_style").append('<li class="active" onclick="exportStyleSwitch(\'系统默认\')" class>系统默认</li>');
        tencheer.setForm({
            url: "/system_manage/excel_export_manage/GetExportJsonList?TableName="+escape(filename),
            param: { keyValue: escape(filename) },
            success: function (data) {
                dataJson=data;
                 $.each(data, function (i) {
                    var configName = data[i].config_name;
                    $(".export_style").append('<li onclick="exportStyleSwitch(\''+configName+'\')" class>' + configName + '</li>');
                });
                setExportStyle();
            }
        });
    }
    function setExportStyle(){
        $(".profile-nav li").click(function () {
            $(".profile-nav li").removeClass("active");
            $(".profile-nav li").removeClass("hover");
            $(this).addClass("active");
        }).hover(function () {
            if (!$(this).hasClass("active")) {
                $(this).addClass("hover");
            }
        }, function () {
            $(this).removeClass("hover");
        });
    }
    //切换导出方案
    function exportStyleSwitch(configName){
        $(".sys_spec_text").empty();
        if (configName=="系统默认"){
            loadSystemDefault();
            return false;
        }
        $("#txt_Keyword").val(configName);
        $.each(dataJson, function (i) {
           if (configName == dataJson[i].config_name){
               $(".sys_spec_text").empty();
               var columnModel = JSON.parse(dataJson[i].column_list);
               $.each(columnModel, function (i) {
                   var label = columnModel[i].title;
                   var name = columnModel[i].value;
                   var hidden = columnModel[i].hidden;
                   $(".sys_spec_text").append("<li class='active' data-value='" + name + "' title='" + label + "'><a>" + label + "</a><i></i></li>");
               });
                $(".sys_spec_text li").click(function () {
                    if (!!$(this).hasClass("active")) {
                        $(this).removeClass("active");
                    } else {
                        $(this).addClass("active").siblings("li");
                    }
                });
           }
        });
    }
    
</script>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>    
<div class="row" id="layout" style="height: 100%; width: 100%;">
    <div class="col-sm-2 profile-nav" style="padding:0;border: 1px;height:100%;overflow:auto">
        <ul class="export_style"style="padding-top: 5px;width:100%">
            <li class="active" onclick="exportStyleSwitch('系统默认')" >系统默认</li>
        </ul>
    </div>
    <div class="col-sm-10" style="border-left:1px solid #d0c1be;padding: 0;height:100%;">
        <div>
            <table>
                <tr>
                    <td style="padding-left: 2px;">
                        <input id="txt_Keyword" type="text" class="form-control" placeholder="请输入要保存的导出方案名称" style="width: 200px;" />
                    </td>
                    <td style="padding-left: 5px;">
                        <a id="btn_SaveExport" class="btn btn-default"><i class="fa fa-save"></i>&nbsp;保存方案</a>
                    </td>
                    <td style="padding-left: 5px;">
                        <a id="btn_RemoveExport" class="btn btn-default"><i class="fa fa-remove"></i>&nbsp;删除方案</a>
                    </td>
                </tr>
            </table>            
        </div>
        <div class="alert alert-danger" style="margin-bottom: 5px; border-radius: 0px;padding:3px 0 3px 0px ">
            <i class="fa fa-question-circle" style="position: relative; top: 1px; font-size: 15px; padding-right: 0px;"></i>
            <font>注：请拖动排序以及勾选需要导出的字段!!</font>
            <span><input type="checkbox" style="margin-left:330px;font-size: 40px" checked="checked" onchange="ActiveAll()" id="cbActiveAll" value="1">全部选择</span>
        </div>

        <div style="overflow:auto">
            <ul class="sys_spec_text sortable">
            </ul>
        </div>
    </div>
</div>    
</body>
</html>
<script>
    $(function () {
        tencheer.childInit();
    })
</script>
