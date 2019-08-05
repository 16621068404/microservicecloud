<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Form</title>
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
    <link href="/statics/scripts/plugins/wizard/wizard.css" rel="stylesheet"/>
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

</head>
<body>
<form id="form1">

    <script type="text/javascript">
        var keyValue = request('keyValue');
        var menu_id = request('menu_id');
        $(function () {
            initControl();
            $('[tabindex="1"]').focus();
        })
        //初始化控件
        function initControl() {
            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/button_manage/GetFormJson",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        console.log(data);
                        $("#form1").setWebControls(data);
                    }
                });
            } 
            $('input,textarea,select').keyup(function(e){
                if (e.keyCode == 13) {
                    var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
                    if (nextElement.length){
                        nextElement.focus();
                    }
                    else
                    {
                        $('[tabindex="1"]').focus();
                    }
                
                }

            });
        }
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").GetWebControls(keyValue);
            postData["menu_id"]=menu_id;
            $.SaveForm({
                url: "/system_manage/button_manage/SaveForm?keyValue=" + keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                    tencheer.currentIframe().$("#gridButton").trigger("reloadGrid");
                }
            })
        }
        //选取图标
        function SelectIcon() {
            dialogOpen({
                id: "SelectIcon",
                title: '选取图标',
                url: '/system_manage/main_frame/icon?ControlId=button_icon',
                width: "1000px",
                height: "600px",
                btn: false
            })
        }
    </script>
    <div style="margin-top: 10px; margin-right: 30px;">
        <input id="button_id" type="hidden"/>
            <table class="form">
<!--                <tr>
                    <th class="formTitle">上级</th>
                    <td class="formValue">
                        <div id="F_ParentId" type="selectTree" class="ui-select">
                        </div>
                    </td>
                </tr>-->
                <tr>
                    <th class="formTitle">编号<font face="宋体">*</font></th>
                    <td class="formValue">
                        <input id="button_code" type="text" class="form-control" placeholder="请输入编号" isvalid="yes" checkexpession="NotNull" />
                    </td>
                </tr>
                <tr>
                    <th class="formTitle">名称<font face="宋体">*</font></th>
                    <td class="formValue">
                        <input id="button_name" type="text" class="form-control" placeholder="请输入名称" isvalid="yes" checkexpession="NotNull" />
                    </td>
                </tr>
                <tr>
                        <th class="formTitle">图标</th>
                        <td class="formValue">
                            <input id="button_icon" type="text" class="form-control" />
                            <span class="input-button" onclick="SelectIcon()" title="选取图标">...</span>
                        </td>
                </tr>
                <tr>
                    <th class="formTitle">排序<font face="宋体">*</font></th>
                    <td class="formValue">
                        <input id="sort_code" type="text" class="form-control" placeholder="请输入排序" isvalid="yes" checkexpession="Num" />
                    </td>
                </tr>
                <tr>
                    <th class="formTitle">地址</th>
                    <td class="formValue">
                        <input id="action_address" type="text" class="form-control" />
                    </td>
                </tr>
                <tr >
                    <th class="formTitle" valign="top" style="padding-top: 4px;">备注
                    </th>
                    <td class="formValue">
                        <textarea id="remark" class="form-control" style="height: 80px;">
                        </textarea>
                    </td>
                </tr>
                <tr>
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
            </table>
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
