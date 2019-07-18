$(function() {

	getChart();
	$("input[name=exceptionType]").click(function(){
		getChart();
	});
})
function getChart(){
	var top=$("#top").val();
	var exceptionType =  com.leanway.getDataTableCheckIds("exceptionType");
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionGroupReport",
		data : {

			"method" : "queryExceptionResource",
			"top":top,
			"exceptionType":exceptionType
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			
			var flag =  com.leanway.checkLogind(data);
			
			if(flag){
			
					var temp = $.parseJSON(data);
		            if(temp.status=="error"){
		                hideMask();
		                lwalert("tipModal",1,"查询失败");
		            }else{
						FusionCharts.ready(function () {
							var analysisChart = new FusionCharts({
								type: 'pie2d',
						        renderAt: 'chart-container',
						        width: changeWidth("chart-container"),
						        height: changeHeigth(),
								dataFormat: 'json',
								dataSource:temp.data
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
		width=$("#"+id).width()*(9/10)
	}else{
		width=$("#"+id).width()*(3/5)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}