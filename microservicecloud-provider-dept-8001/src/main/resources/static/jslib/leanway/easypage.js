var startPageHtml = '<ul class="pagination">' + '<li class="indexeasypage">'
		+ '<a href="#">首页</a>' + '</li>' + '<li class="previouseasypage">'
		+ '<a href="#" aria-label="Previous">上一页</a>' + '</li>';

var endPageHtml = '<li class="nexteasypage">'
		+ '<a href="#" aria-label="Next">下一页</a>' + '</li>'
		+ '<li class="lasteasypage">' + '<a href="#">末页</a>' + '</li>' + '<li>'
		+ '<span class="totalpages"></span>' + '</li>' + '</ul>';

// 初始化数据
function initEasyPageFunc(currentPage, totalPage) {
	var middlePageHtml = '';
	if (totalPage > 5) {
		if (currentPage <= 3) {
			for (var i = 0; i < 5; i++) {
				middlePageHtml += "<li><a href='#'>" + (i + 1) + "</a></li>";
			}
		} else if ((totalPage - currentPage) <= 2) {
			for (var i = 5; i > 0; i--) {
				middlePageHtml += "<li><a href='#'>"
						+ (parseInt(totalPage) - (i - 1)) + "</a></li>";
			}
		} else {
			middlePageHtml += "<li><a href='#'>" + (parseInt(currentPage) - 2)
					+ "</a></li>";
			middlePageHtml += "<li><a href='#'>" + (parseInt(currentPage) - 1)
					+ "</a></li>";
			middlePageHtml += "<li><a href='#'>" + currentPage + "</a></li>";
			middlePageHtml += "<li><a href='#'>" + (parseInt(currentPage) + 1)
					+ "</a></li>";
			middlePageHtml += "<li><a href='#'>" + (parseInt(currentPage) + 2)
					+ "</a></li>";
		}
	} else {
		for (var i = 0; i < totalPage; i++) {
			middlePageHtml += "<li><a href='#'>" + (i + 1) + "</a></li>";
		}
	}

	$("#easyPage").html(startPageHtml + middlePageHtml + endPageHtml);

	$('.pagination li a').unbind('click');

	$('.pagination li a').bind('click', function() {
		goToEasyPageFunc($(this).html(), totalPage);
		// 绑定重新加载数据 //TODO
		 reloadTable();
	});

	$('.totalpages').html('共 ' + ((totalPage == 0) ? '1' : totalPage) + ' 页');
	$('#currentPage').val(currentPage);
	$('#totalPage').val(totalPage);

	$('.pagination li a').each(function() {
		if ($(this).html() == currentPage) {
			$(this).parent().addClass("active");
		}
	});

}

// 跳转页面
function goToEasyPageFunc(sendPage, totalPage) {
	var currentPage = $("#currentPage").val();
	var goToPage;
	if (sendPage == '首页')
		goToPage = 1;
	else if (sendPage == '末页')
		goToPage = totalPage;
	else if (sendPage == '上一页') {
		goToPage = parseInt(currentPage) - 1;
		if (goToPage < 1)
			goToPage = 1;
	} else if (sendPage == '下一页') {
		goToPage = parseInt(currentPage) + 1;
		if (goToPage > totalPage)
			goToPage = totalPage;
	} else
		goToPage = sendPage;

	initEasyPageFunc(goToPage, totalPage);

}

$(function() {

});