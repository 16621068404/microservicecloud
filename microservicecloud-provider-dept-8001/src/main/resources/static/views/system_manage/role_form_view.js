var keyValue = request('keyValue');
var organizeId = request('organizeId');
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
			url : "/system_manage/role_manage/GetFormJson?token="+token,
			param : {
				keyValue : keyValue
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
	tencheer.saveForm({
		url : "/system_manage/role_manage/SaveForm?keyValue=" + keyValue+"&token="+token,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
			tencheer.currentIframe().$("#gridTable").trigger("reloadGrid");
		}
	})
}
