$(function() {
	//com.leanway.checkSession();
	getChartByProductorId();
})



function getChartByProductorId(){
	//com.leanway.checkSession();
	showMask()
	var reg=/,$/gi;
	var info = "[";
	var date = new Date();
	var year = date.getFullYear();
	$("#year").val(year);
	var info = "[ ]";
	$('#countinfo').val(info);
	var form  = $("#chartForm").serializeArray();
	var formData = formatFormJson(form);
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/finishProductorsRate",
		data : {

			"method" : "queryChartByProductorId",
			 "formData":formData
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var temp = $.parseJSON(data);
			console.info(temp)
				FusionCharts.ready(function () {
					var analysisChart = new FusionCharts({
						type: 'mscolumn3dlinedy',
						renderAt: 'finishproductors-container',
						width:changeWidth("finishproductors-container"),
						height: changeHeigth(),
						dataFormat: 'json',
						dataSource:temp
					}).render();
					hideMask();
				});
		}
	});
}



var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(10/9)
	}else{
		width=$("#"+id).width()*(14/15)
	}

	return width;
}
function changeHeigth() {


	return width;
}

var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "countinfo"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
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