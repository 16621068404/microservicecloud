


$(function() {

	//加载工作中心
	loadCenter();

	//默认页面选择
	defaultSetting();
});

/*function productionMonthPlanChart(){

	var selectWeek=$("#selectWeek").val();
	var centerid=$("#centerid").val();
	if(null==selectWeek||"请选择"==centerid||""==selectWeek||" "==centerid){

		alert("查询条件不能为空！");

	}
	else {

		var form = $("#productionMonthPlanForm").serializeArray();
		var formData = formatFormJson(form);

		$.ajax ( {
			type : "post",
			url : "../../productionMonthPlan",
			data : {
				"method" : "queryMonthPlanChartData",
				"formData":formData
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var temp = $.parseJSON(data);

				FusionCharts.ready(function () {

					var analysisChart = new FusionCharts({

						type: 'stackedColumn3DLine',
						renderAt: 'chart-container',
						width: '500',
						height: '350',
						dataFormat: 'json',
						dataSource:temp

					}).render();
				});
			}
		});
	}
}*/

function productionMonthPlanChart(){

	if(theEndJudge()){//首先进行

		var form = $("#productionMonthPlanForm").serializeArray();
		var formData = formatFormJson(form);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/productionMonthPlan",
			data : {
				"method" : "queryMonthPlanChartData",
				"formData":formData
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var temp = $.parseJSON(data);
	                if(temp.code==1){
						lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
					}else{
						FusionCharts.ready(function () {

							var analysisChart = new FusionCharts({

								type: 'stackedColumn3DLine',
								renderAt: 'chart-container',
								width: '500',
								height: '350',
								dataFormat: 'json',
								dataSource:temp
							}).render();
						});
					}

				}
			},
			error : function ( data ) {
//				alert("error");
				lwalert("tipModal", 1,"error！");
			}
		});

	}


}

//最后判断
function theEndJudge(){

	var backBacklue;

	var centerid=$("#centerid").val();
	var selectWeekType=$("#selectWeekType").val();
	var selectWeek=$("#selectWeek").val();
	var selectWeekStartDay=$("#selectWeekStartDay").val();
	var selectWeekEndDay=$("#selectWeekEndDay").val();
	if("请选择"==centerid||" "==centerid){

//		alert("工作中心不能为空");
		lwalert("tipModal", 1,"工作中心不能为空！");
		backBacklue=0;
	}else if("1"==selectWeekType){
		if(" "==selectWeek||null==selectWeek||""==selectWeek){
//			alert("请选择传统周期区间");
			lwalert("tipModal", 1,"请选择传统周期区间！");
			backBacklue=0;
		}else backBacklue=1;
	}else if("2"==selectWeekType){
		if(" "==selectWeekStartDay&&" "==selectWeekEndDay||""==selectWeekStartDay&&""==selectWeekEndDay){
//			alert("请选择自定义周期");
			lwalert("tipModal", 1,"请选择自定义周期！");
			backBacklue=0;

		}else backBacklue=1;
	}else backBacklue=1;

	return backBacklue;

}

function selectWeekStartDayNext(){

	document.getElementById("selectWeekEndDay").value=null;
	document.getElementById("selectWeekEndDay").disabled=true;
}
function selectWeekEndDayNext(){

	document.getElementById("selectWeekStartDay").value=null;
	document.getElementById("selectWeekStartDay").disabled=true;
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

function loadCenter(){

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/badProductionReason",
		data : {
			"method" : "queryWorkCenter",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var center =json.workCenters;
				var html="<option value=' '>请选择</option>";

				for (var i = 0;i<center.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
				}
				$("#centerid").html(html);

			}
		}
	});


}

/**
 *
 * 选择周期类型
 *
 *
 */
function selectWeekTypeWay(){

	document.getElementById("selectWeekStartDay").disabled = true;
	document.getElementById("selectWeekEndDay").disabled = true;

}

function leaveSelectWeekTypeWay(){

	var selectWeekType=$("#selectWeekType").val();

	if(selectWeekType==1){

		defaultSetting();
		document.getElementById("selectWeekStartDay").value = null;
		document.getElementById("selectWeekEndDay").value = null;
	}else {
		document.getElementById("selectWeek").value = null;
		document.getElementById("selectWeek").disabled = true;
		document.getElementById("selectWeekStartDay").disabled = false;
		document.getElementById("selectWeekEndDay").disabled = false;
	}

}

function  defaultSetting(){

	document.getElementById("selectWeek").disabled = false;
	document.getElementById("selectWeekStartDay").disabled = true;
	document.getElementById("selectWeekEndDay").disabled = true;

}