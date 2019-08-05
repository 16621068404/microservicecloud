<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>角色权限</title>
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

    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/wizard/wizard.css?v=20161127" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/wizard/wizard.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/plugins/tree/tree.js"></script>
    <script src="/statics/scripts/plugins/validator/validator.js"></script>
    <script src="/statics/scripts/plugins/wizard/wizard.js"></script>
    <script src="/statics/scripts/plugins/datetime/pikaday.js"></script>

</head>
<body>
<form id="form1">

    <script type="text/javascript">
        var ObjectId=request('ObjectId');
        var Category=request('Category');
//        console.log('Category:'+Category);
//         console.log('ObjectId:'+ObjectId);
        $(function () {
            initialPage();
            GetModuleTree();
//            GetModuleButtonTree();
//            GetModuleColumnTree();
//            GetOrganizeTree();
            
        })
        //初始化页面
        function initialPage() {
            //加载导向
            $('#wizard').wizard().on('change', function (e, data) {
                var $finish = $("#btn_finish");
                var $next = $("#btn_next");
                if (data.direction == "next") {
                    if (data.step == 1) {
                        var ModuleId = $("#ModuleTree").getCheckedAllNodes();
                        for (var i = 0; i < ModuleId.length; i++) {
                            var $thisid = $("#ModuleButtonTree").find('ul').find('[data-value=' + ModuleId[i] + ']').parent().parent();
                            $thisid.show();
                            $thisid.parents('ul').find('.' + ModuleId[i]).parent().show();
                        }
                    }
                    if (data.step == 2) {
                        var ModuleId = $("#ModuleTree").getCheckedAllNodes();
                        for (var i = 0; i < ModuleId.length; i++) {
                            var $thisid = $("#ModuleColumnTree").find('ul').find('[data-value=' + ModuleId[i] + ']').parent().parent();
                            $thisid.show();
                            $thisid.parents('ul').find('.' + ModuleId[i]).parent().show();
                        }
                        $finish.removeAttr('disabled');
                        $next.attr('disabled', 'disabled');
                    }
                } else {
                    $finish.attr('disabled', 'disabled');
                    $next.removeAttr('disabled');
                }
                
            });
            
//            //数据权限 、点击类型触发事件
//            $("input[name='authorizeType']").click(function () {
//                var value = $(this).val();
//                if (value == -5) {
//                    $("#OrganizeTreebackground").hide();
//                    //$("#OrganizeTree").find('a,span,i').css({ color: '#000' });
//                } else {
//                    $("#OrganizeTreebackground").show();
//                    //$("#OrganizeTree").find('a,span,i').css({ color: '#d0d0d0' });
//                }
//            })
            buttonOperation();
        }
        //获取系统功能
        function GetModuleTree() {
            var item = {
                isexpand:false,
                height: $(window).height() -100,
                showcheck: true,
                url: "/system_manage/authorize_manage/ModuleTreeJson?itemType=1&objectId=" + ObjectId + "&category="+Category
            };
            $("#ModuleTree").treeview(item);

//            TreeviewExpandCollapseAll();
        }
        //获取系统按钮
        function GetModuleButtonTree() {
            var item = {
                height: 500,
                showcheck: true,
                url: "/system_manage/authorize_manage/ModuleButtonTreeJson?roleId=" + ObjectId
            };
            $("#ModuleButtonTree").treeview(item);
            $("#ModuleButtonTree").find('.bbit-tree-node-el').hide();
        }
        //获取系统视图
        function GetModuleColumnTree() {
            var item = {
                height: 500,
                showcheck: true,
                url: "/system_manage/authorize_manage/ModuleColumnTreeJson?roleId=" + ObjectId
            };
            $("#ModuleColumnTree").treeview(item);
            $("#ModuleColumnTree").find('.bbit-tree-node-el').hide();
        }
        //获取组织架构
        function GetOrganizeTree() {
            $.ajax({
                url: "/system_manage/authorize_manage/OrganizeTreeJson?roleId=" + ObjectId,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    var $treeJson = data.treeJson;
                    var $authorizeType = data.authorizeType;
                    var $authorizeData = data.authorizeData;
                    var item = {
                        height: 330,
                        showcheck: true,
                        data: JSON.parse($treeJson),
                    };
                    $("#OrganizeTree").treeview(item);
                    $("input[name='authorizeType'][value=" + $authorizeType + "]").trigger("click");
                    $("#OrganizeTree").find('li.bbit-tree-node').each(function () {
                        var $li = $(this);
                        $li.css({ position: 'relative' });
                        var _data_value = $li.find('a').find('span').attr('data-value');
                        var _html = '<div style="position: absolute;right: 0px;top:4px;z-index: 1;"><div class="checkbox">';
                        _html += '<label><input name="' + _data_value + '" type="checkbox" value="1" />只读</label>';
                        _html += '</div></div>';
                        $li.append(_html);
                    });
                    $.each($authorizeData, function (i) {
                        var row = $authorizeData[i]
                        var resourceId = row.F_ResourceId;
                        var IsRead = row.F_IsRead;
                        if (IsRead == 1) {
                            $("input[name='" + resourceId + "']").attr("checked", true);
                        }
                    });
                }
            });
        }
        //按钮操作（上一步、下一步、完成、关闭）
        function buttonOperation() {
            var $last = $("#btn_last");
            var $next = $("#btn_next");
            var $finish = $("#btn_finish");
            //完成提交保存
            $finish.click(function () {
                var postData = $("#form1").GetWebControls();
                postData["ObjectId"] = ObjectId;
                postData["Category"] = Category;
                postData["moduleIds"] = String($("#ModuleTree").getCheckedAllNodes());
                postData["moduleButtonIds"] = String($("#ModuleButtonTree").getCheckedAllNodes());
                postData["moduleColumnIds"] = String($("#ModuleColumnTree").getCheckedAllNodes());
                $.SaveForm({
                    url: "/system_manage/authorize_manage/SaveAuthorize",
                    param: postData,
                    loading: "正在保存功能授权...",
                    success: function () {
                        $.currentIframe().$("#gridTable").trigger("reloadGrid");
                    }
                })
            })
        }
    /*
    * 树展开收缩方法 2010-03-23 PM By WQY
    * treeViewId: 树对象
    * expandAll: 展开或收缩
    */
    var expandAll=true;
    function TreeviewExpandCollapseAll() {
        
        if (expandAll===true)
        {
            $("#ModuleTree").find(".bbit-tree-node-ct").css("display","none");
             expandAll=false;
            $("#ModuleTree").find("img.bbit-tree-elbow-minus").each(function () {
                $(this).addClass("bbit-tree-elbow-plus");
                $(this).removeClass("bbit-tree-elbow-minus");
            })
        }
        else
        {
             $("#ModuleTree").find(".bbit-tree-node-ct").css("display","");
              expandAll=true;
             $("#ModuleTree").find("img.bbit-tree-elbow-plus").each(function () {
                $(this).addClass("bbit-tree-elbow-minus");
                $(this).removeClass("bbit-tree-elbow-plus");
            })
        }
    }
    </script>
    <div class="widget-body">
        <div id="wizard" class="wizard" data-target="#wizard-steps" style="border-left: none; border-top: none; border-right: none;">
            <ul class="steps">
                <li data-target="#step-1" class="active"><span class="step">1</span>系统功能<span class="chevron"></span></li>
