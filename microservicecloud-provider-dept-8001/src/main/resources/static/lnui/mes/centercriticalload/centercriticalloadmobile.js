$(function() {
	
	var date = new Date();
	queryDispatchingorder(date.Format("yyyy-MM-dd hh:mm:ss"));
})
function queryDispatchingorder(currentdate) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/balanceSheet",
		data : {
			"method" : "queryCenterCriticalLoad",
			"type" : "mobile",
			"currentdate":currentdate
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var temp = $.parseJSON(data);

				for (var i = 1; i <= temp.length; i++) {

					var container = 'container' + i;
					var myChart = echarts.init(document
							.getElementById(container));
					var option1 = temp[i - 1];

					myChart.setOption(option1);

					var container1 = document.getElementById(container);
					var resizeWorldMapContainer = function() {
						container1.style.width = window.innerWidth * 1 / 3
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


function setTime(currentdate) {
	
	queryDispatchingorder(currentdate);
}
