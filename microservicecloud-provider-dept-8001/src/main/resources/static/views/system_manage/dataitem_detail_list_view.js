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
			$("#gridTable").setGridHeight($(window).height() - 125);
			$("#itemTree").setTreeHeight($(window).height() - 52);
		}, 200);
		e.stopPropagation();
	});
}
// 加载树
var _itemId = "";
var _itemName = "";
var _isTree = "";
function GetTree() {
	var item = {
		height : $(window).height() - 52,
		url : "/system_manage/dataitem_manage/GetDataItemTreeJson?token="+token,
		onnodeclick : function(item) {
			_itemId = item.id;
			_itemName = item.text;
			_isTree = item.isTree;
			$("#titleinfo").html(_itemName + "(" + item.value + ")");
			$("#txt_Keyword").val("");
			$('#btn_Search').trigger("click");
		}
	};
	// 初始化
	$("#itemTree").treeview(item);
}
// 加载表格
function GetGrid() {
	var selectedRowIndex = 0;
	var $gridTable = $("#gridTable");
	$gridTable
			.jqGrid({
				datatype : "json",
				height : $(window).height() - 127,
				autowidth : true,
				colModel : [
						{
							label : '主键',
							name : 'item_detail_id',
							hidden : true
						},
						{
							label : '&nbsp;&nbsp;&nbsp;&nbsp;项目名',
							name : 'item_name',
							index : 'item_name',
							width : 200,
							align : 'left',
							sortable : false
						},
						{
							label : '项目值',
							name : 'item_value',
							index : 'item_value',
							width : 200,
							align : 'left',
							sortable : false
						},
						{
							label : '排序',
							name : 'sort_code',
							index : 'sort_code',
							width : 80,
							align : 'center',
							sortable : false
						},
						{
							label : "默认",
							name : "is_default",
							index : "is_default",
							width : 50,
							align : "center",
							sortable : false,
							formatter : function(cellvalue) {
								return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>"
										: "<i class=\"fa fa-toggle-off\"></i>";
							}
						},
						{
							label : "有效",
							name : "enabled_mark",
							index : "enabled_mark",
							width : 50,
							align : "center",
							sortable : false,
							formatter : function(cellvalue) {
								return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>"
										: "<i class=\"fa fa-toggle-off\"></i>";
							}
						}, {
							label : "备注",
							name : "remark",
							index : "remark",
							width : 200,
							align : "left",
							sortable : false
						} ],
				treeGrid : true,
				treeGridModel : "nested",
				ExpandColumn : "item_value",
				rowNum : "10000",
				rownumbers : true,
				onSelectRow : function() {
					selectedRowIndex = $("#" + this.id).getGridParam('selrow');
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
	$("#btn_Search")
			.click(
					function() {
						$gridTable
								.jqGrid(
										'setGridParam',
										{
											url : "/system_manage/dataitem_manage/GetDataItemDetailTreeList?token="+token,
											postData : {
												itemId : _itemId,
												condition : $("#queryCondition")
														.find('.dropdown-text')
														.attr('data-value'),
												keyword : $("#txt_Keyword")
														.val()
											},
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
	if (!_itemId) {
		return false;
	}
	var parentId = $("#gridTable").jqGridRowValue("ItemDetailId");
	if (_isTree != 1) {
		parentId = 0;
	}
	tencheer.dialogOpen({
		id : "Form",
		title : '添加字典',
		url : '/system_manage/dataitem_manage/DataItemDetailForm?parentId='
				+ parentId + "&itemId=" + _itemId,
		width : "500px",
		height : "370px",
		callBack : function(iframeId) {
			top.frames[iframeId].AcceptClick();
		}
	});
};
// 编辑
function btn_edit() {
	var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");

	if (checkedRow(keyValue)) {
		dialogOpen({
			id : "Form",
			title : '编辑字典',
			url : '/system_manage/dataitem_manage/DataItemDetailForm?keyValue='
					+ keyValue,
			width : "500px",
			height : "370px",
			callBack : function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
}
// 删除
function btn_delete() {
	var keyValue = $("#gridTable").jqGridRowValue("item_detail_id");
	if (keyValue) {
		$.RemoveForm({
			url : "/system_manage/dataitem_manage/RemoveDetailForm",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#gridTable").resetSelection();
				$("#gridTable").trigger("reloadGrid");
			}
		})
	} else {
		dialogMsg('请选择需要删除的字典！', 0);
	}
}
// 详细
function btn_detail() {
	var keyValue = $("#gridTable").jqGridRowValue("ItemDetailId");
	if (checkedRow(keyValue)) {
		dialogOpen({
			id : "Detail",
			title : '字典信息',
			url : '/system_manage/dataitem_manage/DataItemDetailForm?keyValue='
					+ keyValue,
			width : "500px",
			height : "480px",
			btn : null
		});
	}
}
// 字典分类
function btn_datacategory() {
	dialogOpen({
		id : "DataItemSort",
		title : '字典分类',
		url : '/system_manage/dataitem_manage/DataItemList',
		width : "800px",
		height : "500px",
		btn : null
	});
}
