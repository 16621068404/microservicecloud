$(function() {
	//时间初始化
	initDateTimeYmdHms("startCheckTime");
	initDateTimeYmdHms("endCheckTime");

	//客户的select2
	//initSelect2("#companionid", "../../salesChart?method=queryCompanion", "请输入客户名称");

	loadGroup();
	//校验
	initBootstrapValidator();

	//为显示好看  按钮隐藏
	$("#printbarcodebutton").hide();

});


function loadGroup(){

	var year= $("#year").val();

	var form = $("#salesChartForm").serializeArray();
	var formData = formatFormJson(form);

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/workCenterGroup",
		data : {
			"method" : "queryWorkCenterGroupList",
			"formData":formData
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);

			    if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					var group = temp.data;
					var html="";

					for (var i = 0;i<group.length;i++) {
						/**
						 * option 的拼接
						 * */
						html +="<option value="+ group[i].groupid+">"+ group[i].groupname+"</option>";
					}
					$("#groupid").html(html);
				}

			}
		}
	});
}


function loadWorkcenter(){

	var groupid= $("#groupid").val();
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

				var temp = $.parseJSON(data);
				if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					var center = temp.workCenterList;
					var html="";
					for (var i = 0;i<center.length;i++) {
						/**
						 * option 的拼接
						 * */
						html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
					}
					$("#centerid").html(html);
				}
			}
		}
	});
}

function loadEquipment(){

	var centerid= $("#centerid").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			"method" : "queryWorkCenterObject",
			"centerid" : centerid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
				 if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					var equipmentLegerList = temp.equipmentLegerList;
					var html="";
					for (var i = 0;i<equipmentLegerList.length;i++) {
						/**
						 * option 的拼接
						 * */
						html +="<option value="+ equipmentLegerList[i].equipmentid+">"+ equipmentLegerList[i].equipmentname+"</option>";
					}
					$("#equipmentid").html(html);
				}
			}
		}
	});
}

function equipmenReport(){

	var equipmentid= $("#equipmentid").val();
	var time= $("#time").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/equipmenReport",
		data : {
			"method" : "equipmentreport",
			"equipmentid" : equipmentid,
			"time" : time,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);

				 if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					if (temp.equipmenReports.length==0&&temp.equipmenReportsTrack==0) {
						lwalert("tipModal", 1,"无数据,请重新检查查询条件");
						$('#equipmenReportsCondition').empty();
						$('#equipmenReportsTrackCondition').empty();
						$("#printbarcodebutton").hide();
					}else{
						viewEquipmenReportsCondition(temp.equipmenReports);
						viewEquipmenReportsTrackCondition(temp.equipmenReportsTrack);
						$("#printbarcodebutton").show();
					}
				}

			}
		}
	});
}

function viewEquipmenReportsTrackCondition(tempData){

	var equipmentname = $("#equipmentid").find("option:selected").text();
	var time = $("#time").val();
	var middletime= time.split('-');
	var viewtime = middletime[0]+"年"+middletime[1]+"月"+middletime[2]+"日";
	var tempHtml = '';

	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th colspan="3">设备名称：' +equipmentname+'</th>'+
		'<th ></th>'+
		'<td></td>'+
		'<td></td>'+
		'<td></td>'+
		'<td></td>'+
		'<td></td>'+
		'<th colspan="2">' +viewtime+'</th>'+
		'</tr>'+

		'<tr>'+
		'<th>合同号</th>'+
		'<th>生产查询号</th>'+
		'<th>产品编码</th>'+
		'<th>短名</th>'+
		'<th>单位</th>'+
		'<th>规格</th>'+
		'<th>开始时间</th>'+
		'<th>结束时间</th>'+
		'<th>合格数</th>'+
		'<th>不合格数</th>'+
		'<th>原因</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
		if(tempData[i].unqualifiedreason==null){
			tempData[i].unqualifiedreason="";
		}
		if(tempData[i].contractno==null){
			tempData[i].contractno="";
		}
		if(tempData[i].unqualifiedcount==null||tempData[i].unqualifiedcount==0){
			tempData[i].unqualifiedcount="";
		}
		var starttime =tempData[i].starttime;
		var endtime =tempData[i].endtime;
		var start= starttime.split(' ');
		var end= endtime.split(' ');
		var getstartdate =start[1];
		var getenddate =end[1];
		//显示的数据
			tempHtml += '<tr>'+
			'<td>' +tempData[i].contractno+'</td>'+
			'<td>' +tempData[i].productionchildsearchno+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>' +tempData[i].shortname+'</td>'+
			'<td>' +tempData[i].unitsname+'</td>'+
			'<td>' +tempData[i].specification+'</td>'+
			'<td>' +getstartdate+'</td>'+
			'<td>' +getenddate+'</td>'+
			'<td>' +tempData[i].qualifiedcount+'</td>'+
			'<td>' +tempData[i].unqualifiedcount+'</td>'+
			'<td>'+tempData[i].unqualifiedreason+'</td>'+
			'</tr>';
	}

	$('#equipmenReportsTrackCondition').html(tempHtml);
}

function viewEquipmenReportsCondition(tempData){


	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
//		'<th> 设备名称</th>'+
		'<th>停机开始时间</th>'+
		'<th>停机结束时间</th>'+
		'<th>停机原因</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
		var starttime =tempData[i].starttime;
		var endtime =tempData[i].endtime;
		var start= starttime.split(' ');
		var end= endtime.split(' ');
		var getstartdate =start[1];
		var getenddate =end[1];
		//显示的数据
			tempHtml += '<tr>'+
//			'<td>' +tempData[i].equipmentname+'</td>'+
			'<td>' +getstartdate+'</td>'+
			'<td>' +getenddate+'</td>'+
			'<td>'+tempData[i].reasoncode+'</td>'+
			'</tr>';
	}

	$('#equipmenReportsCondition').html(tempHtml);
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
			startCheckTime: {
				validators: {
					notEmpty: {},
				}
			},endCheckTime: {
				validators: {
					notEmpty: {},
				}
			},isorno: {
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

//打印机打印
function printBarcode(){
	retainAttr=true;
	$("#printarea").printArea();
}
