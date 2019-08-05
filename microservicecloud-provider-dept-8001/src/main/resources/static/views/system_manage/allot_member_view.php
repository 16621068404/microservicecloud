<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>角色成员</title>
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
            overflow: hidden;
        }
    </style>
</head>
<body>

<script>
    var roleId = request('roleId');
    $(function () {
        InitialPage();
        GetMember();
        //GetTree();
    });
    //初始化页面
    function InitialPage() {
        //layout布局
        $('#layout').layout({
            applyDemoStyles: true,
            west__size: 160,
            spacing_open: 0,
            onresize: function () {
                $(window).resize()
            }
        });
        $(".center-Panel").height($(window).height() - 40)
    }
    //加载树
    var departmentid = "card-box";
    function GetTree() {
        var item = {
            height: $(window).height() - 1,
            url: "/system_manage/department_manage/getDeptTreeJson?roleId=" + roleId,
            onnodeclick: function (item) {
                Loading(true);
                window.setTimeout(function () {
                    if (item.parentnodes == "0") {
                        $(".card-box").show();
                        departmentid = "card-box";
                    } else {
                        $(".card-box").hide();
                        $('.' + item.id).show();
                        departmentid = item.id;
                    }
                    Loading(false);
                }, 200);
            }
        };
        //初始化
        $("#itemTree").treeview(item);
    }
    //加载成员
    function GetMember() {
        $.ajax({
            url: "/system_manage/role_manage/getRoleMember?roleId=" + roleId,
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data)
                var _html = "";
                $.each(data, function (i) {
                    var row = data[i];
                    if (row.isdefault == 0) {
                        var imgName = "UserCard01.png";
                        if (row.Gender == 1) {
                            imgName = "UserCard02.png";
                        }
                        var active = "";
                        if (row.ischeck == 1) {
                            active = "active";
                        }
                        _html += '<div class="card-box ' + row.depart_no + ' ' + active + '">';
                        _html += '    <div class="card-box-img">';
                        _html += '        <img src="' + top.contentPath + '/statics/images/' + imgName + '" />';
                        _html += '    </div>';
                        _html += '    <div id="' + row.UserId + '" class="card-box-content">';
                        _html += '        <p>账户：' + row.Account + '</p>';
                        _html += '        <p>姓名：' + row.User_Name + '</p>';
                        _html += '        <p>部门：' + row.DepartmentName + '</p>';
                        _html += '    </div><i></i>';
                        _html += '</div>';
                    }
                });
                $(".gridPanel").html(_html);
                $(".card-box").click(function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active")
                    } else {
                        $(this).removeClass("active")
                    }
                })
                Loading(false);
            }, beforeSend: function () {
                Loading(true);
            }
        });
        //模糊查询用户（注：这个方法是理由jquery查询）
        $("#txt_TreeKeyword").keyup(function () {
            var value = $(this).val();
            if (value != "") {
                window.setTimeout(function () {
                    $("." + departmentid)
                        .hide()
                        .filter(":contains('" + (value) + "')")
                        .show();
                }, 200);
            } else {
                $("." + departmentid).show();
            }
        }).keyup();
    }
    //保存表单
    function AcceptClick() {
        var userIds = [];
        $('.gridPanel .active .card-box-content').each(function () {
            userIds.push($(this).attr('id'));
        });
        var postData = $("#form1").GetWebControls();
        postData["role_no"] = roleId;
        postData["user_ids"] = String(userIds)
        $.SaveForm({
            url: "/system_manage/role_manage/SaveMember",
            param: postData,
            loading: "正在保存角色成员...",
            success: function () {
                $.currentIframe().$("#gridTable").trigger("reloadGrid");
            }
        })
    }
</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-center">
        <div class="treesearch">
            <input id="txt_TreeKeyword" type="text" class="form-control" style="border-top: none;" placeholder="请输入要查询关键字" />
            <span id="btn_TreeSearch" class="input-query" title="Search"><i class="fa fa-search"></i></span>
        </div>
        <div class="center-Panel" style="margin: 0px; border-right: none; border-left: none; border-bottom: none; background-color: #fff; overflow: auto; padding-bottom: 10px;">
            <div class="gridPanel">
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
