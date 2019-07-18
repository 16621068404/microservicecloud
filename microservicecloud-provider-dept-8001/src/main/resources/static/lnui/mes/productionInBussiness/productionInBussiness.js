

$(function() {

	com.leanway.loadTags();

	//加载车间
	//loadCenter();
	loadWorkCenter();
	//页面设置只读
	pageDisabled("productionInBussinessForm");

	//初始化页面
	initPage();

	resetForm();
});

/**
 *
 * 生产在制品计划匹配表
 *
 * 获取内部数据的方法
 *
 * */
function getneedAndUnneedChartData(){
	if(theEndJudge()){
		var form = $("#productionInBussinessForm").serializeArray();
		var formData = formatFormJson(form);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/productionInBussiness",
			data : {
				"method" : "queryNeedAndUnneedData",
				"formData":formData
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

		            var temp = $.parseJSON(data);
		            //清空数据
		            resetForm();
					//需求和非需求对比图
					needAndUnneedChart(temp.productionInBussinessCompare);
					//实际需求表
					needChart(temp.productionInBussinessInRealNeed);
					//非需求表
					unneedChart(temp.productionInBussinessNotInNeed);
				}
			}
		});
	}
}

//最后判断
function theEndJudge(){
	var backBackValue=0;
	var workRange=$("#workRange").val();
	if("2"==workRange){
		if(judgeWorkRange()){
			if (transitionFunction()){
				backBackValue=1;
			}
		}
	}else if (transitionFunction()){
		backBackValue=1;
	}

	return backBackValue;

}

function transitionFunction(){
	var selectWay=$("#selectWay").val();
	var backBackValue=0;
	if("1"==selectWay){
		if(judgeEndWeek()){
			backBackValue=1;
		}
	}else if("2"==selectWay){
		if(judgeEndMonth()){
			backBackValue=1;
		}
	}else alert("请选择查询方式");
	return backBackValue;
}

//最后的工作中心判断
//function judgeWorkRange(){
//	var backValue=0;
//	var centerid=$("#centerid").val();
//	if("请选择"==centerid||" "==centerid){
//		alert("工作中心不能为空");
//	}else backValue=1;
//
//	return backValue;
//}

//最后的周判断
function judgeEndWeek(){
	var backValue=0;
	var selectWeek=$("#selectWeek").val();
	var selectWeekStartDay=$("#selectWeekStartDay").val();
	var selectWeekEndDay=$("#selectWeekEndDay").val();
	if(selectWeek==""&&selectWeekStartDay==""&&selectWeekEndDay==""){
		alert("请选择周期日期");
	}else backValue=1;

	return backValue;
}

//最后的月份判断
function judgeEndMonth(){
	var backValue=0;
	var selectMonth=$("#selectMonth").val();
	var selectMonthStartDay=$("#selectMonthStartDay").val();
	var selectMonthEndDay=$("#selectMonthEndDay").val();
	if(selectMonth==""&&selectMonthStartDay==""&&selectMonthEndDay==""){
		alert("请选择月份日期");
	}else backValue=1;
	return backValue;
}

//需求与非需求对比图
function needAndUnneedChart(temp){
	FusionCharts.ready(function () {
		var ageGroupChart = new FusionCharts({
			type: 'pie3d',
			renderAt: 'chart-container',
			width: '600',
			height: '450',
			dataFormat: 'json',
			dataSource:temp

		}).render();
	});
}

//需求相关表
function needChart(temp){
	FusionCharts.ready(function () {
		var ageGroupChart = new FusionCharts({
			type: 'bar3d',
			renderAt: 'chart-container2',
			width: '450',
			height: '300',
			dataFormat: 'json',
			dataSource:temp

		}).render();
	});
}

