<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>个人信息</title>
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
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
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
<div id="ajaxLoader" style="cursor: progress; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: #f1f1f1; z-index: 10000; overflow: hidden;">
</div>
<script src="/statics/scripts/plugins/jquery.md5.js"></script>
<script src="/statics/scripts/plugins/uploadify/ajaxfileupload.js"></script>
<script src="/statics/scripts/plugins/cookie/jquery.cookie.js"></script>
<script>
    var keyValue =top.tencheer.login_user_data.user_no;
    $(function () {
        InitialPage();
        InitControl();
        RevisePasswordPanel();
        Individuation();
         tencheer.ajaxLoading(false);
    });
    //初始化数据
    function InitControl() {
        tencheer.setForm({
            url: "/system_manage/user_manage/GetFormJson",
            param: { keyValue: keyValue },
            success: function (data) {
                if (data != null) {
                    $("#layout").setWebControls(data);
                    if (data.pic_url) {
                        document.getElementById('uploadPreview').src = top.contentPath + data.pic_url;
                    }
                    console.log("data.skin_type:"+data.skin_type);
                    if (data.skin_type){
                        $("#UItheme").val(data.skin_type)
                    }
                }
            }
        });
    }
    //初始化页面
    function InitialPage() {
        //layout布局
        $('#layout').layout({
            applyDemoStyles: true,
            onresize: function () {
                $(window).resize()
            }
        });
        $('.profile-nav').height($(window).height() - 20);
        $('.profile-content').height($(window).height() - 20);
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('.profile-nav').height($(window).height() - 20);
                $('.profile-content').height($(window).height() - 20);
            }, 200);
            e.stopPropagation();
        });
        $('#uploadFile').change(function () {
            var f = document.getElementById('uploadFile').files[0];
            var src = window.URL.createObjectURL(f);
            document.getElementById('uploadPreview').src = src;
            var data = new FormData();
            data.append('upload_file', f);
            $.ajax({
                url:'/system_manage/person_center/UploadFile',
                type:'POST',
                data:data,
                cache: false,
                contentType: false,    
                processData: false,    
                success:function(data){
                    console.log(data);
                }
            });
            //上传用户图像
        });
    }
    //侧面切换显示/隐藏
    function profileSwitch(id) {
        $(".profile-content").find('.flag').hide();
        $(".profile-content").find("#" + id).show();
        if (id == 'SystemLog') {
            GetSystemLogGrid();
        }
    }
    //修改密码
    function RevisePasswordPanel() {
        var chePassword = false;
        $("#VerifyCodeImag").click(function () {
            $("#VerifyCode").val('');
            $("#VerifyCodeImag").attr("src", "/Login/VerifyCode?time=" + Math.random());
        })
        $("#OldPassword").blur(function () {
            $("#OldPassword").parent().find('div').html("");
            if ($(this).val() == "") {
                return false;
            }
            $.ajax({
                url: "/system_manage/person_center/ValidationOldPassword",
                data: { OldPassword: $(this).val() },
                type: "post",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.type == 1) {
                        chePassword = true;
                        $("#OldPassword").parent().find('div').html("<div class=\"form-succeed-text\">" + data.message + "</div>")
                    } else {
                        $("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">" + data.message + "</div>")
                    }
                }
            });
        });
        $("#NewPassword").blur(function () {
            $("#NewPassword").parent().find('div').html("");
            if ($(this).val() == "") {
                return false;
            }
            if ($(this).val() == $("#OldPassword").val()) {
                $("#NewPassword").parent().find('div').html("<div class=\"form-error-text\">新密码不能与旧密码相同</div>")
            } else {
                $("#NewPassword").parent().find('div').html("<div class=\"form-succeed-text\"></div>")
            }
        });
        $("#RedoNewPassword").blur(function () {
            $("#RedoNewPassword").parent().find('div').html("")
            if ($(this).val() == "") {
                return false;
            }
            if ($(this).val() != $("#NewPassword").val()) {
                $("#RedoNewPassword").parent().find('div').html("<div class=\"form-error-text\">您两次输入的密码不一致！</div>")
            } else {
                $("#RedoNewPassword").parent().find('div').html("<div class=\"form-succeed-text\"></div>")
            }
        });
        $("#VerifyCode").blur(function () {
            $(".VerifyCodemsg").html("")
            if ($(this).val() == "") {
                return false;
            }
        });
        //提交
        $("#btn_RevisePassword").click(function () {
            var OldPassword = $("#OldPassword").val();
            var NewPassword = $("#NewPassword").val();
            var RedoNewPassword = $("#RedoNewPassword").val();
            var VerifyCode = $("#VerifyCode").val();
            if (OldPassword == "") {
                $("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">请输入登陆密码</div>");
                return false;
            }
            if (NewPassword == "") {
                $("#NewPassword").parent().find('div').html("<div class=\"form-error-text\">请输入新密码</div>");
                return false;
            }
            if (RedoNewPassword == "") {
                $("#RedoNewPassword").parent().find('div').html("<div class=\"form-error-text\">请输入重复新密码</div>");
                return false;
            }
            if (VerifyCode == "") {
                $(".VerifyCodemsg").html("<div class=\"form-error-text\">请输入验证码</div>");
                return false;
            }
            if (!chePassword) {
                $("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">原密码错误，请重新输入</div>");
                return false;
            }
            var postData = {
                password: $.md5($("#NewPassword").val()),
                oldPassword: $.md5($("#OldPassword").val()),
                verifyCode: $("#VerifyCode").val()
            }
            $.ajax({
                url: "/system_manage/person_center/SubmitResetPassword",
                data: postData,
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.type == 1) {
                        alert(data.message)
                        top.location.href = "/login";
                    } else {
                        $("#VerifyCodeImag").trigger("click");
                        $(".VerifyCodemsg").val('');
                        $(".VerifyCodemsg").html("<div class=\"form-error-text\">" + data.message + "</div>");
                    }
                    Loading(false);
                }
            });
            
        })
    }
    //个性化设置
    function Individuation() {
        $("#btn_Individuation").click(function () {
            $.ajax({
                    url: "/system_manage/person_center/save_uitheme",
                    data: { uitheme_type: $("#UItheme").val() },
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        top.location.href = "/main";
                    }
             });
        })
    }
    function SaveContactPanel() {
            var postData ={
                keyValue:keyValue,
                user_mobile:$("#user_mobile").val(),
                user_tel : $("#user_tel").val(),
                user_email : $("#user_email").val(),
                user_qq: $("#user_qq").val(),
                user_wechat: $("#user_wechat").val(),
                user_address: $("#user_address").val()
            };
            console.log(postData);
            $.ajax({
                url: "/System_manage/user_manage/SaveContactPanel",
                data: postData,
                type: "post",
                dataType: "json",
                success: function (data) {
                    dialogMsg(data.message, 0);
                }
            });
        }

