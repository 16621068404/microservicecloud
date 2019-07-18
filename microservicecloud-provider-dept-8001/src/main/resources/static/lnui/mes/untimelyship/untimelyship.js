

$(function() {

	initBootstrapValidator();
	com.leanway.enterKeyDown("year", queryRate);
	com.leanway.enterKeyDown("day", queryRate);
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
					year : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.year,
									com.leanway.reg.msg.year)
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
			 year:year,
			 day:day
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);
			
			if(flag){
			
				var temp = $.parseJSON(data);
				showMask();
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'mscolumn3dlinedy',
							renderAt: 'untimelyship-container',
							width:changeWidth("untimelyship-container"),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
						hideMask();
					});
				
			}
		}
	});
	}
}
var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(9/10)
	}else{
		width=$("#"+id).width()*(2/3)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }
