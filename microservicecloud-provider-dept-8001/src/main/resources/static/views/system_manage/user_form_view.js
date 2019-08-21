var keyValue = request('keyValue');
var token;
$(function() {
	 //从cookie中读取token
     //从cookie中读取token
    token = getCookie("token");
	initControl();
})
// 初始化控件
function initControl() {
	// 加载角色
	// $("#role_no").ComboBox({
	// url: "/base_manage/role_manage/GetListJson",
	// id: "F_RoleId",
	// text: "F_FullName",
	// description: "==请选择==",
	// height: "200px",
	// allowSearch: true
	// });
	// 部门
	$("#depart_no").ComboBox({
		url : "/system_manage/department_manage/GetDepartDropdownList?token="+token,
		id : "depart_no",
		text : "depart_name",
		description : "==请选择部门==",
		height : "200px",
		allowSearch : true
	});
	// 性别
	$("#user_sex").ComboBox({
		description : "==请选择==",
	});
	if (!!keyValue) {
		$.SetForm({
			url : "/system_manage/user_manage/GetFormJson?token="+token,
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
	$.SaveForm({
		url : "/system_manage/user_manage/SaveForm?token="+token,
		param : {
			"keyValue" : keyValue,
			"UserEntity" : JSON.stringify(postData)   //对象转json字符串
		},
		close : false,
		loading : "正在保存数据...",
		success : function(data) {
			$.currentIframe().$("#gridTable").trigger("reloadGrid");
			dialogClose();
		}
	})
}
