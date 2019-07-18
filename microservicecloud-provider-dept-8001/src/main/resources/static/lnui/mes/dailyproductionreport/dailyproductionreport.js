var condition = "";
$(function() {
	//初始化年份
	getYear();

	//初始化月份
	getMonth();

	//校验
	initBootstrapValidator();
	initDate("#adjuststarttime");
	initDate("#adjustendtime");

	var d = new Date();
	var date=d.getDate();
	if(date<10){
		date = "0"+date;
	}
	var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+date;

	$("#adjuststarttime").val(str);
	$("#adjustendtime").val(str);
	com.leanway.initSelect2("#companionid", "../../../../"+ln_project+"/business?method=queryCompanionBySelect2&contracttype=0", "搜索合作伙伴",true);
	com.leanway.initSelect2("#groupid", "../../../../"+ln_project+"/workCenterGroup?method=queryGroupBySelect", "搜索工作中心组",true);
	com.leanway.initSelect2("#centerid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=1", "搜索工作中心",true);
	com.leanway.initSelect2("#personcenterid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=2", "搜索人工工作中心",true);
	com.leanway.initSelect2("#equipmentid", "../../../../"+ln_project+"/workCenter?method=queryEquipment&type=1", "搜索设备台账",true);
	com.leanway.initSelect2("#productorid", "../../../../"+ln_project+"/productors?method=queryProductorBySearch&type=1", "搜索产成品",true);
	$("#countview").hide();

//	queryProductorNumber();
});
var getSearchConditions = function (  ) {

	var sqlJsonArray = new Array()

	var sqlJson = "";

	// 工作中心组
	var groupid = $("#groupid").val();
	if (groupid != null && groupid != "" && typeof(groupid) != "undefined" && groupid != undefined) {
		groupid = groupid.toString();
	}

	// 工作中心
	var centerid = $("#centerid").val();

	if (centerid != null && centerid != "" && typeof(centerid) != "undefined" && centerid != undefined) {
		centerid = centerid.toString();
	}

	// 人工工作中心
	var personcenterid = $("#personcenterid").val();

	if (personcenterid != null && personcenterid != "" && typeof(personcenterid) != "undefined" && personcenterid != undefined) {
		personcenterid = personcenterid.toString();
	}

	// 产成品
	var productorid = $("#productorid").val();

	if (productorid != null && productorid != "" && typeof(productorid) != "undefined" && productorid != undefined) {
		productorid = productorid.toString();
	}
	
	// 商业合作伙伴
	var companionid = $("#companionid").val();

	if (companionid != null && companionid != "" && typeof(companionid) != "undefined" && companionid != undefined) {
		companionid = companionid.toString();
	}
	// 商业合作伙伴
	var equipmentid = $("#equipmentid").val();

	if (equipmentid != null && equipmentid != "" && typeof(equipmentid) != "undefined" && equipmentid != undefined) {
		equipmentid = equipmentid.toString();
	}
	
	// 开始时间
	var adjustStartTime = $("#adjuststarttime").val();

	// 结束时间
	var adjustEndTime = $("#adjustendtime").val();
	if ($.trim(groupid) != "") {

		var searchNoObj = new Object();
		searchNoObj.fieldname = "pp.groupid";
		searchNoObj.fieldtype = "varchar_select2";
		searchNoObj.value = groupid;
		searchNoObj.logic = "and";
		searchNoObj.ope = "in";

		sqlJsonArray.push(searchNoObj);
	}

	if ($.trim(centerid) != "") {

		var centeridObj = new Object();
		centeridObj.fieldname = "dis.centerid";
		centeridObj.fieldtype = "varchar_select2";
		centeridObj.value = centerid;
		centeridObj.logic = "and";
		centeridObj.ope = "in";

		sqlJsonArray.push(centeridObj);
	}
	
	if ($.trim(personcenterid) != "") {
		var personcenteridObj = new Object();
		personcenteridObj.fieldname = "dis.personcenterid";
		personcenteridObj.fieldtype = "varchar_select2";
		personcenteridObj.value = personcenterid;
		personcenteridObj.logic = "and";
		personcenteridObj.ope = "in";

		sqlJsonArray.push(personcenteridObj);
	}
	
	if ($.trim(equipmentid) != "") {

		var equipmentidObj = new Object();
		equipmentidObj.fieldname = "dis.equipmentid";
		equipmentidObj.fieldtype = "varchar_select2";
		equipmentidObj.value = equipmentid;
		equipmentidObj.logic = "and";
		equipmentidObj.ope = "in";

		sqlJsonArray.push(equipmentidObj);
	}

	if ($.trim(productorid) != "") {

		var productoridObj = new Object();
		productoridObj.fieldname = "sd.productorid";
		productoridObj.fieldtype = "varchar_select2";
		productoridObj.value = productorid;
		productoridObj.logic = "and";
		productoridObj.ope = "in";

		sqlJsonArray.push(productoridObj);
	}

	
	if ($.trim(companionid) != "") {

		var companionidObj = new Object();
		companionidObj.fieldname = "so.companionid";
		companionidObj.fieldtype = "varchar_select2";
		companionidObj.value = companionid;
		companionidObj.logic = "and";
		companionidObj.ope = "in";

		sqlJsonArray.push(companionidObj);
	}

	if ($.trim(adjustStartTime) != "") {

		var adjustStartTimeObj = new Object();
		adjustStartTimeObj.fieldname = "dis.adjustendtime";
		adjustStartTimeObj.fieldtype = "datetime";
		adjustStartTimeObj.value = adjustStartTime;
		adjustStartTimeObj.logic = "and";
		adjustStartTimeObj.ope = ">=";

		sqlJsonArray.push(adjustStartTimeObj);
	}

	if ($.trim(adjustEndTime) != "") {

		var adjustEndTimeObj = new Object();
		adjustEndTimeObj.fieldname = "dis.adjustendtime";
		adjustEndTimeObj.fieldtype = "datetime";
		adjustEndTimeObj.value = adjustEndTime;
		adjustEndTimeObj.logic = "and";
		adjustEndTimeObj.ope = "<=";

		sqlJsonArray.push(adjustEndTimeObj);
	}
	var condition = new Object();
	condition.sqlDatas = sqlJsonArray;
	condition.adjustendtime = adjustEndTime;
	return condition;
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

function queryProductorNumber(){

	showMask();
	var searchCondition = getSearchConditions();
	var strCondition = $.trim(JSON.stringify(searchCondition));
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/dailyProductionReport",
		data : {
			"method" : "queryDispatchingProductor",
			"formData":strCondition,
			
		},
		dataType : "text",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);

					if (temp.dailyProductionReportList.length==0) {
						lwalert("tipModal", 1,"无数据");
						$('#passRateProductionsCondition').empty();
						hideMask();
					}else{
						if(temp.dailyProductionReportList.reportList!=undefined){
							viewPassRateProduction(temp);
							$("#rate").html("计划数："+temp.dailyProductionReportList.count+"&nbsp;&nbsp;已完成数："+temp.dailyProductionReportList.completecount+"&nbsp;&nbsp;未完成数："+temp.dailyProductionReportList.surplusnumber+"&nbsp;&nbsp;计划完成率："+temp.dailyProductionReportList.rate+"%");
							$("#countview").show();
						}	
						hideMask();
//						$("#progressBarDiv").css("width" , "100%");
//						var html="计划完成率："+temp.dailyProductionReportList.rate+"%&nbsp;&nbsp;计划数："+temp.dailyProductionReportList.count+"&nbsp;&nbsp;已完成数："+temp.dailyProductionReportList.completecount+"&nbsp;&nbsp;未完成数："+temp.dailyProductionReportList.surplusnumber;
//						$("#infolabel").html(html);
//						$("#progressDiv").show();
					}
			}
		}
	});
}
function downloadDailyProductionReport(){
	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	window.location.href = "../../../../"+ln_project+"/dailyProductionReport?method=downloadDailyProductionReport&formData=" + strCondition ;
}
function viewPassRateProduction(temp){
	var tempData = temp.dailyProductionReportList.reportList;
	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>生产流转卡号</th>'+
		'<th>工序名称</th>'+
		'<th>工序编号</th>'+
		'<th>查询号</th>'+
		'<th>子查询号</th>'+
		'<th>雇员</th>'+
		'<th>设备台账</th>'+	
		'<th>产成品名称（规格）</th>'+
		'<th>产品名称</th>'+
		'<th>产品编码</th>'+
		'<th>计划数</th>'+
		'<th>本日之前完工数</th>'+
		'<th>本日完工数</th>'+
		'<th>剩余数</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
		if(tempData[i].dispatchingstatus==2){
			tempHtml += '<tr bgcolor="#dd4b39">'
		}
		tempHtml +='<td>'+tempData[i].barcode +'</td>'+
		'<td>'+tempData[i].shortname +'</td>'+
		'<td>'+tempData[i].procedurename+'</td>'+
		'<td>'+tempData[i].productionsearchno+'</td>'+
		'<td>'+tempData[i].productionchildsearchno+'</td><td>';
		
		if(tempData[i].employeeList!=null){
			for(var j in tempData[i].employeeList){
				tempHtml+="<div>"+tempData[i].employeeList[j].name+"</div>"
			}
		}else{
			tempHtml+="&nbsp;";
		}
		
		tempHtml+='</td><td>'+(tempData[i].equipmentname||"")+'</td>'+
		'<td>'+tempData[i].pproductordesc+"("+tempData[i].material+')</td>'+
		'<td>'+tempData[i].shortname1 +'</td>'+
		'<td>'+tempData[i].productorname+'</td>'+
		'<td>'+tempData[i].number+'</td>'+
		'<td>'+tempData[i].beforecompletenumber+'</td>'+
		'<td>'+tempData[i].completenumber+'</td>'+
		'<td>'+tempData[i].remaincount+'</td>'+
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


