<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>角色管理</title>
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

    <script>
        var keyValue = request('keyValue');
        var organizeId = request('organizeId');
        $(function () {
            initControl();
        })
        //初始化控件
        function initControl() {
            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/role_manage/GetFormJson",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        $("#form1").SetWebControls(data);
                    }
                });
            }
        }
        //保存表单
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").GetWebControls(keyValue);
            tencheer.saveForm({
                url: "/system_manage/role_manage/SaveForm?keyValue=" + keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                    tencheer.currentIframe().$("#gridTable").trigger("reloadGrid");
                }
            })
        }
    </script>
    <div style="margin-left: 10px; margin-top: 20px; margin-right: 30px;">
        <table class="form">
            <tr>
                <td class="formTitle">角色编号<font face="宋体">*</font></td>
                <td class="formValue">
                    <input id="role_no" type="text"  class="form-control" placeholder="系统生成" readonly="true" />
                </td>
            </tr>
            <tr>
                <td class="formTitle">角色名称<font face="宋体">*</font></td>
                <td class="formValue">
                    <input id="role_name" type="text" onblur="$.ExistField(this.id,'/base_manage/role_manage/ExistFullName')" class="form-control" placeholder="请输入名称" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
            <tr>
                <th class="formTitle" style="height: 37px;"></th>
                <td class="formValue">
                    <div class="checkbox">
                        <label>
                            <input id="status" type="checkbox" checked="checked" />
                            有效
                        </label>
                    </div>
                </td>
            </tr>
            <tr>
                <th class="formTitle" valign="top" style="padding-top: 4px;">角色描述
                </th>
                <td class="formValue">
                    <textarea id="remark" class="form-control" style="height: 70px;"></textarea>
                </td>
            </tr>
        </table>
    </div>
</form>
</body>
</html>
