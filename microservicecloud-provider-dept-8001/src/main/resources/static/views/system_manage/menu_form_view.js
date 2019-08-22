var token;
$(function() {
	
	//从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
	
	
	$("#menu_code").attr('tabindex', 1);
	$('#menu_name').attr('tabindex', 2);
	$('#parent_id').attr('tabindex', 3);

	$(":text").focus(function() {
		$(this).css('background', '#FFFF66');
	}).blur(function() {
		$(this).css('background', '#FFFFFF');
	});
	$("[tabindex]").addClass("TabOnEnter");
	$(document).on("keypress", ".TabOnEnter", function(e) {
		if (e.keyCode == 13) {
			var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
			if (nextElement.length) {
				nextElement.focus();
				nextElement.active();
			} else
				$('[tabindex="1"]').focus();
		}
	});
});
var keyValue = tencheer.request('keyValue');
var parent_id = tencheer.request('parent_id');
$(function() {
	initialPage();
	buttonOperation();
	// getGridButton();
	// getGridView();
})
// 初始化页面
function initialPage() {
	initControl();
}
// 初始化控件
function initControl() {
	// 目标
	$("#menu_type").ComboBox({
		description : "==请选择==",
		height : "200px"
	});
	// 上级
	$("#parent_id").ComboBoxTree({
		url : "/system_manage/menu_manage/getAllMenuTreeJson?token="+token,
		description : "==请选择==",
		height : "195px",
		allowSearch : true
	});
	// 获取表单
	if (!!keyValue) {
		$.SetForm({
			url : "/system_manage/menu_manage/EditModule?token="+token,
			param : {
				keyValue : keyValue
			},
			success : function(data) {
				$("#form1").SetWebControls(data);
			}
		});
	} else {
		$("#parent_id").ComboBoxTreeSetValue(parent_id);
	}
}
// 选取图标
function SelectIcon() {
	dialogOpen({
		id : "SelectIcon",
		title : '选取图标',
		url : '/system_manage/main_frame/icon?ControlId=menu_icon',
		width : "1000px",
		height : "600px",
		btn : false
	})
}
// 保存表单
function AcceptClick() {
	if (!$('#form1').Validform()) {
		return false;
	}
	var postData = $("#form1").GetWebControls(keyValue);
	if (postData["parent_id"] == "") {
		postData["parent_id"] = 0;
	}
	// postData["moduleButtonListJson"] = JSON.stringify(buttonJson);
	// postData["moduleColumnListJson"] = JSON.stringify(columnJson);

	$.SaveForm({
		url : "/system_manage/menu_manage/SaveModuleForm?keyValue=" + keyValue+"&token="+token,
		param : postData,
		loading : "正在保存数据...",
		success : function() {
			$.currentIframe().$("#gridTable").trigger("reloadGrid");
		}
	})
}

// 按钮操作（上一步、下一步、完成、关闭）
function buttonOperation() {
	var $last = $("#btn_last");
	var $next = $("#btn_next");
	var $finish = $("#btn_finish");
	// 如果是菜单，开启 上一步、下一步
	$("#IsMenu").click(function() {
		if (!$(this).attr("checked")) {
			$(this).attr("checked", true)
			$next.removeAttr('disabled');
			$finish.attr('disabled', 'disabled');
		} else {
			$(this).attr("checked", false)
			$next.attr('disabled', 'disabled');
			$finish.removeAttr('disabled');
		}
	});
	// 完成提交保存
	$finish.click(function() {
		AcceptClick();
	})
}