<!--                <li data-target="#step-2"><span class="step">2</span>系统按钮<span class="chevron"></span></li>
                <li data-target="#step-3"><span class="step">3</span>系统视图<span class="chevron"></span></li>-->
<!--                <li data-target="#step-4"><span class="step">4</span>数据权限<span class="chevron"></span></li>-->
            </ul>
        </div>
        <div class="step-content" id="wizard-steps" style="border-left: none; border-bottom: none; border-right: none;">
            <div class="step-pane active" id="step-1">
                <div id="ModuleTree" style="margin: 10px;"></div>
            </div>
            <div class="step-pane" id="step-2">
                <div id="ModuleButtonTree" style="margin: 10px;"></div>
            </div>
            <div class="step-pane" id="step-3">
                <div id="ModuleColumnTree" style="margin: 10px;"></div>
            </div>
        </div>
    </div>

    <div class="form-button" id="wizard-actions">
        <!--<a id="btn_test"  style="padding-left: 2px" class="btn btn-default btn-prev" onclick="TreeviewExpandCollapseAll()">收缩</a>-->
<!--        <a id="btn_last" disabled class="btn btn-default btn-prev">上一步</a>
        <a id="btn_next" class="btn btn-default btn-next">下一步</a>-->
        <a id="btn_finish"  class="btn btn-success">完成</a>
    </div>
</form>
</body>
</html>
<script>
    $(function () {
        tencheer.childInit();
    })
</script>