//非需求相关表
function unneedChart(temp){
	FusionCharts.ready(function () {
		var ageGroupChart = new FusionCharts({
			type: 'bar3d',
			renderAt: 'chart-container3',
			width: '450',
			height: '300',
			dataFormat: 'json',
			dataSource:temp

		}).render();
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
//		url : "../../workCenter",
//		data : {
//			"method" : "queryWorkCenterList",
//		},
//		dataType : "text",
//		async : false,
//		success : function ( data ) {
//
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if(flag){
//			    var json = eval("(" + data + ")")
//
//				var center=json.data;
//
//				var html="<option>请选择</option>";
//
//				for (var i = 0;i<center.length;i++) {
//					/**
//					 * option 的拼接
//					 * */
//					html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
//				}
//				$("#centerid").html(html);
//
//			}
//
//		}
//	});
//
//}

/**
 *
 * json数据的转化
 *
 * */
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

//初始化时间
function initDate(id) {
	$(id).datetimepicker({
		 language:  'zh-CN',
		    weekStart: 7,
		    todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			format: 'yyyy-mm-dd'
	});
}



/**
 *
 * 前台数据的判断
 *
 *
 * */
function selectMonthOrWeek(){

	var selectWay=$("#selectWay").val();
	if("1"==selectWay){
		monthReadOnly();
		document.getElementById("selectWeek").disabled = false;
		document.getElementById("selectWeekStartDay").disabled = false;
		document.getElementById("selectWeekEndDay").disabled= false;

	}else if("2"==selectWay){

		weekReadOnly();
		document.getElementById("selectMonth").disabled = false;
		document.getElementById("selectMonthStartDay").disabled = false;
		document.getElementById("selectMonthEndDay").disabled  = false;

	}else{

		weekReadOnly();
		monthReadOnly();

	}

}

//周期可选
function weekReadOnly(){

	document.getElementById("selectWeek").disabled = true;
	document.getElementById("selectWeekStartDay").disabled = true;
	document.getElementById("selectWeekEndDay").disabled = true;
}

//月份可选
function monthReadOnly(){

	document.getElementById("selectMonth").disabled = true;
	document.getElementById("selectMonthStartDay").disabled = true;
	document.getElementById("selectMonthEndDay").disabled = true;
}




//查询范围
function selectworkRange(){

		 var groupid = $("#groupid").val()

		 $("#centerid").prop("disabled", false);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/workCenterGroup",
			data : {
				"method" : "queryWorkCenterGroupObject",
				"groupid" : groupid,
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

				var json = eval("(" + data + ")")

					var center = json.workCenterList;
					var html="<option value=''>请选择</option>";

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
 * 页面的初始化
 *
 * */
function initPage(){

	document.getElementById("selectWay").disabled = false;
	document.getElementById("groupid").disabled = false;
}


// 选中起始的月份
function selectMonthStartDayNext(){

	document.getElementById("selectMonthEndDay").disabled = true;
	document.getElementById("selectMonth").disabled = true;

}

//选中结束的月份
function selectMonthEndDayNext(){

	document.getElementById("selectMonthStartDay").disabled = true;
	document.getElementById("selectMonth").disabled = true;

}

//选中起始的周期
function selectWeekStartDayNext(){
	document.getElementById("selectWeek").disabled = true;
	document.getElementById("selectWeekEndDay").disabled = true;
}

//选中结束的周期
function selectWeekEndDayNext(){

	document.getElementById("selectWeek").disabled = true;
	document.getElementById("selectWeekStartDay").disabled = true;

}

//选中传统周期时  自定义不可选
function weekAbnormal(){

	document.getElementById("selectWeekStartDay").disabled = true;
	document.getElementById("selectWeekEndDay").disabled = true;

}

//选中传统月份时  自定义不可选
function monthAbnormal(){

	document.getElementById("selectMonthStartDay").disabled = true;
	document.getElementById("selectMonthEndDay").disabled = true;

}

/**
 *
 * 页面disabled
 *
 * */
var pageDisabled = function(form, obj) {

	var formArray = form.split(",");

	if (formArray.length > 0) {

		for (var i = 0; i < formArray.length; i++) {
			// input 标签
			$("#" + formArray[i] + " input").prop("disabled", true);
			// select 标签
			$("#" + formArray[i] + " select").prop("disabled", true);
		}

	}

	if (obj != undefined && typeof (obj) != "undefined") {

		for (var i = 0; i < obj.length; i++) {

			if (obj[i].type == "input" || obj[i].type == "textarea") {

				$("#" + obj[i].id).prop("readonly", true);

			} else if (obj[i].type == "button" || obj[i].type == "select") {

				$("#" + obj[i].id).prop("disabled", true);

			}
		}
	}

}
/**
 *
 * 加载工作中心中心组
 *
 *
 * */
function loadWorkCenter(){

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/workCenter",
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

			    var html="<option value=''>请选择</option>";

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
	$("#selectWeek").val("");
	$("#selectWeekStartDay").val("");
	$("#selectWeekEndDay").val("");
	$("#selectMonth").val("");
	$("#selectMonthStartDay").val("");
	$("#selectMonthEndDay").val("");
}