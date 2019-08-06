var contentPath = '/';
var _hmt = _hmt || [];


$(function() {
	
	  var hm = document.createElement("script");
	      hm.src = "https://hm.baidu.com/hm.js?71559c3bdac3e45bebab67a5a841c70e";
	  var s = document.getElementsByTagName("script")[0];
	      s.parentNode.insertBefore(hm, s);
	
	$('#password').keyup(function(event) {
		if (event.keyCode == "13") {
			$("#login").trigger("click");
			return false;
		}
	});

	$("#login").on("click", function() {
		submitForm();
	});

	function submitForm() {
		if (navigator.appName == "Microsoft Internet Explorer"
				&& (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0"
						|| navigator.appVersion.split(";")[1].replace(/[ ]/g,
								"") == "MSIE7.0" || navigator.appVersion
						.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0")) {
			alert("您的浏览器版本过低，请使用360安全浏览器的极速模式或IE9.0以上版本的浏览器");
		} else {
			var formData = {
				user_id : $('#username').val(),
				user_password : $('#password').val()
			};
			var user_id = $.trim($("#username").val());
			var user_password = $.trim($("#password").val());
			$.ajax({
						type : 'POST',
						url : '/loginController/login',
						dataType : "json",
						data : {
							user_logid : $.trim(user_id),
							user_logpass : $.trim(user_password)
						},
						success : function(data) {
							
							if (data.code == 200) {
								
								setCookie("token",data.data); 
								window.location.href = 'views/home_manage/admin_pretty_view.html';
							} else {
								$('#myModal').modal();
							}
						},
						error : function() {

						}
					});
		}
	}

	function setCookie(name,value) { 
	    var Days = 30; 
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
	} 

	
	$("#reset").on("click", function() {
		$("#username").val("");
		$("#password").val("");
	});
});
