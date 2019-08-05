<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>调试日志查看</title>
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
    <link href="/statics/scripts/plugins/split/split.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/split/split.js"></script>
  <style>
  html, body {
    height: 100%;
  }
  body {
    padding: 5px;
    padding-bottom: 2px;
    background-color: #F6F6F6;
    box-sizing: border-box;
    
  }
  #bottomTools{position: fixed;bottom: 5px;left: 5px;background-color: rgba(245, 241, 241, 0.2);border-radius: 0px 0px 6px 6px;padding: 1px;}
  </style>
</head>
<body>
    <div id="title" class="split split-horizontal content">
        <div id="itemTree"></div>
    </div>
    <div id="main" class="split split-horizontal content">
        
    </div>
    <div id="bottomTools" class="toolbar">
        <div class="btn-group">
            <a id="lr_download_log" class="btn btn-default" onclick="download_log()"><i class="fa fa-plus-circle"></i>&nbsp;下载日志</a>
            <a id="lr_remove_log" class="btn btn-default" onclick="remove_log()"><i class="fa fa-times-circle"></i>&nbsp;删除日志</a>
        </div>   
    </div>
</body>

<script>
    Split(['#title', '#main'], {
      sizes: [20, 80],
      gutterSize: 5,
      cursor: 'col-resize',
      onDrag:function(){
         $(window).resize();
      }
    })
    $(function () {
        InitialPage();
        GetTree();
    });
    function InitialPage(){
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                 $("#itemTree").setTreeHeight($("#title").height());
            }, 200);
            e.stopPropagation();
        });
        $(window).resize();
    }
        //加载树
    var _parentId = "";
    function GetTree() {
        var item = {
            height: $(window).height() - 52,
            url: "/system_manage/log_manage/debug_log_treejson",
            isAllExpand:false,
            onnodeclick: function (item) {
                 _parentId=item.id;
                 show_log(item.id);
            }
        };
        //初始化
        $("#itemTree").treeview(item);
    }
    function show_log(logname){
        $.SetForm({
                url: "/system_manage/log_manage/get_debug_log?log_name="+logname,
                success: function (data) {
                    var content="";
                    $.each(data, function (i) {
                        content+=data[i]+"<br />";
                    })
                    $("#main").html(content);
                }
            });
    }
    function remove_log()
    {
         $.ajax({
                url: '/system_manage/log_manage/remove_log',
                type: 'post',
                data: 'log_name='+_parentId,
                success: function(result){
                     GetTree();
                }
            });
    }
    function download_log()
    {
        var $form = $("<form id='downfile' method='post' action='" + "/system_manage/log_manage/download_log' style='display:none;'>");
        var $input = $("<input type='hidden' name='log_name' value='" + _parentId + "'>");
        $("body").append($form);
        $form.append($input).submit();
    }
</script>
</html>
<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, tencheer)
</script>
