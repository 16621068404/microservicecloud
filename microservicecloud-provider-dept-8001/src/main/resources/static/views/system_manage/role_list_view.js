var columnJson = [];
var token;
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	InitialControl();
	InitialPage();

});

function InitialControl() {
	gridTable = $("#gridTable");
	columnJson = tencheer.CreateGridTable(gridTable, "sys_role_list");
	gridTable.setGridHeight($(window).height() - 125);
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
				$gridTable.jqGrid(
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
	$(window).resize(function(e) {
		window.setTimeout(function() {
			// $('#gridTable').setGridWidth($('.gridPanel').width() -2);
			$("#gridTable").setGridHeight($(window).height() - 125);
		}, 200);
		e.stopPropagation();
	});
}
function formatData(cellValue, colName) {
	return cellValue;
}

// 新增
function btn_add() {
	tencheer.dialogOpen({
		id : "Form",
		title : '添加角色',
		url : '/system_manage/role_manage/Form',
		width : "500px",
		height : "320px",
		callBack : function(iframeId) {
			top.frames[iframeId].AcceptClick();
		}
	});
};
// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("role_no");
	if (checkedRow(keyValue)) {
		tencheer.dialogOpen({
			id : "Form",
			title : '修改角色',
			url : '/system_manage/role_manage/Form?keyValue=' + keyValue,
			width : "500px",
			height : "360px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("role_no");
	if (keyValue) {
		$.tencheer.RemoveForm({
			url : "/system_manage/role_manage/RemoveForm",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的角色！', 0);
	}
}
// 角色成员
function btn_member() {
	var keyValue = $("#gridTable").jqGridRowValue("role_no");
	var RoleName = $("#gridTable").jqGridRowValue("role_name");
	if (checkedRow(keyValue)) {
		tencheer.dialogOpen({
			id : "AllotMember",
			title : '角色成员 - ' + RoleName,
			url : '/system_manage/role_manage/allotMember?roleId=' + keyValue,
			width : "800px",
			height : "520px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// 角色授权
function btn_authorize() {
	var RoleId = $("#gridTable").jqGridRowValue("role_no");
	var RoleName = $("#gridTable").jqGridRowValue("role_name");
	if (checkedRow(RoleId)) {
		dialogOpen({
			id : "AllotRight",
			title : '角色授权 - ' + RoleName,
			url : '/system_manage/role_manage/AllotRight?ObjectId=' + RoleId
					+ '&Category=2'+'&token='+token,
			width : "700px",
			height : "690px",
			btn : null
		});
	}
}
