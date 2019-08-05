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
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
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
        .sortable li span { position: absolute; margin-left: -24px; margin-top: -2px;}
        .badge{color:#224d74;background-color: rgba(255, 255, 255, 0.24);}
  </style>
<script>
    var grid_id=tencheer.request("grid_id");  
    var cust_no = tencheer.request('cust_no');
    $(function () {
       $( ".sortable" ).sortable();
       if (!!grid_id) {
            $.SetForm({
                url:"/system_manage/grid_column_manage/Grid_ColumnList?grid_id=" + escape(grid_id)+"&cust_no="+cust_no,
                success: function (data) {
                    loadSystemDefault(data);
                }
            });
        } 
    });
    function loadSystemDefault(data){  
        var i=0;
        $(data).each(function(){
            
            var name=this.column_id;
            var label=this.column_name;
            if(label==undefined || label=="" || label==null){  
                    label=this.column_code; 
               }  
            if (this.is_show=="1"){
                i++;
                $(".sort_spec_text").append("<li data-value='" + name + "'  class= 'active' title='" + label + "'><a>" + label + "</a><i><span class='badge pull-right'>"+i+"</span></i></li>");
            }
            else
            {
                $(".sort_spec_text").append("<li data-value='" + name + "' title='" + label + "'><a>" + label + "</a><i><span class='badge pull-right'></span></i></li>");
            }
            
        });
//        $(".sort_spec_text li").addClass("active");
        $(".sort_spec_text li").click(function () {
            if (!!$(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active").siblings("li");
            }
            refershSort();
        });
        $(".sort_spec_text li").mousemove(function(){
            refershSort();
        })
        
    }
    function refershSort(){
        var i=0;
        $('.sort_spec_text li').each(function () {
            if (!!$(this).hasClass("active")) {
                i++;
                $(this).find(".badge").html(i);
            }
            else
            {
                 $(this).find(".badge").html('');
            }
        })
    }
    //确定导出
    function AcceptClick() {     
        fieldArray=new Array();
        $('.sort_spec_text li').each(function () {
            var value = $(this).attr('data-value');
            var title=$(this).attr('title');
            
            field=new Object();
            field.name=value;
            field.label=title;
            if (!!$(this).hasClass("active")) {
                field.value=$(this).find(".badge").html();
            }
            else
            {
               field.value='1000';
            }
            fieldArray.push(field);
        });
        tencheer.saveForm({
            url: "/system_manage/grid_column_manage/save_sort_config",
            param: {fieldJson:JSON.stringify(fieldArray),grid_id:grid_id,cust_no:cust_no},
            loading: "正在进行保存操作...",
            success: function (data) {
                tencheer.getIframe("column_list").$("#gridcolumnTable").resetSelection();
                tencheer.getIframe("column_list").$("#gridcolumnTable").trigger("reloadGrid");
                tencheer.dialogClose();
                
            }
        })

    }
    function ActiveAll(){
       if ($("#cbActiveAll").is(":checked")) {
           $(".sort_spec_text li").addClass("active");
       }
       else
       {
           $(".sort_spec_text li").removeClass("active");
       }
       refershSort();
    }
       
</script>
</head>
<body>
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>    
<div class="row" id="layout" style="height: 100%; width: 100%;">
    <div class="col-sm-12" style="border-left:1px solid #d0c1be;padding: 0;height:100%;">
        <div class="alert alert-danger" style="margin-bottom: 5px; border-radius: 0px;padding:3px 0 3px 0px ">
            <i class="fa fa-question-circle" style="position: relative; top: 1px; font-size: 15px; padding-right: 0px;"></i>
            <font>注：请拖动排序以及勾选需要跳转的字段</font>
            <span><input type="checkbox" style="margin-left:160px;font-size: 40px" checked="checked" onchange="ActiveAll()" id="cbActiveAll" value="1">全部选择</span>
        </div>
        <div style="overflow:auto">
            <ul class="sort_spec_text sortable">
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
