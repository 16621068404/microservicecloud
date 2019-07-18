$(function() {
	// 电话特殊格式
//	$("[data-mask]").inputmask();
	getMenu();
	getInfo();
	$('#menuSideBar').css(
			'height',
			$(window).height() - $('#titleLogo').height()
					- $('#navTop').height() - $('#booterBottom').height());
	$('#menuSideBar').css('overflow-y', "auto");
});

var addTabs = function(obj) {
	id = "myiframe";
	changeSize(id);
	$('#myiframe').attr("src", obj.url);
	if($(window).width() <768){
		$(".sidebar-toggle").trigger("click");
	}
};

function changeSize(id) {
	var heightValue = 0;
	if ($(window).width() > 768) {
		heightValue = $(window).height() - 6;
	} else {
		heightValue = $(window).height() - 66;
	}
	$('#' + id).attr('height', heightValue);
}
var menu;
var getMenu = function() {
	$
			.ajax({
				type : "post",
				url : "../menu",
				data : {
					"method" : "getMainMenuListByweixin"
				},
				dataType : "json",
				async : false,
				success : function(result) {
					if (result.status == "error") {
						location.href = result.path;
					} else {

						var text = result.data;
						var menuHtml = "";
						menuHtml += '<ul class="treeview-menu menu-open" style="display: block;">';
						menuHtml += '<li class="treeview" style="display:none"><a id="home" href="#" onclick="changeSize(\'myiframe\')" url="firstpages/firstpage-default.html"></a></li>';
						menuHtml += '<li><a href="#" onclick="addTabs({\'url\':\'firstpages/firstpage-default.html\',\'close\':\'true\'})">返回首页</a></li>'
						for (var i = 0; i < text.length; i++) {
							menuHtml += '<li><a  href="#" onclick="addTabs({\'id\':\''
									+ text[i].iframeid
									+ '\',\'title\':\''
									+ text[i].name
									+ '\',\'url\':\''
									+ text[i].link
									+ '\',\'close\':\'true\',\'pageId\' : \''
									+ text[i].menuid
									+ '\' })" >'
									+ text[i].name + '</a></li>';
						}
						menuHtml += '</ul>';
						$(".sidebar-menu").append(menuHtml);
					}
					menu = result;
				},
			});

}

var logout = function() {
	lwalert("tipModal", 2, "你确定要注销吗?", "isSure()");
}

function isSure() {
	window.location.href = "../user?method=logout";
}
var compId;
var userId;
var employeeId;
var getInfo = function() {
	$.ajax({
		type : "POST",
		url : "../user",
		data : {
			"method" : "getInfo",
		},
		dataType : "text",
		async : false,
		success : function(text) {
			var tempText = $.parseJSON(text)
			$("#user").html(tempText.userName);
			if (tempText.url != "") {

				$("#img").html(
						'<img src="' + tempText.url.substring(1)
								+ '" class="img-circle">');
				$("#userInfo").html(
						"用户名:" + tempText.userName + "<br>登录时间:<br>"
								+ tempText.loginTime + "<br>下次续费时间:90天");
				$("#compInfo")
						.html(
								"<font color='white'>公司:" + tempText.compName
										+ "<br>姓名:" + tempText.employeeName
										+ "</font>");
				$("#userImg").html(
						'<img src="' + tempText.url.substring(1)
								+ '" class="user-image">');
			} else {
				$("#img").html();
				$("#userInfo").html(
						"用户名:" + tempText.userName + "<br>登录时间:<br>"
								+ tempText.loginTime + "<br>距下次续费时间:90天");
				$("#compInfo")
						.html(
								"<font color='white'>公司:" + tempText.compName
										+ "<br>姓名:" + tempText.employeeName
										+ "</font>");
			}

			compId = tempText.compId;
			userId = tempText.userId;
			employeeId = tempText.employeeId;
		}
	});

}