</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-west">
        <div class="west-Panel">
            <div class="profile-nav">
                <ul style="padding-top: 20px;">
                    <li class="active" onclick="profileSwitch('BaseInfo')">基本信息</li>
                    <li onclick="profileSwitch('ContactInfo')">联系方式</li>
                    <li onclick="profileSwitch('MyheadIcon')">我的头像</li>
                    <li onclick="profileSwitch('RevisePassword')">修改密码</li>
                    <li onclick="profileSwitch('Individuation')">风格设置</li>
<!--                    <div class="divide"></div>
                    <li onclick="profileSwitch('SystemLog')">系统日志</li>-->
                </ul>
            </div>
        </div>
    </div>
    <div class="ui-layout-center">
        <div class="center-Panel">
            <div class="profile-content" style="background: #fff;">
                <div id="BaseInfo" class="flag">
                    <div class="title">
                        基本信息
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle">账户</td>
                            <td class="formValue">
                                <input id="user_logid" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
<!--                        <tr>
                            <td class="formTitle">工号</td>
                            <td class="formValue">
                                <input id="F_EnCode" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>-->
                        <tr>
                            <td class="formTitle">姓名</td>
                            <td class="formValue">
                                <input id="user_name" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">性别</td>
                            <td class="formValue">
                                <div class="radio">
                                    <label>
                                        <input name="user_sex" type="radio" checked="checked" value="1" />
                                        男
                                    </label>
                                    <label>
                                        <input name="Gender" type="radio" value="0" />
                                        女
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">公司</td>
                            <td class="formValue">
                                <input id="branch_no" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">部门</td>
                            <td class="formValue">
                                <input id="depart_no" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">角色</td>
                            <td class="formValue">
                                <input id="F_RoleName" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle" valign="top" style="padding-top: 4px;">自我介绍</td>
                            <td class="formValue">
                                <textarea id="F_Description" class="form-control input-profile" style="height: 70px;"></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="ContactInfo" class="flag" style="display: none;">
                    <div class="title">
                        联系方式
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle">手机</td>
                            <td class="formValue">
                                <input id="user_mobile" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">电话</td>
                            <td class="formValue">
                                <input id="user_tel" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">邮箱</td>
                            <td class="formValue">
                                <input id="user_email" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">微信</td>
                            <td class="formValue">
                                <input id="user_wechat" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">QQ</td>
                            <td class="formValue">
                                <input id="user_qq" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">住址</td>
                            <td class="formValue">
                                <input id="user_address" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle"></td>
                            <td class="formValue">
                                <br />
                                <a class="btn btn-primary" onclick="SaveContactPanel()"><i class="fa fa-save"></i>&nbsp;保&nbsp;存</a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="MyheadIcon" class="flag" style="display: none;">
                    <div class="title">
                        我的头像
                    </div>
                    <div style="width: 300px;">
                        <div style="margin-top: 40px; text-align: center;">
                            
                            <div class="file" style="width: 100px; height: 100px;">
                                <img id="uploadPreview" style="width: 100px; height: 100px; border-radius: 100px;" src="/statics/images/logo-headere47d5.png" />
                                <input type="file" name="uploadFile" id="uploadFile">
                            </div>

                            <div style="margin-top: 30px; line-height: 14px; color: #75777A; text-align: center;">
                                建议上传图片尺寸为100x100，大小不超过2M。
                            </div>
                        </div>
                    </div>
                </div>
                <div id="RevisePassword" class="flag" style="display: none;">
                    <div class="title">
                        修改密码
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle" style="height: 20px;"></td>
                            <td>
                                <p style="color: #959393; padding-left: 8px;">为了保护您的帐号安全，操作前请您进行安全验证</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">旧密码<font face="宋体">*</font></td>
                            <td class="formValue">
                                <input id="OldPassword" type="password" class="form-control input-profile" style="float: left;" />
                                <div style="width: 300px; float: left"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">新密码<font face="宋体">*</font></td>
                            <td class="formValue">
                                <input id="NewPassword" type="password" class="form-control input-profile" style="float: left;" />
                                <div style="width: 300px; float: left"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">重复新密码<font face="宋体">*</font></td>
                            <td class="formValue">
                                <input id="RedoNewPassword" type="password" class="form-control input-profile" style="float: left;" />
                                <div style="width: 300px; float: left"></div>
                            </td>
                        </tr>
