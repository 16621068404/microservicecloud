$(function() {
	sessionJudge();
});

function sessionJudge(){
	selectCompanionAllList();
}

function salesChart(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var startCheckTime = year+"-"+month+"-01";
	end = parseInt(month)+1;
	var endCheckTime = year+"-"+end+"-01";
	
	var companionid= $("#companionid").val();
	$("#startCheckTime").val(startCheckTime);
	$("#endCheckTime").val(endCheckTime);
	if(startCheckTime==null||endCheckTime==null||companionid==null){
		lwalert("myModal",1 , "请验证填写不能为空！");
	}
	else{
		var form = $("#salesChartForm").serializeArray();
		var formData = formatFormJson(form);
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

				var temp = $.parseJSON(data);

				if (temp.code==2) {
					lwalert("myModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
				}else{
					FusionCharts.ready(function () {
						var ageGroupChart = new FusionCharts({
							type: 'pie3d',
							renderAt: 'chart-container',
							width: changeSize('chart-container'),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp

						}).render();
					});
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


function selectCompanionAllList(){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/business",
		data : {
			"method" : "selectCompanionAllList",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var temp = $.parseJSON(data);

			if (temp.code==2) {
				lwalert("myModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
			}else{
				var bunisscompany = temp.businessConditions;
				var html="";
				html +="<option value="+"123"+">"+"==请选择=="+"</option>";
				for (var i = 0;i<bunisscompany.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ bunisscompany[i].companionid+">"+ bunisscompany[i].companioname+"</option>";
				}
				$("#companionid").html(html);
			}
		}
	});
}


var width;
function changeSize(id) {

    width=$("#"+id).width()*(20/19)


    return width;
}
function changeHeigth() {


    return width;
}