var ope = "update";
var showCompany = function() {
	$('#compModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	getCompanyById(compId);
}
function getCompanyById(compId) {
	$.ajax({
		type : "get",
		url : "../company?method=getCompanyById",
		data : {
			"compid" : compId
		},
		dataType : "json",
		async : false,
		success : function(text) {
			setFormValue(text.companyBean);
			$('#compModal').modal({
				backdrop : 'static',
				keyboard : false
			});
			com.leanway.formReadOnly("companyForm");
		}
	});
}

com.leanway.getCodeMap("company", "type","1","#compantPropertyId", "-----所有制性质-----");
com.leanway.getCodeMap("company", "type","2","#companyTypeId", "-----所有制性质-----");
com.leanway.getCodeMap("company", "type","3","#companyRelationId", "-----所有制性质-----");
 
// 初始化表单
function setFormValue(data) {

	var json = eval("(" + data + ")");
	var tempType = json.type;
	if (tempType.length == 6) {
		var compantPropertyVal = tempType.substring(0, 2);
		var companyRelationVal = tempType.substring(2, 4);
		var companyTypeVal = tempType.substring(4, 6);

		$('#compantPropertyId').val(parseInt(compantPropertyVal));
		$('#companyRelationId').val(parseInt(companyRelationVal));
		$('#companyTypeId').val(parseInt(companyTypeVal));
	}

	for ( var key in json) {
		 $("#" + key).val(json[key]);
//		$("#companyForm" + "  input[name=" + key + "]").val(json[key]);
//		$("#companyForm" + "  select[name=" + key + "]").val(json[key]);

	}

	hide();
}

var hide = function() {


	$('#fileInputDivId').hide();

}




function showEditUser() {

	ope = "update";

	$("#myModalLabel").html("用户信息");
	// 获取数据
	getUser(userId);
}
function resetPassword() {

	$('#passwordModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	// 获取数据
}

// 加载用户数据
function getUser(userId) {
	$.ajax({
		type : "POST",
		url : "../user?method=getUser",
		data : {
			"userId" : userId
		},
		dataType : "text",
		async : false,
		success : function(text) {

			// 表单赋值
			setUserFormValue(text, userId);

			$('#myModal').modal({
				backdrop : 'static',
				keyboard : false
			});
			// 显示
			// $("#myModal").modal("show");
			com.leanway.formReadOnly("userForm");
		}
	});

}

function setUserFormValue(data, userId) {
	resetUserFrom();

	var json = eval("(" + data + ")")

	for ( var item in json) {

		if (item != "password") {
			// $("#" + item).val(json[item]);
			$("#userForm" + "  input[name=" + item + "]").val(json[item]);
		}
	}
}

function resetUserFrom() {
	$('#userForm').each(function(index) {
		$('#userForm')[index].reset();
	});
}

var flag = false;
var resetUserPassword = function() {
	var password = $("#password").val();
	var repassword = $("#repassword").val();
	if (password != repassword) {
		lwalert("tipModal", 1, "两次输入密码不一致！");
	} else {
		if (flag) {
			if ($.trim(password) != "" && password.length > 0) {
				password = $.md5(password);
			}
			$.ajax({
				type : "POST",
				url : "../user?method=resetPassword",
				data : {
					"password" : password,
					"userId" : userId,
				},
				dataType : "text",
				async : false,
				success : function(text) {

					if ($.trim(text) == "1") {
						$("#oldpassword").val("")
						$("#password").val("")
						$("#repassword").val("")
						$('#passwordModal').modal('hide');
					} else {
						// alert("操作失败");
						lwalert("tipModal", 1, "操作失败！");
					}

				}
			});
		}
	}
}

var checkPassword = function() {
	var password = $("#oldpassword").val()
	if ($.trim(password) != "" && password.length > 0) {
		password = $.md5(password);
	}

	$.ajax({
		type : "POST",
		url : "../user?method=checkPassword",
		data : {
			"password" : password,
			"userId" : userId,
		},
		dataType : "text",
		async : false,
		success : function(text) {

			if ($.trim(text) == "1") {
				flag = true;
			} else {
				lwalert("tipModal", 1, "原密码输入错误！");
			}

		}
	});
}


function showEditEmployee() {

	ope = "update";

	$("#empModalLabel").html("员工信息");
	// 获取数据
	getEmployeeById(employeeId);
}

var getEmployeeById = function(employeeid) {
	$.ajax({
		type : "get",
		url : "../employee",
		data : {
			method : "queryEmployeeById",
			conditions : '{"employeeid":"' + employeeid + '"}'
		},
		dataType : "text",
		success : function(data) {
			var json = eval("(" + data + ")").resultObj;
			setEmpFormValue(json);

			$('#empModal').modal({
				backdrop : 'static',
				keyboard : false
			});

			com.leanway.formReadOnly("employeeForm");
		},
		error : function(data) {

		}
	});
}

// 自动填充表单数据（页面id须与bean保持一致）
function setEmpFormValue(data) {
	resetPageForm();
	for ( var item in data) {
		$("#employeeForm" + "  input[name=" + item + "]").val(data[item]);
		$("#employeeForm" + "  select[name=" + item + "]").val(data[item]);
	}

	// 给select2赋初值
	var deptId = data.deptid;
	if (deptId != null && deptId != "" && deptId != "null") {
		$("#deptid")
				.append(
						'<option value=' + deptId + '>' + data.department
								+ '</option>');
		// $("#deptid").select2("val", [ deptId ]);
	}

	// 给select2赋初值
	var compId = data.compid;
	if (compId != "" && compId != null && compId != "null") {
		$("#compid").append(
				'<option value=' + compId + '>' + data.compname + '</option>');
		// $("#compid").select2("val", [ compId ]);
	}
}

function resetPageForm() {
	$('#employeeForm')[0].reset(); // 清空表单
	$("#deptid, #compid").val(null).trigger("change"); // select2值给清空
	$("#province, #city, #country").empty(); // 清空select
	// $("#employeeForm").data('bootstrapValidator').resetForm();
	$("#employeeForm input[type='hidden']").val("");
};

/**
 * 判断是否是微信浏览器
 *
 * @returns {Boolean}
 */
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

function unbind() {
	lwalert("tipModal", 2, "此操作将解绑所有微信账号，确定要解绑吗？", "isSureUnbind()");
}

function isSureUnbind() {
	$("#tipModal").modal("hide");
	if (flag) {
		$
				.ajax({
					type : "post",
					url : "../weixin",
					data : {
						method : "deleteWeixinuserdindByuserid",
					},
					dataType : "json",
					success : function(data) {
						if (data.status == "success") {
							$("#tip").html("解绑成功");
							$("#issure")
									.html(
											"<button type='button' class='btn btn-primary' data-dismiss='modal'>确定</button>");
							$("#tModal").modal("show");
						} else {
							$("#tip").html("解绑失败");
							$("#issure")
									.html(
											"<button type='button' class='btn btn-primary' data-dismiss='modal'>确定</button>");
							$("#tModal").modal("show");
						}
					},
				});
	} else {
		lwalert("tipModal", 1, "原密码错误");
	}
}