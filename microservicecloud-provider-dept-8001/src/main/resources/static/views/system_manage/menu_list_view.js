var token;
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	InitialPage();
	GetTree();
	GetGrid();
});
// 初始化页面
function InitialPage() {
	$("#cust_no").ComboBox({
		url : "/database_manage/database_manage/GetDatabaseDropdownList",
		id : "cust_no",
		text : "cust_name",
		description : "==请选择用户库==",
		height : "400px",
		allowSearch : true
	});
	// layout布局
	$('#layout').layout({
		applyDemoStyles : true,
		onresize : function() {
			$(window).resize()
		}
	});
	// resize重设(表格、树形)宽高
	$(window).resize(function(e) {
		window.setTimeout(function() {
			$('#gridTable').setGridWidth(($('.gridPanel').width()));
			$("#gridTable").setGridHeight($(window).height() - 132);
			$("#itemTree").setTreeHeight($(window).height() - 52);
		}, 200);
		e.stopPropagation();
	});
}
// 加载树
var _parentId = "";
function GetTree() {
	var item = {
		height : $(window).height() - 52,
		url : "/system_manage/menu_manage/getMenuTreeJson?token="+token,
		isAllExpand : false,
		onnodeclick : function(item) {
			_parentId = item.id;
			$('#btn_Search').trigger("click");
		}
	};
	// 初始化
	$("#itemTree").treeview(item);
}

// 加载表格
function GetGrid() {
	var selectedRowIndex = 0;
	var $gridTable = $('#gridTable');
	$gridTable
			.jqGrid({
				url : "/system_manage/menu_manage/ModuleDataList?token="+token,
				datatype : "json",
				height : $(window).height() - 132,
				autowidth : true,
				colModel : [
						{
							label : "主键",
							name : "MenuId",
							index : "MenuId",
							hidden : true
						},
						{
							label : "主键",
							name : "ParentId",
							index : "ParentId",
							hidden : true
						},
						{
							label : "编号",
							name : "Menu_Code",
							index : "Menu_Code",
							width : 200,
							align : "left"
						},
						{
							label : "名称",
							name : "Menu_Name",
							index : "Menu_Name",
							width : 100,
							align : "left"
						},
						{
							label : "地址",
							name : "UrlAddress",
							index : "UrlAddress",
							width : 300,
							align : "left"
						},
						{
							label : "图标",
							name : "Menu_Icon",
							index : "Menu_Icon",
							width : 200,
							align : "left"
						},
						{
							label : "排序",
							name : "Sort_Code",
							index : "Sort_Code",
							width : 40,
							align : "left"
						},
						{
							label : "导航目标",
							name : "Menu_Type",
							index : "Menu_Type",
							width : 60,
							align : "center",
							formatter : function(cellvalue, options, rowObject) {
								return cellvalue == "ipage" ? "页面" : "菜单";
							}
						},
						{
							label : "有效",
							name : "EnabledMark",
							index : "EnabledMark",
							width : 50,
							align : "center",
							formatter : function(cellvalue, options, rowObject) {
								return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>"
										: "<i class=\"fa fa-toggle-off\"></i>";
							}
						}, {
							label : "描述",
							name : "Description",
							index : "remark",
							width : 500,
							align : "left"
						} ],
				pager : false,
				rowNum : "1000",
				rownumbers : true,
				shrinkToFit : false,
				gridview : true,
				// altRows:true,
				// altClass:'someClass',
				onSelectRow : function() {
					selectedRowIndex = $("#" + this.id).getGridParam('selrow');
				},
				// 双击事件
				ondblClickRow : function(RowIndx) {
					var rowData = $(this).jqGrid('getRowData', RowIndx);
					if (rowData.ParentId == "0") {
						_parentId = rowData.MenuId;
						$('#btn_Search').trigger("click");
					} else {
						btn_edit();
					}
				},
				gridComplete : function() {
					$("#" + this.id).setSelection(selectedRowIndex, false);
				}
			});
	// 查询条件
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
							url : "/system_manage/menu_manage/ModuleDataList?token="+token,
							postData : {
								parentid : _parentId,
								condition : $("#queryCondition").find(
										'.dropdown-text').attr('data-value'),
								keyword : $("#txt_Keyword").val()
							}
						}).trigger('reloadGrid');
			});
	// 查询回车
	$('#txt_Keyword').bind('keypress', function(event) {
		if (event.keyCode == "13") {
			$('#btn_Search').trigger("click");
		}
	});
}
// 新增
function btn_add() {
	dialogOpen({
		id : "Form",
		title : '添加功能',
		url : '/system_manage/menu_manage/moduleForm?parent_id=' + _parentId,
		width : "700px",
		height : "400px",
		btn : null
	});
};
// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("MenuId");
	if (checkedRow(keyValue)) {
		dialogOpen({
			id : "Form",
			title : '编辑功能',
			url : '/system_manage/menu_manage/moduleForm?keyValue=' + keyValue,
			width : "700px",
			height : "400px",
			btn : null
		});
	}
}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("MenuId");
	if (keyValue) {
		$.RemoveForm({
			url : "/system_manage/menu_manage/RemoveForm?token="+token,
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的数据项！', 0);
	}
}
function btn_columnconfig() {
	top.tablist.newTab({
		id : '字段配置',
		title : "字段配置",
		closed : true,
		icon : "fa fa-edit",
		url : "/system_manage/grid_column_manage/grid"
	});
}
