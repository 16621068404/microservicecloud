var columnJson = [];
var grid_active = $("#gridTable");
var system_type = "1";
$(document).ready(function() {
	InitControl();
	initialPage();
	$('#date_begin').datetimepicker({
		lang : 'ch',
		step : 5,
		format : "Y-m-d H:i:s"
	});
	$('#date_end').datetimepicker({
		lang : 'ch',
		step : 5,
		format : "Y-m-d H:i:s"
	});
	$.datetimepicker.setLocale('ch');// 设置中文
});
function InitControl() {
	var gridTable = $("#gridTable");
	columnJson = tencheer.CreateGridTable(gridTable, 'sys_log_list');
	gridTable.setGridParam({
		gridComplete : function() {
			$(this).SetTbBgcolor();
		}
	});
	$('#gridTable').setGridWidth(($('.gridPanel').width() - 2));
	$("#gridTable").setGridHeight($(window).height() - 160);

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
						var colSearch = "";
						$(".ui-search-input input")
								.each(
										function(i) {
											var columnCode = $(this).attr(
													"name");
											var columnType = tencheer
													.getColumnType(columnJson,
															columnCode);
											if ($(this).val() != "") {
												if (columnType == "日期型")
													colSearch += " and to_char("
															+ $(this).attr(
																	"name")
															+ ", 'YYYY-MM-DD HH24:MI:SS') like '☻"
															+ $(this).val()
															+ "☻'";
												if (columnType == "数值型")
													colSearch += " and to_char("
															+ $(this).attr(
																	"name")
															+ ",'999D99S') like '☻"
															+ $(this).val()
															+ "☻'";
												if (columnType == "字符型")
													colSearch += " and "
															+ $(this).attr(
																	"name")
															+ " like '☻"
															+ $(this).val()
															+ "☻'";
											}
										});
						gridTable.jqGrid(
								'setGridParam',
								{
									postData : {
										condition : $("#queryCondition").find(
												'.dropdown-text').attr(
												'data-value'),
										keyword : $("#txt_Keyword").val(),
										begindate : $("#date_begin").val(),
										enddate : $("#date_end").val(),
										columnsearch : colSearch,
									}
								}).trigger('reloadGrid');
					});

	// 查询回车事件
	$('#txt_Keyword,.ui-search-input input').bind('keypress', function(event) {
		if (event.keyCode == "13") {
			$('#btn_Search').trigger("click");
		}
	});
	// 清除条件
	$("#btn_Clear").click(function() {
		$("#txt_Keyword").val("");
		$("#date_begin").val("");
		$("#date_end").val("");
		$(".ui-search-input input").each(function(i) {
			$(this).val("");
		});
	});

}
// 重设(表格)宽高
function initialPage() {
	// resize重设(表格、树形)宽高
	$(window).resize(function(e) {
		window.setTimeout(function() {
			$('#gridTable').setGridWidth(($('.gridPanel').width() - 2));
			$("#gridTable").setGridHeight($(window).height() - 160);
		}, 200);
		e.stopPropagation();
	});
}
function formatData(cellValue, colName, options, rowObject) {
	if (colName == "check_status") {
		return cellValue == "1" ? "已审核" : "未审核";
	}

	return cellValue;
}
