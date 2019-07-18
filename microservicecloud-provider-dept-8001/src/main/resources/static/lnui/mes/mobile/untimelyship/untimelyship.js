

$(function() {
	initBootstrapValidator();
	com.leanway.enterKeyDown("year", queryRate);
	com.leanway.enterKeyDown("day", queryRate);
	queryRate();
})


//填写数据验证
function initBootstrapValidator() {

	$('#chartForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					day : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},


				}
});

}



function queryRate(){
	var year = $("#year").val();
	var day = $("#day").val();

	$("#chartForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#chartForm').data('bootstrapValidator').isValid()) { //
	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/untimelyShip",
		data : {

			 "method" : "queryChartByYears",
			 day:day
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var temp = $.parseJSON(data);

				FusionCharts.ready(function () {
					var analysisChart = new FusionCharts({
						type: 'mscolumn3dlinedy',
						renderAt: 'untimelyship-container',
						width:changeWidth("box"),
						height: changeHeigth(),
						dataFormat: 'json',
						dataSource:temp
					}).render();
				});
		}
	});
	}
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
