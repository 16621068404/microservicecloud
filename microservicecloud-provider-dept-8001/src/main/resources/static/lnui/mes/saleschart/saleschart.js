$(function() {
	//时间初始化
	initTimePickYmd("startCheckTime");
	initTimePickYmd("endCheckTime");

	//客户的select2
	//initSelect2("#companionid", "../../salesChart?method=queryCompanion", "请输入客户名称");
	sessionJudge();

	//salesChart();

	//校验
	//initBootstrapValidator();

});

function sessionJudge(){
	//初始化公司-select2
	com.leanway.initSelect2("#companionid", "../../../../"+ln_project+"/business?method=queryCompanionBySelect2", "搜索合作伙伴");
}

function salesChart(){

	var startCheckTime= $("#startCheckTime").val();
	var endCheckTime= $("#endCheckTime").val();
	var companionid= $("#companionid").val();

	if(startCheckTime==null||endCheckTime==null||companionid==null){
		lwalert("tipModal",1 , "查询条件不能为空！");
	}
	else{
	//$("#salesChartForm").data('bootstrapValidator').validate();

//	if($('#salesChartForm').data('bootstrapValidator').isValid()){


	    showMask('mask');
		var form = $("#salesChartForm").serializeArray();
		var formData = formatFormJson(form);


	//	var startCheckTime= $("#startCheckTime").val();
	//	var endCheckTime= $("#endCheckTime").val();
		if(startCheckTime>endCheckTime){
			lwalert("tipModal",1 , "开始时间不能大于结束时间！");

		}else{

			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/salesChart",
				data : {
					"method" : "querySalesChartData",
					"formData":formData
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){


					    var temp = $.parseJSON(data);

						FusionCharts.ready(function () {
							var ageGroupChart = new FusionCharts({
								type: 'pie3d',
								renderAt: 'chart-container',
								width: '600',
								height: '450',
								dataFormat: 'json',
								dataSource:temp

							}).render();
							 hideMask('mask');
						});
					}
				}
			});
		}
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
			},companionid: {
				validators: {
					notEmpty: {},
				}
			}
		}
	});

}
