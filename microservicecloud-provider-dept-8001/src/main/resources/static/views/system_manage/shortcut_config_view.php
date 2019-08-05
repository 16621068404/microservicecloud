<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>快捷菜单配置</title>
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
    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>

    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
     <script src="/statics/scripts/plugins/tree/tree.js"></script>   
<body>

<script>
    var userId = request('userId');
    $(function () {
//        initialPage();
        GetModuleTree(false);
    })
        //获取系统功能
    function GetModuleTree(AllExpand) {
        var item = {
            height: 536,
            showcheck: true,
            url: "/system_manage/authorize_manage/ShortCutMenuTreeJson?isAllExpand="+AllExpand,
            isAllExpand:AllExpand,
        };
        $("#itemTree").treeview(item);
    }
   function ExpandAll(){
       if ($("#cbExpandAll").is(":checked")) {
           GetModuleTree(true);
       }
       else
       {
           GetModuleTree(false);
       }
   }
   
    //保存事件
    function AcceptClick() {
        Loading(true, "正在提交数据...");
        window.setTimeout(function () {
            var selectModuleIds = $("#itemTree").getCheckedNodes();
            $.SaveForm({
                url: "/system_manage/shortcut_manage/SaveForm?selectModuleIds="+selectModuleIds,
                param: null,
                loading: "正在保存数据...",
                success: function () {
                    parent.refershClientData();
                }
            })
        }, 200);
    }
</script>
<form id="form1" style="margin:1px">
    <div class="panel-Title" ><input type="checkbox"  onchange="ExpandAll()" id="cbExpandAll" value="1">全部展开</div>
    <div id="itemTree" class="border" style="height: 240px; overflow: auto;">
    </div>
</form>
</body>
</html>

<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, window.tencheer)
</script>
