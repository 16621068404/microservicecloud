var roleId = request('roleId');
var token;
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	InitialPage();
	GetMember();
	// GetTree();
});
// 初始化页面
function InitialPage() {
	// layout布局
	$('#layout').layout({
		applyDemoStyles : true,
		west__size : 160,
		spacing_open : 0,
		onresize : function() {
			$(window).resize()
		}
	});
	$(".center-Panel").height($(window).height() - 40)
}
// 加载树
var departmentid = "card-box";
function GetTree() {
	var item = {
		height : $(window).height() - 1,
		url : "/system_manage/department_manage/getDeptTreeJson?roleId="
				+ roleId,
		onnodeclick : function(item) {
			Loading(true);
			window.setTimeout(function() {
				if (item.parentnodes == "0") {
					$(".card-box").show();
					departmentid = "card-box";
				} else {
					$(".card-box").hide();
					$('.' + item.id).show();
					departmentid = item.id;
				}
				Loading(false);
			}, 200);
		}
	};
	// 初始化
	$("#itemTree").treeview(item);
}
// 加载成员
function GetMember() {
	$.ajax({
		url : "/system_manage/role_manage/getRoleMember?roleId=" + roleId+"&token="+token,
		type : "get",
		dataType : "json",
		async : false,
		success : function(data) {
			console.log(data)
			var _html = "";
			$.each(data, function(i) {
				var row = data[i];
				if (row.isdefault == 0) {
					var imgName = "UserCard01.png";
					if (row.gender == 1) {
						imgName = "UserCard02.png";
					}
					var active = "";
					if (row.ischeck == 1) {
						active = "active";
					}
					_html += '<div class="card-box ' + row.depart_no + ' '
							+ active + '">';
					_html += '    <div class="card-box-img">';
					_html += '        <img src="' + top.contentPath
							+ '../../images/' + imgName + '" />';
					_html += '    </div>';
					_html += '    <div id="' + row.userId
							+ '" class="card-box-content">';
					_html += '        <p>账户：' + row.account + '</p>';
					_html += '        <p>姓名：' + row.user_Name + '</p>';
					_html += '        <p>部门：' + row.departmentName + '</p>';
					_html += '    </div><i></i>';
					_html += '</div>';
				}
			});
			$(".gridPanel").html(_html);
			$(".card-box").click(function() {
				if (!$(this).hasClass("active")) {
					$(this).addClass("active")
				} else {
					$(this).removeClass("active")
				}
			})
			Loading(false);
		},
		beforeSend : function() {
			Loading(true);
		}
	});
	// 模糊查询用户（注：这个方法是理由jquery查询）
	$("#txt_TreeKeyword").keyup(
			function() {
				var value = $(this).val();
				if (value != "") {
					window.setTimeout(function() {
						$("." + departmentid).hide().filter(
								":contains('" + (value) + "')").show();
					}, 200);
				} else {
					$("." + departmentid).show();
				}
			}).keyup();
}
// 保存表单
function AcceptClick() {
	var userIds = [];
	$('.gridPanel .active .card-box-content').each(function() {
		userIds.push($(this).attr('id'));
	});
	var postData = $("#form1").GetWebControls();
	postData["role_no"] = roleId;
	postData["user_ids"] = String(userIds)
	$.SaveForm({
		url : "/system_manage/role_manage/SaveMember?token="+token,
		param : postData,
		loading : "正在保存角色成员...",
		success : function() {
			$.currentIframe().$("#gridTable").trigger("reloadGrid");
		}
	})
}
