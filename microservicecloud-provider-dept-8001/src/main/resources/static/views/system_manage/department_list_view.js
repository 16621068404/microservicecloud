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
	columnJson = tencheer.CreateGridTable(gridTable, "sys_depart_list");
	gridTable.setGridWidth(($('.gridPanel').width()));
	gridTable.setGridHeight($(window).height() - 160);
	// 查询条件设置
	$("#queryCondition .dropdown-menu li").click(
			function() {
				var text = $(this).find('a').html();
				var value = $(this).find('a').attr('data-value');
				$("#queryCondition .dropdown-text").html(text).attr(
						'data-value', value)
			});
	// 查询事件
	$("#btn_Search").click(function() {
		search();
	});
	// 查询回车事件
	$('#txt_Keyword,.ui-search-input input').bind('keypress', function(event) {
		if (event.keyCode == "13") {
			$('#btn_Search').trigger("click");
		}
	});
}
function search() {
	var colSearch = "";
	$(".ui-search-input input")
			.each(
					function(i) {
						var columnCode = $(this).attr("name");
						var columnType = tencheer.getColumnType(columnJson,
								columnCode);
						if ($(this).val() != "") {
							if (columnType == "日期型")
								colSearch += " and to_char("
										+ $(this).attr("name")
										+ ", 'YYYY-MM-DD HH24:MI:SS') like '☻"
										+ $(this).val() + "☻'";
							if (columnType == "数值型")
								colSearch += " and COALESCE("
										+ $(this).attr("name") + ",0) = "
										+ $(this).val();
							if (columnType == "字符型")
								colSearch += " and " + $(this).attr("name")
										+ " like '☻" + $(this).val() + "☻'";
						}
					});
	gridTable.jqGrid('setGridParam', {
		datatype : "json",
		postData : {
			condition : "category_name",
			keyword : $("#txt_Keyword").val(),
			ParameterJson : colSearch,
			parent_id : parent_id
		}
	}).trigger('reloadGrid');
}
// 初始化页面
function InitialPage() {
	// resize重设(表格、树形)宽高
	$(window).resize(function(e) {
		window.setTimeout(function() {
			$('#gridTable').setGridWidth(($('.gridPanel').width()));
			$("#gridTable").setGridHeight($(window).height() - 160);
		}, 200);
		e.stopPropagation();
	});
}

function formatData(cellValue, colName, options, rowObject, column_type) {
	return cellValue;
}
// 新增
function btn_add() {
	dialogOpen({
		id : "Form",
		title : '添加部门',
		url : '/system_manage/department_manage/Form',
		width : "700px",
		height : "400px",
		callBack : function(iframeId) {
			top.frames[iframeId].AcceptClick();
		}
	});
};
// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("depart_no");
	if (checkedRow(keyValue)) {
		dialogOpen({
			id : "Form",
			title : '编辑部门',
			url : '/system_manage/department_manage/Form?keyValue=' + keyValue,
			width : "700px",
			height : "400px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("F_DepartmentId");
	if (keyValue) {
		var sort = $("#gridTable").jqGridRowValue("F_Sort");
		if (sort == 'Organize') {
			return false;
		}
		$.RemoveForm({
			url : "/system_manage/department_manage/RemoveForm",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").resetSelection();
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的部门！', 0);
	}
}
