var keyValue = '';
var editor=null;
var partnerEditor=null;
var time;
var local = '<?php echo base_url(); ?>';
var token;
$(function () {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token");
    InitialPage();
    InitControl();
    tencheer.ajaxLoading(false);
});

// 初始化数据
function InitControl() {
    
    editor = new UE.ui.Editor();
    editor.render("myEditor");
    partnerEditor = new UE.ui.Editor();
    partnerEditor.render("myPartnerApplyEditor");
    tencheer.setForm({
        url: "/system_manage/company_manage/GetFormJson?token="+token,
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

// 初始化页面
function InitialPage() {
    // layout布局
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
    // resize重设(表格、树形)宽高
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
        var form = new FormData(document.getElementById("upform")); 
        $.ajax({
            url:'/system_manage/company_manage/UploadFile?token='+token,
            type:'POST',
            data:form,
            cache: false,
            contentType: false,    
            processData: false,    
            success:function(dataJson){
                console.log('success....');
                var data = JSON.parse(dataJson); 
                if (data.type == "3") {
                    tencheer.dialogAlert({ msg: data.message, type: -1 });
                } else {
                    tencheer.dialogMsg({ msg: data.message, type: 1 });
                    }
            }
        });
        // 上传用户图像
    });
}

// 侧面切换显示/隐藏
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
            url: "/system_manage/company_manage/SaveContent?keyValue=" + keyValue + "&token="+token,
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

