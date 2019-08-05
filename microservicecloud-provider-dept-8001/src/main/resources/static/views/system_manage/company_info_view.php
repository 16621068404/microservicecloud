<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>公司信息</title>
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
    <link href="/statics/scripts/plugins/jqgrid/css/jqgrid.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>
    <script src="/statics/scripts/plugins/validator/validator.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
    
    <script src="/statics/scripts/plugins/ueditor/ueditor.config.js"></script> 
    <script src="/statics/scripts/plugins/ueditor/ueditor.all.js"></script> 
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
    var keyValue = '';
    var editor=null;
    var partnerEditor=null;
    var time;
    var local = '<?php echo base_url(); ?>';

    $(function () {
        InitialPage();
        InitControl();
        tencheer.ajaxLoading(false);
    });

    //初始化数据
    function InitControl() {
        
        editor = new UE.ui.Editor();
        editor.render("myEditor");
        partnerEditor = new UE.ui.Editor();
        partnerEditor.render("myPartnerApplyEditor");
        tencheer.setForm({
            url: "/system_manage/company_manage/GetFormJson",
            param: { keyValue: keyValue },
            success: function (data) {
                if (data != null) {
                    $("#layout").setWebControls(data);
                    if (data.cust_logo) {
                        document.getElementById('uploadPreview').src = top.contentPath + data.cust_logo;
                        editor.addListener("ready", function () {
                                // editor准备好之后才可以使用
                                editor.setContent(data.cust_content);
                        });  
                        partnerEditor.addListener("ready", function () {
                                // editor准备好之后才可以使用
                                partnerEditor.setContent(data.partner_apply_content);
                        }); 
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
        $('#txtIntroduction').height($(window).height() - 180);
        $('#txtPartnerApply').height($(window).height() - 180);
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('.profile-nav').height($(window).height() - 20);
                $('.profile-content').height($(window).height() - 20);
                $('#txtIntroduction').height($(window).height() - 180);
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
                url:'/system_manage/company_manage/UploadFile',
                type:'POST',
                data:data,
                cache: false,
                contentType: false,    
                processData: false,    
                success:function(data){
                    console.log('success....');
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

　　function SaveContactPanel(){
        if (!$('#layout').Validform()) {
            return false;
        }
        var postData = $("#layout").GetWebControls(keyValue);
        $.SaveForm({
            url: "/system_manage/company_manage/SaveForm?keyValue=" + keyValue,
            param: postData,
            loading: "正在保存数据...",
            success: function () {

            }
        })
  }

    function SaveContent(){
        $.SaveForm({
            url: "/system_manage/company_manage/SaveContent?keyValue=" + keyValue,
            param: {cust_content:editor.getContent()},
            loading: "正在保存数据...",
            success: function () {

            }
        })
  }
  function SavePartnerApplyContent(){
       $.SaveForm({
            url: "/system_manage/company_manage/SavePartnerApplyContent?keyValue=" + keyValue,
            param: {partner_apply_content:partnerEditor.getContent()},
            loading: "正在保存数据...",
            success: function () {

            }
        })
  }

</script>
<div class="ui-layout" id="layout" style="height: 100%; width: 100%;">
    <div class="ui-layout-west">
        <div class="west-Panel">
            <div class="profile-nav">
                <ul style="padding-top: 20px;">
                    <li class="active" onclick="profileSwitch('BaseInfo')">基本信息</li>
                    <li onclick="profileSwitch('ContactInfo')">联系方式</li>
                    <li onclick="profileSwitch('MyheadIcon')">公司图标</li>
                    <li onclick="profileSwitch('Introduction')">公司简介</li>
                    <li onclick="profileSwitch('PartnerApply')">分销申请</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="ui-layout-center">
        <div class="center-Panel">
            <div class="profile-content" style="background: #fff;">
                <!--基本信息start-->
                <div id="BaseInfo" class="flag">
                    <div class="title">
                        基本信息
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle">公司编号</td>
                            <td class="formValue">
                                <input id="cust_no" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">公司名称</td>
                            <td class="formValue">
                                <input id="cust_name"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">公司属性</td>
                            <td class="formValue">
                                <input id="cust_prop"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">注册地址</td>
                            <td class="formValue">
                                <input id="cust_regadd"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">公司管理员</td>
                            <td class="formValue">
                                <input id="cust_manager"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">网址</td>
                            <td class="formValue">
                                <input id="cust_url"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
<!--                        <tr>
                            <td class="formTitle">注册时间</td>
                            <td class="formValue">
                                <input id="cust_regdate" type="text" class="form-control input-wdatepicker" onfocus="WdatePicker()" />
                                <input id="cust_regdate" readonly type="text" class="form-control input-profile" />
                            </td>
                        </tr>-->
                        <tr>
                            <td class="formTitle">注册资金</td>
                            <td class="formValue">
                                <input id="cust_cash"  type="text" class="form-control input-profile" />
                            </td>
                        </tr>
<!--                        <tr>
                            <td class="formTitle" valign="top" style="padding-top: 4px;">公司简介</td>
                            <td class="formValue">
                                <textarea id="cust_content" class="form-control input-profile" style="height: 70px;"></textarea>
                            </td>
                        </tr>-->
                        <tr>
                            <td class="formTitle"></td>
                            <td class="formValue">
                                <br />
                                <a class="btn btn-primary" onclick="SaveContactPanel()"><i class="fa fa-save"></i>&nbsp;保&nbsp;存</a>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--基本信息end-->

                <!--联系方式start-->
                <div id="ContactInfo" class="flag" style="display: none;">
                    <div class="title">
                        联系方式
                    </div>
                    <table class="form" style="margin-top: 20px;">
                        <tr>
                            <td class="formTitle">手机</td>
                            <td class="formValue">
                                <input id="cust_mobile" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">电话</td>
                            <td class="formValue">
                                <input id="cust_tel" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">传真</td>
                            <td class="formValue">
                                <input id="cust_fax" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">邮箱</td>
                            <td class="formValue">
                                <input id="cust_email" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">微信</td>
                            <td class="formValue">
                                <input id="cust_wechat" type="text" class="form-control input-profile" />
                            </td>
                        </tr>
                        <tr>
                            <td class="formTitle">QQ</td>
                            <td class="formValue">
                                <input id="cust_qq" type="text" class="form-control input-profile" />
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
                <!--联系方式end-->

                <!--公司图标start-->
                <div id="MyheadIcon" class="flag" style="display: none;">
                    <div class="title">
                        公司图标
                    </div>
                    <div style="width: 300px;">
                        <div style="margin-top: 10px; text-align: center;">
                            <div class="file" style="width: 100px; height: 100px;">
                                <img id="uploadPreview" style="width: 100px; height: 100px; border-radius: 100px;" src="/statics/images/logo-headere47d5.png"
                                     onerror="javascript:this.src='/statics/images/logo-headere47d5.png'" />
                                <input type="file" name="uploadFile" id="uploadFile">
                            </div>
                            <div style="margin-top: 30px; line-height: 14px; color: #75777A; text-align: center;">
                                建议上传图片尺寸为100x100，大小不超过2M。
                            </div>
                        </div>
                    </div>
                </div>
                <!--公司图标end-->

                <!--公司简介start-->
                <div id="Introduction" class="flag" style="display: none;">
                    <div class="title">
                        <a class="btn btn-primary"style="margin-bottom: 5px" onclick="SaveContent()"><i class="fa fa-save"></i>&nbsp;保&nbsp;存</a>
                    </div>
                    <div id="txtIntroduction" style="padding-top:5px">
                        <textarea name="key" id="myEditor" style="height:100%;width: 100%"></textarea>
                    </div>
                </div>
                <!--公司简介end-->
                <!--分销申请start-->
                <div id="PartnerApply" class="flag" style="display: none;">
                    <div class="title">
                        <a class="btn btn-primary"style="margin-bottom: 5px" onclick="SavePartnerApplyContent()"><i class="fa fa-save"></i>&nbsp;保&nbsp;存</a>
                    </div>
                    <div id="txtPartnerApply" style="padding-top:5px">
                        <textarea name="key" id="myPartnerApplyEditor" style="height:100%;width: 100%"></textarea>
                    </div>
                </div>
                <!--分销申请end-->
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

    .pay-func {
        background:#f5f5f5;
        display:inline-block;
        text-align: center;
        line-height: 40px;
        height:40px;
        width:60px;
        border:1px solid #ccc;
        cursor: pointer;
        font-size:15px;
    }

    .pay-func:link {text-decoration: none;}
    .pay-func:visited {text-decoration: none;}
    .pay-func:hover {text-decoration: none;}
    .pay-func:active {text-decoration: none;}

    .formValue .fee-type-list {
        cursor: pointer;
        width:100px;
        height:70px;
        float:left;
        border:1px solid #ccc;
        margin-right:15px;
    }

    .fee-type-list .month {
        height:25px;
        font-size:16px;
        line-height:25px;
        height:25px;
        text-align:center;
    }

    .fee-type-list .money {
        margin-top:10px;
        height:35px;
        font-size:18px;
        line-height:30px;
        height:30px;
        text-align:center;
    }

    #alipay {
        display:inline-block;
        text-align:center;
        line-height:40px;
        background:#99d9ea;
        border-radius: 4px;
        width:120px;
        height:40px;
        font-size:14px;
        border:1px solid #99d9ea;
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
