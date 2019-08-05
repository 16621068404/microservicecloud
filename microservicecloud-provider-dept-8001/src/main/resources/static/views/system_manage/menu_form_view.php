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
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>

</head>
<body>
<form id="form1">
    <!--jqgrid表格组件start-->
    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
    <!--表格组件end-->
    <script type="text/javascript">
        $(function() {
            $("#menu_code").attr('tabindex',1);
            $('#menu_name').attr('tabindex',2);
            $('#parent_id').attr('tabindex',3);

            $(":text").focus(function(){
                $(this).css('background','#FFFF66');
            }).blur(function(){
                $(this).css('background','#FFFFFF');
            });
            $("[tabindex]").addClass("TabOnEnter");
            $(document).on("keypress", ".TabOnEnter", function (e) {
                if (e.keyCode == 13) {
                    var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
                    if (nextElement.length){
                        nextElement.focus();
                        nextElement.active();
                    }
                    else
                        $('[tabindex="1"]').focus();
                }
            });
        });
        var keyValue = tencheer.request('keyValue');
        var parent_id = tencheer.request('parent_id');
        $(function () {
            initialPage();
            buttonOperation();
//            getGridButton();
//            getGridView();
        })
        //初始化页面
        function initialPage() {
            initControl();
        }
        //初始化控件
        function initControl() {
            //目标
            $("#menu_type").ComboBox({
                description: "==请选择==",
                height: "200px"
            });
            //上级
            $("#parent_id").ComboBoxTree({
                url: "getAllMenuTreeJson",
                description: "==请选择==",
                height: "195px",
                allowSearch: true
            });
            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url:"/system_manage/menu_manage/EditModule",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        $("#form1").SetWebControls(data);
                    }
                });
            } else {
                $("#parent_id").ComboBoxTreeSetValue(parent_id);
            }
        }
        //选取图标
        function SelectIcon() {
            dialogOpen({
                id: "SelectIcon",
                title: '选取图标',
                url: '/system_manage/main_frame/icon?ControlId=menu_icon',
                width: "1000px",
                height: "600px",
                btn: false
            })
        }
        //保存表单
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").GetWebControls(keyValue);
            if (postData["parent_id"] == "") {
                postData["parent_id"] = 0;
            }
//            postData["moduleButtonListJson"] = JSON.stringify(buttonJson);
//            postData["moduleColumnListJson"] = JSON.stringify(columnJson);

            $.SaveForm({
                url: "SaveModuleForm?keyValue="+keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                    $.currentIframe().$("#gridTable").trigger("reloadGrid");
                }
            })
        }

        //按钮操作（上一步、下一步、完成、关闭）
        function buttonOperation() {
            var $last = $("#btn_last");
            var $next = $("#btn_next");
            var $finish = $("#btn_finish");
            //如果是菜单，开启 上一步、下一步
            $("#IsMenu").click(function () {
                if (!$(this).attr("checked")) {
                    $(this).attr("checked", true)
                    $next.removeAttr('disabled');
                    $finish.attr('disabled', 'disabled');
                } else {
                    $(this).attr("checked", false)
                    $next.attr('disabled', 'disabled');
                    $finish.removeAttr('disabled');
                }
            });
            //完成提交保存
            $finish.click(function () {
                AcceptClick();
            })
        }

    </script>
    <div class="widget-body">
        <div class="step-content" id="wizard-steps" style="border-left: none; border-bottom: none; border-right: none;">
            <div class="step-pane active" id="step-1" style="margin-left: 0px; margin-top: 15px; margin-right: 30px;">
                <table class="form">
                    <tr>
                        <th class="formTitle">编号<font face="宋体">*</font></th>
                        <td class="formValue">
                            <input id="menu_code" type="text" onblur="$.ExistField(this.id,'ExistAccount')" class="form-control" placeholder="请输入编号" isvalid="yes" checkexpession="NotNull" />
                        </td>
                        <th class="formTitle">名称<font face="宋体">*</font></th>
                        <td class="formValue">
                            <input id="menu_name" type="text" class="form-control" placeholder="请输入名称" isvalid="yes" checkexpession="NotNull" />
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle">上级</th>
                        <td class="formValue">
                            <div id="parent_id" type="selectTree" class="ui-select">
                            </div>
                        </td>
                        <th class="formTitle">图标</th>
                        <td class="formValue">
                            <input id="menu_icon" type="text" class="form-control" />
                            <span class="input-button" onclick="SelectIcon()" title="选取图标">...</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle">目标<font face="宋体">*</font></th>
                        <td class="formValue">
                            <div id="menu_type" type="select" class="ui-select" value='iframe' isvalid="yes" errormsg="目标" checkexpession="NotNull">
                                <ul>
                                    <li data-value="iframe">导航菜单</li>
                                    <li data-value="ipage">导航页面</li>
                                </ul>
                            </div>
                        </td>
                        <th class="formTitle">排序<font face="宋体">*</font></th>
                        <td class="formValue">
                            <input id="sort_code" type="text" class="form-control" isvalid="yes" checkexpession="Num" />
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle">地址</th>
                        <td class="formValue" colspan="3">
                            <input id="url_address" type="text" class="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle" style="height: 37px;">选项</th>
                        <td class="formValue">
                            <div class="checkbox user-select">
                                <label>
                                    <input id="is_menu" type="checkbox" />
                                    页面
                                </label>
                                <label>
                                    <input id="enabled_mark" type="checkbox" checked="checked" />
                                    有效
                                </label>
                                <label>
                                    <input id="is_split" type="checkbox" />
                                    分割线
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle" valign="top" style="padding-top: 4px;">描述
                        </th>
                        <td class="formValue" colspan="3">
                            <textarea id="remark" class="form-control" style="height: 70px;"></textarea>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div class="form-button" id="wizard-actions">
        <a id="btn_finish" class="btn btn-success">完成</a>
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