<!--                        <tr>
                            <td class="formTitle">验证码<font face="宋体">*</font></td>
                            <td class="formValue">
                                <div style="float: left;">
                                    <input id="VerifyCode" maxlength="4" type="text" class="form-control input-profile" style="width: 100px;" />
                                </div>
                                <div style="float: left; width: 200px;display: none">
                                    <img src="/base_manage/person_center/VerifyCode" id="VerifyCodeImag" width="100" height="30" alt="点击切换验证码"
                                         title="点击切换验证码" style="cursor: pointer; padding-top: 2px; padding-left: 5px;" />
                                </div>
                                <div class="VerifyCodemsg" style="width: 300px; float: left"></div>
                            </td>
                        </tr>-->
                        <tr>
                            <td class="formTitle"></td>
                            <td class="formValue">
                                <br />
                                <a id="btn_RevisePassword" class="btn btn-primary"><i class="fa fa-save"></i>&nbsp;提&nbsp;交</a>
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="Individuation" class="flag" style="display: none;">
                    <div class="title">
                        个性化设置
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle">界面风格</td>
                            <td class="formValue">
                                <select id="UItheme" class="form-control input-profile" style="padding: 4px; padding-left: 6px;">
                                    <option value="1">经典版</option>
                                    <option value="2">风尚版</option>
                                    <option value="3">炫动版</option>
                                    <option value="4">飞扬版</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle"></td>
                            <td class="formValue">
                                <br />
                                <a id="btn_Individuation" class="btn btn-primary"><i class="fa fa-save"></i>&nbsp;保&nbsp;存</a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .file {
        position: relative;
        display: inline-block;
        overflow: hidden;
        text-decoration: none;
        text-indent: 0;
        cursor: pointer !important;
    }

    .file input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer !important;
    }

    .file:hover {
        text-decoration: none;
        cursor: pointer !important;
    }
</style>
</body>
</html>
<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, window.tencheer)
</script>

