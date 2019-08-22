var controlId = request("ControlId");
$(function() {
	$("#icons .filter-icon a").dblclick(function() {
		var icon = $(this).find('i').attr('class');
		top.Form.$('#' + controlId).val(icon);
		dialogClose();
	})
})
