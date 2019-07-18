


$(function() {

	queryWorkCenterGroup();
	//加载工作中心
	//loadCenter();
	$("#centerid").prop("disabled", true);
	com.leanway.loadTags();
	resetForm();
//	resetButton();
});


function badProductionReasonChart(){
	if(!pageJudge()){
		//TODO 不能跳转
	}else{
		var form = $("#badProductionReasonForm").serializeArray();
		var formData = formatFormJson(form);

		//alert(formData)
		$.ajax ( {
			type : "post",
			url : "../../../"+ln_project+"/badProductionReason",
			data : {
				"method" : "queryBadProductionReasonData",
				"formData":formData
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var temp = $.parseJSON(data);
					//清空数据
//					resetForm();
					//重置按钮
//					resetButton();
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'mscolumn3d',
							renderAt: 'chart-container',
							width: '600',
							height: '450',
							dataFormat: 'json',
							dataSource:temp
						}).render();
					});

				}
			}
		});
	}
}


function pageJudge(){
	var backValue;
	var selectMonth=$("#selectMonth").val();
	var centerid=$("#centerid").val();
	var selectMonthStartDay=$("#selectMonthStartDay").val();
	var selectMonthEndDay=$("#selectMonthEndDay").val();
	if (centerid==" "||centerid==null||centerid=="") {
		lwalert("tipModal", 1,"查询工作中心不能为空");
	}else if(selectMonth==null||selectMonth==""){
		if(selectMonthStartDay==""&&selectMonthEndDay==""){
			lwalert("tipModal", 1,"查询时间不能为空");
			backValue=false;
		}
		else{
			backValue = true;
		}
	}else{
		backValue=true;
	}
	return backValue;
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


/**
 *
 */
function selectWorkCenetr(){
	 var groupid = $("#groupid").val()
	 $("#centerid").prop("disabled", false);
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/badProductionReason",
		data : {
			"method" : "queryWorkCenter",
			"groupid" : groupid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			var json = eval("(" + data + ")")

				var center = json.workCenters;
				var html="<option value=' '>请选择</option>";

				for (var i = 0;i<center.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ center[i].centerid+">"+ center[i].centername+"("+center[i].shorname+")</option>";
				}
				$("#centerid").html(html);
			}
		}
	});
}
/**
 *
 * 工作中心的拼接
 *
 * */
//function loadCenter(){
//
//	$.ajax ( {
//		type : "post",
//		url : "../../badProductionReason",
//		data : {
//			"method" : "queryWorkCenter",
//		},
//		dataType : "text",
//		async : false,
//		success : function ( data ) {
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if(flag){
//
//			var json = eval("(" + data + ")")
//
//				var center = json.workCenters;
//				var html="<option value=' '>请选择</option>";
//
//				for (var i = 0;i<center.length;i++) {
//					/**
//					 * option 的拼接
//					 * */
//					html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
//				}
//				$("#centerid").html(html);
//			}
//		}
//	});
//
//}


//选中传统月份时  自定义不可选
function monthAbnormal(){

	document.getElementById("selectMonthStartDay").disabled = true;
	document.getElementById("selectMonthEndDay").disabled = true;

}

//选中起始的月份
function selectMonthStartDayNext(){

	document.getElementById("selectMonthEndDay").disabled = true;
	document.getElementById("selectMonth").disabled = true;

}

//选中结束的月份
function selectMonthEndDayNext(){

	document.getElementById("selectMonthStartDay").disabled = true;
	document.getElementById("selectMonth").disabled = true;

}


/**
 *
 * 加载工作中心
 *
 *
 * */
function queryWorkCenterGroup(){

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/workCenter",
		data : {
			"method" : "queryWorkCenterGroupList",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var workshopCenter=json.workCenterGroupResult;

				var html="<option value=' '>请选择</option>";

				for (var i = 0;i<workshopCenter.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ workshopCenter[i].groupid+">"+ workshopCenter[i].groupname+"</option>";
				}
				$("#groupid").html(html);

			}
		}
	});

}


/**
 * 重置表单
 *
 */
var resetForm = function() {
	$("#selectMonth").val("");
	$("#selectMonthStartDay").val("");
	$("#selectMonthEndDay").val("");
}

var resetButton = function() {
	document.getElementById("selectMonthEndDay").disabled = false;
	document.getElementById("selectMonth").disabled = false;
	document.getElementById("selectMonthStartDay").disabled = false;
}