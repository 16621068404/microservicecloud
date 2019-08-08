$(function() {
	InitialPage();
	InitialControl();
});
function InitialControl() {
	gridTable = $("#gridTable");
	tencheer.CreateGridTable(gridTable, "sys_user_list");
	gridTable.setGridWidth(($('.gridPanel').width() - 2));
	gridTable.setGridHeight($(window).height() - $('.titlePanel').height()
			- 100);
	// 查询条件设置
	$("#queryCondition .dropdown-menu li").click(
			function() {
				var text = $(this).find('a').html();
				var value = $(this).find('a').attr('data-value');
				$("#queryCondition .dropdown-text").html(text).attr(
						'data-value', value)
			});
	// 查询事件
	$("#btn_Search").click(
			function() {
				gridTable.jqGrid(
						'setGridParam',
						{
							postData : {
								condition : $("#queryCondition").find(
										'.dropdown-text').attr('data-value'),
								keyword : $("#txt_Keyword").val()
							}
						}).trigger('reloadGrid');
			});
	// 查询回车事件
	$('#txt_Keyword').bind('keypress', function(event) {
		if (event.keyCode == "13") {
			$('#btn_Search').trigger("click");
		}
	});

}
// 初始化页面
function InitialPage() {
	// resize重设(表格、树形)宽高
	$(window).resize(
			function(e) {
				window.setTimeout(function() {
					$('#gridTable').setGridWidth($('.gridPanel').width() - 2);
					$("#gridTable").setGridHeight(
							$(window).height() - $('.titlePanel').height()
									- 100);
				}, 200);
				e.stopPropagation();
			});
}
function formatData(cellValue, colName, options, rowObject, column_type) {
	if (colName == "depart_name") {
		return cellValue;
	}
	if (colName == "user_sex") {
		return cellValue == "1" ? "男" : "女";
	}
	if (colName == "status") {
		return cellValue == "1" || cellValue == "有效" ? "有效" : "无效";
	}
	return cellValue;
}
// 新增
function btn_add() {
	tencheer.dialogOpen({
		id : "Form",
		title : '添加用户',
		url : '/system_manage/user_manage/AddUser',
		width : "900px",
		height : "500px",
		callBack : function(iframeId) {
			top.frames[iframeId].AcceptClick();
		}
	});
};

// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("user_no");
	if (tencheer.checkedRow(keyValue)) {
		tencheer.dialogOpen({
			id : "Form",
			title : '修改用户',
			url : '/system_manage/user_manage/EditUser?keyValue=' + keyValue,
			width : "700px",
			height : "500px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}

}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("user_no");
	if (keyValue) {
		$.tencheer.RemoveForm({
			url : "/system_manage/user_manage/RemoveUser",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的用户！', 0);
	}
}
// 删除用户
function btn_RemoveUser(keyValue) {
	if (keyValue == undefined) {
		keyValue = $("#gridTable").jqGridRowValue("user_no");
	}
	if (tencheer.checkedRow(keyValue)) {
		if (keyValue) {
			$.tencheer.RemoveForm({
				url : "/system_manage/user_manage/RemoveUser",
				param : {
					keyValue : keyValue
				},
				success : function(data) {
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的用户！', 0);
		}
	}
}
// 重置密码
function btn_revisepassword() {
	var keyValue = $("#gridTable").jqGridRowValue("user_no");
	var user_logid = $("#gridTable").jqGridRowValue("user_logid");
	var user_name = $("#gridTable").jqGridRowValue("user_name");
	if (tencheer.checkedRow(keyValue)) {
		tencheer.dialogOpen({
			id : "RevisePassword",
			title : '重置密码',
			url : '/system_manage/user_manage/RevisePassword?keyValue='
					+ keyValue + "&user_logid=" + user_logid
					+ '&user_name=' + user_name,
			width : "500px",
			height : "260px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// Excel导出
function btn_export() {
	tencheer
			.dialogOpen({
				id : "Form",
				title : '导出员工信息',
				url : '/system_manage/excel_export_manage/ColumnFilter?gridId=gridTable&filename=员工信息',
				width : "780px",
				height : "500px",
				btn : [ '导出', '关闭' ],
				callBack : function(iframeId) {
					top.frames[iframeId].AcceptClick();
				}
			});
}
// 禁用
function btn_disabled(keyValue) {
	if (keyValue == undefined) {
		keyValue = $("#gridTable").jqGridRowValue("user_no");
	}
	if (checkedRow(keyValue)) {
		$.ConfirmAjax({
			msg : "注：您确定要【禁用】账户？",
			url : "/system_manage/user_manage/DisabledAccount",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").trigger("reloadGrid");
			}
		})
	}
}
// 启用
function btn_enabled(keyValue) {
	if (keyValue == undefined) {
		keyValue = $("#gridTable").jqGridRowValue("user_no");

	}
	if (checkedRow(keyValue)) {
		$.ConfirmAjax({
			msg : "注：您确定要【启用】账户？",
			url : "/system_manage/user_manage/EnabledAccount",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").trigger("reloadGrid");
			}
		})
	}
}
// 用户授权
function btn_authorize() {
	var keyValue = $("#gridTable").jqGridRowValue("user_no");
	var UserName = $("#gridTable").jqGridRowValue("user_name");
	if (tencheer.checkedRow(keyValue)) {
		tencheer
				.dialogOpen({
					id : "AllotUserAuthorize",
					title : '用户授权 - ' + UserName,
					url : '/system_manage/authorize_manage/AllotUserAuthorize?ObjectId='
							+ keyValue + '&Category=0',
					width : "700px",
					height : "690px",
					btn : null
				});
	}
}
