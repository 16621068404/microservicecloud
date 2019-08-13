var keyValue = request('keyValue');
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
			url : "/system_manage/department_manage/GetFormJson",
			param : {
				keyValue : keyValue,
				token:token
			},
			success : function(data) {
				$("#form1").SetWebControls(data);
			}
		});
	}
}
// 保存表单
function AcceptClick() {
	if (!$('#form1').Validform()) {
		return false;
	}
	var postData = $("#form1").GetWebControls(keyValue);
	postData["F_Manager"] = $("#F_ManagerId").attr('data-text');
	$.SaveForm({
		url : "/system_manage/department_manage/SaveForm?keyValue=" + keyValue+"&token="+token,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
			$.currentIframe().$("#gridTable").resetSelection();
			$.currentIframe().$("#gridTable").trigger("reloadGrid");
		}
	})
}
