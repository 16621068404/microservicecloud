

$(function() {

	initBootstrapValidator();
	com.leanway.enterKeyDown("year", queryChartByYears);
})

//填写数据验证
function initBootstrapValidator() {

	$('#chartForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
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


function queryChartByYears(){

	showMask();
	var year = $("#year").val();

	$("#chartForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#chartForm').data('bootstrapValidator').isValid()) {

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
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'mscolumn3dlinedy',
							renderAt: 'salesfinish-container',
							width:changeWidth("salesfinish-container"),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
						hideMask();
					});

			}
		},
		error : function(data) {
		}
	});
	}else{
		hideMask();
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

