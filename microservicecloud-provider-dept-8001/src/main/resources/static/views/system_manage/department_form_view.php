<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>部门管理</title>
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
    <div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
    </div>
    <form id="form1">
        
<script>
    var keyValue = request('keyValue');
    $(function () {
        initControl();
    })
    //初始化控件
    function initControl() {
        //获取表单
        if (!!keyValue) {
            $.SetForm({
                url: "/system_manage/department_manage/GetFormJson",
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
        postData["F_Manager"] = $("#F_ManagerId").attr('data-text');
        $.SaveForm({
            url: "/system_manage/department_manage/SaveForm?keyValue=" + keyValue,
            param: postData,
            loading: "正在保存数据...",
            success: function () {
                $.currentIframe().$("#gridTable").resetSelection();
                $.currentIframe().$("#gridTable").trigger("reloadGrid");
            }
        })
    }
</script>
<div style="margin-left: 10px; margin-top: 20px; margin-right: 30px;">
    <table class="form">
        <tr>
            <th class="formTitle">部门编号</th>
            <td class="formValue">
                <input id="depart_no" type="text" class="form-control" placeholder="系统生成" readonly="true"/>
            </td>
            <th class="formTitle">状态</th>
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
            <th class="formTitle">部门名称<font face="宋体">*</font></th>
            <td class="formValue">
                <input id="depart_name" type="text"  class="form-control" placeholder="请输入名称" isvalid="yes" checkexpession="NotNull" />
            </td>
            <th class="formTitle">负责人</th>
            <td class="formValue">
                <input id="depart_leader" type="text" class="form-control" />
            </td>

        </tr>
        <tr>
            <th class="formTitle">电话号</th>
            <td class="formValue">
                <input id="depart_tel" type="text" class="form-control" />
            </td>
            <th class="formTitle">传真</th>
            <td class="formValue">
                <input id="depart_fax" type="text" class="form-control" />
            </td>
        </tr>
        <tr>
            <th class="formTitle">邮箱</th>
            <td class="formValue"  colspan="3">
                <input id="depart_email" type="text" class="form-control" />
            </td>
            
        </tr>
        <tr>
            <th class="formTitle" valign="top" style="padding-top: 4px;">介绍
            </th>
            <td class="formValue" colspan="3">
                <textarea id="depart_content" class="form-control" style="height: 50px;"></textarea>
            </td>
        </tr>
        <tr>
            <th class="formTitle" valign="top" style="padding-top: 4px;">备注
            </th>
            <td class="formValue" colspan="3">
                <textarea id="remark" class="form-control" style="height: 70px;"></textarea>
            </td>
        </tr>
    </table>
</div>
    </form>
</body>
</html>
<script>
    $(function () {
        tencheer.childInit();
    })
</script>
