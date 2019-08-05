<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>分类管理</title>
    <!--框架必需start-->

    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>

    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="/statics/scripts/bootstrap/bootstrap.extension.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>

    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>

    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
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
    <!--2017-07-05-->
<form id="form1">

    <script>
        var keyValue = request('keyValue');
        var parentId = request('parentId');
        $(function () {
            initControl();
        })
        //初始化控件
        function initControl() {
            //上级
            $("#ParentId").ComboBoxTree({
                url: "/system_manage/dataitem_manage/GetDataItemTreeJson",
                description: "==请选择==",
                height: "230px",
            });

            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/dataitem_manage/GetDataItemFormJson",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        $("#form1").SetWebControls(data);
                    }
                });
            } else {
                $("#ParentId").ComboBoxTreeSetValue(parentId);
            }
        }
        //保存表单
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").GetWebControls(keyValue);
            if (postData["ParentId"] == "") {
                postData["ParentId"] = 0;
            }
            $.SaveForm({
                url: "/system_manage/dataitem_manage/SaveDataItemForm?keyValue=" + keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                    top.DataItemSort.$("#gridTable").resetSelection();
                    top.DataItemSort.$("#gridTable").trigger("reloadGrid");
                }
            })
        }
    </script>
    <div style="margin-top: 20px; margin-right: 30px;">
        <table class="form">
            <tr>
                <th class="formTitle">上级</th>
                <td class="formValue">
                    <div id="ParentId" type="selectTree" class="ui-select"></div>
                </td>
            </tr>
            <tr>
                <td class="formTitle">名称<font face="宋体">*</font></td>
                <td class="formValue">
                    <input id="ItemName" type="text" onblur="$.ExistField(this.id,'/system_manage/dataitem_manage/ExistItemName')" class="form-control" placeholder="请输入名称" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
            <tr>
                <td class="formTitle">编号<font face="宋体">*</font></td>
                <td class="formValue">
                    <input id="ItemCode" type="text" onblur="$.ExistField(this.id,'/system_manage/dataitem_manage/ExistItemCode')" class="form-control" placeholder="请输入编号" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
            <tr>
                <th class="formTitle">排序<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="SortCode" type="text" class="form-control" isvalid="yes" checkexpession="Num" />
                </td>
            </tr>
            <tr>
                <th class="formTitle" style="height: 37px;"></th>
                <td class="formValue">
                    <div class="checkbox">
                        <label>
                            <input id="IsTree" type="checkbox" />
                            树型
                        </label>
                        <label>
                            <input id="EnabledMark" type="checkbox" checked="checked" />
                            有效
                        </label>
                    </div>
                </td>
            </tr>
            <tr>
                <th class="formTitle" valign="top" style="padding-top: 4px;">备注
                </th>
                <td class="formValue">
                    <textarea id="Description" class="form-control" style="height: 70px;"></textarea>
                </td>
            </tr>
        </table>
    </div>
</form>
</body>
</html>
