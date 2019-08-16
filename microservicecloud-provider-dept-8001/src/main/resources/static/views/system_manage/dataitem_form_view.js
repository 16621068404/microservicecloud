var keyValue = request('keyValue');
var parentId = request('parentId');
$(function() {
	initControl();
})
// 初始化控件
function initControl() {
	// 上级
	$("#ParentId").ComboBoxTree({
		url : "/system_manage/dataitem_manage/GetDataItemTreeJson",
		description : "==请选择==",
		height : "230px",
	});

	// 获取表单
	if (!!keyValue) {
		$.SetForm({
			url : "/system_manage/dataitem_manage/GetDataItemFormJson",
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#form1").SetWebControls(data);
			}
		});
	} else {
		$("#ParentId").ComboBoxTreeSetValue(parentId);
	}
}
// 保存表单
function AcceptClick() {
	if (!$('#form1').Validform()) {
		return false;
	}
	var postData = $("#form1").GetWebControls(keyValue);
	if (postData["ParentId"] == "") {
		postData["ParentId"] = 0;
	}
	$.SaveForm({
		url : "/system_manage/dataitem_manage/SaveDataItemForm?keyValue="
				+ keyValue,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
			top.DataItemSort.$("#gridTable").resetSelection();
			top.DataItemSort.$("#gridTable").trigger("reloadGrid");
		}
	})
}
