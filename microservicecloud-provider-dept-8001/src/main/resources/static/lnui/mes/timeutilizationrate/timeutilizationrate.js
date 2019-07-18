$(function() {

	//加载工作中心组
	loadGroupid();

	//校验
	initBootstrapValidator();

	initTimePickYmd("startCheckTime");
	initTimePickYmd("endCheckTime");
	$("#startCheckTime").val("");
	$("#endCheckTime").val("");
});

function timeUtilizationRate(){

	var startCheckTime= $("#startCheckTime").val();
	var endCheckTime= $("#endCheckTime").val();
	var groupid= $("#groupid").val();
	if(startCheckTime==""||endCheckTime==""){
		lwalert("tipModal",1 , "请验证填写不能为空！");
	}
	else{
		if(startCheckTime>endCheckTime){
			lwalert("tipModal",1 , "开始时间不能大于结束时间！");

		}else{
			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/workcenterproduction",
				data : {
					"method" : "timeUtilizationRateCondition",
					"startCheckTime" :startCheckTime,
					"endCheckTime" :endCheckTime,
					"groupid" :groupid,
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
							if (temp.bWorkCenterProduction.length==0) {
								lwalert("tipModal", 1,"无数据");
								$('#timeUtilizationRateCondition').empty();
							}else{
								viewtimeUtilizationRateCondition(temp.bWorkCenterProduction);
							}
						}

					}
				}
			});
		}
	}
}

function viewtimeUtilizationRateCondition(tempData){
	var startCheckTime= $("#startCheckTime").val();
	var date  = new Date(startCheckTime);
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>工作中心</th>'+
		'<th>台账</th>'+
		'<th>最大时间(小时)</th>'+
		'<th>停机时间(小时)</th>'+
		'<th>负荷时间(小时)</th>'+
		'<th>停止时间(小时)</th>'+
		'<th>稼动时间(小时)</th>'+
		'<th>稼动率</th>'+
		'</tr>';
	for(var j = 0; j <tempData.length ;j++){
		if(month==12){
			tempHtml +=//'<table>'+
				'<tr>'+
				'<td align="center" colspan="8"><strong>' +year+"-"+(month)+'月</strong></td>'+
				'</tr>';
		}else{
			tempHtml +=//'<table>'+
				'<tr>'+
				'<td align="center" colspan="8"><strong>' +year+"-"+(month%12)+'月</strong></td>'+
				'</tr>';
		}
		for(var i = 0; i < tempData[j].length; i ++){
			//显示的数据
			tempHtml += '<tr>'+
			'<td>' +tempData[j][i].centername+'</td>'+
			'<td>' +tempData[j][i].equipmentname+'</td>'+
			'<td>' +tempData[j][i].thebigtime+'</td>'+
			'<td>' +tempData[j][i].resttime+'</td>'+
			'<td>' +tempData[j][i].chargetime+'</td>'+
			'<td>' +tempData[j][i].shutdowntime+'</td>'+
			'<td>' +tempData[j][i].activetime+'</td>'+
			'<td>' +tempData[j][i].rate+'</td>'+
			'</tr>';
		}
		month++;
		if(month>12){
			month = month -12;
			year++;
		}
	}
	$('#timeUtilizationRateCondition').html(tempHtml);
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


function loadGroupid(){
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workcenterproduction?method=queryWorkCenterGroupList",
		dataType : "json",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				var html="";
				for(var i=0;i<text.data.length;i++){

					html += "<option value=" + text.data[i].groupid + ">" + text.data[i].groupname
					+ "</option>";
				}

				$("#groupid").html(html);
			}
		}
	});
}
