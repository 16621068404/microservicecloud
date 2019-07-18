


$(function() {
	com.leanway.loadTags();

	initDate("#startCheckTime");
	initDate("#endCheckTime");

	// productionWorkCenterChart();

	//加载工作中心组
	loadWorkCenterGroup();
	//加载工作中心
	loadEquip();
});


function productionWorkCenterChart(){


	var form = $("#productionEquipForm").serializeArray();
	var formData = formatFormJson(form);

	var starttime=$("#startCheckTime").val();
	var endtime=$("#endCheckTime").val();
	var workshop=$("#workshop").val();
	var centerid=$("#centerid").val();

	if(starttime>endtime){
		lwalert("tipModal", 1,"开始时间不能大于结束时间！");
	}
	else if(centerid==null&&workshop==null){
		lwalert("tipModal", 1,"请在车间和设备之间至少选择一种进行查询！");
	}
	else{
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/productionEquip",
			data : {

				"method" : "queryProductionWorkCenterChartData",
				formData:formData

			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

				   var temp = $.parseJSON(data);
			       if (temp.code==1) {
						lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
					}else{
						FusionCharts.ready(function () {
							var analysisChart = new FusionCharts({
								type: 'stackedColumn3DLine',
								renderAt: 'workcenter-container',
								width: '500',
								height: '350',
								dataFormat: 'json',
								dataSource:temp
							}).render();
						});
					}

				}
			}
		});
	}

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
 * 加载工作中心中心组
 *
 *
 * */
function loadWorkCenterGroup(){

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

				var html="<option value=''>请选择</option>";

				for (var i = 0;i<workshopCenter.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ workshopCenter[i].groupid+">"+ workshopCenter[i].groupname+"</option>";
				}
				$("#workshop").html(html);

			}
		}
	});

}

/**
 *
 * 根据工作中心加载设备名称
 *
 * */
function loadEquip(){

	var groupid = $("#workshop").val();
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/workCenterGroup",
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
 * 工作中心组和工作中心互斥  不能同时选择
 *
 * */
function workshopJudge(){

	var workshop= $("#workshop").val();

	if("请选择"==workshop||null==workshop||" "==workshop){

		document.getElementById("centerid").disabled = false;

	}

}

function workshopFocus(){

	document.getElementById("centerid").disabled = true;

}


function equipmentJudge(){

	var centerid= $("#centerid").val();

	if("请选择"==centerid||null==centerid||" "==centerid){

		document.getElementById("workshop").disabled = false;

	}

}

function equipmentFocus(){

	document.getElementById("workshop").disabled = true;


}
