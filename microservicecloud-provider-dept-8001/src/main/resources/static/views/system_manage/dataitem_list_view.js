var token;
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token");
	InitialPage();
	GetGrid();
});
// 初始化页面
function InitialPage() {
	// resize重设(表格、树形)宽高
	$(window).resize(function(e) {
		window.setTimeout(function() {
			$('#gridTable').setGridWidth(($('.gridPanel').width()));
			$("#gridTable").setGridHeight($(window).height() - 114.5);
		}, 200);
		e.stopPropagation();
	});
}
// 加载表格
function GetGrid() {
	var selectedRowIndex = 0;
	var $gridTable = $("#gridTable");
	$gridTable
			.jqGrid({
				url : "/system_manage/dataitem_manage/GetDataItemTreeList?token="+token,
				datatype : "json",
				height : $(window).height() - 114.5,
				autowidth : true,
				colModel : [
						{
							label : '主键',
							name : 'ItemId',
							index : 'ItemId',
							hidden : true
						},
						{
							label : '名称',
							name : 'ItemName',
							index : 'ItemName',
							width : 200,
							align : 'left'
						},
						{
							label : '编号',
							name : 'ItemCode',
							index : 'ItemCode',
							width : 200,
							align : 'left'
						},
						{
							label : '排序',
							name : 'SortCode',
							index : 'SortCode',
							width : 80,
							align : 'left'
						},
						{
							label : "树型",
							name : "IsTree",
							index : "IsTree",
							width : 50,
							align : "center",
							formatter : function(cellvalue) {
								return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>"
										: "<i class=\"fa fa-toggle-off\"></i>";
							}
						},
						{
							label : "有效",
							name : "EnabledMark",
							index : "EnabledMark",
							width : 50,
							align : "center",
							formatter : function(cellvalue) {
								return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>"
										: "<i class=\"fa fa-toggle-off\"></i>";
							}
						}, {
							label : "备注",
							name : "Description",
							index : "Description",
							width : 200,
							align : "left"
						} ],
				treeGrid : true,
				treeGridModel : "nested",
				ExpandColumn : "ItemCode",
				rowNum : "10000",
				rownumbers : true,
				onSelectRow : function() {
					selectedRowIndex = $("#" + this.id).getGridParam('selrow');
				},
				gridComplete : function() {
					$("#" + this.id).setSelection(selectedRowIndex, false);
				}
			});
	// 查询事件
	$("#btn_Search").click(function() {
		$gridTable.jqGrid('setGridParam', {
			postData : {
				keyword : $("#txt_Keyword").val()
			},
		}).trigger('reloadGrid');
	});
}
// 新增
function btn_add() {
	var parentId = $("#gridTable").jqGridRowValue("ItemId");
	dialogOpen({
		id : "Form",
		title : '添加分类',
		url : '/system_manage/dataitem_manage/DataItemForm?parentId='
				+ parentId,
		width : "500px",
		height : "400px",
		callBack : function(iframeId) {
			top.frames[iframeId].AcceptClick();
		}
	});
};
// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("ItemId");
	if (checkedRow(keyValue)) {
		dialogOpen({
			id : "Form",
			title : '编辑分类',
			url : '/system_manage/dataitem_manage/DataItemForm?keyValue='
					+ keyValue,
			width : "500px",
			height : "400px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("ItemId");
	if (keyValue) {
		$.RemoveForm({
			url : "/system_manage/dataitem_manage/RemoveDataItemForm",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").resetSelection();
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的分类！', 0);
	}
}
