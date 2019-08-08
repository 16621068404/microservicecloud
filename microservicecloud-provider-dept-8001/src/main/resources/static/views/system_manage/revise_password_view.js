var token;
var keyValue = tencheer.request('keyValue');
$(function() {
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	$("#user_logid").val(tencheer.request('user_logid'));
	$("#user_name").val(tencheer.request('user_name'));
})
// 保存事件
function AcceptClick() {
	if (!$('#form1').Validform()) {
		return false;
	}
	var postData = $("#form1").getWebControls(keyValue);
	postData["Password"] = $.md5($.trim($("#Password").val()));
	tencheer.saveForm({
		url : "/system_manage/user_manage/SaveRevisePassword?keyValue="
				+ keyValue+"&token="+token,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
		}
	})
}
