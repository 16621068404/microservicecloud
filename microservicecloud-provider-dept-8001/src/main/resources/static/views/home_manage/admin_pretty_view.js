var contentPath = '/'.substr(0, '/'.length - 1);
$(function() {
	window.onbeforeunload = onbeforeunload_handler;
	// window.onunload = onunload_handler;
	function onbeforeunload_handler() {
		console.log(top.tencheer.login_status);
		if (top.tencheer.login_status == "normal") {
			var warning = "系统正在运行，是否确认退出?";
			return warning;
		}
	}
})
