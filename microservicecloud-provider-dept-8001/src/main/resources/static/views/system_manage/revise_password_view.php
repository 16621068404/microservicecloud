<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>重置密码</title>
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
    <link href="/statics/styles/tencheer-ui.css?" rel="stylesheet"/>
    <script src="/statics/scripts/plugins/validator/validator.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
</head>
<body>
<form id="form1">

    <script src="/statics/scripts/plugins/jquery.md5.js"></script>
    <script>
        var keyValue = tencheer.request('keyValue');
        $(function () {
            $("#user_logid").val(tencheer.request('user_logid'));
            $("#user_name").val(tencheer.request('user_name'));
        })
        //保存事件
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").getWebControls(keyValue);
            postData["Password"] = $.md5($.trim($("#Password").val()));
            tencheer.saveForm({
                url: "/system_manage/user_manage/SaveRevisePassword?keyValue=" + keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                }
            })
        }
    </script>
    <div style="margin-top: 20px; margin-right: 30px;">
        <table class="form">
            <tr>
                <td class="formTitle">姓名</td>
                <td class="formValue">
                    <input id="user_name" readonly type="text" class="form-control" />
                </td>
            </tr>
            <tr>
                <td class="formTitle">帐户</td>
                <td class="formValue">
                    <input id="user_logid" readonly type="text" class="form-control" />
                </td>
            </tr>
            <tr>
                <th class="formTitle">新密码<font face="宋体">*</font>
                </th>
                <td class="formValue">
                    <input id="Password" type="password" class="form-control" placeholder="请输入新密码" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
        </table>
    </div>
</form>
</body>
</html>
