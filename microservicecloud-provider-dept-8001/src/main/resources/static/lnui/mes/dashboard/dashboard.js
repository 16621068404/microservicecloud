$(function() {
	queryDispatchingorder();
})
function queryDispatchingorder() {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/balanceSheet",
		data : {
			"method" : "queryCriticalLoad",
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var temp = $.parseJSON(data);

				for (var i = 1; i <= temp.length; i++) {

					var container = 'container' + i;
					console.info(container);
					var myChart = echarts.init(document
							.getElementById(container));
					var option1 = temp[i - 1];

					myChart.setOption(option1);

					var container1 = document.getElementById(container);
					var resizeWorldMapContainer = function() {
						container1.style.width = window.innerWidth * 1 / 2
								+ 'px';
						container1.style.height = window.innerHeight * 1 / 2
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
