var keyValue = request('keyValue');
var itemId = request('itemId');
var parentId = tencheer.request('parentId');
var token;
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	initControl();
})
// 初始化控件
function initControl() {
	// 获取表单
	if (!!keyValue) {
		$.SetForm({
			url : "/system_manage/dataitem_manage/GetDataItemDetailFormJson?token="+token,
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#form1").SetWebControls(data);
			}
		});
	} else {
		$("#ParentId").val(parentId);
		$("#ItemId").val(itemId);
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
		url : "/system_manage/dataitem_manage/SaveDataItemDetailForm?keyValue="
				+ keyValue+"&token="+token,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
			$.currentIframe().$("#gridTable").resetSelection();
			$.currentIframe().$("#gridTable").trigger("reloadGrid");
		}
	})
}
// 验证：项目值、项目名 不能重复
function OverrideExistField(id, url) {
	$.ExistField(id, url, {
		itemId : itemId
	});
}
