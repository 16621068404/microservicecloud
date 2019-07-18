
var login = function () {
	var userName = $("#userName").val();
	var password = $("#password").val();
	
	if ($.trim(userName) == "") {
		$("#userName").focus();
		return;
	}
	
	if ($.trim(password) == "") {
		$("#password").focus();
		return;
	}
	
	var url;
	var main_url;
		url = "http://127.0.0.1:8001/loginController/login";
		main_url	="../lnui/mes/main2.html";
	$.ajax ( {
			type : "get",
			url : url,
			data : {
				"userName" : userName,
				"password" : password
				//"code":code
			},
			dataType : "text",
			async : false,
			success : function (json) {
			var date = JSON.parse(json);	
				if ( date.code == 200) {
					 location.href =main_url;
				} else {
					lwalert("tipModal", 1, date.msg);
				}
			}
		});
}

