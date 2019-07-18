$(function() {

	initSelect2("#productorname",
			"../../../../"+ln_project+"/productorleadtime?method=queryProductorBySearch", "搜索产品");

	searchResult();

});


//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		allowClear: true,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 500,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

				  }
				};
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}
// 触发select2选择事件，给隐藏域赋值
$("#productorname").on("select2:select", function(e) {
	$("#productorid").val($(this).find("option:selected").val());
});

function searchResult(){

	var productorid = $("#productorid").val();

			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/productorleadtime",
				data : {
					"method" : "queryLeadTimeAndSumtime",
					"productorid" :productorid,
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						    var temp = $.parseJSON(data);
							if (temp.productorLeadTimeList.length==0) {
								lwalert("tipModal", 1,"无数据");
								$('#timeUtilizationRateCondition').empty();
							}else{
								viewtimeUtilizationRateCondition(temp.productorLeadTimeList);
							}
						}

				}
			});
		}


function viewtimeUtilizationRateCondition(tempData){

	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>产品编码</th>'+
		'<th>产品名称</th>'+
		'<th>产品提前期(分钟)</th>'+
		'<th>工艺路线总时间(分钟)</th>'+
		'<th>生产平均时间(分钟)</th>'+
		'</tr>';
	for(var j = 0; j <tempData.length ;j++){

			//显示的数据
			tempHtml += '<tr>'+
			'<td>' +tempData[j].productorname+'</td>'+
			'<td>' +tempData[j].shortname+'</td>'+
			'<td>' +tempData[j].leadtime+'</td>'+
			'<td>' +tempData[j].sumtime+'</td>'+
			'<td>' +tempData[j].averagetime+'</td>'+
			'</tr>';
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
