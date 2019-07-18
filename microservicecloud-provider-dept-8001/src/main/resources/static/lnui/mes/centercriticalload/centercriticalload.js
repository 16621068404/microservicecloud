$(function() {
	queryDispatchingorder();
})
function queryDispatchingorder() {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/balanceSheet",
		data : {
			"method" : "queryJNCenterCriticalLoad",
			"type" : "TV"
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var temp = $.parseJSON(data);

				console.info(temp.length)

				for (var i = 1; i <= temp.length; i++) {

					var container = 'container' + i;
					console.info(container);
					var myChart = echarts.init(document
							.getElementById(container));
					var option1 = temp[i - 1];

					myChart.setOption(option1);

					var container1 = document.getElementById(container);
					var resizeWorldMapContainer = function() {
						container1.style.width = window.innerWidth * 1 / 3
								+ 'px';
						container1.style.height = window.innerHeight * 2 / 5
								+ 'px';
					};
					//重置容器高宽
					resizeWorldMapContainer();
					myChart.resize();
				}
			}
		}
	});

}
