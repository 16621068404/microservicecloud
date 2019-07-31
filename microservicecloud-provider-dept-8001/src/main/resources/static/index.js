
var login = function () {
	var user_logid = $("#user_logid").val();
	var user_logpass = $("#user_logpass").val();
	
	if ($.trim(user_logid) == "") {
		$("#user_logid").focus();
		return;
	}
	
	if ($.trim(user_logpass) == "") {
		$("#user_logpass").focus();
		return;
	}
	
	var url;
	var main_url;
		url = "http://192.168.0.188:8001/loginController/login";
		main_url	="../lnui/mes/main2.html";
	$.ajax ( {
			type : "get",
			url : url,
			data : {
				"user_logid" : user_logid,
				"user_logpass" : user_logpass
				//"code":code
			},
			dataType : "text",
			async : false,
			success : function (json) {
			var date = JSON.parse(json);	
				if ( date.code == 200) {
					 document.cookie = date.date;
					 location.href =main_url;
				} else {
					lwalert("tipModal", 1, date.msg);
				}
			}
		});
}

