var iCheck = false;


/**
 * 配合login.html实现各种功能
 */
$(function() {


	$("#saveUserInfo").click(function(){

	    if(!window.localStorage && $(this).is(':checked')){
	    	 lwalert('浏览器版本过低，请升级浏览器！');
	    }

	});

	$("#userName").change(function(){
		loadCompany($(this).val());
	});

//	var userName = window.localStorage.username;
//
//	if (userName != null && userName != undefined && typeof(userName) != "undefined" && userName != "" && window.localStorage) {
//
//		$("#userName").val(window.localStorage.username);
//		var check = $("#saveUserInfo").prop("checked");
//		//TODO 勾上CHECKBOX
//		$("#saveUserInfo").prop("checked", true);
//	}
	if (window.localStorage && window.localStorage.isCheck && window.localStorage.isCheck != "false") {
		loadCompany(window.localStorage.username);
		$("#userName").val(window.localStorage.username);
		$("#companyid").val(window.localStorage.companyid);;
		$("#saveUserInfo").prop("checked", true);
	}

	/*
	 * Fullscreen background
	 */
	// $.backstretch("images/login/1.jpg");
	/*
	 * Form validation
	 */

	$(window).keydown(function (e) {
		if (e.keyCode == 13) {
			login();
		}
	});

/*	$(
			'.login-form input[type="text"], .login-form input[type="password"], .login-form textarea')
			.on('focus', function() {
				$(this).removeClass('input-error');
			});*/

/*	$('#loginForm').on(
			'submit',
			function(e) {

				$(this).find(
						'input[type="text"], input[type="password"], textarea')
						.each(function() {
							if ($(this).val() == "") {
								e.preventDefault();
								$(this).addClass('input-error');
								("#password").val("");
							} else {
								$(this).removeClass('input-error');
							}
						});

				$("#password").val($.md5($('#password').val()));

			});*/


	// 调用方法
	//$("#code").val(GetQueryString("code"))
});




//function GetQueryString(name)
//{
//     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if(r!=null)return  unescape(r[2]); return null;
//}


function generateQRCode(rendermethod,url) {

    $("#qrcode").qrcode({
        render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
        text: url, //内容
        height : 128,
        width : 128
    });
}
function init() {
    //获取地址栏地址
    var str=location.href;
    if(str.lastIndexOf("/")!=-1){
        str = str.substring(0,str.lastIndexOf("/"));
    }
    var url = str+$("#barcode").val();
    $("#qrcode").html("");
    if($("#barcode").val()!=""){
        generateQRCode("canvas",url);
        $("#qrcode").append("<div><a href='"+url+"' class='btn btn-primary'>download</a></div>");
    }else{
        $("#qrcode").html("");
    }
}

var loadCompany = function ( userName ) {

	if(userName==""||userName==null||userName=="undefined"||userName==undefined){
		userName = $("#userName").val();
	}

	$.ajax ( {
		type : "post",
		url : "../../"+ln_project+"/company",
		data : {
			"method" : "getCompanyByUserWsInterface",
			"userName" : userName
		},
		dataType : "json",
		async : false,
		success : function ( text ) {
			var html = "";

			 if (text != null && text.length > 0 ) {

				 if (text.length > 1) {
					 html += '<option value="">请选择登录企业</option>';
				 }

				 for (var i = 0; i < text.length ; i ++) {

					 html += '<option value="' + text[i].compid + '">' + text[i].compname + '</option>';
				 }

			 } else {
				 html += '<option value="">请选择登录企业</option>';
			 }

			 $("#companyid").html(html);

		}
	});

}

var login = function () {

	var userName = $("#userName").val();

	var password = $("#password").val();

	var companyid = $("#companyid").val();

	var openId = $("#openId").val();
	//var code = $("#code").val();
	if ($.trim(userName) == "") {
		$("#userName").focus();
		return;
	}
	if ($.trim(password) == "") {
		$("#password").focus();
		return;
	}

	if ($.trim(companyid) == "") {
		$("#companyid").focus();
		return;
	}

	var url ;
	var main_url;
	if(isWeiXin()){

		url="../../"+ln_project+"/user?method=bind";
		main_url	="../lnui/"+ln_page+"/mobi_main.html";
	}else{
		url="../../"+ln_project+"/user?method=login";
		main_url	="../lnui/"+ln_page+"/main2.html";
	}
	$.ajax ( {
			type : "POST",
			url : url,
			data : {
				"userName" : userName,
				"password" : $.md5(password),
				"openId":openId,
				"compId" : companyid,
				//"code":code
			},
			dataType : "text",
			async : false,
			success : function ( text ) {
				var tempText=$.parseJSON(text)
				if (tempText.info  == "success") {

                    var check = $("#saveUserInfo").prop("checked");

					if (window.localStorage && check) {

						 window.localStorage.username= $("#userName").val();
						 window.localStorage.companyid = companyid;
						 window.localStorage.isCheck= true;

					}else{
						window.localStorage.isCheck= false;
					}

					 location.href =main_url;
					//
				} else {
					lwalert("tipModal", 1, tempText.status);
				}

			}
		});



}
/**
 * 判断是否是微信浏览器
 * @returns {Boolean}
 */
function isWeiXin(){
	var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			return true;
		}else{
			return false;
		}
}
/**
 * 判断申请账户的公司是正式还是非正式
 */
function isOfficial(){
    $.ajax ( {
        type : "POST",
        url : "../../"+ln_project+"/company",
        data : {
            "method" : "querySystemConfigWsInterface",
        },
        dataType : "text",
        async : false,
        success : function ( text ) {
            var tempText=$.parseJSON(text)
            console.info(tempText);
            if (tempText.configvalue  == "1") {

                location.href ="../lnui/"+ln_page+"/register.html";                //
            } else {
                location.href ="../lnui/"+ln_page+"/testregister.html";
            }

        }
    });


}