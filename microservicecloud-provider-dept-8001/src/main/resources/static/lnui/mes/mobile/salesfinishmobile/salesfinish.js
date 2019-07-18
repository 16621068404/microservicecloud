

$(function() {

	queryChartByYears();
})

function queryChartByYears(){

	var date = new Date();
	var year = date.getFullYear();

	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/salesfinish",
		data : {

			"method" : "queryChartByYears",
			year:year
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

				if(flag){
				var temp = $.parseJSON(data);
				if (temp.code==2) {
					lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","checkSession()");
				}else{
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'mscolumn3dlinedy',
							renderAt: 'salesfinish-container',
							width:changeWidth("box"),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
					});
				}
			}
		}
	});
}
var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(10/9)
	}else{
		width=$("#"+id).width()*(2/3)
	}

	return width;
}
function changeHeigth() {


	return width;
}

