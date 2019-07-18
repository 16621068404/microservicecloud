

$(function() {

	//时间控件
	initTimePickYmd("startTime");
	initTimePickYmd("endTime");
	
	//解决时间控件与bootstrapvalidator的冲突
	$('#startTime').on('changeDate show', function(e) {  
        // Revalidate the date when user change it  
        $('#bottleneckConditionForm').bootstrapValidator('revalidateField', 'startTime');  
	});
	$('#endTime').on('changeDate show', function(e) {  
        // Revalidate the date when user change it  
        $('#bottleneckConditionForm').bootstrapValidator('revalidateField', 'endTime');  
	});
	//校验
	initBootstrapValidator();
	com.leanway.loadTags();

});

/**
 *
 * 校验数据
 *
 * */
//校验
function initBootstrapValidator() {
	$('#bottleneckConditionForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			productionorderid: {
				validators: {
					notEmpty: {},
				}
			},startTime: {
				validators: {
					notEmpty: {},
				}
			},endTime: {
				validators: {
					notEmpty: {},
				}
			}
		}
	});

}


/**
 *
 * 瓶颈设备生产状况表
 *
 * */
function searchBottleneckCondition(){

	$("#bottleneckConditionForm").data('bootstrapValidator').validate();

	if($('#bottleneckConditionForm').data('bootstrapValidator').isValid()){

		//var productionorderid= $("#productionorderid").val();
		var startTime= $("#startTime").val();
		var endTime= $("#endTime").val();

		if(startTime>endTime){

			lwalert("tipModal",1 , "开始时间不能大于结束时间！");

		}
		else{

			$.ajax ( {

				type : "post",
				url : "../../../"+ln_project+"/bottleneckequipment",

				data : {
					"method" : "queryBottleneckEquipment",
					//"productionorderid" :productionorderid,
					"starttime" : startTime,
					"endtime" : endTime
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);

                        if (tempData.code==1){
							lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
						}else{
							viewBottleneckEquipmentCodition(tempData.bottleneckEquipments);
						}
					}
				}
			});
		}
	}

}


/**
 *
 * 瓶颈设备生产月状况表
 *
 * 返回数据是  优先级  预期完成 				实际完成
 *
 * @return  prioritylevels,expectnumber,completenumber
 *
 * @serialData 2016-1-15
 *
 * @author 熊必强
 *
 * */
function viewBottleneckEquipmentCodition(tempData){

	var tempHtml = '';
	var viewBarColor="";
	var viewWordColor="";


	/**
	 *
	 * table的拼接
	 *
	 * */
	for(var i = 0; i < tempData.length; i ++){
		var count=tempData[i].count;
		var surplusnumber=tempData[i].count-tempData[i].surplusnumber;
		var persentCompare;
		if(surplusnumber==0){
			persentCompare="0%";
		}else{
			var a=surplusnumber/count;
			//小数化为百分数
			var b=a.toFixed(4);
			persentCompare=b*100+"%";
		}
		//定义优先级所显示的颜色
		if(tempData[i].prioritylevels==0){

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-danger' style='width: "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-red'>"+persentCompare+"</span>";

		}else if(tempData[i].prioritylevels==1){

			viewColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-yellow' style='width: "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-yellow'>"+persentCompare+"</span>";

		}else if(tempData[i].prioritylevels==2){

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-primary' style='width: "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-blue'>"+persentCompare+"</span>";

		}else{

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-success' style='width: "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-green'>"+persentCompare+"</span>";
		}

		//显示的数据
		tempHtml += '<tr>'+
		'<td>' +i+ '</td>'+
		'<td>' +tempData[i].equipmentname+'</td>'+
		'<td>' +tempData[i].serialnumber+'</td>'+
		'<td>' +tempData[i].productionnumber+'</td>'+
		'<td>'+viewBarColor+'</td>'+
		'<td>'+viewWordColor+'</td>'+
		'</tr>';
	}
	tempHtml += '</table>'

		$('#bodyBottleneckCondition').html(tempHtml);


}

