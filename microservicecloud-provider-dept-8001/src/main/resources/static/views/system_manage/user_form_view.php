<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>用户管理</title>
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
        <script src="/statics/scripts/plugins/my97datepicker/WdatePicker.js"></script>
</head>
<body>
<form id="form1">
    <script>
        var keyValue = request('keyValue');
        $(function () {
           initControl();
        })
        //初始化控件
        function initControl() {
            //加载角色
            // $("#role_no").ComboBox({
            //     url: "/base_manage/role_manage/GetListJson",
            //     id: "F_RoleId",
            //     text: "F_FullName",
            //     description: "==请选择==",
            //     height: "200px",
            //     allowSearch: true
            // });
            //部门
              $("#depart_no").ComboBox({
                 url: "/system_manage/department_manage/GetDepartDropdownList",
                 id: "depart_no",
                 text: "depart_name",
                 description: "==请选择部门==",
                 height: "200px",
                 allowSearch: true
             });
            //性别
            $("#user_sex").ComboBox({
                description: "==请选择==",
            });
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/user_manage/GetFormJson",
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
            $.SaveForm({
                url: "/system_manage/user_manage/SaveForm",
                param: { "keyValue": keyValue, "UserEntity":postData },
                close:false,
                loading: "正在保存数据...",
                success: function (data) {
                    $.currentIframe().$("#gridTable").trigger("reloadGrid");
                    dialogClose();
                }
            })
        }
    </script>
    <div style="margin-left: 10px; margin-right: 10px;">
<!--        <ul class="nav nav-tabs">-->
<!--            <li class="active"><a href="#BaseInfo" data-toggle="tab">基本信息</a></li>-->
<!--        </ul>-->
        <div class="tab-content" style="padding-top: 15px;">
            <div id="BaseInfo" class="tab-pane active" style=" padding-right: 30px;">
                <table class="form">
                    <tr>
                        <td class="formTitle">员工编号</td>
                        <td class="formValue">
                            <input id="user_no" type="text" class="form-control" readonly="true" placeholder="系统生成"/>
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
                        <td class="formTitle">员工姓名<font face="宋体">*</font></td>
                        <td class="formValue">
                            <input id="user_name" type="text" class="form-control" placeholder="请输入姓名" errormsg="员工姓名" isvalid="yes" checkexpession="NotNull" />
                        </td>
                        <td class="formTitle">性别</td>
                        <td class="formValue">
                            <div id="user_sex" type="select" class="ui-select">
                                <ul>
                                    <li data-value="1">男</li>
                                    <li data-value="0">女</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                     <tr>
                        <td class="formTitle">出生日期</td>
                        <td class="formValue">
                            <input id="user_birthday" type="text" class="form-control input-wdatepicker" onfocus="WdatePicker()" />
                        </td>
                        <td class="formTitle">入职日期</td>
                        <td class="formValue">
                            <input id="work_start_date" type="text"  class="form-control input-wdatepicker" onfocus="WdatePicker()" />
                        </td>
                    </tr>
                    
                   
                    <tr>
                        <td class="formTitle">电话</td>
                        <td class="formValue">
                            <input id="user_tel" type="text" class="form-control" />
                        </td>
                        <td class="formTitle">手机</td>
                        <td class="formValue">
                            <input id="user_mobile" type="text" class="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <td class="formTitle">微信</td>
                        <td class="formValue">
                            <input id="user_wechat" type="text" class="form-control" />
                        </td>
                        <td class="formTitle">QQ</td>
                        <td class="formValue">
                            <input id="user_qq" type="text" class="form-control" />
                        </td>
                    </tr>
                    <tr>
                        <td class="formTitle">账号</td>
                        <td class="formValue">
                            <input id="user_logid" type="text"  onblur="$.ExistField(this.id,'ExistAccount')" class="form-control" placeholder="请输入账户" isvalid="yes"  />
                        </td>
                        <td class="formTitle">密码</td>
                        <td class="formValue">
                            <input id="user_logpass" type="text" readonly="true" class="form-control" placeholder="初始密码123,请及时修改密码"  />
                        </td>
                    </tr>   
                    <tr>
                        <td class="formTitle">邮箱</td>
                        <td class="formValue">
                            <input id="user_email" type="text" class="form-control" />
                        </td>
                        <td class="formTitle">部门</td>
                        <td class="formValue">
                            <div id="depart_no" type="select" class="ui-select" errormsg="部门" isvalid="yes" checkexpession="NotNull" placeholder="部门"></div>
<!--                            <input id="depart_no" type="text" class="form-control"/>-->
                        </td>
                    </tr>
                    <tr>
                        <!-- <td class="formTitle">货主名称</td>
                        <td class="formValue">
                            <input id="custom_name" type="text" class="form-control" />
                        </td> -->
                        <td class="formTitle">家庭住址</td>
                        <td class="formValue" >
                            <input id="user_address" type="text" class="form-control" /></td>
                        </td>
                    </tr>
                    <tr>
                        <th class="formTitle" valign="top" style="padding-top: 4px;">备注
                        </th>
                        <td class="formValue" colspan="3">
                            <textarea id="remark" class="form-control" style="height: 90px;"></textarea>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</form>
</body>
</html>

<script>
    $(function () {
        tencheer.childInit();
    })
</script>