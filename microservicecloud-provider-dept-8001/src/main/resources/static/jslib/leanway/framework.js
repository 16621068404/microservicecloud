var com = {};
com.leanway = {};// 加载页面对象信息
//加载页面对象信息
com.leanway.loadTags = function() {

	var pageId = com.leanway.getCurrentPageId();

	var result = eval("(" + com.leanway.getPageTags(pageId) + ")");

	for ( var i in result) {

		// 页面Id
		var id = result[i].id;

		// 页面类型(1：input, 2 : a ,3 : textarea)
		var type = result[i].type;

		// 状态( 1:disabled, 2: enabled, 3:readonly , 4: hidden)
		var status = result[i].event;

		com.leanway.buildTag(id, type, status);

	}

}

// 构建页面的设置信息
com.leanway.buildTag = function(id, type, status) {

	// 不可用状态
	if (status == "disabled") {

		$("#" + id).attr("disabled", true);

		// 是A标签的话, 还要去除click事件
		if (type == "a") {
			$("#" + id).unbind();
			$("#" + id).attr("onclick", "");
		}

		// 启用状态
	} else if (status == "enabled") {
		$("#" + id).attr("disabled", false);

		// 只读状态
	} else if (status == "readonly") {
		$("#" + id).attr("readonly", true);

		// 隐藏状态
	} else if (status == "hidden") {
		$("#" + id).hide();
	}

}

// 加载页面的对象设置信息
com.leanway.getPageTags = function(pageId) {

	var tagsJson = "";

	$.ajax({
		type : "post",
		url : "../../tag",
		data : {
			"method" : "getPageTagsInfo",
			"pageId" : pageId
		},
		dataType : "text",
		async : false,
		success : function(text) {
			tagsJson = $.trim(text);
		}
	});

	return tagsJson;
}

com.leanway.getCurrentPageId = function() {

	var currentPageId = com.leanway.getQueryString("pageId");
	/*
	 * // 获取激活着的tabId var tabId = $("li.active", parent.document).attr('id'); //
	 * 截取 var subIframeId = tabId.substring(4, tabId.length); // 拼接 var ifameId =
	 * "tab_iframe_" + subIframeId; // 获取Iframe Src var iframeSrc = $("#" +
	 * ifameId, parent.document).attr('src');
	 */
	return currentPageId;

}

// 初始化时间
var initTimePickYmd = function(timeId) {
	$("#" + timeId).datetimepicker({
		lang : 'ch',
		format : "Y-m-d", // 格式化日期
		timepicker : false, // 关闭时间选项
		yearStart : 2000, // 设置最小年份
		yearEnd : 2050, // 设置最大年份
		todayButton : false
	// 关闭选择今天按钮
	});
}

//初始化时间， 2015-03-03 13:24:14
var initDateTimeYmdHms = function (dataTimeId) {
	$(dataTimeId).datetimepicker({
		lang : 'ch',
		format : "Y-m-d H:i:s", // 格式化日期
		timepicker : false, // 关闭时间选项
		yearStart : 2000, // 设置最小年份
		yearEnd : 2050, // 设置最大年份
		todayButton : true
		// 关闭选择今天按钮
	});
}

// 初始化时间
var initTimePickHms = function(timeId) {
	$("#" + timeId).datetimepicker({
		lang : 'ch',
		datepicker : false,
		format : 'H:i',
		step : 5
	});
}