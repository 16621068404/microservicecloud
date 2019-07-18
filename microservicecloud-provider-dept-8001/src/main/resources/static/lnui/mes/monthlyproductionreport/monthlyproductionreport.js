$(function() {
	//初始化年份
	getYear();

	//初始化月份
	getMonth();

	//校验
	initBootstrapValidator();

	queryProductorNumber();

});


function queryProductorNumber(){

	showMask();
	var year = $("#year").val();
	var month = $("#month").val();

	var form = $("#salesChartForm").serializeArray();
	var formData = formatFormJson(form);

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/monthlyProductionReport",
		data : {
			"method" : "queryProductorNumber",
			"formData":formData
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);

					if (temp.monthlyProductionReportList.length==0) {
						lwalert("tipModal", 1,"无数据");
						$('#passRateProductionsCondition').empty();

						hideMask();
					}else{
						viewPassRateProduction(temp.monthlyProductionReportList);
					}
			}
		}
	});
}

function viewPassRateProduction(tempData){


	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>产品名称</th>'+
		'<th>产品编码</th>'+
		'<th>期初数</th>'+
		'<th>投入数</th>'+
		'<th>产出数</th>'+
		'<th>期末数</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){

		tempHtml += '<tr>'+
		'<td>'+tempData[i].shortname +'</td>'+
		'<td>'+tempData[i].productorname+'</td>'+
		'<td>'+tempData[i].initialnumber+'</td>'+
		'<td>'+tempData[i].number+'</td>'+
		'<td>'+tempData[i].completenumber+'</td>'+
		'<td>'+tempData[i].endingnumber+'</td>'+
		'</tr>';
	}

	$('#passRateProductionsCondition').html(tempHtml);

	hideMask();
}

var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

//校验
function initBootstrapValidator() {
	$('#salesChartForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			isorno: {
				validators: {
					notEmpty: {},
				}
			}
		}
	});

}

function getYear(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=year;i>year-16;i--){

		html += "<option value=" + i + ">" + i
		+ "</option>";
	}

	$("#year").html(html);
	return
}

function getMonth(){
	var date = new Date();
	var month = date.getMonth();
	$("#month").val(month+1);
	return
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

